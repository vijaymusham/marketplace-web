"use client";

import { useState } from "react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import SubcategoryTabs from "@/components/category-ui/SubcategoryTabs";
import PaginatedListings from "@/components/category-ui/PaginatedListings";
import SubcategoryBrowse from "@/components/category-ui/SubcategoryBrowse";
import SelectDropdown from "@/components/sell-drawer/SelectDropdown";
import { getCategories, getCategoriesAds } from "@/components/api/apis";
import type { ApiAd, ApiCategoryAds } from "@/components/types/AllTypes";
import {
    findApiRoute,
    normalizeApiCategories,
} from "@/lib/apiCategories";
import { listings, type Listing } from "@/lib/listings";
import { findRouteBySlug } from "@/lib/slug";
import { CategoryPageSkeleton, Skeleton } from "@/components/ui/Skeleton";

const DEFAULT_COORDS = { latitude: 19.2183, longitude: 72.9781 };

const SORT_OPTIONS = [
    { value: "date", label: "Date" },
    { value: "relevance", label: "Relevance" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function buildListings(seed: string, count = 60): Listing[] {
    return Array.from({ length: count }, (_, i) => {
        const base = listings[i % listings.length];
        return {
            ...base,
            id: i + 1,
            image: `${base.image.split("?")[0]}?lock=${seed.length * 100 + i}`,
        };
    });
}

function adsFromResponse(payload: ApiCategoryAds | { items?: ApiAd[] } | null | undefined): ApiAd[] {
    if (!payload) return [];
    if ("items" in payload && Array.isArray(payload.items)) return payload.items;
    if ("data" in payload && Array.isArray(payload.data?.items)) return payload.data.items;
    return [];
}

export default function CategoryPage() {
    const params = useParams<{ slug: string }>();
    const searchParams = useSearchParams();
    const slug = String(params.slug ?? "");
    const categoryIdParam = searchParams.get("categoryId") ?? "";
    const subcategoryIdParam = searchParams.get("subcategoryId") ?? "";
    const [sort, setSort] = useState<SortValue>("date");

    const { data: apiCategories, isFetched } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const normalized = normalizeApiCategories(apiCategories);
    const staticMatch = findRouteBySlug(slug);
    const apiMatch = findApiRoute(normalized, slug, {
        categoryId: categoryIdParam,
        subcategoryId: subcategoryIdParam,
    });
    // Prefer API so new API-only subcategories (e.g. Footwear) resolve correctly.
    const match = apiMatch ?? staticMatch;

    const resolvedCategoryId =
        categoryIdParam || apiMatch?.categoryId || "";
    const resolvedSubCategoryId =
        subcategoryIdParam ||
        (apiMatch?.type === "subcategory" ? apiMatch.subcategoryId : "") ||
        "";

    const { data: categoryAds, isPending: isAdsPending, isFetching: isAdsFetching } = useQuery({
        queryKey: ["categoryAds", resolvedCategoryId, sort],
        queryFn: () =>
            getCategoriesAds({
                ...DEFAULT_COORDS,
                page: 1,
                sort,
                categoryId: resolvedCategoryId,
            }),
        enabled: Boolean(resolvedCategoryId) && match?.type === "category",
    });

    if (!match) {
        if (!isFetched) {
            return <CategoryPageSkeleton />;
        }
        notFound();
    }

    if (match.type === "category") {
        const { category } = match;
        const ads = adsFromResponse(categoryAds ?? null);
        const showAdsSkeleton =
            Boolean(resolvedCategoryId) &&
            (isAdsPending || (isAdsFetching && ads.length === 0));

        return (
            <>
                <SubcategoryTabs
                    categoryName={category.name}
                    activeSubcategory=""
                />
                <main className="flex-1 bg-white">
                    <div className="mx-auto px-4 py-8 sm:px-6 md:py-10 lg:px-12">
                        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between md:mb-9">
                            <div className="min-w-0 flex-1">
                                <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                                    {category.name} for Sale
                                </h1>
                                {showAdsSkeleton ? (
                                    <div className="mt-2 space-y-2">
                                        <Skeleton className="h-4 w-full max-w-xl rounded" />
                                        <Skeleton className="h-4 w-2/3 max-w-md rounded" />
                                    </div>
                                ) : (
                                    <p className="mt-2 max-w-2xl text-sm text-slate-500 md:text-sm">
                                        Browse all {category.name.toLowerCase()} listings near you.
                                        Verified sellers, great prices and {ads.length}+ fresh ads
                                        posted every day.
                                    </p>
                                )}
                            </div>
                            <div className="w-full shrink-0 sm:w-48">
                                <SelectDropdown
                                    label=""
                                    value={sort}
                                    onChange={(value) => setSort(value as SortValue)}
                                    options={[...SORT_OPTIONS]}
                                    className="mt-3 max-w-full bg-white! py-2.5! sm:max-w-48"
                                />
                            </div>
                        </header>

                        <PaginatedListings
                            key={sort}
                            listings={ads}
                            loading={showAdsSkeleton}
                            emptyTitle={`Oops! No ${category.name.toLowerCase()} deals`}
                            emptyDescription={`Nothing in ${category.name.toLowerCase()} right now. Try another sort, browse a subcategory, or check back soon — fresh ads go live every day.`}
                        />
                    </div>
                </main>
            </>
        );
    }

    const { category, subcategory } = match;
    const data = buildListings(slug);

    return (
        <main className="flex-1 bg-white">
            <SubcategoryBrowse
                categoryName={category.name}
                categoryId={resolvedCategoryId}
                subcategories={category.subcategories}
                subCategoryId={resolvedSubCategoryId}
                activeSubcategory={subcategory}
                listings={data}
            />
        </main>
    );
}
