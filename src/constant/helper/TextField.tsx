import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";


export const formContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.055, delayChildren: 0.12 },
    },
};

export const formItem = {
    hidden: { opacity: 0, y: 14 },
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
}: {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            variants={formItem}
            className={`flex flex-col gap-1.5 ${className}`}
        >
            <label className="text-[15px] font-semibold text-black">{label}{required && "*"}</label>
            {children}
            <AnimatePresence mode="wait">
                {error ? (
                    <motion.p
                        key={error}
                        role="alert"
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -4, height: 0 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-start gap-1 overflow-hidden text-xs font-semibold text-red-500"
                    >
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 18 }}
                            className="mt-px leading-none"
                            aria-hidden
                        >
                            <AlertCircle className="size-3" strokeWidth={2.2} />
                        </motion.span>
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
    step: string;
    title: string;
    hint?: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}) {
    return (
        <motion.section
            variants={formItem}
            className="relative border-b border-slate-100 pb-6 last:border-b-0 last:pb-0"
        >
            <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-heading text-xs font-extrabold text-primary">
                            {step}
                        </span>
                        <h3 className="font-heading text-base font-bold tracking-tight text-slate-900">
                            {title}
                        </h3>
                    </div>
                    {/* {hint ? (
                        <p className="pl-9.5 text-sm font-semibold text-slate-400">
                            {hint}
                        </p>
                    ) : null} */}
                </div>
                {action}
            </div>
            {children}
        </motion.section>
    );
}
