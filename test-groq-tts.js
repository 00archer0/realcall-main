// Quick test script to verify Groq TTS is working
require('dotenv').config();

async function testGroqTTS() {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GROQ_API_KEY is not set');
    process.exit(1);
  }

  console.log('✓ GROQ_API_KEY is set');
  console.log('Testing Groq TTS API...\n');

  try {
    const response = await fetch('https://api.groq.com/openai/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'playai-tts',
        voice: 'Fritz-PlayAI',
        input: 'Hello, this is a test of the Groq text to speech API.',
        response_format: 'wav',
      }),
    });

    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      process.exit(1);
    }

    const audioBuffer = await response.arrayBuffer();
    console.log('✓ TTS successful!');
    console.log('Audio size:', audioBuffer.byteLength, 'bytes');
    
    if (audioBuffer.byteLength > 0) {
      console.log('\n✅ Groq TTS is working correctly!');
    } else {
      console.log('\n⚠️  Warning: Audio buffer is empty');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testGroqTTS();
