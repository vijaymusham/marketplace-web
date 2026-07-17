"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import { useIntroReady } from "@/components/layout/IntroContext";

const ease = [0.2, 0.8, 0.2, 1] as const;

export function Reveal({
    children,
    delay = 0,
    y = 28,
    className = "",
}: {
    children: ReactNode;
    delay?: number;
    y?: number;
    className?: string;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay }}
        >
            {children}
        </motion.div>
    );
}

export function RevealText({
    text,
    className = "",
    delay = 0,
}: {
    text: string;
    className?: string;
    delay?: number;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-10% 0px" });
    const words = text.split(" ");
    return (
        <span ref={ref} className={className} style={{ display: "inline-block" }}>
            {words.map((w, i) => (
                <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
                    <motion.span
                        style={{ display: "inline-block" }}
                        initial={{ y: "110%" }}
                        animate={inView ? { y: 0 } : {}}
                        transition={{ duration: 0.75, ease, delay: delay + i * 0.05 }}
                    >
                        {w}&nbsp;
                    </motion.span>
                </span>
            ))}
        </span>
    );
}

export function Enter({
    children,
    delay = 0,
    y = 24,
    className = "",
}: {
    children: ReactNode;
    delay?: number;
    y?: number;
    className?: string;
}) {
    const ready = useIntroReady();
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y }}
            transition={{ duration: 0.7, ease, delay }}
        >
            {children}
        </motion.div>
    );
}

export function Stagger({ children, className = "" }: { children: ReactNode; className?: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-8% 0px" });
    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
            }}
        >
            {children}
        </motion.div>
    );
}
