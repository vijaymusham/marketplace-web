import Link from "next/link";
import SupportShell, { SupportList, SupportSection } from "@/components/support/SupportShell";

const LINKS = [
    { id: "what", label: "What it means" },
    { id: "value", label: "Best value" },
    { id: "compare", label: "Vs OLX" },
    { id: "sell", label: "Sell easily" },
    { id: "categories", label: "What to sell" },
    { id: "faq", label: "Questions" },
];

const COMPARE = [
    {
        feature: "Who it is for",
        dealpokket: "Second-hand deals near you in India",
        olx: "Broad classifieds across many categories",
    },
    {
        feature: "Posting an ad",
        dealpokket: "Free",
        olx: "Check OLX for the current rules on your category",
    },
    {
        feature: "How buyers find you",
        dealpokket: "Nearby listings first",
        olx: "Large national classifieds audience",
    },
    {
        feature: "Chat",
        dealpokket: "Built into Deal Pokket",
        olx: "OLX chat",
    },
    {
        feature: "Keeping the sale value",
        dealpokket: "You set the price and meet locally",
        olx: "You negotiate on OLX; confirm any fees there",
    },
] as const;

const CATEGORIES = [
    { name: "Mobiles", href: "/category/mobiles-and-tablets" },
    { name: "Bikes", href: "/category/bikes" },
    { name: "Furniture", href: "/category/furniture" },
    { name: "Electronics", href: "/category/electronics" },
    { name: "Fashion", href: "/category/fashion" },
    { name: "Home", href: "/category/home-and-living" },
];

export default function OlxAlternativeView() {
    return (
        <SupportShell
            eyebrow="OLX alternative"
            title="Sell second hand"
            titleAccent="easily, for the best value"
            description="Deal Pokket is a free second-hand marketplace in India. Post an ad, reach buyers near you, and keep the price you agree — without a crowded general classifieds feed."
            lastUpdated="October 2026"
            links={LINKS}
        >
            <SupportSection id="what" number={1} title="What people mean by an OLX alternative">
                <p>
                    An <strong>OLX alternative</strong> is a place to buy and sell used goods when
                    you want a simpler local marketplace. People usually want three things: free
                    posting, buyers nearby, and a clear way to chat before they meet.
                </p>
                <p>
                    Deal Pokket is built for that. It is a{" "}
                    <Link href="/second-hand" className="font-bold text-primary hover:underline">
                        second hand marketplace
                    </Link>{" "}
                    for mobiles, bikes, furniture, electronics, and everyday home items across
                    Indian cities.
                </p>
            </SupportSection>

            <SupportSection id="value" number={2} title="Best value means you keep the deal">
                <p>
                    Best value on a second-hand sale is the price you and the buyer agree, minus
                    hassle. Deal Pokket does not take a cut of a local meetup. You set the price,
                    mark it negotiable if you want, and talk it through in chat.
                </p>
                <SupportList
                    items={[
                        "Post the ad free, with photos and a clear price.",
                        "Show condition honestly so buyers trust the number.",
                        "Stay local, so you are not paying to ship a sofa or a bike.",
                        "Reply fast. A fair price plus a quick answer closes more deals.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="compare" number={3} title="Deal Pokket vs OLX">
                <p>
                    OLX is a large classifieds site. Deal Pokket is a smaller, local-first
                    marketplace for everyday second-hand goods. Use this as a starting comparison,
                    then confirm anything that can change — especially fees — on OLX itself.
                </p>
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                            <tr>
                                <th className="px-4 py-3 font-bold">Feature</th>
                                <th className="px-4 py-3 font-bold text-primary">Deal Pokket</th>
                                <th className="px-4 py-3 font-bold">OLX</th>
                            </tr>
                        </thead>
                        <tbody>
                            {COMPARE.map((row) => (
                                <tr key={row.feature} className="border-t border-slate-100">
                                    <td className="px-4 py-3 font-semibold text-slate-800">
                                        {row.feature}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {row.dealpokket}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{row.olx}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-slate-400">
                    Deal Pokket is our marketplace. OLX details are a summary for comparison, not a
                    claim about OLX’s current product or pricing.
                </p>
            </SupportSection>

            <SupportSection id="sell" number={4} title="How to sell easily on Deal Pokket">
                <SupportList
                    items={[
                        "Tap Sell and sign in.",
                        "Pick a category, add photos, and write the model and condition.",
                        "Set a fair price and your city so nearby buyers see it.",
                        "Chat in the app, meet in a public place, and hand over the item after you have checked the payment.",
                    ]}
                />
                <p>
                    Read the{" "}
                    <Link href="/safety" className="font-bold text-primary hover:underline">
                        safety tips
                    </Link>{" "}
                    before you meet, and the{" "}
                    <Link href="/free-classifieds" className="font-bold text-primary hover:underline">
                        free classifieds guide
                    </Link>{" "}
                    if you are also comparing Quikr or Facebook Marketplace.
                </p>
            </SupportSection>

            <SupportSection id="categories" number={5} title="Second-hand categories that sell well">
                <p>
                    Start with items people search for locally. Clear photos and a real price beat a
                    vague “best offer” title.
                </p>
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

            <SupportSection id="faq" number={6} title="Questions about using Deal Pokket instead of OLX">
                <div className="space-y-4">
                    <div>
                        <h3 className="font-extrabold text-slate-900">
                            Is Deal Pokket an OLX alternative?
                        </h3>
                        <p className="mt-1">
                            Yes, for local second-hand buying and selling in India. It is free to
                            post, shows nearby listings first, and includes in-app chat.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-900">
                            Can I sell second-hand items easily?
                        </h3>
                        <p className="mt-1">
                            Post photos, a price, and your city. Buyers nearby can message you from
                            the listing. Most everyday goods — phones, bikes, furniture — move
                            faster when the details are specific.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-900">
                            How do I get the best value?
                        </h3>
                        <p className="mt-1">
                            Price from condition and age, say what is included, and meet locally so
                            you are not paying to ship. Deal Pokket does not take a commission on
                            that meetup.
                        </p>
                    </div>
                </div>
                <p>
                    <Link href="/" className="font-bold text-primary hover:underline">
                        Browse deals on Deal Pokket →
                    </Link>
                </p>
            </SupportSection>
        </SupportShell>
    );
}
