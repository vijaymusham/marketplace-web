"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Bell, X } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
    ensureNotificationPermission,
    getFcmToken,
    subscribeForegroundMessages,
} from "@/constant/firebase/messaging";
import { pushNotification } from "@/hooks/useNotifications";
import { syncDeviceTokenToServer } from "@/lib/fcmDeviceToken";
import type { RootState } from "@/components/redux/store";

const DISMISS_KEY = "DealPokket-fcm-prompt-dismissed";
const PROMPT_DELAY_MS = 5 * 60 * 1000;

export default function FcmProvider({ children }: { children: ReactNode }) {
    const [showPrompt, setShowPrompt] = useState(false);
    const [asking, setAsking] = useState(false);
    const accessToken = useSelector(
        (state: RootState) => state.user.user?.accessToken ?? null,
    );

    useEffect(() => {
        if (!accessToken) return;
        if (typeof window === "undefined" || !("Notification" in window)) return;
        if (Notification.permission !== "granted") return;
        void syncDeviceTokenToServer();
    }, [accessToken]);

    useEffect(() => {
        let unsubscribe: (() => void) | null = null;
        let cancelled = false;
        let promptTimer = 0;

        void (async () => {
            if (typeof window === "undefined" || !("Notification" in window)) return;

            const permission = Notification.permission;

            if (permission === "granted") {
                const token = await getFcmToken();
                if (token) localStorage.setItem("fcmToken", token);
            } else if (permission === "default") {
                const dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
                if (!dismissed) {
                    promptTimer = window.setTimeout(() => {
                        if (!cancelled && Notification.permission === "default") {
                            setShowPrompt(true);
                        }
                    }, PROMPT_DELAY_MS);
                }
            }

            const unsub = await subscribeForegroundMessages((payload) => {
                const title =
                    payload.notification?.title ||
                    payload.data?.title ||
                    "Deal Pokket";
                const body =
                    payload.notification?.body || payload.data?.body || "";

                pushNotification({
                    title,
                    body: body || "New notification",
                    type:
                        payload.data?.type === "chat.message" ||
                            payload.data?.type === "message"
                            ? "message"
                            : payload.data?.type === "deal" ||
                                payload.data?.type === "price" ||
                                payload.data?.type === "system"
                                ? payload.data.type
                                : "system",
                });
            });

            if (cancelled) {
                unsub?.();
                return;
            }
            unsubscribe = unsub;
        })();

        return () => {
            cancelled = true;
            window.clearTimeout(promptTimer);
            unsubscribe?.();
        };
    }, []);

    const handleAllow = async () => {
        if (asking) return;
        setAsking(true);
        try {
            const permission = await ensureNotificationPermission();
            setShowPrompt(false);

            if (permission === "granted") {
                await syncDeviceTokenToServer();
                toast.success("Notifications enabled");
            } else if (permission === "denied") {
                toast.error(
                    "Notifications blocked. Enable them from the browser site settings.",
                );
            }
        } finally {
            setAsking(false);
        }
    };

    const handleDismiss = () => {
        sessionStorage.setItem(DISMISS_KEY, "1");
        setShowPrompt(false);
    };

    return (
        <>
            {children}

            {showPrompt && (
                <div
                    className="fixed inset-0 z-100000 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="fcm-prompt-title"
                >
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Bell className="h-6 w-6" strokeWidth={1.75} />
                            </div>
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={handleDismiss}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <h2
                            id="fcm-prompt-title"
                            className="mt-4 font-heading text-xl font-extrabold text-slate-900"
                        >
                            Allow notifications?
                        </h2>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                            Get alerts for new messages, offers, and updates while you buy or sell
                            on Deal Pokket.
                        </p>

                        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
                            <button
                                type="button"
                                disabled={asking}
                                onClick={() => void handleAllow()}
                                className="flex-1 rounded-2xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-primary-hover disabled:opacity-60"
                            >
                                {asking ? "Asking..." : "Allow"}
                            </button>
                            <button
                                type="button"
                                disabled={asking}
                                onClick={handleDismiss}
                                className="flex-1 rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"
                            >
                                Not now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
