"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { normalizeApiCategories } from "@/lib/apiCategories";
import { slugify } from "@/lib/slug";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/apis";

const PANEL_WIDE = 560;
const PANEL_NARROW = 320;
const PANEL_MARGIN = 8;

const EASE = "ease-[cubic-bezier(0.2,0.8,0.2,1)]";

export default function CategoryTabs() {
    const [collapsed, setCollapsed] = useState(false);
    const [active, setActive] = useState(0);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [panel, setPanel] = useState({ left: 0, width: PANEL_NARROW });
    const [isTouch, setIsTouch] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const expandedScrollRef = useRef<HTMLDivElement>(null);
    const collapsedScrollRef = useRef<HTMLDivElement>(null);
    const collapsedRef = useRef(false);

    const { data: apiCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const categories = normalizeApiCategories(apiCategories);

    useEffect(() => {
        const mq = window.matchMedia("(hover: none), (pointer: coarse)");
        const update = () => setIsTouch(mq.matches || window.innerWidth < 1024);
        update();
        mq.addEventListener("change", update);
        window.addEventListener("resize", update);
        return () => {
            mq.removeEventListener("change", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const collapseAt = window.innerHeight * 0.28;
                const expandAt = Math.max(collapseAt - 140, 40);
                const next = collapsedRef.current
                    ? window.scrollY > expandAt
                    : window.scrollY > collapseAt;
                if (next !== collapsedRef.current) {
                    collapsedRef.current = next;
                    setCollapsed(next);
                    setOpenIndex(null);
                }
            });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(raf);
        };
    }, []);

    const openCategory = openIndex !== null ? categories[openIndex] ?? null : null;
    const OpenIcon = openCategory?.icon;

    const openTab = (index: number, target: HTMLElement) => {
        const container = containerRef.current;
        const category = categories[index];
        if (!container || !category) return;

        const containerRect = container.getBoundingClientRect();
        const width = isTouch
            ? containerRect.width - PANEL_MARGIN * 2
            : Math.min(
                category.subcategories.length > 6 ? PANEL_WIDE : PANEL_NARROW,
                containerRect.width - PANEL_MARGIN * 2,
            );
        const tabRect = target.getBoundingClientRect();
        const tabCenter = tabRect.left - containerRect.left + tabRect.width / 2;
        const left = isTouch
            ? PANEL_MARGIN
            : Math.min(
                Math.max(tabCenter - width / 2, PANEL_MARGIN),
                Math.max(containerRect.width - width - PANEL_MARGIN, PANEL_MARGIN),
            );

        setPanel({ left, width });
        setOpenIndex((prev) => (isTouch && prev === index ? null : index));
    };

    const scrollNext = () => {
        const el = collapsed ? collapsedScrollRef.current : expandedScrollRef.current;
        el?.scrollBy({ left: 320, behavior: "smooth" });
    };

    return (
        <>
            <nav
                onMouseLeave={() => {
                    if (!isTouch) setOpenIndex(null);
                }}
                className={`fixed inset-x-0 top-[6.75rem] z-20 border-b transition-[background-color,box-shadow,border-color] duration-300 lg:top-18 ${collapsed
                    ? "border-slate-200/70 bg-white/85 backdrop-blur-2xl"
                    : "border-slate-200 bg-white/85 backdrop-blur-2xl"
                    }`}
            >
                <div
                    ref={containerRef}
                    className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8"
                >
                    <div
                        className={`relative transition-[height] duration-300 ${EASE} ${collapsed ? "h-12" : "h-24 sm:h-28"
                            }`}
                    >
                        <div
                            className={`absolute inset-0 transition-[opacity,transform] duration-300 ${EASE} ${collapsed
                                ? "pointer-events-none -translate-y-3 opacity-0"
                                : "translate-y-0 opacity-100"
                                }`}
                            aria-hidden={collapsed}
                        >
                            <div
                                ref={expandedScrollRef}
                                className="h-full overflow-x-auto scroll-smooth scrollbar-hide"
                            >
                                <ul className="mx-auto flex h-full w-max items-stretch gap-1 sm:gap-2">
                                    {categories.map(({ id, name, icon: Icon }, index) => {
                                        const highlighted = openIndex === index || active === index;
                                        return (
                                            <li key={name} className="flex shrink-0">
                                                <Link
                                                    href={`/category/${slugify(name)}?categoryId=${id}`}
                                                    onMouseEnter={(e) => {
                                                        if (!isTouch) openTab(index, e.currentTarget);
                                                    }}
                                                    onFocus={(e) => {
                                                        if (!isTouch) openTab(index, e.currentTarget);
                                                    }}
                                                    onClick={(e) => {
                                                        if (isTouch && categories[index]?.subcategories.length) {
                                                            e.preventDefault();
                                                            openTab(index, e.currentTarget);
                                                        }
                                                        setActive(index);
                                                    }}
                                                    tabIndex={collapsed ? -1 : 0}
                                                    className={`group relative flex w-20 flex-col items-center justify-center gap-1 transition-colors sm:w-24 md:w-28 sm:gap-1.5 ${highlighted
                                                        ? "text-primary"
                                                        : "text-slate-800 hover:text-primary"
                                                        }`}
                                                >
                                                    <Icon className="h-9 w-9 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 sm:h-11 sm:w-11 md:h-13 md:w-13" />
                                                    <span className="line-clamp-2 text-center text-[11px] leading-tight font-semibold sm:text-xs md:text-[13px]">
                                                        {name}
                                                    </span>
                                                    <span
                                                        className={`absolute inset-x-3 bottom-0 h-1 rounded-t-full bg-primary transition-opacity duration-200 ${highlighted ? "opacity-100" : "opacity-0"
                                                            }`}
                                                    />
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>

                        <div
                            className={`absolute inset-0 transition-[opacity,transform] duration-300 ${EASE} ${collapsed
                                ? "translate-y-0 opacity-100"
                                : "pointer-events-none translate-y-3 opacity-0"
                                }`}
                            aria-hidden={!collapsed}
                        >
                            <div
                                ref={collapsedScrollRef}
                                className="h-full overflow-x-auto scroll-smooth scrollbar-hide"
                            >
                                <ul className="mx-auto flex h-full w-max items-stretch gap-4 px-1 sm:gap-5">
                                    {categories.map(({ name, icon: Icon }, index) => {
                                        const highlighted = openIndex === index || active === index;
                                        return (
                                            <li key={name} className="flex shrink-0">
                                                <Link
                                                    href={`/category/${slugify(name)}`}
                                                    onMouseEnter={(e) => {
                                                        if (!isTouch) openTab(index, e.currentTarget);
                                                    }}
                                                    onFocus={(e) => {
                                                        if (!isTouch) openTab(index, e.currentTarget);
                                                    }}
                                                    onClick={(e) => {
                                                        if (isTouch && categories[index]?.subcategories.length) {
                                                            e.preventDefault();
                                                            openTab(index, e.currentTarget);
                                                        }
                                                        setActive(index);
                                                    }}
                                                    tabIndex={collapsed ? 0 : -1}
                                                    className={`relative flex items-center gap-2 text-sm font-semibold whitespace-nowr ap transition-colors ${highlighted
                                                        ? "text-primary"
                                                        : "text-slate-600 hover:text-primary"
                                                        }`}
                                                >
                                                    <Icon className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
                                                    {name}
                                                    <ChevronDown
                                                        className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                    <span
                                                        className={`absolute inset-x-1 bottom-0 h-0.5 rounded-t-full bg-primary transition-opacity duration-200 ${highlighted ? "opacity-100" : "opacity-0"
                                                            }`}
                                                    />
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={scrollNext}
                        aria-label="Show more categories"
                        className={`absolute top-1/2 right-1 flex -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-600 shadow-md ring-1 ring-slate-900/10 transition-all duration-300 ${EASE} hover:text-primary ${collapsed ? "h-7 w-7" : "h-8 w-8 sm:h-9 sm:w-9"
                            }`}
                    >
                        <ChevronRight className={collapsed ? "h-4 w-4" : "h-5 w-5"} />
                    </button>

                    {openCategory && (
                        <div
                            style={{ left: panel.left, width: panel.width }}
                            className="absolute top-full max-h-[min(70vh,28rem)] overflow-y-auto rounded-b-2xl border border-t-0 border-slate-200/70 bg-white/95 p-4 shadow-xl backdrop-blur-2xl sm:p-6"
                        >
                            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                                <Link
                                    href={`/category/${slugify(openCategory.name)}`}
                                    className="flex min-w-0 items-center gap-2.5 transition-colors hover:text-primary"
                                    onClick={() => setOpenIndex(null)}
                                >
                                    {OpenIcon && <OpenIcon className="h-8 w-8 shrink-0 text-slate-800 sm:h-9 sm:w-9" />}
                                    <h3 className="truncate font-heading text-sm font-extrabold text-slate-900">
                                        {openCategory.name}
                                    </h3>
                                </Link>
                            </div>

                            <ul
                                className={`mt-3 gap-x-8 ${openCategory.subcategories.length > 6 && panel.width > 420
                                    ? "grid grid-cols-2"
                                    : "flex flex-col"
                                    }`}
                            >
                                {openCategory.subcategories.map((sub) => (
                                    <li key={sub}>
                                        <Link
                                            href={`/category/${slugify(sub)}`}
                                            onClick={() => setOpenIndex(null)}
                                            className="block py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:text-primary sm:py-2"
                                        >
                                            {sub}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </nav>
            {/* Backdrop for touch submenu */}
            {openCategory && isTouch && (
                <button
                    type="button"
                    aria-label="Close categories"
                    className="fixed inset-0 z-10 bg-transparent"
                    onClick={() => setOpenIndex(null)}
                />
            )}
            <div
                className={collapsed ? "h-12" : "h-24 sm:h-28"}
                aria-hidden="true"
            />
        </>
    );
}
