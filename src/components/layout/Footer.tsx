import type { SVGProps } from "react";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { scrollToTop } from "@/lib/lenis";
import Image from "next/image";

function FacebookLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}

function InstagramLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4.3" />
            <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
        </svg>
    );
}

function TikTokLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
    );
}

function YouTubeLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    );
}

const menuColumns = [
    {
        heading: "Company",
        links: [
            { label: "About Us", href: "#" },
            { label: "Safety Tips", href: "/safety" },
            { label: "Contact Us", href: "/contact" },
            // { label: "Careers", href: "#" },
            // { label: "Press", href: "#" },
            // { label: "Blog", href: "#" },
            // { label: "Sitemap", href: "#" },
        ],
    },
    {
        heading: "Support",
        links: [
            { label: "Help & Support", href: "/help" },
            { label: "Terms & Conditions", href: "/terms" },
            { label: "Privacy Policy", href: "/privacy" },
        ],
    },
    {
        heading: "Available in",
        links: [
            { label: "Mumbai", href: "#" },
            { label: "Pune", href: "#" },
            { label: "+ 680 more cities", href: "#" },
        ],
    },
];

const socials = [
    { icon: FacebookLogo, label: "Facebook" },
    { icon: InstagramLogo, label: "Instagram" },
    { icon: YouTubeLogo, label: "YouTube" },
];

function AppleLogo() {
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.03 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
        </svg>
    );
}

function PlayLogo() {
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path fill="#00d7fe" d="M4.2 1.9v20.2L14.7 12z" />
            <path
                fill="#ffce00"
                d="M14.7 12l3-2.9 3.3 1.9c1 .57 1 1.43 0 2l-3.3 1.9z"
            />
            <path fill="#00f076" d="M4.2 1.9c.25-.3.7-.35 1.15-.1l12.3 6.3-2.95 2.9z" />
            <path fill="#f63448" d="M4.2 22.1c.25.3.7.35 1.15.1l12.3-6.3-2.95-2.9z" />
        </svg>
    );
}

function StoreBadge({
    logo,
    topLine,
    storeName,
}: {
    logo: React.ReactNode;
    topLine: string;
    storeName: string;
}) {
    return (
        <Link
            href="#"
            onClick={() => { toast.success('Coming soon 🥳') }}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-black px-4 py-2 transition-colors hover:border-white/40 sm:w-auto"
        >
            {logo}
            <span className="flex flex-col leading-tight gap-1">
                <span className="text-[10px] font-medium tracking-wide text-slate-300 uppercase">
                    {topLine}
                </span>
                <span className="text-[17px] font-semibold text-white">{storeName}</span>
            </span>
        </Link>
    );
}

export default function Footer() {
    return (
        <footer className="overflow-hidden bg-[#0b0d12] text-slate-400 md:rounded-t-4xl">
            <div className="mx-auto px-4 pt-10 lg:pt-16 sm:px-6 lg:px-12">
                {/* main columns */}
                <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] lg:gap-12">
                    {/* brand */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-1">
                        <Link
                            href="/"
                            scroll={false}
                            onClick={() => {
                                if (window.location.pathname === "/") scrollToTop();
                            }}
                            className="group flex shrink-0 items-center"
                        >
                            <Image src="/logo-white.png" alt="DealPokket" width={100} height={100} className="w-16 h-16" />
                            <span className="font-heading text-3xl font-black tracking-tight text-[#2340FD]">
                                Deal<span className="text-white">Pokket</span>
                            </span>
                        </Link>

                        <h3 className="mt-6 font-heading text-lg font-extrabold text-white">
                            Buy and sell anything.
                        </h3>
                        <p className="mt-3 max-w-xs text-sm leading-relaxed">
                            Your local marketplace for everyday deals — discover great
                            finds nearby and list what you no longer need.
                        </p>

                        {/* <button className="mt-6 flex items-center gap-3 rounded-full bg-white/10 py-1.5 pr-1.5 pl-5 text-sm font-semibold text-white transition-colors hover:bg-white/15">
                            Start selling
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                                <ArrowRight className="h-4 w-4" />
                            </span>
                        </button>

                        <p className="mt-8 text-xs text-slate-500">
                            © 2026 Deal Pokket Limited
                        </p> */}
                    </div>

                    {/* menu columns */}
                    {menuColumns.map(({ heading, links }) => (
                        <div key={heading}>
                            <h4 className="text-sm font-bold text-indigo-400">{heading}</h4>
                            <ul className="mt-5 space-y-3.5">
                                {links.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            scroll={false}
                                            onClick={() => {
                                                if (href === "#" || href.startsWith("#")) {
                                                    scrollToTop();
                                                }
                                            }}
                                            className="text-sm transition-colors hover:text-white"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* social */}
                    <div>
                        <h4 className="text-sm font-bold text-indigo-400">Social</h4>
                        <ul className="mt-5 space-y-3.5">
                            {socials.map(({ icon: Icon, label }) => (
                                <li key={label}>
                                    <Link
                                        href="#"
                                        className="flex items-center gap-2.5 text-sm transition-colors hover:text-white"
                                    >
                                        <Icon className="h-4 w-4" />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* app download bar */}

                <p className="mt-14 mb-5 text-center text-sm text-slate-500">
                    © {new Date().getFullYear()} Deal Pokket Limited  |  All rights reserved.
                </p>
                <div className="flex flex-col items-center justify-center gap-5 border-t border-white/5 py-8 sm:flex-row sm:gap-8">
                    <p className="px-2 text-center text-sm font-semibold text-white sm:text-base">
                        For better experience, download the Deal Pokket app now
                    </p>
                    <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center md:flex-row">
                        <StoreBadge
                            logo={<AppleLogo />}
                            topLine="Download on"
                            storeName="App Store"
                        />
                        <StoreBadge
                            logo={<PlayLogo />}
                            topLine="Available on"
                            storeName="Google Play"
                        />
                    </div>
                </div>
            </div>

            {/* giant watermark */}
            <div className="relative select-none pointer-events-none mt-6 sm:mt-8 mb-1 sm:mb-2 px-2">
                <p
                    aria-hidden
                    className="font-black text-[14.5vw] sm:text-[13vw] md:text-[14.5vw] leading-[0.9] text-center tracking-tight whitespace-nowrap bg-linear-to-b from-slate-400/50 from-[0%] via-slate-500/22 via-[60%] to-transparent to-[100%] bg-clip-text text-transparent"
                >
                    Deal Pokket
                </p>
            </div>
        </footer>
    );
}
