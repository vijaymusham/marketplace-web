"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import {
    BadgeCheck,
    Calendar,
    ChevronDown,
    Folder,
    Fuel,
    Gauge,
    IndianRupee,
    Layers,
    List,
    type LucideIcon,
    MapPin,
    Percent,
    Search,
    ShoppingBag,
    SlidersHorizontal,
    Sparkles,
    Tag,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { slugify } from "@/lib/slug";
import { normalizeApiCategories } from "@/lib/apiCategories";
import { getCategories, getCategoryListingFilters } from "../api/apis";
import type {
    ApiCategoryFilterOption,
    ApiCategoryFilterSection,
} from "../types/AllTypes";
import { FilterSkeleton } from "@/components/ui/Skeleton";

const FILTER_LIST_MAX_HEIGHT = "max-h-52";
/** Skip sections already covered by the category tree above the filters. */
const SKIP_FILTER_KEYS = new Set(["all_product", "categories", "subCategoryId"]);

export type SidebarRangeFilter = {
    min: number;
    max: number;
    minKey: string;
    maxKey: string;
    boundMin: number;
    boundMax: number;
    step: number;
};

export type CategorySidebarFilterState = {
    selected: Record<string, string[]>;
    ranges: Record<string, SidebarRangeFilter>;
    stateId: string;
    cityId: string;
    locality: string;
};

export const EMPTY_SIDEBAR_FILTERS: CategorySidebarFilterState = {
    selected: {},
    ranges: {},
    stateId: "",
    cityId: "",
    locality: "",
};

function useContainWheelScroll(ref: RefObject<HTMLElement | null>) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onWheel = (event: WheelEvent) => {
            const { scrollTop, scrollHeight, clientHeight } = el;
            const canScroll = scrollHeight > clientHeight + 1;
            if (!canScroll) {
                event.preventDefault();
                return;
            }

            const scrollingUp = event.deltaY < 0;
            const scrollingDown = event.deltaY > 0;
            const atTop = scrollTop <= 0;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

            if ((scrollingUp && atTop) || (scrollingDown && atBottom)) {
                event.preventDefault();
            }

            event.stopPropagation();
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [ref]);
}

function ScrollContain({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    const ref = useRef<HTMLUListElement>(null);
    useContainWheelScroll(ref);

    return (
        <ul ref={ref} className={`overscroll-contain ${className ?? ""}`}>
            {children}
        </ul>
    );
}

const filterIcons: Record<string, LucideIcon> = {
    list: List,
    "map-pin": MapPin,
    mappin: MapPin,
    "indian-rupee": IndianRupee,
    indianrupee: IndianRupee,
    tag: Tag,
    layers: Layers,
    gauge: Gauge,
    calendar: Calendar,
    fuel: Fuel,
    search: Search,
    sparkles: Sparkles,
    percent: Percent,
    sliders: SlidersHorizontal,
    brand: Tag,
    model: Layers,
    condition: SlidersHorizontal,
    price: IndianRupee,
    budget: IndianRupee,
    discount: Percent,
    location: MapPin,
    year: Calendar,
    kms_driven: Gauge,
    kms: Gauge,
    categories: List,
    "shopping-bag": ShoppingBag,
    "magnifying-glass": Search,
};

function resolveFilterIcon(group: ApiCategoryFilterSection): LucideIcon {
    if (group.queryKey === "verifiedSeller" || group.key === "best_seller") {
        return group.key === "best_seller" ? Sparkles : BadgeCheck;
    }
    const iconKey = group.icon?.toLowerCase().replace(/\s+/g, "-") ?? "";
    const sectionKey = group.key?.toLowerCase() ?? "";
    return (
        filterIcons[iconKey] ??
        filterIcons[sectionKey] ??
        filterIcons[group.queryKey?.toLowerCase() ?? ""] ??
        SlidersHorizontal
    );
}

function formatPrice(value: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatKms(value: number) {
    return `${value.toLocaleString("en-IN")} km`;
}

function formatRangeValue(group: ApiCategoryFilterSection, value: number) {
    const key = group.key.toLowerCase();
    if (key === "budget" || key === "price" || group.queryKey.toLowerCase().includes("price")) {
        return formatPrice(value);
    }
    if (key.includes("kms") || group.queryKey.toLowerCase().includes("kms")) {
        return formatKms(value);
    }
    if (key === "year" || group.queryKey.toLowerCase().includes("year")) {
        return String(value);
    }
    return value.toLocaleString("en-IN");
}

function isLocationSection(group: ApiCategoryFilterSection) {
    if (group.key === "location" || group.queryKey === "cityId" || group.queryKey === "stateId") {
        return true;
    }
    return group.items.some((item) => (item.children?.length ?? 0) > 0);
}

function buildRangesFromSections(
    sections: ApiCategoryFilterSection[],
): Record<string, SidebarRangeFilter> {
    const next: Record<string, SidebarRangeFilter> = {};
    for (const section of sections) {
        if (section.selectionType !== "range" || !section.range) continue;
        const { min, max, step, minQueryKey, maxQueryKey } = section.range;
        next[section.key] = {
            min,
            max,
            minKey: minQueryKey,
            maxKey: maxQueryKey,
            boundMin: min,
            boundMax: max,
            step: step || 1,
        };
    }
    return next;
}

export default function CategorySidebar({
    categoryName,
    categoryId,
    subCategoryId,
    subcategories,
    activeSubcategory,
    totalCount,
    onFiltersChange,
}: {
    categoryName: string;
    categoryId: string;
    subCategoryId: string;
    subcategories: string[];
    activeSubcategory: string;
    totalCount: number;
    onFiltersChange?: (filters: CategorySidebarFilterState) => void;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
    const [selected, setSelected] = useState<Record<string, string[]>>({});
    const [ranges, setRanges] = useState<Record<string, SidebarRangeFilter>>({});
    const [stateId, setStateId] = useState("");
    const [cityId, setCityId] = useState("");
    const [locality, setLocality] = useState("");
    const onFiltersChangeRef = useRef(onFiltersChange);

    useEffect(() => {
        onFiltersChangeRef.current = onFiltersChange;
    }, [onFiltersChange]);

    useEffect(() => {
        if (!mobileOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [mobileOpen]);

    const { data: apiCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const normalized = normalizeApiCategories(apiCategories);
    const apiCategory = normalized.find(
        (c) =>
            c.id === categoryId ||
            c.name === categoryName ||
            slugify(c.name) === slugify(categoryName),
    );
    const apiSubcategory = apiCategory?.subcategoryItems.find(
        (sub) =>
            sub.id === subCategoryId ||
            sub.name === activeSubcategory ||
            slugify(sub.name) === slugify(activeSubcategory),
    );

    const resolvedCategoryId = categoryId || apiCategory?.id || "";
    const resolvedSubCategoryId = subCategoryId || apiSubcategory?.id || "";

    const emitFilters = (next: CategorySidebarFilterState) => {
        onFiltersChangeRef.current?.(next);
    };

    const snapshot = (
        overrides: Partial<CategorySidebarFilterState> = {},
    ): CategorySidebarFilterState => ({
        selected,
        ranges,
        stateId,
        cityId,
        locality,
        ...overrides,
    });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpenFilters({});
        setSelected({});
        setRanges({});
        setStateId("");
        setCityId("");
        setLocality("");
        onFiltersChangeRef.current?.(EMPTY_SIDEBAR_FILTERS);
    }, [activeSubcategory, resolvedCategoryId, resolvedSubCategoryId]);

    const { data: filtersData, isLoading: isLoadingFilters } = useQuery({
        queryKey: [
            "category-listing-filters",
            resolvedCategoryId,
            resolvedSubCategoryId,
        ],
        queryFn: () =>
            getCategoryListingFilters({
                categoryId: resolvedCategoryId,
                subCategoryId: resolvedSubCategoryId,
            }),
        enabled: Boolean(resolvedCategoryId && resolvedSubCategoryId),
    });

    const filters = (filtersData?.sections ?? []).filter(
        (section) =>
            !SKIP_FILTER_KEYS.has(section.key) &&
            !SKIP_FILTER_KEYS.has(section.queryKey),
    );

    useEffect(() => {
        if (!filtersData?.sections?.length) return;
        const nextRanges = buildRangesFromSections(filtersData.sections);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRanges(nextRanges);
        onFiltersChangeRef.current?.({
            selected: {},
            ranges: nextRanges,
            stateId: "",
            cityId: "",
            locality: "",
        });
    }, [filtersData]);

    const toggleFilter = (key: string) => {
        setOpenFilters((prev) => ({
            ...prev,
            [key]: !(prev[key] ?? true),
        }));
    };

    const toggleOption = (
        queryKey: string,
        optionValue: string,
        selectionType: string,
    ) => {
        if (!queryKey) return;
        const current = selected[queryKey] ?? [];
        let nextValues: string[];
        const isSingle =
            selectionType === "single" || selectionType === "dropdown";
        if (isSingle) {
            nextValues = current.includes(optionValue) ? [] : [optionValue];
        } else {
            nextValues = current.includes(optionValue)
                ? current.filter((value) => value !== optionValue)
                : [...current, optionValue];
        }
        const nextSelected = { ...selected, [queryKey]: nextValues };
        setSelected(nextSelected);
        emitFilters(snapshot({ selected: nextSelected }));
    };

    const updateRange = (key: string, next: { min: number; max: number }) => {
        const current = ranges[key];
        if (!current) return;
        const nextRanges = {
            ...ranges,
            [key]: { ...current, min: next.min, max: next.max },
        };
        setRanges(nextRanges);
        emitFilters(snapshot({ ranges: nextRanges }));
    };

    const activeCount =
        Object.values(selected).reduce((n, values) => n + values.length, 0) +
        (stateId ? 1 : 0) +
        (cityId ? 1 : 0) +
        (locality.trim() ? 1 : 0) +
        Object.values(ranges).filter(
            (range) => range.min !== range.boundMin || range.max !== range.boundMax,
        ).length;

    return (
        <>
            <div className="flex shrink-0 items-center lg:hidden">
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-800  transition-colors hover:border-primary/40 hover:text-primary"
                >
                    <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.85} />
                    Filters
                    {activeCount > 0 ? (
                        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                            {activeCount}
                        </span>
                    ) : null}
                </button>
            </div>

            {mobileOpen ? (
                <button
                    type="button"
                    aria-label="Close filters"
                    className="fixed inset-0 z-40 bg-slate-900/45 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            ) : null}

            <aside
                className={
                    mobileOpen
                        ? "fixed inset-y-0 left-0 z-50 flex w-[min(100%,20rem)] flex-col overflow-y-auto overscroll-contain bg-white p-4 shadow-2xl lg:static lg:z-auto lg:flex lg:w-64 lg:p-0 lg:shadow-none xl:w-72"
                        : "hidden w-full shrink-0 lg:block lg:w-64 xl:w-72"
                }
                data-lenis-prevent={mobileOpen || undefined}
            >
                {mobileOpen ? (
                    <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 lg:hidden">
                        <h2 className="text-base font-extrabold text-slate-900">Filters</h2>
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="rounded-full bg-slate-100 px-3.5 py-1.5 text-sm font-semibold text-slate-700"
                        >
                            Done
                        </button>
                    </div>
                ) : null}
                <h2 className="text-lg font-bold text-slate-900">Category</h2>

                <Link
                    href={
                        resolvedCategoryId
                            ? `/category/${slugify(categoryName)}?categoryId=${resolvedCategoryId}`
                            : `/category/${slugify(categoryName)}`
                    }
                    className="mt-5 flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                    <ShoppingBag className="h-4.5 w-4.5 text-slate-500" strokeWidth={1.75} />
                    <span className="flex-1">All Product</span>
                </Link>

                <ScrollContain className="relative mt-1 ml-4 max-h-52 overflow-y-auto border-l border-slate-200 pl-4">
                    {subcategories.map((sub, index) => {
                        const active = sub === activeSubcategory;
                        const isLast = index === subcategories.length - 1;
                        const subId = apiCategory?.subcategoryItems.find(
                            (item) => item.name === sub || slugify(item.name) === slugify(sub),
                        )?.id;
                        const hrefParams = new URLSearchParams();
                        if (resolvedCategoryId) hrefParams.set("categoryId", resolvedCategoryId);
                        if (subId) hrefParams.set("subcategoryId", subId);
                        const query = hrefParams.toString();
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
                                    href={`/category/${slugify(sub)}${query ? `?${query}` : ""}`}
                                    className={`flex items-center gap-2.5 rounded-xl px-2 py-2 text-sm font-medium transition-colors ${active
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
                </ScrollContain>

                <div className="mt-6 space-y-1 border-t border-slate-100 pt-5">
                    {isLoadingFilters && <FilterSkeleton count={4} />}

                    {!isLoadingFilters &&
                        filters.map((group) => {
                            const open = openFilters[group.key] ?? true;
                            const icon = resolveFilterIcon(group);

                            if (group.selectionType === "range" && group.range) {
                                const rangeState = ranges[group.key];
                                if (!rangeState) return null;
                                return (
                                    <NumberRangeAccordion
                                        key={`${resolvedSubCategoryId}-${group.key}`}
                                        title={group.title}
                                        icon={icon}
                                        open={open}
                                        min={rangeState.min}
                                        max={rangeState.max}
                                        boundMin={rangeState.boundMin}
                                        boundMax={rangeState.boundMax}
                                        step={rangeState.step}
                                        formatValue={(value) => formatRangeValue(group, value)}
                                        onToggle={() => toggleFilter(group.key)}
                                        onChange={(next) => updateRange(group.key, next)}
                                    />
                                );
                            }

                            if (isLocationSection(group)) {
                                return (
                                    <LocationAccordion
                                        key={`${resolvedSubCategoryId}-${group.key}`}
                                        title={group.title}
                                        icon={icon}
                                        items={group.items}
                                        open={open}
                                        stateId={stateId}
                                        cityId={cityId}
                                        locality={locality}
                                        onToggle={() => toggleFilter(group.key)}
                                        onStateChange={(nextStateId) => {
                                            setStateId(nextStateId);
                                            setCityId("");
                                            emitFilters(
                                                snapshot({
                                                    stateId: nextStateId,
                                                    cityId: "",
                                                }),
                                            );
                                        }}
                                        onCityChange={(nextCityId) => {
                                            setCityId(nextCityId);
                                            emitFilters(snapshot({ cityId: nextCityId }));
                                        }}
                                        onLocalityChange={(nextLocality) => {
                                            setLocality(nextLocality);
                                            emitFilters(snapshot({ locality: nextLocality }));
                                        }}
                                    />
                                );
                            }

                            return (
                                <FilterAccordion
                                    key={`${resolvedSubCategoryId}-${group.key}`}
                                    group={group}
                                    icon={icon}
                                    open={open}
                                    selected={selected}
                                    onToggle={() => toggleFilter(group.key)}
                                    onToggleOption={(queryKey, value) =>
                                        toggleOption(queryKey, value, group.selectionType)
                                    }
                                />
                            );
                        })}
                </div>
            </aside>
        </>
    );
}

function FilterAccordion({
    group,
    icon: Icon,
    open,
    selected,
    onToggle,
    onToggleOption,
}: {
    group: ApiCategoryFilterSection;
    icon: LucideIcon;
    open: boolean;
    selected: Record<string, string[]>;
    onToggle: () => void;
    onToggleOption: (queryKey: string, value: string) => void;
}) {
    const options = flattenOptions(group.items);
    const isSingle =
        group.selectionType === "single" || group.selectionType === "dropdown";

    return (
        <div>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2.5 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
                <Icon className="h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.75} />
                <span className="flex-1">{group.title}</span>
                <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            <div
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
            >
                <div className="overflow-hidden">
                    <ScrollContain
                        className={`space-y-1 overflow-y-auto pb-2 pl-9 ${FILTER_LIST_MAX_HEIGHT}`}
                    >
                        {options.map((option) => {
                            const optionQueryKey = option.queryKey || group.queryKey || group.key;
                            const checked = (selected[optionQueryKey] ?? []).includes(
                                option.value,
                            );
                            return (
                                <li key={`${optionQueryKey}-${option.value}`}>
                                    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                                        <input
                                            type={isSingle ? "radio" : "checkbox"}
                                            name={`${group.key}-${optionQueryKey}`}
                                            checked={checked}
                                            onChange={() =>
                                                onToggleOption(optionQueryKey, option.value)
                                            }
                                            className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary/30"
                                        />
                                        <span className="flex-1 font-medium">{option.label}</span>
                                    </label>
                                </li>
                            );
                        })}
                    </ScrollContain>
                </div>
            </div>
        </div>
    );
}

function LocationAccordion({
    title,
    icon: Icon,
    items,
    open,
    stateId,
    cityId,
    locality,
    onToggle,
    onStateChange,
    onCityChange,
    onLocalityChange,
}: {
    title: string;
    icon: LucideIcon;
    items: ApiCategoryFilterOption[];
    open: boolean;
    stateId: string;
    cityId: string;
    locality: string;
    onToggle: () => void;
    onStateChange: (stateId: string) => void;
    onCityChange: (cityId: string) => void;
    onLocalityChange: (locality: string) => void;
}) {
    const cities = items.find((state) => state.value === stateId)?.children ?? [];

    return (
        <div>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2.5 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
                <Icon className="h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.75} />
                <span className="flex-1">{title}</span>
                <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            <div
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="space-y-2.5 px-2 pb-3 pt-1">
                        <label className="block space-y-1">
                            <span className="text-[11px] font-medium text-slate-400">State</span>
                            <select
                                value={stateId}
                                onChange={(e) => onStateChange(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">All states</option>
                                {items.map((state) => (
                                    <option key={state.value} value={state.value}>
                                        {state.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block space-y-1">
                            <span className="text-[11px] font-medium text-slate-400">City</span>
                            <select
                                value={cityId}
                                disabled={!stateId}
                                onChange={(e) => onCityChange(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                            >
                                <option value="">All cities</option>
                                {cities.map((city) => (
                                    <option key={city.value} value={city.value}>
                                        {city.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block space-y-1">
                            <span className="text-[11px] font-medium text-slate-400">Locality</span>
                            <input
                                type="text"
                                value={locality}
                                onChange={(e) => onLocalityChange(e.target.value)}
                                placeholder="e.g. Andheri"
                                className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NumberRangeAccordion({
    title,
    icon: Icon,
    open,
    min,
    max,
    boundMin,
    boundMax,
    step,
    formatValue,
    onToggle,
    onChange,
}: {
    title: string;
    icon: LucideIcon;
    open: boolean;
    min: number;
    max: number;
    boundMin: number;
    boundMax: number;
    step: number;
    formatValue: (value: number) => string;
    onToggle: () => void;
    onChange: (range: { min: number; max: number }) => void;
}) {
    const span = Math.max(boundMax - boundMin, 1);
    const minPercent = ((min - boundMin) / span) * 100;
    const maxPercent = ((max - boundMin) / span) * 100;
    const gap = Math.max(step, 1);

    const handleMinChange = (value: number) => {
        onChange({ min: Math.min(value, max - gap), max });
    };

    const handleMaxChange = (value: number) => {
        onChange({ min, max: Math.max(value, min + gap) });
    };

    return (
        <div>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2.5 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
                <Icon className="h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.75} />
                <span className="flex-1">{title}</span>
                <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            <div
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="space-y-4 px-2 pb-3 pt-1">
                        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-600">
                            <span>{formatValue(min)}</span>
                            <span className="font-medium text-slate-400">—</span>
                            <span>{formatValue(max)}</span>
                        </div>

                        <div className="relative h-6">
                            <div className="absolute top-1/2 right-0 left-0 h-1.5 -translate-y-1/2 rounded-full bg-slate-200" />
                            <div
                                className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
                                style={{
                                    left: `${minPercent}%`,
                                    width: `${Math.max(maxPercent - minPercent, 0)}%`,
                                }}
                            />
                            <input
                                type="range"
                                min={boundMin}
                                max={boundMax}
                                step={step}
                                value={min}
                                onChange={(e) => handleMinChange(Number(e.target.value))}
                                aria-label={`Minimum ${title}`}
                                className="pointer-events-none absolute inset-0 z-10 m-0 h-6 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-white"
                            />
                            <input
                                type="range"
                                min={boundMin}
                                max={boundMax}
                                step={step}
                                value={max}
                                onChange={(e) => handleMaxChange(Number(e.target.value))}
                                aria-label={`Maximum ${title}`}
                                className="pointer-events-none absolute inset-0 z-20 m-0 h-6 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <label className="space-y-1">
                                <span className="text-[11px] font-medium text-slate-400">Min</span>
                                <input
                                    type="number"
                                    min={boundMin}
                                    max={max}
                                    step={step}
                                    value={min}
                                    onChange={(e) =>
                                        handleMinChange(Number(e.target.value) || boundMin)
                                    }
                                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                                />
                            </label>
                            <label className="space-y-1">
                                <span className="text-[11px] font-medium text-slate-400">Max</span>
                                <input
                                    type="number"
                                    min={min}
                                    max={boundMax}
                                    step={step}
                                    value={max}
                                    onChange={(e) =>
                                        handleMaxChange(Number(e.target.value) || boundMax)
                                    }
                                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function flattenOptions(items: ApiCategoryFilterOption[]): ApiCategoryFilterOption[] {
    return items.flatMap((item) =>
        item.children?.length ? flattenOptions(item.children) : [item],
    );
}
