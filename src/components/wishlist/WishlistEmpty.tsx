import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

export default function WishlistEmpty() {
    return (
        <section className="relative mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-20">
            <div className="pointer-events-none absolute inset-x-8 top-10 -z-10 h-72 rounded-full bg-primary/8 blur-3xl sm:inset-x-24" />

            <div className="relative mb-8 h-52 w-52 sm:h-64 sm:w-64">
                <Image
                    src="/wishlist-empty.png"
                    alt=""
                    fill
                    priority
                    className="object-contain"
                    sizes="256px"
                />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
                <Heart className="h-3.5 w-3.5 fill-primary" />
                Nothing saved yet
            </span>

            <h1 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Your wishlist is waiting
            </h1>

            <p className="mt-4 max-w-md text-sm leading-relaxed font-medium text-slate-500 sm:text-[15px]">
                Heart the deals you love while browsing. They&apos;ll land here so you
                can compare prices and come back when you&apos;re ready to buy.
            </p>

            <Link
                href="/"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white  transition-transform duration-200 hover:scale-[1.03] hover:bg-primary-hover active:scale-[0.98]"
            >
                Explore deals
                <ArrowRight className="h-4 w-4" />
            </Link>
        </section>
    );
}
