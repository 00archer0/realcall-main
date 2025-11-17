'use server';
/**
 * @fileOverview Defines a flow for generating user responses in a real-time chatbot conversation.
 */

import { chatCompletion } from '@/ai/groq';
import { z } from 'zod';

const UserChatInputSchema = z.object({
  propertyTitle: z.string().describe('The title of the property listing.'),
  dealerName: z.string().describe('The name of the dealer or agency.'),
  history: z.array(z.object({
    role: z.enum(['user', 'agent']),
    content: z.string(),
  })).describe('The history of the conversation so far.'),
});
export type UserChatInput = z.infer<typeof UserChatInputSchema>;

export type UserChatOutput = string;

export async function userChat(input: UserChatInput): Promise<UserChatOutput> {
  try {
    const systemPrompt = `You are role-playing as a potential property buyer.
The agent you are talking to is named "${input.dealerName}".
You are inquiring about a property named "${input.propertyTitle}".

Your goal is to be a typical, slightly impatient but polite, prospective buyer.
Keep your responses very short and to the point, like a real phone call.

- If the history is empty, your first line should be an inquiry about the property.
- Ask if the property is available.
- Ask for details like price or to schedule a visit.
- If the agent asks for your details, you can politely deflect or end the call.

Based on the history, provide the next natural response for the 'user'.
Do NOT repeat the agent's message. Only provide your response as the user.`;

    // Convert history to messages format
    const historyMessages = input.history.map(msg => ({
      role: msg.role === 'user' ? 'assistant' as const : 'user' as const,
      content: msg.content,
    }));

    const response = await chatCompletion(
      [
        { role: 'system', content: systemPrompt },
        ...historyMessages,
      ]
    );

    return response;
  } catch (e) {
    console.error('Error in userChat:', e);
    throw e;
  }
}
