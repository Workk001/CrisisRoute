import { useState } from 'react'
import { startCrisisSession, sendFollowUp, resetSession } from './lib/gemini'
import CrisisInput from './components/CrisisInput'
import LoadingState from './components/LoadingState'
import RescuePlan from './components/RescuePlan'
import ChatFollowUp from './components/ChatFollowUp'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

function minDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function App() {
  const [phase, setPhase] = useState('input') // 'input' | 'loading' | 'result' | 'error'
  const [rescuePlan, setRescuePlan] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [error, setError] = useState(null)
  const [followUpLoading, setFollowUpLoading] = useState(false)

  // Edge case #10: API key missing
  if (!API_KEY) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-6 max-w-lg text-center">
          <p className="text-yellow-400 text-lg font-semibold">⚠️ API key not configured</p>
          <p className="text-yellow-300 mt-2 text-sm">
            Add <code className="bg-yellow-950 px-2 py-0.5 rounded text-yellow-200">VITE_GEMINI_API_KEY</code> to your <code className="bg-yellow-950 px-2 py-0.5 rounded text-yellow-200">.env.local</code> file and restart the dev server.
          </p>
        </div>
      </div>
    )
  }

  async function handleCrisisSubmit(crisisText) {
    setPhase('loading')
    setError(null)
    setRescuePlan(null)
    setChatHistory([])
    resetSession()

    try {
      const [result] = await Promise.all([
        startCrisisSession(crisisText),
        minDelay(3000),
      ])

      if (result.success) {
        setRescuePlan(result.data)
        setPhase('result')
      } else {
        // Edge case #6: JSON parse failure — show fallback
        setError({
          type: 'parse_failure',
          message: "Couldn't fully parse the rescue plan. Here's what Gemini said:",
          raw: result.raw,
        })
        setPhase('error')
      }
    } catch (err) {
      // Edge case #5: timeout or network failure
      if (err.message === 'timeout') {
        setError({
          type: 'timeout',
          message: "Took too long to respond. Try again — Google AI Studio may be busy.",
        })
      } else if (err.message === 'api_key_missing') {
        setError({
          type: 'api_key',
          message: "API key not configured. Add VITE_GEMINI_API_KEY to your .env.local file.",
        })
      } else {
        setError({
          type: 'network',
          message: "Couldn't reach the rescue system. Check your connection and try again.",
        })
      }
      setPhase('error')
    }
  }

  async function handleFollowUp(message) {
    setFollowUpLoading(true)
    setChatHistory((prev) => [...prev, { role: 'user', text: message }])

    try {
      const result = await sendFollowUp(message)

      if (result.success) {
        // Merge updated fields into existing rescue plan
        setRescuePlan((prev) => ({ ...prev, ...result.data }))
        setChatHistory((prev) => [...prev, { role: 'assistant', data: result.data }])
      } else {
        setChatHistory((prev) => [
          ...prev,
          { role: 'assistant', data: null, error: result.error, raw: result.raw },
        ])
      }
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          data: null,
          error: err.message === 'timeout'
            ? "Follow-up took too long. Try again."
            : "Couldn't process your follow-up. Try again.",
        },
      ])
    } finally {
      setFollowUpLoading(false)
    }
  }

  function handleStartOver() {
    resetSession()
    setPhase('input')
    setRescuePlan(null)
    setChatHistory([])
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">🚨</span> CrisisRoute
            </h1>
            <p className="text-gray-400 text-sm">AI Travel Crisis Assistant</p>
          </div>
          {phase !== 'input' && (
            <button
              type="button"
              onClick={handleStartOver}
              className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5 transition-colors"
            >
              New Crisis
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {phase === 'input' && (
          <CrisisInput onSubmit={handleCrisisSubmit} />
        )}

        {phase === 'loading' && (
          <LoadingState />
        )}

        {phase === 'result' && rescuePlan && (
          <>
            <RescuePlan rescuePlan={rescuePlan} />
            <ChatFollowUp
              onSend={handleFollowUp}
              chatHistory={chatHistory}
              loading={followUpLoading}
            />
          </>
        )}

        {phase === 'error' && error && (
          <div className="space-y-4">
            {/* Error display */}
            <div className={`rounded-lg p-6 border ${
              error.type === 'parse_failure'
                ? 'bg-yellow-950 border-yellow-700'
                : 'bg-red-950 border-red-800'
            }`}>
              <p className={`font-semibold text-lg ${
                error.type === 'parse_failure' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {error.type === 'parse_failure' ? '⚠️' : '❌'} {error.message}
              </p>

              {/* Edge case #6 fallback: raw text display */}
              {error.raw && (
                <pre className="mt-4 bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto max-h-96 whitespace-pre-wrap">
                  {error.raw}
                </pre>
              )}
            </div>

            {/* Retry button */}
            <button
              type="button"
              onClick={handleStartOver}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-base"
            >
              🔄 Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer disclaimer */}
      <footer className="border-t border-gray-800 mt-auto">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <p className="text-gray-600 text-xs text-center">
            Prices and availability are approximate. Verify on the respective platform before making payment. CrisisRoute is not a booking engine.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
