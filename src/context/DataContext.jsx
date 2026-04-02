import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { fetchProducts, fetchStores, fetchTransactions, fetchHealth, batchGenerateTransactions, initHistoryData } from '../lib/api'

const DataContext = createContext(null)

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

// 从交易数据派生统计
function deriveStats(transactions) {
  const completedTx = transactions.filter(t => t.status === '已完成')

  // 基础统计
  const totalGMV = completedTx.reduce((sum, t) => sum + t.final_amount, 0)
  const totalProfit = completedTx.reduce((sum, t) => sum + t.profit, 0)
  const avgOrderAmount = completedTx.length > 0 ? Math.round(totalGMV / completedTx.length) : 0

  // 平台统计
  const platformMap = {}
  completedTx.forEach(t => {
    if (!platformMap[t.platform]) {
      platformMap[t.platform] = { platform: t.platform, orders: 0, gmv: 0 }
    }
    platformMap[t.platform].orders += 1
    platformMap[t.platform].gmv += t.final_amount
  })
  const platform_stats = Object.values(platformMap)
    .sort((a, b) => b.gmv - a.gmv)

  // 城市统计
  const cityMap = {}
  completedTx.forEach(t => {
    if (!cityMap[t.city]) {
      cityMap[t.city] = { city: t.city, orders: 0, gmv: 0 }
    }
    cityMap[t.city].orders += 1
    cityMap[t.city].gmv += t.final_amount
  })
  const city_stats = Object.values(cityMap)
    .sort((a, b) => b.gmv - a.gmv)

  // 商品统计
  const productMap = {}
  completedTx.forEach(t => {
    if (!productMap[t.product_id]) {
      productMap[t.product_id] = {
        product_id: t.product_id,
        product_name: t.product_name,
        category: t.category,
        orders: 0,
        gmv: 0
      }
    }
    productMap[t.product_id].orders += 1
    productMap[t.product_id].gmv += t.final_amount
  })
  const product_stats = Object.values(productMap)
    .sort((a, b) => b.gmv - a.gmv)

  // 会员等级统计
  const memberLevels = ['龙涎', '沉香', '檀木', '麝香', '非会员']
  const memberMap = {}
  memberLevels.forEach(level => {
    memberMap[level] = { level, orders: 0, gmv: 0 }
  })
  completedTx.forEach(t => {
    const level = t.member_level || '非会员'
    if (!memberMap[level]) memberMap[level] = { level, orders: 0, gmv: 0 }
    memberMap[level].orders += 1
    memberMap[level].gmv += t.final_amount
  })
  const member_stats = Object.values(memberMap)

  return {
    summary: {
      total_orders: transactions.length,
      completed_orders: completedTx.length,
      refunded_orders: transactions.filter(t => t.status === '已退款').length,
      total_gmv: totalGMV,
      total_profit: totalProfit,
      avg_order_amount: avgOrderAmount
    },
    platform_stats,
    city_stats,
    product_stats,
    member_stats
  }
}

// 从交易数据派生每日趋势
function deriveDailyStats(transactions) {
  const completedTx = transactions.filter(t => t.status === '已完成')
  const dailyMap = {}

  completedTx.forEach(t => {
    const date = t.order_time.split('T')[0]
    if (!dailyMap[date]) {
      dailyMap[date] = { date, orders: 0, gmv: 0, profit: 0, customers: 0 }
    }
    dailyMap[date].orders += 1
    dailyMap[date].gmv += t.final_amount
    dailyMap[date].profit += t.profit
    dailyMap[date].customers += 1
  })

  return Object.values(dailyMap)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)
  const [isIncremental, setIsIncremental] = useState(false)
  const lastOrderNoRef = useRef(null)
  const transactionsRef = useRef([])

  const [health, setHealth] = useState(null)
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [transactions, setTransactions] = useState([])

  // 派生的统计数据（基于 transactions）
  const stats = useMemo(() => deriveStats(transactions), [transactions])
  const dailyStats = useMemo(() => deriveDailyStats(transactions), [transactions])

  // 加载所有数据
  const loadAllData = useCallback(async () => {
    setLoading(true)
    setError(null)
    setIsIncremental(false)
    try {
      // 优先从本地缓存读取 products 和 stores
      let cachedProducts = getPermanentCache('products')
      let cachedStores = getPermanentCache('stores')

      // 并行获取
      const [healthData, txsData, freshProducts, freshStores] = await Promise.all([
        fetchHealth(),
        fetchTransactions({ limit: 2000 }),
        cachedProducts ? Promise.resolve(null) : fetchProducts(),
        cachedStores ? Promise.resolve(null) : fetchStores()
      ])

      const txs = txsData.data || []

      // 缓存 products 和 stores
      if (!cachedProducts && freshProducts) {
        cachedProducts = freshProducts
        setPermanentCache('products', freshProducts)
      }
      if (!cachedStores && freshStores) {
        cachedStores = freshStores
        setPermanentCache('stores', freshStores)
      }

      // 更新游标
      if (txs.length > 0) {
        lastOrderNoRef.current = txs[0].order_no
        transactionsRef.current = txs
      }

      setHealth(healthData)
      setProducts(cachedProducts || [])
      setStores(cachedStores || [])
      setTransactions(txs)
      setLastRefresh(new Date())
    } catch (err) {
      console.error('数据加载失败:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // 增量刷新
  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    setIsIncremental(true)
    try {
      // 获取新交易
      const newTxsData = await fetchTransactions({ limit: 100 })
      const newTxs = (newTxsData.data || [])
        .filter(t => !transactionsRef.current.some(existing => existing.order_no === t.order_no))

      if (newTxs.length > 0) {
        // 有新数据，合并
        const merged = [...newTxs, ...transactionsRef.current].slice(0, 2000)
        transactionsRef.current = merged
        lastOrderNoRef.current = merged[0].order_no
        setTransactions(merged)
      }

      // 更新健康状态
      const healthData = await fetchHealth()
      setHealth(healthData)
      setLastRefresh(new Date())
    } catch (err) {
      console.error('刷新失败:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // 全量刷新
  const refreshFull = useCallback(() => {
    lastOrderNoRef.current = null
    transactionsRef.current = []
    loadAllData()
  }, [loadAllData])

  // 初始加载
  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  const value = {
    health,
    stats,
    dailyStats,
    products,
    stores,
    transactions,
    loading,
    error,
    lastRefresh,
    isIncremental,
    refresh,
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
