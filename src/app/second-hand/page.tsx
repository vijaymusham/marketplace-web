import type { Metadata } from "next";
import SecondHandView from "@/components/support/SecondHandView";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

const title = "Second Hand Marketplace India — Free Buy & Sell Near You";
const description =
  "DealPokket is a free second-hand marketplace in India. Buy & sell used mobiles, bikes, furniture and more near you with free ad posting and local chat.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "second hand marketplace India",
    "second hand buy sell",
    "free ad posting websites",
    "free ad posting sites India",
    "buy sell used items near me",
    "used products marketplace",
    "DealPokket",
  ],
  alternates: {
    canonical: absoluteUrl("/second-hand"),
  },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/second-hand"),
    siteName: SITE_NAME,
    type: "article",
    locale: "en_IN",
  },
};

export default function SecondHandPage() {
  const pageUrl = absoluteUrl("/second-hand");

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
                name: "Second Hand Marketplace",
                item: pageUrl,
              },
            ],
          },
        ]}
      />
      <SecondHandView />
    </>
  );
}
