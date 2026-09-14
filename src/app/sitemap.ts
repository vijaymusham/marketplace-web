import type { MetadataRoute } from "next";
import { allCitySlugs } from "@/lib/cities";
import { absoluteUrl, PUBLIC_ROUTES } from "@/lib/seo";
import { allCategoryPageSlugs } from "@/lib/slug";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const cityPages: MetadataRoute.Sitemap = allCitySlugs().map((slug) => ({
    url: absoluteUrl(`/city/${slug}`),
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = allCategoryPageSlugs().map(
    (slug) => ({
      url: absoluteUrl(`/category/${slug}`),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.75,
    }),
  );

  return [...staticPages, ...cityPages, ...categoryPages];
}
