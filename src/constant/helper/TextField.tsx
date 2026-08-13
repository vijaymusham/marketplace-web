import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";


export const formContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.045, delayChildren: 0.08 },
    },
};

export const formItem = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 420, damping: 28 },
    },
};


export function Field({
    label,
    error,
    children,
    required = false,
    className = "",
    hint,
}: {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
    hint?: string;
}) {
    return (
        <motion.div
            variants={formItem}
            className={`flex flex-col gap-1.5 ${className}`}
        >
            <div className="flex items-baseline justify-between gap-2">
                <label className="text-sm font-semibold text-slate-700">
                    {label}
                    {required ? (
                        <span className="ml-0.5 text-primary" aria-hidden>
                            *
                        </span>
                    ) : null}
                </label>
                {hint ? (
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-slate-500">
                        {hint}
                    </span>
                ) : null}
            </div>
            {children}
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
        </motion.div>
    );
}

export function FormSection({
    step,
    title,
    hint,
    children,
    action,
}: {
    step?: string;
    title: string;
    hint?: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}) {
    return (
        <motion.section
            variants={formItem}
            className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0"
        >
            <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    {step ? (
                        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-heading text-[11px] font-extrabold tracking-wide text-primary">
                            {step}
                        </span>
                    ) : null}
                    <div className="min-w-0">
                        <h3 className="font-heading text-base font-bold tracking-tight text-slate-900">
                            {title}
                        </h3>
                        {hint ? (
                            <p className="mt-0.5 text-sm font-medium text-slate-500">
                                {hint}
                            </p>
                        ) : null}
                    </div>
                </div>
                {action}
            </div>
            {children}
        </motion.section>
    );
}


const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

const convert = (n: number): string =>
    n < 20
        ? ones[n]
        : n < 100
            ? `${tens[Math.floor(n / 10)]} ${ones[n % 10]}`.trim()
            : `${ones[Math.floor(n / 100)]} Hundred ${convert(n % 100)}`.trim();

export const numberToWords = (n: number): string => {
    if (!n) return "Zero";

    const units = [
        ["Crore", 10000000],
        ["Lakh", 100000],
        ["Thousand", 1000],
        ["", 1],
    ];

    return units
        .map(([name, value]) => {
            const part = Math.floor(n / Number(value));
            n %= Number(value);
            return part ? `${convert(part)} ${name}`.trim() : "";
        })
        .filter(Boolean)
        .join(" ");
};
