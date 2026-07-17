"use client";

import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { categories } from "@/lib/categories";

export default function CategoryGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollNext = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
        >
          {categories.map(({ name, icon: Icon }) => (
            <a
              key={name}
              href="#"
              className="group flex w-24 shrink-0 flex-col items-center gap-2 text-center sm:w-28"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary transition-colors group-hover:bg-primary/10 sm:h-24 sm:w-24">
                <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </span>
              <span className="text-xs font-semibold leading-tight text-slate-800 sm:text-sm">
                {name}
              </span>
            </a>
          ))}
        </div>

        <button
          onClick={scrollNext}
          aria-label="Show more categories"
          className="absolute top-10 right-0 hidden h-10 w-10 translate-x-1/2 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-lg hover:bg-slate-900 sm:top-12 md:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
