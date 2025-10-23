import { NextRequest, NextResponse } from 'next/server';
import { getCallData } from '@/lib/call-storage';

/**
 * API endpoint to retrieve call data (transcript, summary, recording) by callSid.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const callSid = searchParams.get('callSid');

    console.log(`[CallData] Request for callSid: ${callSid}`);

    if (!callSid) {
      return NextResponse.json({ error: 'Missing callSid parameter' }, { status: 400 });
    }

    const callData = getCallData(callSid);

    if (!callData) {
      console.log(`[CallData] Call not found for ${callSid}`);
      // Return empty data instead of 404 to avoid errors during polling
      return NextResponse.json({
        callSid,
        transcript: '',
        summary: null,
        recordingUrl: null,
        status: 'unknown',
      });
    }

    console.log(`[CallData] Found call data for ${callSid}, transcript length: ${callData.transcript.length}`);

    return NextResponse.json({
      callSid: callData.callSid,
      transcript: callData.transcript,
      summary: callData.summary,
      recordingUrl: callData.recordingUrl,
      status: callData.status,
    });
  } catch (error) {
    console.error('[CallData] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
