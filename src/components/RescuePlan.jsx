import { useState } from 'react'
import { getBookingLink } from '../lib/deepLinks'

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
    <div className="bg-[#111111] border-l-4 border-[#ff6b00] p-5 mb-3 rescue-section rounded-none relative overflow-hidden">
      <div className="absolute inset-0 bg-[#ff6b00] opacity-[0.03] pointer-events-none" />
      <p className="text-[#ff6b00] font-mono text-[10px] tracking-widest uppercase mb-3 flex items-center gap-1.5">
        <span className="heartbeat">⚡</span> [ DO THIS RIGHT NOW ]
      </p>
      <p 
        className="text-white font-display font-bold leading-snug text-wrap-balance" 
        style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}
      >
        {action}
      </p>
    </div>
  )
}

function OptionCard({ option }) {
  const icon = MODE_ICONS[option.mode] || '🔹'
  const links = getBookingLink(option)

  // Extract price and class
  // e.g. "₹200 (Sleeper Class)" or "₹1,299"
  const priceParts = option.estimated_cost.match(/(₹[\d,]+)(?:\s*\((.+)\))?/)
  const displayPrice = priceParts ? priceParts[1] : option.estimated_cost
  const displayClass = priceParts && priceParts[2] ? priceParts[2] : ''

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] hover:border-[#ff2d2d] hover:-translate-y-0.5 rounded-none mb-3 overflow-hidden transition-[border-color,transform] duration-150 rescue-section">
      <div className="grid gap-[1px] bg-[#2a2a2a]">
        {/* Row 1 — header strip */}
        <div className="bg-[#1a1a1a] px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg flex-shrink-0">{icon}</span>
            <span className="font-mono text-[#444444] text-[10px] flex-shrink-0">#{option.rank}</span>
            <span className="font-display font-bold text-white text-xs uppercase tracking-wide truncate">
              {option.operator}
            </span>
          </div>

          {/* Confidence badge */}
          <span className={`font-mono text-[10px] px-2 py-1 rounded-none uppercase tracking-wide font-bold flex-shrink-0 ${
            option.confidence === 'confirmed'
              ? 'bg-[#00cc44] text-[#080808]'
              : 'bg-[#ffcc00] text-[#080808]'
          }`}>
            {option.confidence === 'confirmed' ? 'CONFIRMED' : 'VERIFY'}
          </span>
        </div>

        {/* Row 2 — identifier */}
        <div className="bg-[#111111] px-4 py-2 font-mono text-[#444444] text-[10px] tracking-wide uppercase">
          {option.identifier}
        </div>

        {/* Row 3 — times */}
        <div className="bg-[#111111] px-4 py-4 grid grid-cols-2 gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[#444444] text-[10px] tracking-widest uppercase mb-1">DEP</p>
            <p 
              className="font-mono font-bold text-white tabular-nums" 
              style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}
            >
              {option.departure.split(' from ')[0]}
            </p>
            <p className="font-mono text-[#888888] text-[10px] mt-1 truncate">
              {option.departure.split(' from ')[1] || ''}
            </p>
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[#444444] text-[10px] tracking-widest uppercase mb-1">ARR</p>
            <p 
              className="font-mono font-bold text-white tabular-nums" 
              style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}
            >
              {option.arrival.split(' at ')[0]}
            </p>
            <p className="font-mono text-[#888888] text-[10px] mt-1 truncate">
              {option.arrival.split(' at ')[1] || ''}
            </p>
          </div>
        </div>

        {/* Row 4 — price + budget */}
        <div className="bg-[#111111] px-4 py-3 flex justify-between items-center">
          <div>
            <span className="font-mono font-bold text-white tabular-nums text-lg">{displayPrice}</span>
            {displayClass && (
              <span className="font-mono text-[#888888] text-[10px] ml-1">({displayClass})</span>
            )}
          </div>

          {/* fits_budget badge */}
          <span className={`font-mono text-[10px] px-2 py-1 rounded-none uppercase tracking-wide font-bold ${
            option.fits_budget
              ? 'bg-[#00cc44] text-[#080808]'
              : 'bg-[#ff2d2d] text-white'
          }`}>
            {option.fits_budget ? 'FITS BUDGET' : 'OVER BUDGET'}
          </span>
        </div>

        {/* Row 5 — booking deep links */}
        <div className="bg-[#111111] px-4 pb-4 pt-3 flex flex-col gap-2">
          <a
            href={links.primary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full bg-[#ff2d2d] hover:bg-[#cc0000] active:scale-[0.96] transition-[transform,background-color] duration-75 px-3 py-2.5 group no-underline"
            style={{ minHeight: '44px' }}
          >
            <span className="font-mono font-bold text-white text-xs uppercase tracking-widest">
              {links.primary.label} →
            </span>
            <span className="font-mono text-white text-[10px] opacity-60 group-hover:opacity-100 transition-opacity duration-150">
              OPENS IN NEW TAB
            </span>
          </a>

          {links.secondary && (
            <a
              href={links.secondary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full bg-transparent border border-[#2a2a2a] hover:border-[#ff2d2d] active:scale-[0.96] transition-[transform,border-color] duration-75 px-3 py-2.5 group no-underline"
              style={{ minHeight: '44px' }}
            >
              <span className="font-mono text-[#888888] group-hover:text-white text-xs uppercase tracking-widest transition-colors duration-150">
                {links.secondary.label} →
              </span>
            </a>
          )}
        </div>

        {/* Row 6 — notes (only if non-empty) */}
        {option.notes && (
          <div className="bg-[#111111] px-4 py-2 font-mono text-[#ff6b00] text-[10px]">
            › {option.notes}
          </div>
        )}
      </div>
    </div>
  )
}

function StepByStep({ steps }) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="mb-4 rescue-section">
      <div className="flex justify-between items-center mb-4">
        <span className="font-mono text-[#444444] text-[10px] tracking-widest uppercase">[ STEP BY STEP ]</span>
      </div>
      <div className="space-y-4">
        {steps.map((step, i) => {
          // Strip "Step N:" prefix by checking if it exists before splitting on ":" and taking index 1+
          const hasStepPrefix = /^Step\s+\d+:/i.test(step)
          const cleanedText = hasStepPrefix 
            ? step.split(':').slice(1).join(':').trim() 
            : step

          return (
            <div key={i} className="flex gap-3 items-start mb-4">
              {/* Number block with padding trick for touch target */}
              <div className="p-2 -m-2 flex-shrink-0">
                <div className="w-7 h-7 bg-[#ff2d2d] flex items-center justify-center font-mono font-bold text-white text-xs min-w-[28px] min-h-[28px] rounded-none">
                  {i + 1}
                </div>
              </div>
              <p className="text-[#888888] font-mono text-sm leading-relaxed pt-0.5 text-wrap-pretty">
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
    <div className={`p-4 mb-3 rescue-section rounded-none ${
      hasShortfall
        ? 'bg-[#111111] border-l-4 border-[#ff2d2d]'
        : 'bg-[#111111] border-l-4 border-[#00cc44]'
    }`}>
      <p className="font-mono text-[10px] tracking-widest text-[#444444] uppercase mb-4">
        [ BUDGET STATUS ]
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-mono text-[#444444] text-[10px] tracking-widest mb-1 uppercase">YOUR BUDGET</p>
          <p className="font-mono font-bold text-white tabular-nums text-2xl">{budgetStatus.user_budget}</p>
        </div>
        <div>
          <p className="font-mono text-[#444444] text-[10px] tracking-widest mb-1 uppercase">CHEAPEST OPTION</p>
          <p className="font-mono font-bold text-white tabular-nums text-2xl">{budgetStatus.cheapest_option_cost}</p>
        </div>
      </div>

      <div className="border-t border-[#2a2a2a] mt-4 pt-3">
        {hasShortfall ? (
          <p className="font-mono text-[#ff2d2d] text-[10px] tracking-widest uppercase">
            ❌ {budgetStatus.shortfall.toUpperCase()}
          </p>
        ) : (
          <p className="font-mono text-[#00cc44] text-[10px] tracking-widest uppercase">
            ✅ ALL OPTIONS FIT YOUR BUDGET
          </p>
        )}
      </div>
    </div>
  )
}

function RefundTip({ tip }) {
  const [expanded, setExpanded] = useState(false)

  // Only render if refund_tip is non-empty string
  if (!tip || typeof tip !== 'string' || !tip.trim()) return null

  return (
    <div className="bg-[#111111] border-l-4 border-[#2a2a2a] mb-3 rescue-section rounded-none">
      <div
        onClick={() => setExpanded(!expanded)}
        className="px-4 py-3 flex justify-between items-center cursor-pointer select-none"
        style={{ minHeight: '44px' }}
      >
        <span className="font-mono text-[#888888] text-[10px] tracking-widest uppercase">
          [ 💸 REFUND & COMPENSATION ]
        </span>
        <span className="font-mono text-[#444444] text-[10px] transform transition-transform duration-200">
          {expanded ? '▲' : '▼'}
        </span>
      </div>
      {expanded && (
        <div className="px-4 pb-4 border-t border-[#2a2a2a] pt-3">
          <p className="text-[#888888] font-mono text-xs leading-relaxed text-wrap-pretty">{tip}</p>
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
                <div className="bg-[#111111] border-l-4 border-[#2a2a2a] p-4 mb-3 rescue-section rounded-none">
                  <span className="font-mono text-[#444444] text-[10px] tracking-widest uppercase block mb-2">[ SITUATION ]</span>
                  <p className="text-[#888888] font-mono text-sm leading-relaxed text-wrap-pretty">{rescuePlan.crisis_summary}</p>
                </div>
              )}
              {hasAction && (
                <div className="bg-[#111111] border-l-4 border-[#ff6b00] p-5 mb-3 relative overflow-hidden rescue-section rounded-none">
                  <div className="absolute inset-0 bg-[#ff6b00] opacity-[0.03] pointer-events-none" />
                  <p className="text-[#ff6b00] font-mono text-[10px] tracking-widest uppercase mb-3 flex items-center gap-1.5">
                    <span className="heartbeat">⚡</span> [ DO THIS RIGHT NOW ]
                  </p>
                  <p 
                    className="text-white font-display font-bold leading-snug text-wrap-balance" 
                    style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}
                  >
                    {rescuePlan.immediate_action}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[#888888] font-mono text-sm leading-relaxed text-wrap-pretty">
              Gemini response was incomplete. Please try again — this sometimes happens on complex routes.
            </p>
          )}
        </div>
        
        {/* Always show Try Again button */}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full bg-[#ff2d2d] hover:bg-[#cc0000] active:scale-[0.96] text-white font-display font-bold text-lg uppercase tracking-widest py-5 rounded-none transition-[transform,background-color] duration-75 cursor-pointer border-none"
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
      <div className="bg-[#111111] border-l-4 border-[#2a2a2a] p-4 mb-3 rescue-section rounded-none">
        <span className="font-mono text-[#444444] text-[10px] tracking-widest uppercase block mb-2">[ SITUATION ]</span>
        <p className="text-[#888888] font-mono text-sm leading-relaxed text-wrap-pretty">{rescuePlan.crisis_summary}</p>
      </div>

      {/* Immediate action */}
      <ImmediateAction action={rescuePlan.immediate_action} />

      {/* Options */}
      {hasOptions && (
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-display font-bold text-white text-base uppercase tracking-wide">
              RESCUE OPTIONS
            </span>
            <span className="font-mono text-[#ff2d2d] text-xs">
              [ {rescuePlan.options.length} FOUND ]
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
    </div>
  )
}

export default RescuePlan
