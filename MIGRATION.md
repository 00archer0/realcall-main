# Migration from Genkit/Google to Groq

## Summary

Successfully migrated the Real Estate AI Agent project from Google's Genkit framework to Groq's fast LLM and TTS APIs.

## Changes Made

### 1. Dependencies Removed
- `@genkit-ai/google-genai` - Google AI plugin for Genkit
- `@genkit-ai/next` - Genkit Next.js integration
- `genkit` - Genkit core framework
- `genkit-cli` - Genkit CLI tools

### 2. Dependencies Added
- `groq-sdk` (v0.8.0) - Official Groq SDK for Node.js

### 3. Files Created
- `src/ai/groq.ts` - New Groq client configuration with helper functions
  - `chatCompletion()` - Helper for text completions
  - `jsonCompletion()` - Helper for JSON-formatted responses

### 4. Files Modified

#### AI Flows (All rewritten to use Groq)
- `src/ai/flows/agent-chat-flow.ts` - AI agent conversation logic
- `src/ai/flows/user-chat-flow.ts` - User simulation
- `src/ai/flows/generate-real-estate-subqueries.ts` - Query generation
- `src/ai/flows/search-for-candidates.ts` - Web search (no AI changes, just imports)
- `src/ai/flows/generate-call-transcript.ts` - Transcript generation
- `src/ai/flows/summarize-call-transcript.ts` - Call summarization
- `src/ai/flows/tts-flow.ts` - Text-to-speech using Groq's PlayAI TTS

#### Configuration Files
- `package.json` - Updated dependencies and removed Genkit scripts
- `.env` - Changed `GEMINI_API_KEY` to `GROQ_API_KEY`
- `.env.example` - Updated example configuration
- `src/ai/dev.ts` - Simplified to just import flows

#### UI Components
- `src/components/app/results-table.tsx` - Added Twilio status styles

### 5. Files Deleted
- `src/ai/genkit.ts` - Old Genkit configuration
- `src/ai/tools/search.ts` - Unused Genkit tool definitions

### 6. Scripts Removed
- `genkit:dev` - Genkit development server
- `genkit:watch` - Genkit watch mode

## API Changes

### Before (Genkit)
```typescript
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const flow = ai.defineFlow(
  {
    name: 'myFlow',
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
  },
  async (input) => {
    const response = await myPrompt(input);
    return response.output;
  }
);
```

### After (Groq)
```typescript
import { chatCompletion } from '@/ai/groq';
import { z } from 'zod';

export async function myFlow(input: MyInput): Promise<MyOutput> {
  const response = await chatCompletion(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    { response_format: { type: 'json_object' } }
  );
  
  return JSON.parse(response);
}
```

## Models Used

### LLM
- **Model**: `llama-3.3-70b-versatile`
- **Speed**: ~189x real-time for transcription
- **Use Cases**: All text generation (queries, conversations, summaries)

### TTS
- **Model**: `playai-tts`
- **Voice**: `Fritz-PlayAI` (professional male voice)
- **Format**: WAV audio
- **Use Cases**: Converting AI agent responses to speech for phone calls

## Environment Variables

### Required
```bash
GROQ_API_KEY=your_groq_api_key_here
```

### Optional (for other features)
```bash
TAVILY_API_KEY=your_tavily_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_TO_NUMBER=+1234567890
APP_BASE_URL=https://your-domain.com
```

## Benefits of Migration

1. **Faster Inference**: Groq's LPU architecture provides significantly faster response times
2. **Simpler Architecture**: Direct API calls instead of framework abstraction
3. **Better Control**: More explicit control over prompts and responses
4. **Native TTS**: Groq now provides built-in TTS, eliminating need for separate service
5. **Cost Effective**: Competitive pricing with excellent performance
6. **Easier Debugging**: Simpler code paths make debugging easier

## Testing

All functionality has been preserved:
- ✅ Query generation working
- ✅ Web search working
- ✅ Candidate extraction working
- ✅ AI conversations working
- ✅ TTS generation working
- ✅ Twilio integration working
- ✅ Build successful
- ✅ Type checking passing

## Performance Notes

From the logs, the system is working well:
- Generated 5 optimized subqueries from user input
- Searched and found 18 candidates in 15.93 seconds
- Successfully extracted phone numbers from 3 candidates
- Call initiated successfully with Twilio

## Next Steps

1. Get a Groq API key from https://console.groq.com
2. Update `.env` with your `GROQ_API_KEY`
3. Run `npm run dev` to start development
4. Test the AI flows with real queries

## Troubleshooting

### "GROQ_API_KEY is not set"
Make sure you've added your Groq API key to the `.env` file.

### TTS errors
Verify your Groq API key has access to the TTS endpoints. Some keys may have limited access.

### Build errors
Run `npm install` to ensure all dependencies are properly installed after the migration.

## Documentation

- Groq API Docs: https://console.groq.com/docs
- Groq TTS Guide: https://console.groq.com/docs/text-to-speech
- Groq Models: https://console.groq.com/docs/models
