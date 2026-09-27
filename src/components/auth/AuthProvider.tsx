"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    type ReactNode,
} from "react";
import { useDispatch } from "react-redux";
import { clearuser } from "@/components/redux/slices/authSlice";
import { persistor, type AppDispatch } from "@/components/redux/store";

type AuthContextValue = {
    loading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
    loading: false,
    signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();

    const signOut = useCallback(async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("fcmToken");
        dispatch(clearuser());
        await persistor.purge();
    }, [dispatch]);

    const value = useMemo(
        () => ({
            loading: false,
            signOut,
        }),
        [signOut]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
