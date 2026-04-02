export default function MetricCard({ title, value, change, trend, suffix = '' }) {
  // trend: 'up' = 上涨(红色), 'down' = 下降(绿色), null = 全部时间(白色)
  const trendColor = trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-white'

  return (
    <div className="bg-secondary rounded-lg border border-border p-4">
      <div className="text-textSecondary text-sm mb-1">{title}</div>
      <div className="text-2xl font-bold text-textPrimary">{value}{suffix}</div>
      {change !== null && change !== undefined && (
        <div className={`text-xs mt-1 ${trendColor}`}>
          {trend === null ? '—' : (trend === 'up' ? '↑' : '↓')} {change}%
        </div>
      )}
    </div>
  )
}
