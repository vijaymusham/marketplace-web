import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, MapPin } from "lucide-react";
import PaginatedListings from "@/components/category-ui/PaginatedListings";
import { allCitySlugs, findCityBySlug, getCityImage } from "@/lib/cities";
import { listings, type Listing } from "@/lib/listings";
import { slugify } from "@/lib/slug";
import { ApiAd } from "@/components/types/AllTypes";

export function generateStaticParams() {
    return allCitySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const city = findCityBySlug(slug);
    if (!city) return { title: "City not found" };
    return {
        title: `Buy & Sell in ${city.name} | DealMarket`,
        description: city.description,
    };
}

function buildCityListings(cityName: string, count = 40): Listing[] {
    const seed = slugify(cityName);
    return Array.from({ length: count }, (_, i) => {
        const base = listings[i % listings.length];
        return {
            ...base,
            id: i + 1,
            location: `${cityName}`,
            image: `${base.image.split("?")[0]}?lock=${seed.length * 50 + i + 20}`,
        };
    });
}

export default async function CityPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const city = findCityBySlug(slug);
    if (!city) notFound();

    const data = buildCityListings(city.name);

    return (
        <main className="flex-1 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>

                    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm font-medium">
                        <Link href="/" className="text-slate-400 transition-colors hover:text-primary">
                            Home
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                        <span className="font-semibold text-slate-900">{city.name}</span>
                    </nav>
                </div>

                <header className="mb-8 md:mb-10">
                    <div className="relative aspect-21/9 overflow-hidden rounded-[1.75rem] bg-slate-100 sm:aspect-3/1">
                        <Image
                            src={getCityImage(city)}
                            alt={`${city.name} cityscape`}
                            fill
                            priority
                            sizes="(min-width: 1280px) 1280px, 100vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                                <MapPin className="h-3.5 w-3.5" />
                                {city.distance}
                            </p>
                            <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                                Deals in {city.name}
                            </h1>
                        </div>
                    </div>

                    <p className="mt-5 max-w-3xl text-sm leading-relaxed font-medium text-slate-500 md:text-[15px]">
                        {city.description} Verified sellers, great prices and {data.length}+
                        fresh ads near you.
                    </p>
                </header>

                <PaginatedListings listings={data as unknown as ApiAd[]} />
            </div>
        </main>
    );
}
