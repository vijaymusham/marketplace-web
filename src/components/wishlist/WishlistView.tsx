"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import WishlistCard from "@/components/wishlist/WishlistCard";
import WishlistEmpty from "@/components/wishlist/WishlistEmpty";
import { useHasMounted, useWishlist } from "@/hooks/useWishlist";

export default function WishlistView() {
    // const mounted = useHasMounted();
    const { items, count, remove, clear } = useWishlist();

    // if (!mounted) {
    //     return (
    //         <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
    //             <div className="mx-auto h-64 max-w-sm animate-pulse rounded-full bg-slate-100" />
    //         </div>
    //     );
    // }

    if (count === 0) {
        return <WishlistEmpty />;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
            <header className="mb-8 flex flex-col gap-5 border-b border-slate-100 pb-8 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-primary">
                        {count} saved {count === 1 ? "deal" : "deals"}
                    </p>
                    <h1 className="mt-1.5 flex items-center gap-2 font-heading text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                        <Heart className="h-7 w-7 fill-red-500 text-red-500 md:h-8 md:w-8" /> Wishlist

                    </h1>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed font-medium text-slate-500">
                        Everything you&apos;ve hearted in one place. Remove anything you no
                        longer need, or jump back into a listing.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                        href="/"
                        className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                    >
                        Keep browsing
                    </Link>
                    <button
                        type="button"
                        onClick={clear}
                        className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                    >
                        Clear all
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2  gap-4 sm:gap-5">
                {items.map((listing) => (
                    <WishlistCard
                        key={listing.id}
                        listing={listing}
                        onRemove={() => remove(listing.id)}
                    />
                ))}
            </div>
        </div>
    );
}
