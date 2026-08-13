"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/components/redux/store";
import { resolveCoords } from "@/lib/geo";

/** Resolved lat/lng for API calls — falls back to the India default. */
export function useUserLocation() {
    const location = useSelector((state: RootState) => state.user.location);
    return resolveCoords(location);
}
