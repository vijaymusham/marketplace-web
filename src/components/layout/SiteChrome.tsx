"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";
import TrustedBrands from "@/components/home-ui/TrustedBrands";

const HIDE_TRUSTED_BRANDS = [
    "/my-ads",
    "/help",
    "/safety",
    "/contact",
    "/terms",
    "/privacy",
];

/** Hides marketing chrome on immersive pages like /chats. */
export default function SiteChrome() {
    const pathname = usePathname();
    if (pathname?.startsWith("/chats")) return null;

    const hideTrusted = HIDE_TRUSTED_BRANDS.some((path) => pathname?.startsWith(path));

    return (
        <>
            {hideTrusted ? null : <TrustedBrands />}
            <Footer />
        </>
    );
}
