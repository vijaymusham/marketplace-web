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
import { useSelector } from "react-redux";
import type {
    ApiChat,
    ApiChatMessage,
    ApiUserPresence,
} from "@/components/types/AllTypes";
import type { RootState } from "@/components/redux/store";
import {
    appendMessageToCache,
    applyConversationUpdatedToCache,
    applyMessageReactionToCache,
    applyMessagesReadToCache,
    applyPresenceToCache,
    getMyUserId,
    setConversationTyping,
} from "@/components/chats/chatCache";

const SocketContext = createContext<Socket | null>(null);

function getSocketUrl() {
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    return base ? `${base}/chat` : "";
}

/** Socket payloads may be bare DTOs or `{ data: DTO }` envelopes. */
function unwrapSocketPayload<T extends object>(raw: unknown): T | null {
    if (!raw || typeof raw !== "object") return null;
    const obj = raw as Record<string, unknown>;
    if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
        return obj.data as T;
    }
    return raw as T;
}

function normalizePresence(raw: unknown): ApiUserPresence | null {
    const nested = unwrapSocketPayload<Record<string, unknown>>(raw);
    if (!nested) return null;
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
    const accessToken = useSelector(
        (state: RootState) => state.user.user?.accessToken ?? null,
    );

    useEffect(() => {
        const url = getSocketUrl();
        const token =
            accessToken ||
            (typeof window !== "undefined" ? localStorage.getItem("token") : null);

        if (!url || !token) {
            setSocket(null);
            return;
        }

        const isNgrok = /ngrok(-free)?\.(dev|app|io)$/i.test(
            (() => {
                try {
                    return new URL(url).hostname;
                } catch {
                    return "";
                }
            })(),
        );

        const socketInstance = io(url, {
            transports: ["websocket", "polling"],
            auth: { token },
            // Browsers ignore extraHeaders for WS; helps Node and polling where allowed.
            ...(isNgrok
                ? { extraHeaders: { "ngrok-skip-browser-warning": "1" } }
                : {}),
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 8000,
        });

        const handleConnect = () => {
            // Always publish the live instance so consumers re-join rooms on reconnect.
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

        const onMessageNew = (raw: unknown) => {
            const message = unwrapSocketPayload<ApiChatMessage>(raw);
            const chatId = message?.conversationId;
            if (!chatId || !message?.id) {
                console.warn("[socket:/chat] message.new missing ids", raw);
                return;
            }
            appendMessageToCache(queryClient, chatId, message);
        };

        const onConversationUpdated = (raw: unknown) => {
            const conversation = unwrapSocketPayload<ApiChat>(raw);
            if (!conversation?.id) return;
            applyConversationUpdatedToCache(queryClient, conversation);
        };

        const onMessagesRead = (raw: unknown) => {
            const data = unwrapSocketPayload<{
                conversationId?: string;
                readerId?: string;
                readAt?: string;
            }>(raw);
            if (!data?.conversationId) return;
            applyMessagesReadToCache(queryClient, {
                conversationId: data.conversationId,
                readerId: data.readerId,
                readAt: data.readAt,
            });
        };

        const onMessageReaction = (raw: unknown) => {
            const data = unwrapSocketPayload<{
                conversationId?: string;
                messageId?: string;
                actorId?: string;
                actorReaction?: string | null;
                reactions?: Array<{ type: string; count: number }>;
            }>(raw);
            if (!data?.conversationId || !data?.messageId) return;
            applyMessageReactionToCache(queryClient, {
                conversationId: data.conversationId,
                messageId: data.messageId,
                actorId: data.actorId,
                actorReaction: data.actorReaction,
                reactions: data.reactions,
            });
        };

        const onTyping = (raw: unknown) => {
            const data = unwrapSocketPayload<{
                conversationId?: string;
                userId?: string;
                isTyping?: boolean;
            }>(raw);
            if (!data?.conversationId) return;
            const myId = getMyUserId();
            if (myId && data.userId && data.userId === myId) return;
            setConversationTyping(
                queryClient,
                data.conversationId,
                Boolean(data.isTyping),
            );
        };

        const hardClose = () => {
            try {
                socketInstance.removeAllListeners();
                socketInstance.disconnect();
            } catch {
                /* ignore */
            }
            setSocket((prev) => (prev === socketInstance ? null : prev));
        };

        // Only on full tab close — do NOT use pagehide (fires on tab switch / bfcache).
        const onBeforeUnload = () => {
            try {
                socketInstance.disconnect();
            } catch {
                /* ignore */
            }
        };
        window.addEventListener("beforeunload", onBeforeUnload);

        socketInstance.on("connect", handleConnect);
        socketInstance.on("connect_error", handleConnectError);
        socketInstance.on("user.online", updatePresence);
        socketInstance.on("user.offline", updatePresence);
        socketInstance.on("user.presence", updatePresence);
        socketInstance.on("message.new", onMessageNew);
        socketInstance.on("conversation.updated", onConversationUpdated);
        socketInstance.on("messages.read", onMessagesRead);
        socketInstance.on("message.reaction", onMessageReaction);
        socketInstance.on("typing", onTyping);

        // If already connected (rare), publish immediately.
        if (socketInstance.connected) handleConnect();

        const heartbeat = setInterval(() => {
            if (socketInstance.connected) {
                socketInstance.emit("presence.ping", {});
            }
        }, 60_000);

        return () => {
            clearInterval(heartbeat);
            window.removeEventListener("beforeunload", onBeforeUnload);
            hardClose();
        };
    }, [queryClient, accessToken]);

    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}
