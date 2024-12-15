// app/types.ts
export interface Message {
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  tagline: string;
  timestamp: string;
  model: string;
  messages: Message[];
}

export interface ConversationData {
  conversations: Conversation[];
}