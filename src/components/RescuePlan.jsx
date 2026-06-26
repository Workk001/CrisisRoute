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
    <div className="bg-orange-950 border-l-4 border-orange-500 rounded-r-lg p-4 sm:p-5">
      <p className="text-orange-400 font-semibold text-sm mb-1">⚡ Do This RIGHT NOW</p>
      <p className="text-white text-base sm:text-lg">{action}</p>
    </div>
  )
}

function OptionCard({ option }) {
  const icon = MODE_ICONS[option.mode] || '🔹'

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-5 space-y-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl flex-shrink-0">{icon}</span>
          <div className="min-w-0">
            <p className="text-white font-semibold text-base truncate">
              #{option.rank} {option.operator}
            </p>
            <p className="text-gray-400 text-sm truncate">{option.identifier}</p>
          </div>
        </div>

        {/* Confidence badge */}
        <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
          option.confidence === 'confirmed'
            ? 'bg-green-900 text-green-400'
            : 'bg-yellow-900 text-yellow-400'
        }`}>
          {option.confidence === 'confirmed' ? '✅ Confirmed' : '⚠️ Verify'}
        </span>
      </div>

      {/* Times and cost */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Departure</p>
          <p className="text-gray-200">{option.departure}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Arrival</p>
          <p className="text-gray-200">{option.arrival}</p>
        </div>
      </div>

      {/* Cost + budget fit */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-white font-semibold text-base">{option.estimated_cost}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          option.fits_budget
            ? 'bg-green-900 text-green-400'
            : 'bg-red-900 text-red-400'
        }`}>
          {option.fits_budget ? '✅ Fits budget' : '❌ Over budget'}
        </span>
      </div>

      {/* Booking platform */}
      <p className="text-gray-400 text-sm">
        📱 Book on: <span className="text-gray-200">{option.booking_platform}</span>
      </p>

      {/* Notes */}
      {option.notes && (
        <p className="text-yellow-400 text-xs bg-yellow-950/50 rounded px-2 py-1">
          💡 {option.notes}
        </p>
      )}
    </div>
  )
}

function StepByStep({ steps }) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-5">
      <p className="text-white font-semibold text-base mb-3">📝 Step by Step</p>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="text-gray-300 text-sm pl-1">
            {step}
          </li>
        ))}
      </ol>
    </div>
  )
}

function BudgetStatus({ budgetStatus }) {
  if (!budgetStatus) return null

  const hasShortfall = budgetStatus.shortfall && budgetStatus.shortfall !== 'null'

  return (
    <div className={`rounded-lg p-4 sm:p-5 border ${
      hasShortfall
        ? 'bg-red-950 border-red-800'
        : 'bg-gray-900 border-gray-800'
    }`}>
      <p className="text-white font-semibold text-base mb-3">💰 Budget Status</p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Your Budget</p>
          <p className="text-white font-medium">{budgetStatus.user_budget}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Cheapest Option</p>
          <p className="text-white font-medium">{budgetStatus.cheapest_option_cost}</p>
        </div>
      </div>

      {hasShortfall && (
        <p className="mt-3 text-red-400 text-sm font-medium">
          ⚠️ {budgetStatus.shortfall}
        </p>
      )}
    </div>
  )
}

function RefundTip({ tip }) {
  const [expanded, setExpanded] = useState(false)

  if (!tip) return null

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 sm:p-5 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
      >
        <span className="text-white font-semibold text-base">💸 Refund Tip</span>
        <span className="text-gray-400 text-sm">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
        </div>
      )}
    </div>
  )
}

function RescuePlan({ rescuePlan }) {
  if (!rescuePlan) return null

  const hasOptions = Array.isArray(rescuePlan.options) && rescuePlan.options.length > 0

  return (
    <div className="space-y-4">
      {/* Crisis summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-5">
        <p className="text-gray-400 text-sm">{rescuePlan.crisis_summary}</p>
      </div>

      {/* Immediate action */}
      <ImmediateAction action={rescuePlan.immediate_action} />

      {/* Options */}
      {hasOptions && (
        <div className="space-y-3">
          <p className="text-white font-semibold text-lg">📋 Your Rescue Options</p>
          {rescuePlan.options.map((option) => (
            <OptionCard key={option.rank} option={option} />
          ))}
        </div>
      )}

      {/* Edge case: vague input or non-travel — no options, just show immediate_action above */}
      {!hasOptions && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm">
            Provide more details about your travel crisis to get rescue options.
          </p>
        </div>
      )}

      {/* Step by step */}
      <StepByStep steps={rescuePlan.what_to_do_now} />

      {/* Budget status */}
      <BudgetStatus budgetStatus={rescuePlan.budget_status} />

      {/* Refund tip */}
      <RefundTip tip={rescuePlan.refund_tip} />

      {/* Disclaimer */}
      {rescuePlan.disclaimer && (
        <p className="text-gray-600 text-xs text-center px-4">
          {rescuePlan.disclaimer}
        </p>
      )}
    </div>
  )
}

export default RescuePlan
