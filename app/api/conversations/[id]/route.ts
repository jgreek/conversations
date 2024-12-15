import {type NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {Conversation} from '@/app/types';
import {S3Client, GetObjectCommand, PutObjectCommand} from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const username = process.env.USERNAME!;
    const key = `users/${username}/history.json`;

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    const str = await response.Body?.transformToString();
    const data = str ? JSON.parse(str) : { conversations: [] };

    const conversation = data.conversations.find((c: any) => c.id === id);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}


export async function DELETE(
    request: NextRequest,
    {params}: { params: { id: string } }
) {
    try {
        const {id} = params;
        const username = process.env.USERNAME!;
        const key = `users/${username}/history.json`;

        // Fetch existing conversations
        const getCommand = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        });

        const response = await s3Client.send(getCommand);
        const str = await response.Body?.transformToString();
        const data = str ? JSON.parse(str) : {conversations: []};

        // Remove conversation
        data.conversations = data.conversations.filter(
            (c: any) => c.id !== id
        );

        // Save updated conversations
        const putCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: JSON.stringify(data),
        });

        await s3Client.send(putCommand);
        return NextResponse.json({success: true});
    } catch (error) {
        console.error('Error deleting conversation:', error);
        return NextResponse.json(
            {error: 'Failed to delete conversation'},
            {status: 500}
        );
    }
}