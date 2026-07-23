export type Listing = {
  id: string | number;
  title: string;
  price: string;
  meta?: string;
  location: string;
  date: string;
  featured?: boolean;
  isFavorite?: boolean;
  image: string;
};

const img = (keyword: string, lock: number) =>
  `https://loremflickr.com/480/440/${keyword}/all?lock=${lock}`;

const SELLERS = [
  { name: "Aarav Sharma", city: "Noida" },
  { name: "Priya Patel", city: "Hyderabad" },
  { name: "Rohan Deshmukh", city: "Nagpur" },
  { name: "Ananya Iyer", city: "Pune" },
  { name: "Vikram Singh", city: "Hinganghat" },
];

export function getListingById(id: string | number): Listing | undefined {
  return listings.find((l) => String(l.id) === String(id));
}

function listingSeed(id: string | number): number {
  if (typeof id === "number") return id;
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

/** Extra gallery frames derived from the main image (varied locks). */
export function getListingImages(listing: Listing): string[] {
  const base = listing.image.split("?")[0];
  const seed = listingSeed(listing.id) * 17;
  return [
    listing.image,
    `${base}?lock=${seed + 1}`,
    `${base}?lock=${seed + 2}`,
    `${base}?lock=${seed + 3}`,
    `${base}?lock=${seed + 4}`,
  ];
}

export function getListingSeller(listing: Listing) {
  const seed = listingSeed(listing.id);
  const seller = SELLERS[seed % SELLERS.length];
  return {
    name: seller.name,
    memberSince: 2019 + (seed % 6),
    adsPosted: 4 + ((seed * 3) % 28),
    verified: seed % 3 !== 0,
    initials: seller.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2),
  };
}

export type ListingKind =
  | "vehicle"
  | "bike"
  | "mobile"
  | "property"
  | "fashion"
  | "electronics"
  | "general";

export function getListingKind(listing: Listing): ListingKind {
  const t = `${listing.title} ${listing.meta ?? ""} ${listing.image}`.toLowerCase();
  if (/bike|motorcycle|scooter|activa/.test(t)) return "bike";
  if (/bmw|honda city|dzire|car|xdrive|petrol|diesel|\bkm\b/.test(t)) return "vehicle";
  if (/iphone|vivo|phone|mobile|tablet|watch/.test(t)) return "mobile";
  if (/bhk|house|flat|plot|sqfeet|sqft|rent|shop for sale|apartment/.test(t)) return "property";
  if (/shirt|kurti|dress|earring|jhumka|wig|fashion/.test(t)) return "fashion";
  if (/drone|projector|tv|laptop|camera|console|forza|gaming|usb|hdmi/.test(t))
    return "electronics";
  return "general";
}

export function getListingKindLabel(kind: ListingKind): string {
  const map: Record<ListingKind, string> = {
    vehicle: "Cars",
    bike: "Bikes",
    mobile: "Mobiles",
    property: "Property",
    fashion: "Fashion",
    electronics: "Electronics",
    general: "Marketplace",
  };
  return map[kind];
}

export function getListingDescription(listing: Listing): string {
  const kind = getListingKind(listing);
  const intros: Record<ListingKind, string> = {
    vehicle:
      "Clean ownership papers and a smooth drive experience. Inspected for engine health and body condition.",
    bike: "Ready to ride — clutch, brakes and tyres checked. Ideal for daily commute or weekend trips.",
    mobile:
      "Fully tested — display, battery and cameras work as expected. Original accessories mentioned by seller.",
    property:
      "Spacious layout with natural light. Suitable for families looking for a comfortable living space.",
    fashion:
      "Gently used and carefully stored. Fits true to size based on seller notes.",
    electronics:
      "Powered on and verified before listing. Comes with available cables or box where mentioned.",
    general:
      "Well maintained and ready for a quick handover. Posted on DealMarket by a local seller.",
  };
  return [
    listing.title + ".",
    listing.meta ? `Key info: ${listing.meta}.` : null,
    intros[kind],
    listing.featured ? "Featured for higher visibility." : null,
    `Posted ${listing.date}.`,
  ]
    .filter(Boolean)
    .join(" ");
}

export function getListingSpecs(listing: Listing): { label: string; value: string }[] {
  const kind = getListingKind(listing);
  const seed = listingSeed(listing.id);
  const condition = seed % 2 === 0 ? "Used · Good" : "Like New";
  const base = [
    { label: "Condition", value: condition },
    { label: "Posted", value: listing.date },
    { label: "Ad ID", value: `DM-${1848200000 + seed}` },
  ];

  if (kind === "vehicle") {
    const [year, km] = (listing.meta ?? "2020 · 45,000 km").split("·").map((s) => s.trim());
    return [
      { label: "Year", value: year || "—" },
      { label: "Kilometers", value: km || "—" },
      { label: "Fuel", value: /diesel/i.test(listing.title) ? "Diesel" : "Petrol" },
      { label: "Transmission", value: seed % 2 ? "Automatic" : "Manual" },
      { label: "Owners", value: seed % 3 === 0 ? "2nd" : "1st" },
      ...base,
    ];
  }

  if (kind === "bike") {
    const [year, km] = (listing.meta ?? "2018 · 22,000 km").split("·").map((s) => s.trim());
    return [
      { label: "Year", value: year || "—" },
      { label: "Kilometers", value: km || "—" },
      { label: "Engine", value: `${100 + (seed % 5) * 25} cc` },
      { label: "Owners", value: "1st" },
      ...base,
    ];
  }

  if (kind === "mobile") {
    return [
      { label: "Brand", value: /iphone|apple/i.test(listing.title) ? "Apple" : /vivo/i.test(listing.title) ? "Vivo" : "Smartphone" },
      { label: "Storage", value: seed % 2 ? "256 GB" : "128 GB" },
      { label: "RAM", value: seed % 2 ? "8 GB" : "6 GB" },
      { label: "Battery health", value: `${88 + (seed % 10)}%` },
      { label: "Warranty", value: seed % 2 ? "3 months left" : "Bill + box" },
      ...base,
    ];
  }

  if (kind === "property") {
    const meta = listing.meta ?? "2 BHK · 2 Bathroom · 1100 sqft";
    const parts = meta.split("·").map((s) => s.trim());
    return [
      { label: "Type", value: /plot|sqfeet|land/i.test(listing.title) ? "Plot" : /rent/i.test(listing.title) ? "For rent" : "For sale" },
      { label: "Configuration", value: parts[0] || "—" },
      { label: "Bathrooms", value: parts[1] || "—" },
      { label: "Area", value: parts[2] || parts[0] || "—" },
      { label: "Furnishing", value: seed % 2 ? "Semi-furnished" : "Unfurnished" },
      ...base,
    ];
  }

  if (kind === "fashion") {
    return [
      { label: "Category", value: "Apparel" },
      { label: "Size", value: ["S", "M", "L", "XL"][seed % 4] },
      { label: "Material", value: seed % 2 ? "Cotton blend" : "Premium fabric" },
      ...base,
    ];
  }

  if (kind === "electronics") {
    return [
      { label: "Category", value: "Gadgets" },
      { label: "Power", value: "Tested & working" },
      { label: "Includes", value: seed % 2 ? "Box + cable" : "Device only" },
      ...(listing.meta ? [{ label: "Notes", value: listing.meta }] : []),
      ...base,
    ];
  }

  return [
    ...(listing.meta ? [{ label: "Highlights", value: listing.meta }] : []),
    ...base,
  ];
}

export const listings: Listing[] = [
  {
    id: 1,
    title: "BMW X5 xDrive40i M Sport, 2025, Petrol",
    price: "₹ 98,50,000",
    meta: "2025 · 8,000 km",
    location: "Sector 15, Noida",
    date: "Jun 23",
    featured: true,
    image: img("bmw,car", 401),
  },
  {
    id: 2,
    title: "Honda City ZX 2009 model car",
    price: "₹ 2,10,000",
    meta: "2009 · 131,475 km",
    location: "Diamond Hills, Hyderabad",
    date: "6 days ago",
    featured: true,
    image: img("honda,car", 402),
  },
  {
    id: 3,
    title: "Vivo V 50 RAM 8 256 Three month old",
    price: "₹ 7,500",
    location: "Samudrapur, Maharashtra",
    date: "Yesterday",
    image: img("smartphone", 403),
  },
  {
    id: 4,
    title: "I phone 13 with Bill box and charger",
    price: "₹ 8,500",
    location: "Samudrapur, Maharashtra",
    date: "2 days ago",
    image: img("iphone", 404),
  },
  {
    id: 5,
    title: "Maruti Suzuki Dzire VDI 2019 model",
    price: "₹ 2,15,000",
    meta: "2019 · 83,500 km",
    location: "Samudrapur MIDC, Maharashtra",
    date: "Jul 06",
    image: img("suzuki,car", 405),
  },
  {
    id: 6,
    title: "Urgent saleing for bike",
    price: "₹ 45,000",
    meta: "2008 · 60 km",
    location: "Samudrapur MIDC, Maharashtra",
    date: "Jun 28",
    image: img("motorcycle", 406),
  },
  {
    id: 7,
    title: "Rent 3bhk house",
    price: "₹ 12,000",
    meta: "3 BHK · 3 Bathroom · 1800 sqft",
    location: "Adersh Nagar, Hinganghat",
    date: "Jul 10",
    image: img("house", 407),
  },
  {
    id: 8,
    title: "Men's Casual Shirt",
    price: "₹ 450",
    location: "Samudrapur MIDC, Maharashtra",
    date: "5 days ago",
    image: img("shirt", 408),
  },
  {
    id: 9,
    title: "Shop for sale in hinganghat",
    price: "₹ 13,75,000",
    location: "Jagannath Ward, Hinganghat",
    date: "Jul 06",
    featured: true,
    image: img("shop,storefront", 409),
  },
  {
    id: 10,
    title: "Pingmintention kit",
    price: "₹ 950",
    location: "Samudrapur MIDC, Maharashtra",
    date: "Jul 07",
    image: img("tools", 410),
  },
  {
    id: 11,
    title: "1286 sqfeet plot for sal",
    price: "₹ 2,11,000",
    location: "Jangona, Hinganghat",
    date: "Jul 04",
    image: img("land,field", 411),
  },
  {
    id: 12,
    title: "jhumka Earrings",
    price: "₹ 250",
    location: "Samudrapur, Maharashtra",
    date: "Jul 06",
    image: img("earrings,jewelry", 412),
  },
  {
    id: 13,
    title: "Drone DJ camera",
    price: "₹ 2,000",
    location: "Samudrapur, Maharashtra",
    date: "3 days ago",
    image: img("drone", 413),
  },
  {
    id: 14,
    title: "Forza horizon 6, Forza Motorsport online, Cyberpunk, and more",
    price: "₹ 599",
    location: "Samudrapur, Maharashtra",
    date: "Jun 25",
    image: img("videogame", 414),
  },
  {
    id: 15,
    title: "RD5 3D 4K projector wifi smart youtube live tv usb hdmi 185 inch size",
    price: "₹ 3,500",
    location: "Samudrapur, Maharashtra",
    date: "Jul 10",
    image: img("projector", 415),
  },
  {
    id: 16,
    title: "Forza horizon 6, Forza horizon 5, Forza horizon 4 and more",
    price: "₹ 599",
    location: "Samudrapur, Maharashtra",
    date: "Jun 24",
    image: img("gaming,console", 416),
  },
  {
    id: 17,
    title: "RD5 projector 3D 4K wifi smart youtube live tv usb hdmi 145 inch size",
    price: "₹ 6,500",
    location: "Samudrapur, Maharashtra",
    date: "Jul 10",
    image: img("cinema,projector", 417),
  },
  {
    id: 18,
    title: "Human wig online sell all India delivery",
    price: "₹ 999",
    location: "Samudrapur, Maharashtra",
    date: "Jun 21",
    image: img("wig,hair", 418),
  },
  {
    id: 19,
    title: "NEW LIMITED OFFER METAL LIGHT WITH SOLAR LED CHARGEABLE BULB TORCH",
    price: "₹ 999",
    location: "Samudrapur, Maharashtra",
    date: "Jul 08",
    image: img("flashlight,lamp", 419),
  },
  {
    id: 20,
    title: "Kurti for 10-18 years girl",
    price: "₹ 350",
    location: "Sant Tukdoji Ward, Hinganghat",
    date: "2 days ago",
    image: img("dress,fashion", 420),
  },
];
