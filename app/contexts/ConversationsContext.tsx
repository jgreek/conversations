// app/contexts/ConversationsContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Conversation } from '../types';

interface ConversationsContextType {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  addConversation: (tagline: string) => Promise<Conversation>;
  deleteConversation: (id: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
  refreshTitle: (id: string, newTitle?: string) => Promise<void>;
}

export const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      setConversations(data.conversations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const addConversation = async (tagline: string): Promise<Conversation> => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagline }),
      });

      if (!response.ok) throw new Error('Failed to create conversation');
      const newConversation = await response.json();
      await fetchConversations();
      return newConversation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete conversation');
      await fetchConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const refreshTitle = async (id: string, newTitle?: string) => {
    if (newTitle) {
      // Optimistic update
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === id ? { ...conv, tagline: newTitle } : conv
        )
      );
    }
    await fetchConversations();
  };

  const value = {
    conversations,
    loading,
    error,
    addConversation,
    deleteConversation,
    refreshConversations: fetchConversations,
    refreshTitle,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const context = useContext(ConversationsContext);
  if (context === undefined) {
    throw new Error('useConversations must be used within a ConversationsProvider');
  }
  return context;
}