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

export function findSubcategoryBySlug(slug: string): SubcategoryMatch | null {
  for (const category of categories) {
    const subcategory = category.subcategories.find(
      (sub) => slugify(sub) === slug,
    );
    if (subcategory) return { category, subcategory };
  }
  return null;
}

export function allSubcategorySlugs(): string[] {
  return categories.flatMap((c) => c.subcategories.map(slugify));
}
