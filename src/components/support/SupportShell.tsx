"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type SupportQuickLink = {
    id: string;
    label: string;
};

type SupportShellProps = {
    eyebrow?: string;
    title: string;
    description: string;
    lastUpdated?: string;
    links: SupportQuickLink[];
    children: React.ReactNode;
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function SupportShell({
    eyebrow = "DealPokket Support",
    title,
    description,
    lastUpdated,
    links,
    children,
}: SupportShellProps) {
    const reduce = useReducedMotion();
    const [activeId, setActiveId] = useState(links[0]?.id ?? "");

    useEffect(() => {
        const sections = links
            .map(({ id }) => document.getElementById(id))
            .filter((el): el is HTMLElement => Boolean(el));

        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]?.target.id) {
                    setActiveId(visible[0].target.id);
                }
            },
            {
                rootMargin: "-22% 0px -55% 0px",
                threshold: [0.12, 0.4, 0.65],
            },
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [links]);

    function scrollToSection(id: string) {
        setActiveId(id);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return (
        <main className="relative flex-1 bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 md:py-10 lg:px-8">
                <motion.header
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease }}
                    className="relative rounded-[1.5rem] bg-white px-5 py-8 sm:rounded-[1.75rem] sm:px-9 sm:py-10 md:px-11 md:py-12"
                >
                    <div className="relative">
                        <p className="text-[11px] font-bold tracking-[0.16em] text-primary uppercase">
                            {eyebrow}
                        </p>
                        <h1 className="mt-3 max-w-3xl font-heading text-[1.85rem] leading-[1.15] font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
                            {title}
                        </h1>
                        <p className="mt-3.5 max-w-2xl text-sm leading-relaxed font-medium text-slate-500 sm:mt-4 sm:text-[15px] sm:leading-7">
                            {description}
                        </p>
                        {lastUpdated ? (
                            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f3f4f8] px-3.5 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                                <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                                    Updated {lastUpdated}
                                </p>
                            </div>
                        ) : null}
                    </div>
                </motion.header>

                {/* Mobile quick links — sticky under navbar */}
                <nav
                    aria-label="On this page"
                    className="sticky top-[6.75rem] z-20 -mx-4 mt-5 bg-slate-50/95 px-4 py-2.5 backdrop-blur-md sm:-mx-6 sm:px-6 lg:top-18 lg:hidden"
                >
                    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {links.map(({ id, label }) => {
                            const active = activeId === id;
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => scrollToSection(id)}
                                    className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-colors duration-200 ${active
                                            ? "bg-primary text-white"
                                            : "bg-white text-slate-600 active:bg-primary/10"
                                        }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 lg:mt-5 lg:grid-cols-[248px_minmax(0,1fr)] lg:items-start lg:gap-5 xl:grid-cols-[268px_minmax(0,1fr)]">
                    {/* Desktop quick links — sticky while content scrolls */}
                    <aside className="hidden self-start lg:sticky lg:top-24 lg:block lg:z-10">
                        <nav
                            aria-label="On this page"
                            className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[1.5rem] bg-white p-5 xl:p-6"
                        >
                            <p className="px-2.5 text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
                                Quick links
                            </p>
                            <ul className="mt-3.5 space-y-1">
                                {links.map(({ id, label }) => {
                                    const active = activeId === id;
                                    return (
                                        <li key={id}>
                                            <button
                                                type="button"
                                                onClick={() => scrollToSection(id)}
                                                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors duration-200 ${active
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-slate-500 hover:bg-[#f4f5f8] hover:text-slate-800"
                                                    }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${active ? "bg-primary" : "bg-slate-300"
                                                        }`}
                                                    aria-hidden
                                                />
                                                {label}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </aside>

                    <div className="flex min-w-0 flex-col gap-3.5 sm:gap-4">{children}</div>
                </div>
            </div>
        </main>
    );
}

export function SupportSection({
    id,
    number,
    title,
    children,
}: {
    id: string;
    number: number;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section
            id={id}
            className="scroll-mt-36 rounded-[1.35rem] bg-white px-5 py-6 sm:scroll-mt-28 sm:rounded-[1.5rem] sm:px-7 sm:py-8 md:px-8"
        >
            <div className="mb-4 flex items-start gap-3 sm:mb-5 sm:items-center sm:gap-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-xs font-extrabold text-primary sm:h-9 sm:w-9 sm:text-sm">
                    {number}
                </span>
                <h2 className="pt-0.5 font-heading text-base font-extrabold tracking-tight text-slate-900 sm:pt-0 sm:text-lg md:text-xl">
                    {title}
                </h2>
            </div>
            <div className="space-y-3.5 text-sm leading-relaxed font-medium text-slate-500 sm:text-[15px] sm:leading-7">
                {children}
            </div>
        </section>
    );
}

export function SupportList({ items }: { items: string[] }) {
    return (
        <ul className="space-y-3">
            {items.map((item) => (
                <li key={item} className="flex gap-3">
                    <span
                        className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50"
                        aria-hidden
                    />
                    <span className="text-slate-600">{item}</span>
                </li>
            ))}
        </ul>
    );
}

export function SupportTile({
    icon: Icon,
    title,
    detail,
    href,
}: {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    title: string;
    detail: string;
    href: string;
}) {
    return (
        <a
            href={href}
            className="group flex flex-col rounded-[1.25rem] bg-[#f3f4f8] p-4 transition-colors duration-200 hover:bg-primary/8 sm:p-5"
        >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Icon className="h-5 w-5" strokeWidth={1.85} />
            </span>
            <p className="mt-3.5 text-sm font-extrabold text-slate-900">{title}</p>
            <p className="mt-1 text-xs font-semibold break-all text-primary sm:text-[13px]">
                {detail}
            </p>
        </a>
    );
}
