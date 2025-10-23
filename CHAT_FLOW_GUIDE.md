# AI Assistant Chat Flow Guide

## Overview

The AI assistant calls real estate dealers on behalf of **Lalit** (the user) to:
- Check property availability
- Gather property details
- Schedule site visits
- Get dealer contact information
- Handle objections professionally

## How It Works

### The AI's Role
The AI acts as **Lalit's professional assistant**, not as Lalit himself. This approach:
- ✅ Is more professional and acceptable to dealers
- ✅ Allows the AI to gather information efficiently
- ✅ Enables Lalit to follow up directly after getting details
- ✅ Handles objections better (dealers expect assistants to call)

### Conversation Structure

The AI follows a natural, structured flow:

```
1. Introduction → 2. Availability → 3. Details → 4. Visit → 5. Contact → 6. Closing
```

## Example Conversation Flow

### Turn 1: Introduction
**AI Assistant:**
> "Hello, this is Lalit's assistant calling. I'm inquiring about your property listing: 2 BHK Apartment in Baner. Is this a good time to discuss it briefly?"

**Dealer:**
> "Yes, sure. What would you like to know?"

---

### Turn 2: Availability Check
**AI Assistant:**
> "Great! Is this property still available for sale?"

**Dealer:**
> "Yes, it's available."

---

### Turn 3: Price & Size
**AI Assistant:**
> "Perfect. Could you share the current asking price and the carpet area?"

**Dealer:**
> "The price is 75 lakhs, and the carpet area is 850 square feet."

---

### Turn 4: Property Details
**AI Assistant:**
> "Thank you. What's the age of the property, and what amenities are included?"

**Dealer:**
> "It's a 5-year-old building with parking, gym, and 24/7 security."

---

### Turn 5: Location
**AI Assistant:**
> "That sounds good. What's the exact location, and how far is it from the nearest metro station?"

**Dealer:**
> "It's in Baner, near Balewadi High Street. The metro is about 2 kilometers away."

---

### Turn 6: Schedule Visit
**AI Assistant:**
> "Excellent. Lalit would like to visit the property. Would this weekend work for a viewing?"

**Dealer:**
> "Yes, Saturday afternoon works. Around 3 PM?"

---

### Turn 7: Contact & Confirmation
**AI Assistant:**
> "Perfect! What's the best number for Lalit to reach you to confirm?"

**Dealer:**
> "You can reach me at 9876543210."

---

### Turn 8: Closing
**AI Assistant:**
> "Thank you for the information. Lalit will call you tomorrow to confirm the Saturday visit. Have a great day!"

**Dealer:**
> "Sure, thank you!"

*[Call ends automatically]*

---

## Key Features

### 1. Natural Conversation
- Short, concise responses (1-3 sentences)
- Asks 1-2 questions at a time
- Adapts based on dealer's responses
- Sounds like a real human assistant

### 2. Information Gathering
The AI systematically collects:
- ✅ Property availability
- ✅ Price and negotiation room
- ✅ Size (carpet area, built-up area)
- ✅ Age and possession date
- ✅ Amenities (parking, gym, security)
- ✅ Floor and total floors
- ✅ Furnishing status
- ✅ Location and connectivity
- ✅ Nearby landmarks
- ✅ Legal status
- ✅ Dealer contact number
- ✅ Visit scheduling

### 3. Handles Common Scenarios

#### Scenario: Dealer is Busy
**Dealer:** "I'm in a meeting right now."

**AI:** "I understand you're busy. Would it be better if I call back later? Or can we quickly cover the basics in 2 minutes?"

---

#### Scenario: Dealer is Suspicious
**Dealer:** "Who is this? How did you get my number?"

**AI:** "I completely understand. Lalit found your listing online and is genuinely interested. He asked me to gather some basic details before he visits."

---

#### Scenario: Property is Sold
**Dealer:** "Sorry, this property is already sold."

**AI:** "I see. Do you have any similar properties available in the same area and price range that might interest Lalit?"

---

#### Scenario: Dealer Wants Direct Contact
**Dealer:** "Can Lalit call me directly?"

**AI:** "Of course! What's the best number for Lalit to reach you? He'll call you directly to discuss further."

---

#### Scenario: Dealer Asks About Client
**Dealer:** "Tell me more about your client."

**AI:** "Lalit is a working professional looking for a property in this area. He's pre-approved for a home loan and is ready to visit properties this week."

---

### 4. Automatic Call Ending

The call ends naturally when:
- ✅ AI says goodbye/thank you
- ✅ Visit is scheduled
- ✅ All key information is gathered
- ✅ Dealer doesn't respond for 5 seconds
- ✅ Dealer hangs up

Detection phrases:
- "Thank you for your time"
- "Have a great day"
- "Goodbye"
- "Talk to you later"

---

## What Gets Captured

### During the Call:
1. **Real-time Transcript** - Every exchange is recorded
2. **Property Details** - Price, size, amenities, location
3. **Dealer Contact** - Phone number, best time to call
4. **Visit Schedule** - Date and time if scheduled
5. **Dealer Attitude** - Helpful, busy, suspicious, etc.

### After the Call:
1. **Call Summary** - AI-generated summary of key points
2. **Recording URL** - Full audio recording
3. **Action Items** - What Lalit needs to do next
4. **Property Status** - Available, sold, or similar options

---

## Conversation Guidelines

### DO:
✅ Keep responses short (1-3 sentences)
✅ Ask 1-2 questions at a time
✅ Be polite and professional
✅ Adapt to dealer's tone
✅ Thank them for their time
✅ Confirm important details
✅ Offer to call back if they're busy
✅ End naturally after gathering info

### DON'T:
❌ Ask all questions at once
❌ Repeat questions already asked
❌ Be pushy or aggressive
❌ Argue with the dealer
❌ Give false information
❌ Pretend to be Lalit
❌ Keep calling if they're not interested
❌ Waste their time

---

## Technical Implementation

### Conversation Flow:
```
1. Twilio initiates call to dealer
   ↓
2. AI introduces itself as Lalit's assistant
   ↓
3. Dealer responds (speech-to-text)
   ↓
4. AI processes response and generates next question
   ↓
5. AI response converted to speech (text-to-speech)
   ↓
6. Repeat steps 3-5 until conversation complete
   ↓
7. AI detects conversation end and hangs up
   ↓
8. Summary generated and saved
```

### Key Components:
- **agent-chat-flow.ts** - AI assistant logic
- **webhook/route.ts** - Handles conversation turns
- **call-storage.ts** - Stores conversation history
- **tts-flow.ts** - Converts text to speech
- **summarize-call-transcript.ts** - Generates summary

---

## Example Summary Output

After the call, the AI generates a summary like:

```
CALL SUMMARY
Property: 2 BHK Apartment in Baner
Dealer: Prime Properties

AVAILABILITY: Available

PROPERTY DETAILS:
- Price: ₹75 Lakhs
- Carpet Area: 850 sq ft
- Age: 5 years old
- Floor: 3rd floor of 7
- Amenities: Parking, Gym, 24/7 Security
- Furnishing: Semi-furnished

LOCATION:
- Address: Baner, near Balewadi High Street
- Metro: 2 km away
- Nearby: Schools, hospitals, shopping

VISIT SCHEDULED:
- Date: Saturday, 3 PM
- Dealer Contact: 9876543210

NEXT STEPS:
1. Lalit to call dealer tomorrow to confirm visit
2. Prepare questions about legal documents
3. Check home loan pre-approval status

DEALER ATTITUDE: Helpful and responsive
```

---

## Benefits

### For Lalit:
✅ Saves time - AI does initial screening
✅ Gets organized information
✅ Can review multiple properties efficiently
✅ Only visits properties that match criteria
✅ Has all details before calling dealer

### For Dealers:
✅ Professional interaction
✅ Quick, efficient conversation
✅ Serious buyer (pre-screened)
✅ Clear next steps
✅ Not wasting time with unqualified leads

---

## Testing the Flow

### Test Scenarios:

1. **Happy Path** - Dealer is helpful, property available
2. **Property Sold** - Dealer says it's sold
3. **Busy Dealer** - Dealer is in a meeting
4. **Suspicious Dealer** - Dealer questions the call
5. **No Response** - Dealer doesn't answer questions
6. **Direct Contact Request** - Dealer wants to talk to Lalit

### What to Check:
- ✅ AI introduces itself properly
- ✅ Questions are asked naturally
- ✅ AI adapts to dealer's responses
- ✅ Call ends gracefully
- ✅ Summary captures key information
- ✅ Transcript is accurate

---

## Customization

You can customize the AI's behavior by editing `src/ai/flows/agent-chat-flow.ts`:

- Change the client name (currently "Lalit")
- Adjust conversation style (more formal/casual)
- Add specific questions for your use case
- Modify ending conditions
- Change timeout settings

---

## Logs You'll See

### In UI (Verbose Log):
```
[START] Live call process initiated for candidate #1
Step 1: Initiating call via Twilio...
Step 2: Call initiated with SID: CA123...
Polling call status: in-progress
Step 3: Call finished with status: completed
Step 4: Final transcript and summary retrieved
[END] Live call process finished
```

### In Server Console:
```
[Webhook] Dealer said: "Yes, the property is available"
[AgentChat] Property: 2 BHK Apartment in Baner
[AgentChat] Dealer: Prime Properties
[AgentChat] Turn: 3
[AgentChat] Response: "Perfect. Could you share the current asking price..."
[Webhook] Assistant says: "Perfect. Could you share the current asking price..."
[Webhook] Converted text to speech
```

---

## Ready to Use!

The improved chat flow is now active. When you click "Call" on any property listing, the AI will:
1. Call the dealer professionally
2. Gather all relevant information
3. Schedule a visit if possible
4. Provide a detailed summary
5. Give Lalit clear next steps

**The AI handles the initial screening so Lalit only needs to follow up on promising properties!**
