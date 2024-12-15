export interface Message {
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  tagline: string;
  timestamp: string;
  model: string;
  temperature: number;
  maxTokens: number;
  messages: Message[];
}