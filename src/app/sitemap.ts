import type { MetadataRoute } from "next";
import { allCitySlugs } from "@/lib/cities";
import { getSitemapListings } from "@/lib/listing-data";
import { absoluteUrl, PUBLIC_ROUTES } from "@/lib/seo";
import { allCategoryPageSlugs } from "@/lib/slug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const listings = await getSitemapListings();
  const listingPages: MetadataRoute.Sitemap = listings.map((ad) => {
    const posted = new Date(ad.postedAt);
    return {
      url: absoluteUrl(`/listing/${ad.id}`),
      lastModified: Number.isNaN(posted.getTime()) ? now : posted,
      changeFrequency: "daily" as const,
      priority: 0.6,
    };
  });

  return [...staticPages, ...cityPages, ...categoryPages, ...listingPages];
}
