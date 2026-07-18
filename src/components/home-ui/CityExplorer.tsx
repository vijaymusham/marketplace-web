"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cities, getCityImage } from "@/lib/cities";
import { slugify } from "@/lib/slug";

export default function CityExplorer() {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h2 className="font-heading text-xl font-extrabold text-slate-900 sm:text-2xl">
                Quick and easy deal finder
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-400 sm:text-[15px]">
                Pick a vibe and explore the top deals across India
            </p>
            <div className="relative mt-5">
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth pb-1 scrollbar-hide sm:gap-5"
                >
                    {cities.map((city) => (
                        <Link
                            key={city.name}
                            href={`/city/${slugify(city.name)}`}
                            className="group w-36 shrink-0 items-center justify-center sm:w-29"
                        >
                            <div className="relative aspect-square w-full overflow-hidden rounded-full bg-slate-100">
                                <Image
                                    src={getCityImage(city, "400/340")}
                                    alt={`Deals in ${city.name}`}
                                    fill
                                    sizes="116px"
                                    className="rounded-full border-2 border-dotted border-orange-500 object-cover p-1 transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <p className="mt-2.5 text-center text-sm font-bold text-slate-900">
                                {city.name}
                            </p>
                            <p className="mt-0.5 text-center text-[13px] font-medium text-slate-500">
                                {city.distance}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
