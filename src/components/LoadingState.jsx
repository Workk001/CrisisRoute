import { useState, useEffect } from 'react'

const LOADING_MESSAGES = [
  "Searching for next available flights...",
  "Checking train schedules...",
  "Calculating your cheapest route...",
  "Building your rescue plan...",
]

function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      {/* Pulsing icon */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-red-600/20 animate-ping absolute inset-0" />
        <div className="w-16 h-16 rounded-full bg-red-600/40 flex items-center justify-center relative">
          <span className="text-2xl">🔍</span>
        </div>
      </div>

      {/* Cycling message */}
      <p className="text-gray-300 text-lg text-center animate-pulse transition-all duration-300">
        {LOADING_MESSAGES[messageIndex]}
      </p>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {LOADING_MESSAGES.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i === messageIndex ? 'bg-red-500' : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default LoadingState
