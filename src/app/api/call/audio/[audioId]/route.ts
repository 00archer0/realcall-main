import { NextRequest, NextResponse } from 'next/server';
import { getAudioData } from '@/lib/audio-storage';

/**
 * Serves audio files for Twilio to play during calls.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ audioId: string }> }
) {
  try {
    const { audioId } = await params;
    
    console.log(`[AudioServe] Request for audio: ${audioId}`);
    
    if (!audioId) {
      return new NextResponse('Missing audio ID', { status: 400 });
    }

    const audioData = getAudioData(audioId);

    if (!audioData) {
      console.log(`[AudioServe] Audio not found: ${audioId}`);
      return new NextResponse('Audio not found', { status: 404 });
    }

    // Extract base64 data from data URI
    const base64Data = audioData.replace(/^data:audio\/wav;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    console.log(`[AudioServe] Serving audio ${audioId}, size: ${buffer.length} bytes`);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('[AudioServe] Error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
