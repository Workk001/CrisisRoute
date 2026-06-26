# 07 — Demo Script

## This file is your winning weapon.
Judges see 10 presentations. They remember the one that made them feel something. Your demo must be rehearsed, tight, and impossible to forget.

---

## Presentation Structure (12 minutes total)

### 0:00 – 0:45 | The Hook (DO NOT skip this)
Open with the scenario. Don't open with slides. Don't introduce yourself first.

Say this:
> "It's 5:45 PM. You're at Mumbai airport. Your 6 PM flight just got cancelled. You have ₹1500 in your wallet and you HAVE to reach Ahmedabad by 10 PM tonight. What do you do?"

Pause 3 seconds. Let them feel it.

> "Most people would spend the next 45 minutes in a panic — checking 4 different apps, standing in a queue at the airline counter, calling family. RescuePlan solves it in 10 seconds."

---

### 0:45 – 3:00 | Live Demo (the product does the talking)

Open the app. Type this EXACTLY into the crisis box:

```
My IndiGo flight 6E-456 from Mumbai to Ahmedabad at 6 PM got cancelled by the airline. 
I need to reach Ahmedabad by 10 PM tonight. I have ₹1500 left. What do I do?
```

Hit "Get My Rescue Plan."

While it loads (3–6 seconds), say:
> "RescuePlan is using Gemini 2.5 Flash with Google Search grounding — it's searching for real flights, trains, and buses right now."

When the result renders, walk through it:
- "This is the immediate action — what to do in the next 5 minutes"
- "These are the ranked options — fastest first, budget-conscious"
- "Each one is marked confirmed or verify — we never hallucinate transport details"
- "Budget status — it found 2 options under ₹1500"
- "Step by step plan — not vague advice, specific actions with platform names and phone numbers"

---

### 3:00 – 4:00 | Follow-up Demo

Type this in the chat box:
```
What if all the flights are full? Is there a train option?
```

Show the response updating — Gemini maintains context, gives train-specific answer.

Say: "Context persists. It remembers your budget, your deadline, your origin and destination. This is a conversation, not a form."

---

### 4:00 – 6:00 | Problem & Market Slide

Slide 1 — The Problem:
- 8.6% of global flights delayed or cancelled in 2025
- Indian traveller spends 45+ minutes replanning manually
- No consumer tool exists for the crisis moment specifically

Slide 2 — Why Now:
- 47% of Indian travellers used AI for trip planning in 2025
- Gemini's Google Search grounding makes real-time data possible
- Vibe coding makes this buildable in days, not months

---

### 6:00 – 8:00 | Tech Architecture Slide

One slide. Show:
```
User Crisis Input
      ↓
React + Vite Frontend
      ↓
Gemini 2.5 Flash + Google Search Grounding
      ↓
Structured JSON Rescue Plan
      ↓
React UI renders ranked options
```

Say: "Google AI Studio is not a wrapper here — it IS the product. The grounding capability is what makes this factually reliable, not just a chatbot with travel words."

---

### 8:00 – 9:30 | Differentiation

"Every AI travel tool today is a pre-trip planner. MakeMyTrip AI, KAYAK AI, Romie — they help you plan your vacation. None of them are built for the 45-minute panic window when things go wrong. RescuePlan owns that moment."

---

### 9:30 – 11:00 | What's Next

- Connect to real-time flight APIs (IndiGo, Air India, SpiceJet)
- IRCTC live seat availability integration
- WhatsApp crisis assistant (send your crisis on WhatsApp, get the plan back)
- Expand to international travellers

---

### 11:00 – 12:00 | Close

> "Travel will always have emergencies. What changes is how fast you recover. RescuePlan turns 45 minutes of panic into 10 seconds of clarity."

---

## Q&A Prep — Likely Judge Questions

**Q: How do you handle hallucinations?**
A: Two mechanisms. First, Google Search grounding gives Gemini live data to cite, not training memory. Second, every option is marked 'confirmed' or 'verify' — we never pretend to have certainty we don't have. The system is designed to be honest about what it knows.

**Q: What if someone uses this and misses their flight because the info was wrong?**
A: Every output includes a disclaimer. RescuePlan gives you a starting point and tells you exactly where to verify — IRCTC app, IndiGo app, RedBus. It's a navigator, not a ticket counter.

**Q: Why not just use Google Flights?**
A: Google Flights shows you flights. RescuePlan understands your crisis — budget, deadline, mode preferences — and builds a complete response including trains, buses, step-by-step instructions, and refund tips. It's the difference between a map and a navigator.

**Q: Can it actually book tickets?**
A: Not yet — this is v1. But the architecture is designed for it. The next version integrates with IRCTC and IndiGo APIs for one-click booking directly from the rescue plan.

**Q: Is this only for India?**
A: v1 is India-first by design — the system prompt is trained on Indian operators, IRCTC, GSRTC, etc. The architecture works globally; it's a configuration change to add international operators.

---

## Demo Environment Checklist (night before)
- [ ] API key confirmed working
- [ ] App deployed on Vercel, URL ready
- [ ] Tested the exact demo scenario 5 times
- [ ] Backup: screen recording of working demo in case of internet issues
- [ ] Mobile version checked — judges may ask to see it on phone
- [ ] Loading animation confirmed working
- [ ] Follow-up chat confirmed working
- [ ] Slides ready (6 slides max, no walls of text)
