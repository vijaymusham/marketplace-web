"use client";;
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, X } from "lucide-react";
import { ApiWishlist } from "../types/AllTypes";



export default function WishlistCard({
    listing,
    onRemove,
}: {
    listing: ApiWishlist;
    onRemove: () => void;
}) {
    return (
        <article className="group grid grid-cols-1 overflow-hidden rounded-3xl bg-slate-50 sm:grid-cols-[11rem_1fr]">
            <Link
                href={`/listing/${listing.id}`}
                className="relative aspect-4/3 sm:aspect-auto sm:min-h-full"
            >
                <Image
                    src={listing.imageUrl || "/no_image.jpeg"}
                    alt={listing.title || "No image"}
                    fill
                    sizes="(min-width: 640px) 176px, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
            </Link>

            <div className="relative flex flex-col p-5 sm:p-6">
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label={`Remove ${listing.title} from wishlist`}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200/80 transition-colors hover:text-rose-500 sm:top-4 sm:right-4 sm:h-9 sm:w-9"
                >
                    <X className="h-4 w-4" strokeWidth={2.25} />
                </button>

                <div className="mb-2 flex items-center gap-2 pr-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-primary ring-1 ring-primary/15">
                        <Heart className="h-3 w-3 fill-primary" />
                        Saved
                    </span>
                </div>

                <Link href={`/listing/${listing.id}`}>
                    <h3 className="pr-8 text-base leading-snug font-bold text-slate-900 sm:text-lg">
                        {listing.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed font-medium text-slate-500">
                        {listing.metadata}
                    </p>
                </Link>

                <p className="mt-3 flex flex-col gap-1 text-xs font-medium text-slate-400 sm:flex-row sm:items-center sm:gap-1.5">
                    <span className="flex min-w-0 items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{listing.location}</span>
                    </span>
                    <span className="hidden text-slate-300 sm:inline">·</span>
                    <span>{listing.favoritedAt}</span>
                </p>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200/70 pt-4">
                    <p className="text-lg font-extrabold tracking-tight text-slate-900">
                        {listing.price.toString()}
                    </p>
                    <Link
                        href={`/listing/${listing.id}`}
                        className="rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary"
                    >
                        View deal
                    </Link>
                </div>
            </div>
        </article>
    );
}
