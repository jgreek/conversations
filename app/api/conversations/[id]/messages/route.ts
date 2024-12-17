// app/api/conversations/[id]/messages/route.ts
import {type NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {getConversationsData, saveConversationsData} from '@/app/utils/s3';

export async function POST(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const {id} = await params;
        const {content} = await request.json();
        const data = await getConversationsData();
        const conversation = data.conversations.find(c => c.id === id);

        if (!conversation) {
            return NextResponse.json(
                {error: 'Conversation not found'},
                {status: 404}
            );
        }

        conversation.messages.push({
            content,
            timestamp: new Date().toISOString(),
            sender: 'me'
        });

        await saveConversationsData(data);

        // Return the updated conversation object
        return NextResponse.json(conversation);
    } catch (error) {
        console.error('Error adding message:', error);
        return NextResponse.json(
            {error: 'Failed to add message'},
            {status: 500}
        );
    }
}