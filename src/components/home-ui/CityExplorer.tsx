"use client";;
import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/lib/slug";
import { Enter, Stagger, StaggerItem } from "@/components/animations/Motion";
import { useQuery } from "@tanstack/react-query";
import { getPopularCities } from "../api/apis";
import type { ApiCity } from "../types/AllTypes";

export default function CityExplorer() {

    const { data } = useQuery({
        queryKey: ["popularCities"],
        queryFn: () => getPopularCities({ latitude: 19.2183, longitude: 72.9781 }),
    });

    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Enter>
                <h2 className="font-heading text-xl font-extrabold text-slate-900 sm:text-2xl">
                    Quick and easy deal finder
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-400 sm:text-[15px]">
                    Pick a vibe and explore the top deals across India
                </p>
            </Enter>

            <div className="relative mt-5">
                <Stagger
                    className="flex gap-4 overflow-x-auto scroll-smooth pb-1 scrollbar-hide sm:gap-5"
                    stagger={0.055}
                >
                    {data?.map((city: ApiCity) => {
                        return (
                            <StaggerItem key={city.name} className="w-36 shrink-0 sm:w-29" y={24}>
                                <Link
                                    href={`/city/${slugify(city.name)}`}
                                    className="group block items-center justify-center"
                                >
                                    <div className="relative aspect-square w-full overflow-hidden rounded-full bg-slate-100">
                                        <Image
                                            src={city.image || "/images/city-placeholder.png"}
                                            alt={`Deals in ${city.name || "No name"}`}
                                            fill
                                            sizes="116px"
                                            className="rounded-full border-2 border-dotted border-orange-500 object-cover p-1 transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <p className="mt-2.5 text-center text-sm font-bold text-slate-900">
                                        {city.name || "No name"}
                                    </p>
                                    <p className="mt-0.5 text-center text-[13px] font-medium text-slate-500">
                                        {city.distanceLabel || "No distance label"}
                                    </p>
                                </Link>
                            </StaggerItem>
                        )
                    })}
                </Stagger>
            </div>
        </section>
    );
}
