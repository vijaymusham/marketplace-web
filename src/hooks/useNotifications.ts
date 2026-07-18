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

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "Price drop on iPhone 13",
    body: "A listing you viewed is now ₹500 cheaper. Check it before it’s gone.",
    time: "2 min ago",
    read: false,
    type: "price",
  },
  {
    id: "n2",
    title: "New message from Rahul",
    body: "“Is the Honda City still available? I can pick up today.”",
    time: "18 min ago",
    read: false,
    type: "message",
  },
  {
    id: "n3",
    title: "Deal near you",
    body: "12 fresh electronics ads were posted in your area this morning.",
    time: "1 hr ago",
    read: false,
    type: "deal",
  },
  {
    id: "n4",
    title: "Wishlist reminder",
    body: "Your saved BMW X5 still has active interest from 3 buyers.",
    time: "Yesterday",
    read: true,
    type: "system",
  },
  {
    id: "n5",
    title: "Verification complete",
    body: "Your seller profile is verified. Ads may now rank higher in search.",
    time: "2 days ago",
    read: true,
    type: "system",
  },
];

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

function readNotifications(): AppNotification[] {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as AppNotification[];
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

function writeNotifications(items: AppNotification[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  emit();
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
  return JSON.stringify(DEFAULT_NOTIFICATIONS);
}

export function useNotifications() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
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

  return { items, count: items.length, unreadCount, clearAll, markAllRead, markRead, remove };
}
