"use client";

import type { ReactNode } from "react";

/** Base shimmer block — pass sizing via className. */
export function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div
            aria-hidden
            className={`animate-pulse bg-slate-100 ${className}`.trim()}
        />
    );
}

/** Matches ListingCard layout (image + meta + title + location + price). */
export function ListingCardSkeleton() {
    return (
        <div className="flex flex-col" aria-hidden>
            <Skeleton className="aspect-12/11 w-full rounded-2xl" />
            <div className="flex flex-1 flex-col pt-3">
                <Skeleton className="h-3 w-1/2 rounded" />
                <Skeleton className="mt-1.5 h-4 w-full rounded" />
                <Skeleton className="mt-1.5 h-3 w-2/3 rounded" />
                <div className="mt-2.5 flex items-center justify-between gap-2 sm:mt-3">
                    <Skeleton className="h-4 w-1/3 rounded" />
                    <Skeleton className="h-3 w-12 rounded" />
                </div>
            </div>
        </div>
    );
}

/** Matches square ListCard layout. */
export function ListCardSkeleton() {
    return (
        <div className="flex flex-col" aria-hidden>
            <Skeleton className="aspect-square rounded-[1.35rem]" />
            <div className="flex flex-1 flex-col pt-3.5">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="mt-2 h-4 w-2/3 rounded" />
                <Skeleton className="mt-2.5 h-4 w-1/3 rounded" />
            </div>
        </div>
    );
}

/** Matches WishlistCard (horizontal image + text). */
export function WishlistCardSkeleton() {
    return (
        <div
            className="grid grid-cols-1 overflow-hidden rounded-3xl bg-slate-50 sm:grid-cols-[11rem_1fr]"
            aria-hidden
        >
            <Skeleton className="aspect-16/10 sm:aspect-auto sm:min-h-40" />
            <div className="flex flex-col p-3.5 sm:p-6">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="mt-3 h-5 w-3/4 rounded" />
                <Skeleton className="mt-2 h-4 w-full rounded" />
                <Skeleton className="mt-2 h-4 w-2/3 rounded" />
                <Skeleton className="mt-4 h-5 w-1/4 rounded" />
            </div>
        </div>
    );
}

/** Matches CategoryTabs icon + label chip. */
export function CategoryTabSkeleton() {
    return (
        <div className="flex w-20 flex-col items-center justify-center gap-1 sm:w-24 md:w-28" aria-hidden>
            <Skeleton className="h-9 w-9 rounded-xl sm:h-11 sm:w-11 md:h-13 md:w-13" />
            <Skeleton className="h-3 w-14 rounded sm:h-3.5 sm:w-16" />
        </div>
    );
}

/** Full CategoryTabs bar while categories load. */
export function CategoryTabsSkeleton() {
    return (
        <>
            <nav className="fixed inset-x-0 top-[6.75rem] z-20 border-b border-slate-200 bg-white/85 backdrop-blur-2xl lg:top-18" aria-busy>
                <div className="relative mx-auto px-3 sm:px-6 lg:px-12">
                    <div className="flex h-24 items-center gap-1 overflow-hidden sm:h-28 sm:gap-2">
                        {Array.from({ length: 12 }, (_, i) => (
                            <CategoryTabSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </nav>
            <div className="h-24 sm:h-28" aria-hidden />
        </>
    );
}

/** Subcategory tabs bar while categories resolve. */
export function SubcategoryTabsSkeleton() {
    return (
        <nav className="border-b border-slate-200 bg-white/85 backdrop-blur-2xl" aria-busy>
            <div className="relative mx-auto flex flex-col items-stretch px-3 sm:flex-row sm:gap-0 sm:space-x-4 sm:px-6 lg:px-12">
                <Skeleton className="mt-3 h-4 w-20 rounded sm:hidden" />
                <div className="flex shrink-0 items-center gap-2 py-2.5 pr-2 sm:gap-2.5 sm:py-3 sm:pr-6">
                    <Skeleton className="h-8 w-8 rounded-xl sm:h-11 sm:w-11 md:h-13 md:w-13" />
                    <div className="min-w-0">
                        <Skeleton className="h-2.5 w-14 rounded" />
                        <Skeleton className="mt-1.5 h-4 w-24 rounded" />
                    </div>
                </div>
                <div className="flex items-center gap-2 overflow-hidden pb-3 sm:h-28 sm:gap-2 sm:pb-0">
                    {Array.from({ length: 7 }, (_, i) => (
                        <div
                            key={i}
                            className="flex shrink-0 items-center gap-1.5 rounded-full sm:hidden"
                            aria-hidden
                        >
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-7 w-24 rounded-full" />
                        </div>
                    ))}
                    <div className="hidden items-center gap-2 sm:flex">
                        {Array.from({ length: 7 }, (_, i) => (
                            <CategoryTabSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}

/** Matches CityExplorer circular city chip. */
export function CityCircleSkeleton() {
    return (
        <div
            className="w-21 shrink-0 sm:w-28 md:w-28 lg:w-30"
            aria-hidden
        >
            <Skeleton className="aspect-square w-full rounded-full" />
            <Skeleton className="mx-auto mt-1.5 h-3 w-14 rounded sm:mt-2 sm:h-3.5 sm:w-16" />
            <Skeleton className="mx-auto mt-1 h-2.5 w-10 rounded sm:mt-0.5 sm:h-3 sm:w-12" />
        </div>
    );
}

/** Matches MyAdsCard (image + status + title + price). */
export function MyAdCardSkeleton() {
    return (
        <div
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            aria-hidden
        >
            <div className="grid grid-cols-1 md:grid-cols-[9.5rem_1fr]">
                <Skeleton className="aspect-16/10 md:aspect-auto md:min-h-36" />
                <div className="flex min-w-0 flex-col p-3.5 sm:p-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <Skeleton className="h-5 w-16 rounded-md" />
                        <Skeleton className="h-3.5 w-28 rounded" />
                    </div>
                    <Skeleton className="mt-3 h-4 w-4/5 rounded" />
                    <Skeleton className="mt-2 h-4 w-3/5 rounded" />
                    <Skeleton className="mt-3 h-7 w-24 rounded" />
                    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                        <div className="flex gap-4">
                            <Skeleton className="h-3.5 w-12 rounded" />
                            <Skeleton className="h-3.5 w-12 rounded" />
                        </div>
                        <Skeleton className="h-9 w-24 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/** Matches chat sidebar conversation row. */
export function ChatRowSkeleton() {
    return (
        <div className="flex min-h-16 items-center gap-3 rounded-[20px] px-3 py-2.5" aria-hidden>
            <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-3.5 w-28 rounded" />
                    <Skeleton className="h-3 w-10 rounded" />
                </div>
                <Skeleton className="mt-2 h-3 w-4/5 rounded" />
            </div>
        </div>
    );
}

/** Full chat sidebar while conversations load. */
export function ChatSidebarSkeleton() {
    return (
        <div className="flex h-full w-full flex-col bg-white p-4 pt-5 sm:rounded-3xl" aria-busy>
            <Skeleton className="mb-3 h-7 w-28 rounded" />
            <Skeleton className="mb-3 h-12 w-full rounded-[18px]" />
            <div className="mb-4 flex gap-1.5 sm:mb-5">
                <Skeleton className="h-8 w-14 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-18 rounded-full" />
            </div>
            <div className="min-h-0 flex-1 space-y-1.5 overflow-hidden">
                {Array.from({ length: 8 }, (_, i) => (
                    <ChatRowSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

/** Message bubbles while chat messages load. */
export function ChatMessagesSkeleton() {
    return (
        <div className="flex h-full flex-col justify-end gap-4 px-1 py-2" aria-busy aria-hidden>
            <div className="flex justify-start">
                <Skeleton className="h-12 w-[55%] max-w-xs rounded-2xl rounded-bl-md" />
            </div>
            <div className="flex justify-end">
                <Skeleton className="h-10 w-[45%] max-w-xs rounded-2xl rounded-br-md" />
            </div>
            <div className="flex justify-start">
                <Skeleton className="h-16 w-[60%] max-w-sm rounded-2xl rounded-bl-md" />
            </div>
            <div className="flex justify-end">
                <Skeleton className="h-10 w-[40%] max-w-xs rounded-2xl rounded-br-md" />
            </div>
            <div className="flex justify-start">
                <Skeleton className="h-11 w-[50%] max-w-xs rounded-2xl rounded-bl-md" />
            </div>
        </div>
    );
}

/** Category filter accordion rows. */
export function FilterSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-1" aria-busy aria-hidden>
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-xl px-2 py-2.5">
                    <Skeleton className="h-4 w-4 shrink-0 rounded" />
                    <Skeleton className="h-3.5 flex-1 rounded" />
                    <Skeleton className="h-4 w-4 shrink-0 rounded" />
                </div>
            ))}
        </div>
    );
}

/** Route-level home page skeleton (category tabs + cities + listing grids). */
export function HomePageSkeleton() {
    return (
        <div className="flex-1 bg-white" aria-busy>
            <CategoryTabsSkeleton />

            <div className="mx-auto px-4 pt-4 pb-2 sm:px-6 sm:pt-5 lg:px-12 lg:pt-6">
                <Skeleton className="h-7 w-56 rounded sm:h-8 sm:w-72" />
                <Skeleton className="mt-2 h-3.5 w-72 max-w-full rounded sm:h-4 sm:w-96" />
                <div className={`${CITY_ROW} mt-3 sm:mt-4`}>
                    {Array.from({ length: 10 }, (_, i) => (
                        <CityCircleSkeleton key={i} />
                    ))}
                </div>
            </div>

            <div className="mx-auto px-4 pt-5 pb-8 sm:px-6 sm:pt-6 lg:px-12 lg:pt-7">
                <Skeleton className="h-7 w-52 rounded sm:h-8 sm:w-64" />
                <Skeleton className="mt-2 h-3.5 w-64 max-w-full rounded" />
                <div className={`${HOME_LISTINGS_GRID} mt-6`}>
                    {Array.from({ length: 10 }, (_, i) => (
                        <ListingCardSkeleton key={i} />
                    ))}
                </div>
            </div>

            <div className="mx-auto px-4 py-8 sm:px-6 lg:px-12">
                <Skeleton className="h-7 w-44 rounded sm:h-8 sm:w-56" />
                <Skeleton className="mt-2 h-3.5 w-48 max-w-full rounded" />
                <div className={`${HOME_LISTINGS_GRID} mt-6`}>
                    {Array.from({ length: 5 }, (_, i) => (
                        <ListingCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}

/** Category browse header + listings grid. */
export function CategoryPageSkeleton() {
    return (
        <>
            <SubcategoryTabsSkeleton />
            <main className="flex-1 bg-white" aria-busy>
                <div className="mx-auto px-4 py-4 sm:px-6 sm:py-8 md:py-10 lg:px-12">
                    <div className="mb-5 flex items-start justify-between gap-3 sm:mb-7 md:mb-9">
                        <div className="min-w-0 flex-1">
                            <Skeleton className="h-6 w-40 rounded sm:h-8 sm:w-56 md:h-9 md:w-72" />
                            <Skeleton className="mt-2 h-3.5 w-36 rounded sm:mt-3 sm:h-4 sm:w-full sm:max-w-xl" />
                            <Skeleton className="mt-2 hidden h-4 w-2/3 max-w-md rounded sm:block" />
                        </div>
                        <Skeleton className="h-9 w-[8.25rem] rounded-full sm:h-11 sm:w-48 sm:rounded-xl" />
                    </div>
                    <div className={PAGINATED_LISTINGS_GRID}>
                        {Array.from({ length: 8 }, (_, i) => (
                            <ListingCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}

/** Matches ListingDetail page layout (gallery + info + about/details). */
export function ListingDetailSkeleton() {
    return (
        <div className="bg-white pb-24 lg:pb-12" aria-busy>
            <div className="mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-12">
                <Skeleton className="h-5 w-16 rounded" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
            </div>

            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-12 lg:gap-12 lg:px-8">
                <div className="lg:col-span-7">
                    <Skeleton className="aspect-5/4 w-full sm:mx-6 sm:rounded-[1.75rem] lg:mx-0 lg:aspect-4/3" />
                    <div className="mt-3 flex gap-2 overflow-hidden px-4 sm:mx-6 sm:px-0 lg:mx-0">
                        {Array.from({ length: 4 }, (_, i) => (
                            <Skeleton key={i} className="h-17 w-17 shrink-0 rounded-xl" />
                        ))}
                    </div>
                </div>

                <div className="px-4 sm:px-6 lg:col-span-5 lg:px-0 lg:pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-4 w-28 rounded" />
                    </div>
                    <Skeleton className="mt-4 h-9 w-40 rounded sm:h-10" />
                    <Skeleton className="mt-3 h-7 w-full rounded" />
                    <Skeleton className="mt-2 h-7 w-3/4 rounded" />
                    <Skeleton className="mt-2 h-4 w-1/2 rounded" />

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        {Array.from({ length: 4 }, (_, i) => (
                            <div key={i} className="rounded-2xl bg-slate-50 px-4 py-3.5">
                                <Skeleton className="h-3 w-16 rounded" />
                                <Skeleton className="mt-2 h-4 w-24 rounded" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center gap-3 border-y border-slate-100 py-5">
                        <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
                        <div className="min-w-0 flex-1">
                            <Skeleton className="h-4 w-32 rounded" />
                            <Skeleton className="mt-2 h-3 w-40 rounded" />
                        </div>
                    </div>

                    <div className="mt-5 hidden gap-2.5 lg:flex">
                        <Skeleton className="h-12 flex-1 rounded-full" />
                        <Skeleton className="h-12 flex-1 rounded-full" />
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:mt-14 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
                    <section className="lg:col-span-7">
                        <Skeleton className="h-6 w-48 rounded" />
                        <Skeleton className="mt-3 h-4 w-full rounded" />
                        <Skeleton className="mt-2 h-4 w-full rounded" />
                        <Skeleton className="mt-2 h-4 w-5/6 rounded" />
                        <Skeleton className="mt-2 h-4 w-4/6 rounded" />
                    </section>
                    <section className="lg:col-span-5">
                        <Skeleton className="h-6 w-28 rounded" />
                        <div className="mt-4 space-y-0">
                            {Array.from({ length: 5 }, (_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between gap-4 border-b border-slate-100 py-3.5"
                                >
                                    <Skeleton className="h-3.5 w-24 rounded" />
                                    <Skeleton className="h-3.5 w-20 rounded" />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-100 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
                <div className="mx-auto flex max-w-lg gap-2">
                    <Skeleton className="h-12 flex-1 rounded-full" />
                    <Skeleton className="h-12 flex-1 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export const LISTINGS_GRID =
    "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-7 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-5 lg:gap-y-8";

export const HOME_LISTINGS_GRID =
    "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4 xl:grid-cols-6";

export const PAGINATED_LISTINGS_GRID =
    "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-7 lg:grid-cols-3 xl:grid-cols-5 lg:gap-x-6";

export const WISHLIST_GRID =
    "grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2";

export const CITY_ROW =
    "flex gap-3 overflow-x-auto scroll-smooth px-4 pb-0.5 scrollbar-hide sm:mx-0 sm:gap-4 sm:px-0 md:gap-5";

type SkeletonVariant = "listing" | "list" | "wishlist" | "city";

/**
 * Wrap any listing UI — when `loading` is true, auto-renders card skeletons.
 * Pass `skeleton` to fully customize the fallback.
 */
export function WithSkeleton({
    loading,
    count = 8,
    variant = "listing",
    gridClassName,
    skeleton,
    children,
}: {
    loading: boolean;
    count?: number;
    variant?: SkeletonVariant;
    gridClassName?: string;
    skeleton?: ReactNode;
    children: ReactNode;
}) {
    if (!loading) return <>{children}</>;

    if (skeleton) return <>{skeleton}</>;

    const grid =
        gridClassName ??
        (variant === "wishlist"
            ? WISHLIST_GRID
            : variant === "city"
                ? CITY_ROW
                : variant === "list"
                    ? LISTINGS_GRID
                    : HOME_LISTINGS_GRID);

    const Card =
        variant === "wishlist"
            ? WishlistCardSkeleton
            : variant === "city"
                ? CityCircleSkeleton
                : variant === "list"
                    ? ListCardSkeleton
                    : ListingCardSkeleton;

    return (
        <div className={grid} aria-busy>
            {Array.from({ length: count }, (_, i) => (
                <Card key={i} />
            ))}
        </div>
    );
}
