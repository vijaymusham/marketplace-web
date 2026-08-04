"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import {
    onAuthStateChanged,
    signOut as firebaseSignOut,
    type User,
} from "firebase/auth";
import { auth } from "@/constant/firebase/firebase";

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
    user: null,
    loading: true,
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let settled = false;

        const unsubscribe = onAuthStateChanged(
            auth,
            (next) => {
                settled = true;
                setUser(next);
                setLoading(false);
            },
            () => {
                // Auth listener failed (bad config / network) — still unlock UI.
                settled = true;
                setUser(null);
                setLoading(false);
            }
        );

        // Safety: never leave the navbar stuck on a non-clickable skeleton.
        const timeout = window.setTimeout(() => {
            if (!settled) {
                setLoading(false);
            }
        }, 4000);

        return () => {
            unsubscribe();
            window.clearTimeout(timeout);
        };
    }, []);

    const signOut = async () => {
        await firebaseSignOut(auth);
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
