"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type { User } from "firebase/auth";

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
    user: null,
    loading: true,
    signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let settled = false;
        let unsubscribe: (() => void) | undefined;
        let cancelled = false;

        const boot = async () => {
            const [{ onAuthStateChanged }, { auth }] = await Promise.all([
                import("firebase/auth"),
                import("@/constant/firebase/firebase"),
            ]);
            if (cancelled) return;

            unsubscribe = onAuthStateChanged(
                auth,
                (next) => {
                    settled = true;
                    setUser(next);
                    setLoading(false);
                },
                () => {
                    settled = true;
                    setUser(null);
                    setLoading(false);
                },
            );
        };

        // Defer Firebase well past LCP (idle or ~2.5s).
        const delay = window.setTimeout(() => {
            void boot();
        }, 2500);

        const safety = window.setTimeout(() => {
            if (!settled) setLoading(false);
        }, 4000);

        return () => {
            cancelled = true;
            window.clearTimeout(delay);
            window.clearTimeout(safety);
            unsubscribe?.();
        };
    }, []);

    const signOut = async () => {
        const [{ signOut: firebaseSignOut }, { auth }] = await Promise.all([
            import("firebase/auth"),
            import("@/constant/firebase/firebase"),
        ]);
        await firebaseSignOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
