import { MyAdCardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <main className="flex-1 bg-white">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
                <div className="mb-8 border-b border-slate-100 pb-6">
                    <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
                    <div className="mt-2 h-9 w-36 animate-pulse rounded bg-slate-100" />
                    <div className="mt-2 h-4 w-28 animate-pulse rounded bg-slate-100" />
                </div>
                <div className="flex flex-col gap-4" aria-busy>
                    {Array.from({ length: 3 }, (_, i) => (
                        <MyAdCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </main>
    );
}
