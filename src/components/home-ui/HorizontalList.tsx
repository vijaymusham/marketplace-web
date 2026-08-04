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
        <section className={`mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 rounded-2xl ${className ?? ""}`}>
            <Reveal>
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="font-heading text-xl font-extrabold text-slate-900 sm:text-2xl">
                            {title}
                        </h2>
                        {loading ? (
                            <Skeleton className="mt-2 h-3.5 w-48 max-w-full rounded" />
                        ) : description ? (
                            <p className="mt-1 text-sm text-slate-600 sm:text-[15px]">
                                {description}
                            </p>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        className="mt-1 flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary sm:mt-0 sm:gap-2 sm:rounded-full sm:border sm:border-slate-100 sm:bg-white sm:px-4 sm:py-2 sm:text-slate-800 sm:transition-colors sm:hover:border-slate-300"
                    >
                        View all
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </Reveal>

            <div className="mt-6">
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
        </section>
    );
};

export default HorizontalList;
