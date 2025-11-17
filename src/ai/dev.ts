import { config } from 'dotenv';
config();

// Import all flows to ensure they're registered
import '@/ai/flows/summarize-call-transcript';
import '@/ai/flows/generate-real-estate-subqueries';
import '@/ai/flows/generate-call-transcript';
import '@/ai/flows/search-for-candidates';
import '@/ai/flows/agent-chat-flow';
import '@/ai/flows/user-chat-flow';
import '@/ai/flows/tts-flow';

console.log('AI flows loaded successfully');
