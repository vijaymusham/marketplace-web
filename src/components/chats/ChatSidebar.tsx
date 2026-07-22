"use client";

import { useState } from "react";
import {
    CheckCheck,
    Image as ImageIcon,
    Mic,
    Pencil,
    PhoneOff,
    Plus,
    Search,
    SquarePen,
    Tag,
} from "lucide-react";
import ChatAvatar from "./ChatAvatar";
import type { Conversation } from "./chatTypes";

type ChatSidebarProps = {
    conversations: Conversation[];
    activeId: string;
    onSelect: (id: string) => void;
    unreadTotal: number;
};

export default function ChatSidebar({
    conversations,
    activeId,
    onSelect,
    unreadTotal,
}: ChatSidebarProps) {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "unread" | "online">("all");

    const filtered = conversations.filter((c) => {
        const matchesQuery = c.name
            .toLowerCase()
            .includes(query.trim().toLowerCase());
        if (!matchesQuery) return false;
        if (filter === "unread") return c.unread > 0;
        if (filter === "online") return c.online;
        return true;
    });
    const pinned = filtered.filter((c) => c.pinned);
    const rest = filtered.filter((c) => !c.pinned);
    const unreadCount = conversations.filter((c) => c.unread > 0).length;
    const onlineCount = conversations.filter((c) => c.online).length;
    const displayCount = Math.max(unreadTotal, 12);

    return (
        <aside className="flex h-full w-full flex-col bg-white p-4 pt-5  sm:rounded-3xl">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-[20px] font-bold tracking-tight text-[#0F172A] sm:text-[22px]">
                    Message
                </h2>
            </div>

            <div className="mb-3 flex items-center gap-2 rounded-[18px] border border-slate-200/90 bg-slate-100 px-3.5 py-3 ">
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

            {/* Quick filters */}
            <div className="mb-4 flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide sm:mb-5">
                {(
                    [
                        { id: "all" as const, label: "All", count: conversations.length },
                        { id: "unread" as const, label: "Unread", count: unreadCount },
                        { id: "online" as const, label: "Online", count: onlineCount },
                    ] as const
                ).map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFilter(tab.id)}
                        className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition active:scale-95 ${filter === tab.id
                            ? "bg-primary text-white "
                            : "bg-white text-[#64748B] border border-slate-200/90 hover:text-primary"
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

            {/* Lists */}
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain pr-0.5 scrollbar-hide">
                {pinned.length > 0 && (
                    <section>
                        <p className="mb-2.5 px-1 text-[11px] font-bold tracking-[0.08em] text-[#94A3B8] uppercase">
                            Pinned
                        </p>
                        <div className="space-y-1.5">
                            {pinned.map((c) =>
                                <ConversationRow
                                    key={c.id}
                                    conversation={c}
                                    active={c.id === activeId}
                                    onSelect={onSelect}
                                />
                            )}
                        </div>
                    </section>
                )}

                <section>
                    <p className="mb-2.5 px-1 text-[11px] font-bold tracking-[0.08em] text-[#94A3B8] uppercase">
                        All Message
                    </p>
                    <div className="space-y-1.5">
                        {rest.map((c) => (
                            <ConversationRow
                                key={c.id}
                                conversation={c}
                                active={c.id === activeId}
                                onSelect={onSelect}
                            />
                        ))}
                        {filtered.length === 0 && (
                            <div className="px-3 py-10 text-center">
                                <p className="text-sm font-bold text-[#0F172A]">No chats found</p>
                                <p className="mt-1 text-[12px] font-medium text-[#94A3B8]">
                                    {query
                                        ? `Nothing matches “${query}”`
                                        : filter === "unread"
                                            ? "You're all caught up"
                                            : "No one is online right now"}
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
    conversation: c,
    active,
    onSelect,
}: {
    conversation: Conversation;
    active: boolean;
    onSelect: (id: string) => void;
}) {
    return (
        <button
            type="button"
            onClick={() => onSelect(c.id)}
            className={`flex min-h-16 w-full items-center gap-3 rounded-[20px] px-3 py-2.5 text-left transition active:scale-[0.99] cursor-pointer ${active
                ? "border border-transparent bg-primary/5 "
                : "bg-white/55 hover:bg-slate-50 border border-slate-100/80"
                }`}
        >
            <ChatAvatar
                label={c.avatar}
                color={c.avatarColor}
                photo={c.photo}
                size="md"
                online={c.online}
            />
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[14px] font-bold text-[#0F172A]">{c.name}</p>
                    <span className="shrink-0 text-[11px] font-medium text-[#8B95A8]">
                        {c.time}
                    </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                    <p className="flex min-w-0 items-center gap-1 truncate text-[12px] font-medium text-[#8B95A8]">
                        {c.typing || c.lastMessageIcon === "pen" ? (
                            <>
                                <Pencil className="h-3 w-3 shrink-0 text-primary" />
                                <span className="text-primary">typing...</span>
                            </>
                        ) : (
                            <>
                                {c.lastMessageIcon === "mic" && <Mic className="h-3 w-3 shrink-0" />}
                                {c.lastMessageIcon === "image" && (
                                    <ImageIcon className="h-3 w-3 shrink-0" />
                                )}
                                {c.lastMessageIcon === "offer" && (
                                    <Tag className="h-3 w-3 shrink-0 text-primary" />
                                )}
                                <span className="truncate">{c.lastMessage}</span>
                            </>
                        )}
                    </p>
                    {c.unread > 0 ? (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(145deg,#FB923C,#F97316)] px-1.5 text-[10px] font-bold text-white ">
                            {c.unread}
                        </span>
                    ) : (
                        <CheckCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                    )}
                </div>
            </div>
        </button>
    );
}
