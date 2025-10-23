
'use server';
/**
 * @fileOverview Generates a simulated call transcript between an AI agent and a real estate dealer.
 *
 * - generateCallTranscript - A function that generates the call transcript.
 * - GenerateCallTranscriptInput - The input type for the function.
 * - GenerateCallTranscriptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCallTranscriptInputSchema = z.object({
  propertyTitle: z
    .string()
    .describe('The title of the property listing the agent is calling about.'),
  dealerName: z.string().describe("The name of the dealer or agency."),
});
export type GenerateCallTranscriptInput = z.infer<
  typeof GenerateCallTranscriptInputSchema
>;

const GenerateCallTranscriptOutputSchema = z.object({
  transcript: z.string().describe('The full transcript of the conversation, formatted with "Agent:" and "User:" prefixes for each line.'),
  isInterested: z.boolean().describe('A boolean indicating if the agent determined the dealer/property is of interest.'),
});
export type GenerateCallTranscriptOutput = z.infer<
  typeof GenerateCallTranscriptOutputSchema
>;

export async function generateCallTranscript(
  input: GenerateCallTranscriptInput
): Promise<GenerateCallTranscriptOutput> {
  return generateCallTranscriptFlow(input);
}

const systemPrompt = `You are an AI assistant role-playing a phone call.
Your goal is to generate a realistic, multi-turn conversation between a 'User' (an AI agent) and an 'Agent' (a real estate dealer).

The 'User' is calling to inquire about a specific property: "{{propertyTitle}}".
The 'Agent' works for "{{dealerName}}".

Generate a transcript for this call. The conversation should be natural. The 'Agent' might be busy, friendly, or short-tempered. The 'User' should be polite and try to get information.

Based on the conversation, determine if the property is still available and if the dealer is worth a follow-up. This will determine the 'isInterested' field. For example, if the dealer is helpful and the property is available, 'isInterested' should be true. If it's a wrong number, the property is sold, or the dealer is unhelpful, it should be false.

Your entire response MUST be a single, valid JSON object.

Example:
{
  "transcript": "User: Hello, I'm calling to inquire about the property listing for '3 BHK in Kothrud'. Is this Prime Estates?\\nAgent: Yes, this is Prime Estates. The Kothrud property is available. Are you interested in a site visit?\\nUser: That's great to hear. Yes, I would be. When is a good time?\\nAgent: We have a slot tomorrow at 5 PM.\\nUser: Perfect, I'll be there. Thank you.\\nAgent: You're welcome. See you tomorrow.",
  "isInterested": true
}
`;

const generateCallTranscriptPrompt = ai.definePrompt({
  name: 'generateCallTranscriptPrompt',
  input: {schema: GenerateCallTranscriptInputSchema},
  output: {schema: GenerateCallTranscriptOutputSchema},
  prompt: systemPrompt,
});

const generateCallTranscriptFlow = ai.defineFlow(
  {
    name: 'generateCallTranscriptFlow',
    inputSchema: GenerateCallTranscriptInputSchema,
    outputSchema: GenerateCallTranscriptOutputSchema,
  },
  async input => {
     try {
      const response = await generateCallTranscriptPrompt(input);
      const output = response.output;
      if (!output) {
        throw new Error('Received no output from model for call transcript generation.');
      }
      return output;
    } catch (e) {
      console.error("Error in generateCallTranscriptFlow:", e);
      throw e;
    }
  }
);
