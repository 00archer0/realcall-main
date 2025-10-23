
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-call-transcript.ts';
import '@/ai/flows/generate-real-estate-subqueries.ts';
import '@/ai/flows/generate-call-transcript.ts';
import '@/ai/flows/search-for-candidates.ts';
import '@/ai/flows/agent-chat-flow.ts';
import '@/ai/flows/user-chat-flow.ts';
import '@/ai/flows/tts-flow.ts';
