import type { Metadata } from "next";
import EditProfileView from "@/components/profile/EditProfileView";

export const metadata: Metadata = {
    title: "Edit Profile",
    description: "Update your DealPokket profile photo and personal details.",
    robots: { index: false, follow: false },
};

export default function ProfilePage() {
    return (
        <main className="flex-1 bg-slate-50">
            <EditProfileView />
        </main>
    );
}
