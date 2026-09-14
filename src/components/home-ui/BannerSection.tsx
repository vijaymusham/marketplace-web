"use client";

import Image from "next/image";
import { Reveal } from "@/components/animations/Motion";

export default function BannerSection() {
    return (
        <section className="mx-auto px-3 pt-3 pb-1 sm:px-6 sm:pt-5 sm:pb-2 lg:px-12">
            <Reveal y={20}>
                <div className="relative isolate w-full overflow-hidden rounded-xl aspect-2/3 sm:aspect-21/8 sm:rounded-2xl lg:aspect-11/4 lg:rounded-3xl">
                    <Image
                        src="/comingsoon-mobile.png"
                        alt="DealPokket — Buy & Sell Anything. Coming soon."
                        fill
                        sizes="100vw"
                        quality={75}
                        loading="lazy"
                        className="object-cover object-center sm:hidden"
                    />
                    <Image
                        src="/comingsoon.png"
                        alt="DealPokket — Buy & Sell Anything. Coming soon."
                        fill
                        sizes="100vw"
                        quality={75}
                        loading="lazy"
                        className="hidden object-cover object-center sm:block"
                    />
                </div>
            </Reveal>
        </section>
    );
}
