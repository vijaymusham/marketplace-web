"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { listings, type Listing } from "@/lib/listings";

const STORAGE_KEY = "dealmarket-wishlist";

type WishlistId = string | number;
type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

function readIds(): WishlistId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (id): id is WishlistId => typeof id === "number" || typeof id === "string",
    );
  } catch {
    return [];
  }
}

function writeIds(ids: WishlistId[]) {
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

function sameId(a: WishlistId, b: WishlistId) {
  return String(a) === String(b);
}

export function useWishlist() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ids = JSON.parse(snapshot) as WishlistId[];

  const items: Listing[] = ids
    .map((id) => listings.find((l) => sameId(l.id, id)))
    .filter((l): l is Listing => Boolean(l));

  const isLiked = useCallback(
    (id: WishlistId) => ids.some((x) => sameId(x, id)),
    [ids],
  );

  const toggle = useCallback((id: WishlistId) => {
    const current = readIds();
    const next = current.some((x) => sameId(x, id))
      ? current.filter((x) => !sameId(x, id))
      : [...current, id];
    writeIds(next);
  }, []);

  const remove = useCallback((id: WishlistId) => {
    writeIds(readIds().filter((x) => !sameId(x, id)));
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
