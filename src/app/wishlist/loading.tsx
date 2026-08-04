import { WishlistCardSkeleton, WISHLIST_GRID } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8" aria-busy>
            <div className="mb-8 border-b border-slate-100 pb-8 sm:mb-10">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                <div className="mt-3 h-9 w-48 animate-pulse rounded bg-slate-100" />
                <div className="mt-3 h-4 w-full max-w-lg animate-pulse rounded bg-slate-100" />
            </div>
            <div className={WISHLIST_GRID}>
                {Array.from({ length: 4 }, (_, i) => (
                    <WishlistCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
