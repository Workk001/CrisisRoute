import { useState, useEffect } from 'react'

const LOADING_MESSAGES = [
  "SEARCHING FLIGHTS...",
  "CHECKING IRCTC TRAINS...",
  "FINDING BUS ALTERNATIVES...",
  "BUILDING YOUR RESCUE PLAN...",
]

function LoadingState() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const duration = 6000

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const currentProgress = Math.min(Math.floor((elapsed / duration) * 100), 100)
      setProgress(currentProgress)

      if (elapsed >= duration) {
        clearInterval(timer)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [])

  // Calculate message index based on current progress
  const messageIndex = Math.min(Math.floor(progress / 25), LOADING_MESSAGES.length - 1)

  return (
    <div className="min-h-[70vh] bg-[#080808] flex flex-col items-center justify-center relative py-12 px-6">
      {/* Centered counter container */}
      <div className="text-center space-y-6">
        {/* Large Monospace Counter */}
        <div className="font-mono font-bold text-8xl text-[#ff2d2d] flex items-baseline justify-center tracking-tighter">
          <span>{progress}</span>
          <span className="text-4xl text-[#2a2a2a] ml-2">%</span>
        </div>

        {/* Messaging */}
        <div className="space-y-4">
          <p className="font-mono text-[#888888] text-sm tracking-widest uppercase">
            {LOADING_MESSAGES[messageIndex]}
          </p>

          {/* Progress bar */}
          <div className="w-64 h-[2px] bg-[#2a2a2a] mx-auto">
            <div
              className="bg-[#ff2d2d] h-full transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Fixed footer at the bottom of the viewport area */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="font-mono text-[#444444] text-xs tracking-widest uppercase">
          POWERED BY GEMINI 2.5 FLASH + GOOGLE SEARCH
        </p>
      </div>
    </div>
  )
}

export default LoadingState
