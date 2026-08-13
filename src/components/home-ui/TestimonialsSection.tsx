"use client";

import { Reveal } from "@/components/animations/Motion";

type Testimonial = {
    quote: string;
    name: string;
    detail: string;
    initials: string;
};

const ROW_ONE: Testimonial[] = [
    {
        quote:
            "DealPokket makes finding great local deals so easy. I browse nearby listings in minutes and get exactly what I need.",
        name: "Joao M.",
        detail: "Startup Founder",
        initials: "JM",
    },
    {
        quote:
            "Our team needed furniture fast, and DealPokket delivered. Smooth process — every item was exactly what we needed.",
        name: "Sarah K.",
        detail: "Operations Lead",
        initials: "SK",
    },
    {
        quote:
            "I love the variety of listings. Whether gadgets or home essentials, DealPokket always has the right option nearby.",
        name: "Priya R.",
        detail: "Product Designer",
        initials: "PR",
    },
    {
        quote:
            "Sold my bike in two days. Buyers messaged quickly, and the whole experience felt safe and straightforward.",
        name: "Arjun S.",
        detail: "Freelance Photographer",
        initials: "AS",
    },
];

const ROW_TWO: Testimonial[] = [
    {
        quote:
            "Finally a marketplace that feels local. Great finds near me, clear photos, and sellers who actually respond.",
        name: "Maya L.",
        detail: "Marketing Manager",
        initials: "ML",
    },
    {
        quote:
            "Posted my first ad and got serious interest the same evening. Clean UI, fair prices — how classifieds should work.",
        name: "Dev P.",
        detail: "Software Engineer",
        initials: "DP",
    },
    {
        quote:
            "Moved apartments and furnished everything through DealPokket. Saved money and time without the usual marketplace stress.",
        name: "Nina T.",
        detail: "UX Researcher",
        initials: "NT",
    },
    {
        quote:
            "Reliable buyers, clear listings, and zero drama. I've recommended DealPokket to half my office already.",
        name: "Omar H.",
        detail: "Sales Director",
        initials: "OH",
    },
];

function TestimonialCard({ item }: { item: Testimonial }) {
    return (
        <article className="relative flex h-[11.5rem] w-[min(85vw,20.5rem)] shrink-0 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:h-[12.5rem] sm:w-80 sm:rounded-[1.25rem] sm:p-6 md:h-[13rem] md:w-88">
            <span
                className="pointer-events-none absolute top-4 right-5 font-heading text-3xl leading-none text-primary/80 sm:top-5 sm:right-6 sm:text-4xl"
                aria-hidden
            >
                &ldquo;
            </span>
            <p className="line-clamp-4 flex-1 pr-8 text-[15px] leading-relaxed text-slate-600 sm:text-base sm:leading-[1.6]">
                {item.quote}
            </p>
            <div className="mt-auto flex items-center gap-3 pt-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-xs font-extrabold tracking-wide text-primary sm:size-11 sm:text-[13px]">
                    {item.initials}
                </div>
                <div className="min-w-0">
                    <p className="truncate font-heading text-sm font-bold tracking-tight text-slate-900 sm:text-[15px]">
                        {item.name}
                    </p>
                    <p className="truncate text-xs text-slate-400 sm:text-[13px]">{item.detail}</p>
                </div>
            </div>
        </article>
    );
}

function MarqueeRow({
    items,
    reverse = false,
    duration = "40s",
}: {
    items: Testimonial[];
    reverse?: boolean;
    duration?: string;
}) {
    const trackClass = reverse ? "marquee-track-reverse" : "marquee-track";

    return (
        <div
            className="group/marquee relative overflow-hidden"
            style={{
                maskImage:
                    "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
                WebkitMaskImage:
                    "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
            }}
        >
            <div
                className={trackClass}
                style={{ animationDuration: duration }}
            >
                {[0, 1].map((copy) => (
                    <div
                        key={copy}
                        className="flex items-stretch gap-4 pr-4 sm:gap-5 sm:pr-5"
                        aria-hidden={copy === 1}
                    >
                        {items.map((item) => (
                            <TestimonialCard key={`${copy}-${item.initials}`} item={item} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function TestimonialsSection() {
    return (
        <section className="relative overflow-hidden bg-slate-50/70 py-14 sm:py-16 lg:py-20">
            <Reveal y={18} delay={0.06}>
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-12">
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase sm:text-xs">
                        Social Proof
                    </p>
                    <h2 className="mt-3 font-heading text-[1.65rem] font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-[2.35rem] md:leading-[1.15]">
                        Feedback from buyers &{" "}
                        <span className="text-primary">sellers</span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
                        Real notes from people using DealPokket every day — scrolling by with
                        subtle motion so you can skim what locals are saying.
                    </p>
                </div>
            </Reveal>

            <div className="mt-10 flex flex-col gap-4 sm:mt-12 sm:gap-5 md:mt-14">
                <MarqueeRow items={ROW_ONE} duration="42s" />
                <MarqueeRow items={ROW_TWO} reverse duration="48s" />
            </div>
        </section>
    );
}
