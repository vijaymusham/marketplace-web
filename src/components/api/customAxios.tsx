"use client";

import axios, {
    AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "@/constant/firebase/firebase";
import { clearuser } from "@/components/redux/slices/authSlice";
import { persistor, store } from "@/components/redux/store";

export type ApiError = {
    message: string;
    status?: number;
    data?: unknown;
};

const PUBLIC_API_PATHS = [
    "/auth/phone/check",
    "/auth/firebase/verify",
    "/categories",
    "/states",
    "/cities",
    "/cities/popular",
    "/ads/fresh",
    "/ads/section",
];

function getApiOrigin() {
    return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
}

function getBaseURL() {
    const envUrl = getApiOrigin();
    if (typeof window !== "undefined") return "/backend";
    return envUrl || "/backend";
}

/** Free ngrok shows an HTML interstitial unless this header is present. */
function isNgrokOrigin(url = getApiOrigin()) {
    return /ngrok(-free)?\.(dev|app|io)$/i.test(
        (() => {
            try {
                return new URL(url).hostname;
            } catch {
                return "";
            }
        })(),
    );
}

function ngrokBypassHeaders(): Record<string, string> {
    return isNgrokOrigin() ? { "ngrok-skip-browser-warning": "1" } : {};
}

let isLoggingOut = false;

function isPublicPath(url = "") {
    return PUBLIC_API_PATHS.some((path) => url.includes(path));
}

function isUnauthorizedPayload(data: unknown): boolean {
    if (!data || typeof data !== "object") return false;
    const message = (data as { message?: unknown }).message;
    return typeof message === "string" && message.toLowerCase() === "unauthorized";
}

async function getAccessToken(): Promise<string | null> {
    if (typeof window === "undefined") return null;

    // Prefer app token first so interceptors never block the XHR on Firebase.
    const stored = localStorage.getItem("token");
    if (stored) return stored;

    const user = auth.currentUser;
    if (!user) return null;

    try {
        return await Promise.race([
            user.getIdToken(),
            new Promise<null>((resolve) => {
                window.setTimeout(() => resolve(null), 2500);
            }),
        ]);
    } catch {
        return null;
    }
}

async function clearAuthData() {
    const fcmToken = localStorage.getItem("fcmToken");
    const accessToken = localStorage.getItem("token");
    // Unregister while the session token is still available.
    if (fcmToken && accessToken) {
        try {
            await axios.delete(`${getBaseURL()}/notifications/device-token`, {
                data: { token: fcmToken },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    ...ngrokBypassHeaders(),
                },
                timeout: 8000,
            });
        } catch {
            /* ignore unregister failures during logout */
        }
    }
    localStorage.removeItem("token");
    localStorage.removeItem("fcmToken");
    store.dispatch(clearuser());
    await persistor.purge();
    await signOut(auth);
}

async function handleAutoLogout() {
    if (typeof window === "undefined" || isLoggingOut) return;

    isLoggingOut = true;

    try {
        await clearAuthData();
        if (window.location.pathname !== "/") {
            window.location.assign("/");
        }
    } catch {
        // Ignore logout failures — session is already invalid
        localStorage.removeItem("token");
        store.dispatch(clearuser());
        if (window.location.pathname !== "/") {
            window.location.assign("/");
        }
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
    baseURL: getBaseURL(),
    headers: {
        "Content-Type": "application/json",
        ...ngrokBypassHeaders(),
    },
    withCredentials: false
});

customAxios.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // Keep baseURL correct even if the module was evaluated early.
        config.baseURL = getBaseURL();

        // Forwarded through Next `/backend` rewrite so ngrok free doesn't return HTML.
        if (isNgrokOrigin()) {
            config.headers.set("ngrok-skip-browser-warning", "1");
        }

        if (!isPublicPath(config.url)) {
            const token = await getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
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
        const requestUrl = error.config?.url ?? "";

        // Auto-logout on unauthorized (invalid/expired session) — clear token, Redux, persist
        if (
            !isPublicPath(requestUrl) &&
            (status === 401 || isUnauthorizedPayload(error.response?.data))
        ) {
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
