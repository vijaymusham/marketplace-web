import { Search, ChevronDown, ShieldCheck, User, Tag } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="flex shrink-0 items-center">
          <span className="font-heading text-2xl font-extrabold text-primary">
            marketplace
          </span>
        </a>

        <div className="hidden shrink-0 flex-col gap-0.5 md:flex">
          <span className="flex items-center gap-1 text-xs font-extrabold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Sellers*
          </span>
          <button className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-primary">
            Select Location
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder='Search for "iPhone 13"'
            className="w-full rounded-full border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex shrink-0 items-center gap-6">
          <button className="hidden flex-col items-center gap-0.5 text-slate-800 hover:text-primary sm:flex">
            <User className="h-6 w-6" strokeWidth={1.75} />
            <span className="text-xs font-semibold">Login</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-slate-800 hover:text-primary">
            <Tag className="h-6 w-6" strokeWidth={1.75} />
            <span className="text-xs font-semibold">Sell</span>
          </button>
        </div>
      </div>
    </header>
  );
}
