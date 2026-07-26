"use client";

import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent,
    type MouseEvent as ReactMouseEvent,
    type ReactNode,
} from "react";
import {
    ArrowDown,
    ArrowLeft,
    CheckCheck,
    ChevronDown,
    Copy,
    MoreHorizontal,
    Paperclip,
    Phone,
    Pin,
    Reply,
    SendHorizontal,
    Smile,
    Tag,
    Trash2,
    X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ChatAvatar from "./ChatAvatar";
import { useAuth } from "@/components/auth/AuthProvider";
import {
    createOffer,
    deleteChat,
    deleteMessage,
    getChatById,
    getChatMessages,
    markChatRead,
    reactToMessage,
    removeReaction,
    sendMessage,
} from "../api/apis";
import type {
    ApiChatMessage,
    ApiChatMessageText,
    ApiChatOffer,
} from "../types/AllTypes";
import {
    appendMessageToCache,
    chatKeys,
    findChatInCache,
    markChatReadOnce,
    removeChatFromLists,
} from "./chatCache";

const QUICK_REPLIES = [
    "Is this still available?",
    "What's your best price?",
    "Can we meet today?",
    "I'm interested!",
];

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"] as const;

type ChatWindowProps = {
    activeChat: string;
    onBack?: () => void;
    onChatRemoved?: () => void;
};

function formatMessageTime(iso: string) {
    if (!iso) return "";
    return new Date(iso).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true, // This adds an am/pm marker
    }).toLocaleUpperCase();
}

function avatarUrl(name: string, photo?: string | null) {
    if (photo) return photo;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}`;
}

export default function ChatWindow({
    activeChat,
    onBack,
    onChatRemoved,
}: ChatWindowProps) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [text, setText] = useState("");
    const [replyTo, setReplyTo] = useState<ApiChatMessage | null>(null);
    const [offerOpen, setOfferOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showJump, setShowJump] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const meName = user?.displayName || "You";
    const mePhoto = user?.photoURL ?? null;
    const cachedChat = findChatInCache(queryClient, activeChat);

    const { data: conversation, isLoading: conversationLoading } = useQuery({
        queryKey: chatKeys.detail(activeChat),
        queryFn: () => getChatById(activeChat),
        enabled: !!activeChat,
        placeholderData: cachedChat,
        staleTime: 5 * 60_000,
    });

    const {
        data: messages = [],
        isLoading: messagesLoading,
    } = useQuery({
        queryKey: chatKeys.messages(activeChat),
        queryFn: () => getChatMessages(activeChat),
        enabled: !!activeChat,
        staleTime: 30_000,
    });

    const deleteChatMutation = useMutation({
        mutationFn: () => deleteChat(activeChat),
        onSuccess: () => {
            removeChatFromLists(queryClient, activeChat);
            toast.success("Chat deleted");
            onChatRemoved?.();
        },
        onError: (error: { message?: string }) => {
            toast.error(error.message ?? "Couldn’t delete chat");
        },
    });

    const sendMessageMutation = useMutation({
        mutationFn: (payload: ApiChatMessageText) =>
            sendMessage(activeChat, payload),
        onSuccess: (message) => {
            appendMessageToCache(queryClient, activeChat, message);
        },
        onError: (error: { message?: string }) => {
            toast.error(error.message ?? "Couldn’t send message");
        },
    });

    const createOfferMutation = useMutation({
        mutationFn: (amount: number) => createOffer(activeChat, { amount }),
        onSuccess: (offer) => {
            // Offer endpoints may return the offer or an offer message — refresh messages once.
            if (offer && typeof offer === "object" && "messageType" in offer) {
                appendMessageToCache(
                    queryClient,
                    activeChat,
                    offer as ApiChatMessage,
                );
            } else {
                void queryClient.invalidateQueries({
                    queryKey: chatKeys.messages(activeChat),
                });
            }
            toast.success("Offer sent");
            setOfferOpen(false);
        },
        onError: (error: { message?: string }) => {
            toast.error(error.message ?? "Couldn’t send offer");
        },
    });

    const sending =
        sendMessageMutation.isPending || createOfferMutation.isPending;

    useEffect(() => {
        if (!activeChat || !conversation) return;
        markChatReadOnce(
            queryClient,
            activeChat,
            conversation.unreadCount ?? 0,
            markChatRead,
        );
    }, [activeChat, conversation, queryClient]);

    useEffect(() => {
        scrollToBottom(false);
    }, [messages, activeChat]);

    useEffect(() => {
        const t = window.setTimeout(() => inputRef.current?.focus(), 180);
        return () => window.clearTimeout(t);
    }, [activeChat]);

    useEffect(() => {
        if (!menuOpen) return;
        function onPointerDown(e: globalThis.MouseEvent) {
            if (!menuRef.current?.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        function onKeyDown(e: globalThis.KeyboardEvent) {
            if (e.key === "Escape") setMenuOpen(false);
        }
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [menuOpen]);

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        function onScroll() {
            if (!el) return;
            const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
            setShowJump(distance > 140);
        }
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [activeChat]);

    function scrollToBottom(smooth = true) {
        bottomRef.current?.scrollIntoView({
            behavior: smooth ? "smooth" : "auto",
        });
    }

    function sendText(value: string) {
        const trimmed = value.trim();
        if (!trimmed || sending) return;
        setText("");
        setReplyTo(null);
        if (inputRef.current) inputRef.current.style.height = "auto";
        sendMessageMutation.mutate({
            messageType: "text",
            content: trimmed,
            mediaUrl: "",
        });
        inputRef.current?.focus();
    }

    const handleCall = () => {
        sendMessageMutation.mutate({
            messageType: "text",
            content: "Please share your contact number",
            mediaUrl: "",
        });
    }

    function handleReply(message: ApiChatMessage) {
        setReplyTo(message);
        inputRef.current?.focus();
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        sendText(text);
    }

    function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendText(text);
        }
    }

    function autoGrow(el: HTMLTextAreaElement) {
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }

    const peerName = conversation?.peer.displayName ?? "";
    const peerPhoto = conversation?.peer.profilePhoto;
    const showQuickReplies = messages.length <= 2;
    // Don't block UI when sidebar cache already has the conversation.
    const loading =
        (!conversation && conversationLoading) ||
        (messagesLoading && messages.length === 0);

    return (
        <section className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200/90 bg-white shadow-[0_18px_50px_rgba(55,75,140,0.1)] sm:rounded-[28px]">
            <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-[rgba(148,163,184,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,255,0.94))] px-3 py-3 backdrop-blur-md sm:gap-3 sm:border-b-0 sm:px-5 sm:py-4 lg:px-6">
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                    {onBack && (
                        <button
                            type="button"
                            aria-label="Back to conversations"
                            onClick={onBack}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#64748B] transition hover:bg-[#F4F6FB] active:scale-95 lg:hidden"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                    )}

                    <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3 sm:px-1">
                        <ChatAvatar
                            label={peerName}
                            color={peerName}
                            photo={avatarUrl(peerName, peerPhoto)}
                            size="md"
                            online={conversation?.peer.isOnline}
                        />
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <h1 className="truncate text-[16px] font-bold tracking-tight text-[#0F172A] sm:text-[18px]">
                                    {peerName || "Chat"}
                                </h1>
                            </div>
                            <p className="truncate text-[9px] font-medium lowercase text-slate-500 sm:text-[12px]">
                                {conversation?.peer.isOnline ? (
                                    <span className="inline-flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                                        Active now
                                    </span>
                                ) : conversation?.peer.lastActiveLabel ? (
                                    <span className="text-slate-500">
                                        {conversation.peer.lastActiveLabel}
                                    </span>
                                ) : (
                                    <span className="text-slate-500">Last seen recently</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative flex shrink-0 items-center" ref={menuRef}>
                    <button
                        type="button"
                        aria-label="call"
                        onClick={handleCall}
                        className="hidden h-10 w-10 items-center justify-center rounded-xl text-[#94A3B8] transition hover:bg-[#F4F6FB] hover:text-[#475569] sm:flex"
                    >
                        <Phone className="h-4.5 w-4.5" strokeWidth={1.7} />
                    </button>
                    <button
                        type="button"
                        aria-label="More"
                        aria-expanded={menuOpen}
                        aria-haspopup="menu"
                        onClick={() => setMenuOpen((v) => !v)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${menuOpen
                            ? "bg-[#F4F6FB] text-[#475569]"
                            : "text-[#94A3B8] hover:bg-[#F4F6FB] hover:text-[#475569]"
                            }`}
                    >
                        <MoreHorizontal className="h-4.5 w-4.5" strokeWidth={1.7} />
                    </button>

                    {menuOpen && (
                        <div
                            role="menu"
                            className="absolute top-full right-0 z-30 mt-1.5 min-w-42 overflow-hidden rounded-lg bg-white py-1 shadow-[0_8px_28px_rgba(15,23,42,0.14)] ring-1 ring-black/5"
                        >
                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                    setMenuOpen(false);
                                    toast(
                                        "Meet in public places, never share OTPs, and pay only after inspecting the item.",
                                        { duration: 5000 },
                                    );
                                }}
                                className="flex w-full px-4 py-3 text-left text-[14px] font-medium text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#334155]"
                            >
                                Safety Tips
                            </button>
                            <button
                                type="button"
                                role="menuitem"
                                disabled={deleteChatMutation.isPending}
                                onClick={() => {
                                    setMenuOpen(false);
                                    deleteChatMutation.mutate();
                                }}
                                className="flex w-full px-4 py-3 text-left text-[14px] font-medium text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#334155] disabled:opacity-50"
                            >
                                Delete Chat
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <div className="mx-5 hidden h-px bg-[#F1F5F9] sm:block lg:mx-6" />

            <div className="relative min-h-0 flex-1">
                <div
                    ref={listRef}
                    className="h-full space-y-5 overflow-y-auto overscroll-contain bg-[radial-gradient(520px_220px_at_85%_0%,rgba(47,58,223,0.06),transparent_60%),linear-gradient(180deg,#F3F4FB_0%,#F8F9FD_42%,#FFFFFF_100%)] px-3 py-4 scrollbar-hide sm:space-y-6 sm:px-5 sm:py-5 lg:px-6"
                >
                    {loading && (
                        <div className="flex h-full items-center justify-center">
                            <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
                        </div>
                    )}

                    {!loading && messages.length === 0 && (
                        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                            <div className="rounded-full bg-white p-1.5 shadow-xl shadow-primary/15">
                                <ChatAvatar
                                    label={peerName}
                                    color={peerName}
                                    photo={avatarUrl(peerName, peerPhoto)}
                                    size="xl"
                                />
                            </div>
                            <p className="mt-4 text-base font-bold text-[#0F172A]">
                                {peerName}
                            </p>
                            <p className="mt-1 max-w-xs text-sm text-[#94A3B8]">
                                Break the ice with a quick reply or send an offer.
                            </p>
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                {QUICK_REPLIES.slice(0, 2).map((q) => (
                                    <button
                                        key={q}
                                        type="button"
                                        disabled={sending}
                                        onClick={() => sendText(q)}
                                        className="rounded-full border border-primary/20 bg-white/90 px-3.5 py-2 text-[12px] font-semibold text-primary shadow-sm transition hover:bg-primary/10 active:scale-95 disabled:opacity-50"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => setOfferOpen(true)}
                                className="mt-3 flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover active:scale-95"
                            >
                                <Tag className="h-4 w-4" />
                                Offer to Sell
                            </button>
                        </div>
                    )}

                    {!loading &&
                        messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                conversationId={activeChat}
                                peerName={peerName}
                                peerPhoto={peerPhoto}
                                onReply={handleReply}
                            />
                        ))}

                    <div ref={bottomRef} />
                </div>

                {showJump && (
                    <button
                        type="button"
                        onClick={() => scrollToBottom(true)}
                        className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[linear-gradient(145deg,#1E293B,#0F172A)] px-3.5 py-2 text-[12px] font-bold text-white shadow-[0_12px_28px_rgba(15,23,42,0.28)] transition hover:brightness-110 active:scale-95"
                    >
                        <ArrowDown className="h-3.5 w-3.5" />
                        Latest
                    </button>
                )}
            </div>

            <div className="relative border-t border-[rgba(148,163,184,0.16)] bg-[linear-gradient(180deg,#FFFFFF,#F7F9FD)] px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:border-t-0 sm:px-5 sm:pb-5 sm:pt-2">
                {offerOpen && (
                    <OfferComposer
                        listingTitle={conversation?.listing?.title}
                        listingPrice={conversation?.listing?.price}
                        busy={createOfferMutation.isPending}
                        onClose={() => setOfferOpen(false)}
                        onSubmit={(amount) => createOfferMutation.mutate(amount)}
                    />
                )}

                {replyTo && (
                    <div className="mb-2 flex items-start gap-2 rounded-2xl border border-primary/15 bg-primary/5 px-3 py-2">
                        <Reply className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-primary">
                                Replying to {replyTo.isMine ? "yourself" : peerName}
                            </p>
                            <p className="truncate text-[12px] font-medium text-[#64748B]">
                                {replyTo.content || "Message"}
                            </p>
                        </div>
                        <button
                            type="button"
                            aria-label="Cancel reply"
                            onClick={() => setReplyTo(null)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-[#8B95A8] hover:bg-white"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                )}

                {showQuickReplies && messages.length > 0 && (
                    <div className="mb-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {QUICK_REPLIES.map((q) => (
                            <button
                                key={q}
                                type="button"
                                disabled={sending}
                                onClick={() => sendText(q)}
                                className="shrink-0 rounded-full border border-[#E2E8F0] bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-[#475569] shadow-sm transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary active:scale-95 disabled:opacity-50"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="flex items-end gap-1.5 rounded-[22px] border border-slate-200/95 bg-[linear-gradient(180deg,#FFFFFF,#F4F6FB)] px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_30px_rgba(55,75,140,0.08)] sm:gap-2 sm:rounded-3xl sm:px-2.5 sm:py-2"
                >
                    <div className="mb-1 hidden sm:block">
                        <ChatAvatar
                            label={peerName}
                            color="#2f3adf"
                            photo={avatarUrl(peerName, peerPhoto)}
                            size="md"
                        />
                    </div>

                    <textarea
                        ref={inputRef}
                        value={text}
                        rows={1}
                        onChange={(e) => {
                            setText(e.target.value);
                            autoGrow(e.target);
                        }}
                        onKeyDown={onKeyDown}
                        placeholder="Type a message..."
                        className="max-h-30 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-2 py-2.5 text-[15px] leading-5 font-medium text-[#334155] outline-none placeholder:text-[#94A3B8] sm:min-h-9 sm:py-2 sm:text-[14px]"
                    />

                    <div className="mb-0.5 flex shrink-0 items-center gap-0.5 sm:gap-1">
                        <button
                            type="button"
                            aria-label="Offer to sell"
                            title="Offer to Sell"
                            onClick={() => setOfferOpen((v) => !v)}
                            className={`flex h-10 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-bold transition sm:h-9 sm:px-3 ${offerOpen
                                ? "bg-primary text-white shadow-md shadow-primary/25"
                                : "bg-white text-primary shadow-sm ring-1 ring-primary/15 hover:bg-primary/10"
                                }`}
                        >
                            <Tag className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Offer</span>
                        </button>

                        <button
                            type="button"
                            aria-label="Attach"
                            className="hidden h-9 w-9 items-center justify-center rounded-full text-[#8B95A8] transition hover:bg-white hover:text-[#475569] md:flex"
                        >
                            <Paperclip className="h-4.5 w-4.5" strokeWidth={1.7} />
                        </button>
                        <button
                            type="submit"
                            disabled={!text.trim() || sending}
                            aria-label="Send"
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            <SendHorizontal className="h-4.5 w-4.5" />
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

function MessageBubble({
    message,
    conversationId,
    peerName,
    peerPhoto,
    onReply,
}: {
    message: ApiChatMessage;
    conversationId: string;
    peerName: string;
    peerPhoto?: string;
    onReply: (message: ApiChatMessage) => void;
}) {
    const queryClient = useQueryClient();
    const mine = message.isMine;
    const kind = message.messageType;
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [reactBarOpen, setReactBarOpen] = useState(false);

    const reactMutation = useMutation({
        mutationFn: (emoji: string) => {
            if (message.myReaction === emoji) {
                return removeReaction(message.id);
            }
            return reactToMessage(message.id, { emoji });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: chatKeys.messages(conversationId),
            });
            setMenuOpen(false);
            setReactBarOpen(false);
        },
        onError: (error: { message?: string }) => {
            toast.error(error.message ?? "Couldn’t react");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteMessage(message.id),
        onSuccess: () => {
            queryClient.setQueryData<ApiChatMessage[]>(
                chatKeys.messages(conversationId),
                (old = []) => old.filter((m) => m.id !== message.id),
            );
            toast.success("Message deleted");
            setMenuOpen(false);
        },
        onError: (error: { message?: string }) => {
            toast.error(error.message ?? "Couldn’t delete message");
        },
    });

    useEffect(() => {
        if (!menuOpen && !reactBarOpen) return;
        function onPointerDown(e: globalThis.MouseEvent) {
            if (!menuRef.current?.contains(e.target as Node)) {
                setMenuOpen(false);
                setReactBarOpen(false);
            }
        }
        function onKeyDown(e: globalThis.KeyboardEvent) {
            if (e.key === "Escape") {
                setMenuOpen(false);
                setReactBarOpen(false);
            }
        }
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [menuOpen, reactBarOpen]);

    function copyText() {
        if (!message.content) return;
        void navigator.clipboard.writeText(message.content);
        toast.success("Copied");
        setMenuOpen(false);
    }

    function openMenu(e: ReactMouseEvent) {
        e.stopPropagation();
        setReactBarOpen(false);
        setMenuOpen((v) => !v);
    }

    function openReactBar(e: ReactMouseEvent) {
        e.stopPropagation();
        setMenuOpen(false);
        setReactBarOpen((v) => !v);
    }

    const showHoverActions = menuOpen || reactBarOpen;
    const hoverBtn =
        showHoverActions
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100";

    return (
        <div
            className={`group flex items-end gap-2 sm:gap-3 ${mine ? "flex-row-reverse" : "flex-row"}`}
        >
            {!mine && (
                <ChatAvatar
                    label={peerName}
                    color={peerName}
                    photo={avatarUrl(peerName, peerPhoto)}
                    size="md"
                    className="mb-0.5 hidden sm:block"
                />
            )}

            <div
                ref={menuRef}
                className={`relative max-w-[88%] sm:max-w-[72%] lg:max-w-[68%] ${mine ? "items-end" : "items-start"}`}
            >
                <div className={`relative flex flex-col ${mine ? "items-end" : "items-start"}`}>
                    {kind === "text" && (
                        <div
                            className={`relative flex items-end rounded-[20px] px-3.5 py-2 text-[14px] font-semibold leading-relaxed sm:rounded-[22px] sm:px-4 sm:py-2 ${mine
                                ? "rounded-tr-md bg-primary text-white shadow-lg shadow-primary/25"
                                : "rounded-tl-md border border-slate-200/95 bg-white text-slate-700 shadow-[0_8px_28px_rgba(55,75,140,0.07)]"
                                }`}
                        >
                            <span className="min-w-0">{message.content}</span>
                            <span
                                className={`shrink-0 pl-3 text-[9px] font-medium sm:text-[11px] ${mine ? "text-white/70" : "text-[#94A3B8]"
                                    }`}
                            >
                                {formatMessageTime(message.createdAt)}
                            </span>
                            {mine && (
                                <span className="flex shrink-0 justify-end pl-1.5">
                                    <CheckCheck className="h-3.5 w-3.5 text-emerald-300" />
                                </span>
                            )}
                            {/* Absolute — no layout space when hidden */}
                            <button
                                type="button"
                                aria-label="Message options"
                                aria-expanded={menuOpen}
                                onClick={openMenu}
                                className={`absolute right-1.5 bottom-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full transition ${mine
                                    ? "text-white/80 hover:bg-white/15"
                                    : "bg-white/90 text-[#94A3B8] shadow-sm hover:bg-[#F1F5F9]"
                                    } ${hoverBtn}`}
                            >
                                <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}

                    {(kind === "images" || !!message.mediaUrl) &&
                        kind !== "text" &&
                        kind !== "offer" && (
                            <div className="relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={message.mediaUrl || message.content}
                                    alt="Shared"
                                    className="h-30 w-full max-w-70 rounded-2xl object-cover sm:h-35"
                                />
                                <button
                                    type="button"
                                    aria-label="Message options"
                                    onClick={openMenu}
                                    className={`absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white transition ${hoverBtn}`}
                                >
                                    <ChevronDown className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        )}

                    {kind === "offer" && message.offer && (
                        <OfferCard
                            offer={message.offer}
                            mine={mine}
                            menuOpen={menuOpen}
                            hoverBtnClass={hoverBtn}
                            onMenuClick={openMenu}
                        />
                    )}

                    {message.reactions && message.reactions.length > 0 && (
                        <div
                            className={`mt-1.5 flex flex-wrap gap-1.5 ${mine ? "justify-end" : "justify-start"}`}
                        >
                            {message.reactions.map((r) => (
                                <button
                                    key={r.type}
                                    type="button"
                                    onClick={() => reactMutation.mutate(r.type)}
                                    className={`inline-flex items-center gap-1 rounded-full border bg-white px-2 py-0.5 text-[12px] shadow-sm transition hover:border-primary/30 ${r.reactedByMe
                                        ? "border-primary/40 bg-primary/5"
                                        : "border-[#E2E8F0]"
                                        }`}
                                >
                                    {r.type}
                                    <span className="text-[11px] font-semibold text-[#64748B]">
                                        {r.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Popup floats above bubble — does not push layout */}
                    {(menuOpen || reactBarOpen) && (
                        <div
                            className={`absolute z-30 bottom-full mb-2 ${mine ? "right-0" : "left-0"}`}
                        >
                            <div className="mb-1.5 flex items-center gap-0.5 rounded-full border border-slate-200/90 bg-white px-1.5 py-1 shadow-[0_8px_28px_rgba(15,23,42,0.14)]">
                                {QUICK_REACTIONS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        disabled={reactMutation.isPending}
                                        onClick={() => reactMutation.mutate(emoji)}
                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-[16px] transition hover:scale-110 hover:bg-[#F4F6FB] disabled:opacity-50 ${message.myReaction === emoji ? "bg-primary/10 ring-1 ring-primary/30" : ""
                                            }`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    aria-label="More reactions"
                                    onClick={openReactBar}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#8B95A8] transition hover:bg-[#F4F6FB] hover:text-[#475569]"
                                >
                                    <Smile className="h-4 w-4" />
                                </button>
                            </div>

                            {menuOpen && (
                                <div
                                    role="menu"
                                    className="min-w-44 overflow-hidden rounded-2xl border border-slate-200/90 bg-white py-1 shadow-[0_12px_36px_rgba(15,23,42,0.16)]"
                                >
                                    <MessageMenuItem
                                        icon={<Reply className="h-4 w-4" />}
                                        label="Reply"
                                        onClick={() => {
                                            onReply(message);
                                            setMenuOpen(false);
                                        }}
                                    />
                                    <MessageMenuItem
                                        icon={<Copy className="h-4 w-4" />}
                                        label="Copy"
                                        onClick={copyText}
                                        disabled={!message.content}
                                    />
                                    <MessageMenuItem
                                        icon={<Smile className="h-4 w-4" />}
                                        label="React"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            setReactBarOpen(true);
                                        }}
                                    />
                                    <MessageMenuItem
                                        icon={<Pin className="h-4 w-4" />}
                                        label="Pin"
                                        onClick={() => {
                                            toast.success("Message pinned");
                                            setMenuOpen(false);
                                        }}
                                    />
                                    <div className="my-1 h-px bg-[#F1F5F9]" />
                                    <MessageMenuItem
                                        icon={<Trash2 className="h-4 w-4" />}
                                        label="Delete"
                                        danger
                                        disabled={deleteMutation.isPending}
                                        onClick={() => deleteMutation.mutate()}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Side smile — absolute, no right-side gap without hover */}
                    <button
                        type="button"
                        aria-label="React to message"
                        onClick={openReactBar}
                        className={`absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/90 bg-white text-[#94A3B8] shadow-sm transition hover:border-primary/25 hover:text-primary ${mine ? "right-full mr-1.5" : "left-full ml-1.5"
                            } ${hoverBtn}`}
                    >
                        <Smile className="h-4 w-4" strokeWidth={1.7} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function MessageMenuItem({
    icon,
    label,
    onClick,
    disabled,
    danger,
}: {
    icon: ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    danger?: boolean;
}) {
    return (
        <button
            type="button"
            role="menuitem"
            disabled={disabled}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] font-semibold  transition disabled:opacity-45 ${danger
                ? "text-red-500 hover:bg-red-50"
                : "text-[#334155] hover:bg-[#F8FAFC]"
                }`}
        >
            <span className={danger ? "text-red-400" : "text-[#8B95A8]"}>{icon}</span>
            {label}
        </button>
    );
}

function OfferCard({
    offer,
    mine,
    menuOpen,
    hoverBtnClass,
    onMenuClick,
}: {
    offer: ApiChatOffer;
    mine: boolean;
    menuOpen?: boolean;
    hoverBtnClass?: string;
    onMenuClick?: (e: ReactMouseEvent) => void;
}) {
    const amount = offer.amount ?? offer.listing?.price ?? 0;
    const price = `₹${amount.toLocaleString("en-IN")}`;
    const title = offer.listing?.title || "Offer";
    const image = offer.listing?.imageUrl;

    return (
        <div
            className={`relative w-[min(100%,270px)] rounded-2xl border border-primary/20 bg-white shadow-lg shadow-primary/15 ${mine ? "rounded-tr-md" : "rounded-tl-md"
                }`}
        >
            <div className="overflow-hidden rounded-tl-2xl">
                <div className="flex items-center gap-2 bg-primary px-3.5 py-2 text-white">
                    <Tag className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-bold tracking-wide uppercase">
                        Offer to Sell
                    </span>
                </div>
                <div className="flex gap-3 p-3.5">
                    {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={image}
                            alt={title}
                            className="h-14 w-14 rounded-xl object-cover"
                        />
                    ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Tag className="h-5 w-5" />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#0F172A]">{title}</p>
                        <p className="mt-0.5 text-2xl font-extrabold text-primary">{price}</p>
                        <p className="mt-0.5 text-[10px] font-semibold tracking-wide text-[#8B95A8] uppercase">
                            {offer.statusLabel || offer.status || "pending"}
                        </p>
                    </div>
                </div>
                {!mine ? (
                    <button
                        type="button"
                        className="min-h-11 w-full border-t border-[#F1F5F9] bg-primary py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover active:brightness-95"
                    >
                        Accept Offer
                    </button>
                ) : (
                    <div className="border-t border-[#F1F5F9] px-3.5 py-2 text-center text-[11px] font-semibold text-[#8B95A8]">
                        Waiting for buyer response
                    </div>
                )}
            </div>

            {/* Absolute hover chevron — same as text bubble, no layout space */}
            {onMenuClick && (
                <button
                    type="button"
                    aria-label="Message options"
                    aria-expanded={menuOpen}
                    onClick={onMenuClick}
                    className={`absolute top-1 right-2 z-10 flex p-0.5 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-black/50 ${hoverBtnClass ?? ""}`}
                >
                    <ChevronDown className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

function OfferComposer({
    listingTitle,
    listingPrice,
    busy,
    onClose,
    onSubmit,
}: {
    listingTitle?: string;
    listingPrice?: number;
    busy: boolean;
    onClose: () => void;
    onSubmit: (amount: number) => void;
}) {
    const [price, setPrice] = useState(
        listingPrice ? String(listingPrice) : "",
    );

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const parsed = Number(price.replace(/,/g, ""));
        if (!parsed || parsed <= 0 || busy) return;
        onSubmit(parsed);
    }

    return (
        <div className="absolute right-3 bottom-full left-3 z-10 mb-2 rounded-[22px] border border-slate-200/90 bg-white p-4 shadow-[0_18px_50px_rgba(55,75,140,0.1)] sm:right-5 sm:left-5">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Tag className="h-4 w-4" />
                    </span>
                    <div>
                        <p className="text-sm font-bold text-[#0F172A]">Offer to Sell</p>
                        <p className="text-[11px] font-medium text-[#8B95A8]">
                            {listingTitle
                                ? `Offer for ${listingTitle}`
                                : "Send a priced offer in this chat"}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    aria-label="Close offer"
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[#8B95A8] hover:bg-[#F4F6FB] sm:h-8 sm:w-8"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                    <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-bold text-[#8B95A8]">
                        ₹
                    </span>
                    <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                        placeholder="Price"
                        inputMode="numeric"
                        autoFocus
                        className="w-full rounded-xl bg-[#F4F6FB] py-3 pr-3.5 pl-8 text-sm font-medium text-[#334155] outline-none placeholder:text-[#8B95A8] focus:ring-2 focus:ring-primary/25 sm:py-2.5"
                    />
                </div>
                <button
                    type="submit"
                    disabled={busy || !price}
                    className="min-h-11 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover disabled:opacity-50 sm:min-h-0"
                >
                    Send Offer
                </button>
            </form>
        </div>
    );
}
