"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { normalizeApiCategories } from "@/lib/apiCategories";
import { slugify } from "@/lib/slug";
import { getSubcategoryIcon } from "@/lib/subcategory-icons";
import { getCategories } from "../api/apis";
import { SubcategoryTabsSkeleton } from "@/components/ui/Skeleton";

export default function SubcategoryTabs({
    categoryName,
    activeSubcategory,
}: {
    categoryName: string;
    activeSubcategory?: string;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const { data: apiCategories, isPending } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const categories = normalizeApiCategories(apiCategories);
    const category = categories.find(
        (c) =>
            c.name === categoryName ||
            slugify(c.name) === slugify(categoryName) ||
            c.slug === slugify(categoryName),
    );

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) {
            setCanScrollNext(false);
            return;
        }
        const maxScroll = el.scrollWidth - el.clientWidth;
        const hasOverflow = maxScroll > 2;
        const notAtEnd = el.scrollLeft < maxScroll - 2;
        setCanScrollNext(hasOverflow && notAtEnd);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        updateScrollState();

        const onScroll = () => updateScrollState();
        el.addEventListener("scroll", onScroll, { passive: true });

        const resizeObserver = new ResizeObserver(() => updateScrollState());
        resizeObserver.observe(el);
        if (el.firstElementChild) resizeObserver.observe(el.firstElementChild);

        window.addEventListener("resize", updateScrollState);

        return () => {
            el.removeEventListener("scroll", onScroll);
            resizeObserver.disconnect();
            window.removeEventListener("resize", updateScrollState);
        };
    }, [updateScrollState, categoryName, category?.subcategories.length]);

    if (isPending && !category) return <SubcategoryTabsSkeleton />;
    if (!category) return null;
    const CategoryIcon = category.icon;

    const scrollNext = () => {
        scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });
    };

    const categoryHref = category.id
        ? `/category/${slugify(category.name)}?categoryId=${category.id}`
        : `/category/${slugify(category.name)}`;

    return (
        <nav className="border-b border-slate-200 bg-white/85 backdrop-blur-2xl">
            <div className="relative mx-auto flex max-w-7xl flex-col items-stretch gap-1 px-3 sm:flex-row sm:gap-0 sm:space-x-4 sm:px-6 lg:px-8">
                <Link
                    href={categoryHref}
                    className="flex shrink-0 items-center gap-2.5 py-3 pr-2 transition-opacity hover:opacity-80 sm:pr-6"
                >
                    <CategoryIcon className="h-9 w-9 shrink-0 text-slate-800 sm:h-11 sm:w-11 md:h-13 md:w-13" />
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                            Category
                        </p>
                        <h2 className="truncate font-heading text-sm font-extrabold text-slate-900 sm:text-base">
                            {category.name}
                        </h2>
                    </div>
                </Link>

                <div
                    ref={scrollRef}
                    className="h-24 overflow-x-auto scroll-smooth scrollbar-hide sm:h-28"
                >
                    <ul className="mx-auto flex h-full w-max items-stretch gap-1 sm:gap-2">
                        {category.subcategoryItems.map((sub) => {
                            const Icon = getSubcategoryIcon(sub.name);
                            const active = sub.name === activeSubcategory;
                            const hrefParams = new URLSearchParams();
                            if (category.id) hrefParams.set("categoryId", category.id);
                            if (sub.id) hrefParams.set("subcategoryId", sub.id);
                            const query = hrefParams.toString();
                            return (
                                <li key={sub.id ?? sub.name} className="flex shrink-0">
                                    <Link
                                        href={`/category/${slugify(sub.name)}${query ? `?${query}` : ""}`}
                                        aria-current={active ? "page" : undefined}
                                        className={`group relative flex w-20 flex-col items-center justify-center gap-1 transition-colors sm:w-24 sm:gap-1.5 ${active
                                            ? "text-primary"
                                            : "text-slate-800 hover:text-primary"
                                            }`}
                                    >
                                        <Icon className="h-9 w-9 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 sm:h-10 sm:w-10 md:h-11 md:w-11" />
                                        <span className="line-clamp-2 text-center text-[11px] leading-tight font-semibold sm:text-xs">
                                            {sub.name}
                                        </span>
                                        <span
                                            className={`absolute inset-x-3 bottom-0 h-1 rounded-t-full bg-primary transition-opacity duration-200 ${active ? "opacity-100" : "opacity-0"
                                                }`}
                                        />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {canScrollNext && (
                    <button
                        type="button"
                        onClick={scrollNext}
                        aria-label="Show more subcategories"
                        className="absolute top-1/2 right-1 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-600 shadow-md ring-1 ring-slate-900/10 transition-colors hover:text-primary sm:h-9 sm:w-9"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                )}
            </div>
        </nav>
    );
}
