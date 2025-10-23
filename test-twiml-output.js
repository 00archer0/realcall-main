// Quick test to verify TwiML output format
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;

// Simulate what our webhook generates
const response = new VoiceResponse();

// This is what we're doing in the webhook
const audioUrl = 'https://336222930bd6.ngrok-free.app/api/call/audio/audio_1234567890_0';
response.play(audioUrl);

response.gather({
  input: ['speech'],
  speechTimeout: 'auto',
  speechModel: 'experimental_conversations',
  action: '/api/call/webhook?propertyTitle=Test&dealerName=TestDealer',
  method: 'POST',
});

response.say('We did not receive a response. Goodbye.');
response.hangup();

const twiml = response.toString();
console.log('TwiML Output:');
console.log(twiml);
console.log('\nTwiML Size:', twiml.length, 'bytes');
console.log('Within 64KB limit:', twiml.length < 64000 ? 'YES ✓' : 'NO ✗');
