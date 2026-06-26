import { useState } from 'react'

function CrisisInput({ onSubmit }) {
  const [text, setText] = useState('')
  const [validationError, setValidationError] = useState('')

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
      {/* Hero text */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Describe your travel emergency
        </h2>
        <p className="text-gray-400 text-sm sm:text-base">
          Tell us what happened — we'll find your rescue options in seconds
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            id="crisis-input"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              if (validationError) setValidationError('')
            }}
            placeholder={'e.g. "My IndiGo flight 6E-456 from Mumbai to Ahmedabad at 6 PM got cancelled. I need to reach Ahmedabad by 10 PM tonight. I have ₹1500 left. What do I do?"'}
            rows={4}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 text-base resize-y focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-shadow"
            style={{ minHeight: '120px', fontSize: '16px' }}
          />

          {/* Validation error */}
          {validationError && (
            <p className="mt-2 text-red-400 text-sm">{validationError}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          id="submit-crisis"
          className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors text-base sm:text-lg flex items-center justify-center gap-2"
          style={{ minHeight: '52px' }}
        >
          <span>🚨</span> Get My Rescue Plan
        </button>
      </form>
    </div>
  )
}

export default CrisisInput
