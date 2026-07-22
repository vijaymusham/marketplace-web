import { MessageCircleMore } from "lucide-react";
import LocationPicker from "./LocationPicker";
import SearchInput from "./SearchInput";
import SignInButton from "@/components/auth/SignInButton";
import WishlistButton from "./WishlistButton";
import NotificationButton from "./NotificationButton";
import Link from "next/link";
import SellFab from "./SellFab";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-30  bg-white/85 bg-linear-to-b from-primary/20 via-primary/10 to-white backdrop-blur-xl">
            <div className="mx-auto flex  items-center gap-3 px-4 py-4 sm:gap-5 sm:px-6 lg:px-8">
                <Link href="/" className="group flex shrink-0 items-center gap-2.5">
                    <span className="hidden font-heading text-3xl font-extrabold tracking-tight text-slate-900 lg:block">
                        Deal<span className="text-primary">Market</span>
                    </span>
                </Link>

                <span className="hidden h-8 w-px bg-slate-200 md:block" />

                <LocationPicker />

                <SearchInput />

                <div className="flex shrink-0 items-center gap-1.5">
                    <WishlistButton />

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
                            5
                        </span>
                    </Link>

                    <NotificationButton />

                    <SellFab />

                    <SignInButton />
                </div>
            </div>
        </header>
    );
}
