import type { Metadata } from "next";
import WishlistView from "@/components/wishlist/WishlistView";

export const metadata: Metadata = {
    title: "Wishlist | DealPokket",
    description: "Your saved deals and favorite listings on DealPokket.",
};

export default function WishlistPage() {
    return (
        <main className="flex-1 bg-white">
            <WishlistView />
        </main>
    );
}
