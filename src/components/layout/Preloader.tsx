"use client";

import { animate, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { useMarkIntroReady } from "@/components/layout/IntroContext";

const springIn = { type: "spring", duration: 0.9, bounce: 0 } as const;
const easeOut = [0.16, 1, 0.3, 1] as const;
const easeFade = [0.25, 0.1, 0.25, 1] as const;
const easeDoor = [0.4, 0, 0.12, 1] as const;

const COUNT_DURATION = 1.7;
const EXIT_DELAY = 0.18;
const EXIT_DURATION = 0.88;
const HOME_READY_AT = 0.12;

const RING_R = 52;
const RING_C = 2 * Math.PI * RING_R;

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Preloader() {
    const [visible, setVisible] = useState(true);
    const [exiting, setExiting] = useState(false);
    const progress = useMotionValue(0);
    const smooth = useSpring(progress, {
        stiffness: 100,
        damping: 24,
        mass: 0.8,
        restDelta: 0.05,
    });
    const dashOffset = useTransform(smooth, (v) => RING_C - (v / 100) * RING_C);
    const displayText = useTransform(smooth, (v) => String(Math.round(v)).padStart(3, "0"));
    const fillY = useTransform(smooth, [0, 100], ["100%", "0%"]);
    const lineScale = useTransform(smooth, [0, 100], [0, 1]);
    const dotX = useTransform(smooth, (v) => 64 + RING_R * Math.cos((v / 100) * Math.PI * 2));
    const dotY = useTransform(smooth, (v) => 64 + RING_R * Math.sin((v / 100) * Math.PI * 2));
    const markIntroReady = useMarkIntroReady();

    useIsomorphicLayoutEffect(() => {
        document.body.style.overflow = "hidden";
        document.documentElement.classList.add("intro-pending");

        let homeReadyTimer: ReturnType<typeof setTimeout> | undefined;
        let finishTimer: ReturnType<typeof setTimeout> | undefined;
        let exitTimer: ReturnType<typeof setTimeout> | undefined;
        let marked = false;

        const unlock = () => {
            document.body.style.overflow = "";
            document.documentElement.classList.remove("intro-pending");
        };

        const markHome = () => {
            if (marked) return;
            marked = true;
            markIntroReady();
        };

        const finish = () => {
            unlock();
            markHome();
            setVisible(false);
        };

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
            progress.jump(100);
            smooth.jump(100);
            setExiting(true);
            finishTimer = setTimeout(finish, 80);
            return () => {
                clearTimeout(finishTimer);
                unlock();
            };
        }

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
            unlock();
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

            <motion.div
                className="absolute inset-0 z-10 flex items-center justify-center px-6"
                animate={exiting ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.42, ease: easeFade }}
            >
                <span
                    aria-hidden
                    className="pointer-events-none absolute h-64 w-64 rounded-full bg-white/20 blur-[90px] sm:h-80 sm:w-80"
                />

                <motion.div
                    className="relative z-10 flex w-full flex-col items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={springIn}
                >
                    <div className="relative mb-7 grid size-28 place-items-center sm:mb-8 sm:size-32">
                        <svg viewBox="0 0 128 128" className="absolute inset-0 size-full -rotate-90" fill="none">
                            <circle
                                cx="64"
                                cy="64"
                                r={RING_R}
                                stroke="rgba(255,255,255,0.18)"
                                strokeWidth="3"
                            />
                            <motion.circle
                                cx="64"
                                cy="64"
                                r={RING_R}
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray={RING_C}
                                style={{ strokeDashoffset: dashOffset }}
                            />
                            <motion.circle
                                r="4.5"
                                fill="white"
                                style={{ cx: dotX, cy: dotY }}
                            />
                        </svg>
                        <motion.span
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={springIn}
                            className="font-heading text-[1.25rem] font-extrabold tracking-tight text-white sm:text-[1.4rem]"
                        >
                            DP
                        </motion.span>
                    </div>

                    <h1 className="relative font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
                        <span className="flex items-baseline justify-center">
                            <motion.span
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{
                                    x: { ...springIn, delay: 0.06 },
                                    opacity: { duration: 0.5, ease: easeFade, delay: 0.06 },
                                }}
                                className="select-none text-transparent"
                            >
                                Deal
                            </motion.span>
                            <motion.span
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{
                                    x: { ...springIn, delay: 0.12 },
                                    opacity: { duration: 0.5, ease: easeFade, delay: 0.12 },
                                }}
                                className="select-none text-transparent"
                            >
                                &nbsp;Pokket
                            </motion.span>
                        </span>
                        <span className="pointer-events-none absolute inset-0 overflow-hidden">
                            <motion.span
                                className="flex h-full items-baseline justify-center text-white will-change-transform"
                                style={{ y: fillY }}
                            >
                                Deal&nbsp;Pokket
                            </motion.span>
                        </span>
                    </h1>

                    <motion.div
                        className="mt-4 h-px w-32 origin-center bg-white sm:w-40"
                        style={{ scaleX: lineScale }}
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...springIn, delay: 0.28 }}
                        className="mt-3 text-[11px] font-semibold tracking-[0.24em] text-white/55 uppercase sm:text-xs"
                    >
                        Finding nearby deals
                    </motion.p>
                </motion.div>

                <div className="pointer-events-none absolute inset-x-6 bottom-7 flex items-end justify-between sm:inset-x-10 sm:bottom-10 md:inset-x-14">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...springIn, delay: 0.12 }}
                        className="font-heading text-4xl font-extrabold tracking-tight text-white/90 tabular-nums sm:text-5xl md:text-6xl"
                    >
                        {displayText}
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ duration: 0.45, ease: easeOut, delay: 0.22 }}
                        className="mb-1 text-[10px] font-semibold tracking-[0.22em] text-white uppercase sm:text-[11px]"
                    >
                        Loading
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
}
