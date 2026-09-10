"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { X, ArrowLeft } from "lucide-react";
import { useDispatch } from "react-redux";
import {
    initializeRecaptchaConfig,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    type ConfirmationResult,
    type User,
} from "firebase/auth";
import { auth } from "@/constant/firebase/firebase";
import {
    ensureNotificationPermission,
    getFcmToken,
} from "@/constant/firebase/messaging";
import { authApi, authPhoneCheck, getUser } from "@/components/api/apis";
import type { ApiError } from "@/components/api/customAxios";
import { setUser } from "@/components/redux/slices/authSlice";
import type { AppDispatch } from "@/components/redux/store";
import GlowButton from "@/components/ui/GlowButton";

type View = "phone" | "otp" | "details";

const OTP_LENGTH = 6;
const RECAPTCHA_ID = "firebase-recaptcha";

function isLocalhostHost() {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname;
    return host === "localhost" || host === "[::1]";
}

function currentHostLabel() {
    if (typeof window === "undefined") return "";
    return window.location.hostname;
}

function firebaseAuthErrorMessage(error: unknown): string {
    const code =
        error && typeof error === "object" && "code" in error
            ? String((error as { code: string }).code)
            : "";
    const message =
        error && typeof error === "object" && "message" in error
            ? String((error as { message: string }).message)
            : "";

    if (
        code === "auth/invalid-app-credential" ||
        message.includes("INVALID_APP_CREDENTIAL")
    ) {
        if (isLocalhostHost()) {
            return "Real SMS does not work on localhost. Use a Firebase test number, or open the app on 127.0.0.1 / a deployed domain.";
        }
        return "Phone verification failed. Confirm this domain is authorized in Firebase Authentication settings.";
    }

    switch (code) {
        case "auth/invalid-phone-number":
            return "Invalid phone number.";
        case "auth/too-many-requests":
            return "Too many attempts. Try again later.";
        case "auth/invalid-verification-code":
            return "Incorrect OTP. Please try again.";
        case "auth/code-expired":
            return "OTP expired. Request a new one.";
        case "auth/captcha-check-failed":
            return "Captcha failed. Refresh and try again.";
        case "auth/quota-exceeded":
            return "SMS quota exceeded. Try again later.";
        case "auth/billing-not-enabled":
            return "Real SMS requires Firebase Blaze billing to be enabled.";
        default:
            return "Something went wrong. Please try again.";
    }
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

function apiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
    if (error && typeof error === "object" && "message" in error) {
        const message = String((error as ApiError).message || "").trim();
        if (message) return message;
    }
    return fallback;
}

function AuthDrawerSession({ onClose }: { onClose: () => void }) {
    const dispatch = useDispatch<AppDispatch>();
    const [view, setView] = useState<View>("phone");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [referral, setReferral] = useState("");
    const [showReferral, setShowReferral] = useState(false);
    const [sending, setSending] = useState(false);
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [verifying, setVerifying] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const confirmationRef = useRef<ConfirmationResult | null>(null);
    const verifierRef = useRef<RecaptchaVerifier | null>(null);

    // Backend phone/check result — Firebase is only used for SMS OTP.
    const phoneExistsRef = useRef(false);

    const completeBackendAuth = async (
        firebaseUser: User,
        profile: { name: string; email: string; referralCode?: string; exists?: boolean }
    ) => {
        const idToken = await firebaseUser.getIdToken(true);

        const fcmToken = await getFcmToken();

        const authData = await authApi(idToken, {
            ...(!profile?.exists
                ? {
                    name: profile.name.trim(),
                    email: profile.email.trim(),
                    referralCode: profile.referralCode?.trim() || undefined,
                }
                : {}),
            platform: "web",
            fcmToken: fcmToken || undefined,
        });

        if (authData?.accessToken) {
            localStorage.setItem("token", authData.accessToken);
        }

        if (fcmToken) {
            localStorage.setItem("fcmToken", fcmToken);
            // Refresh/register on the dedicated endpoint so this account owns the token.
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

    useEffect(() => {
        let cancelled = false;
        let timer = 0;

        const setup = async () => {
            // Wait a frame so the captcha container is in the DOM.
            await new Promise<void>((resolve) => {
                timer = window.setTimeout(() => resolve(), 50);
            });
            if (cancelled) return;

            try {
                try {
                    await initializeRecaptchaConfig(auth);
                } catch {
                    // Optional — older projects may not need Enterprise config.
                }

                const el = document.getElementById(RECAPTCHA_ID);
                if (!el || cancelled) return;

                el.innerHTML = "";
                const verifier = new RecaptchaVerifier(auth, RECAPTCHA_ID, {
                    size: "normal",
                    callback: () => {
                        /* solved */
                    },
                    "expired-callback": () => {
                        toast.error("Captcha expired. Please solve it again.");
                    },
                });
                verifierRef.current = verifier;
                await verifier.render();
            } catch {
                if (!cancelled) {
                    toast.error("Could not load captcha. You can still try Continue.");
                }
            }
        };

        void setup();

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
            try {
                verifierRef.current?.clear();
            } catch {
                /* ignore */
            }
            verifierRef.current = null;
        };
    }, []);

    const phoneValid = /^\d{10}$/.test(phone);

    const sendOtp = async () => {
        if (!phoneValid || sending) return;

        setSending(true);
        try {
            // Prompt for notifications on Continue click (user gesture).
            await ensureNotificationPermission();

            const check = await authPhoneCheck(`+91${phone}`);
            if (check == null || typeof check.exists !== "boolean") {
                toast.error("Unable to verify this phone number. Please try again.");
                return;
            }

            phoneExistsRef.current = check.exists;

            let appVerifier = verifierRef.current;
            if (!appVerifier) {
                const el = document.getElementById(RECAPTCHA_ID);
                if (el) el.innerHTML = "";
                appVerifier = new RecaptchaVerifier(auth, RECAPTCHA_ID, {
                    size: "normal",
                });
                verifierRef.current = appVerifier;
                await appVerifier.render();
            }

            const confirmation = await signInWithPhoneNumber(
                auth,
                `+91${phone}`,
                appVerifier
            );
            confirmationRef.current = confirmation;
            setOtp(Array(OTP_LENGTH).fill(""));
            setView("otp");
            toast.success("OTP sent to your phone");
            setTimeout(() => otpRefs.current[0]?.focus(), 250);
        } catch (error) {
            try {
                verifierRef.current?.clear();
            } catch {
                /* ignore */
            }
            verifierRef.current = null;
            toast.error(apiErrorMessage(error, firebaseAuthErrorMessage(error)));
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
        if (otp.some((d) => !d) || verifying || !confirmationRef.current) return;
        setVerifying(true);
        try {
            // Ask for push permission on this click (browsers require a user gesture).
            await ensureNotificationPermission();

            // Firebase: verify OTP only. Account create/login is backend-only.
            const result = await confirmationRef.current.confirm(otp.join(""));

            if (!phoneExistsRef.current) {
                // New number → collect profile, then create account on backend.
                setView("details");
                return;
            }

            // Existing number → login via backend with Firebase idToken.
            await completeBackendAuth(result.user, {
                name: result.user.displayName || "",
                email: result.user.email || "",
                exists: phoneExistsRef.current,
            });
            toast.success("Logged in successfully!");
            onClose();
        } catch (error) {
            toast.error(apiErrorMessage(error, firebaseAuthErrorMessage(error)));
        } finally {
            setVerifying(false);
        }
    };

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    const handleSaveProfile = async () => {
        if (!name.trim() || !emailValid || savingProfile || !auth.currentUser) return;
        setSavingProfile(true);
        try {
            await ensureNotificationPermission();
            // Signup: send name/email/referral + Firebase idToken to backend only.
            await completeBackendAuth(auth.currentUser, {
                name: name.trim(),
                email: email.trim(),
                referralCode: referral.trim() || undefined,
                exists: phoneExistsRef.current,
            });
            toast.success("Account created successfully!");
            onClose();
        } catch (error) {
            toast.error(apiErrorMessage(error, firebaseAuthErrorMessage(error)));
        } finally {
            setSavingProfile(false);
        }
    };

    const otpFilled = otp.every((d) => d);

    const heading =
        view === "otp"
            ? {
                title: "Verify OTP",
                subtitle: (
                    <>
                        Enter the 6-digit code sent to{" "}
                        <span className="font-semibold text-slate-900">+91 {phone}</span>
                    </>
                ),
            }
            : view === "details"
                ? {
                    title: "Almost done",
                    subtitle: "Tell us a bit about yourself to finish signup",
                }
                : {
                    title: "Login",
                    subtitle: "Enter your phone number to continue",
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
                            {view !== "phone" ? (
                                <button
                                    type="button"
                                    onClick={() => setView(view === "details" ? "otp" : "phone")}
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
                    <div
                        className={
                            view === "phone"
                                ? undefined
                                : "pointer-events-none absolute top-0 left-[-9999px] opacity-0"
                        }
                        aria-hidden={view !== "phone"}
                    >
                        {(isLocalhostHost() ||
                            /^\d{1,3}(\.\d{1,3}){3}$/.test(currentHostLabel())) && (
                                <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed font-medium text-amber-900">
                                    {isLocalhostHost() ? (
                                        <>
                                            Real SMS OTP does not work on{" "}
                                            <span className="font-bold">localhost</span>. Use a Firebase{" "}
                                            <span className="font-bold">test phone number</span>, or open{" "}
                                            <span className="font-bold">http://127.0.0.1:3000</span>.
                                        </>
                                    ) : (
                                        <>
                                            Add <span className="font-bold">{currentHostLabel()}</span> in Firebase →
                                            Authentication → Settings →{" "}
                                            <span className="font-bold">Authorized domains</span> or real SMS OTP
                                            will fail with INVALID_APP_CREDENTIAL.
                                        </>
                                    )}
                                </div>
                            )}

                        <form
                            className="flex flex-col gap-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                void sendOtp();
                            }}
                        >
                            <PhoneField value={phone} onChange={setPhone} />

                            <div className="flex min-h-19.5 justify-center py-1">
                                <div id={RECAPTCHA_ID} />
                            </div>

                            <GlowButton
                                type="submit"
                                disabled={!phoneValid || sending}
                                fullWidth
                                size="lg"
                                className="mt-1"
                            >
                                {sending ? "Sending OTP..." : "Continue"}
                            </GlowButton>
                        </form>

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
                    </div>

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

                        {view === "details" && (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -24 }}
                                transition={{ duration: 0.2 }}
                            >
                                <form
                                    className="flex flex-col gap-4"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (name.trim() && emailValid) void handleSaveProfile();
                                    }}
                                >
                                    <Field label="Phone number">
                                        <span className="flex items-center gap-2">
                                            <span className="text-base font-semibold text-slate-500">
                                                +91
                                            </span>
                                            <span className="text-base font-semibold text-slate-900">
                                                {phone}
                                            </span>
                                        </span>
                                    </Field>

                                    <Field label="Name">
                                        <input
                                            type="text"
                                            autoFocus
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your full name"
                                            className="w-full bg-transparent text-base font-semibold text-slate-900 placeholder:font-medium placeholder:text-slate-400 focus:outline-none"
                                        />
                                    </Field>

                                    <Field label="Email">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full bg-transparent text-base font-semibold text-slate-900 placeholder:font-medium placeholder:text-slate-400 focus:outline-none"
                                        />
                                    </Field>

                                    {showReferral ? (
                                        <Field label="Referral code">
                                            <input
                                                type="text"
                                                value={referral}
                                                onChange={(e) =>
                                                    setReferral(e.target.value.toUpperCase())
                                                }
                                                placeholder="Optional"
                                                className="w-full bg-transparent text-base font-semibold tracking-widest text-slate-900 placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none"
                                            />
                                        </Field>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setShowReferral(true)}
                                            className="self-start cursor-pointer text-sm font-semibold text-primary hover:text-primary-hover"
                                        >
                                            Have a referral code?
                                        </button>
                                    )}

                                    <GlowButton
                                        type="submit"
                                        disabled={!name.trim() || !emailValid || savingProfile}
                                        fullWidth
                                        size="lg"
                                        className="mt-1"
                                    >
                                        {savingProfile ? "Saving..." : "Finish"}
                                    </GlowButton>
                                </form>
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

function PhoneField({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <Field label="Phone number">
            <span className="flex items-center gap-2">
                <span className="text-base font-semibold text-slate-500">+91</span>
                <input
                    type="tel"
                    inputMode="numeric"
                    autoFocus
                    value={value}
                    onChange={(e) =>
                        onChange(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="10-digit mobile number"
                    className="w-full bg-transparent text-base font-semibold text-slate-900 placeholder:font-semibold placeholder:text-slate-400 focus:outline-none"
                />
            </span>
        </Field>
    );
}
