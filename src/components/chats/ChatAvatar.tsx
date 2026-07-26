"use client";

import Image from "next/image";

type ChatAvatarProps = {
    label: string;
    color: string;
    photo?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    online?: boolean;
    className?: string;
    ring?: boolean;
};

const sizes = {
    xs: "h-6 w-6 text-[9px]",
    sm: "h-8 w-8 text-[11px]",
    md: "h-11 w-11 text-xs",
    lg: "h-12 w-12 text-sm",
    xl: "h-[72px] w-[72px] text-xl",
    "2xl": "h-24 w-24 text-2xl",
};

export default function ChatAvatar({
    label,
    color,
    photo,
    size = "md",
    online,
    className = "",
    ring = false,
}: ChatAvatarProps) {
    return (
        <div className={`relative shrink-0 ${className}`}>
            {photo ? (
                <Image
                    width={100}
                    height={100}
                    src={photo}
                    alt={label || "Avatar"}
                    className={`${sizes[size]} rounded-full bg-slate-100 object-cover ${ring ? "ring-2 ring-white" : ""
                        }`}
                    priority
                />
            ) : (
                <div
                    className={`${sizes[size]} flex items-center justify-center rounded-full font-bold text-white ${ring ? "ring-2 ring-white" : ""
                        }`}
                    style={{ backgroundColor: color }}
                >
                    {label}
                </div>
            )}
            {online != null && (
                <span
                    className={`absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full ring-[2.5px] ring-white ${online ? " bg-green-500" : "bg-slate-300"
                        }`}
                />
            )}
        </div>
    );
}
