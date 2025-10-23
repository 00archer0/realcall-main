
'use server';
/**
 * @fileOverview Defines a Genkit flow for generating user responses in a real-time chatbot conversation.
 *
 * - userChat - A function that handles the user's side of the conversation.
 * - UserChatInput - The input type for the userChat function.
 * - UserChatOutput - The return type for the userChat function (the user's text response).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { ChatMessage } from '@/lib/types';

const UserChatInputSchema = z.object({
  propertyTitle: z.string().describe('The title of the property listing.'),
  dealerName: z.string().describe('The name of the dealer or agency.'),
  history: z.array(z.object({
    role: z.enum(['user', 'agent']),
    content: z.string(),
  })).describe('The history of the conversation so far.'),
});
export type UserChatInput = z.infer<typeof UserChatInputSchema>;

// The output is just the user's next message.
export type UserChatOutput = string;

export async function userChat(input: UserChatInput): Promise<UserChatOutput> {
  return userChatFlow(input);
}

const systemPrompt = `You are role-playing as a potential property buyer.
The agent you are talking to is named "{{dealerName}}".
You are inquiring about a property named "{{propertyTitle}}".

Your goal is to be a typical, slightly impatient but polite, prospective buyer.
Keep your responses very short and to the point, like a real phone call.

- If the history is empty, your first line should be an inquiry about the property.
- Ask if the property is available.
- Ask for details like price or to schedule a visit.
- If the agent asks for your details, you can politely deflect or end the call.

Based on the history, provide the next natural response for the 'user'.
Do NOT repeat the agent's message. Only provide your response as the user.
`;

const userChatPrompt = ai.definePrompt(
  {
    name: 'userChatPrompt',
    input: { schema: UserChatInputSchema },
    // We expect a simple string response for the user's message
    output: { format: 'text' },
    prompt: systemPrompt + '\n\nConversation History:\n{{#each history}}{{role}}: {{content}}\n{{/each}}\nUser:',
  }
);


const userChatFlow = ai.defineFlow(
  {
    name: 'userChatFlow',
    inputSchema: UserChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    try {
      const response = await userChatPrompt(input);
      const output = response.output;
      if (!output) {
        throw new Error('Received no text output from model for user chat.');
      }
      return output;
    } catch (e) {
      console.error("Error in userChatFlow:", e);
      throw e;
    }
  }
);
