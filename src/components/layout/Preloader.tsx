"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { useMarkIntroReady } from "@/components/layout/IntroContext";

const ease = [0.16, 1, 0.3, 1] as const;
const COUNT_DURATION = 1.35;
const EXIT_DELAY = 0.06;
const COL_DURATION = 0.72;
/** Home starts animating while the curtain is still lifting */
const HOME_READY_AT = 0.12;

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Preloader() {
    const [visible, setVisible] = useState(true);
    const [exiting, setExiting] = useState(false);
    const [display, setDisplay] = useState(0);
    const progress = useMotionValue(0);
    const progressWidth = useTransform(progress, (v) => `${v}%`);
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
            progress.set(100);
            setDisplay(100);
            setExiting(true);
            finishTimer = setTimeout(finish, 120);
            return () => {
                clearTimeout(finishTimer);
                unlock();
            };
        }

        const controls = animate(0, 100, {
            duration: COUNT_DURATION,
            ease: [0.33, 0, 0.2, 1],
            onUpdate: (v) => {
                progress.set(v);
                setDisplay(Math.round(v));
            },
            onComplete: () => {
                exitTimer = setTimeout(() => {
                    setExiting(true);
                    // Overlap: home slides in as the curtain lifts
                    homeReadyTimer = setTimeout(markHome, HOME_READY_AT * 1000);
                    finishTimer = setTimeout(finish, (COL_DURATION + 0.04) * 1000);
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
    }, [markIntroReady, progress]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-99999" data-preloader aria-hidden>
            <AnimatePresence>
                {!exiting && (
                    <motion.div
                        className="absolute inset-0 z-10 flex items-center justify-center px-6"
                        exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                        transition={{ duration: 0.28, ease }}
                    >
                        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
                            <motion.span
                                className="h-[38vw] w-[38vw] max-h-96 max-w-96 rounded-full bg-white/20 blur-[90px]"
                                animate={{ opacity: [0.45, 0.85, 0.45], scale: [0.94, 1.04, 0.94] }}
                                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>

                        <div className="relative z-20 flex w-full flex-col items-center gap-5">
                            <motion.div
                                initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{ duration: 0.5, ease }}
                                className="font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
                            >
                                Deal<span className="text-white/90"> Market</span>
                            </motion.div>
                            <div className="h-0.5 w-28 overflow-hidden rounded-full bg-white/20 md:w-40">
                                <motion.div
                                    className="h-full rounded-full bg-white"
                                    style={{ width: progressWidth }}
                                />
                            </div>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.35, ease }}
                                className="text-sm font-medium tracking-wide text-white/70 tabular-nums"
                            >
                                {display}%
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="absolute inset-0 bg-primary"
                initial={{ y: 0 }}
                animate={exiting ? { y: "-100%" } : { y: 0 }}
                transition={{ duration: COL_DURATION, ease }}
            />
        </div>
    );
}
