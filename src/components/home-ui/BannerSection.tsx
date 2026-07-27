"use client";

import Image from "next/image";
import { Reveal } from "@/components/animations/Motion";

export default function BannerSection() {
    return (
        <section className="mx-auto max-w-7xl px-4  sm:px-6 pt-5 pb-2">
            <Reveal y={20}>
                <div className="relative isolate flex h-110 flex-col justify-end overflow-hidden rounded-3xl">
                    <Image
                        src="/comingsoon.jpg"
                        alt="Seller packing an order to ship"
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                    />
                </div>
            </Reveal>
        </section>
    );
}
