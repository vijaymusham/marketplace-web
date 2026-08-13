"use client";

import Image from "next/image";
import { Reveal } from "@/components/animations/Motion";

export default function BannerSection() {
    return (
        <section className="mx-auto px-3 pt-3 pb-1 sm:px-6 sm:pt-5 sm:pb-2 lg:px-12">
            <Reveal y={20}>
                <div className="relative isolate w-full overflow-hidden rounded-xl aspect-2/1 sm:aspect-21/8 sm:rounded-2xl lg:aspect-11/4 lg:rounded-3xl">
                    <Image
                        src="/comingsoon.jpg"
                        alt="Seller packing an order to ship"
                        fill
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                </div>
            </Reveal>
        </section>
    );
}
