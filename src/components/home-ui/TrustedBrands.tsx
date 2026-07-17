"use client";

import { Smartphone, Code2, Boxes, Flame, Wind, Radio } from "lucide-react";
import { Reveal } from "@/components/animations/Motion";

const stack = [
    { name: "React Native", icon: "mobile" },
    { name: "ReactJS", icon: "code" },
    { name: "NextJS", icon: "code" },
    { name: "TailwindCSS", icon: "code" },
    { name: "Shadcn UI", icon: "code" },
    { name: "TypeScript", icon: "code" },
    { name: "Redux Toolkit", icon: "boxes" },
    { name: "Firebase", icon: "flame" },
    { name: "NativeWind", icon: "wind" },
    { name: "Socket.IO", icon: "radio" },
    { name: "Expo", icon: "code" },
];

function StackIcon({ type }: { type: string }) {
    switch (type) {
        case "mobile":
            return <Smartphone size={26} strokeWidth={3} />;
        case "code":
            return <Code2 size={26} strokeWidth={3} />;
        case "boxes":
            return <Boxes size={26} strokeWidth={3} />;
        case "flame":
            return <Flame size={26} strokeWidth={3} />;
        case "wind":
            return <Wind size={26} strokeWidth={3} />;
        case "radio":
            return <Radio size={26} strokeWidth={3} />;
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
                                        {stack.map((b) => (
                                            <span
                                                key={b.name}
                                                className="flex items-center gap-2 font-display font-bold text-lg md:text-2xl whitespace-nowrap shrink-0"
                                            >
                                                <StackIcon type={b.icon} />
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
