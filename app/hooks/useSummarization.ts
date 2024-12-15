// app/hooks/useSummarization.ts
import { useState } from 'react';

interface SummarizationOptions {
  maxLength?: number;
  format?: 'bullet' | 'paragraph' | 'json';
  focus?: string[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

interface SummarizationResponse {
  content: string | null;
  error?: string;
}

export function useSummarization() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarize = async (
    content: string | object,
    options: SummarizationOptions = {}
  ) => {
    const {
      maxLength = 200,
      format = 'paragraph',
      focus = [],
      temperature = 0.3,
      maxTokens = 1024,
      model = 'claude-3-sonnet-20240229'
    } = options;

    setLoading(true);
    setError(null);

    try {
      const contentStr = typeof content === 'string'
        ? content
        : JSON.stringify(content, null, 2);

      const systemPrompt = `You are a skilled summarizer. Create clear, concise summaries while retaining key information.
        
Format requirements:
${format === 'bullet' ? '- Provide the summary as bullet points' : ''}
${format === 'paragraph' ? '- Provide the summary as a coherent paragraph' : ''}
${format === 'json' ? '- Provide the summary as a JSON object with key points' : ''}

Additional requirements:
- Keep the summary under ${maxLength} characters
${focus.length > 0 ? `- Focus particularly on these aspects: ${focus.join(', ')}` : ''}
- Maintain factual accuracy
- Preserve key details and relationships
- Use clear, concise language

${format === 'json' ? 'Ensure your response is valid JSON that can be parsed.' : ''}`;

      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemPrompt,
          userPrompt: `Please summarize the following content:\n\n${contentStr}`,
          temperature,
          maxTokens,
          model
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json() as SummarizationResponse;

      if (data.error) throw new Error(data.error);
      if (!data.content) throw new Error('No content in response');

      if (format === 'json') {
        try {
          return JSON.parse(data.content);
        } catch {
          throw new Error('Failed to parse JSON summary');
        }
      }

      return data.content;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { summarize, loading, error };
}