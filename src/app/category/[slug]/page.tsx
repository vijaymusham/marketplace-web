import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubcategoryTabs from "@/components/category-ui/SubcategoryTabs";
import PaginatedListings from "@/components/category-ui/PaginatedListings";
import SubcategoryBrowse from "@/components/category-ui/SubcategoryBrowse";
import { listings, type Listing } from "@/lib/listings";
import {
  allCategoryPageSlugs,
  findRouteBySlug,
} from "@/lib/slug";

export function generateStaticParams() {
  return allCategoryPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const match = findRouteBySlug(slug);
  if (!match) return { title: "Category not found" };

  if (match.type === "category") {
    return {
      title: `${match.category.name} - Buy & Sell Used Items | FixDeal`,
      description: `Browse all ${match.category.name.toLowerCase()} listings near you.`,
    };
  }

  return {
    title: `${match.subcategory} - Buy & Sell Used ${match.subcategory} | FixDeal`,
    description: `Find the best deals on new and second hand ${match.subcategory.toLowerCase()} near you.`,
  };
}

function buildListings(seed: string, count = 60): Listing[] {
  return Array.from({ length: count }, (_, i) => {
    const base = listings[i % listings.length];
    return {
      ...base,
      id: i + 1,
      image: `${base.image.split("?")[0]}?lock=${seed.length * 100 + i}`,
    };
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const match = findRouteBySlug(slug);
  if (!match) notFound();

  // Category click → existing layout (tabs + grid), no sidebar
  if (match.type === "category") {
    const { category } = match;
    const data = buildListings(slug);

    return (
      <>
        <SubcategoryTabs
          categoryName={category.name}
          activeSubcategory=""
        />
        <main className="flex-1 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
            <header className="mb-7 md:mb-9">
              <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                {category.name} for Sale
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500 md:text-sm">
                Browse all {category.name.toLowerCase()} listings near you.
                Verified sellers, great prices and {data.length}+ fresh ads
                posted every day.
              </p>
            </header>

            <PaginatedListings listings={data} />
          </div>
        </main>
      </>
    );
  }

  // Subcategory click → folder sidebar + filters + 4×4 ListCard grid
  const { category, subcategory } = match;
  const data = buildListings(slug);

  return (
    <main className="flex-1 bg-white">
      <SubcategoryBrowse
        categoryName={category.name}
        subcategories={category.subcategories}
        activeSubcategory={subcategory}
        listings={data}
      />
    </main>
  );
}
