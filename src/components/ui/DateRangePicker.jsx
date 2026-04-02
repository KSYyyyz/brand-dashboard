import { useState } from 'react'
import { useDateRange } from '../../context/DateRangeContext'

export default function DateRangePicker() {
  const { range, setRange } = useDateRange()
  const [showCustom, setShowCustom] = useState(false)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const options = [
    { key: '7d', label: '7天' },
    { key: '30d', label: '30天' },
    { key: 'all', label: '全部' },
    { key: 'custom', label: '自定义' }
  ]

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      setRange(`custom:${customStart},${customEnd}`)
      setShowCustom(false)
    }
  }

  const displayText = () => {
    if (range === '7d') return '7天'
    if (range === '30d') return '30天'
    if (range === 'all') return '全部时间'
    if (range.startsWith('custom:')) {
      const [, start, end] = range.split(':')
      return `${start} ~ ${end}`
    }
    return '30天'
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-1 bg-secondary border border-border rounded-lg p-1">
        {options.map(opt => (
          <button
            key={opt.key}
            onClick={() => {
              if (opt.key === 'custom') {
                setShowCustom(!showCustom)
              } else {
                setRange(opt.key)
                setShowCustom(false)
              }
            }}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              (range === opt.key || (opt.key === 'custom' && range.startsWith('custom:')))
                ? 'bg-accent text-primary font-medium'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 自定义日期弹窗 */}
      {showCustom && (
        <div className="absolute right-0 top-full mt-2 bg-primary border border-border rounded-lg shadow-xl p-4 z-50 w-64">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-textSecondary block mb-1">开始日期</label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs text-textSecondary block mb-1">结束日期</label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCustom(false)}
                className="flex-1 py-2 bg-secondary hover:bg-border rounded-lg text-sm transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCustomApply}
                disabled={!customStart || !customEnd}
                className="flex-1 py-2 bg-accent text-primary rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                应用
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}