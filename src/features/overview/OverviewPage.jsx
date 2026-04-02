import { useState, useEffect, useMemo } from 'react'
import MetricCard from '../../components/ui/MetricCard'
import Card from '../../components/ui/Card'
import TrendChart from '../../components/charts/TrendChart'
import DateRangePicker from '../../components/ui/DateRangePicker'
import { useDateRange, getDateRange } from '../../context/DateRangeContext'
import { fetchStats, fetchDailyStats, fetchProducts, fetchStores } from '../../lib/api'

export default function OverviewPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const { range } = useDateRange()

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const { start, end } = getDateRange(range)
        const startStr = start ? start.toISOString().split('T')[0] : null
        const endStr = end ? end.toISOString().split('T')[0] : null

        const [stats, daily, products, stores] = await Promise.all([
          fetchStats(startStr, endStr),
          fetchDailyStats(30),
          fetchProducts(),
          fetchStores()
        ])

        setData({
          summary: stats.summary || {},
          platform_stats: stats.platform_stats || [],
          city_stats: stats.city_stats || [],
          product_stats: stats.product_stats || [],
          member_stats: stats.member_stats || [],
          daily_stats: daily,
          products,
          stores
        })
        setError(null)
      } catch (err) {
        console.error('概览数据加载失败:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [range])

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

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">数据概览</h1>
        <div className="p-4 bg-error/20 text-error rounded-lg">
          数据加载失败: {error}
        </div>
      </div>
    )
  }

  if (!data) return null

  // 计算核心指标
  const summary = data.summary || {}
  const totalOrders = summary.completed_orders || 0
  const totalGMV = summary.total_gmv || 0
  const avgOrderAmount = summary.avg_order_amount || 0
  const totalProfit = summary.total_profit || 0

  // GMV趋势数据
  const gmvTrend = (data.daily_stats || []).map(d => ({
    date: d.date,
    value: d.gmv
  }))

  // 订单趋势
  const orderTrend = (data.daily_stats || []).map(d => ({
    date: d.date,
    value: d.orders
  }))

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">数据概览</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-textSecondary">数据更新时间: {new Date().toLocaleString()}</span>
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
          value={data.products?.length || 0}
        />
        <MetricCard
          title="门店数量"
          value={data.stores?.length || 0}
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
          {data.platform_stats?.slice(0, 5).map(p => (
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
          {data.city_stats?.slice(0, 5).map(c => (
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