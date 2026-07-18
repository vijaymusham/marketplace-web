"use client";

import Image from "next/image";
import { Heart, MapPin } from "lucide-react";
import { Listing } from "@/lib/listings";
import { useWishlist } from "@/hooks/useWishlist";

export default function ListingCard({
    listing,
    liked,
    onToggleLike,
}: {
    listing: Listing;
    /** Controlled mode: pass both `liked` and `onToggleLike` (client components only). */
    liked?: boolean;
    onToggleLike?: () => void;
}) {
    const wishlist = useWishlist();
    const isControlled = liked !== undefined && onToggleLike !== undefined;
    const isLiked = isControlled ? liked : wishlist.isLiked(listing.id);
    const handleToggleLike =
        onToggleLike ?? (() => wishlist.toggle(listing.id));

    return (
        <div className="group flex flex-col">
            <div className="relative aspect-12/11 w-full overflow-hidden rounded-2xl bg-slate-100">
                <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {listing.featured && (
                    <span className="absolute top-3 left-3 rounded-full bg-black/30 backdrop-blur-lg px-2.5 py-1 text-[11px] font-bold text-white ">
                        Featured
                    </span>
                )}

                <button
                    onClick={handleToggleLike}
                    aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                    className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-lg transition-colors ${isLiked ? "bg-white" : "bg-black/30 hover:bg-black/40"
                        }`}
                >
                    <Heart
                        className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`}
                        strokeWidth={2}
                    />
                </button>

                <span className="absolute inset-x-0 bottom-2.5 flex items-center justify-center gap-1">
                    {[0, 1, 2, 3, 4].map((dot) => (
                        <span
                            key={dot}
                            className={`h-1.5 w-1.5 rounded-full ${dot === 0 ? "bg-white" : "bg-white/50"}`}
                        />
                    ))}
                </span>
            </div>

            <div className="flex flex-1 flex-col pt-3">
                <p className="min-h-4 text-xs text-slate-500">{listing.meta}</p>
                <h3 className="mt-1 truncate text-[15px] font-bold text-slate-900">
                    {listing.title}
                </h3>
                <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{listing.location}</span>
                </p>

                <div className="mt-3 flex items-center justify-between">
                    <p className="text-[15px] font-extrabold text-slate-900">
                        {listing.price}
                    </p>
                    <p className="text-xs text-slate-500">{listing.date}</p>
                </div>
            </div>
        </div>
    );
}
