import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { findRouteBySlug } from "@/lib/slug";

type Props = {
    params: Promise<{ slug: string }>;
    children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const match = findRouteBySlug(slug);
    const subject = match?.type === "category"
        ? match.category.name
        : match?.subcategory ?? "Second-hand products";
    const title = `${subject} for Sale in India — Buy & Sell on ${SITE_NAME}`;
    const description =
        `Buy and sell ${subject.toLowerCase()} near you on ${SITE_NAME}. ` +
        "Browse local second-hand listings, compare prices, and chat with sellers for free.";
    const pageUrl = absoluteUrl(`/category/${slug}`);

    return {
        title,
        description,
        alternates: { canonical: pageUrl },
        openGraph: {
            title,
            description,
            url: pageUrl,
            siteName: SITE_NAME,
            type: "website",
            locale: "en_IN",
        },
    };
}

export default function CategoryLayout({ children }: Props) {
    return children;
}
