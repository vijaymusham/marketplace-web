import {
  ServicesIcon,
  type CategoryIconComponent,
} from "@/components/icons/category-icons";
import { categories as localCategories } from "@/lib/categories";

export type ApiSubCategory = {
  id?: string;
  name: string;
  slug?: string;
};

export type ApiCategory = {
  id?: string;
  name: string;
  slug?: string;
  subCategories?: ApiSubCategory[];
  subcategories?: string[] | ApiSubCategory[];
};

export type NormalizedCategory = {
  id?: string;
  name: string;
  slug?: string;
  icon: CategoryIconComponent;
  subcategories: string[];
  subcategoryItems: ApiSubCategory[];
};

export function resolveLocalCategoryIcon(name: string): CategoryIconComponent {
  const lower = name.trim().toLowerCase();
  const exact = localCategories.find((c) => c.name.toLowerCase() === lower);
  if (exact) return exact.icon;

  const partial = localCategories.find(
    (c) =>
      c.name.toLowerCase().includes(lower) ||
      lower.includes(c.name.toLowerCase()),
  );
  return partial?.icon ?? ServicesIcon;
}

export function getSubcategoryItems(cat: ApiCategory): ApiSubCategory[] {
  if (Array.isArray(cat.subCategories) && cat.subCategories.length > 0) {
    return cat.subCategories.filter((s) => Boolean(s?.name));
  }
  if (!Array.isArray(cat.subcategories)) return [];
  return cat.subcategories
    .map((s) => (typeof s === "string" ? { id: s, name: s } : s))
    .filter((s) => Boolean(s?.name));
}

export function getSubcategoryNames(cat: ApiCategory): string[] {
  return getSubcategoryItems(cat).map((s) => s.name);
}

/** Normalize GET /categories payload (API uses `subCategories`). */
export function normalizeApiCategories(raw: unknown): NormalizedCategory[] {
  const list = Array.isArray(raw)
    ? (raw as ApiCategory[])
    : raw &&
        typeof raw === "object" &&
        Array.isArray((raw as { data?: unknown }).data)
      ? ((raw as { data: ApiCategory[] }).data)
      : [];
  return list.map((cat) => {
    const subcategoryItems = getSubcategoryItems(cat);
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: resolveLocalCategoryIcon(cat.name),
      subcategories: subcategoryItems.map((s) => s.name),
      subcategoryItems,
    };
  });
}
