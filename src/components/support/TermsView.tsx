import SupportShell, { SupportList, SupportSection } from "./SupportShell";

const LINKS = [
    { id: "acceptance", label: "Acceptance of Terms" },
    { id: "eligibility", label: "Eligibility" },
    { id: "accounts", label: "Accounts" },
    { id: "listings", label: "Listings & Conduct" },
    { id: "transactions", label: "Transactions" },
    { id: "prohibited", label: "Prohibited Items" },
    { id: "liability", label: "Limitation of Liability" },
    { id: "changes", label: "Changes" },
];

export default function TermsView() {
    return (
        <SupportShell
            eyebrow="Terms & Conditions"
            title="Terms That Keep Deals Fair"
            description="These Terms & Conditions govern your use of DealPokket. By creating an account or posting a listing, you agree to follow the rules below."
            lastUpdated="July 23, 2026"
            links={LINKS}
        >
            <SupportSection id="acceptance" number={1} title="Acceptance of Terms">
                <p>
                    Using DealPokket means you accept these Terms, our Privacy Policy, and
                    any community guidelines we publish. If you disagree, please do not use
                    the service.
                </p>
            </SupportSection>

            <SupportSection id="eligibility" number={2} title="Eligibility">
                <SupportList
                    items={[
                        "You must be at least 18 years old to create an account.",
                        "You must provide accurate registration details.",
                        "One person should maintain only one active personal account unless we approve otherwise.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="accounts" number={3} title="Accounts">
                <p>
                    You are responsible for activity under your account, including securing
                    your phone and OTP. Notify us immediately if you suspect unauthorized
                    access. We may suspend accounts that violate these Terms or harm other
                    users.
                </p>
            </SupportSection>

            <SupportSection id="listings" number={4} title="Listings & Conduct">
                <SupportList
                    items={[
                        "List only items you own and have the right to sell.",
                        "Use clear photos and honest descriptions of condition and price.",
                        "Do not harass, spam, or mislead other users in chat or listings.",
                        "Remove or mark sold items promptly after a deal closes.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="transactions" number={5} title="Transactions">
                <p>
                    DealPokket connects buyers and sellers but is not a party to most deals.
                    Payment, meetup, inspection, and delivery arrangements are between users.
                    Always meet safely and verify items before paying.
                </p>
            </SupportSection>

            <SupportSection id="prohibited" number={6} title="Prohibited Items">
                <SupportList
                    items={[
                        "Illegal goods, counterfeit products, and stolen property.",
                        "Weapons, explosives, and hazardous materials.",
                        "Drugs, prescription medicines without authorization, and related paraphernalia.",
                        "Adult content, hate material, and anything that exploits minors.",
                        "Financial instruments, lottery tickets, and highly regulated items we disallow.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="liability" number={7} title="Limitation of Liability">
                <p>
                    To the fullest extent permitted by law, DealPokket is not liable for
                    indirect, incidental, or consequential damages arising from deals between
                    users, listing content, or temporary service interruptions. Our total
                    liability for any claim related to the service is limited to amounts you
                    paid us (if any) in the 3 months before the claim.
                </p>
            </SupportSection>

            <SupportSection id="changes" number={8} title="Changes">
                <p>
                    We may update these Terms from time to time. Continued use after changes
                    take effect means you accept the revised Terms. Material updates will be
                    reflected with a new “Last updated” date on this page.
                </p>
            </SupportSection>
        </SupportShell>
    );
}
