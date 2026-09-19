import type { Metadata } from "next";
import HomeView from "@/components/home-ui/HomeView";
import JsonLd from "@/components/seo/JsonLd";
import { getHomeBootstrap } from "@/lib/home-data";
import {
    absoluteUrl,
    DEFAULT_KEYWORDS,
    HOMEPAGE_DESCRIPTION,
    HOMEPAGE_TITLE,
    SITE_NAME,
    SITE_TAGLINE,
} from "@/lib/seo";

export const metadata: Metadata = {
    title: { absolute: HOMEPAGE_TITLE },
    description: HOMEPAGE_DESCRIPTION,
    keywords: [...DEFAULT_KEYWORDS],
    alternates: {
        canonical: absoluteUrl("/"),
    },
    openGraph: {
        title: HOMEPAGE_TITLE,
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
