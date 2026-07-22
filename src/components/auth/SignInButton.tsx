"use client";

import { useState } from "react";
import { LogOut, User } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import AuthDrawer from "./AuthDrawer";
import { useAuth } from "./AuthProvider";
import { clearuser } from "@/components/redux/slices/authSlice";
import type { AppDispatch, RootState } from "@/components/redux/store";

export default function SignInButton() {
    const { signOut } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const authData = useSelector((state: RootState) => state.user.user);
    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Backend session is the source of truth — Firebase OTP must not close the drawer mid-signup.
    const isLoggedIn = Boolean(authData?.accessToken);
    const profile = authData?.user;

    if (isLoggedIn && profile) {
        const label =
            profile.firstName ||
            profile.username ||
            profile.phone?.slice(-4) ||
            "Account";

        return (
            <div className="relative ml-1.5">
                <button
                    type="button"
                    aria-label="Account menu"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-white bg-white py-1.5 pr-4 pl-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="hidden max-w-24 truncate md:block font-semibold">{label}</span>
                </button>

                {menuOpen && (
                    <>
                        <button
                            type="button"
                            aria-label="Close menu"
                            className="fixed inset-0 z-40 cursor-default"
                            onClick={() => setMenuOpen(false)}
                        />
                        <div className="absolute top-full right-0 z-50 mt-2 min-w-44 overflow-hidden rounded-2xl border border-slate-100 bg-white py-1 shadow-lg shadow-slate-200/60">
                            <p className="border-b border-slate-100 px-4 py-2.5 text-xs font-medium text-slate-400">
                                {profile.phone}
                            </p>
                            <button
                                type="button"
                                onClick={async () => {
                                    setMenuOpen(false);
                                    localStorage.removeItem("token");
                                    dispatch(clearuser());
                                    await signOut();
                                    toast.success("Signed out");
                                }}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
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
