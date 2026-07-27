import CityDetails from "@/components/city/CityDetails";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "City | DealMarket",
    description: "Browse deals in your city on DealMarket.",
};

export default function CityPage() {
    return (
        <main className="flex-1">
            <CityDetails />
        </main>
    );
}
