"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ChevronDown, Check } from "lucide-react";

export type SelectOption = {
    value: string | number;
    label: string;
    icon?: ReactNode;
};

type SelectDropdownProps = {
    className?: string;
    label: string;
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
};

export default function SelectDropdown({
    className,
    label,
    options,
    value,
    onChange,
    placeholder = "Select",
    required = false,
    error,
    disabled = false,
}: SelectDropdownProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const listId = useId();
    const selected = options?.find((o: SelectOption) => o.value === value);

    useEffect(() => {
        if (!open) return;

        const onPointerDown = (e: MouseEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    return (
        <div ref={rootRef} className="relative flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
                {label}
                {required ? (
                    <span className="ml-0.5 text-primary" aria-hidden>
                        *
                    </span>
                ) : null}
            </label>

            <motion.button
                type="button"
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                aria-invalid={!!error}
                whileTap={disabled ? undefined : { scale: 0.99 }}
                onClick={() => !disabled && setOpen((v) => !v)}
                className={`flex w-full cursor-pointer items-center gap-2 rounded-xl border bg-slate-50 px-4 py-3.5 text-left text-sm font-semibold outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60 sm:text-[15px] ${className ?? ""} ${
                    error
                        ? "border-red-400 bg-red-50/80 ring-2 ring-red-400/20"
                        : open
                            ? "border-primary bg-white ring-2 ring-primary/25"
                            : "border-slate-200 hover:border-slate-300 hover:bg-white"
                }`}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {selected?.icon ? (
                        <motion.span
                            key={selected.value + "-icon"}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.12 }}
                            className="flex h-5 w-5 shrink-0 items-center justify-center text-primary [&_svg]:h-5 [&_svg]:w-5"
                        >
                            {selected.icon}
                        </motion.span>
                    ) : null}
                </AnimatePresence>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={selected?.value ?? "placeholder"}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.12 }}
                        className={`min-w-0 flex-1 truncate ${selected ? "text-slate-900" : "font-medium text-slate-400"
                            }`}
                    >
                        {selected?.label ?? placeholder}
                    </motion.span>
                </AnimatePresence>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                    className="shrink-0 text-slate-400"
                >
                    <ChevronDown className="size-4" strokeWidth={2.25} />
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.ul
                        id={listId}
                        role="listbox"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -2 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-x-0 top-[calc(100%+6px)] z-30 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 text-sm font-semibold sm:text-[15px]"
                    >
                        {options.length === 0 ? (
                            <li className="px-3.5 py-2.5 font-medium text-slate-400">
                                No options
                            </li>
                        ) : (
                            options.map((option) => {
                                const isSelected = option.value === value;
                                return (
                                    <li
                                        key={option.value}
                                        role="option"
                                        aria-selected={isSelected}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onChange(String(option.value));
                                                setOpen(false);
                                            }}
                                            className={`flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors ${isSelected
                                                    ? "bg-primary/8 text-primary"
                                                    : "text-slate-700 hover:bg-slate-50"
                                                }`}
                                        >
                                            {option.icon && (
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center [&_svg]:h-full [&_svg]:w-full">
                                                    {option.icon}
                                                </span>
                                            )}
                                            <span className="min-w-0 flex-1 truncate">
                                                {option.label}
                                            </span>
                                            {isSelected && (
                                                <Check
                                                    className="size-3.5 shrink-0 text-primary"
                                                    strokeWidth={2.5}
                                                />
                                            )}
                                        </button>
                                    </li>
                                );
                            })
                        )}
                    </motion.ul>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {error ? (
                    <motion.p
                        key={error}
                        role="alert"
                        initial={{ opacity: 0, y: -4, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -2, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="flex items-start gap-1 overflow-hidden text-xs font-semibold text-red-500"
                    >
                        <AlertCircle className="mt-px size-3.5 shrink-0" strokeWidth={2.2} />
                        <span>{error}</span>
                    </motion.p>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
