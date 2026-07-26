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
import { fuelTypeOptions } from "@/components/data/FormOptions";
import { getCategories, getCategoryListingFilters, getCities, getStates } from "../api/apis";
import type {
    ApiCategoryFilterOption,
    ApiCategoryFilterSection,
} from "../types/AllTypes";

export const PRICE_MIN = 0;
export const PRICE_MAX = 500_000;
export const KMS_MIN = 0;
export const KMS_MAX = 500_000;
export const YEAR_MIN = 1990;
export const YEAR_MAX = new Date().getFullYear();

const FILTER_LIST_MAX_HEIGHT = "max-h-52";
const SKIP_FILTER_KEYS = new Set(["all_product", "subCategoryId"]);

export type CategorySidebarFilterState = {
    selected: Record<string, string[]>;
    priceRange: { min: number; max: number };
    kmsRange: { min: number; max: number };
    yearRange: { min: number; max: number };
    stateId: string;
    cityId: string;
    locality: string;
    type: string;
};

export const EMPTY_SIDEBAR_FILTERS: CategorySidebarFilterState = {
    selected: {},
    priceRange: { min: PRICE_MIN, max: PRICE_MAX },
    kmsRange: { min: KMS_MIN, max: KMS_MAX },
    yearRange: { min: YEAR_MIN, max: YEAR_MAX },
    stateId: "",
    cityId: "",
    locality: "",
    type: "",
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
    search: Search,
    sparkles: Sparkles,
    percent: Percent,
    tag: Tag,
    sliders: SlidersHorizontal,
    brand: Tag,
    condition: SlidersHorizontal,
    price: Percent,
    discount: Percent,
    "shopping-bag": ShoppingBag,
    "magnifying-glass": Search,
};

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
    const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
    const [selected, setSelected] = useState<Record<string, string[]>>({});
    const [priceRange, setPriceRange] = useState(EMPTY_SIDEBAR_FILTERS.priceRange);
    const [kmsRange, setKmsRange] = useState(EMPTY_SIDEBAR_FILTERS.kmsRange);
    const [yearRange, setYearRange] = useState(EMPTY_SIDEBAR_FILTERS.yearRange);
    const [stateId, setStateId] = useState("");
    const [cityId, setCityId] = useState("");
    const [locality, setLocality] = useState("");
    const [type, setType] = useState("");
    const [priceOpen, setPriceOpen] = useState(true);
    const [locationOpen, setLocationOpen] = useState(true);
    const [typeOpen, setTypeOpen] = useState(true);
    const [fuelOpen, setFuelOpen] = useState(true);
    const [yearOpen, setYearOpen] = useState(true);
    const [kmsOpen, setKmsOpen] = useState(true);
    const onFiltersChangeRef = useRef(onFiltersChange);

    useEffect(() => {
        onFiltersChangeRef.current = onFiltersChange;
    }, [onFiltersChange]);

    const { data: apiCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const { data: apiStates = [] } = useQuery({
        queryKey: ["states"],
        queryFn: getStates,
    });

    const { data: apiCities = [] } = useQuery({
        queryKey: ["cities", stateId],
        queryFn: () => getCities(stateId || undefined),
        enabled: Boolean(stateId),
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
        priceRange,
        kmsRange,
        yearRange,
        stateId,
        cityId,
        locality,
        type,
        ...overrides,
    });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpenFilters({});
        setSelected({});
        setPriceRange(EMPTY_SIDEBAR_FILTERS.priceRange);
        setKmsRange(EMPTY_SIDEBAR_FILTERS.kmsRange);
        setYearRange(EMPTY_SIDEBAR_FILTERS.yearRange);
        setStateId("");
        setCityId("");
        setLocality("");
        setType("");
        setPriceOpen(true);
        setLocationOpen(true);
        setTypeOpen(true);
        setFuelOpen(true);
        setYearOpen(true);
        setKmsOpen(true);
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
        if (selectionType === "single") {
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

    return (
        <aside className="w-full shrink-0 lg:w-64 xl:w-72">
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
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                    {totalCount}
                </span>
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
            </ScrollContain>

            <div className="mt-6 space-y-1 border-t border-slate-100 pt-5">
                {isLoadingFilters && (
                    <p className="px-2 py-2 text-sm text-slate-400">Loading filters…</p>
                )}

                {filters.map((group) => (
                    <FilterAccordion
                        key={`${resolvedSubCategoryId}-${group.key}`}
                        group={group}
                        open={openFilters[group.key] ?? true}
                        selected={selected}
                        onToggle={() => toggleFilter(group.key)}
                        onToggleOption={(queryKey, value) =>
                            toggleOption(queryKey, value, group.selectionType)
                        }
                    />
                ))}

                <NumberRangeAccordion
                    title="Price Range"
                    icon={IndianRupee}
                    open={priceOpen}
                    min={priceRange.min}
                    max={priceRange.max}
                    boundMin={PRICE_MIN}
                    boundMax={PRICE_MAX}
                    step={1000}
                    formatValue={formatPrice}
                    onToggle={() => setPriceOpen((prev) => !prev)}
                    onChange={(next) => {
                        setPriceRange(next);
                        emitFilters(snapshot({ priceRange: next }));
                    }}
                />

                <LocationAccordion
                    open={locationOpen}
                    stateId={stateId}
                    cityId={cityId}
                    locality={locality}
                    states={apiStates}
                    cities={apiCities}
                    onToggle={() => setLocationOpen((prev) => !prev)}
                    onStateChange={(nextStateId) => {
                        setStateId(nextStateId);
                        setCityId("");
                        emitFilters(snapshot({ stateId: nextStateId, cityId: "" }));
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

                <TextFilterAccordion
                    title="Type"
                    icon={Tag}
                    open={typeOpen}
                    value={type}
                    placeholder="e.g. Laptop"
                    onToggle={() => setTypeOpen((prev) => !prev)}
                    onChange={(nextType) => {
                        setType(nextType);
                        emitFilters(snapshot({ type: nextType }));
                    }}
                />

                <StaticOptionsAccordion
                    title="Fuel"
                    icon={Fuel}
                    open={fuelOpen}
                    queryKey="fuel"
                    selectionType="multi"
                    options={fuelTypeOptions}
                    selected={selected.fuel ?? []}
                    onToggle={() => setFuelOpen((prev) => !prev)}
                    onToggleOption={(value) => toggleOption("fuel", value, "multi")}
                />

                <NumberRangeAccordion
                    title="Year"
                    icon={Calendar}
                    open={yearOpen}
                    min={yearRange.min}
                    max={yearRange.max}
                    boundMin={YEAR_MIN}
                    boundMax={YEAR_MAX}
                    step={1}
                    formatValue={(value) => String(value)}
                    onToggle={() => setYearOpen((prev) => !prev)}
                    onChange={(next) => {
                        setYearRange(next);
                        emitFilters(snapshot({ yearRange: next }));
                    }}
                />

                <NumberRangeAccordion
                    title="KMs Driven"
                    icon={Gauge}
                    open={kmsOpen}
                    min={kmsRange.min}
                    max={kmsRange.max}
                    boundMin={KMS_MIN}
                    boundMax={KMS_MAX}
                    step={1000}
                    formatValue={formatKms}
                    onToggle={() => setKmsOpen((prev) => !prev)}
                    onChange={(next) => {
                        setKmsRange(next);
                        emitFilters(snapshot({ kmsRange: next }));
                    }}
                />
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
    group: ApiCategoryFilterSection;
    open: boolean;
    selected: Record<string, string[]>;
    onToggle: () => void;
    onToggleOption: (queryKey: string, value: string) => void;
}) {
    const options = flattenOptions(group.items);
    const iconKey = group.icon.toLowerCase();
    const Icon =
        group.queryKey === "verifiedSeller" || group.key === "best_seller"
            ? group.key === "best_seller"
                ? Sparkles
                : BadgeCheck
            : (filterIcons[iconKey] ?? SlidersHorizontal);

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
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
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
                                            type={
                                                group.selectionType === "single"
                                                    ? "radio"
                                                    : "checkbox"
                                            }
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

function StaticOptionsAccordion({
    title,
    icon: Icon,
    open,
    queryKey,
    selectionType,
    options,
    selected,
    onToggle,
    onToggleOption,
}: {
    title: string;
    icon: LucideIcon;
    open: boolean;
    queryKey: string;
    selectionType: "single" | "multi";
    options: { value: string; label: string }[];
    selected: string[];
    onToggle: () => void;
    onToggleOption: (value: string) => void;
}) {
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
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
            >
                <div className="overflow-hidden">
                    <ScrollContain
                        className={`space-y-1 overflow-y-auto pb-2 pl-9 ${FILTER_LIST_MAX_HEIGHT}`}
                    >
                        {options.map((option) => {
                            const checked = selected.includes(option.value);
                            return (
                                <li key={option.value}>
                                    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                                        <input
                                            type={selectionType === "single" ? "radio" : "checkbox"}
                                            name={queryKey}
                                            checked={checked}
                                            onChange={() => onToggleOption(option.value)}
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
    open,
    stateId,
    cityId,
    locality,
    states,
    cities,
    onToggle,
    onStateChange,
    onCityChange,
    onLocalityChange,
}: {
    open: boolean;
    stateId: string;
    cityId: string;
    locality: string;
    states: { id: string; name: string }[];
    cities: { id: string; name: string }[];
    onToggle: () => void;
    onStateChange: (stateId: string) => void;
    onCityChange: (cityId: string) => void;
    onLocalityChange: (locality: string) => void;
}) {
    return (
        <div>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2.5 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
                <MapPin className="h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.75} />
                <span className="flex-1">Location</span>
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
                    <div className="space-y-2.5 px-2 pb-3 pt-1">
                        <label className="block space-y-1">
                            <span className="text-[11px] font-medium text-slate-400">State</span>
                            <select
                                value={stateId}
                                onChange={(e) => onStateChange(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">All states</option>
                                {states.map((state) => (
                                    <option key={state.id} value={state.id}>
                                        {state.name}
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
                                    <option key={city.id} value={city.id}>
                                        {city.name}
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

function TextFilterAccordion({
    title,
    icon: Icon,
    open,
    value,
    placeholder,
    onToggle,
    onChange,
}: {
    title: string;
    icon: LucideIcon;
    open: boolean;
    value: string;
    placeholder: string;
    onToggle: () => void;
    onChange: (value: string) => void;
}) {
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
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="px-2 pb-3 pt-1">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                        />
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
    const minPercent = ((min - boundMin) / (boundMax - boundMin)) * 100;
    const maxPercent = ((max - boundMin) / (boundMax - boundMin)) * 100;
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
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
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
