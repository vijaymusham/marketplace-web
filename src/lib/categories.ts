import {
  MobilesTabletsIcon,
  ElectronicsIcon,
  FurnitureIcon,
  FashionIcon,
  VehiclesIcon,
  BooksHobbiesIcon,
  HomeLivingIcon,
  SportsFitnessIcon,
  KidsBabyIcon,
  RealEstateIcon,
  PetSuppliesIcon,
  ServicesIcon,
  type CategoryIconComponent,
} from "@/components/icons/category-icons";
import { BicyclesIcon } from "@/components/icons/subcategory-icons";

export type Category = {
  name: string;
  icon: CategoryIconComponent;
  image: string;
  subcategories: string[];
};

const img = (keyword: string, lock: number) =>
  `https://loremflickr.com/400/400/${keyword}/all?lock=${lock}`;

export const categories: Category[] = [
    {
        name: "Bikes",
        icon: BicyclesIcon,
        image: img("bicycle", 101),
        subcategories: ["Bicycles", "Bike Accessories", "Bike Parts", "Bike Services"],
    },
  {
    name: "Mobiles & Tablets",
    icon: MobilesTabletsIcon,
    image: img("smartphone", 101),
    subcategories: ["Mobile Phones", "Tablets", "Accessories", "Smart Watches"],
  },
  {
    name: "Electronics",
    icon: ElectronicsIcon,
    image: img("laptop", 102),
    subcategories: [
      "TVs, Video - Audio",
      "Kitchen & Other Appliances",
      "Computers & Laptops",
      "Cameras & Lenses",
      "Games & Entertainment",
      "Fridges",
      "Computer Accessories",
      "Hard Disks, Printers & Monitors",
      "ACs",
      "Washing Machines",
    ],
  },
  {
    name: "Furniture",
    icon: FurnitureIcon,
    image: img("sofa", 103),
    subcategories: [
      "Sofa & Dining",
      "Beds & Wardrobes",
      "Home Decor & Garden",
      "Kids Furniture",
      "Other Household Items",
    ],
  },
  {
    name: "Fashion",
    icon: FashionIcon,
    image: img("fashion", 104),
    subcategories: ["Men", "Women", "Kids"],
  },
  {
    name: "Vehicles",
    icon: VehiclesIcon,
    image: img("car", 105),
    subcategories: [
      "Cars",
      "Motorcycles",
      "Scooters",
      "Bicycles",
      "Spare Parts",
      "Commercial & Other Vehicles",
    ],
  },
  {
    name: "Books & Hobbies",
    icon: BooksHobbiesIcon,
    image: img("books", 106),
    subcategories: [
      "Books",
      "Musical Instruments",
      "Games & Entertainment",
      "Other Hobbies",
    ],
  },
  {
    name: "Home & Living",
    icon: HomeLivingIcon,
    image: img("homedecor", 107),
    subcategories: [
      "Home Decor & Garden",
      "Kitchenware",
      "Lighting",
      "Other Household Items",
    ],
  },
  {
    name: "Sports & Fitness",
    icon: SportsFitnessIcon,
    image: img("dumbbell", 108),
    subcategories: ["Gym & Fitness", "Sports Equipment", "Cycling", "Other Sports"],
  },
  {
    name: "Kids & Baby",
    icon: KidsBabyIcon,
    image: img("babytoys", 109),
    subcategories: [
      "Toys",
      "Prams & Walkers",
      "Kids Clothing",
      "Kids Furniture",
    ],
  },
  {
    name: "Real Estate",
    icon: RealEstateIcon,
    image: img("architecture", 110),
    subcategories: [
      "For Sale: Houses & Apartments",
      "For Rent: Houses & Apartments",
      "Lands & Plots",
      "For Sale: New Projects & Properties",
      "For Rent: Shops & Offices",
      "For Sale: Shops & Offices",
      "PG & Guest Houses",
    ],
  },
  {
    name: "Pet Supplies",
    icon: PetSuppliesIcon,
    image: img("dog", 111),
    subcategories: [
      "Cats",
      "Pet Food & Accessories",
      "Dogs",
      "Fish & Aquarium",
      "Other Pets",
    ],
  },
//   {
//     name: "Jobs",
//     icon: ServicesIcon,
//     image: img("office", 113),
//     subcategories: [
//       "Full-time",
//       "Part-time",
//       "Internships",
//       "Work from Home",
//     ],
//   },
  {
    name: "Services",
    icon: ServicesIcon,
    image: img("handyman", 112),
    subcategories: [
      "Education & Classes",
      "Tours & Travel",
      "Electronics Repair & Services",
      "Health & Beauty",
      "Home Renovation & Repair",
      "Cleaning & Pest Control",
      "Legal & Documentation Services",
      "Packers & Movers",
      "Other Services",
    ],
  },
];
