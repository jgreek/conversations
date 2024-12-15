// app/types.ts
export interface Message {
  content: string;
  timestamp: string;
  sender: 'me' | 'other';
}

export interface Conversation {
  id: string;
  tagline: string;
  timestamp: string;
  messages: Message[];
  model: string;
}

export interface ConversationData {
  conversations: Conversation[];
}