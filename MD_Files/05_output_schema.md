# 05 — Output Schema

## The Contract
Every Gemini response MUST conform to this schema. The UI is built to consume exactly this structure. Any deviation = render failure.

---

## Full JSON Schema with Field Specs

```json
{
  "crisis_summary": {
    "type": "string",
    "maxLength": 120,
    "example": "IndiGo flight Mumbai→Ahmedabad cancelled. User needs to arrive by 10 PM with ₹1500 budget.",
    "rules": "One sentence. Past tense for what happened, present tense for what's needed."
  },

  "immediate_action": {
    "type": "string",
    "maxLength": 200,
    "example": "Open the IndiGo app NOW and check if you can rebook on the 7:45 PM flight — it's free if the airline cancelled.",
    "rules": "Must be a single, specific action. Starts with a verb. No vague advice like 'consider your options'."
  },

  "options": {
    "type": "array",
    "minItems": 1,
    "maxItems": 4,
    "rules": "Sorted by rank (1 = best). Rank 1 is fastest arrival that fits budget. If nothing fits budget, rank 1 is cheapest available.",
    "item": {
      "rank": {
        "type": "integer",
        "values": [1, 2, 3, 4]
      },
      "mode": {
        "type": "string",
        "enum": ["flight", "train", "bus", "cab"],
        "rules": "Exact lowercase string. Used to render mode icon in UI."
      },
      "operator": {
        "type": "string",
        "example": "IndiGo | Indian Railways | GSRTC | Ola Intercity",
        "rules": "Official operator name. No abbreviations the user won't recognise."
      },
      "identifier": {
        "type": "string",
        "example": "6E-204 | 12009 Shatabdi | GSRTC Volvo AC | N/A",
        "rules": "Flight number, train number, or bus route name. If uncertain, write 'Verify on [platform]' instead of guessing."
      },
      "departure": {
        "type": "string",
        "example": "19:45 from Chhatrapati Shivaji Maharaj International Airport",
        "rules": "24hr format. Include full station/airport name."
      },
      "arrival": {
        "type": "string",
        "example": "21:10 at Sardar Vallabhbhai Patel International Airport",
        "rules": "24hr format. Include full station/airport name."
      },
      "estimated_cost": {
        "type": "string",
        "example": "₹1,299 (Economy) | ₹320 (Sleeper) | ₹280 (AC Seater)",
        "rules": "INR only. Include class/type in parentheses. If price range, show lower bound."
      },
      "booking_platform": {
        "type": "string",
        "example": "IndiGo app or website | IRCTC app | RedBus | AbhiBus",
        "rules": "Name the fastest/easiest platform for that mode. Prefer apps over websites for urgency."
      },
      "fits_budget": {
        "type": "boolean",
        "rules": "true only if estimated_cost ≤ user's stated budget. false if over budget."
      },
      "confidence": {
        "type": "string",
        "enum": ["confirmed", "verify"],
        "rules": "'confirmed' only if Gemini retrieved this via Google Search grounding and is highly certain. 'verify' if approximate or inferred."
      },
      "notes": {
        "type": "string",
        "example": "Tatkal quota — book before 10 PM. Last few seats. Check availability first.",
        "rules": "Optional caveat. Leave empty string if no notes. Max 100 chars."
      }
    }
  },

  "budget_status": {
    "user_budget": {
      "type": "string",
      "example": "₹1,500",
      "rules": "Repeat exactly what user stated."
    },
    "cheapest_option_cost": {
      "type": "string",
      "example": "₹280",
      "rules": "Cost of the cheapest option in the options array."
    },
    "shortfall": {
      "type": "string | null",
      "example": "₹200 short for cheapest flight. Bus fits budget.",
      "rules": "null if any option fits budget. String explanation if nothing fits."
    }
  },

  "what_to_do_now": {
    "type": "array",
    "items": "string",
    "minItems": 3,
    "maxItems": 6,
    "example": [
      "Step 1: Call IndiGo 0124-4973838 and request free rebooking (airline-caused cancellation).",
      "Step 2: While on hold, open IRCTC app and check Tatkal availability on 12009 Shatabdi.",
      "Step 3: If both fail, book GSRTC Volvo on RedBus — ₹280, departs 6:30 PM Borivali."
    ],
    "rules": "Steps must be ordered by urgency. Each step starts with 'Step N:'. Include specific phone numbers, app names, or platform names wherever possible."
  },

  "refund_tip": {
    "type": "string",
    "example": "IndiGo cancelled your flight, so you're entitled to a full refund. Request it via the IndiGo app under 'My Bookings' or call 0124-4973838. Refund processes in 7–10 business days.",
    "rules": "Only include if there's a cancelled service. Empty string if not applicable. Be specific about process."
  },

  "disclaimer": {
    "type": "string",
    "fixed": "Prices and availability are approximate and may change. Always verify on the booking platform before making payment. RescuePlan is not a booking engine."
  }
}
```

---

## Validation Logic in parseGeminiResponse()

```js
function validateSchema(data) {
  const required = ['crisis_summary', 'immediate_action', 'options', 'budget_status', 'what_to_do_now'];
  for (const field of required) {
    if (!data[field]) return { valid: false, missing: field };
  }
  if (!Array.isArray(data.options) || data.options.length === 0) {
    return { valid: false, missing: 'options array' };
  }
  return { valid: true };
}
```

---

## Fallback Render
If schema validation fails but raw text exists, render:
- A yellow warning banner: "Couldn't fully parse the rescue plan. Here's what Gemini said:"
- Raw text in a scrollable pre block
- "Try again" button
