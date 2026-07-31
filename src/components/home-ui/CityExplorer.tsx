"use client";

import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/lib/slug";
import { Enter, Stagger, StaggerItem } from "@/components/animations/Motion";
import { useQuery } from "@tanstack/react-query";
import { getPopularCities } from "../api/apis";
import type { ApiCity } from "../types/AllTypes";
import { CITY_ROW, WithSkeleton } from "../ui/Skeleton";

export default function CityExplorer() {
    const { data, isLoading } = useQuery({
        queryKey: ["popularCities"],
        queryFn: () => getPopularCities({ latitude: 19.2183, longitude: 72.9781 }),
    });

    return (
        <section>
            <div className="mx-auto max-w-7xl px-4 pt-4 pb-2 sm:px-6 sm:pt-5 sm:pb-3 lg:px-8 lg:pt-6 lg:pb-4">
                <Enter>
                    <h2 className="font-heading text-lg font-extrabold text-slate-900 sm:text-xl md:text-2xl">
                        Quick and easy deal finder
                    </h2>
                    <p className="mt-0.5 text-[13px] font-medium text-slate-500 sm:mt-1 sm:text-sm md:text-[15px]">
                        Pick a vibe and explore the top deals across India
                    </p>
                </Enter>

                <div className="relative mt-3 sm:mt-4">
                    <WithSkeleton
                        loading={isLoading}
                        count={12}
                        variant="city"
                        gridClassName={CITY_ROW}
                    >
                        <Stagger
                            className={`${CITY_ROW} snap-x snap-mandatory`}
                            stagger={0.055}
                        >
                            {data?.map((city: ApiCity) => (
                                <StaggerItem
                                    key={city.name}
                                    className="w-21 shrink-0 snap-start sm:w-28 md:w-28 lg:w-30"
                                    y={24}
                                >
                                    <Link
                                        href={{
                                            pathname: `/city/${slugify(city.name)}`,
                                            query: {
                                                id: city.id,
                                                stateId: city.stateId,
                                                name: city.name,
                                                imageUrl: city.imageUrl,
                                                latitude: city.latitude,
                                                longitude: city.longitude,
                                                distanceKm: city.distanceKm,
                                                distanceLabel: city.distanceLabel,
                                            },
                                        }}
                                        className="group block"
                                    >
                                        <div className="relative aspect-square w-full overflow-hidden rounded-full bg-white/70">
                                            <Image
                                                src={city.imageUrl || "/images/city-placeholder.png"}
                                                alt={`Deals in ${city.name || "No name"}`}
                                                fill
                                                sizes="(max-width: 640px) 76px, (max-width: 768px) 112px, 144px"
                                                className="rounded-full border-2 border-dotted border-orange-500 object-cover p-0.5 transition-transform duration-500 group-hover:scale-105 sm:p-1"
                                            />
                                        </div>
                                        <p className="mt-1.5 truncate text-center text-[12px] font-bold text-slate-900 sm:mt-2 sm:text-sm">
                                            {city.name || "No name"}
                                        </p>
                                        <p className="mt-px text-center text-[11px] font-medium text-slate-500 sm:mt-0.5 sm:text-[13px]">
                                            {city.distanceLabel || "No distance label"}
                                        </p>
                                    </Link>
                                </StaggerItem>
                            ))}
                        </Stagger>
                    </WithSkeleton>
                </div>
            </div>
        </section>
    );
}
