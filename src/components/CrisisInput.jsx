import { useState } from 'react'

function CrisisInput({ onSubmit }) {
  const [text, setText] = useState('')
  const [validationError, setValidationError] = useState('')

  const EXAMPLES = [
    {
      label: "✈️ FLIGHT CANCELLED — MUMBAI → AHMEDABAD",
      text: "My IndiGo flight 6E-456 from Mumbai to Ahmedabad at 6 PM got cancelled by the airline. I need to reach Ahmedabad by 10 PM tonight. I have ₹1500 left. What do I do?"
    },
    {
      label: "🚂 MISSED TRAIN — DELHI → MUMBAI",
      text: "I missed the Rajdhani Express from New Delhi at 4:30 PM. I am at New Delhi Railway Station. I need to reach Mumbai by tomorrow morning 9 AM for a meeting. Budget ₹3000."
    },
    {
      label: "🚌 BUS STRIKE — RAJASTHAN",
      text: "I missed my train from Jawai Bandh Sumerpur Railway Station at 8 AM. I am at Jawai Bandh station in Rajasthan. I need to reach Ahmedabad today. Budget ₹800."
    }
  ]

  function handleSubmit(e) {
    e.preventDefault()

    const trimmed = text.trim()

    // Validate: not empty
    if (!trimmed) {
      setValidationError("Tell me what happened — describe your travel emergency")
      return
    }

    // Validate: min 10 chars (per 04_data_flow.md)
    if (trimmed.length < 10) {
      setValidationError("Please provide more detail — include where you are, where you need to go, and your deadline")
      return
    }

    setValidationError('')
    onSubmit(trimmed)
  }

  return (
    <div className="space-y-6">
      {/* Hero section inside CrisisInput since it is the landing/input screen */}
      <div className="pt-16 pb-8 max-w-2xl mx-auto px-6">
        <h2 className="font-display font-bold text-5xl text-white leading-none tracking-tight mb-2 uppercase">
          TRAVEL WENT WRONG.
        </h2>
        <h3 className="font-display font-bold text-5xl text-[#ff2d2d] leading-none tracking-tight mb-8 uppercase">
          WE FIX IT IN SECONDS.
        </h3>
        <p className="font-mono text-[#888888] text-sm tracking-wide">
          Describe your crisis. Get a real rescue plan.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 space-y-4">
        <div className="relative">
          <textarea
            id="crisis-input"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              if (validationError) setValidationError('')
            }}
            placeholder="e.g. My IndiGo flight from Mumbai to Ahmedabad at 6 PM got cancelled. Need to reach by 10 PM. Budget ₹1500."
            className="crisis-input bg-[#111111] border-2 border-[#2a2a2a] focus:border-[#ff2d2d] focus:outline-none rounded-none p-4 w-full min-h-[160px] resize-none font-mono text-white text-sm placeholder:text-[#444444] transition-colors duration-150 pb-10"
            style={{ fontSize: '16px' }}
          />

          {/* Character count */}
          <div className="absolute bottom-3 right-3 font-mono text-[#444444] text-xs pointer-events-none">
            {text.length} chars
          </div>
        </div>

        {/* Validation error */}
        {validationError && (
          <p className="text-red-400 font-mono text-xs uppercase tracking-wider">{validationError}</p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          id="submit-crisis"
          className="w-full bg-[#ff2d2d] hover:bg-[#cc0000] active:scale-95 text-white font-display font-bold text-lg uppercase tracking-widest py-5 rounded-none transition-all duration-150 cursor-pointer border-none flex items-center justify-center gap-2"
          style={{ minHeight: '56px' }}
        >
          🚨 GET MY RESCUE PLAN →
        </button>

        {/* Example pills */}
        <div className="mt-6 pt-4">
          <p className="font-mono text-[#444444] text-xs tracking-widest mb-3 uppercase">
            TRY AN EXAMPLE:
          </p>
          <div className="flex flex-col gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setText(ex.text)
                  setValidationError('')
                }}
                className="bg-[#111111] border border-[#2a2a2a] hover:border-[#ff2d2d] hover:text-white text-[#888888] font-mono text-xs px-3 py-2.5 rounded-none cursor-pointer transition-all duration-150 text-left w-full"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  )
}

export default CrisisInput
