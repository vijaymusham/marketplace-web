"use client";
import { useState } from "react";
import { Caveat } from "next/font/google";
import { useSelector } from "react-redux";
import SellForm from "@/components/sell-drawer/SellForm";
import { requestSignIn } from "@/lib/auth-events";
import type { RootState } from "@/components/redux/store";
import { Quote } from "lucide-react";
import GlowButton from "../ui/GlowButton";

const caveat = Caveat({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
    display: "swap",
});

/** Exact purple sampled from the reference screenshot */
const CTA_BG = "#6702E6";

const FEATURES = [
    "Browse fresh local listings near you every day",
    "Post ads free and reach serious buyers fast",
    "Chat safely and close deals with confidence",
];

function HeartOutline({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className={className}
        >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
            className={className}
        >
            <path
                d="M4.5 10.5 8 14l7.5-8.5"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}


export default function CtaSection() {
    const [sellOpen, setSellOpen] = useState(false);
    const authData = useSelector((state: RootState) => state.user.user);
    const isLoggedIn = Boolean(authData?.accessToken);

    const handleCta = () => {
        if (!isLoggedIn) {
            requestSignIn();
            return;
        }
        setSellOpen(true);
    };

    return (
        <section
            className="relative z-0 overflow-hidden md:-mb-8"
            style={{ backgroundColor: CTA_BG }}
        >
            <Quote className="pointer-events-none absolute -top-4 -left-2 size-36 text-white/15 sm:top-6 sm:left-2 sm:size-48 md:left-8 md:size-56 lg:left-14 lg:size-44" strokeWidth={1.1} fill="none" />

            {/* Decorative heart — bottom right */}
            <HeartOutline className="pointer-events-none absolute -right-10 -bottom-12 size-52 text-white/15 sm:-right-6 sm:-bottom-20 sm:size-64 md:right-0 md:size-72 lg:right-6 lg:size-80" />

            <div className="relative z-10 mx-auto flex w-full flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20 md:py-24 lg:py-26">
                <p
                    className={`${caveat.className} text-[1.55rem] leading-none text-white sm:text-[1.85rem] md:text-[2.05rem]`}
                >
                    Buying &amp; selling made easy
                </p>

                <h2 className="mt-3 max-w-[20ch] text-balance font-heading text-[1.7rem] font-extrabold leading-[1.12] tracking-tight text-white sm:mt-4 sm:max-w-none sm:text-[2.35rem] md:text-[2.75rem] md:leading-[1.1]">
                    Ready to find great deals in your city?
                </h2>

                <p className="mt-3.5 max-w-136 text-pretty text-[13.5px] leading-[1.55] text-white/95 sm:mt-5 sm:text-[15.5px] sm:leading-relaxed md:text-base">
                    Set up in minutes and discover how easy it is to buy, sell, and
                    connect with people nearby — without the usual marketplace stress.
                </p>

                <ul className="mt-6 flex w-full max-w-88 flex-col items-stretch gap-2.5 text-left sm:mt-8 sm:max-w-104 sm:gap-3">
                    {FEATURES.map((feature) => (
                        <li
                            key={feature}
                            className="flex items-start gap-2.5 text-[13px] leading-snug text-white sm:gap-3 sm:text-[15px]"
                        >
                            <CheckIcon className="mt-px size-4 shrink-0 text-white sm:mt-0.5 sm:size-4.5" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>

                <GlowButton
                    onClick={handleCta}
                    className="mt-7 text-white font-heading text-[16px] font-extrabold tracking-tight"
                    variant="sell"
                    size="lg"
                >
                    Start for free today
                </GlowButton>
            </div>

            <SellForm open={sellOpen} onClose={() => setSellOpen(false)} />
        </section>
    );
}
