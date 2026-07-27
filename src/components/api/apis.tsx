import customAxios, { type ApiError } from "./customAxios";
import type {
    ApiAdsBySection,
    ApiCity,
    ApiFreshRecommendation,
    ApiSearchSuggestion,
    ApiSearchSuggestionsResponse,
    ApiState,
    CreateAdPayload,
    ApiWishlist,
    ApiCategoryAds,
    ApiCategoryFilters,
    ApiAd,
    ApiAdDetail,
    ApiChat,
    ApiChatMessage,
    ApiChatMessageText,
    ApiChats,
    ApiUserPresence,
} from "@/components/types/AllTypes";

/** States/cities APIs wrap the list in `{ success, message, data }`. */
function unwrapList<T>(payload: unknown): T[] {
    if (Array.isArray(payload)) return payload as T[];
    if (payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)) {
        return (payload as { data: T[] }).data;
    }
    return [];
}

/** Object responses may be bare or wrapped in `{ success, message, data }`. */
function unwrapData<T>(payload: unknown): T | null {
    if (!payload || typeof payload !== "object") return null;
    if (
        "data" in payload &&
        (payload as { data?: unknown }).data &&
        typeof (payload as { data: unknown }).data === "object"
    ) {
        return (payload as { data: T }).data;
    }
    return payload as T;
}

function rethrow(label: string, error: unknown): never {
    console.log(`====== Error ${label} ===> `, error);
    throw error;
}

// ==================== AUTH API ====================

export const authApi = async (
    idToken: string,
    payload?: {
        name?: string;
        email?: string;
        referralCode?: string;
        platform?: "ios" | "android" | "web";
        fcmToken?: string;
    },
) => {
    try {
        const { data } = await customAxios.post("/auth/firebase/verify", {
            idToken,
            name: payload?.name,
            email: payload?.email,
            referralCode: payload?.referralCode,
            platform: payload?.platform ?? "web",
            fcmToken: payload?.fcmToken,
        });
        return data;
    } catch (error) {
        rethrow("authApi", error);
    }
};

export const authPhoneCheck = async (
    phone: string,
): Promise<{
    exists: boolean;
    message?: string;
}> => {
    try {
        const { data } = await customAxios.post("/auth/phone/check", { phone });
        return data;
    } catch (error) {
        rethrow("authPhoneCheck", error);
    }
};

export const getUser = async () => {
    try {
        const { data } = await customAxios.get("/auth/me");
        return data;
    } catch (error) {
        rethrow("getUser", error);
    }
};

export const getAds = async () => {
    try {
        const { data } = await customAxios.get("/ads");
        return data;
    } catch (error) {
        rethrow("getAds", error);
    }
};

export const getAdById = async (id: string): Promise<ApiAdDetail> => {
    try {
        const { data } = await customAxios.get(`/ads/${id}`);
        const ad = unwrapData<ApiAdDetail>(data);
        if (!ad) throw { message: "Listing not found" } satisfies ApiError;
        return ad;
    } catch (error) {
        rethrow("getAdById", error);
    }
};

export const createSellForm = async (payload: CreateAdPayload) => {
    try {
        const { data } = await customAxios.post("/ads", payload);
        return data;
    } catch (error) {
        rethrow("createSellForm", error);
    }
};

export const getCategories = async () => {
    try {
        const { data } = await customAxios.get("/categories");
        return data;
    } catch (error) {
        rethrow("getCategories", error);
    }
};

export const getStates = async (): Promise<ApiState[]> => {
    try {
        const { data } = await customAxios.get("/states");
        return unwrapList<ApiState>(data);
    } catch (error) {
        rethrow("getStates", error);
    }
};

export const getCities = async (stateId?: string): Promise<ApiCity[]> => {
    try {
        const { data } = await customAxios.get("/cities", {
            params: stateId ? { stateId } : undefined,
        });
        return unwrapList<ApiCity>(data);
    } catch (error) {
        rethrow("getCities", error);
    }
};

export const getPopularCities = async ({
    latitude,
    longitude,
}: {
    latitude: number;
    longitude: number;
}): Promise<ApiCity[]> => {
    try {
        const { data } = await customAxios.get(
            `/cities/popular?latitude=${latitude}&longitude=${longitude}`,
        );
        return unwrapList<ApiCity>(data);
    } catch (error) {
        rethrow("getPopularCities", error);
    }
};

export const getFreshAds = async ({
    latitude,
    longitude,
}: {
    latitude: number;
    longitude: number;
}): Promise<ApiFreshRecommendation[]> => {
    try {
        const { data } = await customAxios.get(
            `/ads/fresh?latitude=${latitude}&longitude=${longitude}&count=10`,
        );
        return unwrapList<ApiFreshRecommendation>(data);
    } catch (error) {
        rethrow("getFreshAds", error);
    }
};

export const getAdsBySection = async ({
    latitude,
    longitude,
}: {
    latitude: number;
    longitude: number;
}): Promise<ApiAdsBySection> => {
    try {
        const { data } = await customAxios.get(
            `/ads/sections?latitude=${latitude}&longitude=${longitude}`,
        );
        const sections = unwrapData<ApiAdsBySection>(data);
        if (!sections) throw { message: "Failed to load ad sections" } satisfies ApiError;
        return sections;
    } catch (error) {
        rethrow("getAdsBySection", error);
    }
};

export const getWishlist = async (): Promise<ApiWishlist[]> => {
    try {
        const { data } = await customAxios.get("/favorites");
        return unwrapList<ApiWishlist>(data);
    } catch (error) {
        rethrow("getWishlist", error);
    }
};

export const addToWishlist = async (listingId: string) => {
    try {
        const { data } = await customAxios.post(`/favorites/${listingId}`);
        return unwrapData<ApiWishlist>(data);
    } catch (error) {
        rethrow("addToWishlist", error);
    }
};

export const removeFromWishlist = async (listingId: string) => {
    try {
        const { data } = await customAxios.delete(`/favorites/${listingId}`);
        return unwrapData<ApiWishlist>(data);
    } catch (error) {
        rethrow("removeFromWishlist", error);
    }
};

export const getSearchSuggestions = async (
    query: string,
): Promise<ApiSearchSuggestion[]> => {
    try {
        const { data } = await customAxios.get<ApiSearchSuggestionsResponse>(
            `/ads/search/suggest?q=${query}&limit=8`,
        );
        const items = data?.data?.items;
        return Array.isArray(items) ? items : [];
    } catch (error) {
        rethrow("getSearchSuggestions", error);
    }
};

export const getMyAds = async (): Promise<ApiAd[]> => {
    try {
        const { data } = await customAxios.get("/ads/my");
        return unwrapList<ApiAd>(data);
    } catch (error) {
        rethrow("getMyAds", error);
    }
};

export type UpdateAdPayload = Partial<CreateAdPayload> & {
    soldAt?: string;
};

/** Format: `2026-07-22 08:18:24.438563+00` */
export function formatSoldAtTimestamp(date: Date = new Date()): string {
    const iso = date.toISOString();
    const [day, timeWithZ] = iso.split("T");
    const time = timeWithZ.replace("Z", "");
    const [hms, fraction = "000"] = time.split(".");
    const micros = fraction.padEnd(6, "0").slice(0, 6);
    return `${day} ${hms}.${micros}+00`;
}

export const updateAds = async (id: string, payload: UpdateAdPayload) => {
    try {
        const { data } = await customAxios.put(`/ads/${id}`, payload);
        return data;
    } catch (error) {
        rethrow("updateAds", error);
    }
};

export type GetCategoriesAdsParams = {
    categoryId: string;
    subCategoryId?: string;
    brand?: string;
    type?: string;
    cityId?: string;
    stateId?: string;
    locality?: string;
    latitude?: number;
    longitude?: number;
    minPrice?: number;
    maxPrice?: number;
    minKmsDriven?: number;
    maxKmsDriven?: number;
    minYear?: number;
    maxYear?: number;
    fuel?: string;
    postedWithin?: string;
    verifiedSeller?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
    /** Extra dynamic filter query keys → values from `/ads/filters`. */
    filters?: Record<string, string[]>;
};

function appendAdsFilterParams(
    params: Record<string, string | number | boolean>,
    key: string,
    values: string[],
) {
    if (!key || !values.length) return;
    if (key === "verifiedSeller") {
        params.verifiedSeller = values.includes("true");
        return;
    }
    if (key === "sort") {
        params.sort = values[0];
        return;
    }
    params[key] = values.length === 1 ? values[0] : values.join(",");
}

export const getCategoriesAds = async ({
    categoryId,
    subCategoryId,
    brand,
    type,
    cityId,
    stateId,
    locality,
    latitude,
    longitude,
    minPrice,
    maxPrice,
    minKmsDriven,
    maxKmsDriven,
    minYear,
    maxYear,
    fuel,
    postedWithin,
    verifiedSeller,
    sort = "date",
    page = 1,
    limit = 20,
    filters,
}: GetCategoriesAdsParams): Promise<ApiCategoryAds> => {
    try {
        const params: Record<string, string | number | boolean> = {
            categoryId,
            sort,
            page,
            limit,
        };

        if (subCategoryId) params.subCategoryId = subCategoryId;
        if (brand) params.brand = brand;
        if (type) params.type = type;
        if (cityId) params.cityId = cityId;
        if (stateId) params.stateId = stateId;
        if (locality) params.locality = locality;
        if (typeof latitude === "number") params.latitude = latitude;
        if (typeof longitude === "number") params.longitude = longitude;
        if (typeof minPrice === "number") params.minPrice = minPrice;
        if (typeof maxPrice === "number") params.maxPrice = maxPrice;
        if (typeof minKmsDriven === "number") params.minKmsDriven = minKmsDriven;
        if (typeof maxKmsDriven === "number") params.maxKmsDriven = maxKmsDriven;
        if (typeof minYear === "number") params.minYear = minYear;
        if (typeof maxYear === "number") params.maxYear = maxYear;
        if (fuel) params.fuel = fuel;
        if (postedWithin) params.postedWithin = postedWithin;
        if (typeof verifiedSeller === "boolean") params.verifiedSeller = verifiedSeller;

        if (filters) {
            for (const [key, values] of Object.entries(filters)) {
                appendAdsFilterParams(params, key, values);
            }
        }

        const { data } = await customAxios.get("/ads", { params });
        const ads = unwrapData<ApiCategoryAds>(data);
        if (!ads) throw { message: "Failed to load ads" } satisfies ApiError;
        return ads;
    } catch (error) {
        rethrow("getCategoriesAds", error);
    }
};

export const getCategoryListingFilters = async ({
    categoryId,
    subCategoryId,
}: {
    categoryId?: string;
    subCategoryId?: string;
}): Promise<ApiCategoryFilters> => {
    try {
        const { data } = await customAxios.get(
            `/ads/filters?categoryId=${categoryId}&subCategoryId=${subCategoryId}`,
        );
        const filters = unwrapData<ApiCategoryFilters>(data);
        if (!filters) throw { message: "Failed to load filters" } satisfies ApiError;
        return filters;
    } catch (error) {
        rethrow("getCategoryListingFilters", error);
    }
};

// ==================== CHAT API ====================

export const createChat = async (payload: { listingId: string }) => {
    try {
        const { data } = await customAxios.post("/chat/conversations", payload);
        const chat = unwrapData<ApiChat>(data);
        if (!chat) throw { message: "Couldn’t create chat" } satisfies ApiError;
        return chat;
    } catch (error) {
        rethrow("createChat", error);
    }
};

export const getChats = async (filter: string = "all", page: number = 1): Promise<ApiChats> => {
    try {
        const { data } = await customAxios.get(`/chat/conversations?filter=${filter}&page=${page}`);
        return unwrapData<ApiChats>(data) ?? { items: [], allCount: 0, unreadCount: 0, onlineCount: 0 };
    } catch (error) {
        rethrow("getChats", error);
    }
};

export const getChatById = async (id: string): Promise<ApiChat> => {
    try {
        const { data } = await customAxios.get(`/chat/conversations/${id}`);
        const chat = unwrapData<ApiChat>(data);
        if (!chat) throw { message: "Chat not found" } satisfies ApiError;
        return chat;
    } catch (error) {
        rethrow("getChatById", error);
    }
};

export const sendMessage = async (id: string, payload: ApiChatMessageText) => {
    try {
        const { data } = await customAxios.post(
            `/chat/conversations/${id}/messages`,
            payload,
        );
        const message = unwrapData<ApiChatMessage>(data);
        if (!message) throw { message: "Couldn’t send message" } satisfies ApiError;
        return message;
    } catch (error) {
        rethrow("sendMessage", error);
    }
};

export const deleteChat = async (id: string) => {
    try {
        const { data } = await customAxios.delete(`/chat/conversations/${id}`);
        return unwrapData(data) ?? data;
    } catch (error) {
        rethrow("deleteChat", error);
    }
};

export const getChatMessages = async (
    id: string,
): Promise<ApiChatMessage[]> => {
    try {
        const { data } = await customAxios.get(
            `/chat/conversations/${id}/messages?limit=40`,
        );
        const unwrapped = unwrapData<{ items?: ApiChatMessage[] } | ApiChatMessage[]>(data);
        if (Array.isArray(unwrapped)) return unwrapped;
        if (unwrapped && Array.isArray(unwrapped.items)) return unwrapped.items;
        return unwrapList<ApiChatMessage>(data);
    } catch (error) {
        rethrow("getChatMessages", error);
    }
};

export const createOffer = async (
    id: string,
    payload: { amount: number; currency?: string; note?: string },
) => {
    try {
        const { data } = await customAxios.post(
            `/chat/conversations/${id}/offers`,
            payload,
        );
        const offer = unwrapData(data);
        if (!offer) throw { message: "Couldn’t create offer" } satisfies ApiError;
        return offer;
    } catch (error) {
        rethrow("createOffer", error);
    }
};

export const markChatRead = async (id: string) => {
    try {
        const { data } = await customAxios.post(`/chat/conversations/${id}/read`);
        return unwrapData(data) ?? data;
    } catch (error) {
        rethrow("markChatRead", error);
    }
};

export const updateConversation = async (
    id: string,
    payload: { pinned: boolean },
) => {
    try {
        const { data } = await customAxios.put(
            `/chat/conversations/${id}/pin`,
            payload,
        );
        return unwrapData<ApiChat>(data) ?? data;
    } catch (error) {
        rethrow("updateConversation", error);
    }
};

export const reactToMessage = async (
    messageId: string,
    payload: { emoji: string },
) => {
    try {
        const { data } = await customAxios.put(
            `/chat/messages/${messageId}/reaction`,
            payload,
        );
        return unwrapData(data) ?? data;
    } catch (error) {
        rethrow("reactToMessage", error);
    }
};

export const removeReaction = async (messageId: string) => {
    try {
        const { data } = await customAxios.delete(
            `/chat/messages/${messageId}/reaction`,
        );
        return unwrapData(data) ?? data;
    } catch (error) {
        rethrow("removeReaction", error);
    }
};

export const deleteMessage = async (messageId: string) => {
    try {
        const { data } = await customAxios.delete(`/chat/messages/${messageId}`);
        return unwrapData(data) ?? data;
    } catch (error) {
        rethrow("deleteMessage", error);
    }
};

export const updateOffer = async (
    id: string,
    payload: { action: "accept" | "reject" | "withdraw" },
) => {
    try {
        const { data } = await customAxios.patch(`/chat/offers/${id}`, payload);
        const offer = unwrapData(data);
        if (!offer) throw { message: "Couldn’t update offer" } satisfies ApiError;
        return offer;
    } catch (error) {
        rethrow("updateOffer", error);
    }
};

// export const blockUser = async (userId: string) => {
//     try {
//         const { data } = await customAxios.post(`/chat/users/${userId}/block`);
//         return unwrapData(data) ?? data;
//     } catch (error) {
//         rethrow("blockUser", error);
//     }
// };

// export const unblockUser = async (userId: string) => {
//     try {
//         const { data } = await customAxios.delete(`/chat/users/${userId}/block`);
//         return unwrapData(data) ?? data;
//     } catch (error) {
//         rethrow("unblockUser", error);
//     }
// };

export const getUserPresence = async (userId: string): Promise<ApiUserPresence> => {
    try {
        const { data } = await customAxios.get(`/chat/users/${userId}/presence`);
        console.log("datas", data);
        const presence = unwrapData<ApiUserPresence>(data);
        if (!presence) throw { message: "Presence not found" } satisfies ApiError;
        return presence;
    } catch (error) {
        rethrow("getUserPresence", error);
    }
};

export type { ApiError };
