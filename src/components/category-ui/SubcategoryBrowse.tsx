"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CategorySidebar, {
    EMPTY_SIDEBAR_FILTERS,
    type CategorySidebarFilterState,
} from "@/components/category-ui/CategorySidebar";
import SubcategoryTabs from "@/components/category-ui/SubcategoryTabs";
import type { Listing } from "@/lib/listings";
import { Enter, Stagger, StaggerItem } from "@/components/animations/Motion";
import {
    LISTINGS_GRID,
    Skeleton,
    WithSkeleton,
} from "@/components/ui/Skeleton";
import ListingCard from "@/components/sections/ListingCard";
import ListingsEmpty from "@/components/category-ui/ListingsEmpty";
import { getCategoriesAds, getCities } from "../api/apis";
import { useQuery } from "@tanstack/react-query";
import type { ApiAd, ApiCategoryAds } from "../types/AllTypes";
import { scrollToTop } from "@/lib/lenis";
import { useUserLocation } from "@/hooks/useUserLocation";

const PAGE_SIZE = 20;

function adsFromResponse(
    payload: ApiCategoryAds | { items?: ApiAd[] } | null | undefined,
): ApiAd[] {
    if (!payload) return [];
    if ("items" in payload && Array.isArray(payload.items)) return payload.items;
    if ("data" in payload && Array.isArray(payload.data?.items)) return payload.data.items;
    return [];
}

function paginationFromResponse(
    payload:
        | ApiCategoryAds
        | { items?: ApiAd[]; total?: number; totalPages?: number }
        | null
        | undefined,
) {
    if (!payload) return { total: 0, totalPages: 1 };
    if ("data" in payload && payload.data) {
        return {
            total: payload.data.total ?? payload.data.items?.length ?? 0,
            totalPages: Math.max(1, payload.data.totalPages ?? 1),
        };
    }
    const total = "total" in payload ? (payload.total ?? 0) : 0;
    const totalPages =
        "totalPages" in payload ? Math.max(1, payload.totalPages ?? 1) : 1;
    return { total, totalPages };
}

function listingToApiAd(listing: Listing): ApiAd {
    const priceNum = Number(String(listing.price).replace(/[^\d.]/g, ""));
    return {
        id: String(listing.id),
        title: listing.title,
        imageUrl: listing.image,
        isFavorite: Boolean(listing.isFavorite),
        price: Number.isFinite(priceNum) ? priceNum : 0,
        currency: "INR",
        location: listing.location,
        metadata: listing.meta ?? "",
        postedAt: listing.date,
        postedAtLabel: listing.date,
    };
}

function sameFilters(
    a: CategorySidebarFilterState,
    b: CategorySidebarFilterState,
) {
    return JSON.stringify(a) === JSON.stringify(b);
}

function buildAdsQueryParams(
    filters: CategorySidebarFilterState,
    coords: { latitude: number; longitude: number },
) {
    const { selected, ranges, stateId, cityId, locality } = filters;

    const rangeParams: Record<string, number> = {};
    for (const range of Object.values(ranges)) {
        if (range.min > range.boundMin) rangeParams[range.minKey] = range.min;
        if (range.max < range.boundMax) rangeParams[range.maxKey] = range.max;
    }

    return {
        cityId: cityId || undefined,
        stateId: stateId || undefined,
        locality: locality.trim() || undefined,
        latitude: coords.latitude,
        longitude: coords.longitude,
        ...rangeParams,
        sort: selected.sort?.[0] || "date",
        filters: Object.fromEntries(
            Object.entries(selected).filter(([, values]) => values.length > 0),
        ),
    };
}

export default function SubcategoryBrowse({
    categoryName,
    categoryId,
    subCategoryId,
    subcategories,
    activeSubcategory,
    listings,
}: {
    categoryName: string;
    categoryId: string;
    subCategoryId?: string;
    subcategories?: string[];
    activeSubcategory: string;
    listings: Listing[];
}) {
    const { latitude, longitude } = useUserLocation();
    const [page, setPage] = useState(1);
    const [filters, setFilters] =
        useState<CategorySidebarFilterState>(EMPTY_SIDEBAR_FILTERS);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1);
        setFilters(EMPTY_SIDEBAR_FILTERS);
    }, [activeSubcategory, categoryId, subCategoryId]);

    const { data: cities = [] } = useQuery({
        queryKey: ["cities", filters.stateId],
        queryFn: () => getCities(filters.stateId || undefined),
        enabled: Boolean(filters.stateId),
    });

    const selectedCity = cities.find((city) => city.id === filters.cityId);
    const coords = useMemo(
        () => ({
            latitude: selectedCity?.latitude ?? latitude,
            longitude: selectedCity?.longitude ?? longitude,
        }),
        [selectedCity?.latitude, selectedCity?.longitude, latitude, longitude],
    );

    const adsQuery = useMemo(
        () => buildAdsQueryParams(filters, coords),
        [filters, coords],
    );

    const { data: ads, isLoading: isLoadingAds } = useQuery({
        queryKey: [
            "category-ads",
            categoryId,
            subCategoryId,
            page,
            adsQuery,
        ],
        queryFn: () =>
            getCategoriesAds({
                categoryId,
                subCategoryId,
                page,
                limit: PAGE_SIZE,
                ...adsQuery,
            }),
        enabled: Boolean(categoryId && subCategoryId),
    });

    const usingApi = Boolean(categoryId && subCategoryId);
    const apiListings = useMemo(() => adsFromResponse(ads), [ads]);
    const { total, totalPages: apiTotalPages } = paginationFromResponse(ads);

    const visible: ApiAd[] = usingApi
        ? apiListings
        : listings
            .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
            .map(listingToApiAd);
    const totalCount = usingApi ? total : listings.length;
    const totalPages = usingApi
        ? apiTotalPages
        : Math.max(1, Math.ceil(listings.length / PAGE_SIZE));

    const showSkeleton = isLoadingAds && usingApi && visible.length === 0;

    const goTo = (next: number) => {
        const clamped = Math.min(Math.max(next, 1), totalPages);
        if (clamped === page) return;
        setPage(clamped);
        scrollToTop();
    };

    const pageNumbers = useMemo(
        () => buildPageNumbers(page, totalPages),
        [page, totalPages],
    );

    const handleFiltersChange = (next: CategorySidebarFilterState) => {
        if (sameFilters(filters, next)) return;
        setFilters(next);
        setPage(1);
    };

    return (
        <>
            <SubcategoryTabs
                categoryName={categoryName}
                activeSubcategory={activeSubcategory}
            />

            <div className="mx-auto px-4 py-8 sm:px-6 md:py-10 lg:px-12">
                <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
                    <CategorySidebar
                        categoryName={categoryName}
                        categoryId={categoryId}
                        subCategoryId={subCategoryId || ""}
                        subcategories={subcategories || []}
                        activeSubcategory={activeSubcategory}
                        totalCount={totalCount}
                        onFiltersChange={handleFiltersChange}
                    />

                    <div className="min-w-0 flex-1">
                        <Enter>
                            <header className="mb-6 md:mb-8">
                                <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                                    {activeSubcategory}
                                </h1>
                                {showSkeleton ? (
                                    <Skeleton className="mt-2 h-4 w-40 rounded" />
                                ) : (
                                    <p className="mt-1.5 text-sm font-medium text-slate-500">
                                        {`${totalCount} products in ${categoryName}`}
                                    </p>
                                )}
                            </header>
                        </Enter>

                        <WithSkeleton
                            loading={showSkeleton}
                            count={8}
                            variant="listing"
                            gridClassName={LISTINGS_GRID}
                        >
                            {visible.length === 0 ? (
                                <ListingsEmpty
                                    title={`Oops! No ${activeSubcategory.toLowerCase()} deals`}
                                    description={`No listings match your filters in ${activeSubcategory}. Clear filters or try a different subcategory — fresh deals go live every day.`}
                                />
                            ) : (
                                <Stagger
                                    key={`${activeSubcategory}-${page}-${JSON.stringify(adsQuery)}`}
                                    className={LISTINGS_GRID}
                                    stagger={0.07}
                                >
                                    {visible.map((listing) => (
                                        <StaggerItem key={listing.id} y={38}>
                                            <ListingCard listing={listing} />
                                        </StaggerItem>
                                    ))}
                                </Stagger>
                            )}
                        </WithSkeleton>

                        {totalPages > 1 && !showSkeleton && (
                            <nav
                                aria-label="Pagination"
                                className="mt-10 flex flex-wrap items-center justify-center gap-1 sm:gap-2"
                            >
                                <button
                                    type="button"
                                    onClick={() => goTo(page - 1)}
                                    disabled={page === 1}
                                    className="mr-1 flex items-center gap-1 rounded-full px-2.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40 sm:px-3"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="hidden sm:inline">Previous</span>
                                </button>

                                {pageNumbers.map((n, i) =>
                                    n === "…" ? (
                                        <span
                                            key={`ellipsis-${i}`}
                                            className="px-1.5 text-sm font-medium text-slate-400"
                                        >
                                            …
                                        </span>
                                    ) : (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => goTo(n)}
                                            aria-current={n === page ? "page" : undefined}
                                            className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2.5 text-sm font-semibold transition-colors ${n === page
                                                ? "bg-slate-950 text-white"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                }`}
                                        >
                                            {n}
                                        </button>
                                    ),
                                )}

                                <button
                                    type="button"
                                    onClick={() => goTo(page + 1)}
                                    disabled={page === totalPages}
                                    className="ml-1 flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function buildPageNumbers(page: number, total: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = new Set<number>([1, total, page - 1, page, page + 1]);
    if (page <= 3) [2, 3, 4].forEach((n) => pages.add(n));
    if (page >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => pages.add(n));

    const sorted = [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
    const result: (number | "…")[] = [];
    let prev = 0;
    for (const n of sorted) {
        if (prev && n - prev > 1) result.push("…");
        result.push(n);
        prev = n;
    }
    return result;
}
