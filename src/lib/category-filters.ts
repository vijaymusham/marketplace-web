export type FilterOption = {
  id: string;
  label: string;
  count?: number;
};

export type FilterGroup = {
  id: string;
  label: string;
  icon: "search" | "sparkles" | "percent" | "tag" | "sliders";
  options: FilterOption[];
};

/** Dynamic filter groups based on parent category + active subcategory. */
export function getFiltersForSubcategory(
  categoryName: string,
  subcategory: string,
): FilterGroup[] {
  const common: FilterGroup[] = [
    {
      id: "new-arrival",
      label: "New Arrival",
      icon: "search",
      options: [
        { id: "today", label: "Posted today", count: 12 },
        { id: "week", label: "This week", count: 48 },
        { id: "month", label: "This month", count: 120 },
      ],
    },
    {
      id: "best-seller",
      label: "Best Seller",
      icon: "sparkles",
      options: [
        { id: "top-rated", label: "Top rated", count: 36 },
        { id: "most-viewed", label: "Most viewed", count: 64 },
        { id: "verified", label: "Verified sellers", count: 28 },
      ],
    },
    {
      id: "on-discount",
      label: "On Discount",
      icon: "percent",
      options: [
        { id: "10", label: "10% or more", count: 18 },
        { id: "25", label: "25% or more", count: 9 },
        { id: "50", label: "50% or more", count: 4 },
      ],
    },
  ];

  const byCategory: Record<string, FilterGroup[]> = {
    "Mobiles & Tablets": [
      {
        id: "brand",
        label: "Brand",
        icon: "tag",
        options: [
          { id: "apple", label: "Apple", count: 22 },
          { id: "samsung", label: "Samsung", count: 31 },
          { id: "xiaomi", label: "Xiaomi", count: 19 },
          { id: "oneplus", label: "OnePlus", count: 14 },
        ],
      },
      {
        id: "condition",
        label: "Condition",
        icon: "sliders",
        options: [
          { id: "new", label: "Brand new", count: 8 },
          { id: "like-new", label: "Like new", count: 26 },
          { id: "good", label: "Good", count: 40 },
        ],
      },
    ],
    Electronics: [
      {
        id: "brand",
        label: "Brand",
        icon: "tag",
        options: [
          { id: "sony", label: "Sony", count: 15 },
          { id: "lg", label: "LG", count: 18 },
          { id: "samsung", label: "Samsung", count: 24 },
          { id: "apple", label: "Apple", count: 11 },
        ],
      },
      {
        id: "condition",
        label: "Condition",
        icon: "sliders",
        options: [
          { id: "new", label: "Brand new", count: 6 },
          { id: "like-new", label: "Like new", count: 20 },
          { id: "good", label: "Good", count: 35 },
        ],
      },
    ],
    Vehicles: [
      {
        id: "brand",
        label: "Brand",
        icon: "tag",
        options: [
          { id: "maruti", label: "Maruti", count: 42 },
          { id: "hyundai", label: "Hyundai", count: 28 },
          { id: "honda", label: "Honda", count: 21 },
          { id: "tata", label: "Tata", count: 17 },
        ],
      },
      {
        id: "year",
        label: "Year",
        icon: "sliders",
        options: [
          { id: "2024+", label: "2024 & newer", count: 12 },
          { id: "2020-23", label: "2020 – 2023", count: 38 },
          { id: "pre-2020", label: "Before 2020", count: 55 },
        ],
      },
    ],
    Fashion: [
      {
        id: "size",
        label: "Size",
        icon: "sliders",
        options: [
          { id: "s", label: "S", count: 14 },
          { id: "m", label: "M", count: 22 },
          { id: "l", label: "L", count: 18 },
          { id: "xl", label: "XL", count: 11 },
        ],
      },
    ],
    Furniture: [
      {
        id: "material",
        label: "Material",
        icon: "tag",
        options: [
          { id: "wood", label: "Wood", count: 30 },
          { id: "metal", label: "Metal", count: 16 },
          { id: "fabric", label: "Fabric", count: 21 },
        ],
      },
    ],
    "Real Estate": [
      {
        id: "bhk",
        label: "BHK",
        icon: "sliders",
        options: [
          { id: "1", label: "1 BHK", count: 24 },
          { id: "2", label: "2 BHK", count: 41 },
          { id: "3", label: "3 BHK", count: 33 },
          { id: "4+", label: "4+ BHK", count: 12 },
        ],
      },
    ],
  };

  const specific = byCategory[categoryName] ?? [
    {
      id: "condition",
      label: `${subcategory} condition`,
      icon: "sliders" as const,
      options: [
        { id: "new", label: "Brand new", count: 10 },
        { id: "like-new", label: "Like new", count: 22 },
        { id: "good", label: "Good", count: 34 },
      ],
    },
  ];

  return [...common, ...specific];
}
