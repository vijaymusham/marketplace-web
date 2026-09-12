"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Mail, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { Field } from "@/constant/helper/TextField";
import { inputClassName } from "@/constant/helper/classesHelper";
import SupportShell, { SupportSection, SupportTile } from "./SupportShell";
import GlowButton from "@/components/ui/GlowButton";

const LINKS = [
    { id: "channels", label: "Contact Channels" },
    { id: "hours", label: "Support Hours" },
    { id: "form", label: "Send a Message" },
    { id: "office", label: "Office" },
];

const TOPICS = [
    "Account / login",
    "Listing issue",
    "Safety concern",
    "Payment / scam report",
    "Feedback",
    "Other",
];

export default function ContactUsView() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [topic, setTopic] = useState(TOPICS[0]);
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }
        setSubmitting(true);
        window.setTimeout(() => {
            setSubmitting(false);
            setSent(true);
            toast.success("Message sent — we’ll reply soon.");
            setName("");
            setEmail("");
            setTopic(TOPICS[0]);
            setMessage("");
        }, 600);
    }

    return (
        <SupportShell
            eyebrow="Contact"
            title="We’re here"
            titleAccent="to help."
            description="Reach DealPokket support by email or the form below. We typically reply within one business day."
            lastUpdated="July 23, 2026"
            links={LINKS}
        >
            <SupportSection id="channels" number={1} title="Contact Channels">
                <div className="grid gap-3 sm:grid-cols-2">
                    <SupportTile
                        icon={Mail}
                        title="Email"
                        detail="dealpokket@gmail.com"
                        href="mailto:dealpokket@gmail.com"
                    />
                    <SupportTile
                        icon={MapPin}
                        title="HQ"
                        detail="Mumbai, India"
                        href="#office"
                    />
                </div>
            </SupportSection>

            <SupportSection id="hours" number={2} title="Support Hours">
                <div className="rounded-[1.25rem] bg-[#f3f4f8] px-4 py-4 sm:px-5 sm:py-5">
                    <p className="text-sm font-extrabold text-slate-900 sm:text-[15px]">
                        Mon – Sat · 9:00 AM – 7:00 PM IST
                    </p>
                    <p className="mt-2 text-sm leading-relaxed font-medium text-slate-500">
                        Safety and scam reports are prioritized. Outside these hours, email us and
                        we’ll follow up on the next business day.
                    </p>
                </div>
            </SupportSection>

            <SupportSection id="form" number={3} title="Send a Message">
                {sent ? (
                    <div className="flex items-start gap-3 rounded-[1.25rem] bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-800 sm:px-5">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                        <div>
                            <p>Thanks — your message is in.</p>
                            <button
                                type="button"
                                onClick={() => setSent(false)}
                                className="mt-2 cursor-pointer font-bold text-primary hover:underline"
                            >
                                Send another message
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
                        <Field label="Full name" required>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputClassName}
                                placeholder="Your name"
                                autoComplete="name"
                            />
                        </Field>
                        <Field label="Email" required>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClassName}
                                placeholder="you@email.com"
                                autoComplete="email"
                            />
                        </Field>
                        <Field label="Topic" className="sm:col-span-2">
                            <select
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className={inputClassName}
                            >
                                {TOPICS.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Message" required className="sm:col-span-2">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className={`${inputClassName} min-h-32 resize-y`}
                                placeholder="Tell us what happened…"
                                rows={5}
                            />
                        </Field>
                        <div className="sm:col-span-2">
                            <GlowButton
                                type="submit"
                                disabled={submitting}
                                className="w-full sm:w-auto"
                                size="lg"
                            >
                                {submitting ? "Sending…" : "Send message"}
                            </GlowButton>
                        </div>
                    </form>
                )}
            </SupportSection>

            <SupportSection id="office" number={4} title="Office">
                <p>
                    DealPokket operates from Mumbai, India. For partnership or press inquiries,
                    email{" "}
                    <a
                        href="mailto:dealpokket@gmail.com"
                        className="font-bold text-primary hover:underline"
                    >
                        dealpokket@gmail.com
                    </a>
                    .
                </p>
            </SupportSection>
        </SupportShell>
    );
}
