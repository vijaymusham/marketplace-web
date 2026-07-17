"use client";

import { useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { categories } from "@/lib/categories";

export default function CategoryGrid() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);

    const scrollNext = () => {
        scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });
    };

    return (
        <section id="category-grid" className="border-b border-slate-200 bg-white">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    ref={scrollRef}
                    className="flex items-stretch gap-1 overflow-x-auto scroll-smooth scrollbar-hide sm:gap-2"
                >
                    {categories.map(({ name, icon: Icon }, index) => {
                        const isActive = index === active;
                        return (
                            <button
                                key={name}
                                onClick={() => setActive(index)}
                                className={`group relative flex w-24 shrink-0 flex-col items-center gap-1.5 pt-4 pb-3 transition-colors sm:w-28 ${isActive
                                        ? "text-primary"
                                        : "text-slate-800 hover:text-primary"
                                    }`}
                            >
                                <Icon className="h-11 w-11 transition-transform duration-200 group-hover:-translate-y-0.5 sm:h-13 sm:w-13" />
                                <span
                                    className={`text-center text-xs leading-tight font-semibold whitespace-normal sm:text-[13px] ${isActive ? "text-primary" : "text-slate-700"
                                        }`}
                                >
                                    {name}
                                </span>
                                <span
                                    className={`absolute inset-x-3 bottom-0 h-1 rounded-t-full bg-primary transition-opacity ${isActive ? "opacity-100" : "opacity-0"
                                        }`}
                                />
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={scrollNext}
                    aria-label="Show more categories"
                    className="absolute top-1/2 right-1 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-600 shadow-md ring-1 ring-slate-900/10 hover:text-primary md:flex"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </section>
    );
}
