"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { getSearchSuggestions } from "../api/apis";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { itemVariants, panelVariants } from "../animations/AnimationsHelper";
import { slugify } from "@/lib/slug";
import { ApiSearchSuggestion } from "../types/AllTypes";

const SUGGESTIONS = [
    "products",
    "brands",
    "electronics",
    "fashion",
    "home & living",
    "more",
];

const EMPTY_SUGGESTIONS: ApiSearchSuggestion[] = [];
const INTERVAL_MS = 3000;
const DEBOUNCE_MS = 400;

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => window.clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

function SearchSuggestionItem({
    suggestion,
    compact,
}: {
    suggestion: ApiSearchSuggestion;
    compact?: boolean;
}) {
    return (
        <motion.div variants={itemVariants}>
            <Link
                href={`/category/${slugify(suggestion.subcategory)}`}
                onMouseDown={(e) => e.preventDefault()}
                className="block"
            >
                <div
                    className={`my-1.5 truncate font-bold text-slate-700 capitalize transition-colors hover:text-primary sm:my-2 ${compact ? "text-sm" : "text-sm sm:text-base"
                        }`}
                >
                    {suggestion.text}
                    {suggestion.category && (
                        <h4 className="text-[11px] font-semibold text-slate-600 sm:text-xs">
                            {" "}
                            in {suggestion.subcategory}
                        </h4>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}


function PlaceholderCarousel({
    onActivate,
    compact,
}: {
    onActivate: () => void;
    compact?: boolean;
}) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = window.setInterval(() => {
            setIndex((prev) => (prev + 1) % SUGGESTIONS.length);
        }, INTERVAL_MS);

        return () => window.clearInterval(id);
    }, []);

    return (
        <motion.div
            key="carousel"
            role="presentation"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={onActivate}
            className={`absolute inset-y-0 left-9 flex cursor-text items-center overflow-hidden text-left ${compact ? "right-3 sm:left-10" : "right-12 sm:left-11 sm:right-28"
                }`}
            aria-hidden
        >
            <span className={`shrink-0 font-medium text-slate-700 ${compact ? "text-xs sm:text-sm" : "hidden text-sm sm:inline sm:text-base"}`}>
                {compact ? "Search " : "Search for\u00a0"}
            </span>
            <span className={`relative flex-1 overflow-hidden ${compact ? "h-5" : "h-5 sm:h-6"}`}>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={SUGGESTIONS[index]}
                        initial={{ y: 10 }}
                        animate={{ y: 0 }}
                        exit={{ y: -10 }}
                        transition={{
                            y: { type: "spring", stiffness: 140, damping: 20 },
                        }}
                        className={`absolute inset-0 truncate font-semibold text-slate-800 capitalize ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"
                            }`}
                    >
                        &quot;{SUGGESTIONS[index]}&quot;
                    </motion.span>
                </AnimatePresence>
            </span>
        </motion.div>
    );
}

function SearchInput({ compact = false }: { compact?: boolean }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const blurTimeoutRef = useRef<number | null>(null);
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);

    const trimmedQuery = query.trim();
    const showCarousel = !focused && trimmedQuery.length === 0;
    const debouncedQuery = useDebounce(trimmedQuery, DEBOUNCE_MS);

    const { data: searchSuggestions = EMPTY_SUGGESTIONS } = useQuery({
        queryKey: ["searchSuggestions", debouncedQuery],
        queryFn: () => getSearchSuggestions(debouncedQuery),
        enabled: focused && debouncedQuery.length > 0,
        placeholderData: keepPreviousData,
    });

    const showSuggestions =
        focused && trimmedQuery.length > 0 && searchSuggestions.length > 0;

    useEffect(() => {
        return () => {
            if (blurTimeoutRef.current != null) {
                window.clearTimeout(blurTimeoutRef.current);
            }
        };
    }, []);

    const focusInput = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    const handleFocus = useCallback(() => {
        if (blurTimeoutRef.current != null) {
            window.clearTimeout(blurTimeoutRef.current);
            blurTimeoutRef.current = null;
        }
        setFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        blurTimeoutRef.current = window.setTimeout(() => {
            setFocused(false);
            setQuery("");
            blurTimeoutRef.current = null;
        }, 280);
    }, []);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
        },
        [],
    );

    return (
        <div className="group relative z-40 flex min-w-0 flex-1 items-center">
            <Search
                className={`pointer-events-none absolute z-10 text-slate-500 transition-colors group-focus-within:text-primary ${compact
                    ? "left-3 h-4 w-4"
                    : "left-3 h-4.5 w-4.5 sm:left-4 sm:h-5 sm:w-5"
                    }`}
            />

            <div className="relative min-w-0 w-full">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={
                        focused
                            ? compact
                                ? "Find cars, mobiles and more..."
                                : "Search for products, brands and more..."
                            : ""
                    }
                    aria-label="Search for products, brands and more"
                    className={
                        compact
                            ? "w-full min-w-0 rounded-xl border-2 border-slate-200 bg-white py-2.5 pr-3 pl-9 text-base font-medium text-slate-900 placeholder:text-sm placeholder:text-slate-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:py-2.5 sm:pl-10 sm:text-sm"
                            : "w-full min-w-0 rounded-full border border-slate-200 bg-slate-50 py-2.5 pr-28 pl-11 text-sm font-medium text-slate-900 shadow-inner shadow-slate-100 transition-all duration-300 placeholder:text-slate-600 focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/25 sm:text-base"
                    }
                />

                <AnimatePresence mode="sync">
                    {showSuggestions && (
                        <motion.div
                            key="search-suggestions"
                            variants={panelVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className={`absolute z-50 mt-2 w-full origin-top rounded-2xl bg-white text-left shadow-lg will-change-transform sm:mt-3 ${compact ? "p-2.5 sm:p-3" : "p-3 sm:p-4"
                                }`}
                        >
                            {searchSuggestions.map((suggestion, i) => (
                                <SearchSuggestionItem
                                    key={`${suggestion.text}-${suggestion.subcategory}-${i}`}
                                    suggestion={suggestion}
                                    compact={compact}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {showCarousel && (
                        <PlaceholderCarousel
                            onActivate={focusInput}
                            compact={compact}
                        />
                    )}
                </AnimatePresence>
            </div>

            {!compact && (
                <button
                    type="button"
                    aria-label="Search"
                    className="absolute right-1.5 flex items-center gap-1.5 rounded-full bg-linear-to-r from-primary to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition-all duration-200 hover:from-primary-hover hover:to-indigo-600 hover:shadow-md active:scale-95"
                >
                    Search
                    <Search className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}

export default memo(SearchInput);
