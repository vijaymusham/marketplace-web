"use client";;
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ListingCard from "@/components/sections/ListingCard";
import { Stagger, StaggerItem } from "@/components/animations/Motion";
import { ApiAd } from "../types/AllTypes";

const PAGE_SIZE = 20;

export default function PaginatedListings({ listings }: { listings: ApiAd[] }) {
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
            <Stagger
                key={page}
                className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6"
                stagger={0.07}
            >
                {visible.map((listing) => (
                    <StaggerItem key={listing.id} y={38}>
                        <ListingCard listing={listing} />
                    </StaggerItem>
                ))}
            </Stagger>

            {totalPages > 1 && (
                <nav
                    aria-label="Pagination"
                    className="mt-10 flex flex-wrap items-center justify-center gap-1 sm:gap-2 cursor-pointer"
                >
                    <button
                        type="button"
                        onClick={() => goTo(page - 1)}
                        disabled={page === 1}
                        className="mr-1 flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n, i) =>
                        n === totalPages ? (
                            <span
                                key={`ellipsis-${i}`}
                                className="px-1.5 text-sm font-medium text-slate-400 cursor-pointer"
                            >
                                …
                            </span>
                        ) : (
                            <button
                                key={n}
                                type="button"
                                onClick={() => goTo(n)}
                                aria-current={n === page ? "page" : undefined}
                                className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2.5 text-sm font-semibold transition-colors cursor-pointer ${n === page
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
                        className="ml-1 flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </nav>
            )}
        </div>
    );
}
