"use client";

import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
    GoogleAuthProvider,
    signInWithCredential,
    signInWithPopup,
    signOut as firebaseSignOut,
    type UserCredential,
} from "firebase/auth";
import { createGoogleProvider, getFirebaseAuth } from "@/constant/firebase/firebase";
import {
    ensureNotificationPermission,
    getFcmToken,
} from "@/constant/firebase/messaging";
import {
    authGoogle,
    getUser,
    type AuthGoogleNewUserResponse,
    type AuthGoogleProfile,
} from "@/components/api/apis";
import { setUser, type userState } from "@/components/redux/slices/authSlice";
import type { AppDispatch } from "@/components/redux/store";

export type AuthSession = NonNullable<userState["user"]>;

/** A Google account with no DealPokket account yet; needs a phone number to finish signup. */
export type PendingGoogleSignup = {
    idToken: string;
    profile: AuthGoogleProfile;
};

export type GoogleAuthResult =
    | { status: "signedIn"; session: AuthSession }
    | { status: "needsSignup"; pending: PendingGoogleSignup };

export type GoogleSignupDetails = {
    phone: string;
    name?: string;
    referralCode?: string;
};

export function useCompleteAuth() {
    const dispatch = useDispatch<AppDispatch>();

    const completeBackendAuth = useCallback(
        async (authData: AuthSession) => {
            if (authData?.accessToken) {
                localStorage.setItem("token", authData.accessToken);
            }

            const fcmToken = await getFcmToken();
            if (fcmToken) {
                localStorage.setItem("fcmToken", fcmToken);
                try {
                    const { registerDeviceToken } = await import("@/components/api/apis");
                    await registerDeviceToken({ token: fcmToken, platform: "web" });
                } catch (error) {
                    console.warn("[FCM] device-token register after login failed:", error);
                }
            }

            dispatch(setUser(authData));

            const me = await getUser();
            if (me) {
                if (me.user && me.accessToken) {
                    dispatch(setUser(me));
                } else if (me.id && authData) {
                    dispatch(setUser({ ...authData, user: me }));
                }
            }

            return authData;
        },
        [dispatch]
    );

    const finishFirebaseLogin = useCallback(
        async (credential: UserCredential): Promise<GoogleAuthResult> => {
            const idToken = await credential.user.getIdToken();
            const fcmToken = await getFcmToken();

            const data = (await authGoogle({
                idToken,
                platform: "web",
                fcmToken: fcmToken || undefined,
            })) as AuthSession | AuthGoogleNewUserResponse;

            // Backend issues its own session token; signing out of Firebase doesn't revoke the ID token,
            // so it stays usable for the signup step.
            await firebaseSignOut(getFirebaseAuth()).catch(() => {});

            if (data && "exists" in data && data.exists === false) {
                return { status: "needsSignup", pending: { idToken, profile: data.profile } };
            }

            const session = await completeBackendAuth(data as AuthSession);
            return { status: "signedIn", session };
        },
        [completeBackendAuth]
    );

    const completeGoogleSignup = useCallback(
        async (pending: PendingGoogleSignup, details: GoogleSignupDetails) => {
            const fcmToken = await getFcmToken();
            const authData = (await authGoogle({
                idToken: pending.idToken,
                phone: details.phone,
                name: details.name,
                referralCode: details.referralCode,
                platform: "web",
                fcmToken: fcmToken || undefined,
            })) as AuthSession;
            return completeBackendAuth(authData);
        },
        [completeBackendAuth]
    );

    const signInWithGooglePopup = useCallback(async () => {
        void ensureNotificationPermission();
        const credential = await signInWithPopup(getFirebaseAuth(), createGoogleProvider());
        return finishFirebaseLogin(credential);
    }, [finishFirebaseLogin]);

    /** `googleIdToken` is the JWT returned by Google Identity Services (One Tap). */
    const signInWithGoogleIdToken = useCallback(
        async (googleIdToken: string) => {
            const credential = await signInWithCredential(
                getFirebaseAuth(),
                GoogleAuthProvider.credential(googleIdToken)
            );
            return finishFirebaseLogin(credential);
        },
        [finishFirebaseLogin]
    );

    return {
        completeBackendAuth,
        completeGoogleSignup,
        signInWithGooglePopup,
        signInWithGoogleIdToken,
    };
}

export function firebaseAuthErrorMessage(error: unknown): string | null {
    const code =
        error && typeof error === "object" && "code" in error
            ? String((error as { code: unknown }).code)
            : "";
    switch (code) {
        case "auth/popup-closed-by-user":
        case "auth/cancelled-popup-request":
            return null;
        case "auth/popup-blocked":
            return "Popup was blocked. Please allow popups and try again.";
        case "auth/unauthorized-domain":
            return "This domain is not authorized for Google sign-in.";
        case "auth/account-exists-with-different-credential":
            return "An account already exists with this email using a different sign-in method.";
        case "auth/network-request-failed":
            return "Network error. Please check your connection.";
        default:
            return code ? "Google sign-in failed. Please try again." : "";
    }
}
