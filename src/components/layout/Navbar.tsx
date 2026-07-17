import { Search, User, Heart, ShoppingCart, ShoppingBag } from "lucide-react";
import LocationPicker from "./LocationPicker";

const iconActions = [
    { icon: Heart, label: "Wishlist", count: 0 },
    { icon: ShoppingCart, label: "Cart", count: 0 },
];

export default function Navbar() {
    return (
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 shadow-[0_1px_12px_rgba(15,23,42,0.06)] backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6 lg:px-8">
                <a href="/" className="group flex shrink-0 items-center gap-2.5">
                    <span className="flex  items-center justify-center rounded-xl ">
                        <ShoppingBag className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span className="hidden font-heading text-lg font-extrabold tracking-tight text-slate-900 lg:block">
                        Sell<span className="text-primary">Fast</span>
                    </span>
                </a>

                <span className="hidden h-8 w-px bg-slate-200 md:block" />

                <LocationPicker />

                <div className="group relative flex flex-1 items-center">
                    <Search className="pointer-events-none absolute left-4 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-primary" />
                    <input
                        type="text"
                        placeholder="Search for products, brands and more..."
                        className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pr-28 pl-11 text-sm text-slate-700 shadow-inner shadow-slate-100 transition-all duration-200 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/25"
                    />
                    <button className="absolute right-1.5 flex items-center gap-1.5 rounded-full bg-linear-to-r from-primary to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition-all duration-200 hover:from-primary-hover hover:to-indigo-600 hover:shadow-md active:scale-95">
                        Search
                        <Search className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                    {iconActions.map(({ icon: Icon, label, count }) => (
                        <button
                            key={label}
                            aria-label={label}
                            className="group relative hidden h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors duration-200 hover:bg-primary/10 hover:text-primary sm:flex"
                        >
                            <Icon
                                className="h-5.5 w-5.5 transition-transform duration-200 group-hover:scale-110"
                                strokeWidth={1.75}
                            />
                            <span className="absolute top-0 right-0 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-linear-to-br from-primary to-indigo-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                                {count}
                            </span>
                        </button>
                    ))}

                    <button
                        aria-label="Sign In"
                        className="ml-1.5 flex items-center gap-2 rounded-full border border-slate-200 py-1.5 pr-4 pl-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <User className="h-4 w-4" strokeWidth={2} />
                        </span>
                        <span className="hidden md:block">Sign In</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
