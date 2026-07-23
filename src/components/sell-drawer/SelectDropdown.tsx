"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

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
            <label className="text-[15px] font-semibold text-black">{label}{required && "*"}</label>

            <motion.button
                type="button"
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                aria-invalid={!!error}
                whileTap={disabled ? undefined : { scale: 0.985 }}
                onClick={() => !disabled && setOpen((v) => !v)}
                className={`flex py-3 w-full items-center gap-2 rounded-xl text-[15px] font-semibold border bg-slate-100 px-3 text-left outline-none transition-[border-color,box-shadow,background-color] duration-200 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60 ${className} ${error
                    ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/15"
                    : open
                        ? "border-slate-300"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {selected?.icon ? (
                        <motion.span
                            key={selected.value + "-icon"}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.15 }}
                            className="flex h-5 w-5 shrink-0 items-center justify-center text-primary [&_svg]:h-5 [&_svg]:w-5"
                        >
                            {selected.icon}
                        </motion.span>
                    ) : null}
                </AnimatePresence>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={selected?.value ?? "placeholder"}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className={`min-w-0 flex-1 truncate text-[15px] font-semibold ${selected ? "text-slate-900" : "font-semibold text-slate-400"
                            }`}
                    >
                        {selected?.label ?? placeholder}
                    </motion.span>
                </AnimatePresence>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="flex shrink-0"
                >
                    <ChevronDown className="size-5 text-slate-400" strokeWidth={2.25} />
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.ul
                        id={listId}
                        role="listbox"
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 420, damping: 28 }}
                        className="absolute inset-x-0 top-[calc(100%+4px)] font-semibold text-[15px] z-30 max-h-52 origin-top overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-200/60"
                    >
                        {options.length === 0 ? (
                            <li className="px-3 py-2 text-[15px] font-semibold text-slate-400">
                                No options
                            </li>
                        ) : (
                            options.map((option, i) => {
                                const isSelected = option.value === value;
                                return (
                                    <motion.li
                                        key={option.value}
                                        role="option"
                                        aria-selected={isSelected}
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: Math.min(i * 0.02, 0.16), duration: 0.15 }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onChange(String(option.value));
                                                setOpen(false);
                                            }}
                                            className={`flex w-full items-center cursor-pointer gap-2.5 px-3 py-2 text-left transition-colors ${isSelected
                                                ? "bg-primary/8 text-primary"
                                                : "text-slate-700 hover:bg-slate-100"
                                                }`}
                                        >
                                            {option.icon && (
                                                <span className={`flex h-5 w-5 shrink-0 items-center justify-center [&_svg]:h-5 [&_svg]:w-5 ${isSelected ? "text-primary" : "text-slate-700"}`}>
                                                    {option.icon}
                                                </span>
                                            )}
                                            <span className="min-w-0 flex-1 truncate text-sm font-bold">
                                                {option.label}
                                            </span>
                                            {isSelected && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                                                >
                                                    <Check
                                                        className="size-3.5 shrink-0 text-primary"
                                                        strokeWidth={2.5}
                                                    />
                                                </motion.span>
                                            )}
                                        </button>
                                    </motion.li>
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
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -4, height: 0 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-start gap-1 overflow-hidden text-xs font-medium text-red-500"
                    >
                        <span className="mt-px leading-none" aria-hidden>
                            •
                        </span>
                        <span>{error}</span>
                    </motion.p>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
