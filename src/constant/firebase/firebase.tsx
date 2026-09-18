import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, initializeRecaptchaConfig, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function createFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const app = createFirebaseApp();
export const auth: Auth = getAuth(app);

let recaptchaConfigPromise: Promise<void> | null = null;

/** Fetch/cache phone-auth reCAPTCHA (Enterprise if enabled) once per page load. */
export function ensureRecaptchaConfig(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (recaptchaConfigPromise) return recaptchaConfigPromise;

  recaptchaConfigPromise = initializeRecaptchaConfig(auth).catch((error: unknown) => {
    recaptchaConfigPromise = null;
    console.warn("[Firebase Auth] initializeRecaptchaConfig failed", {
      stage: "A. Firebase initialization / recaptcha config",
      hostname: window.location.hostname,
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      code:
        error && typeof error === "object" && "code" in error
          ? String((error as { code: unknown }).code)
          : undefined,
      message:
        error && typeof error === "object" && "message" in error
          ? String((error as { message: unknown }).message)
          : undefined,
    });
  });

  return recaptchaConfigPromise;
}
