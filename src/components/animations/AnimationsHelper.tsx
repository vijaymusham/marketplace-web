export const panelVariants = {
    hidden: {
        opacity: 0,
        y: -12,
        scale: 0.96,
        filter: "blur(4px)",
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            stiffness: 280,
            damping: 26,
            mass: 0.75,
            opacity: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
            filter: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
            staggerChildren: 0.045,
            delayChildren: 0.04,
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.97,
        filter: "blur(3px)",
        transition: {
            duration: 0.24,
            ease: [0.4, 0, 0.2, 1],
            staggerChildren: 0.02,
            staggerDirection: -1,
        },
    },
} as const;

export const itemVariants = {
    hidden: { opacity: 0, y: 10, x: -4 },
    visible: {
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 320,
            damping: 28,
            mass: 0.6,
        },
    },
    exit: {
        opacity: 0,
        y: -4,
        transition: { duration: 0.14, ease: [0.4, 0, 1, 1] },
    },
} as const;
