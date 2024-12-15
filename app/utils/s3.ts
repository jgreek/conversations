// app/utils/s3.ts
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConversationData } from '@/app/types';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getConversationsData(): Promise<ConversationData> {
  const username = process.env.USERNAME!;
  const key = `users/${username}/history.json`;

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  const response = await s3Client.send(command);
  const str = await response.Body?.transformToString();
  return str ? JSON.parse(str) : { conversations: [] };
}

export async function saveConversationsData(data: ConversationData) {
  const username = process.env.USERNAME!;
  const key = `users/${username}/history.json`;

  const putCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(data),
  });

  await s3Client.send(putCommand);
}