
export type CallStatus = 'New' | 'Calling' | 'Interested' | 'No Answer' | 'Error' | 'Completed' | 'queued' | 'ringing' | 'in-progress' | 'canceled' | 'failed' | 'busy' | 'no-answer';

export interface ChatMessage {
  role: 'user' | 'agent';
  content: string;
}

export interface Subquery {
  id: number;
  query_text: string;
  location: string | null;
  property_type: string | null;
  price_range: string | null;
  date_range: string | null;
  filters: string | null;
  priority: number;
  note: string | null;
}

export interface Candidate {
  id: number;
  subquery_id: number;
  property_title: string;
  address: string | null;
  dealer_name: string;
  phone_numbers: string[];
  source_url: string;
  last_seen: string | null;
  snippet: string | null;
  confidence: number;
  status: CallStatus;
  last_call_summary: string | null;
  call_transcript: string | null;
  recording_url: string | null;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  data?: any;
}
