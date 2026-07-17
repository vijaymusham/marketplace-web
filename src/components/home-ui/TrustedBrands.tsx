"use client";

import {
    Smartphone,
    Laptop,
    Tv,
    Car,
    Bike,
    Camera,
    Gamepad2,
    Refrigerator,
    Sofa,
} from "lucide-react";
import { Reveal } from "@/components/animations/Motion";

const brands = [
    { name: "Apple", icon: "mobile" },
    { name: "Samsung", icon: "mobile" },
    { name: "Xiaomi", icon: "mobile" },
    { name: "OnePlus", icon: "mobile" },
    { name: "HP", icon: "laptop" },
    { name: "Dell", icon: "laptop" },
    { name: "Lenovo", icon: "laptop" },
    { name: "Sony", icon: "tv" },
    { name: "LG", icon: "appliance" },
    { name: "Whirlpool", icon: "appliance" },
    { name: "Godrej", icon: "appliance" },
    { name: "IKEA", icon: "sofa" },
    { name: "Maruti Suzuki", icon: "car" },
    { name: "Hyundai", icon: "car" },
    { name: "Honda", icon: "car" },
    { name: "Royal Enfield", icon: "bike" },
    { name: "Bajaj", icon: "bike" },
    { name: "Hero", icon: "bike" },
    { name: "Canon", icon: "camera" },
    { name: "PlayStation", icon: "gamepad" },
];

function BrandIcon({ type }: { type: string }) {
    switch (type) {
        case "mobile":
            return <Smartphone size={26} strokeWidth={3} />;
        case "laptop":
            return <Laptop size={26} strokeWidth={3} />;
        case "tv":
            return <Tv size={26} strokeWidth={3} />;
        case "car":
            return <Car size={26} strokeWidth={3} />;
        case "bike":
            return <Bike size={26} strokeWidth={3} />;
        case "camera":
            return <Camera size={26} strokeWidth={3} />;
        case "gamepad":
            return <Gamepad2 size={26} strokeWidth={3} />;
        case "appliance":
            return <Refrigerator size={26} strokeWidth={3} />;
        case "sofa":
            return <Sofa size={26} strokeWidth={3} />;
        default:
            return null;
    }
}

export default function TrustedBrands() {
    return (
        <section className="pt-8 md:pt-10 pb-8 md:pb-10">
            <div className="mx-auto max-w-7xl px-5 md:px-6">
                <Reveal>
                    <div className=" px-6 md:px-10 py-7 md:py-9 flex flex-col md:flex-row items-center gap-5 md:gap-10">
                        <div
                            className="relative flex-1 w-full overflow-hidden"
                            style={{
                                maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
                                WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
                            }}
                        >
                            <div className="flex marquee-track w-max">
                                {[0, 1].map((k) => (
                                    <div key={k} className="flex items-center gap-12 md:gap-16 pr-12 md:pr-16">
                                        {brands.map((b) => (
                                            <span
                                                key={b.name}
                                                className="flex items-center gap-2 font-display font-bold text-lg md:text-2xl whitespace-nowrap shrink-0"
                                            >
                                                <BrandIcon type={b.icon} />
                                                {b.name}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
