"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import type { RootState } from "@/components/redux/store";
import { requestSignIn } from "@/lib/auth-events";
import { firebaseAuthErrorMessage, useCompleteAuth } from "./useCompleteAuth";

const GSI_SRC = "https://accounts.google.com/gsi/client";

type GsiCredentialResponse = { credential: string };

type GsiId = {
    initialize: (config: {
        client_id: string;
        callback: (response: GsiCredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
        itp_support?: boolean;
        use_fedcm_for_prompt?: boolean;
        context?: "signin" | "signup" | "use";
    }) => void;
    prompt: () => void;
    cancel: () => void;
};

declare global {
    interface Window {
        google?: { accounts: { id: GsiId } };
    }
}

let gsiScriptPromise: Promise<void> | null = null;

function loadGsiScript(): Promise<void> {
    if (window.google?.accounts?.id) return Promise.resolve();
    if (gsiScriptPromise) return gsiScriptPromise;

    gsiScriptPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = GSI_SRC;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => {
            gsiScriptPromise = null;
            reject(new Error("Failed to load Google Identity Services"));
        };
        document.head.appendChild(script);
    });
    return gsiScriptPromise;
}

/** Shows Google One Tap (FedCM account chooser) to signed-out visitors. */
export default function GoogleOneTap() {
    const isLoggedIn = useSelector((state: RootState) => Boolean(state.user.user?.accessToken));
    const { signInWithGoogleIdToken } = useCompleteAuth();
    const signInRef = useRef(signInWithGoogleIdToken);

    useEffect(() => {
        signInRef.current = signInWithGoogleIdToken;
    }, [signInWithGoogleIdToken]);

    useEffect(() => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (isLoggedIn || !clientId) return;

        let cancelled = false;

        const timer = window.setTimeout(() => {
            loadGsiScript()
                .then(() => {
                    const gsi = window.google?.accounts?.id;
                    if (cancelled || !gsi) return;

                    gsi.initialize({
                        client_id: clientId,
                        auto_select: false,
                        cancel_on_tap_outside: true,
                        itp_support: true,
                        use_fedcm_for_prompt: true,
                        context: "signin",
                        callback: async ({ credential }) => {
                            try {
                                const result = await signInRef.current(credential);
                                if (result.status === "needsSignup") {
                                    requestSignIn({ googleSignup: result.pending });
                                } else {
                                    toast.success("Logged in successfully!");
                                }
                            } catch (error) {
                                const message = firebaseAuthErrorMessage(error);
                                if (message !== null) {
                                    toast.error(message || "Google sign-in failed. Please try again.");
                                }
                            }
                        },
                    });
                    gsi.prompt();
                })
                .catch((error) => console.warn("[GoogleOneTap]", error));
        }, 1500);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
            window.google?.accounts?.id?.cancel();
        };
    }, [isLoggedIn]);

    return null;
}
