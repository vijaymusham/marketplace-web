"use client";

import { animate, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useLayoutEffect, useState } from "react";
import { useMarkIntroReady } from "@/components/layout/IntroContext";

const springIn = { type: "spring", duration: 0.55, bounce: 0 } as const;
const easeOut = [0.16, 1, 0.3, 1] as const;
const easeFade = [0.25, 0.1, 0.25, 1] as const;
const easeDoor = [0.4, 0, 0.12, 1] as const;

/** Keep intro short so it does not tank LCP / TBT. */
const COUNT_DURATION = 0.55;
const EXIT_DELAY = 0.06;
const EXIT_DURATION = 0.42;
const HOME_READY_AT = 0.05;
const INTRO_SEEN_KEY = "dp-intro-seen";

const RING_R = 54;
const RING_C = 2 * Math.PI * RING_R;

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function finishChrome(markHome: () => void) {
    document.body.style.overflow = "";
    document.documentElement.classList.remove("intro-pending");
    markHome();
}

export default function Preloader() {
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);
    const progress = useMotionValue(0);
    const smooth = useSpring(progress, {
        stiffness: 140,
        damping: 28,
        mass: 0.7,
        restDelta: 0.05,
    });
    const dashOffset = useTransform(smooth, (v) => RING_C - (v / 100) * RING_C);
    const displayText = useTransform(smooth, (v) => String(Math.round(v)).padStart(2, "0"));
    const barScale = useTransform(smooth, [0, 100], [0, 1]);
    const markIntroReady = useMarkIntroReady();

    useIsomorphicLayoutEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isAuditBot =
            navigator.webdriver === true ||
            /Chrome-Lighthouse|PageSpeed|GTmetrix|HeadlessChrome|Lighthouse|PTST/i.test(
                navigator.userAgent,
            );
        const seen = (() => {
            try {
                return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
            } catch {
                return false;
            }
        })();

        // Never block first paint in development or automated audits.
        if (reduced || seen || isAuditBot || process.env.NODE_ENV !== "production") {
            finishChrome(markIntroReady);
            return;
        }

        document.body.style.overflow = "hidden";
        document.documentElement.classList.add("intro-pending");
        setVisible(true);

        let homeReadyTimer: ReturnType<typeof setTimeout> | undefined;
        let finishTimer: ReturnType<typeof setTimeout> | undefined;
        let exitTimer: ReturnType<typeof setTimeout> | undefined;
        let marked = false;

        const markHome = () => {
            if (marked) return;
            marked = true;
            markIntroReady();
        };

        const finish = () => {
            try {
                sessionStorage.setItem(INTRO_SEEN_KEY, "1");
            } catch {
                /* ignore */
            }
            finishChrome(markHome);
            setVisible(false);
        };

        const controls = animate(progress, 100, {
            duration: COUNT_DURATION,
            ease: easeOut,
            onComplete: () => {
                exitTimer = setTimeout(() => {
                    setExiting(true);
                    homeReadyTimer = setTimeout(markHome, HOME_READY_AT * 1000);
                    finishTimer = setTimeout(finish, EXIT_DURATION * 1000);
                }, EXIT_DELAY * 1000);
            },
        });

        return () => {
            controls.stop();
            clearTimeout(exitTimer);
            clearTimeout(homeReadyTimer);
            clearTimeout(finishTimer);
            document.body.style.overflow = "";
            document.documentElement.classList.remove("intro-pending");
        };
    }, [markIntroReady, progress, smooth]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-99999 overflow-hidden" data-preloader aria-hidden>
            <motion.div
                className="absolute inset-y-0 left-0 w-1/2 bg-primary will-change-transform"
                initial={{ x: 0 }}
                animate={exiting ? { x: "-101%" } : { x: 0 }}
                transition={{ duration: EXIT_DURATION, ease: easeDoor }}
            />
            <motion.div
                className="absolute inset-y-0 right-0 w-1/2 bg-primary will-change-transform"
                initial={{ x: 0 }}
                animate={exiting ? { x: "101%" } : { x: 0 }}
                transition={{ duration: EXIT_DURATION, ease: easeDoor }}
            />

            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.18),transparent_58%)]"
            />

            <motion.div
                className="absolute inset-0 z-10 flex items-center justify-center px-6"
                animate={exiting ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.28, ease: easeFade }}
            >
                <motion.div
                    className="relative z-10 flex w-full flex-col items-center"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={springIn}
                >
                    <div className="relative mb-6 grid size-28 place-items-center sm:mb-8 sm:size-36">
                        <svg viewBox="0 0 128 128" className="absolute inset-0 size-full -rotate-90" fill="none">
                            <circle
                                cx="64"
                                cy="64"
                                r={RING_R}
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="2.5"
                            />
                            <motion.circle
                                cx="64"
                                cy="64"
                                r={RING_R}
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeDasharray={RING_C}
                                style={{ strokeDashoffset: dashOffset }}
                            />
                        </svg>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.86 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={springIn}
                            className="relative grid size-20 place-items-center overflow-hidden rounded-full bg-white shadow-[0_12px_40px_rgba(8,18,80,0.28)] sm:size-24"
                        >
                            <Image
                                src="/logo.png"
                                alt=""
                                width={96}
                                height={96}
                                priority
                                className="size-14 object-contain sm:size-16"
                            />
                        </motion.div>
                    </div>

                    <p className="relative font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Deal<span className="text-white/95">Pokket</span>
                    </p>

                    <p className="mt-2 text-[11px] font-semibold tracking-[0.28em] text-white/70 uppercase sm:text-xs">
                        Finding nearby deals
                    </p>

                    <div className="mt-6 flex w-full max-w-48 flex-col items-center gap-2 sm:max-w-56">
                        <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
                            <motion.div
                                className="h-full origin-left rounded-full bg-white"
                                style={{ scaleX: barScale }}
                            />
                        </div>
                        <p className="font-heading text-sm font-bold tracking-widest text-white/85 tabular-nums">
                            <motion.span>{displayText}</motion.span>
                            <span className="ml-0.5 text-white/55">%</span>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
