import Link from "next/link";
import SupportShell, { SupportList, SupportSection } from "./SupportShell";

const LINKS = [
    { id: "meetups", label: "Safe Meetups" },
    { id: "payments", label: "Payments" },
    { id: "messaging", label: "Messaging" },
    { id: "red-flags", label: "Red Flags" },
    { id: "reporting", label: "Reporting" },
    { id: "after-deal", label: "After the Deal" },
];

export default function SafetyTipsView() {
    return (
        <SupportShell
            eyebrow="Safety Tips"
            title="Stay Safe on Every Deal"
            description="Simple habits that protect buyers and sellers — from first message to final handshake. Trust your instincts and keep deals transparent."
            lastUpdated="July 23, 2026"
            links={LINKS}
        >
            <SupportSection id="meetups" number={1} title="Safe Meetups">
                <SupportList
                    items={[
                        "Meet in busy public places — cafés, mall atriums, or police station parking zones.",
                        "Prefer daytime meetups and tell a friend where you’re going.",
                        "Bring someone with you for high-value items like phones, bikes, or electronics.",
                        "Never invite strangers to your home for the first meeting.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="payments" number={2} title="Payments">
                <SupportList
                    items={[
                        "Inspect the item fully before you pay.",
                        "Avoid advance payments to unknown sellers, especially via gift cards or crypto.",
                        "Use traceable methods you trust; cash is fine for local deals when both sides agree.",
                        "Never share UPI PINs, OTPs, or net-banking passwords.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="messaging" number={3} title="Messaging">
                <SupportList
                    items={[
                        "Keep conversations on DealMarket chat whenever possible.",
                        "Be wary of users who push you off-platform immediately.",
                        "Don’t click suspicious links sent in chat.",
                        "Screenshot important agreements about price and condition.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="red-flags" number={4} title="Red Flags">
                <SupportList
                    items={[
                        "Prices far below market with pressure to “decide now.”",
                        "Sellers who refuse video calls or in-person inspection.",
                        "Buyers who ask for shipping first with vague payment proof.",
                        "Requests for your ID images, OTPs, or remote access to your phone.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="reporting" number={5} title="Reporting">
                <p>
                    If something feels wrong, stop the deal and report the listing or user.
                    Our team reviews reports for spam, scams, and prohibited items. For
                    urgent danger, contact local authorities first, then let us know at{" "}
                    <a
                        href="mailto:safety@dealmarket.in"
                        className="font-bold text-primary hover:underline"
                    >
                        safety@dealmarket.in
                    </a>
                    .
                </p>
            </SupportSection>

            <SupportSection id="after-deal" number={6} title="After the Deal">
                <SupportList
                    items={[
                        "Mark your ad as sold so other buyers don’t keep messaging.",
                        "Leave clear notes if anything was agreed beyond the listing.",
                        "Review our Help Center if a dispute comes up after meetup.",
                    ]}
                />
                <p>
                    More guidance lives in{" "}
                    <Link href="/help" className="font-bold text-primary hover:underline">
                        Help & Support
                    </Link>
                    .
                </p>
            </SupportSection>
        </SupportShell>
    );
}
