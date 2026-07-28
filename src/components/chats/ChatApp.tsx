"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

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
    const searchParams = useSearchParams();
    const conversationFromUrl = searchParams.get("conversation") ?? "";
    const isDesktop = useIsDesktop(1024);

    const [activeChat, setActiveChat] = useState<string | null>(
        conversationFromUrl || null,
    );
    const [mobilePane, setMobilePane] = useState<MobilePane>("list");

    useEffect(() => {
        if (conversationFromUrl) {
            setActiveChat(conversationFromUrl);
            setMobilePane("chat");
        }
    }, [conversationFromUrl]);

    useEffect(() => {
        if (isDesktop) setMobilePane("chat");
    }, [isDesktop]);

    const handleSelect = useCallback(
        (id: string) => {
            setActiveChat(id);
            if (!isDesktop) setMobilePane("chat");
        },
        [isDesktop],
    );

    const handleBackToList = useCallback(() => {
        setMobilePane("list");
    }, []);

    const handleChatRemoved = useCallback(() => {
        setActiveChat(null);
        if (!isDesktop) setMobilePane("list");
    }, [isDesktop]);

    const showList = isDesktop || mobilePane === "list";
    const showChat = isDesktop || mobilePane === "chat";

    return (
        <div
            className="bg-[radial-gradient(900px_420px_at_8%_-10%,rgba(47,58,223,0.14),transparent_55%),radial-gradient(700px_380px_at_92%_0%,rgba(47,58,223,0.08),transparent_50%),linear-gradient(160deg,#EEF0FB,#F5F6FC_45%,#F8F9FD)] px-0 py-0 sm:px-4 sm:py-4 lg:px-6"
            data-lenis-prevent
        >
            <div className="mx-auto flex h-[calc(100dvh-6.75rem)] max-w-[1480px] gap-0 sm:gap-4 lg:h-[calc(100dvh-4.5rem)] lg:gap-5">
                <div
                    className={`${showList ? "flex" : "hidden"
                        } h-full w-full flex-col rounded-3xl bg-white sm:rounded-[28px] lg:flex lg:w-[300px] lg:shrink-0 xl:w-[320px]`}
                >
                    <ChatSidebar activeChat={activeChat} onSelect={handleSelect} />
                </div>

                <div
                    className={`${showChat ? "flex" : "hidden"
                        } min-w-0 flex-1 flex-col lg:flex`}
                >
                    {activeChat ? (
                        <ChatWindow
                            key={activeChat}
                            activeChat={activeChat}
                            onBack={!isDesktop ? handleBackToList : undefined}
                            onChatRemoved={handleChatRemoved}
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
