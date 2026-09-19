import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import Preloader from "@/components/layout/Preloader";
import { IntroProvider } from "@/components/layout/IntroContext";
import { AuthProvider } from "@/components/auth/AuthProvider";
import TanstackProvider from "@/components/providers/TanstackProvider";
import FcmProvider from "@/components/providers/FcmProvider";
import SiteChrome from "@/components/layout/SiteChrome";
import { SocketProvider } from "@/components/socket/SocketProvider";
import ClarityAnalytics from "@/components/layout/ClarityAnalytics";
import JsonLd from "@/components/seo/JsonLd";
import {
    absoluteUrl,
    DEFAULT_KEYWORDS,
    getSiteUrl,
    HOMEPAGE_DESCRIPTION,
    HOMEPAGE_TITLE,
    SITE_NAME,
    SITE_NAME_SPACED,
    SITE_TAGLINE,
} from "@/lib/seo";

/** Matches navbar top tint: primary (#2f3adf) at 15% over white */
const THEME_COLOR = "#e0e1fa";

export const display = localFont({
    src: [
        { path: "../../public/fonts/Gilroy-Medium.woff2", weight: '500', style: 'normal' },
        { path: "../../public/fonts/Gilroy-SemiBold.woff2", weight: '600', style: 'normal' },
        { path: "../../public/fonts/Gilroy-Bold.woff2", weight: '700', style: 'normal' },
        { path: "../../public/fonts/Gilroy-ExtraBold.woff2", weight: '900', style: 'normal' },
    ],
    variable: "--font-display",
    display: "swap",
    preload: true,
});

export const metadata: Metadata = {
    metadataBase: new URL(getSiteUrl()),
    title: {
        default: HOMEPAGE_TITLE,
        template: `%s | ${SITE_NAME}`,
    },
    description: HOMEPAGE_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords: [...DEFAULT_KEYWORDS],
    authors: [{ name: SITE_NAME_SPACED, url: absoluteUrl("/") }],
    creator: SITE_NAME_SPACED,
    publisher: SITE_NAME_SPACED,
    category: "marketplace",
    icons: {
        icon: "/logo.png",
        apple: "/logo.png",
    },
    alternates: {
        canonical: absoluteUrl("/"),
    },
    openGraph: {
        type: "website",
        locale: "en_IN",
        url: absoluteUrl("/"),
        siteName: SITE_NAME,
        title: `${SITE_NAME} — Free Second Hand Marketplace | Classified Ads`,
        description: HOMEPAGE_DESCRIPTION,
        images: [
            {
                url: absoluteUrl("/logo.png"),
                width: 512,
                height: 512,
                alt: `${SITE_NAME} logo`,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${SITE_NAME} — Free Second Hand Marketplace in India`,
        description: HOMEPAGE_DESCRIPTION,
        images: [absoluteUrl("/logo.png")],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    appleWebApp: {
        statusBarStyle: "default",
        title: SITE_NAME,
    },
    other: {
        "geo.region": "IN",
    },
};

export const viewport: Viewport = {
    themeColor: THEME_COLOR,
    colorScheme: "light",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${display.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col bg-white font-display text-slate-900" suppressHydrationWarning>
                <JsonLd
                    data={[
                        {
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: SITE_NAME,
                            alternateName: SITE_NAME_SPACED,
                            url: absoluteUrl("/"),
                            logo: absoluteUrl("/logo.png"),
                            email: "dealpokket@gmail.com",
                            description: HOMEPAGE_DESCRIPTION,
                            areaServed: {
                                "@type": "Country",
                                name: "India",
                            },
                            contactPoint: {
                                "@type": "ContactPoint",
                                contactType: "customer support",
                                email: "dealpokket@gmail.com",
                                availableLanguage: ["English", "Hindi"],
                            },
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            name: SITE_NAME,
                            url: absoluteUrl("/"),
                            description: HOMEPAGE_DESCRIPTION,
                            inLanguage: "en-IN",
                            potentialAction: {
                                "@type": "SearchAction",
                                target: {
                                    "@type": "EntryPoint",
                                    urlTemplate: `${absoluteUrl("/")}?q={search_term_string}`,
                                },
                                "query-input": "required name=search_term_string",
                            },
                        },
                    ]}
                />
                <TanstackProvider>
                    <SocketProvider>
                        <AuthProvider>
                            <FcmProvider>
                                <IntroProvider>
                                    <SmoothScroll>
                                        <Preloader />
                                        <Navbar />
                                        {children}
                                        <Toaster
                                            position="top-right"
                                            reverseOrder={false}
                                            gutter={8}
                                            containerStyle={{ zIndex: 100000, fontFamily: "var(--font-display)", fontWeight: "600" }}
                                            toasterId="default"
                                        />
                                        <ClarityAnalytics />
                                        <SiteChrome />
                                    </SmoothScroll>
                                </IntroProvider>
                            </FcmProvider>
                        </AuthProvider>
                    </SocketProvider>
                </TanstackProvider>
            </body>
        </html>
    );
}
