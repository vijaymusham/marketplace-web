import type { Metadata } from "next";
import { Outfit, Lexend } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
      className={`${outfit.variable} ${lexend.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white font-body text-slate-900">
        {children}
      </body>
    </html>
  );
}
