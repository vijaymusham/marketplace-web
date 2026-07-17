import { navCategories } from "@/lib/categories";

export default function CategoryTabs() {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8 scrollbar-hide">
        <ul className="flex w-full min-w-max items-center justify-center gap-8">
          {navCategories.map(({ name, icon: Icon }, index) => (
            <li key={name}>
              <button
                className={`flex items-center gap-2 border-b-2 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${index === 0
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-600 hover:text-primary"
                  }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
