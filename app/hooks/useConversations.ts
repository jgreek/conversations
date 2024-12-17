import {useContext} from "react";
import {ConversationsContext} from "@/app/contexts/ConversationsContext";

export function useConversations() {
  const context = useContext(ConversationsContext);
  if (context === undefined) {
    throw new Error('useConversations must be used within a ConversationsProvider');
  }
  return context;
}