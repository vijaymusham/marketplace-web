import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrustedBrands from "@/components/home-ui/TrustedBrands";

export const display = localFont({
    src: [
        { path: "../../public/fonts/Gilroy-Light.woff", weight: '300', style: 'normal' },
        { path: "../../public/fonts/Gilroy-Regular.woff", weight: '400', style: 'normal' },
        { path: "../../public/fonts/Gilroy-Medium.woff", weight: '500', style: 'normal' },
        { path: "../../public/fonts/Gilroy-Bold.woff", weight: '700', style: 'normal' },
        { path: "../../public/fonts/Gilroy-Heavy.woff", weight: '900', style: 'normal' },
    ],
    variable: "--font-display",
    display: "swap",
    preload: true,
});

export const metadata: Metadata = {
    title: "Marketplace",
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
            className={`${display.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col bg-white font-display text-slate-900" suppressHydrationWarning>
                <SmoothScroll>
                    <Navbar />
                    {children}
                    <TrustedBrands />
                    <Footer />
                </SmoothScroll>
            </body>
        </html>
    );
}
