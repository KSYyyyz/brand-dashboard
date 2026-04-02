import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { fetchHealth, fetchStats, fetchDailyStats, fetchProducts, fetchStores, fetchTransactions } from '../lib/api'

const DataContext = createContext(null)

// 缓存时间 60 秒
const CACHE_DURATION = 60000
const cache = new Map()

function getCached(key) {
  const item = cache.get(key)
  if (!item) return null
  if (Date.now() - item.timestamp > CACHE_DURATION) {
    cache.delete(key)
    return null
  }
  return item.data
}

function setCache(key, data) {
  cache.delete(key)
  cache.set(key, { data, timestamp: Date.now() })
}

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)
  const [data, setData] = useState({
    health: null,
    stats: null,
    dailyStats: [],
    products: [],
    stores: [],
    transactions: []
  })

  const loadAllData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [health, stats, dailyStats, products, stores, transactions] = await Promise.all([
        getCached('health') || fetchHealth().then(d => { setCache('health', d); return d }),
        getCached('stats') || fetchStats().then(d => { setCache('stats', d); return d }),
        getCached('dailyStats') || fetchDailyStats(30).then(d => { setCache('dailyStats', d); return d }),
        getCached('products') || fetchProducts().then(d => { setCache('products', d); return d }),
        getCached('stores') || fetchStores().then(d => { setCache('stores', d); return d }),
        getCached('transactions') || fetchTransactions({ limit: 500 }).then(d => { setCache('transactions', d); return d })
      ])

      setData({
        health,
        stats,
        dailyStats,
        products,
        stores,
        transactions
      })
      setLastRefresh(new Date())
    } catch (err) {
      console.error('数据加载失败:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // 初始加载
  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  // 刷新所有数据（清除缓存后重新加载）
  const refresh = useCallback(() => {
    cache.clear()
    loadAllData()
  }, [loadAllData])

  const value = {
    ...data,
    loading,
    error,
    lastRefresh,
    refresh
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}
