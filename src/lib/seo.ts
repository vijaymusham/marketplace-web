/**
 * Central SEO config for DealPokket.
 * Override with NEXT_PUBLIC_SITE_URL in production (e.g. https://www.dealpokket.com).
 */
export const SITE_NAME = "DealPokket";
export const SITE_NAME_SPACED = "Deal Pokket";
export const SITE_TAGLINE =
  "Deal Pokket is a free second hand marketplace in India — buy and sell used products near you.";
export const HOMEPAGE_TITLE =
  "Deal Pokket — Second Hand Marketplace in India";
export const HOMEPAGE_DESCRIPTION =
  "Deal Pokket is a free second hand marketplace in India. Sell used items easily near you and keep the best value. Post ads free.";

/** Profiles that confirm the Deal Pokket brand for search engines. */
export const SOCIAL_PROFILES = [
  "https://www.instagram.com/dealpokket",
  "https://www.facebook.com/profile.php?id=61594007414127",
  "https://x.com/DealPokket",
  "https://www.linkedin.com/in/dealpokket",
] as const;

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "https://www.dealpokket.com";
}

export const DEFAULT_KEYWORDS = [
  "Deal Pokket",
  "deal pokket",
  "DealPokket",
  "second hand",
  "second hand marketplace",
  "second hand marketplace India",
  "second hand buy sell",
  "free classified ads India",
  "free ad posting websites",
  "free ad posting sites India",
  "buy sell used items near me",
  "local marketplace India",
  "used products marketplace",
  "OLX alternative",
  "OLX alternative India",
  "sell second hand easily",
  "best value second hand",
] as const;

export const PUBLIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "daily" as const },
  { path: "/free-classifieds", priority: 0.95, changeFrequency: "weekly" as const },
  { path: "/olx-alternative", priority: 0.95, changeFrequency: "weekly" as const },
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

/** Collapse whitespace and cap a meta description so it fits a search snippet. */
export function metaDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > 80 ? cut.slice(0, lastSpace) : cut;
  return `${base.trimEnd()}…`;
}

const PRIVATE_AD_STATUSES = new Set([
  "draft",
  "pending",
  "rejected",
  "inactive",
  "blocked",
  "deleted",
  "hidden",
]);

/** Public listings stay indexable, including sold items marked out of stock. */
export function isIndexableAdStatus(status?: string | null): boolean {
  if (!status) return true;
  return !PRIVATE_AD_STATUSES.has(status.trim().toLowerCase());
}
