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
    { name: "Chennai", distance: "1,248 km away", keyword: "chennai", lock: 309 },
    { name: "Kolkata", distance: "1,348 km away", keyword: "kolkata", lock: 310 },
    { name: "Jaipur", distance: "1,448 km away", keyword: "jaipur", lock: 311 },
    { name: "Lucknow", distance: "1,548 km away", keyword: "lucknow", lock: 312 },
    { name: "Kanpur", distance: "1,648 km away", keyword: "kanpur", lock: 313 },
    { name: "Indore", distance: "1,748 km away", keyword: "indore", lock: 314 },
    { name: "Bhopal", distance: "1,848 km away", keyword: "bhopal", lock: 315 },
    { name: "Coimbatore", distance: "1,948 km away", keyword: "coimbatore", lock: 316 },
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
                        <a key={name} href="#" className="group w-36 shrink-0 sm:w-29 items-center justify-center">
                            <div className="relative aspect-square w-full overflow-hidden rounded-full bg-slate-100">
                                <Image
                                    src={`https://loremflickr.com/400/340/${keyword},city/all?lock=${lock}`}
                                    alt={`Deals in ${name}`}
                                    fill
                                    priority
                                    loading="eager"
                                    sizes="100px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105 border-2  border-orange-500 p-1 border-dotted rounded-full"
                                />
                            </div>
                            <p className="mt-2.5 text-sm font-bold text-slate-900 text-center">
                                {name}
                            </p>
                            <p className="mt-0.5 text-[13px]  text-slate-500 text-center font-medium">{distance}</p>
                        </a>
                    ))}
                </div>

                {/* <button
                    onClick={scrollNext}
                    aria-label="Show more cities"
                    className="absolute top-[38%] right-0 hidden h-9 w-9 -translate-y-1/2 translate-x-1/3 items-center justify-center rounded-full bg-white text-slate-700 shadow-md ring-1 ring-slate-900/10 transition-colors hover:text-primary md:flex"
                >
                    <ChevronRight className="h-5 w-5" />
                </button> */}
            </div>
        </section>
    );
}
