"use client";

import { useCallback, useSyncExternalStore } from "react";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: "deal" | "message" | "system" | "price";
};

const STORAGE_KEY = "dealmarket-notifications";
const MIGRATION_KEY = "dealmarket-notifications-cleared-demo";

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

function clearLegacyDemoOnce() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(MIGRATION_KEY) === "1") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.setItem(MIGRATION_KEY, "1");
}

function readNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    clearLegacyDemoOnce();
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as AppNotification[];
  } catch {
    return [];
  }
}

function writeNotifications(items: AppNotification[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  emit();
}

/** Append a live push notification (e.g. from FCM foreground handler). */
export function pushNotification(input: {
  title: string;
  body: string;
  type?: AppNotification["type"];
}) {
  if (typeof window === "undefined") return;
  const next: AppNotification = {
    id: `fcm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title,
    body: input.body,
    time: "Just now",
    read: false,
    type: input.type ?? "system",
  };
  writeNotifications([next, ...readNotifications()]);
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  return JSON.stringify(readNotifications());
}

function getServerSnapshot() {
  return "[]";
}

export function useNotifications() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const items = JSON.parse(snapshot) as AppNotification[];
  const unreadCount = items.filter((n) => !n.read).length;

  const clearAll = useCallback(() => {
    writeNotifications([]);
  }, []);

  const markAllRead = useCallback(() => {
    writeNotifications(readNotifications().map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    writeNotifications(
      readNotifications().map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    writeNotifications(readNotifications().filter((n) => n.id !== id));
  }, []);

  return {
    items,
    count: items.length,
    unreadCount,
    clearAll,
    markAllRead,
    markRead,
    remove,
  };
}
