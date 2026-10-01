import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";
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
    const title = `Second Hand ${subject} for Sale in India | Deal Pokket`;
    const description =
        `Buy and sell second hand ${subject.toLowerCase()} near you on Deal Pokket. ` +
        "Browse local used listings, compare prices, and chat with sellers for free.";
    const pageUrl = absoluteUrl(`/category/${slug}`);

    return {
        title: { absolute: title },
        description,
        alternates: { canonical: pageUrl },
        openGraph: {
            title,
            description,
            url: pageUrl,
            siteName: "Deal Pokket",
            type: "website",
            locale: "en_IN",
        },
    };
}

export default function CategoryLayout({ children }: Props) {
    return children;
}
