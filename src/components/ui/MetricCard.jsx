export default function MetricCard({ title, value, change, trend, suffix = '' }) {
  const isPositive = trend === 'up'
  const trendColor = isPositive ? 'text-success' : 'text-error'

  return (
    <div className="bg-secondary rounded-lg border border-border p-4">
      <div className="text-textSecondary text-sm mb-1">{title}</div>
      <div className="text-2xl font-bold text-textPrimary">{value}{suffix}</div>
      {change && (
        <div className={`text-xs mt-1 ${trendColor}`}>
          {isPositive ? '↑' : '↓'} {change}
        </div>
      )}
    </div>
  )
}
