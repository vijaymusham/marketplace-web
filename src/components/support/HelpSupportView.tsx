"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Mail, MessageCircleMore, Phone } from "lucide-react";
import SupportShell, { SupportList, SupportSection, SupportTile } from "./SupportShell";

const LINKS = [
    { id: "getting-started", label: "Getting Started" },
    { id: "selling", label: "Selling Tips" },
    { id: "buying", label: "Buying Tips" },
    { id: "account", label: "Account & Login" },
    { id: "faq", label: "FAQ" },
    { id: "reach-us", label: "Reach Us" },
];

const FAQS = [
    {
        q: "How do I post an ad?",
        a: "Tap Sell Now, choose a category, add photos and details, then submit. Your listing goes live after a quick review.",
    },
    {
        q: "How do I edit or mark an ad as sold?",
        a: "Open My Ads from your account menu. From there you can review status, views, and mark a listing as sold when the deal is done.",
    },
    {
        q: "Is DealPokket free to use?",
        a: "Browsing and posting basic ads is free. Optional promotions may be offered later to boost visibility.",
    },
    {
        q: "I can’t sign in — what should I do?",
        a: "Check your phone number and OTP. If the problem continues, clear site data or contact support with the number you used to register.",
    },
];

export default function HelpSupportView() {
    const [open, setOpen] = useState(0);

    return (
        <SupportShell
            eyebrow="Help Center"
            title="Help When You Need It"
            description="Quick answers for buying, selling, and managing your DealPokket account — plus ways to reach our support team."
            lastUpdated="July 23, 2026"
            links={LINKS}
        >
            <SupportSection id="getting-started" number={1} title="Getting Started">
                <SupportList
                    items={[
                        "Create an account with your phone number and verify via OTP.",
                        "Set your city so you see local listings first.",
                        "Browse categories or search for what you need.",
                        "Tap Sell Now whenever you’re ready to list something.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="selling" number={2} title="Selling Tips">
                <SupportList
                    items={[
                        "Use bright, clear photos from multiple angles.",
                        "Write an honest title and mention brand, age, and condition.",
                        "Price competitively by checking similar local ads.",
                        "Reply to buyers quickly and keep chat on DealPokket.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="buying" number={3} title="Buying Tips">
                <SupportList
                    items={[
                        "Read the full description and ask questions before meeting.",
                        "Prefer public meetup spots and inspect the item in person.",
                        "Never share OTPs, PINs, or bank details in chat.",
                        "Report suspicious listings from the listing or chat screen.",
                    ]}
                />
            </SupportSection>

            <SupportSection id="account" number={4} title="Account & Login">
                <p>
                    Most account issues are fixed by retrying the OTP or signing in again
                    with the same phone number. If your number changed, contact support so we
                    can help recover access securely.
                </p>
            </SupportSection>

            <SupportSection id="faq" number={5} title="FAQ">
                <div className="flex flex-col gap-2.5 sm:gap-3">
                    {FAQS.map((item, i) => {
                        const isOpen = open === i;
                        return (
                            <div
                                key={item.q}
                                className={`overflow-hidden rounded-2xl transition-colors duration-200 ${isOpen ? "bg-primary/8" : "bg-[#f3f4f8]"
                                    }`}
                            >
                                <button
                                    type="button"
                                    aria-expanded={isOpen}
                                    onClick={() => setOpen(isOpen ? -1 : i)}
                                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5 sm:py-4"
                                >
                                    <span
                                        className={`min-w-0 flex-1 text-sm font-bold sm:text-[15px] ${isOpen ? "text-primary" : "text-slate-800"
                                            }`}
                                    >
                                        {item.q}
                                    </span>
                                    <span
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen
                                                ? "bg-primary text-white"
                                                : "bg-white text-slate-400"
                                            }`}
                                    >
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </span>
                                </button>
                                <div
                                    className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                        }`}
                                >
                                    <div className="min-h-0 overflow-hidden">
                                        <p className="px-4 pb-4 text-sm leading-relaxed font-medium text-slate-500 sm:px-5 sm:pb-5">
                                            {item.a}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </SupportSection>

            <SupportSection id="reach-us" number={6} title="Reach Us">
                <div className="grid gap-3 sm:grid-cols-3">
                    <SupportTile
                        icon={Mail}
                        title="Email"
                        detail="support@DealPokket.in"
                        href="mailto:support@DealPokket.in"
                    />
                    <SupportTile
                        icon={Phone}
                        title="Phone"
                        detail="+91 1800-123-4567"
                        href="tel:+9118001234567"
                    />
                    <SupportTile
                        icon={MessageCircleMore}
                        title="Chat"
                        detail="Message sellers"
                        href="/chats"
                    />
                </div>
                <p className="pt-1">
                    Prefer a form? Head to{" "}
                    <Link href="/contact" className="font-bold text-primary hover:underline">
                        Contact Us
                    </Link>
                    .
                </p>
            </SupportSection>
        </SupportShell>
    );
}
