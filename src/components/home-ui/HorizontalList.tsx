"use client";

import { ArrowRight } from "lucide-react";
import ListingCard from "../sections/ListingCard";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/Motion";
import {
    HOME_LISTINGS_GRID,
    Skeleton,
    WithSkeleton,
} from "@/components/ui/Skeleton";
import type { ApiAd } from "../types/AllTypes";

const HorizontalList = ({
    className,
    title,
    description,
    data,
    loading = false,
}: {
    className?: string;
    title: string;
    description?: string;
    data: ApiAd[];
    loading?: boolean;
}) => {
    return (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className={`rounded-2xl px-4 py-8 sm:rounded-3xl sm:px-6 sm:py-9 lg:px-8 lg:py-10 ${className ?? ""}`}>
                <Reveal>
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="mb-2 flex items-center gap-2.5">
                                <span className="h-1 w-6 rounded-full bg-primary sm:w-7" />
                                <span className="text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase sm:text-xs">
                                    Collection
                                </span>
                            </div>
                            <h2 className="font-heading text-[1.35rem] font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                                {title}
                            </h2>
                            {loading ? (
                                <Skeleton className="mt-2 h-3.5 w-48 max-w-full rounded" />
                            ) : description ? (
                                <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-slate-500 sm:text-sm md:text-[15px]">
                                    {description}
                                </p>
                            ) : null}
                        </div>
                        <button
                            type="button"
                            className="group mt-1 flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/25 hover:text-primary hover:shadow-md sm:mt-0 sm:gap-2 sm:px-4 sm:py-2"
                        >
                            View all
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </Reveal>

                <div className="mt-7 sm:mt-8">
                    <WithSkeleton
                        loading={loading}
                        count={5}
                        variant="listing"
                        gridClassName={HOME_LISTINGS_GRID}
                    >
                        <Stagger className={HOME_LISTINGS_GRID} stagger={0.08}>
                            {data?.map((item) => (
                                <StaggerItem key={item.id} y={40}>
                                    <ListingCard listing={item} />
                                </StaggerItem>
                            ))}
                        </Stagger>
                    </WithSkeleton>
                </div>
            </div>
        </section>
    );
};

export default HorizontalList;
