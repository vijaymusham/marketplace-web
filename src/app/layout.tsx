import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import Preloader from "@/components/layout/Preloader";
import { IntroProvider } from "@/components/layout/IntroContext";
import { AuthProvider } from "@/components/auth/AuthProvider";
import TanstackProvider from "@/components/providers/TanstackProvider";
import SiteChrome from "@/components/layout/SiteChrome";

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
    title: "Deal Market",
    description: "Buy and sell used products near you",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${display.variable} h-full antialiased intro-pending`}
        >
            <body className="min-h-full flex flex-col bg-white font-display text-slate-900" suppressHydrationWarning>
                <TanstackProvider>
                    <AuthProvider>
                        <IntroProvider>
                            <SmoothScroll>
                                <Preloader />
                                <Navbar />
                                {children}
                                <Toaster
                                    position="top-right"
                                    reverseOrder={false}
                                    gutter={8}
                                    containerStyle={{ zIndex: 100000 }}
                                    toasterId="default"
                                />
                                <SiteChrome />
                            </SmoothScroll>
                        </IntroProvider>
                    </AuthProvider>
                </TanstackProvider>
            </body>
        </html>
    );
}
