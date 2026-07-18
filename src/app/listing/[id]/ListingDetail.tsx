"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";
import {
  getListingDescription,
  getListingImages,
  getListingKind,
  getListingKindLabel,
  getListingSeller,
  getListingSpecs,
  type Listing,
} from "@/lib/listings";
import { useWishlist } from "@/hooks/useWishlist";

export default function ListingDetail({ listing }: { listing: Listing }) {
  const images = getListingImages(listing);
  const seller = getListingSeller(listing);
  const specs = getListingSpecs(listing);
  const highlights = specs.slice(0, 4);
  const kindLabel = getListingKindLabel(getListingKind(listing));
  const description = getListingDescription(listing);
  const { isLiked, toggle } = useWishlist();
  const liked = isLiked(listing.id);
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: listing.title, text: listing.price, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="bg-white pb-24 lg:pb-12">
      {/* Top bar */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={share}
            aria-label="Share"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Share2 className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => toggle(listing.id)}
            aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              liked
                ? "text-rose-500 hover:bg-rose-50"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Heart
              className={`h-5 w-5 ${liked ? "fill-rose-500" : ""}`}
              strokeWidth={1.75}
            />
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-12 lg:gap-12 lg:px-8">
        {/* Gallery — full bleed on mobile */}
        <div className="lg:col-span-7">
          <div className="relative aspect-[5/4] overflow-hidden bg-slate-100 sm:mx-6 sm:rounded-[1.75rem] lg:mx-0 lg:aspect-[4/3]">
            <Image
              src={images[active]}
              alt={listing.title}
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />

            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="absolute top-1/2 left-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="absolute top-1/2 right-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
              {active + 1} / {images.length}
            </span>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto px-4 scrollbar-hide sm:mx-6 sm:px-0 lg:mx-0">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                className={`relative h-[4.25rem] w-[4.25rem] shrink-0 overflow-hidden rounded-xl transition ${
                  active === i
                    ? "outline-2 outline-offset-2 outline-primary"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="68px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="px-4 sm:px-6 lg:col-span-5 lg:px-0 lg:pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {kindLabel}
            </span>
            {listing.featured && (
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                Featured
              </span>
            )}
            <span className="text-xs font-medium text-slate-400">
              Posted {listing.date}
            </span>
          </div>

          <p className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {listing.price}
          </p>
          <h1 className="mt-2 text-xl leading-snug font-bold text-slate-900 sm:text-2xl">
            {listing.title}
          </h1>
          {listing.meta && (
            <p className="mt-2 text-sm font-medium text-slate-500">{listing.meta}</p>
          )}
          {copied && (
            <p className="mt-2 text-xs font-semibold text-primary">Link copied</p>
          )}

          {/* Key highlights — category aware */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {highlights.map((row) => (
              <div key={row.label} className="rounded-2xl bg-slate-50 px-4 py-3.5">
                <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  {row.label}
                </p>
                <p className="mt-1 truncate text-[15px] font-bold text-slate-900">
                  {row.value}
                </p>
              </div>
            ))}
          </div>

          {/* Seller */}
          <div className="mt-6 flex items-center gap-3 border-y border-slate-100 py-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              {seller.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                {seller.name}
                {seller.verified && (
                  <BadgeCheck className="h-4 w-4 fill-primary text-white" />
                )}
              </p>
              <p className="text-xs font-medium text-slate-500">
                On DealMarket since {seller.memberSince} · {seller.adsPosted} ads
              </p>
            </div>
          </div>

          <div className="mt-5 hidden gap-2.5 lg:flex">
            <button
              type="button"
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-white transition hover:bg-primary-hover"
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </button>
            <button
              type="button"
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 text-sm font-bold text-slate-800 transition hover:border-slate-400"
            >
              <Phone className="h-4 w-4" />
              Call
            </button>
          </div>
        </div>
      </div>

      {/* Full details band */}
      <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:mt-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <section className="lg:col-span-7">
            <h2 className="text-lg font-extrabold text-slate-900">
              About this {kindLabel.toLowerCase()}
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 font-medium text-slate-600">
              {description}
            </p>
          </section>

          <section className="lg:col-span-5">
            <h2 className="text-lg font-extrabold text-slate-900">All details</h2>
            <dl className="mt-4 space-y-0">
              {specs.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-6 border-b border-slate-100 py-3.5"
                >
                  <dt className="text-sm font-medium text-slate-400">{row.label}</dt>
                  <dd className="text-right text-sm font-bold text-slate-900">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 flex items-center justify-between text-xs font-medium text-slate-400">
              <span>AD ID {1848200000 + listing.id}</span>
              <button type="button" className="font-semibold text-slate-500 hover:text-rose-500">
                Report ad
              </button>
            </p>
          </section>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-100 bg-white/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg gap-2">
          <button
            type="button"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-white"
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </button>
          <button
            type="button"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 text-sm font-bold text-white"
          >
            <Phone className="h-4 w-4" />
            Call
          </button>
        </div>
      </div>
    </div>
  );
}
