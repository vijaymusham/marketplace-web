import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";

export default function WishlistEmpty() {
    return (
        <section className="relative mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6 sm:py-20">
            <Link
                href="/"
                className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 transition-colors hover:text-primary sm:hidden"
            >
                <ArrowLeft className="h-4 w-4" strokeWidth={2.25} />
                Go back
            </Link>

            <div className="pointer-events-none absolute inset-x-8 top-10 -z-10 h-72 rounded-full bg-primary/8 blur-3xl sm:inset-x-24" />

            <div className="relative mb-6 h-36 w-36 sm:mb-8 sm:h-64 sm:w-64">
                <Image
                    src="/wishlist-empty.png"
                    alt=""
                    fill
                    priority
                    className="object-contain aspect-square"
                    sizes="256px"
                />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary sm:px-3.5 sm:py-1.5 sm:text-xs">
                <Heart className="h-3.5 w-3.5 fill-primary" />
                Nothing saved yet
            </span>

            <h1 className="mt-4 font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:mt-5 sm:text-4xl md:text-5xl">
                Your wishlist is waiting
            </h1>

            <p className="mt-3 max-w-md text-[13px] leading-relaxed font-medium text-slate-500 sm:mt-4 sm:text-[15px]">
                Heart the deals you love while browsing. They&apos;ll land here so you
                can compare prices and come back when you&apos;re ready to buy.
            </p>

            <GlowButton href="/" className="mt-6 sm:mt-8" size="lg">
                Explore deals
                <ArrowRight className="h-4 w-4" />
            </GlowButton>
        </section>
    );
}
