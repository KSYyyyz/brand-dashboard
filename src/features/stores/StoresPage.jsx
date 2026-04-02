import { useState, useMemo } from 'react'
import Card from '../../components/ui/Card'
import MetricCard from '../../components/ui/MetricCard'
import Table from '../../components/ui/Table'
import BarChartComponent from '../../components/charts/BarChart'
import StoreDetailModal from '../../components/ui/StoreDetailModal'
import DateRangePicker from '../../components/ui/DateRangePicker'
import RefreshButton from '../../components/ui/RefreshButton'
import { useData } from '../../context/DataContext'
import { useDateRange, getDateRange, getPreviousDateRange } from '../../context/DateRangeContext'
import { STORE_STATUS } from '../../lib/constants'

export default function StoresPage() {
  const { loading, stores, transactions, stats, lastRefresh } = useData()
  const [filter, setFilter] = useState({ status: '', city: '', search: '' })
  const [selectedStore, setSelectedStore] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { range } = useDateRange()
  const pageSize = 10

  // 为门店添加状态
  const storesWithStatus = useMemo(() => {
    return stores.map(s => ({
      ...s,
      province: s.city,
      status: STORE_STATUS[s.name] || '营业中',
      store_code: `DOC${String(s.id).padStart(3, '0')}`,
      store_name: s.name
    }))
  }, [stores])

  // 根据日期范围过滤交易并计算对比
  const { filteredTransactions, prevFilteredTransactions, periodComparison } = useMemo(() => {
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

    // 当前周期门店统计
    const completedTx = filtered.filter(t => t.status === '已完成')
    const totalRevenue = completedTx.reduce((sum, t) => sum + t.final_amount, 0)
    const totalOrders = completedTx.length

    // 前一周期门店统计
    const prevCompletedTx = prevFiltered.filter(t => t.status === '已完成')
    const prevTotalRevenue = prevCompletedTx.reduce((sum, t) => sum + t.final_amount, 0)
    const prevTotalOrders = prevCompletedTx.length
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const prevAvgOrder = prevTotalOrders > 0 ? prevTotalRevenue / prevTotalOrders : 0

    const calcChange = (current, previous) => {
      if (prevRange.isAllTime) return null
      if (previous === 0) return current > 0 ? 100 : 0
      return ((current - previous) / previous * 100).toFixed(1)
    }

    const periodComparison = {
      totalRevenue: {
        change: calcChange(totalRevenue, prevTotalRevenue),
        trend: prevRange.isAllTime ? null : totalRevenue >= prevTotalRevenue ? 'up' : 'down'
      },
      totalOrders: {
        change: calcChange(totalOrders, prevTotalOrders),
        trend: prevRange.isAllTime ? null : totalOrders >= prevTotalOrders ? 'up' : 'down'
      },
      avgOrder: {
        change: calcChange(avgOrder, prevAvgOrder),
        trend: prevRange.isAllTime ? null : avgOrder >= prevAvgOrder ? 'up' : 'down'
      }
    }

    return { filteredTransactions: filtered, prevFilteredTransactions: prevFiltered, periodComparison }
  }, [transactions, range])

  // 门店统计
  const storeStats = useMemo(() => {
    return storesWithStatus.map(store => {
      const storeTx = filteredTransactions.filter(t => t.store_id === store.id && t.status === '已完成')
      const totalRevenue = storeTx.reduce((sum, t) => sum + t.final_amount, 0)
      const totalProfit = storeTx.reduce((sum, t) => sum + t.profit, 0)
      const orderCount = storeTx.length
      const avgOrder = orderCount > 0 ? totalRevenue / orderCount : 0
      return {
        ...store,
        totalRevenue,
        totalProfit,
        orderCount,
        avgOrder
      }
    }).sort((a, b) => b.totalRevenue - a.totalRevenue)
  }, [storesWithStatus, filteredTransactions])

  // 筛选后的门店
  const filteredStores = useMemo(() => {
    return storeStats.filter(store => {
      if (filter.status && store.status !== filter.status) return false
      if (filter.city && store.city !== filter.city) return false
      if (filter.search) {
        const search = filter.search.toLowerCase()
        if (!store.store_name.toLowerCase().includes(search) &&
            !store.store_code.toLowerCase().includes(search)) {
          return false
        }
      }
      return true
    })
  }, [storeStats, filter])

  const paginatedStores = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredStores.slice(start, start + pageSize)
  }, [filteredStores, currentPage])

  const totalPages = Math.ceil(filteredStores.length / pageSize)

  // 选中门店的详细数据
  const selectedStoreData = useMemo(() => {
    if (!selectedStore) return null
    const store = storesWithStatus.find(s => s.id === selectedStore)
    const storeTx = filteredTransactions.filter(t => t.store_id === selectedStore && t.status === '已完成')

    const totalRevenue = storeTx.reduce((sum, t) => sum + t.final_amount, 0)
    const totalProfit = storeTx.reduce((sum, t) => sum + t.profit, 0)
    const orderCount = storeTx.length
    const avgOrder = orderCount > 0 ? totalRevenue / orderCount : 0
    const profitRate = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0

    return {
      store,
      sales: storeTx,
      stats: { totalRevenue, totalProfit, orderCount, avgOrder, profitRate }
    }
  }, [selectedStore, storesWithStatus, filteredTransactions])

  const columns = [
    { key: 'store_code', title: '门店编码', render: (v) => <span className="text-accent">{v}</span> },
    { key: 'store_name', title: '门店名称' },
    { key: 'city', title: '城市' },
    { key: 'status', title: '状态', render: (v) => (
      <span className={`px-2 py-0.5 rounded text-xs ${
        v === '营业中' ? 'bg-success/20 text-success' :
        v === '快闪店' ? 'bg-warning/20 text-warning' :
        'bg-error/20 text-error'
      }`}>
        {v}
      </span>
    )},
    { key: 'orderCount', title: '订单数' },
    { key: 'totalRevenue', title: '销售额', render: (v) => `¥${(v / 10000).toFixed(1)}万` },
    { key: 'avgOrder', title: '客单价', render: (v) => `¥${Math.round(v)}` }
  ]

  if (loading && transactions.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">门店管理</h1>
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-secondary rounded-lg animate-pulse" />)}
        </div>
      </div>
    )
  }

  const totalRevenue = storeStats.reduce((sum, s) => sum + s.totalRevenue, 0)
  const totalOrders = storeStats.reduce((sum, s) => sum + s.orderCount, 0)
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">门店管理</h1>
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

      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="门店总数" value={storesWithStatus.length} />
        <MetricCard
          title="总销售额"
          value={`¥${(totalRevenue / 10000).toFixed(1)}万`}
          change={periodComparison.totalRevenue.change}
          trend={periodComparison.totalRevenue.trend}
        />
        <MetricCard
          title="总订单数"
          value={totalOrders.toLocaleString()}
          change={periodComparison.totalOrders.change}
          trend={periodComparison.totalOrders.trend}
        />
        <MetricCard
          title="平均客单价"
          value={`¥${Math.round(avgOrder)}`}
          change={periodComparison.avgOrder.change}
          trend={periodComparison.avgOrder.trend}
        />
      </div>

      {/* 门店排名 */}
      <Card title="门店绩效排名">
        <BarChartComponent
          data={storeStats.slice(0, 10).map(s => ({ name: s.store_name.slice(0, 6), value: s.totalRevenue }))}
          nameKey="name"
          dataKey="value"
          height={280}
        />
      </Card>

      {/* 门店明细 */}
      <Card title="门店列表">
        {/* 筛选器 */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="搜索门店名称/编码"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
          />
          <select
            value={filter.city}
            onChange={(e) => setFilter({ ...filter, city: e.target.value })}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            <option value="">全部城市</option>
            {[...new Set(storesWithStatus.map(s => s.city))].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            <option value="">全部状态</option>
            <option value="营业中">营业中</option>
            <option value="快闪店">快闪店</option>
            <option value="升级中">升级中</option>
            <option value="已关闭">已关闭</option>
          </select>
        </div>

        <Table columns={columns} data={paginatedStores} onRowClick={(row) => setSelectedStore(row.id)} />

        {/* 分页 */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-textSecondary">
            共 {filteredStores.length} 家门店，第 {currentPage}/{totalPages || 1} 页
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-secondary border border-border rounded text-sm disabled:opacity-50"
            >
              上一页
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 bg-secondary border border-border rounded text-sm disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      </Card>

      {/* 门店详情弹窗 */}
      {selectedStoreData && (
        <StoreDetailModal
          store={selectedStoreData.store}
          sales={selectedStoreData.sales}
          onClose={() => setSelectedStore(null)}
        />
      )}
    </div>
  )
}
