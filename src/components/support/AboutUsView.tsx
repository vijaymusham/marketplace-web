import Link from "next/link";
import SupportShell, { SupportList, SupportSection } from "./SupportShell";

const LINKS = [
    { id: "mission", label: "Our Mission" },
    { id: "what-we-do", label: "What We Do" },
    { id: "why", label: "Why DealPokket" },
    { id: "community", label: "Community" },
    { id: "values", label: "Values" },
    { id: "connect", label: "Connect" },
];

export default function AboutUsView() {
    return (
        <SupportShell
            eyebrow="About Us"
            title="Local deals,"
            titleAccent="made simple."
            description="DealPokket is a marketplace for everyday buys and sells near you — built for speed, trust, and real conversations."
            lastUpdated="July 23, 2026"
            links={LINKS}
        >
            <SupportSection id="mission" number={1} title="Our Mission">
                <p>
                    We help people turn unused stuff into someone else’s next find — without
                    complicated shipping, heavy fees, or endless scrolling. Buy and sell locally,
                    chat safely, and close deals with confidence.
                </p>
            </SupportSection>

            <SupportSection id="what-we-do" number={2} title="What We Do">
                <SupportList
                    items={[
                        "Show local listings first so you discover deals near you.",
                        "Make posting free and fast with photos, details, and categories.",
                        "Keep buyers and sellers connected through in-app chat.",
                        "Surface safety tips and reporting tools when something feels off.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="why" number={3} title="Why DealPokket">
                <SupportList
                    items={[
                        "Built for Indian cities — local first, not global clutter.",
                        "Clean browsing experience on mobile and desktop.",
                        "OTP login that keeps accounts simple and secure.",
                        "A growing community of everyday buyers and sellers.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="community" number={4} title="Community">
                <p>
                    Every listing is a story between neighbors. We design DealPokket so good
                    people can find each other quickly — and so bad actors have fewer places to
                    hide. Honesty in photos, clear pricing, and respectful chat keep the
                    marketplace healthy for everyone.
                </p>
            </SupportSection>

            <SupportSection id="values" number={5} title="Values">
                <SupportList
                    items={[
                        "Clarity — say what the product is, what it costs, and where to meet.",
                        "Safety — public meetups, careful payments, and report tools that matter.",
                        "Speed — post in minutes, reply fast, close the deal.",
                        "Respect — treat every buyer and seller like a neighbor.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="connect" number={6} title="Connect">
                <p>
                    Questions, partnerships, or feedback? Visit{" "}
                    <Link href="/contact" className="font-bold text-primary hover:underline">
                        Contact Us
                    </Link>{" "}
                    or explore{" "}
                    <Link href="/help" className="font-bold text-primary hover:underline">
                        Help & Support
                    </Link>
                    . Want safer deals? Read our{" "}
                    <Link href="/safety" className="font-bold text-primary hover:underline">
                        Safety Tips
                    </Link>
                    .
                </p>
            </SupportSection>
        </SupportShell>
    );
}
