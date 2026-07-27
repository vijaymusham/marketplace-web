"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import {
    CheckCheck,
    ChevronDown,
    Image as ImageIcon,
    Pin,
    PinOff,
    Plus,
    Search,
    Tag,
} from "lucide-react";
import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import ChatAvatar from "./ChatAvatar";
import { getChats, markChatRead, updateConversation } from "../api/apis";
import type { ApiChat } from "../types/AllTypes";
import { chatKeys, patchChatInLists } from "./chatCache";
import { useSocket } from "@/components/socket/SocketProvider";

function formatLastMessagePreview(
    preview: ApiChat["lastMessagePreview"] | string | null | undefined,
): string {
    if (!preview) return "";
    if (typeof preview === "string") return preview;
    if (typeof preview.content === "string" && preview.content.trim()) {
        return preview.content;
    }
    switch (preview.messageType) {
        case "offer":
            return "Offer";
        case "images":
        case "image":
            return "Photo";
        case "voice":
            return "Voice message";
        default:
            return "Message";
    }
}

export default function ChatSidebar({
    activeChat,
    onSelect,
}: {
    activeChat: string | null;
    onSelect: (id: string) => void;
}) {
    const queryClient = useQueryClient();
    const socket = useSocket();
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "unread" | "online">("all");
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

    const {
        data: conversations,
        isLoading: isLoadingChats,
        isError: isErrorChats,
    } = useQuery({
        queryKey: chatKeys.list(filter),
        queryFn: () => getChats(filter, 1),
        staleTime: 60_000,
        placeholderData: keepPreviousData,
    });

    const filteredItems = useMemo(() => {
        const items = conversations?.items ?? [];
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((c) => {
            const name = c.peer?.displayName?.toLowerCase() ?? "";
            const preview = formatLastMessagePreview(c.lastMessagePreview).toLowerCase();
            return name.includes(q) || preview.includes(q);
        });
    }, [conversations?.items, query]);

    const pinnedItems = useMemo(
        () => filteredItems.filter((c) => c.isPinned),
        [filteredItems],
    );
    const unpinnedItems = useMemo(
        () => filteredItems.filter((c) => !c.isPinned),
        [filteredItems],
    );

    const conversationIds = useMemo(
        () => (conversations?.items ?? []).map((c) => c.id),
        [conversations?.items],
    );

    // Typing + inbox events are room-scoped — join all loaded conversations; re-join on reconnect.
    useEffect(() => {
        if (!socket || conversationIds.length === 0) return;

        const joinAll = () => {
            if (!socket.connected) return;
            for (const id of conversationIds) {
                socket.emit("conversation.join", { conversationId: id });
            }
        };

        joinAll();
        socket.on("connect", joinAll);

        return () => {
            socket.off("connect", joinAll);
            for (const id of conversationIds) {
                socket.emit("conversation.leave", { conversationId: id });
            }
        };
    }, [socket, conversationIds]);

    const pinMutation = useMutation({
        mutationFn: ({ id, isPinned }: { id: string; isPinned: boolean }) =>
            updateConversation(id, { pinned: isPinned }),
        onSuccess: (_data, vars) => {
            patchChatInLists(queryClient, vars.id, (c) => ({
                ...c,
                isPinned: vars.isPinned,
            }));
            void queryClient.invalidateQueries({ queryKey: chatKeys.lists });
            toast.success(vars.isPinned ? "Chat pinned" : "Chat unpinned");
        },
        onError: (error: { message?: string }) => {
            toast.error(error.message ?? "Couldn’t update chat");
        },
    });

    const markReadMutation = useMutation({
        mutationFn: (id: string) => markChatRead(id),
        onSuccess: (_data, id) => {
            patchChatInLists(queryClient, id, (c) =>
                c.unreadCount ? { ...c, unreadCount: 0 } : c,
            );
            toast.success("Marked as read");
        },
        onError: (error: { message?: string }) => {
            toast.error(error.message ?? "Couldn’t mark as read");
        },
    });

    useEffect(() => {
        if (!menuOpenId) return;
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setMenuOpenId(null);
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [menuOpenId]);

    if (isLoadingChats) {
        return (
            <div className="flex h-full w-full flex-col bg-white p-4 pt-5 sm:rounded-3xl">
                <div className="flex h-full w-full items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
                </div>
            </div>
        );
    }

    if (isErrorChats) {
        return (
            <div className="flex h-full w-full flex-col bg-white p-4 pt-5 sm:rounded-3xl">
                <div className="flex h-full w-full items-center justify-center">
                    <div className="text-sm font-bold text-[#0F172A]">Error loading chats</div>
                </div>
            </div>
        );
    }

    return (
        <aside className="flex h-full w-full flex-col bg-white p-4 pt-5 sm:rounded-3xl">
            <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-[20px] font-bold tracking-tight text-[#0F172A] sm:text-[22px]">
                    Message
                </h2>
            </div>

            <div className="mb-3 flex items-center gap-2 rounded-[18px] border border-slate-200/90 bg-slate-100 px-3.5 py-3">
                <Search className="h-4 w-4 shrink-0 text-[#8B95A8]" strokeWidth={2} />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-[#334155] outline-none placeholder:text-[#8B95A8]"
                />
                {query && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[#8B95A8] transition hover:text-primary"
                    >
                        <Plus className="h-3.5 w-3.5 rotate-45" />
                    </button>
                )}
            </div>

            <div className="mb-4 flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide sm:mb-5">
                {(
                    [
                        { id: "all" as const, label: "All", count: conversations?.allCount ?? 0 },
                        {
                            id: "unread" as const,
                            label: "Unread",
                            count: conversations?.unreadCount ?? 0,
                        },
                        {
                            id: "online" as const,
                            label: "Online",
                            count: conversations?.onlineCount ?? 0,
                        },
                    ] as const
                ).map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFilter(tab.id)}
                        className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition active:scale-95 ${filter === tab.id
                            ? "bg-primary text-white"
                            : "border border-slate-200/90 bg-white text-[#64748B] hover:text-primary"
                            }`}
                    >
                        {tab.label}
                        <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] ${filter === tab.id
                                ? "bg-white/20 text-white"
                                : "bg-[#F1F5F9] text-[#8B95A8]"
                                }`}
                        >
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain pr-0.5 scrollbar-hide">
                {pinnedItems.length > 0 && (
                    <section>
                        <p className="mb-2.5 px-1 text-[11px] font-bold tracking-[0.08em] text-[#94A3B8] uppercase">
                            Pinned
                        </p>
                        <div className="space-y-1.5">
                            {pinnedItems.map((c) => (
                                <ConversationRow
                                    key={c.id}
                                    conversation={c}
                                    active={activeChat === c.id}
                                    menuOpen={menuOpenId === c.id}
                                    onSelect={onSelect}
                                    onMenuToggle={(id) =>
                                        setMenuOpenId((prev) => (prev === id ? null : id))
                                    }
                                    onMenuClose={() => setMenuOpenId(null)}
                                    onPin={() =>
                                        pinMutation.mutate({
                                            id: c.id,
                                            isPinned: !c.isPinned,
                                        })
                                    }
                                    onMarkRead={() => markReadMutation.mutate(c.id)}
                                    pinPending={pinMutation.isPending}
                                    markReadPending={markReadMutation.isPending}
                                />
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <p className="mb-2.5 px-1 text-[11px] font-bold tracking-[0.08em] text-[#94A3B8] uppercase">
                        All Message
                    </p>
                    <div className="space-y-1.5">
                        {unpinnedItems.map((c) => (
                            <ConversationRow
                                key={c.id}
                                conversation={c}
                                active={activeChat === c.id}
                                menuOpen={menuOpenId === c.id}
                                onSelect={onSelect}
                                onMenuToggle={(id) =>
                                    setMenuOpenId((prev) => (prev === id ? null : id))
                                }
                                onMenuClose={() => setMenuOpenId(null)}
                                onPin={() =>
                                    pinMutation.mutate({
                                        id: c.id,
                                        isPinned: !c.isPinned,
                                    })
                                }
                                onMarkRead={() => markReadMutation.mutate(c.id)}
                                pinPending={pinMutation.isPending}
                                markReadPending={markReadMutation.isPending}
                            />
                        ))}
                        {filteredItems.length === 0 && (
                            <div className="px-3 py-10 text-center">
                                <p className="text-sm font-bold text-[#0F172A]">No chats found</p>
                                <p className="mt-1 text-[12px] font-medium text-[#94A3B8]">
                                    {query
                                        ? `Nothing matches “${query}”`
                                        : filter === "unread"
                                            ? "You're all caught up"
                                            : filter === "online"
                                                ? "No one is online right now"
                                                : "Start a chat from a listing"}
                                </p>
                                {(query || filter !== "all") && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setQuery("");
                                            setFilter("all");
                                        }}
                                        className="mt-3 rounded-full bg-primary/10 px-3.5 py-1.5 text-[12px] font-bold text-primary"
                                    >
                                        Show all chats
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </aside>
    );
}

function ConversationRow({
    conversation,
    active,
    menuOpen,
    onSelect,
    onMenuToggle,
    onMenuClose,
    onPin,
    onMarkRead,
    pinPending,
    markReadPending,
}: {
    conversation: ApiChat;
    active: boolean;
    menuOpen: boolean;
    onSelect: (id: string) => void;
    onMenuToggle: (id: string) => void;
    onMenuClose: () => void;
    onPin: () => void;
    onMarkRead: () => void;
    pinPending: boolean;
    markReadPending: boolean;
}) {
    const { data: isTyping = false } = useQuery({
        queryKey: chatKeys.typing(conversation.id),
        queryFn: () => false,
        staleTime: Infinity,
        initialData: false,
    });

    const preview = formatLastMessagePreview(conversation.lastMessagePreview);
    const previewType =
        conversation.lastMessagePreview &&
        typeof conversation.lastMessagePreview === "object"
            ? conversation.lastMessagePreview.messageType
            : undefined;
    const name = conversation.peer?.displayName ?? "";
    const photo =
        conversation.peer?.profilePhoto ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}`;

    function runMenuAction(e: MouseEvent, action: () => void) {
        e.preventDefault();
        e.stopPropagation();
        action();
        onMenuClose();
    }

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => {
                if (menuOpen) return;
                onSelect(conversation.id);
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(conversation.id);
                }
            }}
            className={`group relative flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-[20px] px-3 py-2.5 text-left transition active:scale-[0.99] ${active
                ? "border border-transparent bg-primary/5"
                : "border border-slate-100/80 bg-white/55 hover:bg-slate-50"
                }`}
        >
            <ChatAvatar
                label={name}
                color={name}
                photo={photo}
                size="md"
                online={conversation.peer?.isOnline}
            />
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[14px] font-bold text-[#0F172A]">{name}</p>
                    <span className="shrink-0 text-[11px] font-medium text-[#8B95A8]">
                        {conversation.lastMessageAt
                            ? new Date(conversation.lastMessageAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : ""}
                    </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                    <p
                        className={`flex min-w-0 items-center gap-1 truncate text-[12px] font-medium ${
                            isTyping ? "text-primary" : "text-[#8B95A8]"
                        }`}
                    >
                        {isTyping ? (
                            <span className="truncate font-semibold">typing...</span>
                        ) : (
                            <>
                                {previewType === "images" && (
                                    <ImageIcon className="h-3 w-3 shrink-0" />
                                )}
                                {previewType === "offer" && (
                                    <Tag className="h-3 w-3 shrink-0 text-primary" />
                                )}
                                <span className="truncate">{preview}</span>
                            </>
                        )}
                    </p>

                    <div
                        className="relative flex h-6 w-6 shrink-0 items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className={`absolute inset-0 flex items-center justify-center transition ${menuOpen
                                ? "pointer-events-none opacity-0"
                                : "opacity-100 group-hover:pointer-events-none group-hover:opacity-0"
                                }`}
                        >
                            {conversation.unreadCount > 0 ? (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[linear-gradient(145deg,#FB923C,#F97316)] px-1.5 text-[10px] font-bold text-white">
                                    {conversation.unreadCount}
                                </span>
                            ) : (
                                <CheckCheck className="h-3.5 w-3.5 text-primary" />
                            )}
                        </div>

                        <button
                            type="button"
                            aria-label="Chat options"
                            aria-expanded={menuOpen}
                            aria-haspopup="menu"
                            className={`absolute inset-0 z-10 flex items-center justify-center rounded-full text-[#8B95A8] transition hover:bg-[#F1F5F9] hover:text-[#475569] ${menuOpen
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onMenuToggle(conversation.id);
                            }}
                        >
                            <ChevronDown
                                className={`h-4 w-4 transition ${menuOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {menuOpen && (
                            <>
                                {/* Backdrop closes menu without racing menu item clicks */}
                                <button
                                    type="button"
                                    aria-label="Close menu"
                                    className="fixed inset-0 z-20 cursor-default bg-transparent"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onMenuClose();
                                    }}
                                />
                                <div
                                    role="menu"
                                    className="absolute top-full right-0 z-30 mt-1.5 min-w-40 overflow-hidden rounded-xl bg-white py-1 shadow-[0_8px_28px_rgba(15,23,42,0.14)] ring-1 ring-black/5"
                                    onClick={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <button
                                        type="button"
                                        role="menuitem"
                                        disabled={pinPending}
                                        className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[13px] font-medium text-[#334155] transition hover:bg-[#F8FAFC] disabled:opacity-50"
                                        onMouseDown={(e) => runMenuAction(e, onPin)}
                                    >
                                        {conversation.isPinned ? (
                                            <PinOff className="h-3.5 w-3.5 text-[#8B95A8]" />
                                        ) : (
                                            <Pin className="h-3.5 w-3.5 text-[#8B95A8]" />
                                        )}
                                        {conversation.isPinned ? "Unpin" : "Pin"}
                                    </button>
                                    <button
                                        type="button"
                                        role="menuitem"
                                        disabled={
                                            markReadPending || conversation.unreadCount <= 0
                                        }
                                        className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[13px] font-medium text-[#334155] transition hover:bg-[#F8FAFC] disabled:opacity-50"
                                        onMouseDown={(e) => runMenuAction(e, onMarkRead)}
                                    >
                                        <CheckCheck className="h-3.5 w-3.5 text-[#8B95A8]" />
                                        Mark as read
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
