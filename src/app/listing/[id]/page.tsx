import type { Metadata } from "next";
import ListingDetail from "./ListingDetail";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    return {
        title: id ? `Listing | DealPokket` : "Listing not found",
        description: "View listing details on DealPokket",
    };
}

export default async function ListingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <main className="flex-1 bg-white">
            <ListingDetail id={id} />
        </main>
    );
}
