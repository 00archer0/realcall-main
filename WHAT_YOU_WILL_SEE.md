# What You Will See - Complete User Experience

## 1. Search Input
Enter your property query in the search box:
```
"2 BHK Baner under 80 lakhs contact dealer"
```

Click **Search** button.

---

## 2. Verbose Log Panel (Real-time Updates)

You'll see detailed logs appear in the right panel:

```
[START] Search process initiated.

Step 1: Generating subqueries from user query using AI...
  Query: "2 BHK Baner under 80 lakhs contact dealer"

Step 2: AI generated 5 optimized search queries.
  Subqueries:
  - "2 BHK Baner dealer contact phone number"
  - "Baner real estate agent phone number 2 BHK"
  - "2 BHK property dealer Baner contact"
  - "Pune Baner 2 BHK broker contact under 80 lakhs"
  - "2 BHK Baner real estate contact information"

Step 3: Searching the internet using Tavily API...
  → Subquery 1: "2 BHK Baner dealer contact phone number"
  → Subquery 2: "Baner real estate agent phone number 2 BHK"
  → Subquery 3: "2 BHK property dealer Baner contact"
  → Subquery 4: "Pune Baner 2 BHK broker contact under 80 lakhs"
  → Subquery 5: "2 BHK Baner real estate contact information"

Step 4: Web search complete. Found 19 property listings.
  → 5 listings with phone numbers
  → 14 listings without phone numbers

Top results:
  1. Upcoming Projects in Pune - Property - Purple Realtors (5 phone numbers)
  2. Baner Properties | Pune - Facebook (3 phone numbers)
  3. 2 BHK Flats in Baner for Sale (2 phone numbers)

[END] Search process finished.
```

---

## 3. Results Table

The main table will show property listings:

| Property Title | Dealer Name | Phone Numbers | Address | Status | Confidence |
|---------------|-------------|---------------|---------|--------|------------|
| Upcoming Projects in Pune - Purple Realtors | Purple Realtors | +91-9876543210, +91-9876543211, ... | Pune | New | 0.95 |
| Baner Properties - Facebook | Property Dealer | +91-8765432109, +91-8765432108, ... | Baner, Pune | New | 0.92 |
| 2 BHK Flats in Baner for Sale | Property Dealer | +91-7654321098, +91-7654321097 | Baner | New | 0.88 |
| Real Estate Agents in Baner | Property Dealer | No phone number found | Baner, Pune | New | 0.45 |

**Note**: Results are sorted by confidence score (highest first). Listings with phone numbers have higher confidence.

---

## 4. Server Console (Terminal)

If you check your terminal where the app is running, you'll see even more detailed logs:

```
[Action] generateSubqueriesAction - Starting subquery generation
[Action] Input query: "2 BHK Baner under 80 lakhs contact dealer"
[Action] Generated 5 subqueries:
[Action]   1. "2 BHK Baner dealer contact phone number" (Priority: 1)
[Action]   2. "Baner real estate agent phone number 2 BHK" (Priority: 2)
[Action]   3. "2 BHK property dealer Baner contact" (Priority: 3)
[Action]   4. "Pune Baner 2 BHK broker contact under 80 lakhs" (Priority: 4)
[Action]   5. "2 BHK Baner real estate contact information" (Priority: 5)

[Action] searchAction - Starting web search with 5 subqueries

[Flow] Using REAL web search via Tavily API. Searching for property listings...

[Flow] Searching subquery #1: "2 BHK Baner dealer contact phone number"
[Tavily] Searching for: "2 BHK Baner dealer contact phone number"
[Tavily] Found 5 results for "2 BHK Baner dealer contact phone number"
[Flow] Warning: No phone numbers found for: Real Estate Agents in Baner, Pune - brokers
[Flow] Added candidate: Real Estate Agents in Baner, Pune - brokers (0 phone numbers found)
[Flow] Added candidate: Baner Properties | Pune - Facebook (3 phone numbers found)
[Flow] Warning: No phone numbers found for: 2 BHK Flats for Rent in Baner, Pune - MagicBricks
[Flow] Added candidate: 2 BHK Flats for Rent in Baner, Pune - MagicBricks (0 phone numbers found)

[Flow] Searching subquery #2: "Baner real estate agent phone number 2 BHK"
[Tavily] Searching for: "Baner real estate agent phone number 2 BHK"
[Tavily] Found 5 results for "Baner real estate agent phone number 2 BHK"
[Flow] Added candidate: Upcoming Projects in Pune - Property - Purple Realtors (5 phone numbers found)
[Flow] Warning: No phone numbers found for: Affordable real estate agents in Baner, Pune - brokers
[Flow] Added candidate: Affordable real estate agents in Baner, Pune - brokers (0 phone numbers found)

... (continues for all subqueries)

[Flow] Search complete. Found 19 total candidates in 8.45s.

[Action] Search complete: Found 19 candidates (5 with phone numbers)
```

---

## 5. Calling a Dealer

Click the **Call** button on any result with phone numbers:

### Verbose Log Updates:
```
[START] Live call process initiated for candidate #1
  Name: Purple Realtors

Step 1: Initiating call via Twilio and connecting to voice bot webhook.

Step 2: Twilio call initiated with SID: CA1234567890abcdef. Polling for status and transcript...

Polling call status for SID CA1234567890abcdef: ringing

Polling call status for SID CA1234567890abcdef: in-progress

Polling call status for SID CA1234567890abcdef: in-progress

Step 3: Call finished with status: completed. Fetching final transcript and summary...

Step 4: Final transcript and summary retrieved.

[END] Live call process finished for candidate #1.
```

### Detail Modal Opens:
Shows:
- Property details
- Dealer information
- **Live transcript** (updates in real-time during call)
- **Call summary** (generated after call ends)
- **Recording URL** (available after call completes)

---

## 6. What Makes This Different

### Before (Mock Data):
- Always returned the same 5 hardcoded properties
- Fake phone numbers
- No real search happening
- No variety in results

### After (Real Search):
- ✅ Searches actual internet using Tavily API
- ✅ Finds real property listings from websites
- ✅ Extracts actual dealer phone numbers
- ✅ Different results for different queries
- ✅ Shows detailed search progress
- ✅ Confidence scoring based on data quality
- ✅ Handles missing phone numbers gracefully

---

## 7. Understanding the Logs

| Log Type | Where to See | What It Shows |
|----------|-------------|---------------|
| **UI Logs** | Verbose Log Panel (right side) | High-level progress for users |
| **Server Logs** | Terminal/Console | Detailed technical information |
| **[Action]** | Server Console | Server action execution |
| **[Flow]** | Server Console | AI flow processing |
| **[Tavily]** | Server Console | Web search API calls |
| **Warning** | Server Console | Issues found (e.g., no phone) |

---

## 8. Tips for Best Results

1. **Include location** in your query: "3 BHK Kothrud Pune"
2. **Add price range**: "under 1.5Cr" or "80 lakhs"
3. **Mention contact**: "contact dealer" or "agent phone"
4. **Be specific**: "2 BHK apartment" vs just "flat"

### Good Query Examples:
- ✅ "3 BHK Kothrud Pune under 1.5Cr contact dealer"
- ✅ "2 BHK Baner apartment agent phone number"
- ✅ "Villa Hinjewadi broker contact 2Cr budget"

### Less Effective:
- ❌ "flat" (too vague)
- ❌ "property in Pune" (too broad)
- ❌ "house" (no location or price)

---

## 9. Performance

Typical search takes **5-10 seconds**:
- 1-2s: Generate subqueries
- 4-8s: Search internet (5 subqueries × ~1s each)
- <1s: Process and display results

You'll see the duration in server logs:
```
[Flow] Search complete. Found 19 total candidates in 8.45s.
```

---

## Ready to Test!

Start the app and try searching for real properties. You'll see all these logs and results in action!
