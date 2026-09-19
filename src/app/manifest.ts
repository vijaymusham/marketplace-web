import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${SITE_NAME} — Second Hand Marketplace in India`,
        short_name: SITE_NAME,
        description: SITE_TAGLINE,
        start_url: absoluteUrl("/"),
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#e0e1fa",
        lang: "en-IN",
        icons: [
            {
                src: absoluteUrl("/logo.png"),
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
