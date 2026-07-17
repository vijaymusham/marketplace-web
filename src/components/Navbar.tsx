import { Search, User, Heart, ShoppingCart, ShoppingBag } from "lucide-react";
import LocationPicker from "./LocationPicker";

const iconActions = [
  { icon: Heart, label: "Wishlist", count: 0 },
  { icon: ShoppingCart, label: "Cart", count: 0 },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <ShoppingBag className="h-5 w-5" strokeWidth={2} />
          </span>
        </a>

        <LocationPicker />

        <div className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute left-4 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Type Your Products ..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pr-28 pl-11 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button className="absolute right-1.5 flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
            Search
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          {iconActions.map(({ icon: Icon, label, count }) => (
            <button
              key={label}
              aria-label={label}
              className="relative hidden text-slate-500 hover:text-primary sm:block"
            >
              <Icon className="h-6 w-6" strokeWidth={1.75} />
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {count}
              </span>
            </button>
          ))}

          <button aria-label="Account" className="text-slate-500 hover:text-primary">
            <User className="h-6 w-6" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
}
