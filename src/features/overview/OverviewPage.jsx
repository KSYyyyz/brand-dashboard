import { useMemo } from 'react'
import MetricCard from '../../components/ui/MetricCard'
import Card from '../../components/ui/Card'
import TrendChart from '../../components/charts/TrendChart'
import DateRangePicker from '../../components/ui/DateRangePicker'
import RefreshButton from '../../components/ui/RefreshButton'
import { useData } from '../../context/DataContext'
import { useDateRange, getDateRange, getPreviousDateRange } from '../../context/DateRangeContext'
import { PRODUCTS, STORES } from '../../lib/constants'

export default function OverviewPage() {
  const { loading, transactions, lastRefresh } = useData()
  const products = PRODUCTS
  const stores = STORES
  const { range } = useDateRange()

  // 根据日期范围过滤交易并计算统计
  const { filteredTx, filteredStats, filteredDailyStats, periodComparison } = useMemo(() => {
    const { start, end } = getDateRange(range)
    const prevRange = getPreviousDateRange(range)
    let filtered = transactions
    let prevFiltered = transactions

    if (start && end) {
      filtered = transactions.filter(tx => {
        const date = new Date(tx.order_time)
        return date >= start && date <= end
      })
    }

    if (!prevRange.isAllTime && prevRange.start && prevRange.end) {
      prevFiltered = transactions.filter(tx => {
        const date = new Date(tx.order_time)
        return date >= prevRange.start && date <= prevRange.end
      })
    }

    // 重新派生统计
    const completedTx = filtered.filter(t => t.status === '已完成')
    const prevCompletedTx = prevRange.isAllTime ? [] : prevFiltered.filter(t => t.status === '已完成')

    const totalGMV = completedTx.reduce((sum, t) => sum + t.final_amount, 0)
    const totalProfit = completedTx.reduce((sum, t) => sum + t.profit, 0)
    const avgOrderAmount = completedTx.length > 0 ? Math.round(totalGMV / completedTx.length) : 0

    const prevTotalGMV = prevCompletedTx.reduce((sum, t) => sum + t.final_amount, 0)
    const prevTotalProfit = prevCompletedTx.reduce((sum, t) => sum + t.profit, 0)
    const prevAvgOrderAmount = prevCompletedTx.length > 0 ? Math.round(prevTotalGMV / prevCompletedTx.length) : 0

    // 平台统计
    const platformMap = {}
    completedTx.forEach(t => {
      if (!platformMap[t.platform]) {
        platformMap[t.platform] = { platform: t.platform, orders: 0, gmv: 0 }
      }
      platformMap[t.platform].orders += 1
      platformMap[t.platform].gmv += t.final_amount
    })
    const platform_stats = Object.values(platformMap).sort((a, b) => b.gmv - a.gmv)

    // 城市统计
    const cityMap = {}
    completedTx.forEach(t => {
      if (!cityMap[t.city]) {
        cityMap[t.city] = { city: t.city, orders: 0, gmv: 0 }
      }
      cityMap[t.city].orders += 1
      cityMap[t.city].gmv += t.final_amount
    })
    const city_stats = Object.values(cityMap).sort((a, b) => b.gmv - a.gmv)

    // 每日趋势
    const dailyMap = {}
    completedTx.forEach(t => {
      const date = t.order_time.split('T')[0]
      if (!dailyMap[date]) {
        dailyMap[date] = { date, orders: 0, gmv: 0, profit: 0 }
      }
      dailyMap[date].orders += 1
      dailyMap[date].gmv += t.final_amount
      dailyMap[date].profit += t.profit
    })
    const dailyStats = Object.values(dailyMap).sort((a, b) => new Date(a.date) - new Date(b.date))

    const summary = {
      completed_orders: completedTx.length,
      total_gmv: totalGMV,
      total_profit: totalProfit,
      avg_order_amount: avgOrderAmount
    }

    // 周期对比
    const calcChange = (current, previous) => {
      if (prevRange.isAllTime) return null
      if (previous === 0) return current > 0 ? 100 : 0
      return ((current - previous) / previous * 100).toFixed(1)
    }

    const periodComparison = {
      completed_orders: {
        change: calcChange(completedTx.length, prevCompletedTx.length),
        trend: prevRange.isAllTime ? null : completedTx.length >= prevCompletedTx.length ? 'up' : 'down'
      },
      total_gmv: {
        change: calcChange(totalGMV, prevTotalGMV),
        trend: prevRange.isAllTime ? null : totalGMV >= prevTotalGMV ? 'up' : 'down'
      },
      total_profit: {
        change: calcChange(totalProfit, prevTotalProfit),
        trend: prevRange.isAllTime ? null : totalProfit >= prevTotalProfit ? 'up' : 'down'
      },
      avg_order_amount: {
        change: calcChange(avgOrderAmount, prevAvgOrderAmount),
        trend: prevRange.isAllTime ? null : avgOrderAmount >= prevAvgOrderAmount ? 'up' : 'down'
      }
    }

    return { filteredTx: filtered, filteredStats: { summary, platform_stats, city_stats }, filteredDailyStats: dailyStats, periodComparison }
  }, [transactions, range])

  if (loading && transactions.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">数据概览</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-secondary rounded-lg animate-pulse" />)}
        </div>
      </div>
    )
  }

  const summary = filteredStats.summary

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">数据概览</h1>
        <div className="flex items-center gap-4">
          {lastRefresh && (
            <span className="text-sm text-textSecondary">
              更新: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <RefreshButton />
          <DateRangePicker />
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="已完成订单"
          value={summary.completed_orders.toLocaleString()}
          change={periodComparison.completed_orders.change}
          trend={periodComparison.completed_orders.trend}
        />
        <MetricCard
          title="GMV"
          value={`¥${(summary.total_gmv / 10000).toFixed(1)}万`}
          change={periodComparison.total_gmv.change}
          trend={periodComparison.total_gmv.trend}
        />
        <MetricCard
          title="总利润"
          value={`¥${(summary.total_profit / 10000).toFixed(1)}万`}
          change={periodComparison.total_profit.change}
          trend={periodComparison.total_profit.trend}
        />
        <MetricCard
          title="平均客单价"
          value={`¥${summary.avg_order_amount}`}
          change={periodComparison.avg_order_amount.change}
          trend={periodComparison.avg_order_amount.trend}
        />
        <MetricCard
          title="商品种类"
          value={products.length}
        />
        <MetricCard
          title="门店数量"
          value={stores.length}
        />
      </div>

      {/* 趋势图 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="GMV趋势">
          <TrendChart
            data={filteredDailyStats.map(d => ({ date: d.date, value: d.gmv }))}
            dataKey="value"
          />
        </Card>
        <Card title="订单量趋势">
          <TrendChart
            data={filteredDailyStats.map(d => ({ date: d.date, value: d.orders }))}
            dataKey="value"
          />
        </Card>
      </div>

      {/* 平台分布 */}
      <Card title="平台销售分布">
        <div className="space-y-3">
          {filteredStats.platform_stats.slice(0, 5).map(p => (
            <div key={p.platform} className="flex items-center justify-between">
              <span className="text-sm text-textPrimary">{p.platform}</span>
              <span className="text-sm font-medium">¥{(p.gmv / 10000).toFixed(1)}万 ({p.orders}单)</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 城市分布 */}
      <Card title="城市销售分布">
        <div className="space-y-3">
          {filteredStats.city_stats.slice(0, 5).map(c => (
            <div key={c.city} className="flex items-center justify-between">
              <span className="text-sm text-textPrimary">{c.city}</span>
              <span className="text-sm font-medium">¥{(c.gmv / 10000).toFixed(1)}万 ({c.orders}单)</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
