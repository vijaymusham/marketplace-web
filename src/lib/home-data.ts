import { DEFAULT_INDIA_LOCATION } from "@/lib/geo";
import type {
  ApiCity,
  ApiFreshRecommendation,
} from "@/components/types/AllTypes";

function apiOrigin() {
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
}

function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const data = (payload as { data?: unknown }).data;
    if (Array.isArray(data)) return data as T[];
  }
  return [];
}

async function fetchJson(path: string, params: Record<string, string | number>) {
  const origin = apiOrigin();
  if (!origin) return null;

  const url = new URL(path, `${origin}/`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

/** Server-friendly home bootstrap so LCP images exist in the first HTML. */
export async function getHomeBootstrap() {
  const { latitude, longitude } = DEFAULT_INDIA_LOCATION;

  const [citiesPayload, freshPayload] = await Promise.all([
    fetchJson("/cities/popular", { latitude, longitude }),
    fetchJson("/ads/fresh", { latitude, longitude, count: 12 }),
  ]);

  return {
    cities: unwrapList<ApiCity>(citiesPayload),
    freshAds: unwrapList<ApiFreshRecommendation>(freshPayload),
  };
}
