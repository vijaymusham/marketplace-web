"use client";

import { AnimatePresence, animate, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { useMarkIntroReady } from "@/components/layout/IntroContext";
import Image from "next/image";

const COLS = 1;
const ease = [0.22, 1, 0.36, 1] as const; // smooth ease-out, fast start / gentle settle
const wordEnterEase = [0.16, 1, 0.3, 1] as const; // very smooth deceleration, for the zoom-out settle
const wordExitEase = [0.7, 0, 0.84, 0] as const; // gentle accelerate-away
const WORDS = [
    "WELCOME",
    "TO",
    "SHUB",
    <>
        PORTFOLIO<span className="text-white">.</span>
    </>,
];
const WORD_ENTER_MS = 500; // word zoom-in-to-rest duration
const WORD_HOLD_MS = 220; // how long a settled word rests before the next begins
const WORD_EXIT_MS = 280; // outgoing word's fade/shrink duration
const WORD_ENTER_DURATION = WORD_ENTER_MS / 1000;
const WORD_EXIT_DURATION = WORD_EXIT_MS / 1000;

const COUNT_DURATION = 3.6; // seconds
const EXIT_DELAY = 0.4; // seconds after the count finishes before the columns lift
const COL_DURATION = 1.05; // seconds
const COL_STAGGER = 0.08; // seconds
const COL_BASE_DELAY = 0.05; // seconds

// Runs the layout effect only on the client so the very first paint already
// reflects whether the intro should show — avoids a flash of bare content.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Preloader() {
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);
    const [display, setDisplay] = useState(0);
    const [wordIndex, setWordIndex] = useState(0);
    const markIntroReady = useMarkIntroReady();

    useIsomorphicLayoutEffect(() => {
        setVisible(true);
        document.body.style.overflow = "hidden";

        const lastColEnd = COL_BASE_DELAY + (COLS - 1) * COL_STAGGER + COL_DURATION;
        const finish = () => {
            document.body.style.overflow = "";
            setVisible(false);
            markIntroReady();
        };

        const wordTimers: ReturnType<typeof setTimeout>[] = [];

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
            setDisplay(100);
            setWordIndex(WORDS.length - 1);
            setExiting(true);
            const t = setTimeout(finish, 300);
            return () => {
                clearTimeout(t);
                document.body.style.overflow = "";
            };
        }

        // Chain each swap off the previous one's real end time (enter + hold + exit)
        // rather than flat multiples of an interval — a flat schedule can fire the
        // next swap before the current word has finished exiting, which with
        // AnimatePresence's mode="wait" either skips a word or lets two words
        // render on top of each other for a frame.
        let cumulative = WORD_ENTER_MS + WORD_HOLD_MS;
        for (let i = 1; i < WORDS.length; i++) {
            wordTimers.push(setTimeout(() => setWordIndex(i), cumulative));
            cumulative += WORD_EXIT_MS + WORD_ENTER_MS + WORD_HOLD_MS;
        }

        const controls = animate(0, 100, {
            duration: COUNT_DURATION,
            ease: "easeInOut",
            onUpdate: (v) => setDisplay(Math.round(v)),
            onComplete: () => {
                setTimeout(() => setExiting(true), EXIT_DELAY * 1000);
                setTimeout(finish, (EXIT_DELAY + lastColEnd + 0.1) * 1000);
            },
        });

        return () => {
            controls.stop();
            wordTimers.forEach(clearTimeout);
            document.body.style.overflow = "";
        };
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-99999">
            <AnimatePresence>
                {!exiting && (
                    <motion.div
                        className="absolute inset-0 z-10 flex items-center justify-center px-6"
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.4, ease }}
                    >


                        {/* soft pulsing glow behind the word */}
                        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
                            <motion.span
                                className="h-[38vw] w-[38vw] max-h-96 max-w-96 rounded-full bg-white/20 blur-[90px]"
                                animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.92, 1.05, 0.92] }}
                                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>

                        <div className="relative z-20 w-full h-[14vw] max-h-32 sm:h-20 md:h-24">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    initial={{ opacity: 0, scale: 2, filter: "blur(16px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: WORD_ENTER_DURATION, ease: wordEnterEase } }}
                                    exit={{ opacity: 0, scale: 0.82, filter: "blur(10px)", transition: { duration: WORD_EXIT_DURATION, ease: wordExitEase } }}
                                    className="absolute inset-0 flex flex-col gap-2 items-center justify-center font-display font-black text-white text-[9vw] sm:text-5xl md:text-[20vh] tracking-wide"
                                >
                                    <div className="hidden font-heading text-5xl font-extrabold tracking-tight text-white lg:block">
                                        Deal<span className="text-white"> Market</span>
                                    </div>
                                    <div className="h-px w-28 md:w-[20vh] overflow-hidden rounded-full bg-white/25">
                                        <div className="h-full bg-white" style={{ width: `${display}%` }} />
                                    </div>
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {Array.from({ length: COLS }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute inset-y-0 bg-primary"
                    style={{ left: `${(i * 100) / COLS}%`, width: `${100 / COLS}%` }}
                    animate={exiting ? { y: "-100vh" } : { y: 0 }}
                    transition={{
                        duration: COL_DURATION,
                        ease,
                        delay: exiting ? COL_BASE_DELAY + i * COL_STAGGER : 0,
                    }}
                >
                    {/* <div className="absolute inset-x-0 bottom-0 h-0.75 bg-white shadow-[0_0_18px_4px_rgba(255,255,255,0.7)]" /> */}
                </motion.div>
            ))}
        </div>
    );
}
