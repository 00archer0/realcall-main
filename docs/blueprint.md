# **App Name**: CallCast AI

## Core Features:

- Subquery Generation: Expands a free-text real-estate query into multiple structured web-search subqueries using an LLM. The LLM acts as a tool and determines relevant pieces of information.
- Web Search Integration: Connects to search provider APIs (SerpAPI, Bing Web Search API) to fetch listing pages and snippets based on subqueries.
- Call Orchestration: Automates phone calls to dealers via Twilio Programmable Voice, including TTS playback and recording.
- Call Status Updates: Provides real-time updates on call lifecycle events (answered, speech partials, recording URL, ended) in the UI via websockets.
- Result Display Table: Displays normalized candidate property listings and dealer phone numbers in a live table with verbose logging.
- Automated Calling: Enables users to place automated calls (TTS/STT) to dealers from the UI with dynamic scripting and context.
- Metadata Logging: Saves and displays call metadata (status, transcript, recording link) within the results table and a detailed view.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) for trustworthiness and professionalism, mirroring real-estate confidence.
- Background color: Light blue-gray (#E8EAF6) - desaturated, light version of primary blue.
- Accent color: Purple (#7E57C2), which is an analogous color to the primary (deep) blue, yet different in both brightness and saturation to create contrast.
- Headline font: 'Space Grotesk' sans-serif for a techy and scientific feel.
- Body font: 'Inter' sans-serif for a modern, neutral, and objective look.
- Use clean and professional icons to represent property types and call actions.
- Maintain a clear and structured layout for search results and call logs, ensuring readability and ease of use.
- Use subtle animations to indicate call status updates and data loading.