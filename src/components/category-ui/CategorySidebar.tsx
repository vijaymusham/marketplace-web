"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Folder,
  Percent,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Tag,
} from "lucide-react";
import { slugify } from "@/lib/slug";
import {
  getFiltersForSubcategory,
  type FilterGroup,
} from "@/lib/category-filters";

const filterIcons = {
  search: Search,
  sparkles: Sparkles,
  percent: Percent,
  tag: Tag,
  sliders: SlidersHorizontal,
} as const;

export default function CategorySidebar({
  categoryName,
  subcategories,
  activeSubcategory,
  totalCount,
}: {
  categoryName: string;
  subcategories: string[];
  activeSubcategory: string;
  totalCount: number;
}) {
  const filters = getFiltersForSubcategory(categoryName, activeSubcategory);
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setOpenFilters({});
    setSelected({});
  }, [activeSubcategory]);

  const toggleFilter = (id: string) => {
    setOpenFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleOption = (groupId: string, optionId: string) => {
    setSelected((prev) => {
      const current = prev[groupId] ?? [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [groupId]: next };
    });
  };

  return (
    <aside className="w-full shrink-0 lg:w-64 xl:w-72">
      <h2 className="text-lg font-bold text-slate-900">Category</h2>

      <Link
        href={`/category/${slugify(categoryName)}`}
        className="mt-5 flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
      >
        <ShoppingBag className="h-4.5 w-4.5 text-slate-500" strokeWidth={1.75} />
        <span className="flex-1">All Product</span>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
          {totalCount}
        </span>
      </Link>

      <ul className="relative mt-1 ml-4 border-l border-slate-200 pl-4">
        {subcategories.map((sub, index) => {
          const active = sub === activeSubcategory;
          const isLast = index === subcategories.length - 1;
          return (
            <li key={sub} className="relative">
              <span
                className="absolute top-4 -left-4 h-px w-4 bg-slate-200"
                aria-hidden
              />
              {isLast && (
                <span
                  className="absolute top-4 -left-px h-[calc(100%-1rem)] w-px bg-white"
                  aria-hidden
                />
              )}
              <Link
                href={`/category/${slugify(sub)}`}
                className={`flex items-center gap-2.5 rounded-xl px-2 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-slate-100 font-semibold text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Folder
                  className={`h-4 w-4 shrink-0 ${active ? "text-primary" : "text-slate-400"}`}
                  strokeWidth={1.75}
                />
                <span className="truncate">{sub}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 space-y-1 border-t border-slate-100 pt-5">
        {filters.map((group) => (
          <FilterAccordion
            key={`${activeSubcategory}-${group.id}`}
            group={group}
            open={!!openFilters[group.id]}
            selected={selected[group.id] ?? []}
            onToggle={() => toggleFilter(group.id)}
            onToggleOption={(optionId) => toggleOption(group.id, optionId)}
          />
        ))}
      </div>
    </aside>
  );
}

function FilterAccordion({
  group,
  open,
  selected,
  onToggle,
  onToggleOption,
}: {
  group: FilterGroup;
  open: boolean;
  selected: string[];
  onToggle: () => void;
  onToggleOption: (id: string) => void;
}) {
  const Icon = filterIcons[group.icon];

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2.5 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
      >
        <Icon className="h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.75} />
        <span className="flex-1">{group.label}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="space-y-1 pb-2 pl-9">
            {group.options.map((option) => {
              const checked = selected.includes(option.id);
              return (
                <li key={option.id}>
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleOption(option.id)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary/30"
                    />
                    <span className="flex-1 font-medium">{option.label}</span>
                    {option.count != null && (
                      <span className="text-xs text-slate-400">{option.count}</span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
