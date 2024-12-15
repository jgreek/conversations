// app/api/conversations/[id]/messages/route.ts
import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content } = await request.json();
    const username = process.env.USERNAME!;
    const key = `users/${username}/history.json`;

    // Get existing conversations
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(getCommand);
    const str = await response.Body?.transformToString();
    const data = str ? JSON.parse(str) : { conversations: [] };

    // Find and update the conversation
    const conversation = data.conversations.find((c: any) => c.id === id);
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Add new message
    conversation.messages.push({
      content,
      timestamp: new Date().toISOString(),
      sender: 'me'
    });

    // Save updated conversations
    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(data),
    });

    await s3Client.send(putCommand);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding message:', error);
    return NextResponse.json(
      { error: 'Failed to add message' },
      { status: 500 }
    );
  }
}