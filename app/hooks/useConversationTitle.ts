import {useState} from 'react';
import {Message} from '../types';

export function useConversationTitle() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // app/hooks/useConversationTitle.ts
    const updateTitle = async (id: string, messages: Message[]) => {
        setLoading(true);
        setError(null);

        try {
            const firstLongMessage = messages.find(msg => msg.content.length > 50);
            if (!firstLongMessage) {
                return {success: false};
            }

            const systemPrompt = `Based on the user's message, generate a single clear and concise tagline. Don't include any explanatory text, just output the tagline itself. The tagline must be under 50 characters and capture the essence of the topic or question being discussed.`;

            const claudeResponse = await fetch('/api/claude', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    systemPrompt,
                    userPrompt: firstLongMessage.content,
                    temperature: 0.4,
                    maxTokens: 100,
                }),
            });

            if (!claudeResponse.ok) {
                throw new Error('Failed to generate title');
            }

            const {content} = await claudeResponse.json();
            if (!content) {
                return {success: false};
            }

            const updateResponse = await fetch(`/api/conversations/${id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({tagline: content}),
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to update conversation title');
            }

            return {success: true, title: content};
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update title');
            return {success: false};
        } finally {
            setLoading(false);
        }
    };

    return {updateTitle, loading, error};
}