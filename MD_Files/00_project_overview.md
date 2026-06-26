# 00 — Project Overview

## Product Name
**RescuePlan** — AI Travel Crisis Assistant

## Hackathon Context
- Event: Vibe2Ship 2026 — Coding Ninjas × Google for Developers
- Track: The Last-Minute Life Saver
- Submission Deadline: June 29, 2026, 2:00 PM
- Final Presentation: July 12, 2026

## The Problem
When a flight gets cancelled, a train is missed, or a hotel falls through — the traveller has minutes to replan everything. They're panicking, on their phone, surrounded by noise. Existing tools (MakeMyTrip, KAYAK, Google Flights) require the user to manually search across multiple tabs. No single tool takes the raw crisis as input and outputs a complete, prioritised rescue plan.

## What RescuePlan Does
User describes their crisis in plain language — one text box, no forms, no login.
Gemini processes the crisis, reasons through the situation, searches for real alternatives using its live knowledge, and returns a structured rescue plan with:
- Best immediate action (what to do RIGHT NOW)
- 2–3 alternate routes ranked by speed and cost
- Budget breakdown
- Booking links / platform suggestions
- Follow-up chat for "what if" questions

## Core Demo Scenario (for judges)
> "My IndiGo 6E-456 flight from Mumbai to Ahmedabad at 6 PM got cancelled. I need to reach Ahmedabad by 10 PM tonight. I have ₹1500 left. What do I do?"

Expected output: Gemini identifies next IndiGo/SpiceJet/Air India flights, bus options (GSRTC Volvo ~₹300), train options (August Kranti / Shatabdi), ranks by arrival time and cost, tells user exactly what to book first.

## What This Is NOT
- Not a booking engine (no actual ticket purchase)
- Not a trip planner (pre-travel feature)
- Not a chatbot with generic travel advice
- Not a form-based tool

## Why This Wins
1. Demo is visceral — judges feel the panic, then see it solved in 10 seconds
2. Google AI Studio (Gemini) is the mandatory tool — this product IS Gemini, not just a wrapper
3. Tight scope = polished product in 6 days
4. India-first context: IRCTC, GSRTC, IndiGo, budget constraints — judges relate instantly
