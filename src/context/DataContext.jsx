import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { fetchHealth, fetchStats, fetchDailyStats, fetchProducts, fetchStores, fetchTransactions, batchGenerateTransactions, initHistoryData } from '../lib/api'

const DataContext = createContext(null)

// 永久缓存的 keys
const PERMANENT_CACHE_KEYS = ['products', 'stores']

// 从 localStorage 读取永久缓存
function getPermanentCache(key) {
  try {
    const item = localStorage.getItem(`wenxuan_${key}`)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

// 设置永久缓存
function setPermanentCache(key, data) {
  try {
    localStorage.setItem(`wenxuan_${key}`, JSON.stringify(data))
  } catch {}
}

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)
  const [isIncremental, setIsIncremental] = useState(false)
  const lastOrderNoRef = useRef(null)

  const [data, setData] = useState({
    health: null,
    stats: null,
    dailyStats: [],
    products: [],
    stores: [],
    transactions: []
  })

  // 初始加载：获取所有数据
  const loadAllData = useCallback(async () => {
    setLoading(true)
    setError(null)
    setIsIncremental(false)
    try {
      // 优先从本地缓存读取 products 和 stores
      let products = getPermanentCache('products')
      let stores = getPermanentCache('stores')

      // 并行获取所有数据
      const [health, stats, dailyStats, transactions, freshProducts, freshStores] = await Promise.all([
        fetchHealth(),
        fetchStats(),
        fetchDailyStats(30),
        fetchTransactions({ limit: 1000 }),
        products ? Promise.resolve(null) : fetchProducts(),
        stores ? Promise.resolve(null) : fetchStores()
      ])

      // 如果没有缓存，从 API 获取
      if (!products && freshProducts) {
        products = freshProducts
        setPermanentCache('products', products)
      }
      if (!stores && freshStores) {
        stores = freshStores
        setPermanentCache('stores', stores)
      }

      // 更新 lastOrderNo 游标
      const txs = transactions.data || []
      if (txs.length > 0) {
        lastOrderNoRef.current = txs[0].order_no // 第一条是最新的
      }

      setData({
        health,
        stats,
        dailyStats,
        products: products || [],
        stores: stores || [],
        transactions: txs
      })
      setLastRefresh(new Date())
    } catch (err) {
      console.error('数据加载失败:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // 增量刷新：只获取新数据
  const refreshIncremental = useCallback(async () => {
    if (!lastOrderNoRef.current) {
      // 没有游标，执行全量加载
      return loadAllData()
    }

    setLoading(true)
    setError(null)
    setIsIncremental(true)
    try {
      // 获取最新的健康状态和统计
      const [health, stats, dailyStats] = await Promise.all([
        fetchHealth(),
        fetchStats(),
        fetchDailyStats(30)
      ])

      // 使用 order_no 游标获取新交易
      // 由于 API 没有 since 参数，我们获取一批新数据然后去重
      const newTransactions = await fetchTransactions({ limit: 100 })

      const existingOrderNos = new Set(data.transactions.map(t => t.order_no))
      const freshTxs = (newTransactions.data || []).filter(t => !existingOrderNos.has(t.order_no))

      // 更新游标
      if (freshTxs.length > 0) {
        lastOrderNoRef.current = freshTxs[0].order_no
      }

      setData(prev => ({
        ...prev,
        health,
        stats,
        dailyStats,
        // 合并新交易，保持 order_no 递减排序
        transactions: [...freshTxs, ...prev.transactions].slice(0, 1000)
      }))
      setLastRefresh(new Date())
    } catch (err) {
      console.error('增量刷新失败:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [data.transactions, loadAllData])

  // 强制全量刷新
  const refreshFull = useCallback(() => {
    lastOrderNoRef.current = null // 重置游标
    loadAllData()
  }, [loadAllData])

  // 初始加载
  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  const value = {
    ...data,
    loading,
    error,
    lastRefresh,
    isIncremental,
    refresh: refreshIncremental,
    refreshFull,
    clearCache: () => {
      localStorage.removeItem('wenxuan_products')
      localStorage.removeItem('wenxuan_stores')
    }
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
