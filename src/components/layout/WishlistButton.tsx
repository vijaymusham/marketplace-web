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
                className="group relative hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors duration-200 hover:bg-primary/10 hover:text-primary sm:flex"
            >
                <Heart
                    className="h-5.5 w-5.5 transition-transform duration-200 group-hover:scale-110"
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
            className="group relative hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors duration-200 hover:bg-primary/10 hover:text-primary sm:flex"
        >
            <Heart
                className="h-5.5 w-5.5 transition-transform duration-200 group-hover:scale-110"
                strokeWidth={1.75}
            />
            <span className="absolute top-0 right-0 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-linear-to-br from-primary to-indigo-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {displayCount}
            </span>
        </Link>
    );
}
