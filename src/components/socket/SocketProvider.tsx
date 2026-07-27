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
import type { ApiChatMessage, ApiUserPresence } from "@/components/types/AllTypes";
import type { RootState } from "@/components/redux/store";
import {
    appendMessageToCache,
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
    const accessToken = useSelector(
        (state: RootState) => state.user.user?.accessToken ?? null,
    );

    useEffect(() => {
        const url = getSocketUrl();
        const token =
            accessToken ||
            (typeof window !== "undefined" ? localStorage.getItem("token") : null);

        // No session → ensure any previous socket is gone.
        if (!url || !token) {
            setSocket(null);
            return;
        }

        const socketInstance = io(url, {
            transports: ["websocket", "polling"],
            auth: { token },
            // Avoid zombie reconnects after logout / tab close.
            reconnection: true,
            reconnectionAttempts: 8,
        });

        const handleConnect = () => {
            setSocket(socketInstance);
            socketInstance.emit("presence.ping", {});
        };

        const handleDisconnect = () => {
            setSocket((prev) => (prev === socketInstance ? null : prev));
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

        const onMessagesRead = (raw: {
            conversationId?: string;
            readerId?: string;
            readAt?: string;
        }) => {
            if (!raw?.conversationId) return;
            applyMessagesReadToCache(queryClient, {
                conversationId: raw.conversationId,
                readerId: raw.readerId,
                readAt: raw.readAt,
            });
        };

        const onMessageReaction = (raw: {
            conversationId?: string;
            messageId?: string;
            actorId?: string;
            actorReaction?: string | null;
            reactions?: Array<{ type: string; count: number }>;
        }) => {
            if (!raw?.conversationId || !raw?.messageId) return;
            applyMessageReactionToCache(queryClient, {
                conversationId: raw.conversationId,
                messageId: raw.messageId,
                actorId: raw.actorId,
                actorReaction: raw.actorReaction,
                reactions: raw.reactions,
            });
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

        const hardClose = () => {
            try {
                socketInstance.removeAllListeners();
                socketInstance.disconnect();
            } catch {
                /* ignore */
            }
            setSocket((prev) => (prev === socketInstance ? null : prev));
        };

        // Tab / window close — drop the connection so it does not linger.
        const onPageHide = () => {
            try {
                socketInstance.disconnect();
            } catch {
                /* ignore */
            }
        };
        window.addEventListener("pagehide", onPageHide);
        window.addEventListener("beforeunload", onPageHide);

        socketInstance.on("connect", handleConnect);
        socketInstance.on("disconnect", handleDisconnect);
        socketInstance.on("connect_error", handleConnectError);
        socketInstance.on("user.online", updatePresence);
        socketInstance.on("user.offline", updatePresence);
        socketInstance.on("user.presence", updatePresence);
        socketInstance.on("message.new", onMessageNew);
        socketInstance.on("messages.read", onMessagesRead);
        socketInstance.on("message.reaction", onMessageReaction);
        socketInstance.on("typing", onTyping);

        const heartbeat = setInterval(() => {
            if (socketInstance.connected) {
                socketInstance.emit("presence.ping", {});
            }
        }, 60_000);

        return () => {
            clearInterval(heartbeat);
            window.removeEventListener("pagehide", onPageHide);
            window.removeEventListener("beforeunload", onPageHide);
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
