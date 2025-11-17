# Real Estate AI Agent

An AI-powered real estate assistant that automatically calls property dealers, gathers information, and schedules visits on behalf of clients using Groq's fast LLM and TTS APIs.

## Features

- 🤖 **AI-Powered Conversations**: Uses Groq's Llama 3.3 70B model for natural, context-aware conversations
- 🔍 **Smart Property Search**: Generates optimized search queries and finds property listings with dealer contacts
- 📞 **Automated Calling**: Integrates with Twilio to make real phone calls to dealers
- 🎙️ **Text-to-Speech**: Uses Groq's PlayAI TTS for natural-sounding voice synthesis
- 📊 **Call Management**: Tracks call history, transcripts, and outcomes
- 🌐 **Web Search**: Uses Tavily API to find real estate listings online

## Tech Stack

- **Framework**: Next.js 15 with React 18
- **AI/LLM**: Groq API (Llama 3.3 70B Versatile)
- **TTS**: Groq PlayAI TTS
- **Telephony**: Twilio
- **Search**: Tavily API
- **UI**: Radix UI + Tailwind CSS
- **Language**: TypeScript

## Prerequisites

- Node.js 20+
- npm or yarn
- Groq API key ([Get one here](https://console.groq.com))
- Tavily API key ([Get one here](https://tavily.com))
- Twilio account with phone number ([Sign up here](https://www.twilio.com))
- Public URL for webhooks (ngrok for local development)

## Setup

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:

Copy `.env.example` to `.env` and fill in your API keys:

```bash
# Groq API (for LLM and TTS)
GROQ_API_KEY=your_groq_api_key_here

# Tavily API (for web search)
TAVILY_API_KEY=your_tavily_api_key_here

# Twilio (for phone calls)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# For testing, redirect all calls to this number
TWILIO_TO_NUMBER=+1234567890

# Your public URL (use ngrok for local dev)
APP_BASE_URL=https://your-domain.com
```

3. **Set up ngrok for local development**:

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok on port 9002
ngrok http 9002
```

Copy the ngrok URL (e.g., `https://abc123.ngrok-free.app`) and set it as `APP_BASE_URL` in your `.env` file.

4. **Start the development server**:

```bash
npm run dev
```

The app will be available at `http://localhost:9002`

## How It Works

### 1. Query Generation
User enters a natural language query like "3 BHK in Kothrud under 1.5Cr". The AI generates multiple optimized search queries targeting dealer contact information.

### 2. Web Search
The system searches the web using Tavily API to find property listings with dealer contact information.

### 3. Candidate Extraction
Extracts property details, dealer names, and phone numbers from search results.

### 4. Automated Calling
For each candidate:
- Initiates a Twilio call to the dealer
- AI agent introduces itself and asks about the property
- Gathers key information (price, availability, amenities, location)
- Schedules site visits if appropriate
- Maintains natural conversation flow

### 5. Call Management
- Real-time call status tracking
- Transcript recording
- Call summaries and outcomes
- Recording storage

## Project Structure

```
src/
├── ai/
│   ├── groq.ts                 # Groq client configuration
│   ├── flows/
│   │   ├── agent-chat-flow.ts           # AI agent conversation logic
│   │   ├── user-chat-flow.ts            # User simulation for testing
│   │   ├── generate-real-estate-subqueries.ts  # Query generation
│   │   ├── search-for-candidates.ts     # Web search and extraction
│   │   ├── generate-call-transcript.ts  # Transcript generation
│   │   ├── summarize-call-transcript.ts # Call summarization
│   │   └── tts-flow.ts                  # Text-to-speech
│   └── tools/
│       └── tavily-search.ts    # Web search utilities
├── app/
│   ├── api/call/               # Twilio webhook handlers
│   └── page.tsx                # Main UI
└── lib/
    ├── actions.ts              # Server actions
    ├── types.ts                # TypeScript types
    ├── call-storage.ts         # In-memory call data
    └── audio-storage.ts        # Audio file management
```

## API Endpoints

### Twilio Webhooks
- `POST /api/call/webhook` - Handles conversation turns
- `POST /api/call/status-callback` - Call status updates
- `POST /api/call/recording-callback` - Recording availability
- `GET /api/call/audio/:id` - Serves generated audio

## Groq Models Used

- **LLM**: `llama-3.3-70b-versatile` - Fast, high-quality text generation
- **TTS**: `playai-tts` with `Fritz-PlayAI` voice - Natural-sounding speech

## Development

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Build
```bash
npm run build
```

## Deployment

1. Deploy to your preferred platform (Vercel, Railway, etc.)
2. Set environment variables in your deployment platform
3. Update `APP_BASE_URL` to your production URL
4. Configure Twilio webhooks to point to your production URL

## Troubleshooting

### Calls not connecting
- Verify Twilio credentials are correct
- Check that `APP_BASE_URL` is publicly accessible
- Ensure phone numbers are in E.164 format (+1234567890)

### TTS not working
- By default, the app uses Twilio's built-in TTS (no setup required)
- To use Groq TTS: Accept terms at https://console.groq.com/playground?model=playai-tts
- Then set `USE_GROQ_TTS=true` in your `.env` file
- Verify `GROQ_API_KEY` is set correctly

### Search not finding results
- Verify `TAVILY_API_KEY` is valid
- Try more specific search queries
- Check Tavily API quota

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
