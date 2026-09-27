"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { X, ArrowLeft } from "lucide-react";
import {
    ensureNotificationPermission,
    getFcmToken,
} from "@/constant/firebase/messaging";
import {
    authEmailRequestOtp,
    authEmailVerifyOtp,
    authRegister,
} from "@/components/api/apis";
import type { ApiError } from "@/components/api/customAxios";
import GlowButton from "@/components/ui/GlowButton";
import {
    firebaseAuthErrorMessage,
    useCompleteAuth,
    type AuthSession,
    type PendingGoogleSignup,
} from "./useCompleteAuth";

type View = "email" | "signup" | "googleSignup" | "otp";
type OtpMode = "login" | "signup";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;

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
    initialGoogleSignup = null,
}: {
    open: boolean;
    onClose: () => void;
    /** Opens straight on the Google signup step (e.g. after One Tap found no account). */
    initialGoogleSignup?: PendingGoogleSignup | null;
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
        <AuthDrawerSession
            key={initialGoogleSignup?.idToken ?? "default"}
            onClose={onClose}
            initialGoogleSignup={initialGoogleSignup}
        />,
        document.body
    );
}

function AuthDrawerSession({
    onClose,
    initialGoogleSignup,
}: {
    onClose: () => void;
    initialGoogleSignup: PendingGoogleSignup | null;
}) {
    const { completeBackendAuth, completeGoogleSignup, signInWithGooglePopup } = useCompleteAuth();
    const [view, setView] = useState<View>(initialGoogleSignup ? "googleSignup" : "email");
    const [otpMode, setOtpMode] = useState<OtpMode>("login");
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleSignup, setGoogleSignup] = useState<PendingGoogleSignup | null>(initialGoogleSignup);
    const [email, setEmail] = useState("");
    const [name, setName] = useState(initialGoogleSignup?.profile.name ?? "");
    const [phone, setPhone] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const [sending, setSending] = useState(false);
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [verifying, setVerifying] = useState(false);
    const [resendIn, setResendIn] = useState(0);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const emailValid = EMAIL_RE.test(email.trim());
    const signupValid = name.trim().length >= 2 && PHONE_RE.test(phone);
    const otpFilled = otp.every((d) => d);

    useEffect(() => {
        if (resendIn <= 0) return;
        const id = setTimeout(() => setResendIn((s) => s - 1), 1000);
        return () => clearTimeout(id);
    }, [resendIn]);

    const openOtpView = (mode: OtpMode, message?: string) => {
        setOtpMode(mode);
        setOtp(Array(OTP_LENGTH).fill(""));
        setView("otp");
        setResendIn(RESEND_COOLDOWN_SECONDS);
        toast.success(message || "OTP sent to your email");
        setTimeout(() => otpRefs.current[0]?.focus(), 250);
    };

    const handleGoogle = async () => {
        if (googleLoading) return;
        setGoogleLoading(true);
        try {
            const result = await signInWithGooglePopup();
            if (result.status === "needsSignup") {
                setGoogleSignup(result.pending);
                setName(result.pending.profile.name ?? "");
                setView("googleSignup");
                return;
            }
            toast.success("Logged in successfully!");
            onClose();
        } catch (error) {
            const firebaseMessage = firebaseAuthErrorMessage(error);
            if (firebaseMessage !== null) {
                toast.error(firebaseMessage || apiErrorMessage(error));
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    const finishGoogleSignup = async () => {
        if (!googleSignup || !signupValid || sending) return;

        setSending(true);
        try {
            const authData = await completeGoogleSignup(googleSignup, {
                phone,
                name: name.trim(),
                referralCode: referralCode.trim() || undefined,
            });
            const serverMessage = (authData as { message?: string } | null)?.message;
            toast.success(serverMessage || "Account created successfully");
            onClose();
        } catch (error) {
            toast.error(apiErrorMessage(error));
        } finally {
            setSending(false);
        }
    };

    const sendOtp = async () => {
        if (!emailValid || sending) return;

        setSending(true);
        try {
            void ensureNotificationPermission();

            const normalized = email.trim().toLowerCase();
            setEmail(normalized);

            const res = await authEmailRequestOtp(normalized);
            if (res?.exists) {
                openOtpView("login", res.message);
            } else {
                setView("signup");
            }
        } catch (error) {
            toast.error(apiErrorMessage(error));
        } finally {
            setSending(false);
        }
    };

    const register = async () => {
        if (!signupValid || sending) return;

        setSending(true);
        try {
            const res = await authRegister({
                email: email.trim().toLowerCase(),
                name: name.trim(),
                phone,
                referralCode: referralCode.trim() || undefined,
            });
            if (!res?.ready) {
                toast.error(res?.message || "Could not start signup. Please try again.");
                return;
            }
            openOtpView("signup", res.message);
        } catch (error) {
            toast.error(apiErrorMessage(error));
        } finally {
            setSending(false);
        }
    };

    const resendOtp = () => {
        if (resendIn > 0) return;
        void (otpMode === "signup" ? register() : sendOtp());
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
            const serverMessage = (authData as { message?: string } | null)?.message;
            toast.success(
                serverMessage ||
                    (otpMode === "signup" ? "Account created successfully" : "Logged in successfully!")
            );
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
            : view === "signup"
                ? {
                    title: "Create account",
                    subtitle: (
                        <>
                            <span className="font-semibold text-slate-900">{email}</span> isn&apos;t
                            registered yet. Add your details to sign up.
                        </>
                    ),
                }
                : view === "googleSignup"
                    ? {
                        title: "Almost there",
                        subtitle: (
                            <>
                                Add your phone number to finish creating an account for{" "}
                                <span className="font-semibold text-slate-900">
                                    {googleSignup?.profile.email}
                                </span>
                            </>
                        ),
                    }
                    : {
                        title: "Login",
                        subtitle: "Enter your email to continue",
                    };

    const goBack = () => {
        if (view === "googleSignup") setGoogleSignup(null);
        setView(view === "otp" && otpMode === "signup" ? "signup" : "email");
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
                                    onClick={goBack}
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
                            else if (view === "signup") void register();
                            else if (view === "googleSignup") void finishGoogleSignup();
                        }}
                    >
                        {view === "email" ? (
                            <EmailField value={email} onChange={setEmail} />
                        ) : null}

                        {view === "signup" || view === "googleSignup" ? (
                            <>
                                <Field label="Full name">
                                    <input
                                        type="text"
                                        autoFocus
                                        autoComplete="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                        className="w-full bg-transparent text-base font-semibold text-slate-900 placeholder:font-semibold placeholder:text-slate-400 focus:outline-none"
                                    />
                                </Field>
                                <Field label="Phone">
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        autoComplete="tel-national"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                                        }
                                        placeholder="10-digit mobile number"
                                        className="w-full bg-transparent text-base font-semibold text-slate-900 placeholder:font-semibold placeholder:text-slate-400 focus:outline-none"
                                    />
                                </Field>
                                <Field label="Referral code (optional)">
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        value={referralCode}
                                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                        placeholder="Have a code?"
                                        className="w-full bg-transparent text-base font-semibold text-slate-900 placeholder:font-semibold placeholder:text-slate-400 focus:outline-none"
                                    />
                                </Field>
                                <GlowButton
                                    type="submit"
                                    disabled={!signupValid || sending}
                                    fullWidth
                                    size="lg"
                                    className="mt-1"
                                >
                                    {view === "googleSignup"
                                        ? sending
                                            ? "Creating account..."
                                            : "Create account"
                                        : sending
                                            ? "Sending OTP..."
                                            : "Sign up"}
                                </GlowButton>
                            </>
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
                        <>
                            <div className="my-5 flex items-center gap-3">
                                <span className="h-px flex-1 bg-slate-200" />
                                <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                                    or
                                </span>
                                <span className="h-px flex-1 bg-slate-200" />
                            </div>
                            <button
                                type="button"
                                onClick={() => void handleGoogle()}
                                disabled={googleLoading}
                                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3.5 text-base font-bold text-slate-800 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <GoogleIcon className="size-5" />
                                {googleLoading ? "Connecting..." : "Continue with Google"}
                            </button>
                        </>
                    ) : null}

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
                                        disabled={sending || resendIn > 0}
                                        onClick={resendOtp}
                                        className="cursor-pointer font-semibold text-primary hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {sending
                                            ? "Sending..."
                                            : resendIn > 0
                                                ? `Resend in ${resendIn}s`
                                                : "Resend OTP"}
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

export function GoogleIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
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
