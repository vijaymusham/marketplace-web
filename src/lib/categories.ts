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
  image: string;
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

const img = (keyword: string, lock: number) =>
  `https://loremflickr.com/400/400/${keyword}/all?lock=${lock}`;

export const categories: Category[] = [
  {
    name: "Mobiles & Tablets",
    icon: Smartphone,
    image: img("smartphone", 101),
  },
  { name: "Electronics", icon: Laptop, image: img("laptop", 102) },
  { name: "Furniture", icon: Sofa, image: img("sofa", 103) },
  { name: "Fashion", icon: Shirt, image: img("fashion", 104) },
  { name: "Vehicles", icon: Car, image: img("car", 105) },
  { name: "Books & Hobbies", icon: BookOpen, image: img("books", 106) },
  {
    name: "Home & Living",
    icon: ShoppingBag,
    image: img("homedecor", 107),
  },
  { name: "Sports & Fitness", icon: Dumbbell, image: img("dumbbell", 108) },
  { name: "Kids & Baby", icon: Baby, image: img("babytoys", 109) },
  { name: "Real Estate", icon: Building2, image: img("architecture", 110) },
  { name: "Pet Supplies", icon: PawPrint, image: img("dog", 111) },
  { name: "Services", icon: Wrench, image: img("handyman", 112) },
];
