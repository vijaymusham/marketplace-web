import type { QueryClient } from "@tanstack/react-query";
import type {
    ApiChat,
    ApiChatMessage,
    ApiChats,
    ApiUserPresence,
} from "../types/AllTypes";
import { store } from "@/components/redux/store";

export const chatKeys = {
    lists: ["chats"] as const,
    list: (filter: string) => ["chats", filter] as const,
    detail: (id: string) => ["chat", id] as const,
    messages: (id: string) => ["chat-messages", id] as const,
    typing: (id: string) => ["chat-typing", id] as const,
};

export function getMyUserId(): string | null {
    return store.getState().user.user?.user?.id ?? null;
}

/** WS/REST sometimes send isMine from the sender's POV — derive from senderId. */
export function normalizeChatMessage(
    message: ApiChatMessage,
    myUserId: string | null = getMyUserId(),
    peerId?: string | null,
): ApiChatMessage {
    let isMine = Boolean(message.isMine);
    if (myUserId && message.senderId) {
        isMine = message.senderId === myUserId;
    } else if (peerId && message.senderId) {
        isMine = message.senderId !== peerId;
    }
    return { ...message, isMine };
}

export function previewTextForMessage(message: ApiChatMessage): string {
    if (typeof message.content === "string" && message.content.trim()) {
        return message.content;
    }
    if (message.messageType === "offer") {
        const amount = message.offer?.amount;
        return typeof amount === "number"
            ? `Offer · ₹${amount.toLocaleString("en-IN")}`
            : "Offer";
    }
    if (message.messageType === "images" || message.messageType === "image") {
        return "Photo";
    }
    if (message.messageType === "voice") return "Voice message";
    return "Message";
}

const typingClearTimers = new Map<string, number>();

export function setConversationTyping(
    queryClient: QueryClient,
    conversationId: string,
    isTyping: boolean,
) {
    queryClient.setQueryData<boolean>(chatKeys.typing(conversationId), isTyping);

    const prev = typingClearTimers.get(conversationId);
    if (prev != null) window.clearTimeout(prev);

    if (isTyping) {
        const timer = window.setTimeout(() => {
            queryClient.setQueryData<boolean>(chatKeys.typing(conversationId), false);
            typingClearTimers.delete(conversationId);
        }, 4000);
        typingClearTimers.set(conversationId, timer);
    } else {
        typingClearTimers.delete(conversationId);
    }
}

/** Find a conversation already loaded in any chats list cache. */
export function findChatInCache(
    queryClient: QueryClient,
    chatId: string,
): ApiChat | undefined {
    const caches = queryClient.getQueriesData<ApiChats>({ queryKey: chatKeys.lists });
    for (const [, data] of caches) {
        const found = data?.items?.find((c) => c.id === chatId);
        if (found) return found;
    }
    return queryClient.getQueryData<ApiChat>(chatKeys.detail(chatId));
}

function recomputeUnreadCount(items: ApiChat[]) {
    return items.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
}

/** Patch one conversation across every cached chats list. */
export function patchChatInLists(
    queryClient: QueryClient,
    chatId: string,
    patch: (chat: ApiChat) => ApiChat,
) {
    queryClient.setQueriesData<ApiChats>({ queryKey: chatKeys.lists }, (old) => {
        if (!old?.items) return old;
        let changed = false;
        const items = old.items.map((c) => {
            if (c.id !== chatId) return c;
            changed = true;
            return patch(c);
        });
        if (!changed) return old;
        return { ...old, items, unreadCount: recomputeUnreadCount(items) };
    });

    queryClient.setQueryData<ApiChat>(chatKeys.detail(chatId), (old) =>
        old ? patch(old) : old,
    );
}

export function removeChatFromLists(queryClient: QueryClient, chatId: string) {
    queryClient.setQueriesData<ApiChats>({ queryKey: chatKeys.lists }, (old) => {
        if (!old?.items) return old;
        const items = old.items.filter((c) => c.id !== chatId);
        if (items.length === old.items.length) return old;
        return {
            ...old,
            items,
            allCount: Math.max(0, (old.allCount ?? items.length) - 1),
            unreadCount: recomputeUnreadCount(items),
        };
    });
    queryClient.removeQueries({ queryKey: chatKeys.detail(chatId) });
    queryClient.removeQueries({ queryKey: chatKeys.messages(chatId) });
}

/** Apply a live presence update to presence query + any cached chat peers. */
export function applyPresenceToCache(
    queryClient: QueryClient,
    presence: ApiUserPresence,
) {
    queryClient.setQueryData<ApiUserPresence>(
        ["presence", presence.userId],
        presence,
    );

    queryClient.setQueriesData<ApiChats>({ queryKey: chatKeys.lists }, (old) => {
        if (!old?.items) return old;
        let changed = false;
        const items = old.items.map((c) => {
            if (c.peer?.id !== presence.userId) return c;
            changed = true;
            return {
                ...c,
                peer: {
                    ...c.peer,
                    isOnline: presence.isOnline,
                    lastActiveAt: presence.lastActiveAt,
                    lastActiveLabel: presence.lastActiveLabel,
                },
            };
        });
        return changed ? { ...old, items } : old;
    });

    queryClient.setQueriesData<ApiChat>({ queryKey: ["chat"] }, (old) => {
        if (!old?.peer || old.peer.id !== presence.userId) return old;
        return {
            ...old,
            peer: {
                ...old.peer,
                isOnline: presence.isOnline,
                lastActiveAt: presence.lastActiveAt,
                lastActiveLabel: presence.lastActiveLabel,
            },
        };
    });
}

export function appendMessageToCache(
    queryClient: QueryClient,
    chatId: string,
    message: ApiChatMessage,
    options?: { clearUnread?: boolean; peerId?: string | null },
) {
    const normalized = normalizeChatMessage(
        message,
        getMyUserId(),
        options?.peerId,
    );

    let added = false;
    queryClient.setQueryData<ApiChatMessage[]>(chatKeys.messages(chatId), (old = []) => {
        if (old.some((m) => m.id === normalized.id)) return old;
        added = true;
        return [...old, normalized];
    });

    if (!normalized.isMine) {
        setConversationTyping(queryClient, chatId, false);
    }

    if (!added && !options?.clearUnread) return;

    patchChatInLists(queryClient, chatId, (c) => {
        let unreadCount = c.unreadCount || 0;
        if (options?.clearUnread || normalized.isMine) {
            unreadCount = 0;
        } else if (added) {
            unreadCount += 1;
        }

        return {
            ...c,
            lastMessageAt: normalized.createdAt || c.lastMessageAt,
            lastMessagePreview: {
                id: normalized.id,
                content: previewTextForMessage(normalized),
                messageType: normalized.messageType,
                createdAt: normalized.createdAt,
            },
            unreadCount,
        };
    });
}

const markReadInFlight = new Set<string>();

export function markChatReadOnce(
    queryClient: QueryClient,
    chatId: string,
    unreadCount: number,
    markRead: (id: string) => Promise<unknown>,
) {
    if (!chatId || unreadCount <= 0) return;
    if (markReadInFlight.has(chatId)) return;
    markReadInFlight.add(chatId);

    patchChatInLists(queryClient, chatId, (c) =>
        c.unreadCount ? { ...c, unreadCount: 0 } : c,
    );

    void markRead(chatId)
        .then(() => {
            window.setTimeout(() => markReadInFlight.delete(chatId), 8_000);
        })
        .catch(() => {
            markReadInFlight.delete(chatId);
        });
}

/** Peer opened the thread — mark my outgoing messages as read. */
export function applyMessagesReadToCache(
    queryClient: QueryClient,
    event: { conversationId: string; readerId?: string; readAt?: string },
) {
    const { conversationId, readerId, readAt } = event;
    if (!conversationId) return;

    const myId = getMyUserId();
    // Only update ticks on *my* messages when the peer is the reader.
    if (myId && readerId && readerId === myId) return;

    queryClient.setQueryData<ApiChatMessage[]>(
        chatKeys.messages(conversationId),
        (old = []) =>
            old.map((m) => {
                const mine = myId ? m.senderId === myId : m.isMine;
                if (!mine || m.isRead) return m;
                return {
                    ...m,
                    isRead: true,
                    readAt: readAt || new Date().toISOString(),
                    deliveryStatus: "delivered",
                };
            }),
    );
}

/** Live reaction update from WS `message.reaction`. */
export function applyMessageReactionToCache(
    queryClient: QueryClient,
    event: {
        conversationId: string;
        messageId: string;
        actorId?: string;
        actorReaction?: string | null;
        reactions?: Array<{ type: string; count: number }>;
    },
) {
    const { conversationId, messageId } = event;
    if (!conversationId || !messageId) return;

    const myId = getMyUserId();

    queryClient.setQueryData<ApiChatMessage[]>(
        chatKeys.messages(conversationId),
        (old = []) =>
            old.map((m) => {
                if (m.id !== messageId) return m;

                const reactions = (event.reactions || []).map((r) => ({
                    type: r.type,
                    count: r.count,
                    reactedByMe:
                        Boolean(myId && event.actorId === myId && event.actorReaction === r.type) ||
                        (m.reactions?.find((x) => x.type === r.type)?.reactedByMe ?? false),
                }));

                let myReaction = m.myReaction ?? null;
                if (myId && event.actorId === myId) {
                    myReaction = event.actorReaction ?? null;
                    // Refresh reactedByMe from actor state.
                    for (const r of reactions) {
                        r.reactedByMe = r.type === myReaction;
                    }
                }

                return { ...m, reactions, myReaction };
            }),
    );
}

/** Replace one message in the thread cache (e.g. after react REST ack). */
export function upsertMessageInCache(
    queryClient: QueryClient,
    chatId: string,
    message: ApiChatMessage,
) {
    const normalized = normalizeChatMessage(message, getMyUserId());
    queryClient.setQueryData<ApiChatMessage[]>(chatKeys.messages(chatId), (old = []) => {
        const idx = old.findIndex((m) => m.id === normalized.id);
        if (idx === -1) return [...old, normalized];
        const next = old.slice();
        next[idx] = { ...old[idx], ...normalized };
        return next;
    });
}
