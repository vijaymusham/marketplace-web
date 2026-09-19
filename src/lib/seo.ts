/**
 * Central SEO config for DealPokket.
 * Override with NEXT_PUBLIC_SITE_URL in production (e.g. https://dealpokket.in).
 */
export const SITE_NAME = "DealPokket";
export const SITE_NAME_SPACED = "Deal Pokket";
export const SITE_TAGLINE =
  "Buy & sell second-hand goods near you — free classified ads across India";
export const HOMEPAGE_TITLE =
  "DealPokket — Buy & Sell Second Hand Products in India";
export const HOMEPAGE_DESCRIPTION =
  "Buy and sell second hand and pre-owned products in India with DealPokket. Discover great products, connect with sellers, and find your next deal.";

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "https://dealpokket.in";
}

export const DEFAULT_KEYWORDS = [
  "DealPokket",
  "Deal Pokket",
  "second hand marketplace India",
  "second hand buy sell",
  "free classified ads India",
  "free ad posting websites",
  "free ad posting sites India",
  "buy sell used items near me",
  "local marketplace India",
  "used products marketplace",
] as const;

export const PUBLIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "daily" as const },
  { path: "/free-classifieds", priority: 0.95, changeFrequency: "weekly" as const },
  { path: "/second-hand", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/help", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/safety", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
] as const;

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
