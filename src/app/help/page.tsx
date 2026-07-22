"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
    ChevronDown,
    HelpCircle,
    Mail,
    MessageCircleMore,
    Phone,
} from "lucide-react";

const easeSmooth = [0.22, 1, 0.36, 1] as const;

const FAQS = [
    {
        q: "How do I post an ad?",
        a: "Tap Sell Now in the navbar, choose a category, add photos and details, then submit. Your listing goes live after a quick review.",
    },
    {
        q: "How do I edit or mark an ad as sold?",
        a: "Open My Ads from your account menu. From there you can review status, views, and mark a listing as sold when the deal is done.",
    },
    {
        q: "Is DealMarket free to use?",
        a: "Browsing and posting basic ads is free. Optional promotions may be offered later to boost visibility.",
    },
    {
        q: "How do I stay safe while buying or selling?",
        a: "Meet in public places, never share OTPs or bank details in chat, and prefer cash-on-delivery or verified payment methods you trust.",
    },
    {
        q: "I can’t sign in — what should I do?",
        a: "Check your phone number and OTP. If the problem continues, clear site data or contact support with the number you used to register.",
    },
];

const CONTACTS = [
    {
        icon: Mail,
        title: "Email us",
        detail: "support@dealmarket.in",
        href: "mailto:support@dealmarket.in",
        hint: "We reply within 24 hrs",
    },
    {
        icon: Phone,
        title: "Call us",
        detail: "+91 1800-123-4567",
        href: "tel:+9118001234567",
        hint: "Mon–Sat, 9am–7pm",
    },
    {
        icon: MessageCircleMore,
        title: "In-app chat",
        detail: "Message sellers",
        href: "/chats",
        hint: "Fastest for deals",
    },
];

function FadeUp({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    const reduce = useReducedMotion();
    if (reduce) return <div className={className}>{children}</div>;

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: easeSmooth, delay }}
        >
            {children}
        </motion.div>
    );
}

export default function HelpPage() {
    const [open, setOpen] = useState(0);
    const reduce = useReducedMotion();

    return (
        <main className="relative flex-1 overflow-hidden bg-white">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-primary/8 via-primary/3 to-transparent"
            />

            <div className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
                <FadeUp>
                    <header className="mb-10">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                            <HelpCircle className="h-3.5 w-3.5" />
                            Support center
                        </span>
                        <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Help & support
                        </h1>
                        <p className="mt-2 max-w-lg text-sm leading-relaxed font-medium text-slate-500 sm:text-[15px]">
                            Find quick answers, or reach our team — we&apos;re here to keep your deals smooth.
                        </p>
                    </header>
                </FadeUp>

                <FadeUp delay={0.08} className="mb-12">
                    <div className="grid gap-3 sm:grid-cols-3">
                        {CONTACTS.map(({ icon: Icon, title, detail, href, hint }, i) => (
                            <motion.div
                                key={title}
                                initial={reduce ? false : { opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: easeSmooth, delay: 0.12 + i * 0.07 }}
                            >
                                <Link
                                    href={href}
                                    className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-colors duration-300 hover:border-primary/35 hover:bg-primary/3"
                                >
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                                        <Icon className="h-5 w-5" strokeWidth={1.85} />
                                    </span>
                                    <p className="mt-4 text-sm font-extrabold text-slate-900">{title}</p>
                                    <p className="mt-1 text-xs font-semibold text-primary">{detail}</p>
                                    <p className="mt-auto pt-3 text-[11px] font-medium text-slate-400">{hint}</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </FadeUp>

                <FadeUp delay={0.18}>
                    <section>
                        <div className="mb-5">
                            <p className="text-xs font-bold tracking-wide text-primary uppercase">FAQ</p>
                            <h2 className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-slate-900">
                                Frequently asked
                            </h2>
                            <p className="mt-1 text-sm font-medium text-slate-500">
                                Tap a question to expand the answer.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            {FAQS.map((item, i) => {
                                const isOpen = open === i;
                                const n = String(i + 1).padStart(2, "0");

                                return (
                                    <motion.div
                                        key={item.q}
                                        initial={reduce ? false : { opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.45, ease: easeSmooth, delay: 0.22 + i * 0.05 }}
                                        className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${isOpen
                                                ? "border-primary/25 bg-primary/3"
                                                : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                    >
                                        <button
                                            type="button"
                                            aria-expanded={isOpen}
                                            onClick={() => setOpen(isOpen ? -1 : i)}
                                            className="flex w-full items-center gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5"
                                        >
                                            <span
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold transition-colors duration-300 ${isOpen
                                                        ? "bg-primary text-white"
                                                        : "bg-slate-100 text-slate-500"
                                                    }`}
                                            >
                                                {n}
                                            </span>

                                            <span
                                                className={`min-w-0 flex-1 text-sm font-bold transition-colors duration-300 sm:text-[15px] ${isOpen ? "text-primary" : "text-slate-800"
                                                    }`}
                                            >
                                                {item.q}
                                            </span>

                                            <span
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${isOpen
                                                        ? "rotate-180 bg-primary/10 text-primary"
                                                        : "bg-slate-100 text-slate-400"
                                                    }`}
                                            >
                                                <ChevronDown className="h-4 w-4" />
                                            </span>
                                        </button>

                                        <div
                                            className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                                }`}
                                        >
                                            <div className="min-h-0 overflow-hidden">
                                                <div
                                                    className={`px-4 pb-5 transition-opacity duration-300 sm:px-5 sm:pl-17 ${isOpen ? "opacity-100 delay-75" : "opacity-0"
                                                        }`}
                                                >
                                                    <p className="text-sm leading-relaxed font-medium text-slate-500">
                                                        {item.a}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                </FadeUp>
            </div>
        </main>
    );
}
