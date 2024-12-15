'use client';
import { useState } from 'react';
import { useConversations } from '../hooks/useConversations';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FormattedDate from "@/app/api/conversations/FormattedDate";
import { Logo } from "@/app/components/Logo";

export default function LeftNav() {
  const { conversations, loading, error, addConversation, deleteConversation } = useConversations();
  const [newConversationTitle, setNewConversationTitle] = useState('');
  const pathname = usePathname();
  const navBase = "w-64 min-h-screen bg-gray-900 text-gray-100";

  const handleCreateConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConversationTitle.trim()) return;
    await addConversation(newConversationTitle);
    setNewConversationTitle('');
  };

  if (loading) {
    return (
      <div className={navBase}>
        <Logo />
        <div className="p-4">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={navBase}>
        <Logo />
        <div className="p-4">
          <div className="text-red-400">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <nav className={`${navBase} overflow-y-auto`}>
      <Logo />
      <div className="p-4">
        <form onSubmit={handleCreateConversation} className="mb-4">
          <input
            type="text"
            value={newConversationTitle}
            onChange={(e) => setNewConversationTitle(e.target.value)}
            placeholder="New conversation title"
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <button
            type="submit"
            className="w-full mt-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create New Conversation
          </button>
        </form>

        <h2 className="text-xl font-bold mb-4 text-gray-100">Conversations</h2>
        <ul className="space-y-2">
          {conversations?.map((conversation) => {
            const isActive = pathname === `/conversations/${conversation.id}`;
            return (
              <li
                key={conversation.id}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  isActive ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
              >
                <Link href={`/conversations/${conversation.id}`}>
                  <div className="font-medium text-gray-100 truncate">
                    {conversation.tagline}
                  </div>
                  <div className="text-sm text-gray-400">
                    <FormattedDate timestamp={conversation.timestamp} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {conversation.model}
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    deleteConversation(conversation.id);
                  }}
                  className="mt-2 text-sm text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}