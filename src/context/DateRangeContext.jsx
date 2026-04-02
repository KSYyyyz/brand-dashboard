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

// 获取前一个同等周期的日期范围
export function getPreviousDateRange(range) {
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  if (range === 'all') {
    return { start: null, end: null, isAllTime: true }
  }

  const days = range === '7d' ? 7 : 30
  const currentStart = new Date(today)
  currentStart.setDate(currentStart.getDate() - days + 1)
  currentStart.setHours(0, 0, 0, 0)

  // 前一个周期的结束日期是当前周期开始日期的前一天
  const prevEnd = new Date(currentStart)
  prevEnd.setDate(prevEnd.getDate() - 1)
  prevEnd.setHours(23, 59, 59, 999)

  // 前一个周期的开始日期
  const prevStart = new Date(prevEnd)
  prevStart.setDate(prevStart.getDate() - days + 1)
  prevStart.setHours(0, 0, 0, 0)

  return { start: prevStart, end: prevEnd, isAllTime: false }
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