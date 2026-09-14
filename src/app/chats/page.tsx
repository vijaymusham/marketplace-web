import type { Metadata } from "next";
import ChatApp from "@/components/chats/ChatApp";

export const metadata: Metadata = {
    title: "Chats",
    description: "Message buyers and sellers on DealPokket.",
    robots: { index: false, follow: false },
};

export default function ChatsPage() {
    return (
        <main className="flex-1">
            <ChatApp />
        </main>
    );
}
