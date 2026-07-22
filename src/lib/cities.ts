import { slugify } from "@/lib/slug";

export type City = {
  name: string;
  distance: string;
  keyword: string;
  lock: number;
  description: string;
};

export const cities: City[] = [
  {
    name: "Mumbai",
    distance: "46 km away",
    keyword: "mumbai",
    lock: 301,
    description:
      "India’s financial capital with fast-moving deals on electronics, vehicles, and apartments across suburbs and the island city.",
  },
  {
    name: "Pune",
    distance: "118 km away",
    keyword: "pune",
    lock: 302,
    description:
      "Student and IT hub packed with affordable mobiles, bikes, and rental homes near Hinjewadi, Kothrud, and Viman Nagar.",
  },
  {
    name: "Nashik",
    distance: "167 km away",
    keyword: "nashik",
    lock: 303,
    description:
      "Discover vineyard-city bargains — from family cars to home appliances — posted by trusted local sellers every day.",
  },
  {
    name: "Surat",
    distance: "271 km away",
    keyword: "surat",
    lock: 304,
    description:
      "Diamond city listings spanning fashion, furniture, and two-wheelers with strong resale activity across the city.",
  },
  {
    name: "Ahmedabad",
    distance: "441 km away",
    keyword: "ahmedabad",
    lock: 305,
    description:
      "Heritage meets hustle — browse cars, mobiles, and property deals across SG Highway, Satellite, and old city wards.",
  },
  {
    name: "Bengaluru",
    distance: "845 km away",
    keyword: "bangalore",
    lock: 306,
    description:
      "Tech capital deals on laptops, gadgets, and PGs. Fresh ads land daily from Koramangala to Whitefield.",
  },
  {
    name: "Hyderabad",
    distance: "623 km away",
    keyword: "hyderabad",
    lock: 307,
    description:
      "From Hitec City gadgets to old-city collectibles — find verified sellers and great second-hand value.",
  },
  {
    name: "Delhi",
    distance: "1,148 km away",
    keyword: "delhi",
    lock: 308,
    description:
      "NCR’s busiest marketplace for cars, mobiles, and furniture with high turnover across Delhi and satellite towns.",
  },
  {
    name: "Chennai",
    distance: "1,248 km away",
    keyword: "chennai",
    lock: 309,
    description:
      "Coastal city picks — scooters, appliances, and apartments listed across OMR, Anna Nagar, and Adyar.",
  },
  {
    name: "Kolkata",
    distance: "1,348 km away",
    keyword: "kolkata",
    lock: 310,
    description:
      "Warm locality deals on books, bikes, and home essentials from Salt Lake to South Kolkata.",
  },
  {
    name: "Jaipur",
    distance: "1,448 km away",
    keyword: "jaipur",
    lock: 311,
    description:
      "Pink City marketplace for vehicles, fashion, and heritage home décor posted by local sellers.",
  },
  {
    name: "Lucknow",
    distance: "1,548 km away",
    keyword: "lucknow",
    lock: 312,
    description:
      "Explore Nawabi-city listings — mobiles, cars, and rentals with steady daily inventory.",
  },
  {
    name: "Kanpur",
    distance: "1,648 km away",
    keyword: "kanpur",
    lock: 313,
    description:
      "Industrial-city bargains on bikes, appliances, and household goods from active local sellers.",
  },
  {
    name: "Indore",
    distance: "1,748 km away",
    keyword: "indore",
    lock: 314,
    description:
      "Central India’s food capital also serves up strong deals on electronics, scooters, and flats.",
  },
  {
    name: "Bhopal",
    distance: "1,848 km away",
    keyword: "bhopal",
    lock: 315,
    description:
      "Lake-city listings featuring cars, mobiles, and family homes with fair prices and quick responses.",
  },
  {
    name: "Coimbatore",
    distance: "1,948 km away",
    keyword: "coimbatore",
    lock: 316,
    description:
      "Textile-city marketplace for bikes, gadgets, and apartments popular with students and families.",
  },
];

export function getCityImage(city: City, size = "1200/640") {
  return `https://loremflickr.com/${size}/${city.keyword},city/all?lock=${city.lock}`;
}

export function findCityBySlug(slug: string): City | null {
  return cities.find((c) => slugify(c.name) === slug) ?? null;
}

export function allCitySlugs(): string[] {
  return cities.map((c) => slugify(c.name));
}
