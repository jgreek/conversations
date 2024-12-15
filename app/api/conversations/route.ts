import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    const username = process.env.USERNAME!;
    const key = `users/${username}/history.json`;

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    const str = await response.Body?.transformToString();
    const data = str ? JSON.parse(str) : { conversations: [] };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading from S3:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tagline } = await request.json();
    const username = process.env.USERNAME!;
    const key = `users/${username}/history.json`;

    // Fetch existing conversations
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    let data;
    try {
      const response = await s3Client.send(getCommand);
      const str = await response.Body?.transformToString();
      data = str ? JSON.parse(str) : { conversations: [] };
    } catch {
      data = { conversations: [] };
    }

    // Add new conversation
    const newConversation = {
      id: uuidv4(),
      tagline,
      timestamp: new Date().toISOString(),
      model: 'default-model',
      messages: [],
    };

    data.conversations.unshift(newConversation);

    // Save updated conversations
    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(data),
    });

    await s3Client.send(putCommand);
    return NextResponse.json(newConversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}