import {
  MobilePhonesIcon,
  TabletsIcon,
  AccessoriesIcon,
  SmartWatchesIcon,
  TvsVideoAudioIcon,
  KitchenAppliancesIcon,
  ComputersLaptopsIcon,
  CamerasLensesIcon,
  GamesEntertainmentIcon,
  FridgesIcon,
  ComputerAccessoriesIcon,
  HardDisksPrintersMonitorsIcon,
  AcsIcon,
  WashingMachinesIcon,
  SofaDiningIcon,
  BedsWardrobesIcon,
  HomeDecorGardenIcon,
  KidsFurnitureIcon,
  OtherHouseholdItemsIcon,
  MenIcon,
  WomenIcon,
  KidsIcon,
  CarsIcon,
  MotorcyclesIcon,
  ScootersIcon,
  BicyclesIcon,
  SparePartsIcon,
  CommercialVehiclesIcon,
  BooksIcon,
  MusicalInstrumentsIcon,
  OtherHobbiesIcon,
  KitchenwareIcon,
  LightingIcon,
  GymFitnessIcon,
  SportsEquipmentIcon,
  CyclingIcon,
  OtherSportsIcon,
  ToysIcon,
  PramsWalkersIcon,
  KidsClothingIcon,
  ForSaleHousesIcon,
  ForRentHousesIcon,
  LandsPlotsIcon,
  NewProjectsIcon,
  ForRentShopsIcon,
  ForSaleShopsIcon,
  PgGuestHousesIcon,
  FishesAquariumIcon,
  PetFoodAccessoriesIcon,
  DogsIcon,
  OtherPetsIcon,
  EducationClassesIcon,
  ToursTravelIcon,
  ElectronicsRepairIcon,
  HealthBeautyIcon,
  HomeRenovationIcon,
  CleaningPestControlIcon,
  LegalDocumentationIcon,
  PackersMoversIcon,
  OtherServicesIcon,
  SubcategoryFallbackIcon,
} from "@/components/icons/subcategory-icons";
import type { CategoryIconComponent } from "@/components/icons/category-icons";
import { slugify } from "@/lib/slug";

const icons: Record<string, CategoryIconComponent> = {
  // Mobiles & Tablets
  "Mobile Phones": MobilePhonesIcon,
  Tablets: TabletsIcon,
  Accessories: AccessoriesIcon,
  "Mobile Accessories": AccessoriesIcon,
  "Smart Watches": SmartWatchesIcon,
  // Electronics
  "TVs, Video - Audio": TvsVideoAudioIcon,
  "Kitchen & Other Appliances": KitchenAppliancesIcon,
  "Computers & Laptops": ComputersLaptopsIcon,
  "Cameras & Lenses": CamerasLensesIcon,
  "Games & Entertainment": GamesEntertainmentIcon,
  Fridges: FridgesIcon,
  "Computer Accessories": ComputerAccessoriesIcon,
  "Hard Disks, Printers & Monitors": HardDisksPrintersMonitorsIcon,
  ACs: AcsIcon,
  "Washing Machines": WashingMachinesIcon,
  // Furniture
  "Sofa & Dining": SofaDiningIcon,
  "Beds & Wardrobes": BedsWardrobesIcon,
  "Home Decor & Garden": HomeDecorGardenIcon,
  "Kids Furniture": KidsFurnitureIcon,
  "Other Household Items": OtherHouseholdItemsIcon,
  // Fashion
  Men: MenIcon,
  Women: WomenIcon,
  Kids: KidsIcon,
  Footwear: AccessoriesIcon,
  // Vehicles / Bikes
  Cars: CarsIcon,
  Motorcycles: MotorcyclesIcon,
  Scooters: ScootersIcon,
  Bicycles: BicyclesIcon,
  "Spare Parts": SparePartsIcon,
  "2-Wheeler Spare Parts": SparePartsIcon,
  Trucks: CommercialVehiclesIcon,
  "Commercial & Other Vehicles": CommercialVehiclesIcon,
  // Books & Hobbies
  Books: BooksIcon,
  "Musical Instruments": MusicalInstrumentsIcon,
  "Other Hobbies": OtherHobbiesIcon,
  // Home & Living
  Kitchenware: KitchenwareIcon,
  Lighting: LightingIcon,
  // Sports & Fitness
  "Gym & Fitness": GymFitnessIcon,
  "Sports Equipment": SportsEquipmentIcon,
  Cycling: CyclingIcon,
  "Other Sports": OtherSportsIcon,
  // Kids & Baby
  Toys: ToysIcon,
  "Prams & Walkers": PramsWalkersIcon,
  "Kids Clothing": KidsClothingIcon,
  // Real Estate
  "For Sale: Houses & Apartments": ForSaleHousesIcon,
  "For Rent: Houses & Apartments": ForRentHousesIcon,
  "Lands & Plots": LandsPlotsIcon,
  "For Sale: New Projects & Properties": NewProjectsIcon,
  "For Rent: Shops & Offices": ForRentShopsIcon,
  "For Sale: Shops & Offices": ForSaleShopsIcon,
  "PG & Guest Houses": PgGuestHousesIcon,
  // Pet Supplies (API uses "Fish & Aquarium"; keep legacy "Fishes" alias)
  "Fish & Aquarium": FishesAquariumIcon,
  "Fishes & Aquarium": FishesAquariumIcon,
  "Pet Food & Accessories": PetFoodAccessoriesIcon,
  Dogs: DogsIcon,
  Cats: DogsIcon,
  "Other Pets": OtherPetsIcon,
  // Services
  "Education & Classes": EducationClassesIcon,
  "Tours & Travel": ToursTravelIcon,
  "Electronics Repair & Services": ElectronicsRepairIcon,
  "Health & Beauty": HealthBeautyIcon,
  "Home Renovation & Repair": HomeRenovationIcon,
  "Cleaning & Pest Control": CleaningPestControlIcon,
  "Legal & Documentation Services": LegalDocumentationIcon,
  "Packers & Movers": PackersMoversIcon,
  "Other Services": OtherServicesIcon,
};

const iconsBySlug = new Map(
  Object.entries(icons).map(([name, icon]) => [slugify(name), icon]),
);

export function getSubcategoryIcon(name: string): CategoryIconComponent {
  if (!name) return SubcategoryFallbackIcon;
  return (
    icons[name] ??
    iconsBySlug.get(slugify(name)) ??
    SubcategoryFallbackIcon
  );
}
