export type Listing = {
  id: number;
  title: string;
  price: string;
  meta?: string;
  location: string;
  date: string;
  featured?: boolean;
  image: string;
};

const img = (keyword: string, lock: number) =>
  `https://loremflickr.com/480/440/${keyword}/all?lock=${lock}`;

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
