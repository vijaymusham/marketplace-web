"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import {
  getMessages,
  listConversations,
  sendMessage,
  sendOffer,
} from "./chatApi";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import type { ChatMessage, Conversation, OfferPayload } from "./chatTypes";

type MobilePane = "list" | "chat";

function useIsDesktop(minWidth = 1024) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [minWidth]);

  return isDesktop;
}

export default function ChatApp() {
  const isDesktop = useIsDesktop(1024);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mobilePane, setMobilePane] = useState<MobilePane>("list");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isDesktop) setMobilePane("chat");
  }, [isDesktop]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await listConversations();
        if (cancelled) return;
        setConversations(list);
        const first = list[0]?.id ?? "";
        setActiveId(first);
        if (window.matchMedia("(min-width: 1024px)").matches) {
          setMobilePane("chat");
        }
      } catch {
        toast.error("Failed to load chats");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activeId) return;
    let cancelled = false;
    (async () => {
      try {
        const msgs = await getMessages(activeId);
        if (cancelled) return;
        setMessages(msgs);
        setConversations((prev) =>
          prev.map((c) => (c.id === activeId ? { ...c, unread: 0 } : c))
        );
      } catch {
        toast.error("Failed to load messages");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  const unreadTotal = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unread, 0),
    [conversations]
  );

  const handleSelect = useCallback(
    (id: string) => {
      setActiveId(id);
      if (!isDesktop) setMobilePane("chat");
    },
    [isDesktop]
  );

  const handleBackToList = useCallback(() => {
    setMobilePane("list");
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      if (!activeId) return;
      setSending(true);
      try {
        const msg = await sendMessage(activeId, text);
        setMessages((prev) => [...prev, msg]);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? {
                  ...c,
                  lastMessage: text,
                  lastMessageIcon: undefined,
                  time: "now",
                  unread: 0,
                }
              : c
          )
        );
      } catch {
        toast.error("Could not send message");
      } finally {
        setSending(false);
      }
    },
    [activeId]
  );

  const handleSendOffer = useCallback(
    async (offer: OfferPayload) => {
      if (!activeId) return;
      setSending(true);
      try {
        const msg = await sendOffer(activeId, offer);
        setMessages((prev) => [...prev, msg]);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? {
                  ...c,
                  lastMessage: "Sent an offer",
                  lastMessageIcon: "offer" as const,
                  time: "now",
                  unread: 0,
                }
              : c
          )
        );
        toast.success("Offer sent");
      } catch {
        toast.error("Could not send offer");
      } finally {
        setSending(false);
      }
    },
    [activeId]
  );

  const removeActiveConversation = useCallback(
    (successMessage: string) => {
      if (!activeId) return;
      const remaining = conversations.filter((c) => c.id !== activeId);
      setConversations(remaining);
      setMessages([]);
      const nextId = remaining[0]?.id ?? "";
      setActiveId(nextId);
      if (!isDesktop) setMobilePane("list");
      toast.success(successMessage);
    },
    [activeId, conversations, isDesktop]
  );

  const handleDeleteChat = useCallback(() => {
    // await customAxios.delete(`/chats/${activeId}`);
    removeActiveConversation("Chat deleted");
  }, [removeActiveConversation]);

  const handleBlockUser = useCallback(() => {
    // await customAxios.post(`/chats/${activeId}/block`);
    removeActiveConversation("User blocked");
  }, [removeActiveConversation]);

  if (loading) {
    return (
      <div className="flex h-[calc(100dvh-4.5rem)] items-center justify-center bg-[radial-gradient(900px_420px_at_8%_-10%,rgba(47,58,223,0.14),transparent_55%),radial-gradient(700px_380px_at_92%_0%,rgba(47,58,223,0.08),transparent_50%),linear-gradient(160deg,#EEF0FB,#F5F6FC_45%,#F8F9FD)] sm:h-[calc(100dvh-5.5rem)]">
        <div className="flex flex-col items-center gap-3 rounded-[24px] bg-white/80 px-8 py-7 shadow-[0_18px_50px_rgba(55,75,140,0.12)] backdrop-blur-md">
          <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
          <p className="text-sm font-semibold text-[#8B95A8]">Loading chats...</p>
        </div>
      </div>
    );
  }

  const showList = isDesktop || mobilePane === "list";
  const showChat = isDesktop || mobilePane === "chat";

  return (
    <div
      className="bg-[radial-gradient(900px_420px_at_8%_-10%,rgba(47,58,223,0.14),transparent_55%),radial-gradient(700px_380px_at_92%_0%,rgba(47,58,223,0.08),transparent_50%),linear-gradient(160deg,#EEF0FB,#F5F6FC_45%,#F8F9FD)] px-0 py-0 sm:px-4 sm:py-4 lg:px-6"
      data-lenis-prevent
    >
      <div className="mx-auto flex h-[calc(100dvh-4.5rem)] max-w-[1480px] gap-0 sm:h-[calc(100dvh-6.5rem)] sm:gap-4 lg:gap-5">
        <div
          className={`${
            showList ? "flex" : "hidden"
          } h-full w-full flex-col rounded-3xl bg-white sm:rounded-[28px] lg:flex lg:w-[300px] lg:shrink-0 xl:w-[320px]`}
        >
          <ChatSidebar
            conversations={conversations}
            activeId={activeId}
            onSelect={handleSelect}
            unreadTotal={unreadTotal}
          />
        </div>

        <div
          className={`${
            showChat ? "flex" : "hidden"
          } min-w-0 flex-1 flex-col lg:flex`}
        >
          {activeConversation ? (
            <ChatWindow
              conversation={activeConversation}
              messages={messages}
              onBack={!isDesktop ? handleBackToList : undefined}
              onSend={handleSend}
              onSendOffer={handleSendOffer}
              onDeleteChat={handleDeleteChat}
              onBlockUser={handleBlockUser}
              sending={sending}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-none border border-slate-200/90 bg-white px-6 text-center shadow-[0_18px_50px_rgba(55,75,140,0.1)] sm:rounded-[28px]">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-lg shadow-primary/20">
                <MessageCircle className="h-7 w-7" />
              </span>
              <p className="text-base font-bold text-[#0F172A]">No chat selected</p>
              <p className="max-w-xs text-sm font-medium text-[#8B95A8]">
                Choose a conversation from the list to start messaging.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
