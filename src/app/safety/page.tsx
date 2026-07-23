import type { Metadata } from "next";
import SafetyTipsView from "@/components/support/SafetyTipsView";

export const metadata: Metadata = {
    title: "Safety Tips | Deal Market",
    description: "Stay safe when buying and selling on DealMarket.",
};

export default function SafetyPage() {
    return <SafetyTipsView />;
}
