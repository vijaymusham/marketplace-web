"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ListingCard from "@/components/sections/ListingCard";
import type { Listing } from "@/lib/listings";

const PAGE_SIZE = 20;

export default function PaginatedListings({ listings }: { listings: Listing[] }) {
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(listings.length / PAGE_SIZE));

    const goTo = (next: number) => {
        const clamped = Math.min(Math.max(next, 1), totalPages);
        if (clamped === page) return;
        setPage(clamped);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const visible = listings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
                {visible.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
            </div>

            {totalPages > 1 && (
                <nav
                    aria-label="Pagination"
                    className="mt-10 flex items-center justify-center gap-1.5 sm:gap-2"
                >
                    <button
                        onClick={() => goTo(page - 1)}
                        disabled={page === 1}
                        aria-label="Previous page"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
                    >
                        <ChevronLeft className="h-4.5 w-4.5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button
                            key={n}
                            onClick={() => goTo(n)}
                            aria-current={n === page ? "page" : undefined}
                            className={`h-10 w-10 rounded-full text-sm font-bold transition-colors ${n === page
                                ? "bg-primary text-white shadow-sm shadow-primary/30"
                                : "border border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary"
                                }`}
                        >
                            {n}
                        </button>
                    ))}

                    <button
                        onClick={() => goTo(page + 1)}
                        disabled={page === totalPages}
                        aria-label="Next page"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
                    >
                        <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                </nav>
            )}
        </div>
    );
}
