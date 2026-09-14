"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";

const IntroContext = createContext<{ ready: boolean; markReady: () => void }>({
    ready: true,
    markReady: () => {},
});

export function IntroProvider({ children }: { children: ReactNode }) {
    // Start ready so SSR/first paint isn't stuck at opacity:0 waiting for the preloader effect.
    const [ready, setReady] = useState(true);
    const markReady = useCallback(() => setReady(true), []);
    return <IntroContext.Provider value={{ ready, markReady }}>{children}</IntroContext.Provider>;
}

export function useIntroReady() {
    return useContext(IntroContext).ready;
}

export function useMarkIntroReady() {
    return useContext(IntroContext).markReady;
}
