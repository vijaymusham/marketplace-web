import type { Metadata } from "next";
import HomeView from "@/components/home-ui/HomeView";
import JsonLd from "@/components/seo/JsonLd";
import { getHomeBootstrap } from "@/lib/home-data";
import {
    absoluteUrl,
    DEFAULT_KEYWORDS,
    SITE_NAME,
    SITE_TAGLINE,
} from "@/lib/seo";

export const metadata: Metadata = {
    title: {
        absolute:
            "DealPokket — Buy & Sell Second Hand Products in India",
    },
    description:
        "Buy and sell second hand and pre-owned products in India with DealPokket. Discover great products, connect with sellers, and find your next deal.",
    keywords: [...DEFAULT_KEYWORDS],
    alternates: {
        canonical: absoluteUrl("/"),
    },
    openGraph: {
        title: "DealPokket — Buy & Sell Second Hand Products in India",
        description: SITE_TAGLINE,
        url: absoluteUrl("/"),
        siteName: SITE_NAME,
        type: "website",
        locale: "en_IN",
    },
};

export default async function HomePage() {
    const { cities, freshAds } = await getHomeBootstrap();

    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    name: "DealPokket — Free Second Hand Marketplace in India",
                    description: SITE_TAGLINE,
                    url: absoluteUrl("/"),
                    isPartOf: {
                        "@type": "WebSite",
                        name: SITE_NAME,
                        url: absoluteUrl("/"),
                    },
                    about: {
                        "@type": "Thing",
                        name: "Second-hand marketplace and classified ads in India",
                    },
                }}
            />
            <HomeView initialCities={cities} initialFreshAds={freshAds} />
        </>
    );
}
