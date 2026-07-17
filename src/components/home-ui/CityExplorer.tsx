"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const cities = [
    { name: "Mumbai", distance: "46 km away", keyword: "mumbai", lock: 301 },
    { name: "Pune", distance: "118 km away", keyword: "pune", lock: 302 },
    { name: "Nashik", distance: "167 km away", keyword: "nashik", lock: 303 },
    { name: "Surat", distance: "271 km away", keyword: "surat", lock: 304 },
    { name: "Ahmedabad", distance: "441 km away", keyword: "ahmedabad", lock: 305 },
    { name: "Bengaluru", distance: "845 km away", keyword: "bangalore", lock: 306 },
    { name: "Hyderabad", distance: "623 km away", keyword: "hyderabad", lock: 307 },
    { name: "Delhi", distance: "1,148 km away", keyword: "delhi", lock: 308 },
];

export default function CityExplorer() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollNext = () => {
        scrollRef.current?.scrollBy({ left: 360, behavior: "smooth" });
    };

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
                    {cities.map(({ name, distance, keyword, lock }) => (
                        <a key={name} href="#" className="group w-36 shrink-0 sm:w-40">
                            <div className="relative aspect-[4/3.4] w-full overflow-hidden rounded-xl bg-slate-100">
                                <Image
                                    src={`https://loremflickr.com/400/340/${keyword},city/all?lock=${lock}`}
                                    alt={`Deals in ${name}`}
                                    fill
                                    sizes="160px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <p className="mt-2.5 text-sm font-bold text-slate-900">
                                {name} <span className="align-middle text-base leading-none">🇮🇳</span>
                            </p>
                            <p className="mt-0.5 text-[13px] text-slate-500">{distance}</p>
                        </a>
                    ))}
                </div>

                <button
                    onClick={scrollNext}
                    aria-label="Show more cities"
                    className="absolute top-[38%] right-0 hidden h-9 w-9 -translate-y-1/2 translate-x-1/3 items-center justify-center rounded-full bg-white text-slate-700 shadow-md ring-1 ring-slate-900/10 transition-colors hover:text-primary md:flex"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </section>
    );
}
