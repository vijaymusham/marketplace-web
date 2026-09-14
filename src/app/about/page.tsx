import type { Metadata } from "next";
import AboutUsView from "@/components/support/AboutUsView";

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about DealPokket — the free second-hand marketplace for everyday buys and sells near you in India.",
};

export default function AboutPage() {
    return <AboutUsView />;
}
