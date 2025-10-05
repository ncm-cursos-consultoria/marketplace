export function MatchPill({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 rounded-full bg-gray-200 overflow-hidden">
        <div className="h-full bg-indigo-600" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
      <span className="text-sm text-gray-700 tabular-nums">{value}%</span>
    </div>
  )
}