"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Bell,
    BellDot,
    CircleDollarSign,
    MessageCircle,
    Sparkles,
    Tag,
} from "lucide-react";
import { useHasMounted } from "@/hooks/useWishlist";
import {
    useNotifications,
    type AppNotification,
} from "@/hooks/useNotifications";

const typeIcon = {
    deal: Tag,
    message: MessageCircle,
    system: Sparkles,
    price: CircleDollarSign,
} as const;

export default function NotificationButton() {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const mounted = useHasMounted();
    const { items, count, unreadCount, clearAll, markRead, remove } =
        useNotifications();
    const displayCount = mounted ? unreadCount : 0;

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
        <div ref={rootRef} className="relative">
            <button
                type="button"
                aria-label="Notifications"
                aria-expanded={open}
                aria-haspopup="dialog"
                onClick={() => setOpen((v) => !v)}
                className={`group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ${open
                    ? "bg-primary/10 text-primary"
                    : "text-slate-500 hover:bg-primary/10 hover:text-primary"
                    }`}
            >
                <BellDot
                    className={`h-5.5 w-5.5 transition-transform duration-200 group-hover:scale-110 ${displayCount > 0 ? "text-primary" : ""
                        }`}
                    strokeWidth={1.75}
                />
                <span className="absolute top-0 right-0 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-linear-to-br from-primary to-indigo-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {displayCount}
                </span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        role="dialog"
                        aria-label="Notifications"
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
                        className="absolute top-full right-0 z-50 mt-3 w-[min(92vw,360px)] origin-top-right"
                        data-lenis-prevent
                    >
                        {/* Caret pointing up to the bell */}
                        <span
                            aria-hidden
                            className="absolute -top-1.5 right-3.5 h-3 w-3 rotate-45   bg-white"
                        />

                        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl p-2">
                            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                                <p className="text-sm font-bold text-slate-900">
                                    {count === 0 ? "Notification" : `Notifications (${count})`}
                                </p>
                                {count > 0 && (
                                    <button
                                        type="button"
                                        onClick={clearAll}
                                        className="rounded-full px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[min(60vh,420px)] overflow-y-auto overscroll-contain p-1.5">
                                {count === 0 ? (
                                    <div className="flex flex-col items-center px-5 py-10 text-center">
                                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                            <Bell className="h-5 w-5" strokeWidth={1.75} />
                                        </span>
                                        <p className="mt-3 text-sm font-bold text-slate-900">
                                            You&apos;re all caught up
                                        </p>
                                        <p className="mt-1 max-w-55 text-xs leading-relaxed font-medium text-slate-500">
                                            Deal alerts, messages, and price drops will show up here.
                                        </p>
                                    </div>
                                ) : (
                                    <ul className="space-y-0.5">
                                        {items.map((item) => (
                                            <NotificationRow
                                                key={item.id}
                                                item={item}
                                                onOpen={() => markRead(item.id)}
                                                onRemove={() => remove(item.id)}
                                            />
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function NotificationRow({
    item,
    onOpen,
    onRemove,
}: {
    item: AppNotification;
    onOpen: () => void;
    onRemove: () => void;
}) {
    const Icon = typeIcon[item.type];

    return (
        <li>
            <button
                type="button"
                onClick={onOpen}
                className={`flex w-full gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-slate-50 ${item.read ? "" : "bg-primary/4"
                    }`}
            >
                <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.read
                        ? "bg-slate-100 text-slate-500"
                        : "bg-primary/10 text-primary"
                        }`}
                >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>

                <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                        <span
                            className={`text-[13px] leading-snug ${item.read
                                ? "font-semibold text-slate-700"
                                : "font-bold text-slate-900"
                                }`}
                        >
                            {item.title}
                        </span>
                        {!item.read && (
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        )}
                    </span>
                    <span className="mt-0.5 line-clamp-2 text-xs leading-relaxed font-medium text-slate-500">
                        {item.body}
                    </span>
                    <span className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-medium text-slate-400">
                            {item.time}
                        </span>
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onRemove();
                                }
                            }}
                            className="text-[11px] font-semibold text-slate-400 transition-colors hover:text-rose-500"
                        >
                            Dismiss
                        </span>
                    </span>
                </span>
            </button>
        </li>
    );
}
