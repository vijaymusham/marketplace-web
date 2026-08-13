import Image from "next/image";
import { ArrowRight } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";

export default function ListingsEmpty({
    title = "Oops! No deals found",
    description = "We couldn’t find any deals that match this view. Try another category or city, or check back soon — fresh listings go live every day.",
    ctaHref = "/",
    ctaLabel = "Browse all deals",
}: {
    title?: string;
    description?: string;
    ctaHref?: string;
    ctaLabel?: string;
}) {
    return (
        <section className="mx-auto w-full max-w-4xl px-2 py-6 text-center sm:px-4 sm:py-8 md:py-10">
            <div className="relative mx-auto aspect-video w-full overflow-hidden rounded-2xl bg-[#fff] sm:rounded-3xl">
                <Image
                    src="/image.png"
                    alt=""
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(min-width: 896px) 896px, 100vw"
                />
            </div>

            <h2 className="mt-7 font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:mt-8 sm:text-3xl md:text-[2rem]">
                {title}
            </h2>

            <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed font-medium text-slate-500 sm:mt-3 sm:text-[15px]">
                {description}
            </p>

            <GlowButton href={ctaHref} className="mt-6 sm:mt-7" size="lg">
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
            </GlowButton>
        </section>
    );
}
