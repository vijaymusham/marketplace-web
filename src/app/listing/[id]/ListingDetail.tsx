"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowUpRight,
    BadgeCheck,
    Ban,
    ChevronLeft,
    ChevronRight,
    Heart,
    MessageCircle,
    Phone,
    Search,
    Share2,
    ShieldCheck,
    X,
    Wallet,
    type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToWishlist, createChat, getAdById, removeFromWishlist } from "@/components/api/apis";
import type { ApiAdDetail, ApiWishlist } from "@/components/types/AllTypes";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useIsLoggedIn, useWishlistQuery } from "@/hooks/useWishlistQuery";
import { requestSignIn } from "@/lib/auth-events";
import { ListingDetailSkeleton } from "@/components/ui/Skeleton";
import GlowButton from "@/components/ui/GlowButton";

function formatPrice(price: number) {
    return `₹${Number.isFinite(price) ? price.toLocaleString("en-IN") : "0"}`;
}

function formatPostedLabel(value?: string) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatAttrLabel(key: string) {
    return key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatAttrValue(value: string) {
    return value
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

const BUYER_GUIDELINES: { title: string; text: string; icon: LucideIcon }[] = [
    {
        title: "Pay after you inspect",
        text: "See the item in person before you pay, especially on offline deals.",
        icon: Wallet,
    },
    {
        title: "If the price feels off, pause",
        text: "Deals that look too cheap are often lookalikes, clones, or pressure scams.",
        icon: Search,
    },
    {
        title: "Ask until it's clear",
        text: "Use chat to confirm condition, extras, and anything the photos don't show.",
        icon: MessageCircle,
    },
    {
        title: "Never pay a stranger first",
        text: "Don't transfer money to a bank or payment app until you know who you're paying.",
        icon: Ban,
    },
];

function splitColumns<T>(rows: T[]): [T[], T[]] {
    const mid = Math.ceil(rows.length / 2);
    return [rows.slice(0, mid), rows.slice(mid)];
}

function sellerInitials(name: string) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function getImages(ad: ApiAdDetail): string[] {
    return [...(ad.images ?? [])]
        .sort((a, b) => {
            if (a.isCover !== b.isCover) return a.isCover ? -1 : 1;
            return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
        })
        .map((img) => img.url)
        .filter(Boolean);
}

function getSpecs(ad: ApiAdDetail): { label: string; value: string }[] {
    const attrs = Object.entries(ad.categoryAttributes ?? {}).map(([key, value]) => ({
        label: formatAttrLabel(key),
        value: formatAttrValue(String(value)),
    }));

    const location = [ad.locality, ad.city?.name].filter(Boolean).join(", ");
    const extras = [
        location ? { label: "Location", value: location } : null,
        ad.isNegotiable ? { label: "Negotiable", value: "Yes" } : null,
        ad.status ? { label: "Status", value: formatAttrValue(ad.status) } : null,
    ].filter((row): row is { label: string; value: string } => row !== null);

    return [...attrs, ...extras];
}

export default function ListingDetail({ id }: { id: string }) {
    const {
        data: ad,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["listing", id],
        queryFn: () => getAdById(id),
        enabled: Boolean(id),
    });

    const isLoggedIn = useIsLoggedIn();
    const { data: wishlist = [] } = useWishlistQuery();

    const inWishlist = wishlist.some((item: ApiWishlist) => item.id === ad?.id);
    const router = useRouter();
    const [active, setActive] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [detailTab, setDetailTab] = useState<"details" | "description">("details");
    const queryClient = useQueryClient();
    const images = useMemo(() => (ad ? getImages(ad) : []), [ad]);
    const specs = useMemo(() => (ad ? getSpecs(ad) : []), [ad]);
    const highlights = specs.slice(0, 4);
    const kindLabel = ad?.subCategory?.name || ad?.category?.name || "Listing";
    const priceLabel = ad ? formatPrice(ad.price) : "";
    const isSold = Boolean(ad?.soldAt) || ad?.status?.toLowerCase() === "sold";
    const locationLabel = [ad?.locality, ad?.city?.name].filter(Boolean).join(", ");

    const prev = () => {
        if (!images.length) return;
        setActive((i) => (i - 1 + images.length) % images.length);
    };
    const next = () => {
        if (!images.length) return;
        setActive((i) => (i + 1) % images.length);
    };

    const openLightbox = () => {
        if (!images.length) return;
        setLightboxOpen(true);
    };

    useEffect(() => {
        if (!lightboxOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setLightboxOpen(false);
                return;
            }
            if (!images.length) return;
            if (event.key === "ArrowLeft") {
                setActive((i) => (i - 1 + images.length) % images.length);
            }
            if (event.key === "ArrowRight") {
                setActive((i) => (i + 1) % images.length);
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [lightboxOpen, images.length]);

    const share = async () => {
        if (!ad) return;
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: ad.title, text: priceLabel, url });
                toast.success("Ad shared successfully");
            } else {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1600);
            }
        } catch {
            /* ignore */
            toast.error("Failed to share ad");
        }
    };

    const handleToggleLike = async () => {
        if (!isLoggedIn) {
            requestSignIn();
            toast.error("Sign in to save items");
            return;
        }
        if (!ad?.id) return;

        const listingId = String(ad.id);
        const previous = queryClient.getQueryData<ApiWishlist[]>(["wishlist"]);

        queryClient.setQueryData<ApiWishlist[]>(["wishlist"], (old = []) => {
            if (inWishlist) return old.filter((item) => item.id !== ad.id);
            return [
                ...old,
                {
                    id: ad.id,
                    title: ad.title,
                    imageUrl: ad.images?.[0]?.url ?? "",
                    isFavorite: true,
                    price: ad.price,
                    currency: "INR",
                    location: [ad.locality, ad.city?.name].filter(Boolean).join(", "),
                    metadata: "",
                    postedAt: ad.createdAt ?? "",
                    postedAtLabel: "",
                    favoritedAt: new Date().toISOString(),
                    category: ad.category
                        ? { id: ad.category.id, name: ad.category.name, slug: ad.category.slug }
                        : { id: "", name: "", slug: "" },
                } as ApiWishlist,
            ];
        });

        try {
            if (inWishlist) {
                await removeFromWishlist(listingId);
                toast.success("Removed from wishlist");
            } else {
                await addToWishlist(listingId);
                toast.success("Added to wishlist");
            }
            await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        } catch {
            queryClient.setQueryData(["wishlist"], previous);
            toast.error("Couldn’t update wishlist");
        }
    };


    const createNewChat = useMutation({
        mutationFn: (listingId: string) => createChat({ listingId }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["chats"] });
            router.push(`/chats?conversation=${encodeURIComponent(JSON.stringify({ listingId: id }))} `);
            toast.success("Chat created successfully");
        },
        onError: (error: { message?: string }) => {
            toast.error(error?.message || "Couldn’t create chat");
        },
    });

    if (isLoading) {
        return <ListingDetailSkeleton />;
    }

    if (isError || !ad) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:px-8">
                <h1 className="font-heading text-2xl font-extrabold text-slate-900">
                    Listing not found
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-500">
                    This ad may have been removed or the link is invalid.
                </p>
                <GlowButton href="/" className="mt-6">
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                </GlowButton>
            </div>
        );
    }

    const safeActive = Math.min(active, Math.max(images.length - 1, 0));
    const detailRows = [
        { label: "Ad ID", value: ad.id },
        ...specs.filter((row) => row.label !== "Ad ID"),
    ];
    const [leftDetails, rightDetails] = splitColumns(detailRows);
    const detailColumns = [leftDetails, rightDetails].filter((column) => column.length > 0);

    return (
        <div className="bg-white pb-24 lg:pb-12">
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
                        onClick={handleToggleLike}
                        aria-label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${inWishlist
                            ? "text-rose-500 hover:bg-rose-50"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                    >
                        <Heart
                            className={`h-5 w-5 ${inWishlist ? "fill-rose-500" : ""}`}
                            strokeWidth={1.75}
                        />
                    </button>
                </div>
            </div>

            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-12 lg:gap-12 lg:px-8">
                <div className="lg:col-span-7">
                    <div className="relative aspect-5/4 overflow-hidden bg-slate-100 sm:mx-6 sm:rounded-[1.75rem] lg:mx-0 lg:aspect-4/3">
                        {images[safeActive] ? (
                            <button
                                type="button"
                                onClick={openLightbox}
                                aria-label="View full screen image"
                                className="absolute inset-0 cursor-zoom-in"
                            >
                                <Image
                                    src={images[safeActive]}
                                    alt={ad.title}
                                    fill
                                    priority
                                    sizes="(min-width: 1024px) 55vw, 100vw"
                                    className={`object-cover ${isSold ? "grayscale" : ""}`}
                                />
                            </button>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">
                                No image
                            </div>
                        )}

                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prev();
                                    }}
                                    aria-label="Previous"
                                    className="absolute top-1/2 left-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur transition hover:bg-white"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        next();
                                    }}
                                    aria-label="Next"
                                    className="absolute top-1/2 right-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur transition hover:bg-white"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </>
                        )}

                        <span className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/30 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-xl">
                            {safeActive + 1} / {images.length || 1}
                        </span>

                        {isSold && (
                            <span className="pointer-events-none absolute top-4 left-4 z-10 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white">
                                Sold
                            </span>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto px-4 scrollbar-hide sm:mx-6 sm:px-0 lg:mx-0 p-2">
                            {images.map((src, i) => (
                                <button
                                    key={`${src}-${i}`}
                                    type="button"
                                    onClick={() => setActive(i)}
                                    className={`relative h-17 w-17 shrink-0 overflow-hidden rounded-xl transition ${safeActive === i
                                        ? "outline-2 outline-offset-2 outline-primary"
                                        : "opacity-80 hover:opacity-100"
                                        }`}
                                >
                                    <Image src={src} alt="" fill sizes="68px" className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-4 sm:px-6 lg:col-span-5 lg:px-0 lg:pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {kindLabel}
                        </span>
                        {ad.category?.name && ad.subCategory?.name && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {ad.category.name}
                            </span>
                        )}
                        {isSold && (
                            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                                Sold
                            </span>
                        )}
                        <span className="text-xs font-medium text-slate-400">
                            Posted {formatPostedLabel(ad.createdAt)}
                        </span>
                    </div>

                    <p className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        {priceLabel}
                        {ad.isNegotiable && (
                            <span className="ml-2 text-sm font-semibold text-slate-400">
                                Negotiable
                            </span>
                        )}
                    </p>
                    <h1 className="mt-2 text-xl leading-snug font-bold text-slate-900 sm:text-2xl">
                        {ad.title}
                    </h1>
                    {locationLabel && (
                        <p className="mt-2 text-sm font-medium text-slate-500">{locationLabel}</p>
                    )}
                    {copied && (
                        <p className="mt-2 text-xs font-semibold text-primary">Link copied</p>
                    )}

                    {highlights.length > 0 && (
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
                    )}

                    <div className="mt-6 flex items-center gap-3 border-y border-slate-100 py-5">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                            {sellerInitials(ad.sellerName || "S")}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                                {ad.sellerName || "Seller"}
                                <BadgeCheck className="h-4 w-4 fill-primary text-white" />
                            </p>
                            <p className="text-xs font-medium text-slate-500">
                                {ad.mobileNumber
                                    ? `Contact: ${ad.mobileNumber?.slice(0, 3)}*******${ad.mobileNumber?.slice(-3)}`
                                    : "DealPokket seller"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 hidden gap-2.5 lg:flex">
                        <GlowButton
                            type="button"
                            onClick={() => createNewChat.mutate(id)}
                            disabled={isSold || createNewChat.isPending}
                            className="flex-1"
                            size="lg"
                            fullWidth
                        >
                            <MessageCircle className="h-4 w-4" />
                            Chat
                        </GlowButton>
                        <a
                            href={isSold || !ad.mobileNumber ? undefined : `tel:${ad.mobileNumber}`}
                            aria-disabled={isSold || !ad.mobileNumber}
                            className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 text-sm font-bold text-slate-800 transition hover:border-slate-400 ${isSold || !ad.mobileNumber
                                ? "pointer-events-none cursor-not-allowed opacity-50"
                                : ""
                                }`}
                        >
                            <Phone className="h-4 w-4" />
                            Call
                        </a>
                    </div>
                </div>
            </div>

            <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:mt-12 lg:px-8">
                <div className="flex gap-8 border-b border-slate-100" role="tablist">
                    {(
                        [
                            { id: "details", label: "Ad Details" },
                            { id: "description", label: "Description" },
                        ] as const
                    ).map((tab) => {
                        const selected = detailTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={selected}
                                onClick={() => setDetailTab(tab.id)}
                                className={`-mb-px border-b-2 pb-3 text-lg font-extrabold transition-colors ${selected
                                    ? "border-primary text-slate-900"
                                    : "border-transparent text-slate-400 hover:text-slate-700"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {detailTab === "details" ? (
                    <div id="listing-ad-details" role="tabpanel" className="pt-8">
                        <h2 className="text-xl font-extrabold text-slate-900">Ad Details</h2>
                        <div className="mt-6 grid gap-8 md:grid-cols-2 md:divide-x md:divide-slate-200">
                            {detailColumns.map((column, index) => (
                                <dl key={column[0]?.label ?? index} className={index === 1 ? "md:pl-10" : undefined}>
                                    {column.map((row) => (
                                        <div
                                            key={row.label}
                                            className="grid grid-cols-[minmax(7.5rem,10rem)_minmax(0,1fr)] gap-4 py-2.5"
                                        >
                                            <dt className="text-sm text-slate-500">{row.label}</dt>
                                            <dd className="text-sm font-bold wrap-break-word text-slate-900">
                                                {row.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div id="listing-description" role="tabpanel" className="pt-8">
                        <h2 className="text-xl font-extrabold text-slate-900">Description</h2>
                        <p className="mt-4 max-w-3xl text-[15px] leading-7 font-medium whitespace-pre-wrap text-slate-600">
                            {ad.description?.trim() || "No description provided."}
                        </p>
                    </div>
                )}

                <div className="mt-10 pb-4">
                    <div className="overflow-hidden rounded-[1.75rem] bg-slate-50 p-5 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
                                    <ShieldCheck className="h-5 w-5" />
                                </span>
                                <div>
                                    <h2 className="font-heading text-xl font-extrabold tracking-tight text-slate-900">
                                        Deal with confidence
                                    </h2>
                                    <p className=" text-sm font-medium text-slate-500">
                                        A few habits that keep every meetup safe.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/safety"
                                className="inline-flex items-center gap-1 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-slate-200 transition hover:bg-primary/5"
                            >
                                Safety tips
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                            {BUYER_GUIDELINES.map((tip) => (
                                <li
                                    key={tip.title}
                                    className="flex items-start gap-3 rounded-2xl bg-white p-4 "
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <tip.icon className="h-4 w-4" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-900">{tip.title}</p>
                                        <p className="mt-1 text-sm leading-5 font-medium text-slate-500">{tip.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-100 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
                <div className="mx-auto flex max-w-lg gap-2">
                    <GlowButton
                        type="button"
                        onClick={() => createNewChat.mutate(id)}
                        disabled={isSold || createNewChat.isPending}
                        className="flex-1"
                        size="lg"
                        fullWidth
                    >
                        <MessageCircle className="h-4 w-4" />
                        Chat
                    </GlowButton>
                    <a
                        href={isSold || !ad.mobileNumber ? undefined : `tel:${ad.mobileNumber}`}
                        aria-disabled={isSold || !ad.mobileNumber}
                        className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 text-sm font-bold text-white ${isSold || !ad.mobileNumber
                            ? "pointer-events-none cursor-not-allowed opacity-50"
                            : ""
                            }`}
                    >
                        <Phone className="h-4 w-4" />
                        Call
                    </a>
                </div>
            </div>

            <AnimatePresence>
                {lightboxOpen && images[safeActive] ? (
                    <motion.div
                        key="listing-lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-10000 flex flex-col bg-black"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Image gallery"
                    >
                        <button
                            type="button"
                            aria-label="Close gallery backdrop"
                            className="absolute inset-0 cursor-default"
                            onClick={() => setLightboxOpen(false)}
                        />

                        <div className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-6">
                            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
                                {safeActive + 1} / {images.length}
                            </span>
                            <button
                                type="button"
                                onClick={() => setLightboxOpen(false)}
                                aria-label="Close gallery"
                                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-12 sm:px-16">
                            <div
                                className="relative h-full w-full max-w-6xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src={images[safeActive]}
                                    alt={`${ad.title} — photo ${safeActive + 1}`}
                                    fill
                                    priority
                                    sizes="100vw"
                                    className="object-contain"
                                />
                            </div>

                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={prev}
                                        aria-label="Previous image"
                                        className="absolute top-1/2 left-3 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 sm:left-5"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={next}
                                        aria-label="Next image"
                                        className="absolute top-1/2 right-3 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 sm:right-5"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="relative z-10 flex justify-center gap-2 overflow-x-auto px-4 py-4 scrollbar-hide">
                                {images.map((src, i) => (
                                    <button
                                        key={`lightbox-${src}-${i}`}
                                        type="button"
                                        onClick={() => setActive(i)}
                                        aria-label={`Show image ${i + 1}`}
                                        className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg transition ${safeActive === i
                                            ? "ring-2 ring-white ring-offset-2 ring-offset-black"
                                            : "opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <Image src={src} alt="" fill sizes="56px" className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
