"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, CheckCircle2, Eye, Heart } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";

export type MyAdStatus =
    | "active"
    | "inactive"
    | "pending"
    | "moderated"
    | "expired"
    | "sold";

export type MyAd = {
    id: string;
    title: string;
    price: string;
    image: string;
    status: MyAdStatus;
    fromDate: string;
    toDate: string;
    views: number;
    likes: number;
    message?: string;
};

const STATUS: Record<
    MyAdStatus,
    { label: string; tone: string; dot: string }
> = {
    active: {
        label: "Active",
        tone: "bg-emerald-50 text-emerald-700",
        dot: "bg-emerald-500",
    },
    pending: {
        label: "Pending",
        tone: "bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
    },
    moderated: {
        label: "Moderated",
        tone: "bg-slate-100 text-slate-600",
        dot: "bg-slate-400",
    },
    sold: {
        label: "Sold",
        tone: "bg-rose-50 text-rose-700",
        dot: "bg-rose-500",
    },
    inactive: {
        label: "Inactive",
        tone: "bg-rose-50 text-rose-600",
        dot: "bg-rose-500",
    },
    expired: {
        label: "Expired",
        tone: "bg-rose-50 text-rose-600",
        dot: "bg-rose-500",
    },
};

const easeSmooth = [0.22, 1, 0.36, 1] as const;

export default function MyAdsCard({
    ad,
    onMarkSold,
    index = 0,
    isMarkingSold = false,
}: {
    ad: MyAd;
    onMarkSold: (id: string) => void;
    index?: number;
    isMarkingSold?: boolean;
}) {
    const style = STATUS[ad.status];
    const reduce = useReducedMotion();
    const delay = Math.min(index, 8) * 0.06;
    const isSold = ad.status === "sold";

    return (
        <motion.article
            initial={reduce ? false : { opacity: 0, y: 20, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: easeSmooth, delay }}
            aria-disabled={isSold || undefined}
            className={`overflow-hidden rounded-2xl border bg-white transition-colors ${isSold
                    ? "cursor-not-allowed border-rose-200 bg-rose-50/30 opacity-75"
                    : "border-slate-200 hover:border-primary/30 hover:bg-slate-50/40"
                }`}
        >
            <div className="grid grid-cols-1 md:grid-cols-[9.5rem_1fr]">
                {isSold ? (
                    <div className="relative aspect-16/10 bg-slate-100 md:aspect-auto md:min-h-full">
                        <Image
                            src={ad.image || "/no_image.jpeg"}
                            alt={ad.title}
                            fill
                            sizes="(min-width: 768px) 152px, 100vw"
                            className="object-cover grayscale"
                        />
                        <span className="absolute inset-0 bg-rose-900/15" aria-hidden />
                    </div>
                ) : (
                    <Link
                        href={`/listing/${ad.id}`}
                        className="relative aspect-16/10 bg-slate-100 md:aspect-auto md:min-h-full"
                    >
                        <Image
                            src={ad.image || "/no_image.jpeg"}
                            alt={ad.title}
                            fill
                            sizes="(min-width: 768px) 152px, 100vw"
                            className="object-cover"
                        />
                    </Link>
                )}

                <div className="flex min-w-0 flex-col p-3.5 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold ${style.tone}`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                                    {style.label}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                                    <CalendarDays className="h-3 w-3" />
                                    {ad.fromDate} → {ad.toDate}
                                </span>
                            </div>

                            {isSold ? (
                                <h3 className="line-clamp-2 text-[15px] leading-snug font-bold text-slate-700">
                                    {ad.title}
                                </h3>
                            ) : (
                                <Link
                                    href={`/listing/${ad.id}`}
                                    className="line-clamp-2 text-[15px] leading-snug font-bold text-slate-900 hover:text-primary"
                                >
                                    {ad.title}
                                </Link>
                            )}
                            <p
                                className={`mt-1.5 text-lg font-extrabold tracking-tight sm:text-xl ${isSold ? "text-rose-700" : "text-slate-900"
                                    }`}
                            >
                                {ad.price}
                            </p>
                        </div>
                    </div>

                    {ad.message && (
                        <p
                            className={`mt-3 border-l-2 px-3 py-2 text-xs leading-relaxed font-medium ${isSold
                                    ? "border-rose-500 bg-rose-50 text-rose-700"
                                    : "border-primary/50 bg-primary/5 text-slate-600"
                                }`}
                        >
                            {ad.message}
                        </p>
                    )}

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2.5 pt-3 sm:gap-3 sm:pt-4">
                        <div
                            className={`flex items-center gap-4 text-xs font-semibold ${isSold ? "text-slate-400" : "text-slate-500"
                                }`}
                        >
                            <span className="inline-flex items-center gap-1.5">
                                <Eye className="h-3.5 w-3.5 text-slate-400" />
                                {ad.views} views
                            </span>
                            <span
                                className={`inline-flex items-center gap-1.5 ${isSold ? "opacity-50" : ""}`}
                                aria-disabled={isSold || undefined}
                            >
                                <Heart
                                    className={`h-3.5 w-3.5 ${isSold ? "text-rose-300" : "text-slate-400"}`}
                                />
                                {ad.likes} likes
                            </span>
                        </div>

                        {isSold ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Sold
                            </span>
                        ) : (
                            <GlowButton
                                type="button"
                                disabled={isMarkingSold}
                                onClick={() => onMarkSold(ad.id)}
                                size="sm"
                            >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {isMarkingSold ? "Updating…" : "Mark as sold"}
                            </GlowButton>
                        )}
                    </div>
                </div>
            </div>
        </motion.article>
    );
}
