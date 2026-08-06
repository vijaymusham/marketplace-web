"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X, LocateFixed, Search, MapPin } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { setAddress, setLocation } from "../redux/slices/authSlice";
import { toast } from "react-hot-toast";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

function shortAddress(address: string | null | undefined) {
    if (!address) return "Select location";
    const part = address.split(",")[0]?.trim();
    return part || address;
}

export default function LocationPicker({ compact = false }: { compact?: boolean }) {
    const dispatch = useDispatch<AppDispatch>();
    const address = useSelector((state: RootState) => state.user.address);
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);

    const getAddress = async (lat: number, lng: number) => {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );

        const data = await res.json();
        return data.display_name;
    };

    const getLocation = useCallback(async () => {
        try {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    dispatch(
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        })
                    );
                    const nextAddress = await getAddress(
                        position.coords.latitude,
                        position.coords.longitude,
                    );
                    dispatch(setAddress(nextAddress));
                    toast.success("Location detected successfully");
                    setOpen(false);
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            toast.error("Please allow location access.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            toast.error("Location unavailable.");
                            break;
                        case error.TIMEOUT:
                            toast.error("Location request timed out.");
                            break;
                        default:
                            toast.error("Unable to get location.");
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0,
                }
            );
        } catch {
            toast.error("Unable to get location.");
        }
    }, [dispatch]);

    useEffect(() => {
        setTimeout(() => {
            setMounted(true);
        }, 100);
    }, []);

    useEffect(() => {
        if (!open) return;

        const updatePos = () => {
            const el = triggerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const width = Math.min(380, window.innerWidth - 32);
            const left = Math.min(
                Math.max(16, rect.left),
                window.innerWidth - width - 16,
            );
            setPos({ top: rect.bottom + 12, left });
        };

        updatePos();
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        window.addEventListener("resize", updatePos);
        window.addEventListener("scroll", updatePos, true);

        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("resize", updatePos);
            window.removeEventListener("scroll", updatePos, true);
        };
    }, [open]);

    const label = shortAddress(address);

    return (
        <div className={`relative ${compact ? "min-w-0 shrink" : "shrink-0"}`}>
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label="Change location"
                className={
                    compact
                        ? "flex min-w-0 max-w-full items-center justify-end gap-1 text-left"
                        : "flex shrink-0 flex-col items-start gap-0.5 text-left"
                }
            >
                {compact ? (
                    <>
                        <MapPin className="h-4 w-4 shrink-0 text-slate-800" strokeWidth={2} />
                        <span className="max-w-[7.5rem] truncate text-sm font-bold text-slate-900 sm:max-w-[9rem]">
                            {label}
                        </span>
                        <ChevronDown
                            className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        />
                    </>
                ) : (
                    <>
                        <span className="font-heading text-xs font-semibold text-slate-500">
                            Location
                        </span>
                        <span className="flex items-center gap-1 text-sm font-semibold text-slate-900 hover:text-primary">
                            <span className="max-w-28 truncate font-semibold lg:max-w-40">
                                {address ? address : "Select location"}
                            </span>
                            <ChevronDown
                                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                            />
                        </span>
                    </>
                )}
            </button>

            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {open && (
                            <>
                                <motion.div
                                    key="location-backdrop"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="fixed inset-0 z-100 bg-slate-900/45 "
                                    onClick={() => setOpen(false)}
                                    aria-hidden
                                />

                                <motion.div
                                    key="location-card"
                                    role="dialog"
                                    aria-modal="true"
                                    aria-label="Change Location"
                                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                    transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                                    style={{ top: pos.top, left: pos.left }}
                                    className="fixed z-101 w-[min(100vw-2rem,23.75rem)] origin-top-left rounded-2xl bg-white p-5 shadow-xl sm:p-6"
                                    data-lenis-prevent
                                >
                                    <span
                                        aria-hidden
                                        className="absolute -top-1.5 left-8 h-3 w-3 rotate-45 rounded-xs border-t border-l border-slate-200/70 bg-white"
                                    />

                                    <div className="relative flex items-center justify-between">
                                        <h2 className="font-heading text-lg font-extrabold text-slate-900">
                                            Change Location
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={() => setOpen(false)}
                                            aria-label="Close"
                                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="mt-6 flex flex-col gap-4">
                                        <button
                                            type="button"
                                            onClick={() => getLocation()}
                                            className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                                        >
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
                                            <Search className="pointer-events-none absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <GooglePlacesAutocomplete
                                                apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}
                                                selectProps={{
                                                    placeholder: "Search delivery location",
                                                    autoFocus: true,
                                                    isClearable: true,
                                                    className: "w-full text-sm",
                                                    classNamePrefix: "location-places",
                                                    noOptionsMessage: () => "No locations found",
                                                    loadingMessage: () => "Searching…",
                                                    menuPortalTarget:
                                                        typeof document !== "undefined"
                                                            ? document.body
                                                            : null,
                                                    menuPosition: "fixed",
                                                    components: {
                                                        DropdownIndicator: () => null,
                                                        IndicatorSeparator: () => null,
                                                    },
                                                    styles: {
                                                        container: (base) => ({
                                                            ...base,
                                                            width: "100%",
                                                        }),
                                                        control: (base, state) => ({
                                                            ...base,
                                                            minHeight: 48,
                                                            borderRadius: 9999,
                                                            borderWidth: 1,
                                                            borderColor: state.isFocused
                                                                ? "#2f3adf"
                                                                : "#e2e8f0",
                                                            boxShadow: state.isFocused
                                                                ? "0 0 0 3px rgba(47, 58, 223, 0.15)"
                                                                : "none",
                                                            backgroundColor: "#fff",
                                                            paddingLeft: 36,
                                                            paddingRight: 4,
                                                            cursor: "text",
                                                            transition:
                                                                "border-color 0.15s ease, box-shadow 0.15s ease",
                                                            "&:hover": {
                                                                borderColor: state.isFocused
                                                                    ? "#2f3adf"
                                                                    : "#cbd5e1",
                                                            },
                                                        }),
                                                        valueContainer: (base) => ({
                                                            ...base,
                                                            padding: "2px 8px",
                                                        }),
                                                        input: (base) => ({
                                                            ...base,
                                                            margin: 0,
                                                            fontWeight: 500,
                                                            padding: 0,
                                                            color: "#334155",
                                                            fontSize: "0.875rem",
                                                        }),
                                                        placeholder: (base) => ({
                                                            ...base,
                                                            color: "#94a3b8",
                                                            fontSize: "0.875rem",
                                                            fontWeight: 500,
                                                        }),
                                                        singleValue: (base) => ({
                                                            ...base,
                                                            color: "#334155",
                                                            fontSize: "0.875rem",
                                                            fontWeight: 500,
                                                        }),
                                                        clearIndicator: (base) => ({
                                                            ...base,
                                                            color: "#94a3b8",
                                                            padding: 6,
                                                            cursor: "pointer",
                                                            "&:hover": {
                                                                color: "#64748b",
                                                            },
                                                        }),
                                                        menu: (base) => ({
                                                            ...base,
                                                            marginTop: 8,
                                                            borderRadius: 16,
                                                            fontWeight: 500,
                                                            overflow: "hidden",
                                                            border: "1px solid #e2e8f0",
                                                            boxShadow:
                                                                "0 12px 40px rgba(15, 23, 42, 0.12), 0 2px 8px rgba(15, 23, 42, 0.06)",
                                                            zIndex: 200,
                                                        }),
                                                        menuPortal: (base) => ({
                                                            ...base,
                                                            zIndex: 200,
                                                        }),
                                                        menuList: (base) => ({
                                                            ...base,
                                                            padding: 6,
                                                            maxHeight: 240,
                                                            fontWeight: 500,
                                                        }),
                                                        option: (base, state) => ({
                                                            ...base,
                                                            borderRadius: 10,
                                                            padding: "10px 12px",
                                                            fontSize: "0.875rem",
                                                            lineHeight: 1.35,
                                                            fontFamily: "var(--font-heading)",
                                                            cursor: "pointer",
                                                            backgroundColor: state.isSelected
                                                                ? "#2f3adf"
                                                                : state.isFocused
                                                                    ? "rgba(47, 58, 223, 0.08)"
                                                                    : "transparent",
                                                            color: state.isSelected
                                                                ? "#fff"
                                                                : "#334155",
                                                            fontWeight: state.isSelected
                                                                ? 600
                                                                : 500,
                                                            ":active": {
                                                                backgroundColor: state.isSelected
                                                                    ? "#2530b8"
                                                                    : "rgba(47, 58, 223, 0.12)",
                                                            },
                                                        }),
                                                        noOptionsMessage: (base) => ({
                                                            ...base,
                                                            color: "#94a3b8",
                                                            fontSize: "0.875rem",
                                                            padding: "12px",
                                                            fontWeight: 500,
                                                        }),
                                                        loadingMessage: (base) => ({
                                                            ...base,
                                                            color: "#94a3b8",
                                                            fontSize: "0.875rem",
                                                            padding: "12px",
                                                            fontWeight: 500,
                                                        }),
                                                    },
                                                    onChange: (place) => {
                                                        if (!place) return;
                                                        const next =
                                                            typeof place.label === "string"
                                                                ? place.label
                                                                : String(place.label ?? "");
                                                        if (!next) return;
                                                        dispatch(setAddress(next));
                                                        setOpen(false);
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </div>
    );
}
