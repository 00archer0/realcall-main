/**
 * In-memory storage for audio files.
 * Audio files are stored temporarily to serve to Twilio.
 */

// Use globalThis to ensure the Map persists across hot reloads in development
const globalForAudioStore = globalThis as unknown as {
  audioStore: Map<string, string> | undefined;
};

const audioStore = globalForAudioStore.audioStore ?? new Map<string, string>();

if (process.env.NODE_ENV !== 'production') {
  globalForAudioStore.audioStore = audioStore;
}

let audioIdCounter = 0;

export function storeAudio(audioDataUri: string): string {
  const audioId = `audio_${Date.now()}_${audioIdCounter++}`;
  audioStore.set(audioId, audioDataUri);
  console.log(`[AudioStorage] Stored audio ${audioId}, store size: ${audioStore.size}`);
  
  // Clean up old audio files after 5 minutes
  setTimeout(() => {
    audioStore.delete(audioId);
    console.log(`[AudioStorage] Cleaned up audio ${audioId}`);
  }, 5 * 60 * 1000);
  
  return audioId;
}

export function getAudioData(audioId: string): string | undefined {
  return audioStore.get(audioId);
}
