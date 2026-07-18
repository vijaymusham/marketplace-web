import { categories, type Category } from "@/lib/categories";

export const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export type SubcategoryMatch = {
  category: Category;
  subcategory: string;
};

export type CategoryMatch = {
  type: "category";
  category: Category;
};

export type SubcategoryRouteMatch = {
  type: "subcategory";
  category: Category;
  subcategory: string;
};

export type RouteMatch = CategoryMatch | SubcategoryRouteMatch;

export function findCategoryBySlug(slug: string): Category | null {
  return categories.find((c) => slugify(c.name) === slug) ?? null;
}

export function findSubcategoryBySlug(slug: string): SubcategoryMatch | null {
  for (const category of categories) {
    const subcategory = category.subcategories.find(
      (sub) => slugify(sub) === slug,
    );
    if (subcategory) return { category, subcategory };
  }
  return null;
}

/** Resolve a /category/[slug] — category routes win over subcategory on slug clash. */
export function findRouteBySlug(slug: string): RouteMatch | null {
  const category = findCategoryBySlug(slug);
  if (category) return { type: "category", category };

  const sub = findSubcategoryBySlug(slug);
  if (sub) return { type: "subcategory", ...sub };

  return null;
}

export function allCategorySlugs(): string[] {
  return categories.map((c) => slugify(c.name));
}

export function allSubcategorySlugs(): string[] {
  return categories.flatMap((c) => c.subcategories.map(slugify));
}

export function allCategoryPageSlugs(): string[] {
  return [...new Set([...allCategorySlugs(), ...allSubcategorySlugs()])];
}
