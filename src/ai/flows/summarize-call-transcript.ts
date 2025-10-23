
'use server';
/**
 * @fileOverview Summarizes a call transcript using GenAI to extract key information and store it in call metadata.
 *
 * - summarizeCallTranscript - A function that summarizes the call transcript.
 * - SummarizeCallTranscriptInput - The input type for the summarizeCallTranscript function.
 * - SummarizeCallTranscriptOutput - The return type for the summarizeCallTranscript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  return summarizeCallTranscriptFlow(input);
}

const systemPrompt = `Summarize the following call transcript, extracting the key information and action items discussed during the call.

Your entire response MUST be a single JSON object with a single 'summary' field.

Transcript:
{{{transcript}}}`;


const summarizeCallTranscriptPrompt = ai.definePrompt({
  name: 'summarizeCallTranscriptPrompt',
  input: {schema: SummarizeCallTranscriptInputSchema},
  output: {schema: SummarizeCallTranscriptOutputSchema},
  prompt: systemPrompt,
});

const summarizeCallTranscriptFlow = ai.defineFlow(
  {
    name: 'summarizeCallTranscriptFlow',
    inputSchema: SummarizeCallTranscriptInputSchema,
    outputSchema: SummarizeCallTranscriptOutputSchema,
  },
  async input => {
    try {
      const response = await summarizeCallTranscriptPrompt(input);
      const output = response.output;
      if (!output) {
        throw new Error('Received no output from model for summary generation.');
      }
      return output;
    } catch (e) {
      console.error("Error in summarizeCallTranscriptFlow:", e);
      throw e;
    }
  }
);
