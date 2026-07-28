"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useHasMounted } from "@/hooks/useWishlist";
import { useIsLoggedIn, useWishlistQuery } from "@/hooks/useWishlistQuery";
import { requestSignIn } from "@/lib/auth-events";

export default function WishlistButton() {
    const mounted = useHasMounted();
    const isLoggedIn = useIsLoggedIn();
    const { data: wishlist = [] } = useWishlistQuery();
    const displayCount = mounted && isLoggedIn ? wishlist.length : 0;

    if (!isLoggedIn) {
        return (
            <button
                type="button"
                aria-label="Wishlist"
                onClick={() => requestSignIn()}
                className="group relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors duration-200 hover:bg-primary/10 hover:text-primary sm:h-10 sm:w-10"
            >
                <Heart
                    className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 sm:h-5.5 sm:w-5.5"
                    strokeWidth={1.75}
                />
            </button>
        );
    }

    return (
        <Link
            href="/wishlist"
            scroll={false}
            aria-label="Wishlist"
            className="group relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors duration-200 hover:bg-primary/10 hover:text-primary sm:h-10 sm:w-10"
        >
            <Heart
                className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 sm:h-5.5 sm:w-5.5"
                strokeWidth={1.75}
            />
            <span className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-linear-to-br from-primary to-indigo-500 px-1 text-[9px] font-bold text-white ring-2 ring-white sm:h-4.5 sm:min-w-4.5 sm:text-[10px]">
                {displayCount}
            </span>
        </Link>
    );
}
