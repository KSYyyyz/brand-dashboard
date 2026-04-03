import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { PRODUCTS, STORES } from '../lib/constants'
import { fetchTransactions, fetchHealth, batchGenerateTransactions, initHistoryData } from '../lib/api'

const DataContext = createContext(null)

// 从交易数据派生统计
function deriveStats(transactions) {
  const completedTx = transactions.filter(t => t.status === '已完成')

  const totalGMV = completedTx.reduce((sum, t) => sum + t.final_amount, 0)
  const totalProfit = completedTx.reduce((sum, t) => sum + t.profit, 0)
  const avgOrderAmount = completedTx.length > 0 ? Math.round(totalGMV / completedTx.length) : 0

  const platformMap = {}
  completedTx.forEach(t => {
    if (!platformMap[t.platform]) {
      platformMap[t.platform] = { platform: t.platform, orders: 0, gmv: 0 }
    }
    platformMap[t.platform].orders += 1
    platformMap[t.platform].gmv += t.final_amount
  })

  const cityMap = {}
  completedTx.forEach(t => {
    if (!cityMap[t.city]) {
      cityMap[t.city] = { city: t.city, orders: 0, gmv: 0 }
    }
    cityMap[t.city].orders += 1
    cityMap[t.city].gmv += t.final_amount
  })

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

  return {
    summary: {
      total_orders: transactions.length,
      completed_orders: completedTx.length,
      refunded_orders: transactions.filter(t => t.status === '已退款').length,
      total_gmv: totalGMV,
      total_profit: totalProfit,
      avg_order_amount: avgOrderAmount
    },
    platform_stats: Object.values(platformMap).sort((a, b) => b.gmv - a.gmv),
    city_stats: Object.values(cityMap).sort((a, b) => b.gmv - a.gmv),
    product_stats: Object.values(productMap).sort((a, b) => b.gmv - a.gmv),
    member_stats: Object.values(memberMap)
  }
}

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)
  const transactionsRef = useRef([])

  const [health, setHealth] = useState(null)
  const [transactions, setTransactions] = useState([])

  // 内嵌的 products 和 stores
  const products = PRODUCTS
  const stores = STORES

  // 派生的统计数据
  const stats = useMemo(() => deriveStats(transactions), [transactions])

  // 加载所有数据
  const loadAllData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [healthData, txsData] = await Promise.all([
        fetchHealth(),
        fetchTransactions({ limit: 2000 })
      ])

      let txs = txsData.data || []
      // 如果API还有更多数据，继续获取
      const totalTx = healthData?.total_transactions || 0
      if (txs.length < totalTx && totalTx <= 10000) {
        const allTxs = [...txs]
        let offset = txs.length
        while (allTxs.length < totalTx) {
          const moreData = await fetchTransactions({ limit: 1000, offset })
          const more = moreData.data || []
          if (more.length === 0) break
          allTxs.push(...more)
          offset += more.length
        }
        txs = allTxs
      }

      transactionsRef.current = txs

      setHealth(healthData)
      setTransactions(txs)
      setLastRefresh(new Date())
    } catch (err) {
      console.error('数据加载失败:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // 刷新
  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const newTxsData = await fetchTransactions({ limit: 500 })
      const newTxs = (newTxsData.data || [])
        .filter(t => !transactionsRef.current.some(existing => existing.order_no === t.order_no))

      if (newTxs.length > 0) {
        const merged = [...newTxs, ...transactionsRef.current].slice(0, 2000)
        transactionsRef.current = merged
        setTransactions(merged)
      }

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
    products,
    stores,
    transactions,
    loading,
    error,
    lastRefresh,
    refresh,
    refreshFull
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
