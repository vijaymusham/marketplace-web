"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addToWishlist, removeFromWishlist } from "../api/apis";
import { ApiAd, ApiWishlist } from "../types/AllTypes";
import { useIsLoggedIn, useWishlistQuery } from "@/hooks/useWishlistQuery";
import { requestSignIn } from "@/lib/auth-events";

function formatPrice(price: number, currency?: string) {
    const amount = Number.isFinite(price) ? price.toLocaleString("en-IN") : "0";
    if (!currency || currency === "INR" || currency === "₹") return `₹${amount}`;
    return `${currency} ${amount}`;
}

export default function ListingCard({
    listing
}: {
    listing: ApiAd;
    liked?: boolean;
}) {
    const queryClient = useQueryClient();
    const isLoggedIn = useIsLoggedIn();
    const { data: wishlist = [] } = useWishlistQuery();
    const inWishlist = wishlist.some((item: ApiWishlist) => item.id === listing.id);

    const handleToggleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            requestSignIn();
            toast.error("Sign in to save items");
            return;
        }

        const id = String(listing.id);
        const previous = queryClient.getQueryData<ApiWishlist[]>(["wishlist"]);

        // Optimistic UI — only touch wishlist cache (no grid refetch / page flash)
        queryClient.setQueryData<ApiWishlist[]>(["wishlist"], (old = []) => {
            if (inWishlist) return old.filter((item) => item.id !== listing.id);
            return [
                ...old,
                {
                    ...listing,
                    favoritedAt: new Date().toISOString(),
                    category: { id: "", name: "", slug: "" },
                } as ApiWishlist,
            ];
        });

        try {
            if (inWishlist) {
                await removeFromWishlist(id);
            } else {
                await addToWishlist(id);
            }
            await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        } catch {
            queryClient.setQueryData(["wishlist"], previous);
            toast.error("Couldn’t update wishlist");
        }
    };

    return (
        <div className="group flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform">
            <div className="relative aspect-12/11 w-full overflow-hidden rounded-2xl bg-slate-100 shadow-none transition-shadow duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_18px_40px_-18px_rgba(15,23,42,0.28)]">
                <Link href={`/listing/${listing.id}`} className="absolute inset-0 block">
                    {listing.imageUrl ? (
                        <Image
                            src={listing.imageUrl}
                            alt={listing.title}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                        />
                    ) : null}
                </Link>

                {listing.isFavorite && (
                    <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-lg">
                        Featured
                    </span>
                )}

                <button
                    type="button"
                    onClick={handleToggleLike}
                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-lg transition-colors ${inWishlist ? "bg-white" : "bg-black/30 hover:bg-black/40"
                        }`}
                >
                    <Heart
                        className={`h-4 w-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-white"}`}
                        strokeWidth={2}
                    />
                </button>
            </div>

            <Link href={`/listing/${listing.id}`} className="flex flex-1 flex-col pt-3">
                <p className="min-h-4 text-xs text-slate-500">{listing.metadata}</p>
                <h3 className="mt-1 truncate text-[15px] font-bold text-slate-900">
                    {listing.title}
                </h3>
                <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{listing.location}</span>
                </p>

                <div className="mt-3 flex items-center justify-between">
                    <p className="text-[15px] font-extrabold text-slate-900">
                        {formatPrice(listing.price, listing.currency)}
                    </p>
                    <p className="text-xs text-slate-500">
                        {listing.postedAtLabel || listing.postedAt}
                    </p>
                </div>
            </Link>
        </div>
    );
}
