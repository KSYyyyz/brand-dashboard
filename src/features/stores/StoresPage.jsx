import { useState, useEffect, useMemo } from 'react'
import Card from '../../components/ui/Card'
import MetricCard from '../../components/ui/MetricCard'
import Table from '../../components/ui/Table'
import BarChartComponent from '../../components/charts/BarChart'
import StoreDetailModal from '../../components/ui/StoreDetailModal'
import { generateAllMockData } from '../../lib/mock-generator'

export default function StoresPage() {
  const [loading, setLoading] = useState(true)
  const [stores, setStores] = useState([])
  const [storeSales, setStoreSales] = useState([])
  const [filter, setFilter] = useState({ status: '', province: '', search: '' })
  const [selectedStore, setSelectedStore] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState(null)
  const pageSize = 25

  useEffect(() => {
    setTimeout(() => {
      try {
        const mockData = generateAllMockData()
        setStores(mockData.stores || [])
        setStoreSales(mockData.storeSales || [])
        setLoading(false)
      } catch (err) {
        console.error('门店数据加载失败:', err)
        setError(err.message)
        setLoading(false)
      }
    }, 500)
  }, [])

  // 门店统计
  const storeStats = useMemo(() => {
    const stats = stores.map(store => {
      const sales = storeSales.filter(s => s.store_id === store.id)
      const totalRevenue = sales.reduce((sum, s) => sum + Number(s.revenue), 0)
      const totalProfit = sales.reduce((sum, s) => sum + Number(s.profit), 0)
      const totalCustomers = sales.reduce((sum, s) => sum + s.customer_count, 0)
      const avgOrder = totalCustomers > 0 ? totalRevenue / totalCustomers : 0
      return {
        ...store,
        totalRevenue,
        totalProfit,
        totalCustomers,
        avgOrder
      }
    })
    return stats.sort((a, b) => b.totalRevenue - a.totalRevenue)
  }, [stores, storeSales])

  // 筛选后的门店
  const filteredStores = useMemo(() => {
    return storeStats.filter(store => {
      if (filter.status && store.status !== filter.status) return false
      if (filter.province && store.province !== filter.province) return false
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

  // 选中门店的详细销售数据
  const selectedStoreData = useMemo(() => {
    if (!selectedStore) return null
    const store = stores.find(s => s.id === selectedStore)
    const sales = storeSales.filter(s => s.store_id === selectedStore)

    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.revenue), 0)
    const totalProfit = sales.reduce((sum, s) => sum + Number(s.profit), 0)
    const totalCustomers = sales.reduce((sum, s) => sum + s.customer_count, 0)
    const avgOrder = totalCustomers > 0 ? totalRevenue / totalCustomers : 0
    const profitRate = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0

    return {
      store,
      sales,
      stats: { totalRevenue, totalProfit, totalCustomers, avgOrder, profitRate }
    }
  }, [selectedStore, stores, storeSales])

  const columns = [
    { key: 'store_code', title: '门店编码', render: (v) => <span className="text-accent">{v}</span> },
    { key: 'store_name', title: '门店名称' },
    { key: 'province', title: '省份' },
    { key: 'city', title: '城市' },
    { key: 'status', title: '状态', render: (v) => (
      <span className={`px-2 py-0.5 rounded text-xs ${v === '营业中' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
        {v}
      </span>
    )},
    { key: 'totalRevenue', title: '销售额', render: (v) => `¥${(v / 10000).toFixed(1)}万` },
    { key: 'totalCustomers', title: '客户数' },
    { key: 'avgOrder', title: '客单价', render: (v) => `¥${Math.round(v)}` }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">门店管理</h1>
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-secondary rounded-lg animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">门店管理</h1>
        <div className="p-4 bg-error/20 text-error rounded-lg">
          数据加载失败: {error}
        </div>
      </div>
    )
  }

  const totalRevenue = storeStats.reduce((sum, s) => sum + s.totalRevenue, 0)
  const totalCustomers = storeStats.reduce((sum, s) => sum + s.totalCustomers, 0)
  const avgOrder = totalCustomers > 0 ? totalRevenue / totalCustomers : 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">门店管理</h1>

      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="门店总数" value={stores.length} />
        <MetricCard title="总销售额" value={`¥${(totalRevenue / 10000).toFixed(1)}万`} />
        <MetricCard title="总客户数" value={totalCustomers.toLocaleString()} />
        <MetricCard title="平均客单价" value={`¥${Math.round(avgOrder)}`} />
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
            value={filter.province}
            onChange={(e) => setFilter({ ...filter, province: e.target.value })}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            <option value="">全部省份</option>
            {[...new Set(stores.map(s => s.province))].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            <option value="">全部状态</option>
            <option value="营业中">营业中</option>
            <option value="歇业">歇业</option>
          </select>
        </div>

        <Table columns={columns} data={paginatedStores} onRowClick={(row) => setSelectedStore(row.id)} />

        {/* 分页 */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-textSecondary">
            共 {filteredStores.length} 家门店
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
              disabled={currentPage === totalPages}
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
