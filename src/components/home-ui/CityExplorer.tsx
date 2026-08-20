"use client";

import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/lib/slug";
import { Stagger, StaggerItem } from "@/components/animations/Motion";
import { useQuery } from "@tanstack/react-query";
import { getPopularCities } from "../api/apis";
import type { ApiCity } from "../types/AllTypes";
import { CITY_ROW, WithSkeleton } from "../ui/Skeleton";
import SectionHeader from "./SectionHeader";
import { useUserLocation } from "@/hooks/useUserLocation";

export default function CityExplorer() {
    const { latitude, longitude } = useUserLocation();
    const { data, isLoading } = useQuery({
        queryKey: ["popularCities", latitude, longitude],
        queryFn: () => getPopularCities({ latitude, longitude }),
    });

    return (
        <section className="relative">
            <div className="mx-auto px-4 pt-6 pb-3 sm:px-6 sm:pt-8 sm:pb-4 lg:px-12 lg:pt-10">
                <SectionHeader
                    eyebrow="Explore nearby"
                    title="Quick and easy deal finder"
                    description="Pick a city and explore the top deals across India"
                />

                <div className="relative mt-5 sm:mt-6">
                    <div
                        aria-hidden
                        className="pointer-events-none hidden sm:block absolute inset-y-0 left-0 z-10 w-6 bg-linear-to-r from-white to-transparent"
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none  absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-white to-transparent sm:w-12"
                    />

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
                                        className="group block cursor-pointer"
                                    >
                                        <div className="relative aspect-square w-full overflow-hidden rounded-full bg-white/70">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_API_IMAGE_URL}${city.imageUrl}` || "/images/city-placeholder.png"}
                                                alt={`Deals in ${city.name || "No name"}`}
                                                fill
                                                sizes="(max-width: 640px) 76px, (max-width: 768px) 112px, 144px"
                                                className="rounded-full border-2 border-dotted border-orange-500 object-cover p-0.5 transition-transform duration-500 group-hover:scale-105 sm:p-1"
                                            />
                                        </div>
                                        <p className="mt-2 truncate text-center text-[12px] font-bold text-slate-900 sm:mt-2.5 sm:text-sm">
                                            {city.name || "No name"}
                                        </p>
                                        <p className="mt-px text-center text-[11px] font-medium text-slate-500 sm:text-[13px]">
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
