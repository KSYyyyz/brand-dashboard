import { createContext, useContext, useState } from 'react'

const DateRangeContext = createContext()

// 获取日期范围
export function getDateRange(range) {
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  if (range === 'all') {
    return { start: null, end: today }
  }

  const days = range === '7d' ? 7 : 30
  const start = new Date(today)
  start.setDate(start.getDate() - days + 1)
  start.setHours(0, 0, 0, 0)

  return { start, end: today }
}

export function DateRangeProvider({ children }) {
  const [range, setRange] = useState('30d')

  return (
    <DateRangeContext.Provider value={{ range, setRange }}>
      {children}
    </DateRangeContext.Provider>
  )
}

export function useDateRange() {
  return useContext(DateRangeContext)
}