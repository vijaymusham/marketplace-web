import type { QueryClient } from "@tanstack/react-query";
import type { ApiChat, ApiChatMessage, ApiChats } from "../types/AllTypes";

export const chatKeys = {
    lists: ["chats"] as const,
    list: (filter: string) => ["chats", filter] as const,
    detail: (id: string) => ["chat", id] as const,
    messages: (id: string) => ["chat-messages", id] as const,
};

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

export function appendMessageToCache(
    queryClient: QueryClient,
    chatId: string,
    message: ApiChatMessage,
) {
    queryClient.setQueryData<ApiChatMessage[]>(chatKeys.messages(chatId), (old = []) => {
        if (old.some((m) => m.id === message.id)) return old;
        return [...old, message];
    });

    patchChatInLists(queryClient, chatId, (c) => ({
        ...c,
        lastMessageAt: message.createdAt || c.lastMessageAt,
        lastMessagePreview: {
            id: message.id,
            content: message.content,
            messageType: message.messageType,
            createdAt: message.createdAt,
        },
        unreadCount: 0,
    }));
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
