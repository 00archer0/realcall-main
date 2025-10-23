# Component Testing Checklist

## 1. Test Call Storage
```bash
# Check if storage is working by making a call and checking logs
# Look for these log messages:
- [CallStorage] Initializing call {callSid}
- [CallStorage] Call store now has X calls
- [CallStorage] Updated history for {callSid}
```

## 2. Test Audio Storage
```bash
# After making a call, check logs for:
- [AudioStorage] Stored audio audio_{timestamp}_{counter}
- [Webhook] Audio stored with ID: audio_...
```

## 3. Test Audio Serving
```bash
# The audio endpoint should be accessible at:
# https://your-domain.com/api/call/audio/{audioId}
# Twilio will fetch this URL to play audio
```

## 4. Test TwiML Response Size
```bash
# Check webhook logs for:
- [Webhook] TwiML response size: X bytes
# Should be < 64000 bytes (64KB)
```

## 5. Test Call Data Retrieval
```bash
# Frontend polls this endpoint:
# GET /api/call/data?callSid={callSid}
# Check logs for:
- [CallData] Request for callSid: {callSid}
- [CallData] Found call data for {callSid}
```

## 6. Test Status Callback
```bash
# Twilio sends status updates to:
# POST /api/call/status-callback
# Check logs for:
- [StatusCallback] Call {callSid} status: {status}
- [StatusCallback] Generating summary for call {callSid}
```

## 7. Test Recording Callback
```bash
# Twilio sends recording URL to:
# POST /api/call/recording-callback
# Check logs for:
- [RecordingCallback] Recording available for call {callSid}
```

## Expected Flow:
1. Call initiated → Storage initialized
2. Webhook called → Audio generated and stored
3. TwiML returned with audio URL (< 64KB)
4. Twilio fetches audio from /api/call/audio/{audioId}
5. User speaks → Webhook called again with speech
6. Repeat steps 2-5 for conversation
7. Call ends → Status callback generates summary
8. Recording available → Recording callback stores URL
9. Frontend polls → Gets transcript, summary, recording

## Common Issues:
- **64KB Error**: Audio was embedded in TwiML (FIXED - now using URL)
- **404 on call data**: Storage not initialized (FIXED - webhook initializes if needed)
- **Storage not shared**: Module instances separated (FIXED - using globalThis)
