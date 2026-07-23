import type { Metadata } from "next";
import ContactUsView from "@/components/support/ContactUsView";

export const metadata: Metadata = {
    title: "Contact Us | Deal Market",
    description: "Contact DealMarket support by email, phone, or message form.",
};

export default function ContactPage() {
    return <ContactUsView />;
}
