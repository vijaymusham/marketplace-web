"use client";

import { useState } from "react";
import { ChevronDown, X, LocateFixed, Search } from "lucide-react";

export default function LocationPicker() {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative hidden md:block">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex shrink-0 flex-col items-start gap-0.5 text-left"
            >
                <span className="font-heading text-xs font-medium text-slate-500">
                    Location
                </span>
                <span className="flex items-center gap-1 text-sm font-medium text-slate-900 hover:text-primary">
                    <span className="max-w-40 truncate">Select location</span>
                    <ChevronDown className="h-4 w-4 shrink-0" />
                </span>
            </button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/50"
                        onClick={() => setOpen(false)}
                    />

                    <div className="absolute top-full left-0 z-50 mt-3 w-95 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-900/5">
                        <div className="flex items-center justify-between">
                            <h2 className="font-heading text-lg font-extrabold text-slate-900">
                                Change Location
                            </h2>
                            <button
                                onClick={() => setOpen(false)}
                                aria-label="Close"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-6 flex flex-col gap-4">
                            <button className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
                                <LocateFixed className="h-4 w-4" />
                                Detect my location
                            </button>

                            <div className="flex items-center gap-3">
                                <span className="h-px flex-1 bg-slate-200" />
                                <span className="rounded-full border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-400">
                                    OR
                                </span>
                                <span className="h-px flex-1 bg-slate-200" />
                            </div>

                            <div className="relative">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search delivery location"
                                    className="w-full rounded-full border border-slate-200 py-3 pr-4 pl-11 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
