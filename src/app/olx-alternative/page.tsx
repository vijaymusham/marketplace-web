import type { Metadata } from "next";
import OlxAlternativeView from "@/components/support/OlxAlternativeView";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, SITE_NAME_SPACED } from "@/lib/seo";

const title = "OLX Alternative in India — Sell Second Hand Easily | Deal Pokket";
const description =
  "Looking for an OLX alternative? Deal Pokket is a free second hand marketplace. Sell used items easily near you and keep the best value with local chat.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "OLX alternative",
    "OLX alternative India",
    "sell second hand easily",
    "best value second hand",
    "second hand marketplace India",
    "free ad posting",
    "Deal Pokket",
  ],
  alternates: {
    canonical: absoluteUrl("/olx-alternative"),
  },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/olx-alternative"),
    siteName: SITE_NAME_SPACED,
    type: "article",
    locale: "en_IN",
  },
};

export default function OlxAlternativePage() {
  const pageUrl = absoluteUrl("/olx-alternative");

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
            dateModified: "2026-10-01",
            about: {
              "@type": "Thing",
              name: "OLX alternative for second-hand selling in India",
            },
            isPartOf: {
              "@type": "WebSite",
              name: SITE_NAME_SPACED,
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
                name: "OLX alternative",
                item: pageUrl,
              },
            ],
          },
        ]}
      />
      <OlxAlternativeView />
    </>
  );
}
