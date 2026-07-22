"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";
import TrustedBrands from "@/components/home-ui/TrustedBrands";

/** Hides marketing chrome on immersive pages like /chats. */
export default function SiteChrome() {
    const pathname = usePathname();
    if (pathname?.startsWith("/chats")) return null;

    return (
        <>
            {pathname?.startsWith("/my-ads") || pathname?.startsWith("/help") ? null : <TrustedBrands />}
            <Footer />
        </>
    );
}
