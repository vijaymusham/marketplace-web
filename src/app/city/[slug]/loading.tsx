import {
    ListingCardSkeleton,
    PAGINATED_LISTINGS_GRID,
    Skeleton,
} from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <main className="flex-1 bg-white" aria-busy>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <Skeleton className="aspect-21/9 w-full rounded-[1.75rem] sm:rounded-[2rem]" />
                <div className={`${PAGINATED_LISTINGS_GRID} mt-8`}>
                    {Array.from({ length: 8 }, (_, i) => (
                        <ListingCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </main>
    );
}
