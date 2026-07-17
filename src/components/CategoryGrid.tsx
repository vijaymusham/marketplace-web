"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { categories } from "@/lib/categories";

export default function CategoryGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollNext = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="mb-4 font-heading text-xl font-extrabold text-slate-900 sm:text-2xl">
        Shop by category
      </h2>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-1 scrollbar-hide sm:gap-5"
        >
          {categories.map(({ name, image }) => (
            <a
              key={name}
              href="#"
              className="group relative flex w-28 shrink-0 flex-col overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-900/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md sm:w-36"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="(min-width: 640px) 144px, 112px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/0 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-2.5 text-xs font-bold leading-tight text-white sm:p-3 sm:text-sm">
                  {name}
                </span>
              </div>
            </a>
          ))}
        </div>

        <button
          onClick={scrollNext}
          aria-label="Show more categories"
          className="absolute top-1/2 right-0 hidden h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-lg hover:bg-slate-900 md:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
