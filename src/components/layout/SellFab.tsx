"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import SellForm from "@/components/sell-drawer/SellForm";
import { requestSignIn } from "@/lib/auth-events";
import type { RootState } from "@/components/redux/store";

const HIDE_FLOAT_PATHS = ["/chats", "/listing"];

type SellFabProps = {
    /** Desktop navbar chip. Mobile uses the floating bottom button. */
    variant?: "nav" | "float";
};

export default function SellFab({ variant = "nav" }: SellFabProps) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const authData = useSelector((state: RootState) => state.user.user);
    const isLoggedIn = Boolean(authData?.accessToken);

    const hideFloat = HIDE_FLOAT_PATHS.some((p) => pathname?.startsWith(p));

    const handleOpen = () => {
        if (!isLoggedIn) {
            requestSignIn();
            return;
        }
        setOpen(true);
    };

    if (variant === "float") {
        if (hideFloat) return null;

        return (
            <>
                <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden">
                    <button
                        type="button"
                        aria-label="Sell now"
                        onClick={handleOpen}
                        className="pointer-events-auto flex items-center gap-2 rounded-full border-[3px] border-white bg-[#ff5a1f] px-4 py-2.5 text-sm font-extrabold tracking-wide text-white shadow-[0_10px_28px_rgba(255,90,31,0.45)] transition-transform active:scale-[0.98]"
                    >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#ff5a1f]">
                            <Plus className="h-3 w-3" strokeWidth={3} />
                        </span>
                        SELL
                    </button>
                </div>
                <SellForm open={open} onClose={() => setOpen(false)} />
            </>
        );
    }

    return (
        <>
            <div className="relative ml-1.5 hidden lg:block">
                <button
                    type="button"
                    aria-label="Sell now"
                    onClick={handleOpen}
                    className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-white bg-[#ff5a1f] py-1.5 pr-4 pl-1.5 text-sm font-semibold text-white shadow-2xl transition-all duration-200 hover:border-white hover:text-white"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#ff5a1f]">
                        <Plus className="h-4 w-4" strokeWidth={3} />
                    </span>
                    <span className="max-w-24 truncate font-semibold">Sell Now</span>
                </button>
            </div>
            <SellForm open={open} onClose={() => setOpen(false)} />
        </>
    );
}
