import { NextResponse } from 'next/server';
import { Conversation } from '@/app/types';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

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
    const conversations: Conversation[] = str ? JSON.parse(str).conversations : [];

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error reading from S3:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}