import { NextRequest, NextResponse } from 'next/server';
import { updateCallRecording } from '@/lib/call-storage';

/**
 * This webhook is called by Twilio when a call recording is available.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const callSid = formData.get('CallSid') as string;
    const recordingUrl = formData.get('RecordingUrl') as string;

    console.log(`[RecordingCallback] Recording available for call ${callSid}: ${recordingUrl}`);

    if (!callSid || !recordingUrl) {
      return NextResponse.json({ error: 'Missing CallSid or RecordingUrl' }, { status: 400 });
    }

    // Store the recording URL
    updateCallRecording(callSid, recordingUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[RecordingCallback] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
