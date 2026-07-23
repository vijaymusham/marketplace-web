import type { Metadata } from "next";
import TermsView from "@/components/support/TermsView";

export const metadata: Metadata = {
    title: "Terms & Conditions | Deal Market",
    description: "Terms governing your use of the DealMarket marketplace.",
};

export default function TermsPage() {
    return <TermsView />;
}
