"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getWishlist } from "@/components/api/apis";
import type { RootState } from "@/components/redux/store";

export function useIsLoggedIn() {
  return Boolean(
    useSelector((state: RootState) => state.user.user?.accessToken),
  );
}

/** Shared wishlist query — skipped entirely when the user is logged out. */
export function useWishlistQuery() {
  const isLoggedIn = useIsLoggedIn();

  return useQuery({
    queryKey: ["wishlist"] as const,
    queryFn: () => getWishlist(),
    enabled: isLoggedIn,
  });
}
