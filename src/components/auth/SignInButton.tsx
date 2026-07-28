"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
    Bell,
    ChevronRight,
    Heart,
    HelpCircle,
    LogOut,
    Menu,
    MessageCircleMore,
    FileText,
    User,
    BadgeCheck,
    X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import AuthDrawer from "./AuthDrawer";
import { useAuth } from "./AuthProvider";
import { clearuser } from "@/components/redux/slices/authSlice";
import { persistor, type AppDispatch, type RootState } from "@/components/redux/store";
import {
    disablePushNotifications,
    enablePushNotifications,
    getStoredFcmToken,
} from "@/lib/fcmDeviceToken";
import { SIGN_IN_EVENT } from "@/lib/auth-events";

const itemClass =
    "group flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm font-bold text-slate-700 transition-all duration-200 hover:bg-primary/6 hover:text-primary";

const iconWrap =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors duration-200 group-hover:bg-primary/10 group-hover:text-primary";

type SignInButtonProps = {
    /** `menu` = hamburger + right side drawer (mobile). `profile` = avatar chip (desktop). */
    trigger?: "menu" | "profile";
};

export default function SignInButton({ trigger = "profile" }: SignInButtonProps) {
    const router = useRouter();
    const { signOut } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const authData = useSelector((state: RootState) => state.user.user);
    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [pushEnabled, setPushEnabled] = useState(false);
    const [pushBusy, setPushBusy] = useState(false);
    const isLoggedIn = Boolean(authData?.accessToken);
    const profile = authData?.user;
    const isMenuTrigger = trigger === "menu";

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isLoggedIn || typeof window === "undefined" || !("Notification" in window)) {
            setPushEnabled(false);
            return;
        }
        setPushEnabled(
            Notification.permission === "granted" && Boolean(getStoredFcmToken()),
        );
    }, [isLoggedIn, menuOpen]);

    useEffect(() => {
        const onRequestSignIn = () => setOpen(true);
        window.addEventListener(SIGN_IN_EVENT, onRequestSignIn);
        return () => window.removeEventListener(SIGN_IN_EVENT, onRequestSignIn);
    }, []);

    useEffect(() => {
        if (!menuOpen || !isMenuTrigger) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [menuOpen, isMenuTrigger]);

    const handlePushToggle = async () => {
        if (pushBusy) return;
        setPushBusy(true);
        try {
            if (pushEnabled) {
                await disablePushNotifications();
                setPushEnabled(false);
                toast.success("Push notifications off");
                return;
            }

            const result = await enablePushNotifications();
            if (result.ok) {
                setPushEnabled(true);
                toast.success("Push notifications on");
            } else if (result.permission === "denied") {
                setPushEnabled(false);
                toast.error(
                    "Notifications blocked. Enable them in browser site settings.",
                );
            } else {
                setPushEnabled(false);
                toast.error("Couldn’t enable notifications");
            }
        } catch {
            toast.error("Couldn’t update notification settings");
        } finally {
            setPushBusy(false);
        }
    };

    const handleSignOut = async () => {
        setMenuOpen(false);
        try {
            await disablePushNotifications();
            localStorage.removeItem("token");
            dispatch(clearuser());
            await persistor.purge();
            await signOut();
            toast.success("Signed out");
            router.replace("/");
        } catch {
            toast.error("Failed to sign out. Please try again.");
        }
    };

    const label =
        profile
            ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
            profile.username ||
            profile.phone?.slice(-4) ||
            "Account"
            : "Account";

    const menuLinks = [
        { href: "/wishlist", label: "Wishlist", icon: Heart, hint: "Saved items" },
        { href: "/chats", label: "Chats", icon: MessageCircleMore, hint: "Messages" },
    ] as const;

    const menuBody = profile ? (
        <>
            <div className="border-b border-slate-100 bg-slate-50 px-5 pt-6 pb-5">
                {isMenuTrigger ? (
                    <>
                        <p className="font-heading text-2xl font-extrabold tracking-tight text-slate-900">
                            Deal<span className="text-primary">Market</span>
                        </p>
                        <p className="mt-4 font-heading text-lg font-extrabold text-slate-900">
                            {label}
                        </p>
                        {profile.phone && (
                            <p className="mt-0.5 text-sm font-medium text-slate-500">
                                {profile.phone}
                            </p>
                        )}
                        {profile.email && (
                            <p className="truncate text-xs font-medium text-slate-400">
                                {profile.email}
                            </p>
                        )}
                    </>
                ) : (
                    <div className="flex items-center gap-3.5">
                        <div className="relative shrink-0">
                            <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white text-primary">
                                {profile.profilePhoto ? (
                                    <Image
                                        src={profile.profilePhoto}
                                        alt=""
                                        width={56}
                                        height={56}
                                        unoptimized
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/15 to-indigo-500/10">
                                        <User className="h-7 w-7" strokeWidth={1.75} />
                                    </span>
                                )}
                            </span>
                            {profile.phoneVerified && (
                                <span className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white ring-2 ring-white">
                                    <BadgeCheck className="h-3 w-3" strokeWidth={2.5} />
                                </span>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-heading text-lg font-extrabold tracking-tight text-slate-900">
                                {label}
                            </p>
                            {profile.phone && (
                                <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
                                    {profile.phone}
                                </p>
                            )}
                            {profile.email && (
                                <p className="truncate text-[11px] font-medium text-slate-400">
                                    {profile.email}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => {
                        setMenuOpen(false);
                        toast("Profile editing coming soon");
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-primary to-[#4a56e8] px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
                >
                    View and edit profile
                    <ChevronRight className="h-4 w-4 opacity-80" strokeWidth={2.5} />
                </button>
            </div>

            <div className="flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-3 py-3">
                <Link
                    href="/my-ads"
                    onClick={() => setMenuOpen(false)}
                    className={itemClass}
                >
                    <span className={iconWrap}>
                        <FileText className="h-4 w-4" strokeWidth={1.85} />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block font-bold">My ads</span>
                        <span className="block text-[11px] font-medium text-slate-400 group-hover:text-primary/60">
                            Manage your listings
                        </span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>

                {menuLinks.map(({ href, label: itemLabel, icon: Icon, hint }) => (
                    <Link
                        key={itemLabel}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className={itemClass}
                    >
                        <span className={iconWrap}>
                            <Icon className="h-4 w-4" strokeWidth={1.85} />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block font-bold">{itemLabel}</span>
                            <span className="block text-[11px] font-medium text-slate-400 group-hover:text-primary/60">
                                {hint}
                            </span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                ))}

                <div className={itemClass}>
                    <span className={iconWrap}>
                        <Bell className="h-4 w-4" strokeWidth={1.85} />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block font-bold">Push notifications</span>
                        <span className="block text-[11px] font-medium text-slate-400 group-hover:text-primary/60">
                            {pushEnabled ? "Enabled on this device" : "Get message alerts"}
                        </span>
                    </span>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={pushEnabled}
                        aria-label="Toggle push notifications"
                        disabled={pushBusy}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            void handlePushToggle();
                        }}
                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-60 ${pushEnabled ? "bg-primary" : "bg-slate-200"
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${pushEnabled ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </button>
                </div>
            </div>

            <div className="border-t border-slate-100 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                <Link
                    href="/help"
                    onClick={() => setMenuOpen(false)}
                    className={itemClass}
                >
                    <span className={iconWrap}>
                        <HelpCircle className="h-4 w-4" strokeWidth={1.85} />
                    </span>
                    Help & support
                </Link>
                <button
                    type="button"
                    onClick={handleSignOut}
                    className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors duration-200 group-hover:bg-red-100 group-hover:text-red-500">
                        <LogOut className="h-4 w-4" strokeWidth={1.85} />
                    </span>
                    Logout
                </button>
            </div>
        </>
    ) : null;

    const triggerButton = (
        <button
            type="button"
            aria-label={isMenuTrigger ? "Open menu" : "Account menu"}
            aria-expanded={menuOpen}
            onClick={() => {
                if (!isLoggedIn) {
                    setOpen(true);
                    return;
                }
                setMenuOpen((v) => !v);
            }}
            className={
                isMenuTrigger
                    ? `flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-800 transition-colors ${menuOpen ? "bg-slate-100 text-primary" : "hover:bg-slate-100"
                    }`
                    : `flex min-h-10 cursor-pointer items-center gap-2 rounded-full border bg-white py-1.5 pr-4 pl-1.5 text-sm font-semibold transition-all duration-200 ${menuOpen
                        ? "border-primary/30 bg-primary/5 text-primary shadow-sm shadow-primary/10"
                        : "border-white text-slate-700 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    }`
            }
        >
            {isMenuTrigger ? (
                <Menu className="h-6 w-6" strokeWidth={2} />
            ) : (
                <>
                    <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-primary/20 to-indigo-500/15 text-primary ring-2 ring-white">
                        {profile?.profilePhoto ? (
                            <Image
                                src={profile.profilePhoto}
                                alt=""
                                width={28}
                                height={28}
                                unoptimized
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <User className="h-4 w-4" strokeWidth={2} />
                        )}
                    </span>
                    <span className="max-w-24 truncate font-semibold">{label}</span>
                </>
            )}
        </button>
    );

    if (isLoggedIn && profile) {
        return (
            <div className="relative shrink-0">
                {triggerButton}

                {/* Mobile: full-height right side drawer */}
                {isMenuTrigger &&
                    mounted &&
                    createPortal(
                        <AnimatePresence>
                            {menuOpen && (
                                <>
                                    <motion.button
                                        key="menu-backdrop"
                                        type="button"
                                        aria-label="Close menu"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="fixed inset-0 z-100 bg-slate-900/45"
                                        onClick={() => setMenuOpen(false)}
                                    />
                                    <motion.aside
                                        key="menu-drawer"
                                        role="dialog"
                                        aria-modal="true"
                                        aria-label="Account menu"
                                        initial={{ x: "100%" }}
                                        animate={{ x: 0 }}
                                        exit={{ x: "100%" }}
                                        transition={{ type: "spring", stiffness: 320, damping: 34 }}
                                        className="fixed inset-y-0 right-0 z-101 flex w-[min(100vw,17rem)] flex-col bg-white shadow-2xl"
                                        data-lenis-prevent
                                    >
                                        <div className="flex items-center justify-end px-3 pt-3">
                                            <button
                                                type="button"
                                                aria-label="Close"
                                                onClick={() => setMenuOpen(false)}
                                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                        {menuBody}
                                    </motion.aside>
                                </>
                            )}
                        </AnimatePresence>,
                        document.body,
                    )}

                {/* Desktop: dropdown card */}
                {!isMenuTrigger && menuOpen && (
                    <>
                        <button
                            type="button"
                            aria-label="Close menu"
                            className="fixed inset-0 z-40 cursor-default"
                            onClick={() => setMenuOpen(false)}
                        />
                        <div className="absolute top-full right-0 z-50 mt-2.5 flex max-h-[min(85vh,36rem)] w-[min(19.5rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-4xl border-4 border-white bg-white shadow-lg shadow-black/5">
                            {menuBody}
                        </div>
                    </>
                )}

                <AuthDrawer open={open} onClose={() => setOpen(false)} />
            </div>
        );
    }

    return (
        <>
            {isMenuTrigger ? (
                triggerButton
            ) : (
                <button
                    type="button"
                    aria-label="Sign In"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpen(true);
                    }}
                    className="relative z-20 flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-white bg-white py-1.5 pr-4 pl-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <User className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span>Sign In</span>
                </button>
            )}

            <AuthDrawer open={open} onClose={() => setOpen(false)} />
        </>
    );
}
