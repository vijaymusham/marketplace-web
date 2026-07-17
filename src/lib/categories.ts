import {
  ShoppingBag,
  Headphones,
  Car,
  Sofa,
  Shirt,
  Smartphone,
  Building2,
  BookOpen,
  Dumbbell,
  Laptop,
  Baby,
  PawPrint,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type NavCategory = {
  name: string;
  icon: LucideIcon;
};

export type Category = {
  name: string;
  icon: LucideIcon;
};

export const navCategories: NavCategory[] = [
  { name: "All", icon: ShoppingBag },
  { name: "Electronics", icon: Headphones },
  { name: "Vehicles", icon: Car },
  { name: "Furniture", icon: Sofa },
  { name: "Fashion", icon: Shirt },
  { name: "Mobiles", icon: Smartphone },
  { name: "Real Estate", icon: Building2 },
  { name: "Books", icon: BookOpen },
  { name: "Sports", icon: Dumbbell },
];

export const categories: Category[] = [
  { name: "Mobiles & Tablets", icon: Smartphone },
  { name: "Electronics", icon: Laptop },
  { name: "Furniture", icon: Sofa },
  { name: "Fashion", icon: Shirt },
  { name: "Vehicles", icon: Car },
  { name: "Books & Hobbies", icon: BookOpen },
  { name: "Home & Living", icon: ShoppingBag },
  { name: "Sports & Fitness", icon: Dumbbell },
  { name: "Kids & Baby", icon: Baby },
  { name: "Real Estate", icon: Building2 },
  { name: "Pet Supplies", icon: PawPrint },
  { name: "Services", icon: Wrench },
];
