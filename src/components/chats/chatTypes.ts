export type MessageKind = "text" | "voice" | "images" | "offer";

export type ChatReaction = {
  emoji: string;
  count: number;
};

export type OfferPayload = {
  title: string;
  price: number;
  currency?: string;
  image?: string;
  listingId?: string;
  status?: "pending" | "accepted" | "declined";
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  kind: MessageKind;
  text?: string;
  time: string;
  voiceDuration?: string;
  images?: string[];
  mentions?: string[];
  reactions?: ChatReaction[];
  offer?: OfferPayload;
  isMine: boolean;
  dateLabel?: string;
};

export type Conversation = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  photo?: string;
  avatarColor: string;
  lastMessage: string;
  lastMessageIcon?: "mic" | "image" | "offer" | "pen";
  time: string;
  unread: number;
  pinned: boolean;
  online: boolean;
  typing?: boolean;
  verified?: boolean;
  inCall?: boolean;
  callDuration?: string;
};
