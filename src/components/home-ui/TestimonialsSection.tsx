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

const ALL_TESTIMONIALS = [...ROW_ONE, ...ROW_TWO];

function TestimonialCard({ item }: { item: Testimonial }) {
    return (
        <article className="relative flex h-full flex-col rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:rounded-2xl sm:p-5 md:p-6">
            <span
                className="pointer-events-none absolute top-2.5 right-3 font-heading text-2xl leading-none text-primary/65 sm:top-4 sm:right-5 sm:text-4xl"
                aria-hidden
            >
                &ldquo;
            </span>
            <p className="pr-6 text-[12.5px] leading-relaxed text-slate-600 sm:pr-8 sm:text-[15px] sm:leading-[1.6]">
                {item.quote}
            </p>
            <div className="mt-3 flex items-center gap-2 sm:mt-5 sm:gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-[10px] font-extrabold tracking-wide text-primary sm:size-11 sm:text-[13px]">
                    {item.initials}
                </div>
                <div className="min-w-0">
                    <p className="truncate font-heading text-xs font-bold tracking-tight text-slate-900 sm:text-[15px]">
                        {item.name}
                    </p>
                    <p className="truncate text-[10px] text-slate-400 sm:text-[13px]">{item.detail}</p>
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
                    "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
                WebkitMaskImage:
                    "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
            }}
        >
            <div className={trackClass} style={{ animationDuration: duration }}>
                {[0, 1].map((copy) => (
                    <div
                        key={copy}
                        className="flex items-stretch gap-4 pr-4 sm:gap-5 sm:pr-5"
                        aria-hidden={copy === 1}
                    >
                        {items.map((item) => (
                            <div
                                key={`${copy}-${item.initials}`}
                                className="w-[min(78vw,20.5rem)] shrink-0 sm:w-80 md:w-88"
                            >
                                <TestimonialCard item={item} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function TestimonialsSection() {
    return (
        <section className="relative overflow-hidden bg-slate-50/70 py-8 sm:py-16 lg:py-20">
            <Reveal y={18} delay={0.06}>
                <div className="mx-auto max-w-3xl px-5 text-center sm:px-6 lg:px-12">
                    <p className="text-[9px] font-semibold tracking-[0.16em] text-primary uppercase sm:text-xs sm:tracking-[0.18em]">
                        Social Proof
                    </p>
                    <h2 className="mt-1.5 text-balance font-heading text-[1.15rem] font-extrabold leading-snug tracking-tight text-slate-900 sm:mt-3 sm:text-3xl md:text-[2.35rem] md:leading-[1.15]">
                        Feedback from buyers &{" "}
                        <span className="text-primary">sellers</span>
                    </h2>
                    <p className="mx-auto mt-1.5 max-w-[17.5rem] text-pretty text-[12px] leading-relaxed text-slate-500 sm:mt-3 sm:max-w-xl sm:text-base">
                        Real notes from people using DealPokket every day.
                    </p>
                </div>
            </Reveal>

            <div
                className="relative mt-5 md:hidden"
                style={{
                    maskImage:
                        "linear-gradient(90deg, transparent, black 18px, black calc(100% - 36px), transparent)",
                    WebkitMaskImage:
                        "linear-gradient(90deg, transparent, black 18px, black calc(100% - 36px), transparent)",
                }}
            >
                <div
                    className="scrollbar-hide flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain px-5 pb-0.5"
                    aria-label="Customer testimonials"
                >
                    {ALL_TESTIMONIALS.map((item) => (
                        <div
                            key={item.initials}
                            className="w-[min(68vw,16.5rem)] shrink-0 snap-start"
                        >
                            <TestimonialCard item={item} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-10 hidden flex-col gap-5 sm:mt-12 md:mt-14 md:flex">
                <MarqueeRow items={ROW_TWO} duration="48s" />
            </div>
        </section>
    );
}
