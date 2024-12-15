// app/api/conversations/[id]/route.ts
import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getConversationsData, saveConversationsData } from '@/app/utils/s3';
import { Conversation } from '@/app/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getConversationsData();
    const conversation = data.conversations.find((c: Conversation) => c.id === id);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error reading from S3:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getConversationsData();

    data.conversations = data.conversations.filter(
      (c: Conversation) => c.id !== id
    );

    await saveConversationsData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}