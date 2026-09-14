import type { Metadata } from "next";
import CityDetails from "@/components/city/CityDetails";
import { findCityBySlug } from "@/lib/cities";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = findCityBySlug(slug);
  const cityName = city?.name ?? "Your city";

  const title = `Second Hand Deals in ${cityName} — Buy & Sell Near You`;
  const description =
    city?.description ??
    `Browse free second-hand listings in ${cityName} on DealPokket. Buy and sell used items near you with local chat.`;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/city/${slug}`),
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(`/city/${slug}`),
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
    },
  };
}

export default function CityPage() {
  return (
    <main className="flex-1">
      <CityDetails />
    </main>
  );
}
