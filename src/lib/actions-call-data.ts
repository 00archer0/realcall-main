'use server';

/**
 * Server action to fetch call data from the API.
 */
export async function getCallDataAction(callSid: string): Promise<{
  transcript: string;
  summary: string | null;
  recordingUrl: string | null;
  status: string;
}> {
  const { APP_BASE_URL } = process.env;
  
  if (!APP_BASE_URL) {
    throw new Error('APP_BASE_URL is not configured');
  }

  try {
    const response = await fetch(`${APP_BASE_URL}/api/call/data?callSid=${callSid}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch call data: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      transcript: data.transcript || '',
      summary: data.summary || null,
      recordingUrl: data.recordingUrl || null,
      status: data.status || 'unknown',
    };
  } catch (error) {
    console.error('Error fetching call data:', error);
    throw error;
  }
}
