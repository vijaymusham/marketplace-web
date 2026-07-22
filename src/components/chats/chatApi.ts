import type { ChatMessage, Conversation, OfferPayload } from "./chatTypes";
import { initialConversations, initialMessages } from "./chatData";

/**
 * Chat API stubs — local mock data. Wire customAxios when backend is ready:
 *   GET /chats | GET /chats/:id/messages | POST /chats/:id/messages | POST /chats/:id/offers
 */
// import customAxios from "@/components/api/customAxios";

function delay(ms = 180) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function listConversations(): Promise<Conversation[]> {
  // const { data } = await customAxios.get("/chats");
  // return data;
  await delay();
  return structuredClone(initialConversations);
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  // const { data } = await customAxios.get(`/chats/${conversationId}/messages`);
  // return data;
  await delay();
  return structuredClone(initialMessages[conversationId] ?? []);
}

export async function sendMessage(
  conversationId: string,
  text: string
): Promise<ChatMessage> {
  // const { data } = await customAxios.post(`/chats/${conversationId}/messages`, { text, kind: "text" });
  // return data;
  await delay(120);
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return {
    id: `local-${Date.now()}`,
    conversationId,
    senderId: "me",
    kind: "text",
    text,
    time,
    isMine: true,
  };
}

export async function sendOffer(
  conversationId: string,
  offer: OfferPayload
): Promise<ChatMessage> {
  // const { data } = await customAxios.post(`/chats/${conversationId}/offers`, offer);
  // return data;
  await delay(160);
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return {
    id: `offer-${Date.now()}`,
    conversationId,
    senderId: "me",
    kind: "offer",
    text: "Offer to sell",
    time,
    isMine: true,
    offer: { ...offer, status: "pending" },
  };
}
