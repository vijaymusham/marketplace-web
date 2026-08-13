"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import WishlistCard from "@/components/wishlist/WishlistCard";
import WishlistEmpty from "@/components/wishlist/WishlistEmpty";
import { Enter, Stagger, StaggerItem } from "@/components/animations/Motion";
import { Skeleton, WithSkeleton } from "@/components/ui/Skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromWishlist } from "../api/apis";
import type { ApiWishlist } from "../types/AllTypes";
import { useIsLoggedIn, useWishlistQuery } from "@/hooks/useWishlistQuery";
import { requestSignIn } from "@/lib/auth-events";
import { useEffect } from "react";

export default function WishlistView() {
    const queryClient = useQueryClient();
    const isLoggedIn = useIsLoggedIn();
    const { data: wishlist = [], isLoading } = useWishlistQuery();

    useEffect(() => {
        if (!isLoggedIn) requestSignIn();
    }, [isLoggedIn]);

    const removeMutation = useMutation({
        mutationFn: (listingId: string) => removeFromWishlist(listingId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        },
    });

    const clearMutation = useMutation({
        mutationFn: async () => {
            await Promise.all(wishlist.map((item) => removeFromWishlist(item.id)));
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        },
    });

    if (!isLoggedIn) {
        return <WishlistEmpty />;
    }

    if (!isLoading && wishlist.length === 0) {
        return <WishlistEmpty />;
    }

    return (
        <div className="mx-auto px-4 py-8 sm:px-6 md:py-12 lg:px-12">
            <Enter>
                <header className="mb-8 flex flex-col gap-5 border-b border-slate-100 pb-8 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        {isLoading ? (
                            <Skeleton className="h-4 w-24 rounded" />
                        ) : (
                            <p className="text-sm font-semibold text-primary">
                                {`${wishlist.length} saved ${wishlist.length === 1 ? "deal" : "deals"}`}
                            </p>
                        )}
                        <h1 className="mt-1.5 flex items-center gap-2 font-heading text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                            <Heart className="h-7 w-7 fill-red-500 text-red-500 md:h-8 md:w-8" /> Wishlist
                        </h1>
                        <p className="mt-2 max-w-lg text-sm leading-relaxed font-medium text-slate-500">
                            Everything you&apos;ve hearted in one place. Remove anything you no
                            longer need, or jump back into a listing.
                        </p>
                    </div>

                    {!isLoading && (
                        <div className="flex flex-wrap items-center gap-2.5">
                            <Link
                                href="/"
                                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                            >
                                Keep browsing
                            </Link>
                            <button
                                type="button"
                                onClick={() => clearMutation.mutate()}
                                disabled={clearMutation.isPending}
                                className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </header>
            </Enter>

            <WithSkeleton loading={isLoading} count={4} variant="wishlist">
                <Stagger className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2" stagger={0.09}>
                    {wishlist.map((listing: ApiWishlist) => (
                        <StaggerItem key={listing.id} y={32}>
                            <WishlistCard
                                listing={listing}
                                onRemove={() => removeMutation.mutate(listing.id)}
                            />
                        </StaggerItem>
                    ))}
                </Stagger>
            </WithSkeleton>
        </div>
    );
}
