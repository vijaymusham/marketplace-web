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

export function getSubcategoryNames(cat: ApiCategory): string[] {
  if (Array.isArray(cat.subCategories)) {
    return cat.subCategories.map((s) => s.name).filter(Boolean);
  }
  if (!Array.isArray(cat.subcategories)) return [];
  return cat.subcategories
    .map((s) => (typeof s === "string" ? s : s.name))
    .filter(Boolean);
}

/** Normalize GET /categories payload (API uses `subCategories`). */
export function normalizeApiCategories(raw: unknown): NormalizedCategory[] {
  const list = Array.isArray(raw) ? (raw as ApiCategory[]) : [];
  return list.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: resolveLocalCategoryIcon(cat.name),
    subcategories: getSubcategoryNames(cat),
  }));
}
