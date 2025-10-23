# Verbose Logs Guide

## What You'll See in the Verbose Log Panel

When you search for properties, the Verbose Log panel will now show detailed information about the entire search process.

### Example Log Output

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

## Server Console Logs (More Detailed)

If you check your terminal/server console, you'll see even more detailed logs:

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

## Log Categories

### UI Logs (Verbose Log Panel)
- **[START]/[END]**: Process boundaries
- **Step X**: Major process steps
- **→**: Sub-items or details
- **[ERROR]**: Error messages

### Server Console Logs
- **[Action]**: Server action logs
- **[Flow]**: AI flow execution logs
- **[Tavily]**: Tavily API search logs
- **[Flow] Warning**: Issues found (e.g., no phone numbers)
- **[Flow] Added candidate**: Successfully extracted candidate

## What Each Log Means

| Log Message | Meaning |
|------------|---------|
| `Searching subquery #X` | Starting search for a specific query |
| `[Tavily] Found X results` | Tavily API returned X search results |
| `Warning: No phone numbers found` | Result has no extractable phone numbers |
| `Added candidate: ... (X phone numbers found)` | Successfully extracted candidate with X phone numbers |
| `Skipping duplicate URL` | URL already processed, avoiding duplicates |
| `Search complete. Found X total candidates in Ys` | Final summary with timing |

## Benefits

✅ **Transparency**: See exactly what the system is doing
✅ **Debugging**: Identify issues with searches or phone extraction
✅ **Progress**: Track search progress in real-time
✅ **Results**: Understand why certain results were included/excluded
✅ **Performance**: See how long searches take

## Tips

1. **Check server console** for the most detailed logs
2. **UI logs** show high-level progress for users
3. **Warnings** indicate results without phone numbers (lower priority)
4. **Confidence scores** help prioritize which dealers to call first
