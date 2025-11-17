import { NextRequest, NextResponse } from 'next/server';
import { updateCallStatus, getCallData, updateCallSummary } from '@/lib/call-storage';
import { summarizeCallTranscript } from '@/ai/flows/summarize-call-transcript';

// Force this route to use Node.js runtime (not Edge)
export const runtime = 'nodejs';

/**
 * This webhook is called by Twilio when the call status changes.
 * We use it to detect when the call ends and generate a summary.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const callSid = formData.get('CallSid') as string;
    const callStatus = formData.get('CallStatus') as string;

    console.log(`[StatusCallback] Call ${callSid} status: ${callStatus}`);

    if (!callSid) {
      return NextResponse.json({ error: 'Missing CallSid' }, { status: 400 });
    }

    // Update the call status in storage
    updateCallStatus(callSid, callStatus);

    // If the call has completed, generate a summary
    if (callStatus === 'completed' || callStatus === 'failed' || callStatus === 'busy' || callStatus === 'no-answer') {
      const callData = getCallData(callSid);
      
      if (callData && callData.transcript) {
        console.log(`[StatusCallback] Generating summary for call ${callSid}`);
        try {
          const { summary } = await summarizeCallTranscript({ transcript: callData.transcript });
          updateCallSummary(callSid, summary);
          console.log(`[StatusCallback] Summary generated for call ${callSid}`);
        } catch (error) {
          console.error(`[StatusCallback] Error generating summary for call ${callSid}:`, error);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[StatusCallback] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
