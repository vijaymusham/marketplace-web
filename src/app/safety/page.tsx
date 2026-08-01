import type { Metadata } from "next";
import SafetyTipsView from "@/components/support/SafetyTipsView";

export const metadata: Metadata = {
    title: "Safety Tips | Deal Pokket",
    description: "Stay safe when buying and selling on DealPokket.",
};

export default function SafetyPage() {
    return <SafetyTipsView />;
}
