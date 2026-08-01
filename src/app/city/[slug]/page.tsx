import CityDetails from "@/components/city/CityDetails";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "City | DealPokket",
    description: "Browse deals in your city on DealPokket.",
};

export default function CityPage() {
    return (
        <main className="flex-1">
            <CityDetails />
        </main>
    );
}
