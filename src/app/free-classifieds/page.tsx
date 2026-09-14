import type { Metadata } from "next";
import FreeClassifiedsView from "@/components/support/FreeClassifiedsView";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

const title = "Best Free Classified Ads in India (2026) — Second Hand Marketplace";
const description =
  "Looking for free classified ads in India? Compare DealPokket, Quikr & Facebook Marketplace. Free ad posting, local second-hand deals, and in-app chat on DealPokket.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "free classified ads India",
    "free ad posting websites",
    "free ad posting sites India",
    "best free selling site",
    "second hand marketplace India",
    "DealPokket",
  ],
  alternates: {
    canonical: absoluteUrl("/free-classifieds"),
  },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/free-classifieds"),
    siteName: SITE_NAME,
    type: "article",
    locale: "en_IN",
  },
};

export default function FreeClassifiedsPage() {
  const pageUrl = absoluteUrl("/free-classifieds");

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            description,
            url: pageUrl,
            dateModified: "2026-09-13",
            isPartOf: {
              "@type": "WebSite",
              name: SITE_NAME,
              url: absoluteUrl("/"),
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
                name: "Free Classifieds",
                item: pageUrl,
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Best free classifieds options in India 2026",
            itemListOrder: "https://schema.org/ItemListOrderAscending",
            numberOfItems: 3,
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "DealPokket",
                url: absoluteUrl("/"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Facebook Marketplace",
                url: "https://www.facebook.com/marketplace",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Quikr",
                url: "https://www.quikr.com",
              },
            ],
          },
        ]}
      />
      <FreeClassifiedsView />
    </>
  );
}
