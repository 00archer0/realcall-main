
'use server';

import { generateRealEstateSubqueries } from '@/ai/flows/generate-real-estate-subqueries';
import { searchForCandidates } from '@/ai/flows/search-for-candidates';
import type { Subquery, Candidate } from './types';
import { Twilio } from 'twilio';
import { userChat } from '@/ai/flows/user-chat-flow';
import { agentChat } from '@/ai/flows/agent-chat-flow';
import { summarizeCallTranscript } from '@/ai/flows/summarize-call-transcript';

/**
 * Generates structured real estate subqueries from a free-text query using an LLM.
 */
export async function generateSubqueriesAction(query: string): Promise<Subquery[]> {
  console.log('[Action] generateSubqueriesAction - Starting subquery generation');
  console.log(`[Action] Input query: "${query}"`);
  try {
    const subqueries = await generateRealEstateSubqueries({ query });
    if (!subqueries || subqueries.length === 0) {
      console.log('[Action] Warning: LLM returned no subqueries');
    } else {
      console.log(`[Action] Generated ${subqueries.length} subqueries:`);
      subqueries.forEach((sq, idx) => {
        console.log(`[Action]   ${idx + 1}. "${sq.query_text}" (Priority: ${sq.priority})`);
      });
    }
    return subqueries;
  } catch (error) {
    console.error('[Action] Error in generateSubqueriesAction:', error);
    throw error;
  }
}

/**
 * Performs a web search using an AI flow to find property candidates.
 */
export async function searchAction(subqueries: Subquery[]): Promise<Candidate[]> {
  console.log(`[Action] searchAction - Starting web search with ${subqueries.length} subqueries`);
  try {
    const candidates = await searchForCandidates({ subqueries });
    const withPhones = candidates.filter(c => c.phone_numbers[0] !== 'No phone number found').length;
    console.log(`[Action] Search complete: Found ${candidates.length} candidates (${withPhones} with phone numbers)`);
    // Add a unique ID to each candidate. In a real app this would come from a database.
    return candidates.map((c, i) => ({ ...c, id: i + 1 }));
  } catch (error) {
    console.error('[Action] Error in searchAction:', error);
    throw error;
  }
}


/**
 * Initiates a phone call via Twilio.
 */
export async function initiateCallAction(candidate: Candidate): Promise<{ callSid: string }> {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, TWILIO_TO_NUMBER, APP_BASE_URL } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    const errorMessage = 'Twilio credentials are not configured in .env file.';
    console.error(`[ERROR] ${errorMessage}`);
    throw new Error(errorMessage);
  }

  if (!APP_BASE_URL) {
    const errorMessage = 'APP_BASE_URL is not configured in .env file. Please set it to your public URL for the Twilio webhook.';
    console.error(`[ERROR] ${errorMessage}`);
    throw new Error(errorMessage);
  }
  
  const callToNumber = TWILIO_TO_NUMBER || candidate.phone_numbers[0];
  if (!callToNumber || callToNumber === 'No phone number found') {
    const errorMessage = "The destination phone number is not available. Please set TWILIO_TO_NUMBER in the .env file or ensure the candidate has a valid phone number.";
    console.error(`[ERROR] ${errorMessage}`);
    throw new Error(errorMessage);
  }

  if(TWILIO_TO_NUMBER) {
    console.log(`Action: initiateCallAction. Redirecting call to TWILIO_TO_NUMBER: ${TWILIO_TO_NUMBER}`);
  }
  console.log(`Action: initiateCallAction. Attempting to call ${candidate.dealer_name} at ${callToNumber}`);

  try {
    const twilio = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    
    // Initialize call storage first (we'll use a temporary ID)
    const { initializeCall } = await import('@/lib/call-storage');
    
    // Create the call
    const call = await twilio.calls.create({
      url: new URL('/api/call/webhook', APP_BASE_URL).toString() + 
           `?propertyTitle=${encodeURIComponent(candidate.property_title)}&dealerName=${encodeURIComponent(candidate.dealer_name)}`,
      to: callToNumber,
      from: TWILIO_PHONE_NUMBER,
      method: 'POST',
      record: true,
      recordingStatusCallback: new URL('/api/call/recording-callback', APP_BASE_URL).toString(),
      recordingStatusCallbackMethod: 'POST',
      statusCallback: new URL('/api/call/status-callback', APP_BASE_URL).toString(),
      statusCallbackMethod: 'POST',
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    });
    
    console.log(`Action: initiateCallAction. Call initiated with SID: ${call.sid}`);
    
    // Initialize call storage with the actual CallSid
    initializeCall(call.sid, candidate.property_title, candidate.dealer_name);
    
    return { callSid: call.sid };

  } catch (error) {
    console.error('Error initiating Twilio call:', error);
    // Provide a more user-friendly error message
    if (error instanceof Error && 'code' in error && error.code === 21211) {
       throw new Error(`The phone number '${callToNumber}' is not a valid number.`);
    }
    // Re-throw the original error for better debugging
    throw error;
  }
}

export async function getCallStatusAction(callSid: string): Promise<{ status: string }> {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
        const errorMessage = 'Twilio credentials are not configured in .env file.';
        console.error(`[ERROR] ${errorMessage}`);
        throw new Error(errorMessage);
    }
    
    const twilio = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    
    try {
        const call = await twilio.calls(callSid).fetch();
        return { status: call.status };
    } catch (error) {
        console.error(`Error fetching call status for SID ${callSid}:`, error);
        throw new Error(`Could not fetch call status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export { userChat, agentChat, summarizeCallTranscript };
