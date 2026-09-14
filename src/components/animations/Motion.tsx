"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useIntroReady } from "@/components/layout/IntroContext";

/** Soft expo-out — quick lift, long buttery settle */
const easeOut = [0.16, 1, 0.3, 1] as const;
const easeFade = [0.25, 0.1, 0.25, 1] as const;

const fadeSlide = {
    opacity: { duration: 0.55, ease: easeFade },
    y: { duration: 0.85, ease: easeOut },
    scale: { duration: 0.8, ease: easeOut },
};

/**
 * Skip entrance hiding until after mount so SSR / first paint stay visible
 * (opacity:0 initials destroy LCP when PersistGate/SSR finally emit HTML).
 */
function useMotionReady() {
    const [motionReady, setMotionReady] = useState(false);
    useEffect(() => {
        setMotionReady(true);
    }, []);
    return motionReady;
}

export function Reveal({
    children,
    delay = 0,
    y = 22,
    className = "",
}: {
    children: ReactNode;
    delay?: number;
    y?: number;
    className?: string;
}) {
    const ready = useIntroReady();
    const reduce = useReducedMotion();
    const motionReady = useMotionReady();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-4% 0px -4% 0px", amount: 0.12 });
    const show = ready && inView;

    if (reduce || !motionReady) {
        return (
            <div ref={ref} className={className}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={false}
            animate={show ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
            transition={{ ...fadeSlide, delay }}
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
    const ready = useIntroReady();
    const reduce = useReducedMotion();
    const motionReady = useMotionReady();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-8% 0px", amount: 0.2 });
    const show = ready && inView;
    const words = text.split(" ");

    if (reduce || !motionReady) {
        return <span className={className}>{text}</span>;
    }

    return (
        <span ref={ref} className={className} style={{ display: "inline-block" }}>
            {words.map((w, i) => (
                <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
                    <motion.span
                        style={{ display: "inline-block" }}
                        initial={false}
                        animate={show ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
                        transition={{
                            y: { duration: 0.7, ease: easeOut, delay: delay + i * 0.035 },
                            opacity: { duration: 0.4, ease: easeFade, delay: delay + i * 0.035 },
                        }}
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
    y = 16,
    className = "",
}: {
    children: ReactNode;
    delay?: number;
    y?: number;
    className?: string;
}) {
    const ready = useIntroReady();
    const reduce = useReducedMotion();
    const motionReady = useMotionReady();

    if (reduce || !motionReady) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial={false}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{
                opacity: { duration: 0.5, ease: easeFade, delay },
                y: { duration: 0.75, ease: easeOut, delay },
            }}
        >
            {children}
        </motion.div>
    );
}

export function Stagger({
    children,
    className = "",
    stagger = 0.07,
}: {
    children: ReactNode;
    className?: string;
    stagger?: number;
}) {
    const ready = useIntroReady();
    const reduce = useReducedMotion();
    const motionReady = useMotionReady();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "0px 0px -6% 0px", amount: 0.06 });
    const show = ready && inView;

    if (reduce || !motionReady) {
        return (
            <div ref={ref} className={className}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={false}
            animate={show ? "show" : "show"}
            variants={{
                hidden: {},
                show: {
                    transition: {
                        staggerChildren: stagger,
                        delayChildren: 0.02,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

/**
 * Listing / card item — stays visible on first paint; soft settle after mount.
 */
export function StaggerItem({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
    y?: number;
}) {
    return (
        <motion.div
            className={className}
            initial={false}
            variants={{
                hidden: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                },
                show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                        opacity: { duration: 0.55, ease: easeFade },
                        y: {
                            type: "spring",
                            stiffness: 90,
                            damping: 18,
                            mass: 0.85,
                        },
                        scale: {
                            type: "spring",
                            stiffness: 110,
                            damping: 20,
                            mass: 0.8,
                        },
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}
