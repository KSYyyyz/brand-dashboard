import { useState, useEffect, useMemo } from 'react'
import MetricCard from '../../components/ui/MetricCard'
import Card from '../../components/ui/Card'
import TrendChart from '../../components/charts/TrendChart'
import DateRangePicker from '../../components/ui/DateRangePicker'
import { useDateRange, getDateRange } from '../../context/DateRangeContext'
import { generateAllMockData } from '../../lib/mock-generator'

export default function OverviewPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const { range } = useDateRange()

  useEffect(() => {
    setTimeout(() => {
      try {
        const mockData = generateAllMockData()
        setData(mockData)
        setLoading(false)
      } catch (err) {
        console.error('概览数据加载失败:', err)
        setError(err.message)
        setLoading(false)
      }
    }, 500)
  }, [])

  // 根据日期范围过滤数据
  const filteredData = useMemo(() => {
    if (!data) return null
    const { start, end } = getDateRange(range)

    if (!start) return data // 全部时间

    const filterByDate = (items, dateField) => {
      return items.filter(item => {
        const date = new Date(item[dateField])
        return date >= start && date <= end
      })
    }

    return {
      ...data,
      orders: filterByDate(data.orders, 'order_time'),
      storeSales: filterByDate(data.storeSales, 'sale_date')
    }
  }, [data, range])

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

  if (!filteredData) return null

  // 计算核心指标
  const totalUsers = filteredData.users.length
  const totalOrders = filteredData.orders.length
  const totalGMV = filteredData.orders.reduce((sum, o) => sum + Number(o.amount), 0)
  const avgOrderAmount = totalOrders > 0 ? Math.round(totalGMV / totalOrders) : 0
  const repurchaseRate = Math.round((filteredData.users.filter(u => u.order_count > 1).length / Math.max(totalUsers, 1)) * 100)

  // GMV趋势数据
  const gmvTrend = filteredData.storeSales.reduce((acc, sale) => {
    const date = sale.sale_date
    const existing = acc.find(a => a.date === date)
    if (existing) {
      existing.value += Number(sale.revenue)
    } else {
      acc.push({ date, value: Number(sale.revenue) })
    }
    return acc
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date))

  // 订单趋势
  const orderTrend = filteredData.orders.slice(0, 100).map((o, i) => ({
    date: o.order_time?.split('T')[0] || '',
    value: i + 1
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
          title="总用户数"
          value={totalUsers.toLocaleString()}
          change="+12%"
          trend="up"
        />
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
          title="平均客单价"
          value={`¥${avgOrderAmount}`}
          change="-3%"
          trend="down"
        />
        <MetricCard
          title="复购率"
          value={`${repurchaseRate}%`}
          change="+2%"
          trend="up"
        />
        <MetricCard
          title="门店数量"
          value={filteredData.stores.length}
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

      {/* 采集状态 */}
      <Card title="数据采集状态">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: '用户数据', status: '正常', count: filteredData.users.length },
            { name: '订单数据', status: '正常', count: filteredData.orders.length },
            { name: '门店数据', status: '正常', count: filteredData.stores.length },
            { name: '销售数据', status: '正常', count: filteredData.storeSales.length },
            { name: '投流数据', status: '正常', count: filteredData.adsData.length },
            { name: '内容数据', status: '正常', count: filteredData.contentData.length }
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-primary rounded-lg">
              <div>
                <div className="text-sm text-textPrimary">{item.name}</div>
                <div className="text-xs text-textSecondary">{item.count}条</div>
              </div>
              <span className="px-2 py-0.5 bg-success/20 text-success text-xs rounded">正常</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}