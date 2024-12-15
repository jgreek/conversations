import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface ClaudeRequest {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

interface ClaudeResponse {
  content: string | null;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ClaudeResponse>> {
  try {
    const {
      systemPrompt,
      userPrompt,
      temperature = 0.7,
      maxTokens = 1024,
      model = 'claude-3-sonnet-20240229'
    } = await request.json() as ClaudeRequest;

    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: 'user', content: userPrompt }
      ],
      temperature,
      system: systemPrompt,
    });

    const textContent = response.content[0];
    if (textContent.type !== 'text') {
      throw new Error('Unexpected response format');
    }

    return NextResponse.json({ content: textContent.text });
  } catch (error) {
    console.error('Error calling Claude:', error);
    return NextResponse.json(
      { content: null, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}