import { useState } from 'react'

function ChatFollowUp({ onSend, chatHistory, loading }) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    const trimmed = text.trim()
    if (!trimmed || loading) return

    onSend(trimmed)
    setText('')
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Chat history */}
      {chatHistory.length > 0 && (
        <div className="space-y-3">
          <p className="text-white font-semibold text-base">💬 Follow-up Chat</p>
          {chatHistory.map((entry, i) => (
            <div
              key={i}
              className={`rounded-lg p-3 text-sm ${
                entry.role === 'user'
                  ? 'bg-gray-800 border border-gray-700 text-gray-200 ml-8'
                  : 'bg-gray-900 border border-gray-800 text-gray-300 mr-8'
              }`}
            >
              {entry.role === 'user' ? (
                <p><span className="text-gray-500">You:</span> {entry.text}</p>
              ) : entry.error ? (
                <p className="text-red-400">⚠️ {entry.error}</p>
              ) : entry.data ? (
                <div className="space-y-1">
                  {entry.data.crisis_summary && (
                    <p className="text-gray-400">{entry.data.crisis_summary}</p>
                  )}
                  {entry.data.immediate_action && (
                    <p className="text-orange-400">⚡ {entry.data.immediate_action}</p>
                  )}
                  {entry.data.options && entry.data.options.length > 0 && (
                    <div className="mt-1">
                      {entry.data.options.map((opt) => (
                        <p key={opt.rank} className="text-gray-300">
                          #{opt.rank} {opt.operator} — {opt.estimated_cost}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* Follow-up input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          id="followup-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Ask a follow-up... e.g. "What if I take the bus instead?"'
          disabled={loading}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent disabled:opacity-50 transition-shadow"
          style={{ fontSize: '16px' }}
        />
        <button
          type="submit"
          id="send-followup"
          disabled={loading || !text.trim()}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold px-5 py-3 rounded-lg transition-colors flex-shrink-0"
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default ChatFollowUp
