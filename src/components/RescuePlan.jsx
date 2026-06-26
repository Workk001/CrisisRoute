import { useState } from 'react'

const MODE_ICONS = {
  flight: '✈️',
  train: '🚂',
  bus: '🚌',
  cab: '🚗',
  hotel: '🏨',
}

function ImmediateAction({ action }) {
  if (!action) return null

  return (
    <div className="bg-[#111111] border-l-4 border-[#ff6b00] p-5 mb-4 rescue-section rounded-none">
      <p className="text-[#ff6b00] font-mono text-xs tracking-widest uppercase mb-3 flex items-center gap-1.5">
        <span className="heartbeat">⚡</span> DO THIS RIGHT NOW
      </p>
      <p className="text-white font-display font-bold text-xl leading-snug">{action}</p>
    </div>
  )
}

function OptionCard({ option }) {
  const icon = MODE_ICONS[option.mode] || '🔹'

  // Extract price and class
  // e.g. "₹200 (Sleeper Class)" or "₹1,299"
  const priceParts = option.estimated_cost.match(/(₹[\d,]+)(?:\s*\((.+)\))?/)
  const displayPrice = priceParts ? priceParts[1] : option.estimated_cost
  const displayClass = priceParts && priceParts[2] ? priceParts[2] : ''

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] hover:border-[#ff2d2d] hover:-translate-y-0.5 rounded-none p-0 mb-3 transition-all duration-150 overflow-hidden rescue-section">
      {/* Card header strip */}
      <div className="bg-[#1a1a1a] px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg flex-shrink-0">{icon}</span>
          <span className="font-mono text-[#444444] text-xs flex-shrink-0">#{option.rank}</span>
          <span className="font-display font-bold text-white text-sm uppercase truncate">
            {option.operator}
          </span>
        </div>

        {/* Confidence badge */}
        <span className={`font-mono text-xs px-2 py-1 rounded-none uppercase tracking-wide font-bold flex-shrink-0 ${
          option.confidence === 'confirmed'
            ? 'bg-[#00cc44] text-[#080808]'
            : 'bg-[#ffcc00] text-[#080808]'
        }`}>
          {option.confidence === 'confirmed' ? 'CONFIRMED' : 'VERIFY'}
        </span>
      </div>

      {/* Identifier below operator */}
      <div className="font-mono text-[#888888] text-xs px-4 pb-2 pt-1">
        {option.identifier}
      </div>

      <div className="border-t border-[#2a2a2a]" />

      {/* Times row */}
      <div className="px-4 py-3 grid grid-cols-2 gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[#444444] text-xs tracking-widest mb-1 uppercase">DEP</p>
          <p className="font-mono font-bold text-white text-xl sm:text-2xl">{option.departure.split(' from ')[0]}</p>
          <p className="font-mono text-[#888888] text-xs mt-1 truncate">
            {option.departure.split(' from ')[1] || ''}
          </p>
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[#444444] text-xs tracking-widest mb-1 uppercase">ARR</p>
          <p className="font-mono font-bold text-white text-xl sm:text-2xl">{option.arrival.split(' at ')[0]}</p>
          <p className="font-mono text-[#888888] text-xs mt-1 truncate">
            {option.arrival.split(' at ')[1] || ''}
          </p>
        </div>
      </div>

      <div className="border-t border-[#2a2a2a]" />

      {/* Footer row */}
      <div className="px-4 py-3 flex justify-between items-center">
        <div>
          <span className="font-mono font-bold text-white text-xl">{displayPrice}</span>
          {displayClass && (
            <span className="font-mono text-[#888888] text-xs ml-1">({displayClass})</span>
          )}
        </div>

        {/* fits_budget badge */}
        <span className={`font-mono text-xs px-2 py-1 rounded-none uppercase tracking-wide font-bold ${
          option.fits_budget
            ? 'bg-[#00cc44] text-[#080808]'
            : 'bg-[#ff2d2d] text-white'
        }`}>
          {option.fits_budget ? 'FITS BUDGET' : 'OVER BUDGET'}
        </span>
      </div>

      {/* Booking platform */}
      <div className="px-4 pb-3 font-mono text-[#888888] text-xs">
        📱 BOOK ON: <span className="text-white">{option.booking_platform.toUpperCase()}</span>
      </div>

      {/* Notes */}
      {option.notes && (
        <div className="px-4 pb-3 font-mono text-[#ff6b00] text-xs">
          💡 {option.notes.toUpperCase()}
        </div>
      )}
    </div>
  )
}

function StepByStep({ steps }) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="space-y-4 mb-4 rescue-section">
      <p className="font-display font-bold text-white text-lg uppercase tracking-wide">
        STEP BY STEP
      </p>
      <div className="space-y-4">
        {steps.map((step, i) => {
          // Strip "Step N:" prefix
          const cleanedText = step.replace(/^Step\s+\d+:\s*/i, '')

          return (
            <div key={i} className="flex gap-4 items-start">
              {/* Number block */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#ff2d2d] flex items-center justify-center font-mono font-bold text-white text-sm rounded-none flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-[#888888] font-mono text-sm leading-relaxed pt-1">
                {cleanedText}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BudgetStatus({ budgetStatus }) {
  if (!budgetStatus) return null

  const hasShortfall = budgetStatus.shortfall && budgetStatus.shortfall !== 'null'

  return (
    <div className={`p-4 mb-4 rescue-section rounded-none border-y border-r border-[#2a2a2a] ${
      hasShortfall
        ? 'bg-[#111111] border-l-4 border-[#ff2d2d]'
        : 'bg-[#111111] border-l-4 border-[#00cc44]'
    }`}>
      <p className="font-mono text-xs tracking-widest text-[#444444] uppercase mb-3">
        BUDGET STATUS
      </p>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="font-mono text-[#444444] text-xs tracking-widest mb-1 uppercase">YOUR BUDGET</p>
          <p className="font-mono font-bold text-white text-2xl">{budgetStatus.user_budget}</p>
        </div>
        <div>
          <p className="font-mono text-[#444444] text-xs tracking-widest mb-1 uppercase">CHEAPEST OPTION</p>
          <p className="font-mono font-bold text-white text-2xl">{budgetStatus.cheapest_option_cost}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#2a2a2a]">
        {hasShortfall ? (
          <p className="font-mono text-[#ff2d2d] text-xs tracking-widest uppercase">
            ❌ {budgetStatus.shortfall.toUpperCase()}
          </p>
        ) : (
          <p className="font-mono text-[#00cc44] text-xs tracking-widest uppercase">
            ✅ ALL OPTIONS FIT YOUR BUDGET
          </p>
        )}
      </div>
    </div>
  )
}

function RefundTip({ tip }) {
  const [expanded, setExpanded] = useState(false)

  if (!tip) return null

  return (
    <div className="bg-[#111111] border-l-4 border-[#2a2a2a] p-4 mb-4 rescue-section rounded-none">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex justify-between items-center cursor-pointer"
      >
        <span className="font-mono text-[#888888] text-xs tracking-widest uppercase">
          💸 REFUND & COMPENSATION
        </span>
        <span className="font-mono text-[#444444] text-xs transform transition-transform duration-200">
          {expanded ? '▲' : '▼'}
        </span>
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-[#2a2a2a]">
          <p className="text-[#888888] font-mono text-xs leading-relaxed">{tip}</p>
        </div>
      )}
    </div>
  )
}

function RescuePlan({ rescuePlan }) {
  if (!rescuePlan) return null

  // If it's a fallback due to JSON parsing failure
  if (rescuePlan.is_fallback) {
    const hasSummary = !!rescuePlan.crisis_summary
    const hasAction = !!rescuePlan.immediate_action

    return (
      <div className="space-y-4">
        {/* CSS to hide ChatFollowUp */}
        <style>{`
          .mt-6.space-y-4 {
            display: none !important;
          }
        `}</style>

        <div className="bg-[#111111] border-l-4 border-[#ff2d2d] p-6 rounded-none space-y-4">
          <p className="font-mono text-lg font-bold text-[#ff2d2d] uppercase tracking-wider">
            ⚠️ INCOMPLETE RESPONSE RECOVERED
          </p>
          {(hasSummary || hasAction) ? (
            <div className="space-y-3">
              {hasSummary && (
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-none p-4">
                  <p className="text-[#444444] font-mono text-xs font-bold tracking-widest uppercase mb-1">Crisis Summary</p>
                  <p className="text-[#888888] font-mono text-sm leading-relaxed">{rescuePlan.crisis_summary}</p>
                </div>
              )}
              {hasAction && (
                <div className="bg-[#111111] border-l-4 border-[#ff6b00] p-4 rounded-none">
                  <p className="text-[#ff6b00] font-mono text-xs font-bold tracking-widest uppercase mb-1">⚡ Do This RIGHT NOW</p>
                  <p className="text-white font-display font-bold text-base leading-snug">{rescuePlan.immediate_action}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[#888888] font-mono text-sm leading-relaxed">
              Gemini response was incomplete. Please try again — this sometimes happens on complex routes.
            </p>
          )}
        </div>
        
        {/* Always show Try Again button */}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full bg-[#ff2d2d] hover:bg-[#cc0000] active:scale-95 text-white font-display font-bold text-lg uppercase tracking-widest py-5 rounded-none transition-all duration-150 cursor-pointer border-none"
          style={{ minHeight: '56px' }}
        >
          🔄 Try Again
        </button>
      </div>
    )
  }

  const hasOptions = Array.isArray(rescuePlan.options) && rescuePlan.options.length > 0

  return (
    <div className="space-y-4">
      {/* Crisis summary */}
      <div className="bg-[#111111] border-l-4 border-[#2a2a2a] p-4 mb-4 rescue-section rounded-none">
        <p className="font-mono text-[#444444] text-xs tracking-widest mb-2 uppercase">SITUATION</p>
        <p className="text-[#888888] font-mono text-sm leading-relaxed">{rescuePlan.crisis_summary}</p>
      </div>

      {/* Immediate action */}
      <ImmediateAction action={rescuePlan.immediate_action} />

      {/* Options */}
      {hasOptions && (
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-display font-bold text-white text-lg uppercase tracking-wide">
              RESCUE OPTIONS
            </span>
            <span className="font-mono text-[#ff2d2d] text-sm uppercase">
              [{rescuePlan.options.length}] FOUND
            </span>
          </div>
          {rescuePlan.options.map((option) => (
            <OptionCard key={option.rank} option={option} />
          ))}
        </div>
      )}

      {/* Edge case: vague input or non-travel — no options, just show immediate_action above */}
      {!hasOptions && (
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-none p-4 text-center rescue-section">
          <p className="text-[#888888] font-mono text-sm leading-relaxed">
            PROVIDE MORE DETAILS ABOUT YOUR TRAVEL CRISIS TO GET RESCUE OPTIONS.
          </p>
        </div>
      )}

      {/* Step by step */}
      <StepByStep steps={rescuePlan.what_to_do_now} />

      {/* Budget status */}
      {hasOptions && <BudgetStatus budgetStatus={rescuePlan.budget_status} />}

      {/* Refund tip */}
      <RefundTip tip={rescuePlan.refund_tip} />

      {/* Disclaimer */}
      {rescuePlan.disclaimer && (
        <p className="text-[#444444] font-mono text-xs text-center px-4 pt-4 border-t border-[#2a2a2a] mt-4 tracking-wide uppercase">
          {rescuePlan.disclaimer}
        </p>
      )}
    </div>
  )
}

export default RescuePlan
