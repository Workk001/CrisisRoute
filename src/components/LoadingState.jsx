import { useState, useEffect, useRef } from 'react'

function getLoadingMessage(progress) {
  if (progress < 30) return "SEARCHING LIVE FLIGHT DATA..."
  if (progress < 55) return "CHECKING IRCTC TRAIN SCHEDULES..."
  if (progress < 75) return "FINDING BUS AND CAB ALTERNATIVES..."
  if (progress < 90) return "BUILDING YOUR RESCUE PLAN..."
  return "ALMOST READY..."
}

function LoadingState({ isComplete, onComplete }) {
  const [progress, setProgress] = useState(0)
  const phaseRef = useRef('ramp') // 'ramp' | 'stall' | 'done'
  const startTimeRef = useRef(Date.now())

  // Phase 1 + Phase 2: ramp to 75, then stall to 89
  useEffect(() => {
    if (isComplete) return

    const rampDuration = 4000 // 4 seconds to reach 75

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current

      if (phaseRef.current === 'ramp') {
        // Ease-out: fast start, slows toward 75
        // Using cubic ease-out: 1 - (1 - t)^3
        const t = Math.min(elapsed / rampDuration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        const value = Math.floor(eased * 75)
        setProgress(value)

        if (t >= 1) {
          phaseRef.current = 'stall'
          startTimeRef.current = Date.now()
        }
      } else if (phaseRef.current === 'stall') {
        // Increment by 1 every 1.5 seconds, cap at 89
        const stallElapsed = Date.now() - startTimeRef.current
        const stallIncrement = Math.floor(stallElapsed / 1500)
        const value = Math.min(75 + stallIncrement, 89)
        setProgress(value)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [isComplete])

  // Phase 3: when isComplete, jump to 100 and fire onComplete after 300ms
  useEffect(() => {
    if (!isComplete) return

    phaseRef.current = 'done'
    setProgress(100)

    const timeout = setTimeout(() => {
      if (onComplete) onComplete()
    }, 300)

    return () => clearTimeout(timeout)
  }, [isComplete, onComplete])

  const message = getLoadingMessage(progress)

  return (
    <div className="fixed inset-0 bg-[#080808] flex flex-col items-center justify-center z-50">
      {/* Centered counter container */}
      <div className="flex flex-col items-center">
        {/* Large Monospace Counter */}
        <div className="font-mono font-bold text-[#ff2d2d] flex items-baseline justify-center tracking-tighter tabular-nums" style={{ fontSize: 'clamp(5rem, 15vw, 9rem)' }}>
          <span>{progress}</span>
          <span className="text-[#2a2a2a] text-4xl self-end mb-4 ml-2">%</span>
        </div>

        {/* Messaging */}
        <p
          key={message}
          className="font-mono text-[#888888] text-xs tracking-widest uppercase mt-6 animate-[countUp_0.3s_ease-out]"
        >
          {message}
        </p>

        {/* Progress bar */}
        <div className="mt-4 w-48 h-[2px] bg-[#2a2a2a] overflow-hidden">
          <div
            className="bg-[#ff2d2d] h-full transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Fixed bottom label */}
      <div className="fixed bottom-6 text-center left-0 right-0">
        <p className="font-mono text-[#444444] text-[10px] tracking-widest uppercase">
          [ POWERED BY GEMINI 2.5 FLASH + GOOGLE SEARCH ]
        </p>
      </div>
    </div>
  )
}

export default LoadingState
