import {
  ServicesIcon,
  type CategoryIconComponent,
} from "@/components/icons/category-icons";
import {
  categories as localCategories,
  type Category,
} from "@/lib/categories";
import { slugify } from "@/lib/slug";

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

export type ApiRouteMatch =
  | {
      type: "category";
      category: Category;
      categoryId?: string;
      subcategoryId?: string;
    }
  | {
      type: "subcategory";
      category: Category;
      subcategory: string;
      categoryId?: string;
      subcategoryId?: string;
    };

function toCategory(cat: NormalizedCategory): Category {
  return {
    name: cat.name,
    icon: cat.icon,
    image: "",
    subcategories: cat.subcategories,
  };
}

function matchesSlug(
  name: string,
  routeSlug: string | undefined,
  slug: string,
): boolean {
  return slugify(name) === slug || Boolean(routeSlug && routeSlug === slug);
}

/**
 * Resolve /category/[slug] against API categories (supports API-only
 * subcategories like Footwear). Prefers categoryId/subcategoryId when present.
 */
export function findApiRoute(
  categories: NormalizedCategory[],
  slug: string,
  ids?: { categoryId?: string; subcategoryId?: string },
): ApiRouteMatch | null {
  if (!categories.length || !slug) return null;

  const categoryId = ids?.categoryId?.trim() || "";
  const subcategoryId = ids?.subcategoryId?.trim() || "";

  if (subcategoryId) {
    for (const cat of categories) {
      if (categoryId && cat.id && cat.id !== categoryId) continue;
      const sub = cat.subcategoryItems.find((s) => s.id === subcategoryId);
      if (sub) {
        return {
          type: "subcategory",
          category: toCategory(cat),
          subcategory: sub.name,
          categoryId: cat.id,
          subcategoryId: sub.id,
        };
      }
    }
  }

  if (categoryId) {
    const cat = categories.find((c) => c.id === categoryId);
    if (cat) {
      const sub = cat.subcategoryItems.find((s) =>
        matchesSlug(s.name, s.slug, slug),
      );
      if (sub) {
        return {
          type: "subcategory",
          category: toCategory(cat),
          subcategory: sub.name,
          categoryId: cat.id,
          subcategoryId: sub.id,
        };
      }
      if (matchesSlug(cat.name, cat.slug, slug)) {
        return {
          type: "category",
          category: toCategory(cat),
          categoryId: cat.id,
        };
      }
    }
  }

  const category = categories.find((c) => matchesSlug(c.name, c.slug, slug));
  if (category) {
    return {
      type: "category",
      category: toCategory(category),
      categoryId: category.id,
    };
  }

  for (const cat of categories) {
    const sub = cat.subcategoryItems.find((s) =>
      matchesSlug(s.name, s.slug, slug),
    );
    if (sub) {
      return {
        type: "subcategory",
        category: toCategory(cat),
        subcategory: sub.name,
        categoryId: cat.id,
        subcategoryId: sub.id,
      };
    }
  }

  return null;
}

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
