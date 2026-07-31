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
            <Skeleton className="aspect-4/3 sm:aspect-auto sm:min-h-40" />
            <div className="flex flex-col p-5 sm:p-6">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="mt-3 h-5 w-3/4 rounded" />
                <Skeleton className="mt-2 h-4 w-full rounded" />
                <Skeleton className="mt-2 h-4 w-2/3 rounded" />
                <Skeleton className="mt-4 h-5 w-1/4 rounded" />
            </div>
        </div>
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

/** Matches ListingDetail page layout (gallery + info + about/details). */
export function ListingDetailSkeleton() {
    return (
        <div className="bg-white pb-24 lg:pb-12" aria-busy aria-label="Loading listing">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
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
    "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4 xl:grid-cols-5";

export const PAGINATED_LISTINGS_GRID =
    "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-7 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-6";

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
        <div className={grid} aria-busy aria-label="Loading">
            {Array.from({ length: count }, (_, i) => (
                <Card key={i} />
            ))}
        </div>
    );
}
