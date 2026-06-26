# 01 — Tech Stack

## Stack Decision
Chosen for maximum build speed and zero unnecessary complexity.

## Frontend
- **React 18** — component model, hooks, fast iteration
- **Vite 5** — instant HMR, no config overhead
- **Tailwind CSS v3** — utility-first, no custom CSS files needed
- **No UI library** — shadcn/ui adds setup time; this is a single-screen app

## AI
- **Gemini 2.5 Flash** via Google AI Studio API
  - Model: `gemini-2.5-flash`
  - Why Flash not Pro: faster response time, lower latency for real-time crisis UX, sufficient reasoning for travel replanning
  - Tools enabled: Google Search grounding (critical — allows Gemini to access live flight/train data)

## Deployment
- **Vercel** — push to main, auto-deploy, free tier, custom domain optional

## What is NOT being used (and why)
| Tool | Reason Excluded |
|------|----------------|
| Next.js | No SSR/SSG needed, single page app, adds config overhead |
| Supabase | No data to persist, no auth required |
| Firebase | Same — no backend needed |
| shadcn/ui | Overkill for one-screen app |
| Redux / Zustand | useState is sufficient for this scope |
| React Router | No routing needed |

## Environment Variables
```
VITE_GEMINI_API_KEY=your_google_ai_studio_key
```

## Project Structure
```
/src
  /components
    CrisisInput.jsx       — the main text input box
    RescuePlan.jsx        — structured output card
    ChatFollowUp.jsx      — follow-up conversation
    LoadingState.jsx      — pulse animation while Gemini thinks
  /lib
    gemini.js             — API call, prompt injection, response parser
  App.jsx                 — root, state management
  main.jsx                — entry point
/public
index.html
vite.config.js
tailwind.config.js
.env
```

## Node / Package Versions
- Node 20+
- React 18.3
- Vite 5.x
- @google/generative-ai (official SDK)
