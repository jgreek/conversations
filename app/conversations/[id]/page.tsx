'use client';

import { useEffect, useState } from 'react';
import { Conversation } from '@/app/types';
import { useParams } from 'next/navigation';

export default function ConversationPage() {
  const params = useParams();
  const id = params?.id as string;
  const [conversation, setConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      const res = await fetch(`/api/conversations/${id}`);
      const data = await res.json();
      setConversation(data);
    };

    if (id) fetchConversation();
  }, [id]); // Single dependency

  if (!conversation) return <div>Loading conversations...</div>;

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