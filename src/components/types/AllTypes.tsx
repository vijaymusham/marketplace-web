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
    imageUrl: string;
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


export type ApiWishlist = {
    id: string;
    title: string;
    imageUrl: string;
    isFavorite: boolean;
    price: number;
    currency: string;
    location: string;
    metadata: string;
    postedAt: string;
    postedAtLabel: string;
    favoritedAt: string;
    category: ApiCategory;
};

export type ApiSearchSuggestion = {
    text: string;
    category: string;
    subcategory: string;
};

export type ApiSearchSuggestionsData = {
    items: ApiSearchSuggestion[];
};

export type ApiSearchSuggestionsResponse = {
    success: boolean;
    message: string;
    data: ApiSearchSuggestionsData;
};


export type ApiCategoryAds = {
    success: boolean;
    message: string;
    data: {
        items: ApiAd[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export type ApiAd = {
    id: string;
    title: string;
    imageUrl: string;
    isFavorite: boolean;
    price: number;
    currency: string;
    location: string;
    metadata: string;
    postedAt: string;
    postedAtLabel: string;
};

export type ApiAdDetailImage = {
    id: string;
    url: string;
    displayOrder: number;
    isCover: boolean;
};

export type ApiAdDetailCategory = {
    id: string;
    name: string;
    slug: string;
};

export type ApiAdDetailCity = {
    id: string;
    name: string;
    type?: string;
    latitude?: number;
    longitude?: number;
};

/** Full `/ads/:id` detail payload. */
export type ApiAdDetail = {
    id: string;
    sellerId: string;
    categoryId: string;
    subCategoryId: string;
    category: ApiAdDetailCategory;
    subCategory: ApiAdDetailCategory;
    title: string;
    description: string;
    price: number;
    isNegotiable: boolean;
    stateId: string;
    cityId: string;
    city: ApiAdDetailCity | null;
    locality: string | null;
    latitude: number;
    longitude: number;
    sellerName: string;
    mobileNumber: string;
    categoryAttributes: Record<string, string>;
    status: string;
    soldAt: string | null;
    images: ApiAdDetailImage[];
    createdAt: string;
    updatedAt: string;
};


/** Unwrapped `/ads/filters` payload (after `{ success, message, data }` unwrap). */
export type ApiCategoryFilters = {
    sections: ApiCategoryFilterSection[];
};

export type ApiCategoryFilterSection = {
    key: string;
    title: string;
    icon: string;
    selectionType: string;
    queryKey: string;
    items: ApiCategoryFilterOption[];
};

export type ApiCategoryFilterOption = {
    label: string;
    value: string;
    queryKey: string;
    slug?: string;
    iconUrl?: string | null;
    children?: ApiCategoryFilterOption[];
};


export type ApiChatPeer = {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string;
    profilePhoto: string;
    identityVerified: boolean;
    isOnline: boolean;
    lastActiveAt: string;
    lastActiveLabel: string;
};

export type ApiChatOffer = {
    id: string;
    amount: number;
    currency: string;
    status: "pending" | "accepted" | "declined" | "withdrawn";
    statusLabel: string;
    listing: {
        id: string;
        title: string;
        price: number;
        currency: string;
        imageUrl: string;
    };
};

export type ApiChatMessage = {
    id: string;
    conversationId?: string;
    senderId: string;
    messageType: "text" | "images" | "offer" | "voice";
    content: string;
    mediaUrl?: string;
    deliveryStatus?: "sent" | "delivered" | "read";
    isRead?: boolean;
    readAt?: string;
    createdAt: string;
    updatedAt?: string;
    isMine: boolean;
    reactions?: {
        type: string;
        count: number;
        reactedByMe: boolean;
    }[];
    myReaction?: string | null;
    offer?: ApiChatOffer | null;
};

export type ApiChatMessageText = {
    messageType: "text" | "images" | "offer" | "voice";
    content: string;
    mediaUrl?: string;
};



export type ApiChats = {
    items: ApiChat[];
    allCount: number;
    unreadCount: number;
    onlineCount: number;
};

export type ApiChatLastMessagePreview = {
    id?: string;
    content: string;
    messageType?: "text" | "images" | "offer" | "voice";
    createdAt?: string;
};

export type ApiChat = {
    id: string;
    isPinned: boolean;
    listingId: string;
    myRole: string;
    peer: ApiChatPeer;
    listing: ApiAd;
    lastMessagePreview: ApiChatLastMessagePreview;
    lastMessageAt: string;
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
};

export type ApiUserPresence = {
    userId: string;
    isOnline: boolean;
    lastActiveAt: string;
    lastActiveLabel: string;
};
