"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiChatMessage, ApiUserPresence } from "@/components/types/AllTypes";
import {
    appendMessageToCache,
    applyPresenceToCache,
    getMyUserId,
    setConversationTyping,
} from "@/components/chats/chatCache";

const SocketContext = createContext<Socket | null>(null);

function getSocketUrl() {
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    return base ? `${base}/chat` : "";
}

function getAuthToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

function normalizePresence(raw: unknown): ApiUserPresence | null {
    if (!raw || typeof raw !== "object") return null;
    const obj = raw as Record<string, unknown>;
    const nested =
        obj.data && typeof obj.data === "object"
            ? (obj.data as Record<string, unknown>)
            : obj;
    const userId = nested.userId ?? nested.user_id ?? nested.id;
    if (typeof userId !== "string" || !userId) return null;
    return {
        userId,
        isOnline: Boolean(nested.isOnline ?? nested.is_online ?? nested.online),
        lastActiveAt:
            typeof nested.lastActiveAt === "string"
                ? nested.lastActiveAt
                : typeof nested.last_active_at === "string"
                    ? nested.last_active_at
                    : "",
        lastActiveLabel:
            typeof nested.lastActiveLabel === "string"
                ? nested.lastActiveLabel
                : typeof nested.last_active_label === "string"
                    ? nested.last_active_label
                    : "",
    };
}

export function SocketProvider({ children }: { children: ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        const url = getSocketUrl();
        const token = getAuthToken();
        if (!url || !token) return;

        const socketInstance = io(url, {
            transports: ["websocket", "polling"],
            auth: { token },
        });

        const handleConnect = () => {
            setSocket(socketInstance);
            socketInstance.emit("presence.ping", {});
        };

        const handleConnectError = (error: Error) => {
            console.warn("[socket:/chat] connect_error", error.message);
        };

        const updatePresence = (raw: unknown) => {
            const presence = normalizePresence(raw);
            if (!presence) {
                console.warn("[socket:/chat] presence payload unrecognized", raw);
                return;
            }
            applyPresenceToCache(queryClient, presence);
        };

        const onMessageNew = (raw: ApiChatMessage) => {
            const chatId = raw?.conversationId;
            if (!chatId || !raw?.id) return;
            appendMessageToCache(queryClient, chatId, raw);
        };

        const onTyping = (data: {
            conversationId?: string;
            userId?: string;
            isTyping?: boolean;
        }) => {
            if (!data.conversationId) return;
            const myId = getMyUserId();
            if (myId && data.userId && data.userId === myId) return;
            setConversationTyping(
                queryClient,
                data.conversationId,
                Boolean(data.isTyping),
            );
        };

        socketInstance.on("connect", handleConnect);
        socketInstance.on("connect_error", handleConnectError);
        socketInstance.on("user.online", updatePresence);
        socketInstance.on("user.offline", updatePresence);
        socketInstance.on("user.presence", updatePresence);
        socketInstance.on("message.new", onMessageNew);
        socketInstance.on("typing", onTyping);

        const heartbeat = setInterval(() => {
            if (socketInstance.connected) {
                socketInstance.emit("presence.ping", {});
            }
        }, 60_000);

        return () => {
            clearInterval(heartbeat);
            socketInstance.off("connect", handleConnect);
            socketInstance.off("connect_error", handleConnectError);
            socketInstance.off("user.online", updatePresence);
            socketInstance.off("user.offline", updatePresence);
            socketInstance.off("user.presence", updatePresence);
            socketInstance.off("message.new", onMessageNew);
            socketInstance.off("typing", onTyping);
            socketInstance.disconnect();
        };
    }, [queryClient]);

    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}
