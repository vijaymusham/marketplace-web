import type { Metadata } from "next";
import PrivacyView from "@/components/support/PrivacyView";

export const metadata: Metadata = {
    title: "Privacy Policy | Deal Market",
    description: "How DealMarket collects, uses, and protects your data.",
};

export default function PrivacyPage() {
    return <PrivacyView />;
}
