"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { X, ArrowLeft, Phone, UserRound, Mail, Ticket, ShieldCheck } from "lucide-react";

type View = "phone" | "details" | "otp";

const OTP_LENGTH = 4;
const STORAGE_KEY = "registered_phones";

/**
 * Simulated backend lookup — replace with a real API call.
 * Remembers signed-up numbers in localStorage so returning
 * "users" skip the details step.
 */
function checkAccountExists(phone: string): Promise<boolean> {
    return new Promise((resolve) => {
        setTimeout(() => {
            try {
                const list: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
                resolve(list.includes(phone));
            } catch {
                resolve(false);
            }
        }, 700);
    });
}

function registerPhone(phone: string) {
    try {
        const list: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
        if (!list.includes(phone)) list.push(phone);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
        /* ignore */
    }
}

export default function AuthDrawer({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [view, setView] = useState<View>("phone");
    const [isNewUser, setIsNewUser] = useState(false);
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [referral, setReferral] = useState("");
    const [showReferral, setShowReferral] = useState(false);
    const [checking, setChecking] = useState(false);
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [verifying, setVerifying] = useState(false);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Lock page scroll while the drawer is open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    // Reset everything each time the drawer opens
    useEffect(() => {
        if (open) {
            setView("phone");
            setIsNewUser(false);
            setPhone("");
            setName("");
            setEmail("");
            setReferral("");
            setShowReferral(false);
            setChecking(false);
            setOtp(Array(OTP_LENGTH).fill(""));
            setVerifying(false);
        }
    }, [open]);

    const phoneValid = /^\d{10}$/.test(phone);

    const goToOtp = () => {
        setOtp(Array(OTP_LENGTH).fill(""));
        setView("otp");
        setTimeout(() => otpRefs.current[0]?.focus(), 250);
    };

    // Step 1 — check with "backend" whether this number already has an account
    const handlePhoneContinue = async () => {
        if (!phoneValid || checking) return;
        setChecking(true);
        const exists = await checkAccountExists(phone);
        setChecking(false);
        setIsNewUser(!exists);
        if (exists) {
            goToOtp();
        } else {
            setView("details");
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const next = [...otp];
        next[index] = digit;
        setOtp(next);
        if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!digits) return;
        e.preventDefault();
        const next = Array(OTP_LENGTH).fill("");
        digits.split("").forEach((d, i) => (next[i] = d));
        setOtp(next);
        otpRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleVerify = () => {
        if (otp.some((d) => !d) || verifying) return;
        setVerifying(true);
        // Simulated verification — replace with a real API call
        setTimeout(() => {
            if (isNewUser) registerPhone(phone);
            toast.success(
                isNewUser ? "Account created successfully!" : "Logged in successfully!"
            );
            setVerifying(false);
            onClose();
        }, 900);
    };

    const otpFilled = otp.every((d) => d);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-[2px] justify-center items-center flex"
                    />

                    <motion.aside
                        key="drawer"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 340, damping: 34 }}
                        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto rounded-l-3xl bg-white px-7 py-8 sm:px-10"
                        data-lenis-prevent
                    >
                        <div className="flex items-center justify-between">
                            {view !== "phone" ? (
                                <button
                                    onClick={() => setView(view === "otp" && isNewUser ? "details" : "phone")}
                                    aria-label="Back"
                                    className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                >
                                    <ArrowLeft className="size-5 font-semibold" strokeWidth={2} />
                                </button>
                            ) : (
                                <span />
                            )}
                            <button
                                onClick={onClose}
                                aria-label="Close"
                                className="flex size-10 cursor-pointer font-semibold items-center justify-center rounded-full text-slate-500 transition-colors bg-slate-100 hover:text-slate-900"
                            >
                                <X className="size-5 font-semibold" strokeWidth={2} />
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {view === "phone" && (
                                <motion.div
                                    key="phone"
                                    initial={{ opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -24 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-4"
                                >
                                    <Header
                                        title="Login"
                                        subtitle="Enter your phone number to continue"
                                    // icon={<UserRound className="h-8 w-8" strokeWidth={1.75} />}
                                    />

                                    <form
                                        className="mt-8 flex flex-col gap-4"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handlePhoneContinue();
                                        }}
                                    >
                                        <PhoneField value={phone} onChange={setPhone} />

                                        <button
                                            type="submit"
                                            disabled={!phoneValid || checking}
                                            className="mt-2 rounded-2xl bg-primary py-3.5 text-sm font-bold tracking-wide text-white transition-all duration-200 hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
                                        >
                                            {checking ? "Checking..." : "Continue"}
                                        </button>
                                    </form>

                                    <p className="mt-4 text-xs leading-relaxed text-slate-400 max-w-80 text-center mx-auto font-semibold">
                                        By clicking on Continue, I accept the{" "}
                                        <span className="font-semibold text-slate-600 cursor-pointer underline hover:text-primary">Terms &amp; Conditions</span>{" "}
                                        &amp;{" "}
                                        <span className="font-semibold text-slate-600 cursor-pointer underline hover:text-primary">Privacy Policy</span>
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
                                    className="mt-4"
                                >
                                    <Header
                                        title="Sign up"
                                        subtitle="Looks like you're new here! Tell us a bit about yourself"
                                    // icon={<UserRound className="h-8 w-8" strokeWidth={1.75} />}
                                    />

                                    <form
                                        className="mt-8 flex flex-col gap-4"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (name.trim() && email.trim()) goToOtp();
                                        }}
                                    >
                                        <Field label="Phone number">
                                            <span className="flex items-center gap-2">
                                                <span className="text-base font-semibold text-slate-500">+91</span>
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
                                                    onChange={(e) => setReferral(e.target.value.toUpperCase())}
                                                    placeholder="Optional"
                                                    className="w-full bg-transparent text-base font-semibold tracking-widest text-slate-900 placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none"
                                                />
                                            </Field>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setShowReferral(true)}
                                                className="self-start text-sm font-semibold text-primary hover:text-primary-hover"
                                            >
                                                Have a referral code?
                                            </button>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={!name.trim() || !email.trim()}
                                            className="mt-2 rounded-2xl bg-primary py-3.5 text-sm font-bold tracking-wide text-white transition-all duration-200 hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
                                        >
                                            Continue
                                        </button>
                                    </form>

                                    <p className="mt-4 text-xs leading-relaxed text-slate-400">
                                        By creating an account, I accept the{" "}
                                        <span className="font-semibold text-slate-600">Terms &amp; Conditions</span>{" "}
                                        &amp;{" "}
                                        <span className="font-semibold text-slate-600">Privacy Policy</span>
                                    </p>
                                </motion.div>
                            )}

                            {view === "otp" && (
                                <motion.div
                                    key="otp"
                                    initial={{ opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -24 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-4"
                                >
                                    <Header
                                        title="Verify OTP"
                                        subtitle={
                                            <>
                                                Enter the 4-digit code sent to{" "}
                                                <span className="font-semibold text-slate-900">+91 {phone}</span>
                                            </>
                                        }
                                        icon={<ShieldCheck className="h-8 w-8" strokeWidth={1.75} />}
                                    />

                                    <div className="mt-8 flex justify-between gap-3">
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
                                                className="h-16 w-full max-w-16 rounded-2xl border border-slate-200 text-center font-heading text-2xl font-extrabold text-slate-900 transition-colors duration-150 focus:border-slate-400 focus:outline-none"
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleVerify}
                                        disabled={!otpFilled || verifying}
                                        className="mt-8 w-full rounded-2xl bg-primary py-3.5 text-sm font-bold tracking-wide text-white transition-all duration-200 hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
                                    >
                                        {verifying ? "Verifying..." : "Verify OTP"}
                                    </button>

                                    <p className="mt-5 text-center text-sm font-medium text-slate-500">
                                        Didn&apos;t receive it?{" "}
                                        <button
                                            onClick={() => toast.success("OTP resent!")}
                                            className="font-semibold text-primary hover:text-primary-hover"
                                        >
                                            Resend OTP
                                        </button>
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

function Header({
    title,
    subtitle,
    icon,
}: {
    title: string;
    subtitle: React.ReactNode;
    icon?: React.ReactNode;
}) {
    return (
        <header className="flex items-start justify-between gap-4">
            <div>
                <h2 className="font-heading text-3xl font-extrabold text-slate-900">{title}</h2>
                <p className="mt-2 text-sm font-medium text-slate-500">{subtitle}</p>
                <span className="mt-4 block h-1 w-10 rounded-full bg-primary" />
            </div>
            {icon && (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {icon}
                </span>
            )}
        </header>
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
        <label className="group flex items-center gap-3 rounded-2xl  bg-slate-100 border-slate-100 px-4 py-3 transition-colors duration-150 focus-within:border-slate-400">
            <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
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
                    onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10-digit mobile number"
                    className="w-full bg-transparent text-base font-semibold text-slate-900 placeholder:font-semibold placeholder:text-slate-400 focus:outline-none"
                />
            </span>
        </Field>
    );
}
