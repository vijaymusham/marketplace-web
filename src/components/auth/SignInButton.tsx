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
    Crown,
    FileText,
    Heart,
    LifeBuoy,
    LogOut,
    Menu,
    MessageCircleMore,
    Sparkles,
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

const menuItemClass =
    "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-semibold text-slate-700 transition-all duration-150 hover:bg-white hover:text-slate-900 ";

const menuIconClass =
    "h-4.5 w-4.5 shrink-0 text-slate-400 transition-colors group-hover:text-slate-800";

function isProMember(user?: {
    isPro?: boolean;
    status?: string;
} | null) {
    if (!user) return false;
    if (user.isPro === true) return true;
    const status = user.status?.toLowerCase();
    return status === "pro" || status === "premium";
}

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
        setTimeout(() => {
            setMounted(true);
        }, 100);
    }, [setMounted]);

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

    const isPro = isProMember(profile);

    const primaryLinks = [
        { href: "/profile", label: "Edit Profile", icon: User },
        { href: "/my-ads", label: "My ads", icon: FileText },
        { href: "/wishlist", label: "Wishlist", icon: Heart },
    ] as const;

    const secondaryLinks = [
        { href: "/chats", label: "Chats", icon: MessageCircleMore },
        { href: "/help", label: "Help Center", icon: LifeBuoy },
    ] as const;

    const menuBody = profile ? (
        <div className="flex relative min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain p-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
            <div className="absolute top-0 left-0 h-20 w-full bg-white/90 bg-linear-to-b from-primary/15 via-primary/8 to-white" />
            {/* Header */}
            <div className="flex items-center gap-3 px-0.5 pb-0.5">
                <div className="relative shrink-0">
                    <span
                        className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white border border-primary/10 ${isPro
                            ? "ring-[#e2b84a] shadow-[0_0_0_1px_rgba(226,184,74,0.35)]"
                            : "ring-slate-200"
                            }`}
                    >
                        {profile.profilePhoto ? (
                            <Image
                                src={profile.profilePhoto}
                                alt=""
                                width={48}
                                height={48}
                                unoptimized
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <User className="h-6 w-6 text-slate-400" strokeWidth={1.75} />
                        )}
                    </span>
                    {isPro ? (
                        <span className="absolute -right-1 -bottom-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-[#f6d365] to-[#c9a227] text-white  ring-2 ring-white">
                            <Crown className="h-2.5 w-2.5" strokeWidth={2.5} fill="currentColor" />
                        </span>
                    ) : null}
                </div>
                <div className="min-w-0 flex-1 z-10">
                    <div className="flex min-w-0 items-center gap-1.5">
                        <p className="truncate text-[15px] font-bold capitalize tracking-tight text-slate-900">
                            {label}
                        </p>
                        {isPro && (
                            <span className="shrink-0 rounded-md bg-linear-to-r from-[#f6d365]/25 to-[#c9a227]/20 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider text-[#9a7410]">
                                PRO
                            </span>
                        )}
                    </div>
                    <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
                        {profile.email || profile.phone || "Manage your account"}
                    </p>
                </div>
            </div>

            {/* Plan banner: free upgrade vs Pro member */}
            {
                isPro ? (
                    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#1a1a1c] via-[#2a2418] to-[#3d3420] px-3.5 py-3 ">
                        <div
                            className="pointer-events-none absolute -top-6 -right-4 h-20 w-20 rounded-full bg-[#e2b84a]/20 blur-2xl"
                            aria-hidden
                        />
                        <div className="relative flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="flex items-center gap-1.5 text-[13px] font-bold text-[#f5e6c0]">
                                    <Crown
                                        className="h-3.5 w-3.5 shrink-0 text-[#e2b84a]"
                                        strokeWidth={2}
                                        fill="currentColor"
                                    />
                                    Pro Member
                                </p>
                                <p className="mt-0.5 text-[11px] font-medium text-[#c4b48a]/90">
                                    Priority listing &amp; boosts unlocked
                                </p>
                            </div>
                            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#e2b84a]/15 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-[#f6d365] ring-1 ring-[#e2b84a]/35">
                                <Sparkles className="h-3 w-3" strokeWidth={2.25} />
                                ACTIVE
                            </span>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            setMenuOpen(false);
                            toast("Pro upgrades coming soon", { icon: "✨" });
                        }}
                        className="group relative flex w-full cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-2xl bg-linear-to-r from-[#2f8fff] via-[#5aacff] to-[#e6d4ad] px-3.5 py-3 text-left  transition-all duration-200 hover:brightness-[1.03] active:scale-[0.99]"
                    >
                        <span
                            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-linear-to-l from-white/20 to-transparent"
                            aria-hidden
                        />
                        <span className="relative flex min-w-0 flex-col gap-0.5">
                            <span className="flex items-center gap-1.5 text-[13px] font-bold text-white">
                                <Crown
                                    className="h-3.5 w-3.5 shrink-0 text-[#ffe08a]"
                                    strokeWidth={2}
                                    fill="currentColor"
                                />
                                Upgrade to Pro
                            </span>
                            <span className="text-[11px] font-medium text-white/85">
                                Get more reach on every ad
                            </span>
                        </span>
                        <span className="relative flex shrink-0 items-center gap-0.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-slate-900 ">
                            PRO
                            <ChevronRight className="h-3 w-3 text-slate-400" strokeWidth={2.5} />
                        </span>
                    </button>
                )
            }

            {/* Account group */}
            <div className="space-y-0.5 rounded-xl bg-slate-100/60 p-1">
                {primaryLinks.map(({ href, label: itemLabel, icon: Icon }) => (
                    <Link
                        key={itemLabel}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className={menuItemClass}
                    >
                        <Icon className={menuIconClass} strokeWidth={1.75} />
                        <span className="min-w-0 flex-1 capitalize text-slate-700 font-bold">{itemLabel}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                ))}
            </div>

            {/* Support group */}
            <div className="space-y-0.5 rounded-2xl bg-slate-100/60 p-1">
                {secondaryLinks.map(({ href, label: itemLabel, icon: Icon }) => (
                    <Link
                        key={itemLabel}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className={menuItemClass}
                    >
                        <Icon className={menuIconClass} strokeWidth={1.75} />
                        <span className="min-w-0 flex-1 capitalize text-slate-700 font-bold">{itemLabel}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-500 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                ))}
            </div>

            {/* Notifications */}
            <div className="rounded-2xl bg-slate-100/60 p-1">
                <div className="flex w-full items-center gap-3 rounded-[0.9rem] px-3 py-2.5">
                    <Bell className="h-4.5 w-4.5 shrink-0 text-slate-400" strokeWidth={1.75} />
                    <span className="min-w-0 flex-1 text-[13px] font-bold capitalize text-slate-700">
                        Notifications
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
                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-60 ${pushEnabled ? "bg-primary" : "bg-slate-300/90"
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white  transition-transform duration-200 ${pushEnabled ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Logout */}
            <button
                type="button"
                onClick={handleSignOut}
                className="group flex w-full items-center gap-3 rounded-xl bg-[#fff1f1] px-3.5 py-3 text-left text-[13px] cursor-pointer font-bold capitalize text-[#e05252] transition-colors hover:bg-[#ffe4e4]"
            >
                <LogOut className="h-4.5 w-4.5 shrink-0" strokeWidth={1.85} />
                Logout
            </button>
        </div >
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
                    : `flex min-h-10 cursor-pointer items-center gap-2 rounded-full  bg-white py-1.5 pr-3.5 pl-1.5 text-sm font-semibold transition-all duration-200 ${menuOpen
                        ? isPro
                            ? "border-[#e2b84a]/50 bg-[#fff8e8] text-slate-900 "
                            : "border-primary/30 bg-primary/5 text-primary "
                        : isPro
                            ? "border-[#e2b84a]/35 text-slate-800 hover:border-[#e2b84a]/60 hover:bg-[#fff8e8]"
                            : "border-white text-slate-700 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    }`
            }
        >
            {isMenuTrigger ? (
                <Menu className="h-6 w-6" strokeWidth={2} />
            ) : (
                <>
                    <span
                        className={`relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full ${isPro
                            ? "bg-linear-to-br from-[#f6d365]/30 to-[#c9a227]/20 text-[#9a7410] ring-2 ring-[#e2b84a]/70"
                            : "bg-linear-to-br from-primary/20 to-indigo-500/15 text-primary ring-2 ring-white"
                            }`}
                    >
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
                    <span className="max-w-24 truncate font-semibold capitalize">{label}</span>
                    {isPro && (
                        <span className="rounded-md bg-linear-to-r from-[#f6d365] to-[#e2b84a] px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-[#5c4508]">
                            PRO
                        </span>
                    )}
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
                                        className="fixed inset-y-0 right-0 z-101 flex w-[min(100vw,17rem)] flex-col bg-white "
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
                        <div className="absolute top-full right-0 z-50 mt-2.5 flex max-h-[min(85vh,36rem)] w-[min(18rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl  bg-white shadow-xl">
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
