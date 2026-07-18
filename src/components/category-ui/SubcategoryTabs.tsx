"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { categories } from "@/lib/categories";
import { slugify } from "@/lib/slug";
import { getSubcategoryIcon } from "@/lib/subcategory-icons";

export default function SubcategoryTabs({
    categoryName,
    activeSubcategory,
}: {
    categoryName: string;
    activeSubcategory: string;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const category = categories.find((c) => c.name === categoryName);
    if (!category) return null;
    const CategoryIcon = category.icon;

    const scrollNext = () => {
        scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });
    };

    return (
        <nav className="border-b border-slate-200 bg-white/85 backdrop-blur-2xl">
            <div className="relative mx-auto flex max-w-7xl items-stretch px-4 sm:px-6 lg:px-8 space-x-4">
                {/* main category */}
                <div className="flex shrink-0 items-center gap-2.5  py-3 pr-4 sm:pr-6">
                    <CategoryIcon className="h-11 w-11 shrink-0 text-slate-800 sm:h-13 sm:w-13" />
                    <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                            Category
                        </p>
                        <h2 className="font-heading text-sm font-extrabold whitespace-nowrap text-slate-900 sm:text-base">
                            {category.name}
                        </h2>
                    </div>
                </div>

                {/* subcategory tabs */}
                <div
                    ref={scrollRef}
                    className="h-28  overflow-x-auto scroll-smooth scrollbar-hide"
                >
                    <ul className="mx-auto flex h-full w-max items-stretch gap-1 sm:gap-2">
                        {category.subcategories.map((sub) => {
                            const Icon = getSubcategoryIcon(sub);
                            const active = sub === activeSubcategory;
                            return (
                                <li key={sub} className="flex shrink-0">
                                    <Link
                                        href={`/category/${slugify(sub)}`}
                                        aria-current={active ? "page" : undefined}
                                        className={`group relative flex w-24 flex-col items-center justify-center gap-1.5 transition-colors sm:w-28 ${active
                                            ? "text-primary"
                                            : "text-slate-800 hover:text-primary"
                                            }`}
                                    >
                                        <Icon
                                            strokeWidth={1.5}
                                            className="h-8 w-8 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 sm:h-7 sm:w-7"
                                        />
                                        <span className="text-center text-xs leading-tight font-semibold whitespace-normal sm:text-xs">
                                            {sub}
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

                <button
                    onClick={scrollNext}
                    aria-label="Show more subcategories"
                    className="absolute top-1/2 right-1 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-600 shadow-md ring-1 ring-slate-900/10 transition-colors hover:text-primary md:flex"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </nav>
    );
}
