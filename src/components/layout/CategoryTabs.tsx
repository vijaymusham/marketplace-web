"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { categories } from "@/lib/categories";

const PANEL_WIDE = 560;
const PANEL_NARROW = 320;
const PANEL_MARGIN = 8;

export default function CategoryTabs() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [panel, setPanel] = useState({ left: 0, width: PANEL_NARROW });
    const containerRef = useRef<HTMLDivElement>(null);

    const openCategory = openIndex !== null ? categories[openIndex] : null;

    const openTab = (index: number, target: HTMLElement) => {
        const container = containerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        // never let the panel exceed the container (8px inset on each side)
        const width = Math.min(
            categories[index].subcategories.length > 6 ? PANEL_WIDE : PANEL_NARROW,
            containerRect.width - PANEL_MARGIN * 2,
        );
        const tabRect = target.getBoundingClientRect();
        const tabCenter = tabRect.left - containerRect.left + tabRect.width / 2;

        // center the panel under the hovered tab, clamped inside the container
        const left = Math.min(
            Math.max(tabCenter - width / 2, PANEL_MARGIN),
            Math.max(containerRect.width - width - PANEL_MARGIN, PANEL_MARGIN),
        );

        setPanel({ left, width });
        setOpenIndex(index);
    };

    return (
        <nav
            onMouseLeave={() => setOpenIndex(null)}
            className="sticky top-16 z-20 border-b border-slate-200/70 bg-white/85 shadow-[0_1px_12px_rgba(15,23,42,0.06)] backdrop-blur-md"
        >
            <div
                ref={containerRef}
                className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
            >
                <div className="overflow-x-auto scrollbar-hide">
                    <ul className="mx-auto flex w-max items-center gap-5">
                        {categories.map(({ name, icon: Icon }, index) => (
                            <li key={name} className="shrink-0">
                                <button
                                    onMouseEnter={(e) => openTab(index, e.currentTarget)}
                                    onFocus={(e) => openTab(index, e.currentTarget)}
                                    className={`flex items-center gap-2 border-b-2 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${openIndex === index
                                        ? "border-primary text-primary"
                                        : "border-transparent text-slate-600 hover:text-primary"
                                        }`}
                                >
                                    <Icon className="h-7 w-7" />
                                    {name}
                                    <ChevronDown
                                        className={`h-3.5 w-3.5 transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {openCategory && (
                    <div
                        style={{ left: panel.left, width: panel.width }}
                        className="absolute top-full rounded-b-2xl border border-t-0 border-slate-200/70 bg-white/95 p-6 shadow-xl backdrop-blur-md"
                    >
                        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                            <openCategory.icon className="h-9 w-9 text-slate-800" />
                            <h3 className="font-heading text-sm font-extrabold text-slate-900">
                                {openCategory.name}
                            </h3>
                        </div>

                        <ul
                            className={`mt-3 gap-x-8 ${openCategory.subcategories.length > 6 && panel.width > 420
                                ? "grid grid-cols-2"
                                : "flex flex-col"
                                }`}
                        >
                            {openCategory.subcategories.map((sub) => (
                                <li key={sub}>
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-slate-600 transition-colors hover:text-primary"
                                    >
                                        {sub}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
}
