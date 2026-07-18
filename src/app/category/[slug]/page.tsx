import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubcategoryTabs from "@/components/category-ui/SubcategoryTabs";
import PaginatedListings from "@/components/category-ui/PaginatedListings";
import { listings, type Listing } from "@/lib/listings";
import { allSubcategorySlugs, findSubcategoryBySlug } from "@/lib/slug";

export function generateStaticParams() {
    return allSubcategorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const match = findSubcategoryBySlug(slug);
    if (!match) return { title: "Category not found" };
    return {
        title: `${match.subcategory} - Buy & Sell Used ${match.subcategory} | FixDeal`,
        description: `Find the best deals on new and second hand ${match.subcategory.toLowerCase()} near you.`,
    };
}

function buildListings(slug: string): Listing[] {
    return Array.from({ length: 60 }, (_, i) => {
        const base = listings[i % listings.length];
        return {
            ...base,
            id: i + 1,
            image: `${base.image.split("?")[0]}?lock=${slug.length * 100 + i}`,
        };
    });
}

export default async function SubcategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const match = findSubcategoryBySlug(slug);
    if (!match) notFound();

    const { category, subcategory } = match;
    const data = buildListings(slug);

    return (
        <>
            <SubcategoryTabs
                categoryName={category.name}
                activeSubcategory={subcategory}
            />
            <main className="flex-1 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
                    <header className="mb-7 md:mb-9">
                        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                            {subcategory} for Sale
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-500 md:text-base">
                            Find the best deals on new and second hand{" "}
                            {subcategory.toLowerCase()} in {category.name.toLowerCase()} near
                            you. Verified sellers, great prices and {data.length}+ fresh ads
                            posted every day.
                        </p>
                    </header>

                    <PaginatedListings listings={data} />
                </div>
            </main>
        </>
    );
}
