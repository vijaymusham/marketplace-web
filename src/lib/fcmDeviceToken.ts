"use client";

import {
  ensureNotificationPermission,
  getFcmToken,
} from "@/constant/firebase/messaging";
import {
  registerDeviceToken,
  unregisterDeviceToken,
} from "@/components/api/apis";

const FCM_STORAGE_KEY = "fcmToken";

export function getStoredFcmToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(FCM_STORAGE_KEY);
}

export function setStoredFcmToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(FCM_STORAGE_KEY, token);
  else localStorage.removeItem(FCM_STORAGE_KEY);
}

/** Ask permission (if needed), get FCM token, PUT to backend for this logged-in user. */
export async function syncDeviceTokenToServer(): Promise<string | null> {
  try {
    const token = await getFcmToken();
    if (!token) {
      setStoredFcmToken(null);
      return null;
    }

    setStoredFcmToken(token);

    // Only register with backend when the user has an app session.
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      await registerDeviceToken({ token, platform: "web" });
    }

    return token;
  } catch (error) {
    console.warn("[FCM] syncDeviceTokenToServer failed:", error);
    return null;
  }
}

/** Enable push from a user gesture (profile switch / allow button). */
export async function enablePushNotifications(): Promise<{
  ok: boolean;
  token: string | null;
  permission: NotificationPermission;
}> {
  const permission = await ensureNotificationPermission();
  if (permission !== "granted") {
    return { ok: false, token: null, permission };
  }
  const token = await syncDeviceTokenToServer();
  return { ok: Boolean(token), token, permission };
}

/** Unregister this browser token from the backend (call while still authenticated). */
export async function disablePushNotifications(): Promise<void> {
  const token = getStoredFcmToken();
  if (token && typeof window !== "undefined" && localStorage.getItem("token")) {
    try {
      await unregisterDeviceToken({ token });
    } catch (error) {
      console.warn("[FCM] unregister failed:", error);
    }
  }
  setStoredFcmToken(null);
}
