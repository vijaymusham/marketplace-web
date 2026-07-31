import type { Metadata } from "next";
import HelpSupportView from "@/components/support/HelpSupportView";

export const metadata: Metadata = {
    title: "Help & Support | Deal Pokket",
    description: "Get help buying, selling, and managing your DealMarket account.",
};

export default function HelpPage() {
    return <HelpSupportView />;
}
