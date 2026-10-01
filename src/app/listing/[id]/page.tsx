import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { getPublicAd } from "@/lib/listing-data";
import {
    absoluteUrl,
    isIndexableAdStatus,
    metaDescription,
    SITE_NAME_SPACED,
} from "@/lib/seo";
import ListingDetail from "./ListingDetail";

type Props = {
    params: Promise<{ id: string }>;
};

function coverImage(images: { url: string; isCover: boolean; displayOrder: number }[]) {
    const sorted = [...images].sort((a, b) => {
        if (a.isCover !== b.isCover) return a.isCover ? -1 : 1;
        return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    });
    return sorted.find((image) => image.url)?.url;
}

function listingHeadline(title: string, city?: string | null) {
    const place = city ? ` in ${city}` : "";
    const suffix = ` — Second Hand | ${SITE_NAME_SPACED}`;
    const full = `${title}${place}${suffix}`;
    if (full.length <= 70) return full;
    const budget = Math.max(24, 70 - place.length - suffix.length);
    const short = title.slice(0, budget).trimEnd();
    return `${short}${place}${suffix}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const ad = await getPublicAd(id);
    const pageUrl = absoluteUrl(`/listing/${id}`);

    if (!ad) {
        return {
            title: `Second Hand Listing | ${SITE_NAME_SPACED}`,
            description:
                "View a second hand listing on Deal Pokket, the free marketplace for used products in India.",
            alternates: { canonical: pageUrl },
        };
    }

    const city = ad.city?.name;
    const title = listingHeadline(ad.title, city);
    const description = metaDescription(
        ad.description ||
            `${ad.title} for sale${city ? ` in ${city}` : ""} on Deal Pokket, a free second hand marketplace in India.`,
    );
    const image = coverImage(ad.images ?? []);
    const indexable = isIndexableAdStatus(ad.status);

    return {
        title: { absolute: title },
        description,
        alternates: { canonical: pageUrl },
        robots: indexable
            ? { index: true, follow: true }
            : { index: false, follow: false },
        openGraph: {
            title,
            description,
            url: pageUrl,
            siteName: SITE_NAME_SPACED,
            type: "website",
            locale: "en_IN",
            ...(image ? { images: [{ url: image, alt: ad.title }] } : {}),
        },
    };
}

export default async function ListingPage({ params }: Props) {
    const { id } = await params;
    const ad = await getPublicAd(id);
    const pageUrl = absoluteUrl(`/listing/${id}`);
    const image = ad ? coverImage(ad.images ?? []) : undefined;
    const sold = Boolean(ad?.soldAt) || ad?.status?.toLowerCase() === "sold";
    const categoryName = ad?.subCategory?.name || ad?.category?.name;

    return (
        <main className="flex-1 bg-white">
            {ad ? (
                <JsonLd
                    data={[
                        {
                            "@context": "https://schema.org",
                            "@type": "Product",
                            name: ad.title,
                            description: metaDescription(ad.description || ad.title, 500),
                            url: pageUrl,
                            ...(image ? { image } : {}),
                            ...(categoryName ? { category: categoryName } : {}),
                            seller: {
                                "@type": "Organization",
                                name: SITE_NAME_SPACED,
                            },
                            offers: {
                                "@type": "Offer",
                                url: pageUrl,
                                priceCurrency: "INR",
                                price: Number.isFinite(ad.price) ? ad.price : 0,
                                availability: sold
                                    ? "https://schema.org/SoldOut"
                                    : "https://schema.org/InStock",
                                itemCondition: "https://schema.org/UsedCondition",
                            },
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            itemListElement: [
                                {
                                    "@type": "ListItem",
                                    position: 1,
                                    name: "Home",
                                    item: absoluteUrl("/"),
                                },
                                {
                                    "@type": "ListItem",
                                    position: 2,
                                    name: "Second hand marketplace",
                                    item: absoluteUrl("/second-hand"),
                                },
                                ...(categoryName
                                    ? [
                                          {
                                              "@type": "ListItem",
                                              position: 3,
                                              name: categoryName,
                                              item: pageUrl,
                                          },
                                      ]
                                    : [
                                          {
                                              "@type": "ListItem",
                                              position: 3,
                                              name: ad.title,
                                              item: pageUrl,
                                          },
                                      ]),
                            ],
                        },
                    ]}
                />
            ) : null}
            <ListingDetail id={id} />
        </main>
    );
}
