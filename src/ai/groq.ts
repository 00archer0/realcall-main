import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Default model to use
export const DEFAULT_MODEL = 'openai/gpt-oss-120b';

// Helper function for chat completions
export async function chatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    response_format?: { type: 'json_object' };
  }
) {
  const response = await groq.chat.completions.create({
    model: options?.model || DEFAULT_MODEL,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.max_tokens ?? 2048,
    ...(options?.response_format && { response_format: options.response_format }),
  });

  return response.choices[0]?.message?.content || '';
}

// Helper function for JSON completions with automatic parsing
export async function jsonCompletion<T>(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  }
): Promise<T> {
  const response = await chatCompletion(messages, {
    ...options,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response) as T;
}
