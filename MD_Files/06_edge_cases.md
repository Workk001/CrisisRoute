# 06 — Edge Cases

## Every edge case and how the system handles it

---

### 1. Vague crisis input
**Input:** "my flight got cancelled"
**Problem:** Missing origin, destination, time, budget
**Gemini behaviour:** System prompt instructs Gemini to ask ONE clarifying question
**Example Gemini response:**
```json
{
  "crisis_summary": "Flight cancelled — need more details to build your rescue plan.",
  "immediate_action": "Answer this so I can help: Where are you flying FROM and TO, when do you need to arrive, and what's your budget?",
  "options": [],
  ...
}
```
**UI behaviour:** Render only `immediate_action` as a question card. Input box stays visible for user to refine.

---

### 2. No options within budget
**Input:** "Flight cancelled, need to reach Delhi from Mumbai in 2 hours, budget ₹100"
**Problem:** No transport mode can do this for ₹100
**Gemini behaviour:** Shows cheapest available option, flags budget shortfall
**UI behaviour:**
- All option cards render with red `fits_budget: false` badge
- `budget_status.shortfall` rendered as red alert: "₹1,199 short for cheapest option"
- No suppression — show options anyway so user can make the call

---

### 3. Same-city or near-city crisis
**Input:** "My hotel in Mumbai got cancelled, I'm in Mumbai"
**Problem:** This is accommodation, not transport
**Gemini behaviour:** Pivot to hotel alternatives — nearest budget hotels, OYO/Treebo/Zostel, price range
**UI behaviour:** Same schema, mode field = "hotel" (added to enum for this case only)
**Note in system prompt:** "If the crisis is accommodation-related, adapt the options schema to list hotel alternatives instead of transport."

---

### 4. Multi-leg journey disruption
**Input:** "My connecting flight from Delhi to Dubai got cancelled but I need to reach London by tomorrow morning"
**Problem:** International, multi-hop, complex
**Gemini behaviour:** Searches for alternate routing (Delhi→London direct, Delhi→Frankfurt→London, etc.)
**UI behaviour:** Notes field on each option card is critical — explains the full routing

---

### 5. Gemini API timeout / network failure
**Trigger:** fetch() throws or takes >30 seconds
**Handling:**
```js
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000);
try {
  const result = await chatSession.sendMessage(text, { signal: controller.signal });
} catch (err) {
  if (err.name === 'AbortError') {
    setError('timeout');
  } else {
    setError('network');
  }
} finally {
  clearTimeout(timeout);
}
```
**UI:** Show retry button with message: "Took too long to respond. Try again — Google AI Studio may be busy."

---

### 6. Gemini returns text instead of JSON
**Problem:** Despite system prompt, Gemini occasionally adds prose before/after JSON
**Handling:**
```js
// Extract JSON from response even if wrapped in text
const jsonMatch = raw.match(/\{[\s\S]*\}/);
if (jsonMatch) {
  return JSON.parse(jsonMatch[0]);
}
```
**Fallback:** If no JSON found at all, render raw text in fallback card

---

### 7. User submits follow-up before plan loads
**Prevention:** Disable ChatFollowUp component entirely when phase !== 'result'
**Implementation:** `{phase === 'result' && <ChatFollowUp />}`

---

### 8. User enters non-travel crisis
**Input:** "My laptop got stolen"
**Gemini behaviour:** System prompt scopes it — respond with:
```json
{
  "crisis_summary": "This doesn't appear to be a travel disruption.",
  "immediate_action": "RescuePlan helps with travel emergencies — flight cancellations, missed trains, and similar crises. Describe your travel situation and I'll build your rescue plan.",
  "options": []
}
```

---

### 9. Overnight or next-day travel
**Input:** "Flight cancelled, nothing available tonight"
**Gemini behaviour:** Shift to next morning options, include hotel suggestion for overnight stay
**UI behaviour:** Options may include next-day times — render date alongside time if not today

---

### 10. API Key missing / invalid
**Detection:** Check `import.meta.env.VITE_GEMINI_API_KEY` on app load
**UI:** Show banner: "API key not configured. Add VITE_GEMINI_API_KEY to your .env file."
**Never:** Expose the key value in any error message or console log in production
