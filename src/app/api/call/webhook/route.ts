
import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { agentChat } from '@/ai/flows/agent-chat-flow';
import { textToSpeech } from '@/ai/flows/tts-flow';
import type { ChatMessage } from '@/lib/types';
import { updateCallHistory, getCallData, initializeCall } from '@/lib/call-storage';
import { storeAudio } from '@/lib/audio-storage';

const VoiceResponse = twilio.twiml.VoiceResponse;

// Force this route to use Node.js runtime (not Edge)
export const runtime = 'nodejs';

// This webhook handles the conversational turns of the Twilio call.
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyTitle = searchParams.get('propertyTitle') || 'the listed property';
    const dealerName = searchParams.get('dealerName') || 'the agency';
    
    // Get CallSid from form data (Twilio always sends this)
    let callSid = '';
    let speechResult: string | null = null;
    try {
        const formData = await req.formData();
        callSid = formData.get('CallSid') as string || '';
        speechResult = formData.get('SpeechResult') as string | null;
    } catch (e) {
        // This can happen on the first request from Twilio if the body is empty.
        console.log('[Webhook] Could not parse form data, likely the initial request.');
    }
    
    console.log(`[Webhook] CallSid: ${callSid}`);
    
    // Retrieve history from storage instead of URL params
    let history: ChatMessage[] = [];
    if (callSid) {
      let callData = getCallData(callSid);
      if (callData) {
        history = callData.history;
        console.log(`[Webhook] Retrieved ${history.length} messages from storage`);
      } else {
        // Initialize call storage if it doesn't exist (race condition with initiateCallAction)
        console.log(`[Webhook] No call data found for ${callSid}, initializing...`);
        initializeCall(callSid, propertyTitle, dealerName);
        callData = getCallData(callSid);
        if (callData) {
          history = callData.history;
        }
      }
    }


    if (speechResult) {
      console.log(`[Webhook] Dealer said: "${speechResult}"`);
      history.push({ role: 'user', content: speechResult });
    }

    // 1. Generate the agent's next response using the conversation history.
    const agentText = await agentChat({
      propertyTitle,
      dealerName,
      history,
    });
    console.log(`[Webhook] Assistant says: "${agentText}"`);
    history.push({ role: 'agent', content: agentText });

    // Store the updated history
    if (callSid) {
      updateCallHistory(callSid, history);
    }

    // Check if the conversation should end (assistant said goodbye/thank you)
    const shouldEndCall = /\b(goodbye|thank you for your time|have a great day|talk to you later|bye)\b/i.test(agentText);
    
    // 2. Convert the agent's text response to speech.
    const { audio } = await textToSpeech({ text: agentText });
    console.log('[Webhook] Converted text to speech.');

    // 3. Store the audio and get a URL to serve it
    const audioId = storeAudio(audio);
    const audioUrl = `${process.env.APP_BASE_URL}/api/call/audio/${audioId}`;
    console.log(`[Webhook] Audio stored with ID: ${audioId}`);

    // 4. Create a TwiML response to play the audio and then listen for the next user response.
    const response = new VoiceResponse();
    response.play(audioUrl);

    // If the assistant is ending the call, hang up after playing the message
    if (shouldEndCall) {
      console.log('[Webhook] Detected conversation end. Hanging up after message.');
      response.hangup();
    } else {
      // After playing the audio, listen for the dealer's next speech input.
      // Twilio will automatically include CallSid in the form data, so we only need to pass property info
      const actionUrl = `/api/call/webhook?propertyTitle=${encodeURIComponent(propertyTitle)}&dealerName=${encodeURIComponent(dealerName)}`;

      response.gather({
        input: ['speech'],
        speechTimeout: 'auto',
        speechModel: 'experimental_conversations',
        action: actionUrl,
        method: 'POST',
        timeout: 5, // Wait 5 seconds for response
      });

      // If the dealer doesn't say anything, politely end the call
      response.say('I did not hear a response. Thank you for your time. Goodbye.');
      response.hangup();
    }

    // 5. Send the TwiML back to Twilio.
    const twimlResponse = response.toString();
    console.log(`[Webhook] TwiML response size: ${twimlResponse.length} bytes`);
    
    return new NextResponse(twimlResponse, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('[Webhook] Error:', error);
    const response = new VoiceResponse();
    response.say('An application error occurred. Goodbye.');
    response.hangup();
    return new NextResponse(response.toString(), {
      status: 500,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}
