"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronRight,
    Heart,
    HelpCircle,
    LogOut,
    MessageCircleMore,
    FileText,
    User,
    BadgeCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import AuthDrawer from "./AuthDrawer";
import { useAuth } from "./AuthProvider";
import { clearuser } from "@/components/redux/slices/authSlice";
import { persistor, type AppDispatch, type RootState } from "@/components/redux/store";

const itemClass =
    "group flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm font-bold text-slate-700 transition-all duration-200 hover:bg-primary/6 hover:text-primary";

const iconWrap =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors duration-200 group-hover:bg-primary/10 group-hover:text-primary";

export default function SignInButton() {
    const { signOut } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const authData = useSelector((state: RootState) => state.user.user);
    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const isLoggedIn = Boolean(authData?.accessToken);
    const profile = authData?.user;

    const handleSignOut = async () => {
        setMenuOpen(false);
        try {
            localStorage.removeItem("token");
            dispatch(clearuser());
            await persistor.purge();
            await signOut();
            toast.success("Signed out");
        } catch {
            toast.error("Failed to sign out. Please try again.");
        }
    };

    if (isLoggedIn && profile) {
        const label =
            [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
            profile.username ||
            profile.phone?.slice(-4) ||
            "Account";

        const menuLinks = [
            { href: "/wishlist", label: "Wishlist", icon: Heart, hint: "Saved items" },
            { href: "/chats", label: "Chats", icon: MessageCircleMore, hint: "Messages" },
        ] as const;

        return (
            <div className="relative ml-1.5">
                <button
                    type="button"
                    aria-label="Account menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((v) => !v)}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border bg-white py-1.5 pr-4 pl-1.5 text-sm font-semibold transition-all duration-200 ${menuOpen
                        ? "border-primary/30 bg-primary/5 text-primary shadow-sm shadow-primary/10"
                        : "border-white text-slate-700 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                        }`}
                >
                    <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-primary/20 to-indigo-500/15 text-primary ring-2 ring-white">
                        {profile.profilePhoto ? (
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
                    <span className="hidden max-w-24 truncate font-semibold md:block">{label}</span>
                </button>

                {menuOpen && (
                    <>
                        <button
                            type="button"
                            aria-label="Close menu"
                            className="fixed inset-0 z-40 cursor-default"
                            onClick={() => setMenuOpen(false)}
                        />
                        <div className="absolute top-full right-0 z-50 mt-2.5 w-78 overflow-hidden rounded-3xl border-4 border-white bg-slate-100">
                            {/* Header */}
                            <div className="relative overflow-hidden bg-slate-50 px-4 pt-5 pb-4">

                                <div className="relative flex items-center gap-3.5">
                                    <div className="relative shrink-0">
                                        <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white text-primary shadow-md shadow-primary/10 ring-2 ring-white">
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

                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        toast("Profile editing coming soon");
                                    }}
                                    className="relative mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-primary to-[#4a56e8] px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
                                >
                                    View and edit profile
                                    <ChevronRight className="h-4 w-4 opacity-80" strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Main links */}
                            <div className="space-y-0.5 px-2.5 py-2.5">
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
                            </div>

                            {/* Footer actions */}
                            <div className="border-t border-slate-100/90 bg-slate-50/60 px-2.5 py-2">
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
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <>
            <button
                type="button"
                aria-label="Sign In"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(true);
                }}
                className="relative z-20 ml-1.5 flex cursor-pointer items-center gap-2 rounded-full border border-white bg-white py-1.5 pr-4 pl-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <User className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="hidden md:block">Sign In</span>
            </button>

            <AuthDrawer open={open} onClose={() => setOpen(false)} />
        </>
    );
}
