"use client";
import { useEffect, useState } from "react";
import { MessageCircleMore, ShoppingBag } from "lucide-react";
import LocationPicker from "./LocationPicker";
import SearchInput from "./SearchInput";
import SignInButton from "@/components/auth/SignInButton";
import WishlistButton from "./WishlistButton";
import NotificationButton from "./NotificationButton";
import Link from "next/link";
import SellFab from "./SellFab";
import { getChats } from "../api/apis";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { scrollToTop } from "@/lib/lenis";
import Image from "next/image";

function useIsLargeScreen(minWidth = 1024) {
    const [isLarge, setIsLarge] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
        const update = () => setIsLarge(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, [minWidth]);

    return isLarge;
}

export default function Navbar() {
    const pathname = usePathname();
    const isLarge = useIsLargeScreen();
    const authData = useSelector((state: RootState) => state.user.user);
    const isLoggedIn = Boolean(authData?.accessToken);
    const { data: conversations } = useQuery({
        queryKey: ["chats"],
        queryFn: () => getChats("all", 1),
        enabled: isLoggedIn && isLarge,
    });

    return (
        <>
            <header className="sticky top-0 z-30 bg-white/90 bg-linear-to-b from-primary/15 via-primary/8 to-white backdrop-blur-xl">
                {!isLarge ? (
                    <div>
                        <div className="flex items-center gap-3 px-3 pt-2.5 pb-1.5">
                            <Link
                                href="/"
                                scroll={false}
                                onClick={() => {
                                    if (pathname === "/") scrollToTop();
                                }}
                                className="shrink-0"
                            >
                                <span className="font-heading text-[1.35rem] leading-none font-extrabold tracking-tight text-slate-900">
                                    Deal<span className="text-primary">Pokket</span>
                                </span>
                            </Link>

                            <div className="ml-auto flex min-w-0 max-w-[58%] items-center justify-end gap-0.5">
                                <LocationPicker compact />
                                <SignInButton trigger="menu" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 pb-2.5">
                            <SearchInput compact />
                            <WishlistButton />
                        </div>
                    </div>
                ) : (
                    <div className="mx-auto flex h-18 min-w-0 items-center gap-4 px-6 py-3.5 lg:px-12">
                        <Link
                            href="/"
                            scroll={false}
                            onClick={() => {
                                if (pathname === "/") scrollToTop();
                            }}
                            className="group flex shrink-0 items-center"
                        >
                            <Image src="/logo.png" alt="DealPokket" width={64} height={64} priority className="h-16 w-16" />
                            <span className="font-heading text-3xl font-black tracking-tight text-primary">
                                Deal<span className="text-slate-900">Pokket</span>
                            </span>
                        </Link>

                        <span className="h-8 w-px bg-slate-200" />

                        <LocationPicker />

                        <SearchInput />

                        <div className="flex shrink-0 items-center gap-1.5">
                            <WishlistButton />

                            {isLoggedIn && (
                                <Link
                                    href="/chats"
                                    aria-label="Chat"
                                    className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors duration-200 hover:bg-primary/10 hover:text-primary"
                                >
                                    <MessageCircleMore
                                        className="h-5.5 w-5.5 transition-transform duration-200 group-hover:scale-110"
                                        strokeWidth={1.75}
                                    />
                                    <span className="absolute top-0 right-0 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-linear-to-br from-primary to-indigo-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                                        {conversations?.unreadCount ?? 0}
                                    </span>
                                </Link>
                            )}

                            <NotificationButton />

                            {isLoggedIn && <SellFab variant="nav" />}

                            <SignInButton trigger="profile" />
                        </div>
                    </div>
                )}
            </header>

            {!isLarge && <SellFab variant="float" />}
        </>
    );
}
