"use client";

import { ArrowRight } from "lucide-react";
import ListingCard from "../sections/ListingCard";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/Motion";
import type { Listing } from "@/lib/listings";

const HorizontalList = ({
    className,
    title,
    description,
    data,
}: {
    className?: string;
    title: string;
    description?: string;
    data: Listing[];
}) => {
    return (
        <section className={`mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 rounded-2xl ${className}`}>
            <Reveal>
                <div className="flex justify-between gap-4">
                    <div>
                        <h2 className="font-heading text-xl font-extrabold text-slate-900 sm:text-2xl">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm text-slate-600 sm:text-[15px]">
                            {description}
                        </p>
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-4">
                        <button
                            type="button"
                            className="hidden shrink-0 items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-300 sm:flex"
                        >
                            View all
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </Reveal>

            <Stagger className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-5!" stagger={0.08}>
                {data?.map((item) => (
                    <StaggerItem key={item.id} y={40}>
                        <ListingCard listing={item} />
                    </StaggerItem>
                ))}
            </Stagger>
        </section>
    );
};

export default HorizontalList;
