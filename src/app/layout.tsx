import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrustedBrands from "@/components/home-ui/TrustedBrands";
import { Toaster } from "react-hot-toast";
import SellFab from "@/components/layout/SellFab";

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
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                        gutter={8}
                        containerClassName=""
                        containerStyle={{}}
                        toasterId="default"
                        toastOptions={{
                            // Define default options
                            className: '',
                            duration: 5000,
                            removeDelay: 1000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },

                            // Default options for specific types
                            success: {
                                duration: 3000,
                                iconTheme: {
                                    primary: 'green',
                                    secondary: 'black',
                                },
                            },
                        }}
                    />
                    <TrustedBrands />
                    <Footer />
                    <SellFab />
                </SmoothScroll>
            </body>
        </html>
    );
}
