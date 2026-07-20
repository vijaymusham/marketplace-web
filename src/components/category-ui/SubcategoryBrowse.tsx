"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CategorySidebar from "@/components/category-ui/CategorySidebar";
import ListCard from "@/components/category-ui/ListCard";
import SubcategoryTabs from "@/components/category-ui/SubcategoryTabs";
import type { Listing } from "@/lib/listings";
import { Enter, Stagger, StaggerItem } from "@/components/animations/Motion";

const PAGE_SIZE = 12;

export default function SubcategoryBrowse({
    categoryName,
    subcategories,
    activeSubcategory,
    listings,
}: {
    categoryName: string;
    subcategories: string[];
    activeSubcategory: string;
    listings: Listing[];
}) {
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(listings.length / PAGE_SIZE));

    useEffect(() => {
        setPage(1);
    }, [activeSubcategory]);

    const visible = useMemo(
        () => listings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        [listings, page],
    );

    const goTo = (next: number) => {
        const clamped = Math.min(Math.max(next, 1), totalPages);
        if (clamped === page) return;
        setPage(clamped);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const pageNumbers = useMemo(() => buildPageNumbers(page, totalPages), [page, totalPages]);

    return (
        <>
            <SubcategoryTabs
                categoryName={categoryName}
                activeSubcategory={activeSubcategory}
            />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
                    <CategorySidebar
                        categoryName={categoryName}
                        subcategories={subcategories}
                        activeSubcategory={activeSubcategory}
                        totalCount={listings.length}
                    />

                    <div className="min-w-0 flex-1">
                        <Enter>
                            <header className="mb-6 md:mb-8">
                                <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                                    {activeSubcategory}
                                </h1>
                                <p className="mt-1.5 text-sm font-medium text-slate-500">
                                    {listings.length} products in {categoryName}
                                </p>
                            </header>
                        </Enter>

                        <Stagger
                            key={`${activeSubcategory}-${page}`}
                            className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-8"
                            stagger={0.07}
                        >
                            {visible.map((listing) => (
                                <StaggerItem key={listing.id} y={38}>
                                    <ListCard
                                        listing={listing}
                                        badge={activeSubcategory.split(" ")[0]}
                                    />
                                </StaggerItem>
                            ))}
                        </Stagger>

                        {totalPages > 1 && (
                            <nav
                                aria-label="Pagination"
                                className="mt-10 flex flex-wrap items-center justify-center gap-1 sm:gap-2"
                            >
                                <button
                                    type="button"
                                    onClick={() => goTo(page - 1)}
                                    disabled={page === 1}
                                    className="mr-1 flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </button>

                                {pageNumbers.map((n, i) =>
                                    n === "…" ? (
                                        <span
                                            key={`ellipsis-${i}`}
                                            className="px-1.5 text-sm font-medium text-slate-400"
                                        >
                                            …
                                        </span>
                                    ) : (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => goTo(n)}
                                            aria-current={n === page ? "page" : undefined}
                                            className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2.5 text-sm font-semibold transition-colors ${
                                                n === page
                                                    ? "bg-slate-950 text-white"
                                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                            }`}
                                        >
                                            {n}
                                        </button>
                                    ),
                                )}

                                <button
                                    type="button"
                                    onClick={() => goTo(page + 1)}
                                    disabled={page === totalPages}
                                    className="ml-1 flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function buildPageNumbers(page: number, total: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = new Set<number>([1, total, page - 1, page, page + 1]);
    if (page <= 3) [2, 3, 4].forEach((n) => pages.add(n));
    if (page >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => pages.add(n));

    const sorted = [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
    const result: (number | "…")[] = [];
    let prev = 0;
    for (const n of sorted) {
        if (prev && n - prev > 1) result.push("…");
        result.push(n);
        prev = n;
    }
    return result;
}
