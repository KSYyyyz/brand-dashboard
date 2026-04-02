import { useMemo } from 'react'
import MetricCard from '../../components/ui/MetricCard'
import Card from '../../components/ui/Card'
import TrendChart from '../../components/charts/TrendChart'
import DateRangePicker from '../../components/ui/DateRangePicker'
import RefreshButton from '../../components/ui/RefreshButton'
import { useData } from '../../context/DataContext'
import { useDateRange, getDateRange } from '../../context/DateRangeContext'

export default function OverviewPage() {
  const { loading, stats, dailyStats, products, stores, lastRefresh } = useData()
  const { range } = useDateRange()

  // 根据日期范围过滤
  const filteredDailyStats = useMemo(() => {
    const { start, end } = getDateRange(range)
    if (!start) return dailyStats || []
    return (dailyStats || []).filter(d => {
      const date = new Date(d.date)
      return date >= start && date <= end
    })
  }, [dailyStats, range])

  const summary = stats?.summary || {}

  // GMV趋势数据
  const gmvTrend = filteredDailyStats.map(d => ({
    date: d.date,
    value: d.gmv
  }))

  // 订单趋势
  const orderTrend = filteredDailyStats.map(d => ({
    date: d.date,
    value: d.orders
  }))

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">数据概览</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-secondary rounded-lg animate-pulse" />)}
        </div>
      </div>
    )
  }

  const totalOrders = summary.completed_orders || 0
  const totalGMV = summary.total_gmv || 0
  const avgOrderAmount = summary.avg_order_amount || 0
  const totalProfit = summary.total_profit || 0

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
          title="总订单数"
          value={totalOrders.toLocaleString()}
          change="+8%"
          trend="up"
        />
        <MetricCard
          title="GMV"
          value={`¥${(totalGMV / 10000).toFixed(1)}万`}
          change="+15%"
          trend="up"
        />
        <MetricCard
          title="总利润"
          value={`¥${(totalProfit / 10000).toFixed(1)}万`}
        />
        <MetricCard
          title="平均客单价"
          value={`¥${avgOrderAmount}`}
        />
        <MetricCard
          title="商品种类"
          value={products?.length || 0}
        />
        <MetricCard
          title="门店数量"
          value={stores?.length || 0}
        />
      </div>

      {/* 趋势图 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="GMV趋势">
          <TrendChart data={gmvTrend} dataKey="value" />
        </Card>
        <Card title="订单量趋势">
          <TrendChart data={orderTrend} dataKey="value" />
        </Card>
      </div>

      {/* 平台分布 */}
      <Card title="平台销售分布">
        <div className="space-y-3">
          {(stats?.platform_stats || []).slice(0, 5).map(p => (
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
          {(stats?.city_stats || []).slice(0, 5).map(c => (
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
