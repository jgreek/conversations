'use client';

import { useConversations } from '../hooks/useConversations';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FormattedDate from "@/app/api/conversations/FormattedDate";

export default function LeftNav() {
  const { conversations, loading, error } = useConversations();
  const pathname = usePathname();

  const navBase = "w-64 min-h-screen bg-gray-900 text-gray-100";

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
        <h2 className="text-xl font-bold mb-4 text-gray-100">Conversations</h2>
        <ul className="space-y-2">
          {conversations?.map((conversation) => {
            const isActive = pathname === `/conversations/${conversation.id}`;
            return (
              <Link
                href={`/conversations/${conversation.id}`}
                key={conversation.id}
              >
                <li
                  className={`p-3 rounded cursor-pointer transition-colors
                    ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                >
                  <div className="font-medium text-gray-100 truncate">
                    {conversation.tagline}
                  </div>
                  <div className="text-sm text-gray-400">
                    <FormattedDate timestamp={conversation.timestamp} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {conversation.model}
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <div className="p-4 border-b border-gray-800">
      <div className="flex items-center gap-2">
        <div className="text-blue-500 font-bold text-2xl">JX</div>
        <div className="text-gray-100 font-bold text-2xl">GPT</div>
      </div>
    </div>
  );
}