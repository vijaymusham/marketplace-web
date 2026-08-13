"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatSoldAtTimestamp, getMyAds, updateAds } from "@/components/api/apis";
import MyAdsCard, { type MyAd, type MyAdStatus } from "@/components/my-ads/MyAdsCard";
import { MyAdCardSkeleton } from "@/components/ui/Skeleton";
import GlowButton from "@/components/ui/GlowButton";

type Filter = "all" | "active" | "inactive" | "pending" | "moderated";

const TABS: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
    { key: "pending", label: "Pending" },
    { key: "moderated", label: "Moderated" },
];

function formatPrice(price: number, currency?: string) {
    const symbol = currency === "INR" || !currency ? "₹" : `${currency} `;
    return `${symbol} ${price.toLocaleString("en-IN")}`;
}

function formatRailDate(value?: string) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d
        .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "2-digit" })
        .replace(",", "")
        .toUpperCase();
}

function normalizeStatus(raw?: string): MyAdStatus {
    const s = (raw ?? "").toLowerCase();
    if (s.includes("active") && !s.includes("inactive")) return "active";
    if (s.includes("pending")) return "pending";
    if (s.includes("moderat")) return "moderated";
    if (s.includes("sold")) return "sold";
    if (s.includes("expir")) return "expired";
    if (s.includes("inactive") || s.includes("reject") || s.includes("closed")) return "inactive";
    return "inactive";
}

function mapApiAds(payload: unknown): MyAd[] {
    const list = Array.isArray(payload)
        ? payload
        : payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)
            ? (payload as { data: unknown[] }).data
            : [];

    return list
        .map((item) => {
            if (!item || typeof item !== "object") return null;
            const ad = item as Record<string, unknown>;
            const id = String(ad.id ?? "");
            if (!id) return null;

            const images = ad.images;
            const cover =
                (typeof ad.imageUrl === "string" && ad.imageUrl) ||
                (typeof ad.image === "string" && ad.image) ||
                (Array.isArray(images) &&
                    images[0] &&
                    typeof images[0] === "object" &&
                    typeof (images[0] as { url?: string }).url === "string" &&
                    (images[0] as { url: string }).url) ||
                "https://loremflickr.com/480/440/product/all?lock=1";

            const priceNum = typeof ad.price === "number" ? ad.price : Number(ad.price);
            const hasSoldAt =
                (typeof ad.soldAt === "string" && ad.soldAt.length > 0) ||
                ad.soldAt instanceof Date;
            const status = hasSoldAt
                ? "sold"
                : normalizeStatus(
                    typeof ad.status === "string"
                        ? ad.status
                        : typeof ad.adStatus === "string"
                            ? ad.adStatus
                            : undefined,
                );

            const created =
                (typeof ad.createdAt === "string" && ad.createdAt) ||
                (typeof ad.postedAt === "string" && ad.postedAt) ||
                undefined;
            const expires =
                (typeof ad.expiresAt === "string" && ad.expiresAt) ||
                (typeof ad.toDate === "string" && ad.toDate) ||
                undefined;

            const mapped: MyAd = {
                id,
                title: typeof ad.title === "string" ? ad.title : "Untitled ad",
                price:
                    typeof ad.price === "string" && ad.price.includes("₹")
                        ? ad.price
                        : formatPrice(
                            Number.isFinite(priceNum) ? priceNum : 0,
                            typeof ad.currency === "string" ? ad.currency : "INR"
                        ),
                image: cover as string,
                status,
                fromDate: formatRailDate(created),
                toDate: formatRailDate(expires),
                views: typeof ad.views === "number" ? ad.views : typeof ad.viewCount === "number" ? ad.viewCount : 0,
                likes: typeof ad.likes === "number" ? ad.likes : typeof ad.likeCount === "number" ? ad.likeCount : 0,
            };

            if (status === "sold") {
                mapped.message = "Marked as sold. Buyers can no longer contact you on this ad.";
            } else if (status === "expired") {
                mapped.message = "This ad was expired. If you sold it, please mark it as sold.";
            } else if (status === "pending") {
                mapped.message = "Your ad is under review and will go live once approved.";
            } else if (status === "moderated") {
                mapped.message = "This ad needs changes before it can be shown again.";
            }

            return mapped;
        })
        .filter((ad): ad is MyAd => ad !== null);
}

function matchesFilter(ad: MyAd, filter: Filter) {
    if (filter === "all") return true;
    if (filter === "inactive") return ad.status === "inactive" || ad.status === "expired" || ad.status === "sold";
    return ad.status === filter;
}

export default function MyAdsPage() {
    const [filter, setFilter] = useState<Filter>("all");
    const [markingSoldId, setMarkingSoldId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data: ads, isLoading } = useQuery({
        queryKey: ["my-ads"],
        queryFn: getMyAds,
    });

    const sourceAds = useMemo(() => mapApiAds(ads), [ads]);

    const visibleAds = useMemo(
        () => sourceAds.filter((ad) => matchesFilter(ad, filter)),
        [sourceAds, filter],
    );

    const handleMarkSold = async (id: string) => {
        if (markingSoldId) return;
        setMarkingSoldId(id);
        try {
            await updateAds(id, { soldAt: formatSoldAtTimestamp() });
            await queryClient.invalidateQueries({ queryKey: ["my-ads"] });
            toast.success("Marked as sold");
        } catch {
            toast.error("Failed to mark as sold");
        } finally {
            setMarkingSoldId(null);
        }
    };

    return (
        <main className="flex-1 bg-white">
            <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-8 md:py-10 lg:px-8">
                <Link
                    href="/"
                    className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 transition-colors hover:text-primary sm:hidden"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2.25} />
                    Go back
                </Link>

                <header className="mb-5 border-b border-slate-200 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                        <div className="pb-3 sm:pb-5">
                            <h1 className="font-heading text-xl font-extrabold tracking-tight text-slate-900 sm:mt-1 sm:text-3xl">
                                My Ads
                            </h1>
                            <p className="mt-1 text-[12px] font-medium text-slate-500 sm:mt-1.5 sm:text-sm">
                                {sourceAds.length} listing{sourceAds.length === 1 ? "" : "s"} total
                            </p>
                        </div>

                        <nav
                            aria-label="Ad status"
                            className="min-w-0 -mx-4 overflow-x-auto overscroll-x-contain px-4 scrollbar-hide sm:mx-0 sm:overflow-visible sm:px-0 sm:flex sm:justify-end"
                        >
                            <div className="flex w-max gap-1.5 pb-3 sm:gap-1 sm:pb-px">
                                {TABS.map(({ key, label }) => {
                                    const active = filter === key;
                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setFilter(key)}
                                            className={`relative shrink-0 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors sm:rounded-none sm:px-3.5 sm:py-3 sm:text-sm ${active
                                                ? "bg-primary/10 text-primary sm:bg-transparent"
                                                : "bg-slate-100 text-slate-500 hover:text-slate-700 sm:bg-transparent sm:text-slate-400"
                                                }`}
                                        >
                                            {label}
                                            {active && (
                                                <span className="absolute inset-x-2 bottom-0 hidden h-0.5 rounded-full bg-primary sm:block" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </nav>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex flex-col gap-4" aria-busy>
                        {Array.from({ length: 3 }, (_, i) => (
                            <MyAdCardSkeleton key={i} />
                        ))}
                    </div>
                ) : visibleAds.length === 0 ? (
                    <div className="border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center rounded-2xl">
                        <h2 className="font-heading text-xl font-extrabold text-slate-900">
                            {sourceAds.length > 0 ? "No ads in this tab" : "No ads yet"}
                        </h2>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                            {sourceAds.length > 0
                                ? "Try another tab to see your other listings."
                                : "Post a listing with Sell Now to see it here."}
                        </p>
                        {sourceAds.length === 0 && (
                            <GlowButton href="/" className="mt-6">
                                Go to home
                            </GlowButton>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {visibleAds.map((ad, index) => (
                            <MyAdsCard
                                key={ad.id}
                                ad={ad}
                                index={index}
                                onMarkSold={handleMarkSold}
                                isMarkingSold={markingSoldId === ad.id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
