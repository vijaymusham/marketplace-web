"use client";

import { Enter } from "@/components/animations/Motion";
import ShinyText from "@/components/animations/ShinyText";

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
                    <ShinyText
                        text={eyebrow}
                        className="text-[11px] tracking-[0.14em] sm:text-xs"
                    />
                    <h2 className="mt-1.5 font-heading text-[1.35rem] font-extrabold tracking-tight text-slate-900 sm:text-2xl md:text-[1.75rem]">
                        {title}
                    </h2>
                    {description ? (
                        <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-slate-500 sm:mt-1.5 sm:text-sm md:text-[15px]">
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
