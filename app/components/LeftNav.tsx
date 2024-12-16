'use client';

import { useState } from 'react';
import { useConversations } from '../hooks/useConversations';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FormattedDate from "@/app/api/conversations/FormattedDate";
import { Logo } from "@/app/components/Logo";
interface LeftNavProps {
    onClose?: () => void;
}

export default function LeftNav({ onClose }: LeftNavProps) {
    const { conversations, loading, error, addConversation, deleteConversation } = useConversations();
    const [newConversationTitle, setNewConversationTitle] = useState('');
    const pathname = usePathname();

    const handleCreateConversation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newConversationTitle.trim()) return;
        await addConversation(newConversationTitle);
        setNewConversationTitle('');
    };

     const baseClasses = `
        w-72 h-full bg-gray-900 text-gray-100 flex flex-col
        fixed left-0 top-0 lg:relative
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0
        border-r border-gray-800
        z-40
    `;

    // Common header component with close button for mobile
    const Header = () => (
        <div className="p-4 border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center justify-between">
                <Logo />
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                        aria-label="Close sidebar"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className={baseClasses}>
                <Header />
                <div className="p-4">
                    <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-4 py-1">
                            <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-800 rounded"></div>
                                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={baseClasses}>
                <Header />
                <div className="p-4">
                    <div className="text-red-400 bg-red-400/10 p-3 rounded-lg">
                        Error: {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <nav className={`${baseClasses} overflow-hidden`}>
            <Header />
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    <form onSubmit={handleCreateConversation} className="mb-6">
                        <input
                            type="text"
                            value={newConversationTitle}
                            onChange={(e) => setNewConversationTitle(e.target.value)}
                            placeholder="New conversation title"
                            className="w-full p-2.5 rounded-lg bg-gray-800 text-white placeholder-gray-400
                                     border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                     transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!newConversationTitle.trim()}
                            className="w-full mt-2 p-2.5 bg-blue-600 text-white rounded-lg font-medium
                                     hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                     focus:ring-offset-gray-900 transition-colors disabled:opacity-50
                                     disabled:cursor-not-allowed"
                        >
                            Create New Conversation
                        </button>
                    </form>

                    <div className="space-y-1">
                        {conversations?.map((conversation) => {
                            const isActive = pathname === `/conversations/${conversation.id}`;
                            return (
                                <div
                                    key={conversation.id}
                                    className={`group rounded-lg transition-colors ${
                                        isActive ? 'bg-gray-800' : 'hover:bg-gray-800/50'
                                    }`}
                                >
                                    <Link
                                        href={`/conversations/${conversation.id}`}
                                        onClick={() => onClose?.()}
                                        className="block p-3"
                                    >
                                        <div className="font-medium text-gray-100 truncate">
                                            {conversation.tagline}
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">
                                            <FormattedDate timestamp={conversation.timestamp} />
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {conversation.model}
                                        </div>
                                    </Link>
                                    <div className="px-3 pb-2">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                deleteConversation(conversation.id);
                                            }}
                                            className="text-sm text-red-400 hover:text-red-300 transition-colors
                                                     focus:outline-none focus:ring-2 focus:ring-red-500
                                                     focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}