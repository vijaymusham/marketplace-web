import Link from "next/link";
import SupportShell, { SupportList, SupportSection } from "./SupportShell";

const LINKS = [
    { id: "overview", label: "Overview" },
    { id: "collect", label: "Information We Collect" },
    { id: "use", label: "How We Use Your Information" },
    { id: "cookies", label: "Cookies" },
    { id: "sharing", label: "Sharing & Disclosure" },
    { id: "security", label: "Data Security" },
    { id: "rights", label: "Your Rights" },
    { id: "contact", label: "Contact" },
];

export default function PrivacyView() {
    return (
        <SupportShell
            eyebrow="Privacy Policy"
            title="Your data,"
            titleAccent="handled with care."
            description="How DealPokket collects, uses, and protects your information when you browse, buy, or sell on our marketplace."
            lastUpdated="July 23, 2026"
            links={LINKS}
        >
            <SupportSection id="overview" number={1} title="Overview">
                <p>
                    DealPokket is a local marketplace where people buy and sell near them. We only
                    collect what we need to run accounts, listings, messaging, and safety features —
                    and we never sell your personal data.
                </p>
            </SupportSection>

            <SupportSection id="collect" number={2} title="Information We Collect">
                <SupportList
                    items={[
                        "Account details such as name, phone number, email, and profile photo.",
                        "Listing content you post, including photos, prices, and location labels.",
                        "Device and usage data like IP address, browser type, and app activity.",
                        "Messages exchanged through DealPokket chat (to provide the service and enforce safety rules).",
                        "Support requests and feedback you send to our team.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="use" number={3} title="How We Use Your Information">
                <SupportList
                    items={[
                        "Create and manage your account, listings, and wishlist.",
                        "Show relevant local ads and improve search recommendations.",
                        "Enable buyer–seller chat and notifications.",
                        "Detect fraud, spam, and policy violations.",
                        "Respond to support tickets and improve product quality.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="cookies" number={4} title="Cookies">
                <p>
                    We use cookies and similar technologies to keep you signed in, remember
                    preferences, measure performance, and prevent abuse. You can control cookies
                    through your browser settings; some features may not work if essential cookies
                    are disabled.
                </p>
            </SupportSection>

            <SupportSection id="sharing" number={5} title="Sharing & Disclosure">
                <SupportList
                    items={[
                        "With other users: public listing details and your display name.",
                        "With service providers who help us host, analyze, or secure the platform under strict contracts.",
                        "When required by law, legal process, or to protect users from harm.",
                        "During a merger, acquisition, or asset transfer, with notice where required.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="security" number={6} title="Data Security">
                <p>
                    We use industry-standard safeguards such as encryption in transit, access
                    controls, and monitoring. No method of transmission is 100% secure — please
                    protect your OTP and never share passwords or bank details in chat.
                </p>
            </SupportSection>

            <SupportSection id="rights" number={7} title="Your Rights">
                <SupportList
                    items={[
                        "Access or update your profile information from account settings.",
                        "Request deletion of your account and associated personal data.",
                        "Opt out of non-essential marketing communications.",
                        "Raise privacy questions with our support team at any time.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="contact" number={8} title="Contact">
                <p>
                    Questions about this policy? Email{" "}
                    <a
                        href="mailto:privacy@DealPokket.in"
                        className="font-bold text-primary hover:underline"
                    >
                        privacy@DealPokket.in
                    </a>{" "}
                    or visit our{" "}
                    <Link href="/contact" className="font-bold text-primary hover:underline">
                        Contact Us
                    </Link>{" "}
                    page.
                </p>
            </SupportSection>
        </SupportShell>
    );
}
