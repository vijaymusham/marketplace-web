"use client";

import { useState } from "react";
import { User } from "lucide-react";
import AuthDrawer from "./AuthDrawer";

export default function SignInButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                aria-label="Sign In"
                onClick={() => setOpen(true)}
                className="ml-1.5 flex items-center gap-2 rounded-full border border-slate-200 py-1.5 pr-4 pl-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary cursor-pointer"
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
