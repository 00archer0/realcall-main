/**
 * In-memory storage for call data.
 * In production, this should be replaced with a database.
 */

import type { ChatMessage } from './types';

interface CallData {
  callSid: string;
  history: ChatMessage[];
  transcript: string;
  summary: string | null;
  recordingUrl: string | null;
  status: string;
  propertyTitle: string;
  dealerName: string;
}

// Use globalThis to ensure the Map persists across hot reloads in development
const globalForCallStore = globalThis as unknown as {
  callStore: Map<string, CallData> | undefined;
};

const callStore = globalForCallStore.callStore ?? new Map<string, CallData>();

if (process.env.NODE_ENV !== 'production') {
  globalForCallStore.callStore = callStore;
}

export function initializeCall(callSid: string, propertyTitle: string, dealerName: string) {
  console.log(`[CallStorage] Initializing call ${callSid}`);
  callStore.set(callSid, {
    callSid,
    history: [],
    transcript: '',
    summary: null,
    recordingUrl: null,
    status: 'initiated',
    propertyTitle,
    dealerName,
  });
  console.log(`[CallStorage] Call store now has ${callStore.size} calls`);
}

export function updateCallHistory(callSid: string, history: ChatMessage[]) {
  const call = callStore.get(callSid);
  if (call) {
    call.history = history;
    call.transcript = history.map(msg => `${msg.role === 'user' ? 'User' : 'Agent'}: ${msg.content}`).join('\n');
    callStore.set(callSid, call);
    console.log(`[CallStorage] Updated history for ${callSid}, transcript length: ${call.transcript.length}`);
  } else {
    console.log(`[CallStorage] Cannot update history - call ${callSid} not found in store`);
  }
}

export function updateCallStatus(callSid: string, status: string) {
  const call = callStore.get(callSid);
  if (call) {
    call.status = status;
    callStore.set(callSid, call);
  }
}

export function updateCallSummary(callSid: string, summary: string) {
  const call = callStore.get(callSid);
  if (call) {
    call.summary = summary;
    callStore.set(callSid, call);
  }
}

export function updateCallRecording(callSid: string, recordingUrl: string) {
  const call = callStore.get(callSid);
  if (call) {
    call.recordingUrl = recordingUrl;
    callStore.set(callSid, call);
  }
}

export function getCallData(callSid: string): CallData | undefined {
  const data = callStore.get(callSid);
  console.log(`[CallStorage] getCallData for ${callSid}: ${data ? 'found' : 'not found'} (store size: ${callStore.size})`);
  return data;
}

export function getAllCalls(): CallData[] {
  return Array.from(callStore.values());
}
