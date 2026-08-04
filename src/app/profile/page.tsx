import type { Metadata } from "next";
import EditProfileView from "@/components/profile/EditProfileView";

export const metadata: Metadata = {
    title: "Edit Profile | DealPokket",
    description: "Update your DealPokket profile photo and personal details.",
};

export default function ProfilePage() {
    return (
        <main className="flex-1 bg-white">
            <EditProfileView />
        </main>
    );
}
