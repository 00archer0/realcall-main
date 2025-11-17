'use server';
/**
 * @fileOverview Summarizes a call transcript using Groq to extract key information and store it in call metadata.
 */

import { chatCompletion } from '@/ai/groq';
import { z } from 'zod';

const SummarizeCallTranscriptInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the call to be summarized.'),
});
export type SummarizeCallTranscriptInput = z.infer<
  typeof SummarizeCallTranscriptInputSchema
>;

const SummarizeCallTranscriptOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the call transcript.'),
});
export type SummarizeCallTranscriptOutput = z.infer<
  typeof SummarizeCallTranscriptOutputSchema
>;

export async function summarizeCallTranscript(
  input: SummarizeCallTranscriptInput
): Promise<SummarizeCallTranscriptOutput> {
  try {
    const systemPrompt = `Summarize the following call transcript, extracting the key information and action items discussed during the call.

Your entire response MUST be a single JSON object with a single 'summary' field.

Example format:
{"summary": "The call discussed..."}`;

    const response = await chatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Transcript:\n${input.transcript}` },
      ],
      { response_format: { type: 'json_object' } }
    );

    const parsed = JSON.parse(response);
    return SummarizeCallTranscriptOutputSchema.parse(parsed);
  } catch (e) {
    console.error('Error in summarizeCallTranscript:', e);
    throw e;
  }
}
