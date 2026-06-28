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
    <div className="rescue-section">
      {/* Chat history (rendered in standard flow above the sticky bar) */}
      {chatHistory.length > 0 && (
        <div className="space-y-3 mb-6 mt-6">
          <p className="font-display font-bold text-white text-sm uppercase tracking-wide">
            💬 FOLLOW-UP HISTORY
          </p>
          {chatHistory.map((entry, i) => (
            <div key={i} className="space-y-2">
              {entry.role === 'user' ? (
                <div className="bg-[#1a1a1a] border-l-2 border-[#ff2d2d] font-mono text-white text-xs px-3 py-2 rounded-none">
                  <span className="text-[#888888] font-bold uppercase tracking-wider mr-1">YOU:</span> {entry.text}
                </div>
              ) : entry.error ? (
                <div className="bg-[#111111] border-l-2 border-[#ff2d2d] font-mono text-[#ff2d2d] text-xs px-3 py-2 rounded-none">
                  ⚠️ {entry.error}
                </div>
              ) : entry.data ? (
                <div className="bg-[#111111] border-l-2 border-[#2a2a2a] font-mono text-[#888888] text-xs px-3 py-3 rounded-none space-y-2">
                  <p className="text-white font-bold uppercase tracking-wider mb-1">RESCUE UPDATE</p>
                  {entry.data.crisis_summary && (
                    <p className="text-[#888888]">{entry.data.crisis_summary}</p>
                  )}
                  {entry.data.immediate_action && (
                    <p className="text-[#ff6b00]">⚡ {entry.data.immediate_action.toUpperCase()}</p>
                  )}
                  {entry.data.options && entry.data.options.length > 0 && (
                    <div className="border-t border-[#2a2a2a] pt-2 mt-2 space-y-1.5">
                      {entry.data.options.map((opt) => (
                        <p key={opt.rank} className="text-gray-300 font-mono tabular-nums text-xs">
                          #{opt.rank} {opt.operator.toUpperCase()} — {opt.estimated_cost}
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

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#080808] border-t-2 border-[#2a2a2a] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] z-50">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
          <input
            id="followup-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Ask a follow-up... e.g. "What if I take the bus instead?"'
            disabled={loading}
            className="followup-input flex-1 bg-[#111111] border border-[#2a2a2a] focus:border-[#ff2d2d] focus:outline-none rounded-none px-4 py-3 font-mono text-white text-sm placeholder:text-[#444444] transition-[border-color,box-shadow] duration-150 disabled:opacity-50"
            style={{ fontSize: '16px', minHeight: '44px' }}
          />
          <button
            type="submit"
            id="send-followup"
            disabled={loading || !text.trim()}
            className="bg-[#ff2d2d] hover:bg-[#cc0000] active:scale-[0.96] disabled:bg-[#1a1a1a] disabled:text-[#444444] disabled:cursor-not-allowed text-white font-mono font-bold text-xs uppercase tracking-widest px-5 rounded-none flex-shrink-0 transition-[transform,background-color] duration-75 border-none cursor-pointer"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            {loading ? '...' : 'SEND →'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatFollowUp
