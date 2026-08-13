"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";

/** Hides marketing chrome on immersive pages like /chats. */
export default function SiteChrome() {
    const pathname = usePathname();
    if (pathname?.startsWith("/chats")) return null;

    return (
        <>
            <Footer />
        </>
    );
}
