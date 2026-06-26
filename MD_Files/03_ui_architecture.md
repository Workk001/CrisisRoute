# 03 — UI Architecture

## Philosophy
One screen. No nav. No login. No modals. The entire product lives on a single page. Judges should understand what the app does in 3 seconds of looking at it.

---

## Visual Layout (top to bottom)

```
┌─────────────────────────────────────────┐
│  🚨 RescuePlan                  [logo]  │  ← Header (minimal, fixed)
│  AI Travel Crisis Assistant             │
├─────────────────────────────────────────┤
│                                         │
│  Describe your travel emergency         │  ← Hero section
│  ┌───────────────────────────────────┐  │
│  │ e.g. "My IndiGo flight from      │  │  ← CrisisInput (textarea)
│  │  Mumbai to Ahmedabad got          │  │
│  │  cancelled. Need to reach by      │  │
│  │  10PM. Budget ₹1500."             │  │
│  └───────────────────────────────────┘  │
│  [🚨 Get My Rescue Plan]                │  ← CTA button
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  [LoadingState — pulse animation]       │  ← Shown while Gemini responds
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ⚡ Do This RIGHT NOW:                  │  ← immediate_action card
│  "Open IndiGo app and check 8PM flight" │
│                                         │
│  📋 Your Rescue Options                 │  ← RescuePlan options cards
│  ┌──────────────────────────────────┐   │
│  │ #1 ✈️ IndiGo 6E-xxx | 7:45 PM   │   │
│  │ Mumbai → Ahmedabad | ₹1,299      │   │
│  │ ⚠️ Verify on IndiGo app          │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │ #2 🚌 GSRTC Volvo | 6:30 PM     │   │
│  │ Borivali → Ahmedabad | ₹320     │   │
│  │ ✅ Fits budget                   │   │
│  └──────────────────────────────────┘   │
│                                         │
│  📝 Step by Step                        │  ← what_to_do_now list
│  💰 Budget Status                       │  ← budget_status card
│  💸 Refund Tip                          │  ← refund_tip
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  💬 Ask a follow-up...                  │  ← ChatFollowUp input
│  "What if I take the bus instead?"      │
│  [Send]                                 │
│                                         │
└─────────────────────────────────────────┘
```

---

## Component Breakdown

### `App.jsx` — Root
State held here:
```js
const [phase, setPhase] = useState('input') // 'input' | 'loading' | 'result'
const [rescuePlan, setRescuePlan] = useState(null)
const [chatHistory, setChatHistory] = useState([])
```

### `CrisisInput.jsx`
- Large textarea (min 4 rows)
- Placeholder with example scenario
- Character count (optional)
- "Get My Rescue Plan" button — red/orange, large, full width on mobile
- On submit: validate not empty → call `startCrisisSession()` → set phase to 'loading'

### `LoadingState.jsx`
- Shown when phase === 'loading'
- Pulsing animation with rotating messages:
  - "Searching for next available flights..."
  - "Checking train schedules..."
  - "Calculating your cheapest route..."
  - "Building your rescue plan..."
- Message cycles every 2 seconds

### `RescuePlan.jsx`
Receives the parsed JSON from Gemini. Renders:
- `ImmediateAction` — red alert box, `immediate_action` field
- `OptionCard` (mapped) — one card per option in `options[]`
  - Mode icon (✈️ 🚂 🚌 🚗)
  - Operator + identifier
  - Departure → Arrival times
  - Cost + budget fit badge (green ✅ / red ❌)
  - Confidence badge (confirmed / verify)
  - Booking platform with link hint
- `StepByStep` — numbered list from `what_to_do_now[]`
- `BudgetStatus` — shows user budget vs cheapest option, shortfall if any
- `RefundTip` — collapsible section

### `ChatFollowUp.jsx`
- Only renders when phase === 'result'
- Single input + send button
- On send: call `sendFollowUp(message)` → append to chat history → re-render updated plan fields

---

## Color System (Tailwind classes)
```
Background:     bg-gray-950
Card:           bg-gray-900 border border-gray-800
Primary CTA:    bg-red-600 hover:bg-red-700
Immediate:      bg-orange-950 border-l-4 border-orange-500
Success badge:  bg-green-900 text-green-400
Warning badge:  bg-yellow-900 text-yellow-400
Text primary:   text-white
Text secondary: text-gray-400
```

Dark theme — it's a crisis tool, not a vacation planner. Dark = urgency.

---

## Mobile-First Rules
- All cards full width on mobile
- Textarea min-height 120px
- Font size minimum 16px on inputs (prevents iOS zoom)
- CTA button minimum height 52px (thumb-friendly)
- Options stack vertically always (no grid on mobile)
