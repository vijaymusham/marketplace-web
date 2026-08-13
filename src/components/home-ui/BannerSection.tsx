"use client";

import Image from "next/image";
import { Reveal } from "@/components/animations/Motion";

export default function BannerSection() {
    return (
        <section className="mx-auto px-4 pt-5 pb-2 sm:px-6 lg:px-12">
            <Reveal y={20}>
                <div className="relative isolate flex h-56 flex-col justify-end overflow-hidden rounded-2xl sm:h-80 sm:rounded-3xl md:h-110">
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
