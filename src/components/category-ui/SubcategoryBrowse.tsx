"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CategorySidebar, {
    EMPTY_SIDEBAR_FILTERS,
    KMS_MAX,
    KMS_MIN,
    PRICE_MAX,
    PRICE_MIN,
    YEAR_MAX,
    YEAR_MIN,
    type CategorySidebarFilterState,
} from "@/components/category-ui/CategorySidebar";
import ListCard from "@/components/category-ui/ListCard";
import SubcategoryTabs from "@/components/category-ui/SubcategoryTabs";
import type { Listing } from "@/lib/listings";
import { Enter, Stagger, StaggerItem } from "@/components/animations/Motion";
import { getCategoriesAds, getCities } from "../api/apis";
import { useQuery } from "@tanstack/react-query";
import type { ApiAd, ApiCategoryAds } from "../types/AllTypes";

const PAGE_SIZE = 20;
const DEFAULT_COORDS = { latitude: 19.076, longitude: 72.8777 };

function formatPrice(price: number, currency?: string) {
    const amount = Number.isFinite(price) ? price.toLocaleString("en-IN") : "0";
    if (!currency || currency === "INR" || currency === "₹") return `₹${amount}`;
    return `${currency} ${amount}`;
}

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

function apiAdToListing(ad: ApiAd): Listing {
    return {
        id: ad.id,
        title: ad.title,
        price: formatPrice(ad.price, ad.currency),
        meta: ad.metadata,
        location: ad.location,
        date: ad.postedAtLabel,
        image: ad.imageUrl,
        isFavorite: ad.isFavorite,
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
    const { selected, priceRange, kmsRange, yearRange, stateId, cityId, locality, type } =
        filters;

    return {
        type: type.trim() || undefined,
        cityId: cityId || undefined,
        stateId: stateId || undefined,
        locality: locality.trim() || undefined,
        latitude: coords.latitude,
        longitude: coords.longitude,
        minPrice: priceRange.min > PRICE_MIN ? priceRange.min : undefined,
        maxPrice: priceRange.max < PRICE_MAX ? priceRange.max : undefined,
        minKmsDriven: kmsRange.min > KMS_MIN ? kmsRange.min : undefined,
        maxKmsDriven: kmsRange.max < KMS_MAX ? kmsRange.max : undefined,
        minYear: yearRange.min > YEAR_MIN ? yearRange.min : undefined,
        maxYear: yearRange.max < YEAR_MAX ? yearRange.max : undefined,
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
            latitude: selectedCity?.latitude ?? DEFAULT_COORDS.latitude,
            longitude: selectedCity?.longitude ?? DEFAULT_COORDS.longitude,
        }),
        [selectedCity?.latitude, selectedCity?.longitude],
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

    const apiListings = useMemo(
        () => adsFromResponse(ads).map(apiAdToListing),
        [ads],
    );
    const { total, totalPages: apiTotalPages } = paginationFromResponse(ads);

    const usingApi = Boolean(categoryId && subCategoryId);
    const visible = usingApi
        ? apiListings
        : listings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const totalCount = usingApi ? total : listings.length;
    const totalPages = usingApi
        ? apiTotalPages
        : Math.max(1, Math.ceil(listings.length / PAGE_SIZE));

    const goTo = (next: number) => {
        const clamped = Math.min(Math.max(next, 1), totalPages);
        if (clamped === page) return;
        setPage(clamped);
        window.scrollTo({ top: 0, behavior: "smooth" });
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

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
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
                                <p className="mt-1.5 text-sm font-medium text-slate-500">
                                    {isLoadingAds && usingApi
                                        ? "Loading products…"
                                        : `${totalCount} products in ${categoryName}`}
                                </p>
                            </header>
                        </Enter>

                        {isLoadingAds && usingApi && visible.length === 0 ? (
                            <p className="py-16 text-center text-sm text-slate-400">
                                Loading listings…
                            </p>
                        ) : visible.length === 0 ? (
                            <p className="py-16 text-center text-sm text-slate-400">
                                No products match the selected filters.
                            </p>
                        ) : (
                            <Stagger
                                key={`${activeSubcategory}-${page}-${JSON.stringify(adsQuery)}`}
                                className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-8"
                                stagger={0.07}
                            >
                                {visible.map((listing) => (
                                    <StaggerItem key={listing.id} y={38}>
                                        <ListCard
                                            listing={listing}
                                            badge={activeSubcategory.split(" ")[0]}
                                        />
                                    </StaggerItem>
                                ))}
                            </Stagger>
                        )}

                        {totalPages > 1 && (
                            <nav
                                aria-label="Pagination"
                                className="mt-10 flex flex-wrap items-center justify-center gap-1 sm:gap-2"
                            >
                                <button
                                    type="button"
                                    onClick={() => goTo(page - 1)}
                                    disabled={page === 1}
                                    className="mr-1 flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
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
                                            className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2.5 text-sm font-semibold transition-colors ${
                                                n === page
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
                                    Next
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
