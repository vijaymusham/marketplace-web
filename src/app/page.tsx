import type { Metadata } from "next";
import HomeView from "@/components/home-ui/HomeView";
import JsonLd from "@/components/seo/JsonLd";
import { getHomeBootstrap } from "@/lib/home-data";
import {
    absoluteUrl,
    DEFAULT_KEYWORDS,
    HOMEPAGE_DESCRIPTION,
    HOMEPAGE_TITLE,
    SITE_NAME_SPACED,
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
        description: HOMEPAGE_DESCRIPTION,
        url: absoluteUrl("/"),
        siteName: SITE_NAME_SPACED,
        type: "website",
        locale: "en_IN",
    },
};

export default async function HomePage() {
    const { cities, freshAds } = await getHomeBootstrap();

    return (
        <>
            <JsonLd
                data={[
                    {
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        name: HOMEPAGE_TITLE,
                        description: HOMEPAGE_DESCRIPTION,
                        url: absoluteUrl("/"),
                        isPartOf: {
                            "@type": "WebSite",
                            name: SITE_NAME_SPACED,
                            url: absoluteUrl("/"),
                        },
                        about: {
                            "@type": "Thing",
                            name: "Second hand marketplace and classified ads in India",
                        },
                    },
                    ...(freshAds.length
                        ? [
                              {
                                  "@context": "https://schema.org",
                                  "@type": "ItemList",
                                  name: "Fresh second hand deals on Deal Pokket",
                                  itemListOrder: "https://schema.org/ItemListOrderDescending",
                                  numberOfItems: freshAds.length,
                                  itemListElement: freshAds.slice(0, 12).map((ad, index) => ({
                                      "@type": "ListItem",
                                      position: index + 1,
                                      url: absoluteUrl(`/listing/${ad.id}`),
                                      name: ad.title,
                                  })),
                              },
                          ]
                        : []),
                ]}
            />
            <HomeView initialCities={cities} initialFreshAds={freshAds} />
        </>
    );
}
