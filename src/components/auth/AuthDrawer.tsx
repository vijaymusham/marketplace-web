"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { X, ArrowLeft } from "lucide-react";
import { useDispatch } from "react-redux";
import {
    ensureNotificationPermission,
    getFcmToken,
} from "@/constant/firebase/messaging";
import {
    authEmailRequestOtp,
    authEmailVerifyOtp,
    getUser,
} from "@/components/api/apis";
import type { ApiError } from "@/components/api/customAxios";
import { setUser, type userState } from "@/components/redux/slices/authSlice";
import type { AppDispatch } from "@/components/redux/store";
import GlowButton from "@/components/ui/GlowButton";

type View = "email" | "otp";
type AuthSession = NonNullable<userState["user"]>;

const OTP_LENGTH = 6;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function apiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
    if (error && typeof error === "object" && "message" in error) {
        const message = String((error as ApiError).message || "").trim();
        if (message) return message;
    }
    return fallback;
}

export default function AuthDrawer({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setMounted(true);
        }, 100);
    }, []);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (!mounted || !open) return null;

    return createPortal(
        <AuthDrawerSession onClose={onClose} />,
        document.body
    );
}

function AuthDrawerSession({ onClose }: { onClose: () => void }) {
    const dispatch = useDispatch<AppDispatch>();
    const [view, setView] = useState<View>("email");
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [verifying, setVerifying] = useState(false);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const emailValid = EMAIL_RE.test(email.trim());
    const otpFilled = otp.every((d) => d);

    const completeBackendAuth = async (authData: AuthSession) => {
        if (authData?.accessToken) {
            localStorage.setItem("token", authData.accessToken);
        }

        const fcmToken = await getFcmToken();
        if (fcmToken) {
            localStorage.setItem("fcmToken", fcmToken);
            try {
                const { registerDeviceToken } = await import("@/components/api/apis");
                await registerDeviceToken({ token: fcmToken, platform: "web" });
            } catch (error) {
                console.warn("[FCM] device-token register after login failed:", error);
            }
        }

        dispatch(setUser(authData));

        const me = await getUser();
        if (me) {
            if (me.user && me.accessToken) {
                dispatch(setUser(me));
            } else if (me.id && authData) {
                dispatch(setUser({ ...authData, user: me }));
            }
        }

        return authData;
    };

    const sendOtp = async () => {
        if (!emailValid || sending) return;

        setSending(true);
        try {
            void ensureNotificationPermission();

            const normalized = email.trim().toLowerCase();
            setEmail(normalized);

            await authEmailRequestOtp(normalized);
            setOtp(Array(OTP_LENGTH).fill(""));
            setView("otp");
            toast.success("OTP sent to your email");
            setTimeout(() => otpRefs.current[0]?.focus(), 250);
        } catch (error) {
            toast.error(apiErrorMessage(error));
        } finally {
            setSending(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const next = [...otp];
        next[index] = digit;
        setOtp(next);
        if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const digits = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, OTP_LENGTH);
        if (!digits) return;
        e.preventDefault();
        const next = Array(OTP_LENGTH).fill("");
        digits.split("").forEach((d, i) => (next[i] = d));
        setOtp(next);
        otpRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleVerify = async () => {
        if (!otpFilled || verifying) return;
        setVerifying(true);
        try {
            await ensureNotificationPermission();
            const code = otp.join("");
            const normalized = email.trim().toLowerCase();
            const fcmToken = await getFcmToken();

            const authData = (await authEmailVerifyOtp({
                email: normalized,
                code,
                platform: "web",
                fcmToken: fcmToken || undefined,
            })) as AuthSession;

            await completeBackendAuth(authData);
            toast.success("Logged in successfully!");
            onClose();
        } catch (error) {
            toast.error(apiErrorMessage(error));
        } finally {
            setVerifying(false);
        }
    };

    const heading =
        view === "otp"
            ? {
                title: "Verify OTP",
                subtitle: (
                    <>
                        Enter the 6-digit code sent to{" "}
                        <span className="font-semibold text-slate-900">{email}</span>
                    </>
                ),
            }
            : {
                title: "Login",
                subtitle: "Enter your email to continue",
            };

    return (
        <div
            className="fixed inset-0 z-9999 flex items-center justify-center p-0 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/35 backdrop-blur-[3px]"
            />

            <motion.aside
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 340, damping: 32, mass: 0.85 }}
                className="relative flex h-full max-h-dvh w-full max-w-md flex-col overflow-hidden bg-white sm:h-auto sm:max-h-[min(90dvh,720px)] sm:rounded-4xl"
                data-lenis-prevent
                onClick={(e) => e.stopPropagation()}
            >
                <header className="relative z-10 shrink-0 bg-linear-to-b from-primary/15 via-primary/8 to-white px-5 pt-5 pb-4 sm:px-8 sm:pt-7 sm:pb-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            {view !== "email" ? (
                                <button
                                    type="button"
                                    onClick={() => setView("email")}
                                    className="mb-3 inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-bold text-primary transition-colors duration-300 hover:bg-primary hover:text-white"
                                >
                                    <ArrowLeft className="size-3.5" strokeWidth={2.5} />
                                    Go back
                                </button>
                            ) : null}
                            <h2
                                id="auth-modal-title"
                                className="font-heading text-2xl font-extrabold tracking-tight text-primary sm:text-[1.75rem]"
                            >
                                {heading.title}
                            </h2>
                            <p className="mt-1 text-sm font-medium text-slate-500">
                                {heading.subtitle}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/80 text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
                        >
                            <X className="size-5" strokeWidth={2.25} />
                        </button>
                    </div>
                </header>

                <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8 sm:py-6">
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (view === "email") void sendOtp();
                        }}
                    >
                        {view === "email" ? (
                            <EmailField value={email} onChange={setEmail} />
                        ) : null}

                        {view === "email" ? (
                            <GlowButton
                                type="submit"
                                disabled={!emailValid || sending}
                                fullWidth
                                size="lg"
                                className="mt-1"
                            >
                                {sending ? "Sending OTP..." : "Continue"}
                            </GlowButton>
                        ) : null}
                    </form>

                    {view === "email" ? (
                        <p className="mx-auto mt-4 max-w-80 text-center text-xs leading-relaxed font-semibold text-slate-400">
                            By clicking on Continue, I accept the{" "}
                            <span className="cursor-pointer font-semibold text-slate-600 underline hover:text-primary">
                                Terms &amp; Conditions
                            </span>{" "}
                            &amp;{" "}
                            <span className="cursor-pointer font-semibold text-slate-600 underline hover:text-primary">
                                Privacy Policy
                            </span>
                        </p>
                    ) : null}

                    <AnimatePresence mode="wait">
                        {view === "otp" && (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -24 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex justify-between gap-2">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={(el) => {
                                                otpRefs.current[i] = el;
                                            }}
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                            onPaste={handleOtpPaste}
                                            aria-label={`OTP digit ${i + 1}`}
                                            className="h-14 w-full max-w-12 rounded-2xl border border-slate-200 bg-slate-100 text-center font-heading text-xl font-extrabold text-slate-900 transition-colors duration-150 focus:border-slate-300 focus:bg-white focus:ring-1 focus:ring-slate-200 focus:outline-none sm:h-16 sm:max-w-14 sm:text-2xl"
                                        />
                                    ))}
                                </div>

                                <GlowButton
                                    type="button"
                                    onClick={() => void handleVerify()}
                                    disabled={!otpFilled || verifying}
                                    fullWidth
                                    size="lg"
                                    className="mt-6"
                                >
                                    {verifying ? "Verifying..." : "Verify OTP"}
                                </GlowButton>

                                <p className="mt-5 text-center text-sm font-medium text-slate-500">
                                    Didn&apos;t receive it?{" "}
                                    <button
                                        type="button"
                                        disabled={sending}
                                        onClick={() => void sendOtp()}
                                        className="cursor-pointer font-semibold text-primary hover:text-primary-hover disabled:opacity-60"
                                    >
                                        {sending ? "Sending..." : "Resend OTP"}
                                    </button>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.aside>
        </div>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="group flex items-center gap-3 rounded-2xl border border-transparent bg-slate-100 px-4 py-3 transition-colors duration-150 focus-within:border-slate-300 focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-200">
            <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                    {label}
                </span>
                {children}
            </span>
        </label>
    );
}

function EmailField({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <Field label="Email">
            <input
                type="email"
                autoFocus
                autoComplete="email"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-base font-semibold text-slate-900 placeholder:font-semibold placeholder:text-slate-400 focus:outline-none"
            />
        </Field>
    );
}
