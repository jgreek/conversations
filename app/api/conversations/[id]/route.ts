import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Conversation, ConversationData } from '@/app/types';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const username = process.env.USERNAME!;
    const key = `users/${username}/history.json`;

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    const str = await response.Body?.transformToString();
    const data: ConversationData = str ? JSON.parse(str) : { conversations: [] };

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
    const username = process.env.USERNAME!;
    const key = `users/${username}/history.json`;

    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(getCommand);
    const str = await response.Body?.transformToString();
    const data: ConversationData = str ? JSON.parse(str) : { conversations: [] };

    data.conversations = data.conversations.filter(
      (c: Conversation) => c.id !== id
    );

    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(data),
    });

    await s3Client.send(putCommand);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}