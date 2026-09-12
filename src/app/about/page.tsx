import type { Metadata } from "next";
import AboutUsView from "@/components/support/AboutUsView";

export const metadata: Metadata = {
    title: "About Us | Deal Pokket",
    description:
        "Learn about DealPokket — the local marketplace for everyday buys and sells near you.",
};

export default function AboutPage() {
    return <AboutUsView />;
}
