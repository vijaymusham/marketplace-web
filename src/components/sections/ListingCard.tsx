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
                toast.success("Removed from Wishlist");
            } else {
                await addToWishlist(id);
                toast.success("Added to Wishlist");
            }
            await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        } catch {
            queryClient.setQueryData(["wishlist"], previous);
            toast.error("Couldn’t update wishlist");
        }
    };

    return (
        <div className="group flex cursor-pointer flex-col will-change-transform">
            <div className="relative aspect-12/11 w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-100">
                <Link href={`/listing/${listing.id}`} className="absolute inset-0 block">
                    {listing.imageUrl ? (
                        <Image
                            src={listing.imageUrl || "/no_image.jpeg"}
                            alt={listing.title || "No image"}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] aspect-square"
                        />
                    ) : null}
                </Link>

                {listing.isFavorite && (
                    <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold tracking-wide text-slate-800 shadow-sm backdrop-blur-md">
                        Featured
                    </span>
                )}

                <button
                    type="button"
                    onClick={handleToggleLike}
                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    className={`absolute top-2 right-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 sm:top-2.5 sm:right-2.5 sm:h-8 sm:w-8 md:h-9 md:w-9 ${inWishlist ? "bg-white shadow-sm" : "bg-black/35 hover:bg-black/50"
                        }`}
                >
                    <Heart
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-white"
                            }`}
                        strokeWidth={2}
                    />
                </button>
            </div>

            <Link href={`/listing/${listing.id}`} className="flex flex-1 flex-col pt-3.5">
                <p className="min-h-4 truncate text-[11px] font-medium tracking-wide text-slate-400 uppercase sm:text-xs">
                    {listing.metadata}
                </p>
                <h3 className="mt-1 truncate text-sm font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-primary sm:text-[15px]">
                    {listing.title}
                </h3>
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500 sm:text-xs">
                    <MapPin className="h-3 w-3 shrink-0 text-slate-400 sm:h-3.5 sm:w-3.5" />
                    <span className="truncate">{listing.location}</span>
                </p>

                <div className="mt-2.5 flex items-center justify-between gap-2 sm:mt-3">
                    <p className="truncate text-sm font-extrabold tracking-tight text-slate-900 sm:text-[15px]">
                        {formatPrice(listing.price, listing.currency)}
                    </p>
                    <p className="shrink-0 text-[11px] text-slate-400 sm:text-xs">
                        {listing.postedAtLabel || listing.postedAt}
                    </p>
                </div>
            </Link>
        </div>
    );
}
