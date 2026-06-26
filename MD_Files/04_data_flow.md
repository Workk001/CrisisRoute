# 04 — Data Flow

## Full Flow Diagram

```
User types crisis
        ↓
[CrisisInput] onSubmit
        ↓
Validate: not empty, min 10 chars
        ↓
setPhase('loading')
        ↓
gemini.js → startCrisisSession(crisisText)
        ↓
  ┌─────────────────────────────────────┐
  │  Gemini 2.5 Flash                   │
  │  + Google Search Grounding          │
  │  → Searches live flight/train data  │
  │  → Applies system prompt rules      │
  │  → Returns JSON string              │
  └─────────────────────────────────────┘
        ↓
parseGeminiResponse(raw)
        ↓
  ┌── success? ──────────────────────┐
  │ YES                   NO         │
  │ setRescuePlan(data)   setPhase(  │
  │ setPhase('result')    'error')   │
  └──────────────────────────────────┘
        ↓
[RescuePlan] renders structured cards
        ↓
User asks follow-up
        ↓
[ChatFollowUp] onSend
        ↓
gemini.js → sendFollowUp(message)
  (same chat session — context preserved)
        ↓
parseGeminiResponse(raw)
        ↓
Merge updated fields into rescuePlan state
        ↓
UI updates only changed sections
```

---

## State Shape in App.jsx

```js
{
  phase: 'input' | 'loading' | 'result' | 'error',

  rescuePlan: {
    crisis_summary: string,
    immediate_action: string,
    options: [
      {
        rank: number,
        mode: 'flight' | 'train' | 'bus' | 'cab',
        operator: string,
        identifier: string,
        departure: string,
        arrival: string,
        estimated_cost: string,
        booking_platform: string,
        fits_budget: boolean,
        confidence: 'confirmed' | 'verify',
        notes: string
      }
    ],
    budget_status: {
      user_budget: string,
      cheapest_option_cost: string,
      shortfall: string | null
    },
    what_to_do_now: string[],
    refund_tip: string,
    disclaimer: string
  },

  chatHistory: [
    { role: 'user', text: string },
    { role: 'assistant', data: rescuePlan }
  ],

  error: string | null
}
```

---

## API Call Timing

- Average Gemini response with grounding: 4–8 seconds
- Loading animation must run minimum 3 seconds (even if response comes faster) — prevents jarring instant switch
- Implement: `await Promise.all([geminiCall, minDelay(3000)])`

---

## Error Handling Priority

| Error | User-Facing Message |
|-------|-------------------|
| Empty input | "Tell me what happened — describe your travel emergency" |
| Gemini API fail | "Couldn't reach the rescue system. Check your connection and try again." |
| JSON parse fail | Render raw text in fallback card with warning |
| No options found | Show crisis_summary + immediate_action only, prompt user to refine |
| Budget impossible | Show cheapest option with shortfall highlighted in red |

---

## What NOT to do in data flow
- Never store the API key in state or render it in any component
- Never make the Gemini call on every keystroke — only on submit
- Never reset chatSession on follow-up — context must persist
- Never parse the JSON without the try/catch wrapper
