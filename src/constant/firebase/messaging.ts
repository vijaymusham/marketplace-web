"use client";

import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type Messaging,
  type MessagePayload,
  type Unsubscribe,
} from "firebase/messaging";
import { app } from "@/constant/firebase/firebase";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

let messagingInstance: Messaging | null = null;
let messagingInitPromise: Promise<Messaging | null> | null = null;

function buildServiceWorkerUrl(): string {
  // Stable path (no query string) so only one SW registration handles pushes.
  return "/firebase-messaging-sw.js";
}

/** Ask the browser for notification permission (must run from a user click). */
export async function ensureNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  if (messagingInstance) return messagingInstance;
  if (messagingInitPromise) return messagingInitPromise;

  messagingInitPromise = (async () => {
    try {
      const supported = await isSupported();
      if (!supported) return null;
      messagingInstance = getMessaging(app);
      return messagingInstance;
    } catch (error) {
      console.warn("[FCM] Messaging unavailable:", error);
      return null;
    }
  })();

  return messagingInitPromise;
}

export async function registerMessagingServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const swUrl = buildServiceWorkerUrl();

    // Drop stale SWs (e.g. old `firebase-messaging-sw.js?apiKey=...`) that
    // would also handle pushes and create duplicate notifications.
    const all = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      all.map(async (reg) => {
        const script = reg.active?.scriptURL || reg.waiting?.scriptURL || "";
        if (
          script.includes("firebase-messaging-sw.js") &&
          !script.endsWith("/firebase-messaging-sw.js")
        ) {
          await reg.unregister();
        }
      }),
    );

    const existing = await navigator.serviceWorker.getRegistration("/");
    if (
      existing?.active?.scriptURL &&
      existing.active.scriptURL.endsWith("/firebase-messaging-sw.js")
    ) {
      await existing.update();
      await navigator.serviceWorker.ready;
      return existing;
    }

    const registration = await navigator.serviceWorker.register(swUrl, {
      scope: "/",
    });
    await navigator.serviceWorker.ready;
    return registration;
  } catch (error) {
    console.warn("[FCM] Service worker registration failed:", error);
    return null;
  }
}

/**
 * Request notification permission (if needed) and return an FCM registration token.
 * Returns null when unsupported, denied, or misconfigured — never throws.
 */
export async function getFcmToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    // Always ask permission first (user-gesture friendly), before other checks.
    const permission = await ensureNotificationPermission();
    if (permission !== "granted") {
      console.warn("[FCM] Notification permission:", permission);
      return null;
    }

    if (!VAPID_KEY) {
      console.warn(
        "[FCM] Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY. Generate it in Firebase Console → Project settings → Cloud Messaging → Web Push certificates.",
      );
      return null;
    }

    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    const registration = await registerMessagingServiceWorker();
    if (!registration) return null;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    return token || null;
  } catch (error) {
    console.warn("[FCM] Failed to get token:", error);
    return null;
  }
}

export async function subscribeForegroundMessages(
  handler: (payload: MessagePayload) => void,
): Promise<Unsubscribe | null> {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;
    return onMessage(messaging, handler);
  } catch (error) {
    console.warn("[FCM] Foreground listener failed:", error);
    return null;
  }
}
