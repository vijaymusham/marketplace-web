"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { listings, type Listing } from "@/lib/listings";

const STORAGE_KEY = "dealmarket-wishlist";

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

function readIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is number => typeof id === "number");
  } catch {
    return [];
  }
}

function writeIds(ids: number[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
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
  return JSON.stringify(readIds());
}

function getServerSnapshot() {
  return "[]";
}

export function useWishlist() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ids = JSON.parse(snapshot) as number[];

  const items: Listing[] = ids
    .map((id) => listings.find((l) => l.id === id))
    .filter((l): l is Listing => Boolean(l));

  const isLiked = useCallback((id: number) => ids.includes(id), [ids]);

  const toggle = useCallback((id: number) => {
    const current = readIds();
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    writeIds(next);
  }, []);

  const remove = useCallback((id: number) => {
    writeIds(readIds().filter((x) => x !== id));
  }, []);

  const clear = useCallback(() => writeIds([]), []);

  return { ids, items, count: ids.length, isLiked, toggle, remove, clear };
}

/** Hydration-safe mount flag for empty-state flash control. */
export function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 1000);
  }, []);
  return mounted;
}
