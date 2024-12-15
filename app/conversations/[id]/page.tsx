'use client';
import {useEffect, useState, useRef} from 'react';
import {Conversation} from '@/app/types';
import {useParams, useRouter} from 'next/navigation';
import {useSummarization} from "@/app/hooks/useSummarization";

export default function ConversationPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const {summarize, loading: summarizing} = useSummarization();
    const [summary, setSummary] = useState<string | null>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation?.messages]);

    const fetchConversation = async () => {
        try {
            const res = await fetch(`/api/conversations/${id}`);
            if (!res.ok) {
                if (res.status === 404) {
                    setError('Conversation not found');
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

    useEffect(() => {
        if (id) fetchConversation();
    }, [id, router]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await fetch(`/api/conversations/${id}/messages`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({content: newMessage}),
            });

            if (!response.ok) throw new Error('Failed to send message');

            setNewMessage('');
            await fetchConversation();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send message');
        }
    };
    const handleSummarize = async () => {
        if (!conversation || summarizing) return;

        // Convert conversation to a format suitable for summarization
        const conversationText = conversation.messages
            .map(msg => `${msg.sender}: ${msg.content}`)
            .join('\n');

        const result = await summarize(conversationText, {
            maxLength: 280,
            format: 'paragraph',
            focus: ['key points', 'main topics'],
            temperature: 0.3
        });

        if (result) {
            setSummary(result);
        }
    };
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
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}

           <div className="bg-white border-b p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-blue-800">{conversation.tagline}</h1>
                    <button
                        onClick={handleSummarize}
                        disabled={summarizing}
                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200
                                 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        {summarizing ? 'Summarizing...' : 'Summarize'}
                    </button>
                </div>
                {summary && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                        <div className="font-medium mb-1">Summary:</div>
                        {summary}
                    </div>
                )}
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversation.messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            message.sender === 'me' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                message.sender === 'me'
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                            }`}
                        >
                            <div>{message.content}</div>
                            <div className={`text-xs mt-1 ${
                                message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef}/>
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="bg-white border-t p-4">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 text-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600
                     disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}