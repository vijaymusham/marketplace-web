"use client";

import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent,
} from "react";
import {
    ArrowDown,
    ArrowLeft,
    BadgeCheck,
    CheckCheck,
    Copy,
    MoreHorizontal,
    Paperclip,
    Phone,
    Play,
    SendHorizontal,
    Smile,
    Tag,
    X,
} from "lucide-react";
import toast from "react-hot-toast";
import ChatAvatar from "./ChatAvatar";
import { CURRENT_USER } from "./chatData";
import type { ChatMessage, Conversation, OfferPayload } from "./chatTypes";

const QUICK_REPLIES = [
    "Is this still available?",
    "What's your best price?",
    "Can we meet today?",
    "I'm interested!",
];

type ChatWindowProps = {
    conversation: Conversation;
    messages: ChatMessage[];
    onBack?: () => void;
    onSend: (text: string) => Promise<void>;
    onSendOffer: (offer: OfferPayload) => Promise<void>;
    onDeleteChat?: () => void;
    onBlockUser?: () => void;
    sending?: boolean;
};

export default function ChatWindow({
    conversation,
    messages,
    onBack,
    onSend,
    onSendOffer,
    onDeleteChat,
    onBlockUser,
    sending,
}: ChatWindowProps) {
    const [text, setText] = useState("");
    const [offerOpen, setOfferOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showJump, setShowJump] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const realMessages = messages.filter((m) => !m.dateLabel);
    const showQuickReplies = realMessages.length <= 2;

    function scrollToBottom(smooth = true) {
        bottomRef.current?.scrollIntoView({
            behavior: smooth ? "smooth" : "auto",
        });
    }

    useEffect(() => {
        scrollToBottom(true);
    }, [messages, conversation.id]);

    useEffect(() => {
        setOfferOpen(false);
        setMenuOpen(false);
        setText("");
        const t = window.setTimeout(() => inputRef.current?.focus(), 180);
        return () => window.clearTimeout(t);
    }, [conversation.id]);

    useEffect(() => {
        if (!menuOpen) return;
        function onPointerDown(e: MouseEvent) {
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
    }, [conversation.id]);

    async function sendText(value: string) {
        const trimmed = value.trim();
        if (!trimmed || sending) return;
        setText("");
        if (inputRef.current) inputRef.current.style.height = "auto";
        await onSend(trimmed);
        inputRef.current?.focus();
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        await sendText(text);
    }

    function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void sendText(text);
        }
    }

    function autoGrow(el: HTMLTextAreaElement) {
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }

    function openSystemEmoji() {
        setOfferOpen(false);
        inputRef.current?.focus();
    }

    return (
        <section className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200/90 bg-white shadow-[0_18px_50px_rgba(55,75,140,0.1)] sm:rounded-[28px]">
            {/* Header */}
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
                            label={conversation.avatar}
                            color={conversation.avatarColor}
                            photo={conversation.photo}
                            size="md"
                            online={conversation.online}
                        />
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <h1 className="truncate text-[16px] font-bold tracking-tight text-[#0F172A] sm:text-[18px]">
                                    {conversation.name}
                                </h1>
                                {(conversation.verified ?? true) && (
                                    <BadgeCheck className="h-4 w-4 shrink-0 fill-primary text-white sm:h-4.5 sm:w-4.5" />
                                )}
                            </div>
                            <p className="truncate text-[11px] font-medium text-[#8B95A8] sm:text-[12px]">
                                {conversation.typing ? (
                                    <span className="text-primary">typing...</span>
                                ) : conversation.online ? (
                                    <span className="inline-flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                                        Active now
                                    </span>
                                ) : (
                                    "Last seen recently"
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative flex shrink-0 items-center" ref={menuRef}>
                    <button
                        type="button"
                        aria-label="Voice call"
                        className="hidden h-10 w-10 items-center justify-center rounded-xl text-[#94A3B8] transition hover:bg-[#F4F6FB] hover:text-[#475569] sm:flex"
                    >
                        <Phone className="h-[18px] w-[18px]" strokeWidth={1.7} />
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
                        <MoreHorizontal className="h-[18px] w-[18px]" strokeWidth={1.7} />
                    </button>

                    {menuOpen && (
                        <div
                            role="menu"
                            className="absolute top-full right-0 z-30 mt-1.5 min-w-[168px] overflow-hidden rounded-lg bg-white py-1 shadow-[0_8px_28px_rgba(15,23,42,0.14)] ring-1 ring-black/5"
                        >
                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                    setMenuOpen(false);
                                    toast(
                                        "Meet in public places, never share OTPs, and pay only after inspecting the item.",
                                        { duration: 5000 }
                                    );
                                }}
                                className="flex w-full px-4 py-3 text-left text-[14px] font-medium text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#334155]"
                            >
                                Safety Tips
                            </button>
                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                    setMenuOpen(false);
                                    onDeleteChat?.();
                                }}
                                className="flex w-full px-4 py-3 text-left text-[14px] font-medium text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#334155]"
                            >
                                Delete Chat
                            </button>
                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                    setMenuOpen(false);
                                    onBlockUser?.();
                                }}
                                className="flex w-full px-4 py-3 text-left text-[14px] font-medium text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#334155]"
                            >
                                Block User
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <div className="mx-5 hidden h-px bg-[#F1F5F9] sm:block lg:mx-6" />

            {/* Messages */}
            <div className="relative min-h-0 flex-1">
                <div
                    ref={listRef}
                    className="h-full space-y-5 overflow-y-auto overscroll-contain bg-[radial-gradient(520px_220px_at_85%_0%,rgba(47,58,223,0.06),transparent_60%),linear-gradient(180deg,#F3F4FB_0%,#F8F9FD_42%,#FFFFFF_100%)] px-3 py-4 scrollbar-hide sm:space-y-6 sm:px-5 sm:py-5 lg:px-6"
                >
                    {messages.length === 0 && (
                        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                            <div className="rounded-full bg-white p-1.5 shadow-xl shadow-primary/15">
                                <ChatAvatar
                                    label={conversation.avatar}
                                    color={conversation.avatarColor}
                                    photo={conversation.photo}
                                    size="xl"
                                />
                            </div>
                            <p className="mt-4 text-base font-bold text-[#0F172A]">
                                {conversation.name}
                            </p>
                            <p className="mt-1 max-w-xs text-sm text-[#94A3B8]">
                                Break the ice with a quick reply or send an offer.
                            </p>
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                {QUICK_REPLIES.slice(0, 2).map((q) => (
                                    <button
                                        key={q}
                                        type="button"
                                        onClick={() => void sendText(q)}
                                        className="rounded-full border border-primary/20 bg-white/90 px-3.5 py-2 text-[12px] font-semibold text-primary shadow-sm transition hover:bg-primary/10 active:scale-95"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => setOfferOpen(true)}
                                className="mt-3 flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition active:scale-95"
                            >
                                <Tag className="h-4 w-4" />
                                Offer to Sell
                            </button>
                        </div>
                    )}

                    {messages.map((msg) =>
                        msg.dateLabel ? (
                            <div key={msg.id} className="flex justify-center py-1">
                                <span className="rounded-full bg-white/90 px-3.5 py-1 text-[11px] font-semibold text-[#8B95A8] shadow-sm ring-1 ring-[#E2E8F0]/80">
                                    {msg.dateLabel}
                                </span>
                            </div>
                        ) : (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                peerName={conversation.name}
                                peerAvatar={conversation.avatar}
                                peerPhoto={conversation.photo}
                                peerColor={conversation.avatarColor}
                            />
                        )
                    )}

                    {conversation.typing && (
                        <div className="flex items-center gap-2 px-1">
                            <ChatAvatar
                                label={conversation.avatar}
                                color={conversation.avatarColor}
                                photo={conversation.photo}
                                size="xs"
                            />
                            <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-sm">
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
                            </div>
                        </div>
                    )}
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

            {/* Composer */}
            <div className="relative border-t border-[rgba(148,163,184,0.16)] bg-[linear-gradient(180deg,#FFFFFF,#F7F9FD)] px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:border-t-0 sm:px-5 sm:pb-5 sm:pt-2">
                {offerOpen && (
                    <OfferComposer
                        onClose={() => setOfferOpen(false)}
                        onSubmit={async (offer) => {
                            await onSendOffer(offer);
                            setOfferOpen(false);
                        }}
                    />
                )}

                {showQuickReplies && messages.length > 0 && (
                    <div className="mb-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {QUICK_REPLIES.map((q) => (
                            <button
                                key={q}
                                type="button"
                                disabled={sending}
                                onClick={() => void sendText(q)}
                                className="shrink-0 rounded-full border border-[#E2E8F0] bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-[#475569] shadow-sm transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary active:scale-95 disabled:opacity-50"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="flex items-end gap-1.5 rounded-[22px] border border-slate-200/95 bg-[linear-gradient(180deg,#FFFFFF,#F4F6FB)] px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_30px_rgba(55,75,140,0.08)] sm:gap-2 sm:rounded-[24px] sm:px-2.5 sm:py-2"
                >
                    <div className="mb-1 hidden sm:block">
                        <ChatAvatar
                            label={CURRENT_USER.avatar}
                            color={CURRENT_USER.avatarColor}
                            photo={CURRENT_USER.photo}
                            size="sm"
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
                        className="max-h-[120px] min-h-[44px] min-w-0 flex-1 resize-none bg-transparent px-2 py-2.5 text-[15px] leading-5 font-medium text-[#334155] outline-none placeholder:text-[#94A3B8] sm:min-h-[36px] sm:py-2 sm:text-[14px]"
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
                            <Paperclip className="h-[18px] w-[18px]" strokeWidth={1.7} />
                        </button>
                        <button
                            type="button"
                            aria-label="Emoji"
                            title="System emoji"
                            onClick={openSystemEmoji}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-[#8B95A8] transition hover:bg-white hover:text-[#475569] sm:h-9 sm:w-9"
                        >
                            <Smile className="h-[18px] w-[18px]" strokeWidth={1.7} />
                        </button>

                        <button
                            type="submit"
                            disabled={!text.trim() || sending}
                            aria-label="Send"
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            <SendHorizontal className="h-[18px] w-[18px]" />
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

function MessageBubble({
    message,
    peerName,
    peerAvatar,
    peerPhoto,
    peerColor,
}: {
    message: ChatMessage;
    peerName: string;
    peerAvatar: string;
    peerPhoto?: string;
    peerColor: string;
}) {
    const mine = message.isMine;
    const name = mine ? "You" : message.senderName || peerName;

    function copyText() {
        if (!message.text) return;
        void navigator.clipboard.writeText(message.text);
        toast.success("Copied");
    }

    return (
        <div
            className={`group flex gap-2 sm:gap-3 ${mine ? "flex-row-reverse" : "flex-row"
                }`}
        >
            <ChatAvatar
                label={mine ? CURRENT_USER.avatar : peerAvatar}
                color={mine ? CURRENT_USER.avatarColor : peerColor}
                photo={mine ? CURRENT_USER.photo : peerPhoto}
                size="sm"
                className="mt-6 hidden sm:block"
            />
            <div
                className={`flex max-w-[88%] flex-col sm:max-w-[72%] lg:max-w-[68%] ${mine ? "items-end" : "items-start"
                    }`}
            >
                <div
                    className={`mb-1.5 flex items-center gap-2 ${mine ? "flex-row-reverse" : "flex-row"
                        }`}
                >
                    <span className="text-[12px] font-bold text-[#0F172A] sm:text-[13px]">
                        {name}
                    </span>
                    <span className="text-[10px] font-medium text-[#94A3B8] sm:text-[11px]">
                        {message.time}
                    </span>
                    {message.kind === "text" && message.text && (
                        <button
                            type="button"
                            aria-label="Copy message"
                            onClick={copyText}
                            className="rounded-md p-0.5 text-[#CBD5E1] opacity-0 transition group-hover:opacity-100 hover:text-[#64748B]"
                        >
                            <Copy className="h-3 w-3" />
                        </button>
                    )}
                </div>

                {message.kind === "text" && (
                    <div
                        className={`rounded-[20px] px-3.5 py-2.5 text-[14px] leading-relaxed font-medium sm:rounded-[22px] sm:px-4 sm:py-3 ${mine
                            ? "rounded-tr-[6px] bg-primary text-white shadow-lg shadow-primary/25"
                            : "rounded-tl-[6px] border border-slate-200/95 bg-white text-slate-700 shadow-[0_8px_28px_rgba(55,75,140,0.07)]"
                            }`}
                    >
                        {message.mentions?.length
                            ? renderWithMentions(message.text ?? "", message.mentions, mine)
                            : message.text}
                    </div>
                )}

                {message.kind === "voice" && (
                    <div className="flex min-w-[200px] max-w-full items-center gap-3 rounded-[22px] rounded-tl-[6px] border border-slate-200/95 bg-white px-3.5 py-3 shadow-[0_8px_28px_rgba(55,75,140,0.07)] sm:min-w-[240px]">
                        <button
                            type="button"
                            aria-label="Play voice"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25 sm:h-9 sm:w-9"
                        >
                            <Play className="h-3.5 w-3.5 fill-current" />
                        </button>
                        <Waveform />
                        <span className="text-[12px] font-semibold text-[#94A3B8]">
                            {message.voiceDuration}
                        </span>
                    </div>
                )}

                {message.kind === "images" && message.images && (
                    <div className="grid w-full max-w-[280px] grid-cols-2 gap-2 sm:max-w-[320px]">
                        {message.images.map((src) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            (<img
                                key={src}
                                src={src}
                                alt="Shared"
                                className="h-[120px] w-full rounded-[16px] object-cover sm:h-[140px] sm:rounded-[18px]"
                            />)
                        ))}
                    </div>
                )}

                {message.kind === "offer" && message.offer && (
                    <OfferCard offer={message.offer} mine={mine} />
                )}

                {message.reactions && message.reactions.length > 0 && (
                    <div
                        className={`mt-2 flex flex-wrap gap-1.5 ${mine ? "justify-end" : "justify-start"}`}
                    >
                        {message.reactions.map((r) => (
                            <span
                                key={r.emoji}
                                className="inline-flex items-center gap-1 rounded-full border border-[#E2E8F0] bg-white px-2 py-0.5 text-[12px] shadow-sm"
                            >
                                {r.emoji}
                                <span className="text-[11px] font-semibold text-[#64748B]">
                                    {r.count}
                                </span>
                            </span>
                        ))}
                    </div>
                )}

                {mine && message.kind === "text" && (
                    <div className="mt-1.5 flex justify-end">
                        <CheckCheck className="h-3.5 w-3.5 text-primary" />
                    </div>
                )}
            </div>
        </div>
    );
}

function renderWithMentions(text: string, mentions: string[], mine: boolean) {
    const parts = text.split(new RegExp(`(@?(?:${mentions.join("|")}))`, "gi"));
    return parts.map((part, i) => {
        const isMention = mentions.some(
            (m) =>
                part.toLowerCase() === m.toLowerCase() ||
                part.toLowerCase() === `@${m.toLowerCase()}`
        );
        if (isMention) {
            return (
                <span
                    key={i}
                    className={`mx-0.5 inline-flex rounded-full px-2 py-0.5 text-[12px] font-bold ${mine ? "bg-white/20 text-white" : "bg-primary/12 text-primary"
                        }`}
                >
                    @{part.replace(/^@/, "")}
                </span>
            );
        }
        return <span key={i}>{part}</span>;
    });
}

function Waveform() {
    const bars = [5, 12, 7, 16, 9, 18, 8, 14, 6, 17, 10, 13, 7, 15, 9, 12, 6, 14, 8, 11];
    return (
        <div className="flex flex-1 items-center gap-[2.5px]">
            {bars.map((h, i) => (
                <span
                    key={i}
                    className="w-[3px] rounded-full bg-primary/75"
                    style={{ height: h }}
                />
            ))}
        </div>
    );
}

function OfferCard({ offer, mine }: { offer: OfferPayload; mine: boolean }) {
    const price = `${offer.currency ?? "₹"}${offer.price.toLocaleString("en-IN")}`;

    return (
        <div
            className={`w-[min(100%,270px)] overflow-hidden rounded-[22px] border border-primary/20 bg-white shadow-lg shadow-primary/15 ${mine ? "rounded-tr-[6px]" : "rounded-tl-[6px]"
                }`}
        >
            <div className="flex items-center gap-2 bg-primary px-3.5 py-2 text-white">
                <Tag className="h-3.5 w-3.5" />
                <span className="text-[11px] font-bold tracking-wide uppercase">
                    Offer to Sell
                </span>
            </div>
            <div className="flex gap-3 p-3.5">
                {offer.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    (<img
                        src={offer.image}
                        alt={offer.title}
                        className="h-14 w-14 rounded-xl object-cover"
                    />)
                ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Tag className="h-5 w-5" />
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#0F172A]">{offer.title}</p>
                    <p className="mt-0.5 text-base font-extrabold text-primary">{price}</p>
                    <p className="mt-0.5 text-[10px] font-semibold tracking-wide text-[#8B95A8] uppercase">
                        {offer.status ?? "pending"}
                    </p>
                </div>
            </div>
            {!mine ? (
                <button
                    type="button"
                    className="min-h-11 w-full border-t border-[#F1F5F9] bg-primary hover:bg-primary-hover py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition active:brightness-95"
                >
                    Buy Now
                </button>
            ) : (
                <div className="border-t border-[#F1F5F9] px-3.5 py-2 text-center text-[11px] font-semibold text-[#8B95A8]">
                    Waiting for buyer response
                </div>
            )}
        </div>
    );
}

function OfferComposer({
    onClose,
    onSubmit,
}: {
    onClose: () => void;
    onSubmit: (offer: OfferPayload) => Promise<void>;
}) {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const parsed = Number(price.replace(/,/g, ""));
        if (!title.trim() || !parsed || parsed <= 0 || busy) return;
        setBusy(true);
        try {
            await onSubmit({
                title: title.trim(),
                price: parsed,
                currency: "₹",
                status: "pending",
            });
        } finally {
            setBusy(false);
        }
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
                            Send a priced offer in this chat
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

            <form onSubmit={handleSubmit} className="space-y-2.5">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Item title"
                    autoFocus
                    className="w-full rounded-xl bg-[#F4F6FB] px-3.5 py-3 text-sm font-medium text-[#334155] outline-none placeholder:text-[#8B95A8] focus:ring-2 focus:ring-primary/25 sm:py-2.5"
                />
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                        <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-bold text-[#8B95A8]">
                            ₹
                        </span>
                        <input
                            value={price}
                            onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                            placeholder="Price"
                            inputMode="numeric"
                            className="w-full rounded-xl bg-[#F4F6FB] py-3 pr-3.5 pl-8 text-sm font-medium text-[#334155] outline-none placeholder:text-[#8B95A8] focus:ring-2 focus:ring-primary/25 sm:py-2.5"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={busy || !title.trim() || !price}
                        className="min-h-11 rounded-xl bg-primary hover:bg-primary-hover px-5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition disabled:opacity-50 sm:min-h-0"
                    >
                        Send Offer
                    </button>
                </div>
            </form>
        </div>
    );
}
