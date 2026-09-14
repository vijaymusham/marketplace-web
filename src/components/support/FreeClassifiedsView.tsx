import Link from "next/link";
import SupportShell, { SupportList, SupportSection } from "@/components/support/SupportShell";

const LINKS = [
    { id: "why", label: "Why DealPokket" },
    { id: "compare", label: "Comparison" },
    { id: "options", label: "Top options" },
    { id: "best-for", label: "Best for" },
    { id: "how", label: "How it works" },
    { id: "faq", label: "Common questions" },
];

const COMPARISON_ROWS = [
    {
        feature: "Free ad posting",
        dealpokket: "Yes",
        quikr: "Mixed",
        facebook: "Yes",
    },
    {
        feature: "Local-first discovery",
        dealpokket: "Nearby listings first",
        quikr: "City-wide feed",
        facebook: "Social graph",
    },
    {
        feature: "In-app chat",
        dealpokket: "Built-in",
        quikr: "Yes",
        facebook: "Messenger",
    },
    {
        feature: "Focus market",
        dealpokket: "Everyday second-hand India",
        quikr: "General classifieds",
        facebook: "Social marketplace",
    },
    {
        feature: "Clean mobile browsing",
        dealpokket: "Designed for speed",
        quikr: "Feature-heavy",
        facebook: "App-dependent",
    },
] as const;

const OPTIONS = [
    {
        name: "DealPokket",
        href: "/",
        bestFor: "Local second-hand deals without clutter",
        summary:
            "DealPokket is built for Indian cities — post free ads, browse nearby listings, and chat with buyers or sellers. Ideal if you want a simple free classifieds experience focused on everyday goods.",
        owned: true,
    },
    {
        name: "Facebook Marketplace",
        href: "https://www.facebook.com/marketplace",
        bestFor: "Reaching a large social audience",
        summary:
            "Strong reach if your buyers already use Facebook. Less specialised for dedicated classified browsing and depends on your social graph.",
        owned: false,
    },
    {
        name: "Quikr",
        href: "https://www.quikr.com",
        bestFor: "Broad classified categories",
        summary:
            "A long-running Indian classifieds platform covering furniture, electronics, services, and more. Useful as a secondary listing channel.",
        owned: false,
    },
] as const;

export default function FreeClassifiedsView() {
    return (
        <SupportShell
            eyebrow="Free Classifieds India"
            title="Free classified ads"
            titleAccent="near you"
            description="DealPokket is a free second-hand marketplace for buying and selling used items locally — built for Indian cities, free ad posting, and fast in-app chat."
            lastUpdated="September 2026"
            links={LINKS}
        >
            <SupportSection id="why" number={1} title="Why people choose free classifieds">
                <p>
                    Searchers looking for a <strong>free classified ads</strong> site,{" "}
                    <strong>free ad posting websites</strong>, or a{" "}
                    <strong>second-hand marketplace in India</strong> usually want safer chats,
                    fresher local listings, and posting without noise. DealPokket focuses on
                    second-hand deals near you — mobiles, bikes, furniture, electronics, and
                    everyday home goods.
                </p>
                <SupportList
                    items={[
                        "Post free classified ads in minutes with photos and clear details.",
                        "Discover second-hand products near your location first.",
                        "Message buyers and sellers in-app without sharing your number early.",
                        "Browse a cleaner marketplace experience on mobile and desktop.",
                    ]}
                />
                <p>
                    Ready to try it?{" "}
                    <Link href="/" className="font-bold text-primary hover:underline">
                        Browse DealPokket deals
                    </Link>{" "}
                    or start selling from the homepage sell flow.
                </p>
            </SupportSection>

            <SupportSection id="compare" number={2} title="DealPokket vs Quikr vs Facebook Marketplace">
                <p>
                    This comparison is for buyers and sellers in India comparing free classified
                    platforms. Feature notes are based on publicly known product positioning and may
                    change — always verify on each platform before you list.
                </p>
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                            <tr>
                                <th className="px-4 py-3 font-bold">Feature</th>
                                <th className="px-4 py-3 font-bold text-primary">DealPokket</th>
                                <th className="px-4 py-3 font-bold">Quikr</th>
                                <th className="px-4 py-3 font-bold">Facebook</th>
                            </tr>
                        </thead>
                        <tbody>
                            {COMPARISON_ROWS.map((row) => (
                                <tr key={row.feature} className="border-t border-slate-100">
                                    <td className="px-4 py-3 font-semibold text-slate-800">
                                        {row.feature}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {row.dealpokket}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{row.quikr}</td>
                                    <td className="px-4 py-3 text-slate-600">{row.facebook}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-slate-400">
                    Affiliation note: DealPokket is our marketplace. Competitor details are
                    summarised for research convenience, not as legal claims.
                </p>
            </SupportSection>

            <SupportSection id="options" number={3} title="Best free classifieds options in India (2026)">
                <p>
                    If you searched for the <strong>best free selling site</strong> or{" "}
                    <strong>free ad posting sites in India</strong>, these are the most common
                    options people evaluate:
                </p>
                <div className="space-y-4">
                    {OPTIONS.map((item) => (
                        <article
                            key={item.name}
                            className="rounded-2xl bg-[#f3f4f8] p-4 sm:p-5"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-heading text-base font-extrabold text-slate-900">
                                    {item.name}
                                </h3>
                                {item.owned ? (
                                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                                        Our pick
                                    </span>
                                ) : null}
                            </div>
                            <p className="mt-1 text-xs font-bold tracking-wide text-slate-400 uppercase">
                                Best for: {item.bestFor}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                {item.summary}
                            </p>
                            <Link
                                href={item.href}
                                className="mt-3 inline-flex text-sm font-bold text-primary hover:underline"
                                {...(item.owned
                                    ? {}
                                    : { target: "_blank", rel: "noopener noreferrer" })}
                            >
                                {item.owned ? "Open DealPokket →" : `Visit ${item.name} →`}
                            </Link>
                        </article>
                    ))}
                </div>
            </SupportSection>

            <SupportSection id="best-for" number={4} title="Which free classifieds site is best for you?">
                <SupportList
                    items={[
                        "Choose DealPokket for local second-hand buys and sells with free ads.",
                        "Choose Facebook Marketplace if your network already lives on Facebook.",
                        "Choose Quikr if you want another large general classifieds channel.",
                        "List on more than one site only when you can reply quickly on each.",
                    ]}
                />
                <p>
                    Selling furniture, bikes, or electronics? See our{" "}
                    <Link href="/second-hand" className="font-bold text-primary hover:underline">
                        second-hand marketplace guide
                    </Link>{" "}
                    for category tips and city browsing.
                </p>
            </SupportSection>

            <SupportSection id="how" number={5} title="How DealPokket free classifieds work">
                <SupportList
                    items={[
                        "Create your account with OTP login.",
                        "Post a free ad with photos, price, and location.",
                        "Buyers nearby discover your listing in local feeds.",
                        "Chat in-app, agree on a public meetup, and close the deal.",
                    ]}
                />
                <p>
                    Prefer safety first? Read our{" "}
                    <Link href="/safety" className="font-bold text-primary hover:underline">
                        safety tips
                    </Link>{" "}
                    before meeting anyone. Need help? Visit{" "}
                    <Link href="/help" className="font-bold text-primary hover:underline">
                        Help & Support
                    </Link>
                    .
                </p>
            </SupportSection>

            <SupportSection id="faq" number={6} title="Common questions about free classifieds">
                <div className="space-y-4">
                    <div>
                        <h3 className="font-extrabold text-slate-900">
                            What is the best free selling site in India?
                        </h3>
                        <p className="mt-1">
                            Look for free ad posting, local discovery, and responsive chat.
                            DealPokket is built around those three for everyday second-hand goods.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-900">
                            Are free classified ads safe?
                        </h3>
                        <p className="mt-1">
                            Meet in public places, verify items in person, and keep early chat
                            on-platform. Follow DealPokket safety tips before any meetup.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-900">
                            Can I post free ads for used phones and bikes?
                        </h3>
                        <p className="mt-1">
                            Yes. DealPokket supports everyday second-hand categories including
                            mobiles, bikes, furniture, electronics, and home goods.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-900">
                            How is DealPokket different from other marketplaces?
                        </h3>
                        <p className="mt-1">
                            DealPokket prioritises local-first discovery, free posting, and a
                            cleaner browse experience for Indian cities — without cluttered feeds.
                        </p>
                    </div>
                </div>
            </SupportSection>
        </SupportShell>
    );
}
