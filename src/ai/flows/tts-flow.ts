'use server';
/**
 * @fileOverview Converts text to speech using Groq's TTS API.
 */

import { groq } from '@/ai/groq';
import { z } from 'zod';

const TextToSpeechSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});

const TextToSpeechOutputSchema = z.object({
  audio: z.string().describe('The base64 encoded audio data URI.'),
});

export async function textToSpeech(
  input: z.infer<typeof TextToSpeechSchema>
): Promise<z.infer<typeof TextToSpeechOutputSchema>> {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in environment variables');
    }

    console.log('[TTS] Generating speech for text:', input.text.substring(0, 100) + '...');

    // Use Groq's TTS API directly via fetch
    const response = await fetch('https://api.groq.com/openai/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'playai-tts',
        voice: 'Celeste-PlayAI', // Professional male voice
        input: input.text,
        response_format: 'wav',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[TTS] Groq API error response:', errorText);
      throw new Error(`Groq TTS API error (${response.status}): ${response.statusText} - ${errorText}`);
    }

    // Convert the response to a buffer
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    console.log('[TTS] Successfully generated audio, size:', audioBuffer.byteLength, 'bytes');
    
    return {
      audio: `data:audio/wav;base64,${base64Audio}`,
    };
  } catch (error) {
    console.error('[TTS] Error generating speech with Groq:', error);
    console.error('[TTS] Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}
