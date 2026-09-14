import Link from "next/link";
import SupportShell, { SupportList, SupportSection } from "@/components/support/SupportShell";
import { cities } from "@/lib/cities";
import { slugify } from "@/lib/slug";

const LINKS = [
    { id: "what", label: "What is it" },
    { id: "categories", label: "What to sell" },
    { id: "cities", label: "Cities" },
    { id: "tips", label: "Selling tips" },
    { id: "why", label: "Why DealPokket" },
    { id: "start", label: "Get started" },
];

const CATEGORIES = [
    { name: "Mobiles & gadgets", href: "/category/mobiles-and-tablets" },
    { name: "Bikes & vehicles", href: "/category/bikes" },
    { name: "Furniture", href: "/category/furniture" },
    { name: "Electronics", href: "/category/electronics" },
    { name: "Fashion", href: "/category/fashion" },
    { name: "Home & living", href: "/category/home-and-living" },
];

export default function SecondHandView() {
    const topCities = cities.slice(0, 8);

    return (
        <SupportShell
            eyebrow="Second Hand Marketplace"
            title="Buy & sell"
            titleAccent="second-hand near you"
            description="DealPokket is a free second-hand marketplace in India — post free ads, find used items nearby, and chat with local buyers and sellers."
            lastUpdated="September 2026"
            links={LINKS}
        >
            <SupportSection id="what" number={1} title="What is a second-hand marketplace?">
                <p>
                    A <strong>second-hand marketplace</strong> helps people buy and sell used
                    products locally — phones, bikes, furniture, appliances, and more — without
                    shipping across the country. DealPokket is built for that: free classified ads,
                    local discovery, and in-app chat.
                </p>
                <p>
                    If you searched for <strong>free ad posting websites</strong>,{" "}
                    <strong>free ad posting sites India</strong>, or{" "}
                    <strong>buy sell used items near me</strong>, you are in the right place.
                </p>
            </SupportSection>

            <SupportSection id="categories" number={2} title="Popular second-hand categories">
                <SupportList
                    items={[
                        "Used mobiles and tablets with clear photos and battery notes.",
                        "Bikes and scooters with ownership and condition details.",
                        "Furniture and home appliances for shifting homes.",
                        "Electronics, fashion, books, and kids’ essentials.",
                    ]}
                />
                <div className="flex flex-wrap gap-2 pt-1">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.href}
                            href={cat.href}
                            className="rounded-full bg-[#f3f4f8] px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </SupportSection>

            <SupportSection id="cities" number={3} title="Second-hand deals across Indian cities">
                <p>
                    Browse local listings in major cities. Local meetups keep deals faster and
                    safer than long-distance shipping.
                </p>
                <div className="flex flex-wrap gap-2">
                    {topCities.map((city) => (
                        <Link
                            key={city.name}
                            href={`/city/${slugify(city.name)}`}
                            className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-primary/30 hover:text-primary"
                        >
                            {city.name}
                        </Link>
                    ))}
                </div>
            </SupportSection>

            <SupportSection id="tips" number={4} title="Tips to sell second-hand items faster">
                <SupportList
                    items={[
                        "Use bright, honest photos from multiple angles.",
                        "Set a fair price based on age and condition.",
                        "Write the exact model, year, and what’s included.",
                        "Reply quickly — fast chat wins more deals.",
                        "Meet in public places and follow safety tips.",
                    ]}
                />
                <p>
                    Full checklist:{" "}
                    <Link href="/safety" className="font-bold text-primary hover:underline">
                        Safety Tips
                    </Link>
                    .
                </p>
            </SupportSection>

            <SupportSection id="why" number={5} title="Why DealPokket for second-hand selling">
                <SupportList
                    items={[
                        "Free ad posting for everyday used goods.",
                        "Local-first feeds so nearby buyers see your listing.",
                        "In-app chat that keeps early conversations on-platform.",
                        "A cleaner alternative to crowded general classifieds.",
                    ]}
                />
                <p>
                    Comparing platforms? Read our{" "}
                    <Link
                        href="/free-classifieds"
                        className="font-bold text-primary hover:underline"
                    >
                        free classifieds guide
                    </Link>
                    .
                </p>
            </SupportSection>

            <SupportSection id="start" number={6} title="Start buying or selling today">
                <p>
                    Open the homepage, pick your city, and explore fresh second-hand deals — or
                    post your first free ad in a few minutes.
                </p>
                <p>
                    <Link href="/" className="font-bold text-primary hover:underline">
                        Go to DealPokket homepage →
                    </Link>
                </p>
            </SupportSection>
        </SupportShell>
    );
}
