/** Form-only common keys — mapped to CreateAdPayload; not sent inside categoryAttributes. */
export const SELL_FORM_COMMON_KEYS = [
    "title",
    "category",
    "subcategory",
    "price",
    "isNegotiable",
    "description",
    "state",
    "city",
    "neighbourhood",
    "latitude",
    "longitude",
    "sellerName",
    "mobile",
    "images",
] as const;

export type CreateAdImage = {
    url: string;
    displayOrder: number;
    isCover: boolean;
};

/** POST /ads body — common fields + category-specific attrs. */
export type CreateAdPayload = {
    categoryId: string;
    subCategoryId: string;
    title: string;
    description: string;
    price: number;
    isNegotiable: boolean;
    stateId: string;
    cityId: string;
    locality: string;
    latitude: number;
    longitude: number;
    sellerName: string;
    mobileNumber: string;
    images: CreateAdImage[];
    categoryAttributes: Record<string, string>;
};

export type SellFormValues = {
    // Common ad fields
    title: string;
    category: string;
    subcategory: string;
    condition: string;
    price: string;
    isNegotiable: string;
    description: string;
    state: string;
    city: string;
    neighbourhood: string;
    latitude: string;
    longitude: string;
    sellerName: string;
    mobile: string;
    images?: string[];

    // Shared / vehicles
    brand: string;
    model: string;
    variant: string;
    year: string;
    fuel: string;
    transmission: string;
    kmDriven: string;
    owners: string;
    insuranceValidTill: string;
    registrationState: string;
    color: string;
    type: string;

    // Mobiles
    ram: string;
    storage: string;
    warrantyAvailable: string;
    billAvailable: string;

    // Electronics
    warranty: string;

    // Properties
    listingType: string;
    propertyType: string;
    bhk: string;
    bathrooms: string;
    furnishing: string;
    listedBy: string;
    superBuiltupArea: string;
    carpetArea: string;
    bachelorsAllowed: string;
    maintenance: string;
    totalFloors: string;
    floorNo: string;
    carParking: string;
    parking: string;
    facing: string;
    projectName: string;
    projectStatus: string;
    plotArea: string;
    length: string;
    breadth: string;
    subtype: string;
    mealsIncluded: string;
    washrooms: string;
    projectType: string;
    typeOfProperty: string;
    developerName: string;
    reraNo: string;
    projectLaunchMonth: string;
    projectLaunchYear: string;
    expectedPossessionMonth: string;
    expectedPossessionYear: string;
    priceFrom: string;
    priceTo: string;
    pricingType: string;
    keyAmenities: string;
    noOfTowers: string;
    noOfFloors: string;
    totalUnits: string;

    // Furniture
    furnitureType: string;
    material: string;

    // Fashion
    size: string;
    gender: string;

    // Pets
    petType: string;
    breed: string;
    age: string;
    vaccinated: string;

    // Jobs
    jobType: string;
    companyName: string;
    salaryFrom: string;
    salaryTo: string;
    experience: string;
    qualification: string;
    workMode: string;

    // Services
    serviceType: string;
    serviceArea: string;
};

export const emptySellFormValues: SellFormValues = {
    title: "",
    category: "",
    subcategory: "",
    condition: "",
    price: "",
    isNegotiable: "",
    description: "",
    state: "",
    city: "",
    neighbourhood: "",
    latitude: "",
    longitude: "",
    sellerName: "",
    mobile: "",
    brand: "",
    model: "",
    variant: "",
    year: "",
    fuel: "",
    transmission: "",
    kmDriven: "",
    owners: "",
    insuranceValidTill: "",
    registrationState: "",
    color: "",
    type: "",
    ram: "",
    storage: "",
    warrantyAvailable: "",
    billAvailable: "",
    warranty: "",
    listingType: "",
    propertyType: "",
    bhk: "",
    bathrooms: "",
    furnishing: "",
    listedBy: "",
    superBuiltupArea: "",
    carpetArea: "",
    bachelorsAllowed: "",
    maintenance: "",
    totalFloors: "",
    floorNo: "",
    carParking: "",
    parking: "",
    facing: "",
    projectName: "",
    projectStatus: "",
    plotArea: "",
    length: "",
    breadth: "",
    subtype: "",
    mealsIncluded: "",
    washrooms: "",
    projectType: "",
    typeOfProperty: "",
    developerName: "",
    reraNo: "",
    projectLaunchMonth: "",
    projectLaunchYear: "",
    expectedPossessionMonth: "",
    expectedPossessionYear: "",
    priceFrom: "",
    priceTo: "",
    pricingType: "",
    keyAmenities: "",
    noOfTowers: "",
    noOfFloors: "",
    totalUnits: "",
    furnitureType: "",
    material: "",
    size: "",
    gender: "",
    petType: "",
    breed: "",
    age: "",
    vaccinated: "",
    jobType: "",
    companyName: "",
    salaryFrom: "",
    salaryTo: "",
    experience: "",
    qualification: "",
    workMode: "",
    serviceType: "",
    serviceArea: "",
};


export type ApiState = {
    id: string;
    name: string;
    code?: string;
    isActive?: boolean;
};

export type ApiCity = {
    id: string;
    stateId: string;
    name: string;
    image: string;
    latitude: number;
    longitude: number;
    distanceKm: number;
    distanceLabel: string;
};


export type ApiCityPopular = {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
};

export type ApiCategory = {
    id: string;
    name: string;
    slug: string;
};

export type ApiFreshRecommendation = {
    id: string;
    title: string;
    imageUrl: string;
    isFeatured: boolean;
    isFavorite: boolean;
    price: number;
    currency: string;
    location: string;
    metadata: string;
    postedAt: string;
    postedAtLabel: string;
    category: ApiCategory;
};


export type ApiAdsBySectionAd = {
    id: string;
    title: string;
    imageUrl: string;
    isFavorite: boolean;
    price: number;
    currency: string;
    location: string;
    postedAt: string;
    postedAtLabel: string;
};

export type ApiAdsSection = {
    title: string;
    subtitle: string;
    bgClass: string;
    viewAllSlug: string;
    ads: ApiAdsBySectionAd[];
};

export type ApiAdsBySection = {
    laptopsDesktops: ApiAdsSection;
    mobilesTablets: ApiAdsSection;
    tvAudio: ApiAdsSection;
    homeKitchen: ApiAdsSection;
};
