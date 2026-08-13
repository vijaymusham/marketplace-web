"use client";

import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import WishlistCard from "@/components/wishlist/WishlistCard";
import WishlistEmpty from "@/components/wishlist/WishlistEmpty";
import { Enter, Stagger, StaggerItem } from "@/components/animations/Motion";
import { Skeleton, WithSkeleton } from "@/components/ui/Skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromWishlist } from "../api/apis";
import type { ApiWishlist } from "../types/AllTypes";
import { useIsLoggedIn, useWishlistQuery } from "@/hooks/useWishlistQuery";
import { requestSignIn } from "@/lib/auth-events";
import GlowButton from "@/components/ui/GlowButton";
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
        <div className="mx-auto px-4 py-4 sm:px-6 sm:py-8 md:py-12 lg:px-12">
            <Link
                href="/"
                className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 transition-colors hover:text-primary sm:hidden"
            >
                <ArrowLeft className="h-4 w-4" strokeWidth={2.25} />
                Go back
            </Link>

            <Enter>
                <header className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-5 sm:pb-8">
                    <div className="min-w-0">
                        <h1 className="mt-1 flex items-center gap-1.5 font-heading text-xl font-extrabold tracking-tight text-slate-900 sm:mt-1.5 sm:gap-2 sm:text-3xl md:text-4xl">
                            <Heart className="h-5 w-5 fill-red-500 text-red-500 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                            Wishlist
                        </h1>
                        <p className="mt-1.5 max-w-lg text-[12px] leading-relaxed font-medium text-slate-500 sm:mt-2 sm:text-sm">
                            <span className="sm:hidden">
                                Deals you&apos;ve saved. Remove or open a listing anytime.
                            </span>
                            <span className="hidden sm:inline">
                                Everything you&apos;ve hearted in one place. Remove anything you no
                                longer need, or jump back into a listing.
                            </span>
                        </p>
                    </div>

                    {!isLoading && (
                        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
                            <GlowButton href="/" size="sm" className="sm:min-h-10 sm:px-5 sm:text-sm">
                                Keep browsing
                            </GlowButton>
                            <button
                                type="button"
                                onClick={() => clearMutation.mutate()}
                                disabled={clearMutation.isPending}
                                className="rounded-full px-3 py-2 text-[13px] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 sm:px-5 sm:py-2.5 sm:text-sm"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </header>
            </Enter>

            <WithSkeleton loading={isLoading} count={4} variant="wishlist">
                <Stagger className="grid grid-cols-1 gap-3.5 sm:gap-5 md:grid-cols-2" stagger={0.09}>
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
