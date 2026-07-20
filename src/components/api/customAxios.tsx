import axios, {
    AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "@/constant/firebase/firebase";

export type ApiError = {
    message: string;
    status?: number;
    data?: unknown;
};

let isLoggingOut = false;

async function getAccessToken(): Promise<string | null> {
    if (typeof window === "undefined") return null;

    const user = auth.currentUser;
    if (user) {
        try {
            return await user.getIdToken();
        } catch {
            // Fall through to stored token
        }
    }

    return localStorage.getItem("token");
}

async function handleAutoLogout() {
    if (typeof window === "undefined" || isLoggingOut) return;

    isLoggingOut = true;

    try {
        localStorage.removeItem("token");
        await signOut(auth);
        toast.error("Session expired. Please sign in again.");
    } catch {
        // Ignore logout failures — session is already invalid
    } finally {
        window.setTimeout(() => {
            isLoggingOut = false;
        }, 2000);
    }
}

function getErrorMessage(error: AxiosError): string {
    if (!error.response) {
        if (error.code === "ECONNABORTED") {
            return "Request timed out. Please try again.";
        }
        return "Network error. Please check your connection.";
    }

    const data = error.response.data as
        | { message?: string; error?: string; errors?: string[] }
        | string
        | undefined;

    if (typeof data === "string" && data.trim()) return data;

    if (data && typeof data === "object") {
        if (data.message) return data.message;
        if (data.error) return data.error;
        if (Array.isArray(data.errors) && data.errors[0]) return data.errors[0];
    }

    switch (error.response.status) {
        case 400:
            return "Invalid request. Please check your input.";
        case 401:
            return "Unauthorized. Please sign in again.";
        case 403:
            return "You don’t have permission to do that.";
        case 404:
            return "The requested resource was not found.";
        case 422:
            return "Validation failed. Please check your input.";
        case 429:
            return "Too many requests. Please wait and try again.";
        case 500:
        case 502:
        case 503:
            return "Server error. Please try again later.";
        default:
            return error.message || "Something went wrong. Please try again.";
    }
}

const customAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 30_000,
});

customAxios.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Let the browser set multipart boundary for FormData
        if (typeof FormData !== "undefined" && config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        return config;
    },
    (error) => Promise.reject(error)
);

customAxios.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
        if (!axios.isAxiosError(error)) {
            const apiError: ApiError = {
                message: "Something went wrong. Please try again.",
            };
            return Promise.reject(apiError);
        }

        const status = error.response?.status;

        // Auto-logout only on unauthorized (invalid/expired session)
        if (status === 401) {
            await handleAutoLogout();
        }

        const apiError: ApiError = {
            message: getErrorMessage(error),
            status,
            data: error.response?.data,
        };

        return Promise.reject(apiError);
    }
);

export default customAxios;
