"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";



export default function SellFab() {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => setExpanded(true), 1450);
        return () => window.clearTimeout(timer);
    }, []);

    return (
        <motion.a
            aria-label="Sell on DealMarket"
            className="group fixed bottom-6 left-1/2 z-50 cursor-pointer flex h-12 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full text-white
            bg-linear-to-br from-primary to-indigo-500 shadow-xl shadow-indigo-600/25 "
            initial={false}
            animate={{
                width: expanded ? 150 : 48,
                y: expanded ? 0 : [0, -14, 0, -9, 0, -4, 0],
            }}
            transition={{
                width: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
                y: { duration: 1.4, ease: "easeInOut" },
            }}
            whileTap={{ scale: 0.96 }}
        >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            <span className="relative grid size-5 flex-none place-items-center">
                <Plus size={22} strokeWidth={3} className="text-white" />
            </span>
            <AnimatePresence>
                {expanded && (
                    <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.3, delay: 0.35 }}
                        className="relative ml-2 mr-5 whitespace-nowrap text-base font-semibold text-white"
                    >
                        Sell Now
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.a>
    );
}
