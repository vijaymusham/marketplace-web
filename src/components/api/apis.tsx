import customAxios, { type ApiError } from "./customAxios";
import type { SellFormValues } from "@/components/types/AllTypes";

export type CreateAdPayload = {
    data: SellFormValues;
    images: File[];
};

function buildAdFormData({ data, images }: CreateAdPayload) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value == null) return;
        const trimmed = String(value).trim();
        if (!trimmed) return;
        formData.append(key, trimmed);
    });

    images.forEach((file) => {
        formData.append("images", file);
    });

    return formData;
}

export const getAds = async () => {
    const { data } = await customAxios.get("/ads");
    return data;
};

export const getAdById = async (id: string) => {
    const { data } = await customAxios.get(`/ads/${id}`);
    return data;
};

export const createSellForm = async (payload: CreateAdPayload) => {
    const formData = buildAdFormData(payload);
    const { data } = await customAxios.post("/ads", formData);
    return data;
};

export type { ApiError };
