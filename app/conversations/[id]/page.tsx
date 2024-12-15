'use client';
import { useEffect, useState } from 'react';
import { Conversation } from '@/app/types';
import { useParams, useRouter } from 'next/navigation';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await fetch(`/api/conversations/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Conversation not found');
            // Optionally redirect after a short delay
            setTimeout(() => {
              router.push('/conversations');
            }, 2000);
            return;
          }
          throw new Error('Failed to fetch conversation');
        }
        const data = await res.json();
        setConversation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    if (id) fetchConversation();
  }, [id, router]);

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">{error}</div>
        <div className="text-gray-600 mt-2">Redirecting to conversations...</div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading conversation...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{conversation.tagline}</h1>
      <div className="text-sm text-gray-500 mb-6">
        {conversation.timestamp}
      </div>
      <div className="space-y-4">
        {conversation.messages.map((message, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow">
            <div className="text-gray-800">{message.content}</div>
            <div className="text-xs text-gray-500 mt-2">
              {message.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}