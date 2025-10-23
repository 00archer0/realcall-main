# Quick Reference Card

## 🚀 Start the App
```bash
npm run dev
```
Open: http://localhost:9002

---

## 🔍 Search for Properties

### Good Query Examples:
```
2 BHK Baner under 80 lakhs contact dealer
3 BHK Kothrud Pune under 1.5Cr agent phone
Villa Hinjewadi broker contact 2Cr budget
```

### What Happens:
1. AI generates 5-8 search queries
2. Tavily searches the internet
3. Results show with phone numbers
4. Sorted by confidence score

---

## 📞 Call a Dealer

### Click "Call" Button
AI will automatically:
1. ✅ Introduce as Lalit's assistant
2. ✅ Check property availability
3. ✅ Ask about price and size
4. ✅ Get amenities and location
5. ✅ Schedule a visit
6. ✅ Get dealer contact
7. ✅ End call professionally

### Conversation Structure:
```
Introduction → Availability → Details → Location → Visit → Contact → Goodbye
```

---

## 📊 What You Get

### During Call:
- Real-time transcript
- Live conversation updates
- Call status (ringing, in-progress, completed)

### After Call:
- Complete transcript
- AI-generated summary
- Recording URL
- Next steps for Lalit

---

## 📝 Information Gathered

### Property:
- Price
- Size (carpet area)
- Age
- Amenities
- Floor
- Furnishing

### Location:
- Exact address
- Nearby landmarks
- Metro distance
- Connectivity

### Scheduling:
- Visit date/time
- Dealer contact
- Next steps

---

## 🎯 AI Assistant Behavior

### Professional:
✅ Introduces as Lalit's assistant
✅ Polite and respectful
✅ Short responses (1-3 sentences)
✅ Asks 1-2 questions at a time

### Smart:
✅ Adapts to dealer's tone
✅ Handles objections
✅ Offers to call back if busy
✅ Ends call naturally

### Comprehensive:
✅ Gathers all key details
✅ Schedules visits
✅ Gets contact info
✅ Provides clear next steps

---

## 🔧 Configuration

### Environment Variables:
```
GEMINI_API_KEY=... ✅
TAVILY_API_KEY=... ✅
TWILIO_ACCOUNT_SID=... ✅
TWILIO_AUTH_TOKEN=... ✅
TWILIO_PHONE_NUMBER=... ✅
TWILIO_TO_NUMBER=... ✅
APP_BASE_URL=... ✅
```

All configured and ready!

---

## 📖 Documentation

| File | Purpose |
|------|---------|
| `QUICK_START.md` | How to use the app |
| `CHAT_FLOW_GUIDE.md` | Complete conversation guide |
| `SEARCH_IMPLEMENTATION.md` | Technical details |
| `VERBOSE_LOGS_GUIDE.md` | Understanding logs |
| `FINAL_IMPLEMENTATION_SUMMARY.md` | Complete overview |

---

## 🐛 Troubleshooting

### No Search Results?
- Check internet connection
- Verify TAVILY_API_KEY
- Try more specific query

### Call Not Working?
- Verify Twilio credentials
- Check TWILIO_TO_NUMBER
- Ensure APP_BASE_URL is accessible

### No Phone Numbers?
- Some listings don't have phones
- Try different search terms
- Results without phones have lower confidence

---

## 💡 Tips

### Better Search Results:
1. Include location: "Baner Pune"
2. Add price range: "under 80 lakhs"
3. Mention contact: "dealer phone"
4. Be specific: "2 BHK apartment"

### Better Calls:
1. Call results with phone numbers
2. Check confidence score (higher is better)
3. Review property details before calling
4. Let AI complete the conversation

---

## 📊 Example Flow

```
1. Enter Query
   "2 BHK Baner under 80 lakhs contact dealer"
   
2. View Results
   19 properties found (5 with phones)
   
3. Click "Call"
   AI calls dealer as Lalit's assistant
   
4. Watch Transcript
   Real-time conversation updates
   
5. Review Summary
   All details + next steps
   
6. Follow Up
   Lalit calls dealer to confirm visit
```

---

## ✅ What's Working

- ✅ Real internet search
- ✅ Phone number extraction
- ✅ Professional AI assistant
- ✅ Structured conversations
- ✅ Automatic call ending
- ✅ Call summaries
- ✅ Edge case handling
- ✅ Detailed logging

---

## 🎉 Ready to Use!

Everything is configured and working. Start searching for properties and let the AI assistant handle the dealer calls!

**The AI will save Lalit hours of time by doing initial property screening!**
