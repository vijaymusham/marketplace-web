import type { ApiAdDetail, ApiFreshRecommendation } from "@/components/types/AllTypes";
import { DEFAULT_INDIA_LOCATION } from "@/lib/geo";

function apiOrigin() {
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
}

function unwrapData<T>(payload: unknown): T | null {
  if (!payload || typeof payload !== "object") return null;
  if ("data" in payload && (payload as { data?: unknown }).data) {
    const data = (payload as { data: unknown }).data;
    if (data && typeof data === "object") return data as T;
  }
  return payload as T;
}

function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const data = (payload as { data?: unknown }).data;
    if (Array.isArray(data)) return data as T[];
  }
  return [];
}

async function fetchJson(path: string, params?: Record<string, string | number>) {
  const origin = apiOrigin();
  if (!origin) return null;

  const url = new URL(path, `${origin}/`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  return res.json();
}

/** Public listing used for titles, snippets, and product schema. */
export async function getPublicAd(id: string): Promise<ApiAdDetail | null> {
  if (!id) return null;
  const payload = await fetchJson(`/ads/${encodeURIComponent(id)}`);
  const ad = unwrapData<ApiAdDetail>(payload);
  if (!ad?.id || !ad.title) return null;
  return ad;
}

/** Recent public listings to include in the XML sitemap. */
export async function getSitemapListings(): Promise<ApiFreshRecommendation[]> {
  const { latitude, longitude } = DEFAULT_INDIA_LOCATION;
  for (const count of [100, 12]) {
    const payload = await fetchJson("/ads/fresh", { latitude, longitude, count });
    const ads = unwrapList<ApiFreshRecommendation>(payload).filter((ad) => ad?.id && ad.title);
    if (ads.length) return ads;
  }
  return [];
}
