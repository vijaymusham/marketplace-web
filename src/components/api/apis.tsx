import customAxios, { type ApiError } from "./customAxios";
import type { ApiAdsBySection, ApiCity, ApiFreshRecommendation, ApiState, CreateAdPayload } from "@/components/types/AllTypes";



// ==================== AUTH API ====================

export const authApi = async (
    idToken: string,
    payload?: {
        name: string;
        email: string;
        referralCode?: string;
    }
) => {
    const { data } = await customAxios.post("/auth/firebase/verify", {
        idToken,
        name: payload?.name,
        email: payload?.email,
        referralCode: payload?.referralCode,
    });
    return data;
};

export const authPhoneCheck = async (phone: string): Promise<{
    exists: boolean;
    message?: string;
} | null> => {
    try {
        const { data } = await customAxios.post("/auth/phone/check", { phone });
        return data;
    } catch (error) {
        console.log("====== Error authPhoneCheck ===> ", error);
        return null;
    }
};

export const getUser = async () => {
    try {
        const { data } = await customAxios.get("/auth/me");
        return data;
    } catch (error) {
        console.log("====== Error getUser ===> ", error);
        return null;
    }
};


export const getAds = async () => {
    try {
        const { data } = await customAxios.get("/ads");
        return data;
    } catch (error) {
        console.log("====== Error form ===> ", error);
        return null;
    }
};

export const getAdById = async (id: string) => {
    try {
        const { data } = await customAxios.get(`/ads/${id}`);
        return data;
    } catch (error) {
        console.log("====== Error form ===> ", error);
        return null;
    }
};

export const createSellForm = async (payload: CreateAdPayload) => {
    try {
        const { data } = await customAxios.post("/ads", payload);
        return data;
    } catch (error) {
        console.log("====== Error form ===> ", error);
        return null;
    }
};


export const getCategories = async () => {
    try {
        const { data } = await customAxios.get("/categories");
        return data;
    } catch (error) {
        console.log("====== Error getCategories ===> ", error);
        return null;
    }
};


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
    if ("data" in payload && (payload as { data?: unknown }).data && typeof (payload as { data: unknown }).data === "object") {
        return (payload as { data: T }).data;
    }
    return payload as T;
}



export const getStates = async (): Promise<ApiState[]> => {
    try {
        const { data } = await customAxios.get("/states");
        return unwrapList<ApiState>(data);
    } catch (error) {
        console.log("====== Error getStates ===> ", error);
        return [];
    }
};

export const getCities = async (stateId?: string): Promise<ApiCity[]> => {
    try {
        const { data } = await customAxios.get("/cities", {
            params: stateId ? { stateId } : undefined,
        });
        return unwrapList<ApiCity>(data);
    } catch (error) {
        console.log("====== Error getCities ===> ", error);
        return [];
    }
};
export const getPopularCities = async ({ latitude, longitude }: { latitude: number, longitude: number }): Promise<ApiCity[]> => {
    try {
        const { data } = await customAxios.get(`/cities/popular?latitude=${latitude}&longitude=${longitude}`, {
        });
        return unwrapList<ApiCity>(data);
    } catch (error) {
        console.log("====== Error getPopularCities ===> ", error);
        return [];
    }
};
export const getFreshAds = async ({ latitude, longitude }: { latitude: number, longitude: number }): Promise<ApiFreshRecommendation[]> => {
    try {
        const { data } = await customAxios.get(`/ads/fresh?latitude=${latitude}&longitude=${longitude}&count=10`);
        return unwrapList<ApiFreshRecommendation>(data);
    } catch (error) {
        console.log("====== Error getFreshAds ===> ", error);
        return [];
    }
};
export const getAdsBySection = async ({ latitude, longitude }: { latitude: number, longitude: number }): Promise<ApiAdsBySection | null> => {
    try {
        const { data } = await customAxios.get(`/ads/sections?latitude=${latitude}&longitude=${longitude}`);
        return unwrapData<ApiAdsBySection>(data);
    } catch (error) {
        console.log("====== Error getAdsBySection ===> ", error);
        return null;
    }
};
















export type { ApiError };

// ==================== CHAT API ====================
// Wired in `@/components/chats/chatApi.ts` — uncomment customAxios calls there:
//   GET    /chats
//   GET    /chats/:id/messages
//   POST   /chats/:id/messages
//   POST   /chats/:id/offers
