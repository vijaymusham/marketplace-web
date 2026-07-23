"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { getSearchSuggestions } from "../api/apis";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { itemVariants, panelVariants } from "../animations/AnimationsHelper";

const SUGGESTIONS = [
    "products",
    "brands",
    "electronics",
    "fashion",
    "home & living",
    "more",
];

const INTERVAL_MS = 3000;


function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const setTimer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(setTimer);
    }, [value, delay]);
    return debouncedValue;
}

export default function SearchInput() {
    const inputRef = useRef<HTMLInputElement>(null);
    const blurTimeoutRef = useRef<number | null>(null);
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const [index, setIndex] = useState(0);

    const showCarousel = !focused && query.length === 0;
    const debouncedQuery = useDebounce(query, 1000);

    const { data: searchSuggestions = [] } = useQuery({
        queryKey: ["searchSuggestions", debouncedQuery],
        queryFn: () => getSearchSuggestions(debouncedQuery),
        enabled: debouncedQuery.trim().length > 0,
    });

    const showSuggestions = focused && searchSuggestions.length > 0;

    useEffect(() => {
        if (!showCarousel) return;

        const id = window.setInterval(() => {
            setIndex((prev) => (prev + 1) % SUGGESTIONS.length);
        }, INTERVAL_MS);

        return () => window.clearInterval(id);
    }, [showCarousel]);

    useEffect(() => {
        return () => {
            if (blurTimeoutRef.current != null) {
                window.clearTimeout(blurTimeoutRef.current);
            }
        };
    }, []);

    const handleFocus = () => {
        if (blurTimeoutRef.current != null) {
            window.clearTimeout(blurTimeoutRef.current);
            blurTimeoutRef.current = null;
        }
        setFocused(true);
    };

    const handleBlur = () => {
        blurTimeoutRef.current = window.setTimeout(() => {
            setFocused(false);
            setQuery("");
            blurTimeoutRef.current = null;
        }, 280);
    };

    return (
        <div className="group relative z-40 flex flex-1 items-center">
            <Search className="pointer-events-none absolute left-4 z-10 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-primary" />

            <div className="relative w-full">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={focused ? "Search for products, brands and more..." : ""}
                    aria-label="Search for products, brands and more"
                    className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pr-28 pl-11 text-base font-medium text-slate-700 shadow-inner shadow-slate-100 transition-all duration-300 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/25"
                />

                <AnimatePresence mode="sync">
                    {showSuggestions && (
                        <motion.div
                            key="search-suggestions"
                            variants={panelVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute z-50 mt-3 w-full origin-top rounded-2xl bg-white p-4 text-left shadow-lg will-change-transform"
                        >
                            {searchSuggestions.map((suggestion, i) => (
                                <motion.div
                                    key={`${suggestion.text}-${i}`}
                                    variants={itemVariants}
                                >
                                    <Link
                                        href={`/category/${suggestion.subcategory}`}
                                        onMouseDown={(e) => e.preventDefault()}
                                        className="block"
                                    >
                                        <div className="my-2 truncate text-base font-bold text-slate-700 capitalize transition-colors hover:text-primary">
                                            {suggestion.text}
                                            {suggestion.category && (
                                                <h4 className="text-xs font-semibold text-slate-400">
                                                    {" "}
                                                    in {suggestion.subcategory}
                                                </h4>
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {showCarousel && (
                        <motion.button
                            type="button"
                            key="carousel"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                            onClick={() => inputRef.current?.focus()}
                            className="absolute inset-y-0 left-11 right-28 flex cursor-text items-center overflow-hidden text-left"
                            tabIndex={-1}
                            aria-hidden
                        >
                            <span className="shrink-0 text-base font-medium text-slate-400">
                                Search for&nbsp;
                            </span>
                            <span className="relative h-6 flex-1 overflow-hidden">
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={SUGGESTIONS[index]}
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        transition={{
                                            y: { type: "spring", stiffness: 140, damping: 20 },
                                            opacity: { duration: 0.45, ease: [0.4, 0.0, 0.2, 1] },
                                        }}
                                        className="absolute inset-0 truncate text-base font-semibold text-slate-500 capitalize"
                                    >
                                        &quot;{SUGGESTIONS[index]}&quot;
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            <button
                type="button"
                className="absolute right-1.5 flex items-center gap-1.5 rounded-full bg-linear-to-r from-primary to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition-all duration-200 hover:from-primary-hover hover:to-indigo-600 hover:shadow-md active:scale-95"
            >
                Search
                <Search className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}
