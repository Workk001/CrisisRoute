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
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
        <div className="bg-[#111111] border-l-4 border-[#ffcc00] p-6 max-w-lg text-center rounded-none">
          <p className="text-[#ffcc00] font-mono text-lg font-bold uppercase tracking-wider">⚠️ API KEY NOT CONFIGURED</p>
          <p className="text-[#888888] mt-2 text-sm font-mono leading-relaxed">
            ADD <code className="bg-[#1a1a1a] px-2 py-0.5 rounded-none text-[#ffcc00]">VITE_GEMINI_API_KEY</code> TO YOUR <code className="bg-[#1a1a1a] px-2 py-0.5 rounded-none text-[#ffcc00]">.env.local</code> FILE AND RESTART THE DEV SERVER.
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
    <div className="min-h-screen bg-[#080808] text-white font-display">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#080808] border-b-2 border-[#2a2a2a] py-4 px-6 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl font-display font-bold text-white tracking-widest uppercase flex items-center gap-2">
            <span className="text-2xl">🚨</span> CRISISROUTE
          </h1>
          <p className="text-[#444444] font-mono text-xs tracking-widest">
            AI TRAVEL CRISIS ASSISTANT
          </p>
        </div>
        {phase === 'result' && (
          <button
            type="button"
            onClick={handleStartOver}
            className="border-2 border-[#2a2a2a] hover:border-white text-[#888888] hover:text-white font-mono text-xs tracking-widest uppercase px-4 py-2 transition-all duration-150 rounded-none cursor-pointer"
          >
            New Crisis
          </button>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-32">
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
            <div className="bg-[#111111] border-l-4 border-[#ff2d2d] p-6 rounded-none">
              <p className="font-mono text-[#ff2d2d] text-lg font-bold uppercase tracking-wider">
                {error.type === 'parse_failure' ? '⚠️ PARSE FAILURE' : '❌ ERROR'}
              </p>
              <p className="text-[#888888] font-mono text-sm mt-2">
                {error.message}
              </p>

              {/* Edge case #6 fallback: raw text display */}
              {error.raw && (
                <pre className="mt-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-none p-4 text-sm text-[#888888] overflow-x-auto max-h-96 whitespace-pre-wrap font-mono">
                  {error.raw}
                </pre>
              )}
            </div>

            {/* Retry button */}
            <button
              type="button"
              onClick={handleStartOver}
              className="w-full bg-[#ff2d2d] hover:bg-[#cc0000] active:scale-95 text-white font-display font-bold text-lg uppercase tracking-widest py-5 rounded-none transition-all duration-150 cursor-pointer border-none flex items-center justify-center gap-2"
              style={{ minHeight: '56px' }}
            >
              🔄 Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer disclaimer */}
      <footer className="border-t border-[#2a2a2a] mt-4">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <p className="text-[#444444] font-mono text-xs text-center tracking-wide">
            Prices and availability are approximate. Verify on the respective platform before making payment. CrisisRoute is not a booking engine.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
