"use client";

import { Enter } from "@/components/animations/Motion";

type SectionHeaderProps = {
    eyebrow: string;
    title: string;
    description?: string;
    showDivider?: boolean;
};

export default function SectionHeader({
    eyebrow,
    title,
    description,
    showDivider = false,
}: SectionHeaderProps) {
    return (
        <Enter>
            <div className={showDivider ? "flex items-end justify-between gap-4" : undefined}>
                <div className={showDivider ? "min-w-0" : undefined}>
                    <p className="text-[10px] font-semibold tracking-[0.14em] text-primary uppercase sm:text-xs">
                        {eyebrow}
                    </p>
                    <h2 className="mt-0.5 text-balance font-heading text-[1.2rem] font-black leading-snug tracking-tight text-slate-900 sm:mt-1 sm:text-2xl md:text-[1.75rem]">
                        {title}
                    </h2>
                    {description ? (
                        <p className="mt-1 max-w-xl text-pretty text-[13px] leading-relaxed text-slate-600 sm:mt-1.5 sm:text-sm md:text-[15px]">
                            {description}
                        </p>
                    ) : null}
                </div>
                {showDivider ? (
                    <div
                        aria-hidden
                        className="mb-1 hidden h-px flex-1 bg-linear-to-r from-slate-200/80 to-transparent md:block"
                    />
                ) : null}
            </div>
        </Enter>
    );
}
