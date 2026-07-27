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
import { normalizeApiCategories } from "@/lib/apiCategories";
import { listings, type Listing } from "@/lib/listings";
import { findRouteBySlug, slugify } from "@/lib/slug";

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
    const match = findRouteBySlug(slug);
    const [sort, setSort] = useState<SortValue>("date");

    const { data: apiCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const normalized = normalizeApiCategories(apiCategories);

    const apiCategory = match
        ? normalized.find((c) => {
            const nameSlug = slugify(c.name);
            const routeCategorySlug = slugify(match.category.name);
            return (
                c.name === match.category.name ||
                nameSlug === routeCategorySlug ||
                c.slug === routeCategorySlug ||
                (match.type === "category" && (nameSlug === slug || c.slug === slug))
            );
        })
        : undefined;

    const apiSubcategory =
        match?.type === "subcategory"
            ? apiCategory?.subcategoryItems.find((sub) => {
                const nameSlug = slugify(sub.name);
                return (
                    sub.name === match.subcategory ||
                    nameSlug === slug ||
                    sub.slug === slug ||
                    nameSlug === slugify(match.subcategory)
                );
            })
            : undefined;

    const resolvedCategoryId = categoryIdParam || apiCategory?.id || "";
    const resolvedSubCategoryId = subcategoryIdParam || apiSubcategory?.id || "";

    const { data: categoryAds, isLoading } = useQuery({
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

    if (!match) notFound();

    if (match.type === "category") {
        const { category } = match;
        const ads = adsFromResponse(categoryAds ?? null);
        const countLabel = ads.length || (isLoading ? "…" : 0);

        return (
            <>
                <SubcategoryTabs
                    categoryName={category.name}
                    activeSubcategory=""
                />
                <main className="flex-1 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
                        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between md:mb-9">
                            <div className="min-w-0 flex-1">
                                <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                                    {category.name} for Sale
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm text-slate-500 md:text-sm">
                                    Browse all {category.name.toLowerCase()} listings near you.
                                    Verified sellers, great prices and {countLabel}+ fresh ads
                                    posted every day.
                                </p>
                            </div>
                            <div className="w-full shrink-0 sm:w-56">
                                <SelectDropdown
                                    label=""
                                    value={sort}
                                    onChange={(value) => setSort(value as SortValue)}
                                    options={[...SORT_OPTIONS]}
                                    className="py-2.5! mt-3  max-w-46! bg-white!"
                                />
                            </div>
                        </header>

                        <PaginatedListings key={sort} listings={ads} />
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
