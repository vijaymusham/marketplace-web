"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import SellForm from "@/components/sell-drawer/SellForm";
import { requestSignIn } from "@/lib/auth-events";
import type { RootState } from "@/components/redux/store";
import GlowButton from "@/components/ui/GlowButton";

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
                    <div className="pointer-events-auto rounded-full border-[3px] border-white">
                        <GlowButton
                            type="button"
                            aria-label="Sell now"
                            onClick={handleOpen}
                            variant="sell"
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#ff5a1f]">
                                <Plus className="h-3 w-3" strokeWidth={3} />
                            </span>
                            SELL
                        </GlowButton>
                    </div>
                </div>
                <SellForm open={open} onClose={() => setOpen(false)} />
            </>
        );
    }

    return (
        <>
            <div className="relative ml-1.5 hidden rounded-full border-2 border-white lg:block">
                <GlowButton
                    type="button"
                    aria-label="Sell now"
                    onClick={handleOpen}
                    variant="sell"
                >
                    <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-white text-[#ff5a1f]">
                        <Plus className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="max-w-24 truncate font-bold">Sell Now</span>
                </GlowButton>
            </div>
            <SellForm open={open} onClose={() => setOpen(false)} />
        </>
    );
}
