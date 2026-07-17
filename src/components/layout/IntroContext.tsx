"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";

const IntroContext = createContext<{ ready: boolean; markReady: () => void }>({
    ready: true,
    markReady: () => {},
});

export function IntroProvider({ children }: { children: ReactNode }) {
    const [ready, setReady] = useState(false);
    const markReady = useCallback(() => setReady(true), []);
    return <IntroContext.Provider value={{ ready, markReady }}>{children}</IntroContext.Provider>;
}

export function useIntroReady() {
    return useContext(IntroContext).ready;
}

export function useMarkIntroReady() {
    return useContext(IntroContext).markReady;
}
