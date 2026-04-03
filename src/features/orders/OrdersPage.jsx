import { useState, useMemo } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Table from '../../components/ui/Table'
import RefreshButton from '../../components/ui/RefreshButton'
import { useData } from '../../context/DataContext'

const STATUS_OPTIONS = ['全部', '已完成', '待付款', '已退款', '已取消']
const PLATFORMS = ['全部', '抖音', '小红书', '微信']

export default function OrdersPage() {
  const { loading, transactions, lastRefresh } = useData()
  const [filter, setFilter] = useState({ status: '', platform: '', search: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // 订单统计
  const orderStats = useMemo(() => {
    const stats = {
      total: transactions.length,
      completed: 0,
      pending: 0,
      refunded: 0,
      cancelled: 0
    }
    transactions.forEach(tx => {
      if (tx.status === '已完成') stats.completed++
      else if (tx.status === '待付款') stats.pending++
      else if (tx.status === '已退款') stats.refunded++
      else if (tx.status === '已取消') stats.cancelled++
    })
    return stats
  }, [transactions])

  // 筛选后的订单
  const filteredOrders = useMemo(() => {
    return transactions.filter(tx => {
      if (filter.status && tx.status !== filter.status) return false
      if (filter.platform && tx.platform !== filter.platform) return false
      if (filter.search) {
        const search = filter.search.toLowerCase()
        if (!tx.order_no?.toLowerCase().includes(search) &&
            !tx.product_name?.toLowerCase().includes(search) &&
            !tx.member_name?.toLowerCase().includes(search)) {
          return false
        }
      }
      return true
    })
  }, [transactions, filter])

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredOrders.slice(start, start + pageSize)
  }, [filteredOrders, currentPage])

  const totalPages = Math.ceil(filteredOrders.length / pageSize)

  const columns = [
    { key: 'order_no', title: '订单号', render: (v) => <span className="text-xs font-mono text-accent">{v}</span> },
    { key: 'status', title: '状态', render: (v) => {
      const variants = {
        '已完成': 'success',
        '待付款': 'warning',
        '已退款': 'error',
        '已取消': 'default'
      }
      return <Badge variant={variants[v] || 'default'}>{v}</Badge>
    }},
    { key: 'product_name', title: '商品名称' },
    { key: 'platform', title: '平台' },
    { key: 'city', title: '城市' },
    { key: 'final_amount', title: '订单金额', render: (v) => `¥${v?.toLocaleString()}` },
    { key: 'profit', title: '利润', render: (v) => `¥${v?.toLocaleString()}` },
    { key: 'member_level', title: '会员等级', render: (v) => <Badge variant="default">{v || '非会员'}</Badge> },
    { key: 'order_time', title: '下单时间', render: (v) => v ? new Date(v).toLocaleString() : '-' }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">订单管理</h1>
        <div className="flex items-center gap-4">
          {lastRefresh && (
            <span className="text-sm text-textSecondary">
              更新: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <RefreshButton />
        </div>
      </div>

      {/* 订单统计 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-secondary rounded-lg border border-border p-4">
          <div className="text-textSecondary text-sm">总订单数</div>
          <div className="text-2xl font-bold">{orderStats.total.toLocaleString()}</div>
        </div>
        <div className="bg-secondary rounded-lg border border-border p-4">
          <div className="text-textSecondary text-sm">已完成</div>
          <div className="text-2xl font-bold text-success">{orderStats.completed.toLocaleString()}</div>
        </div>
        <div className="bg-secondary rounded-lg border border-border p-4">
          <div className="text-textSecondary text-sm">待付款</div>
          <div className="text-2xl font-bold text-warning">{orderStats.pending.toLocaleString()}</div>
        </div>
        <div className="bg-secondary rounded-lg border border-border p-4">
          <div className="text-textSecondary text-sm">已退款</div>
          <div className="text-2xl font-bold text-error">{orderStats.refunded.toLocaleString()}</div>
        </div>
        <div className="bg-secondary rounded-lg border border-border p-4">
          <div className="text-textSecondary text-sm">已取消</div>
          <div className="text-2xl font-bold text-textSecondary">{orderStats.cancelled.toLocaleString()}</div>
        </div>
      </div>

      {/* 订单列表 */}
      <Card title="订单明细">
        {/* 筛选器 */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="搜索订单号/商品/客户"
            value={filter.search}
            onChange={(e) => {
              setFilter({ ...filter, search: e.target.value })
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
          />
          <select
            value={filter.status}
            onChange={(e) => {
              setFilter({ ...filter, status: e.target.value })
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s === '全部' ? '' : s}>{s}</option>)}
          </select>
          <select
            value={filter.platform}
            onChange={(e) => {
              setFilter({ ...filter, platform: e.target.value })
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            {PLATFORMS.map(p => <option key={p} value={p === '全部' ? '' : p}>{p}</option>)}
          </select>
          <span className="text-sm text-textSecondary self-center">
            共 {filteredOrders.length} 条订单
          </span>
        </div>

        <Table columns={columns} data={paginatedOrders} />

        {/* 分页 */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-textSecondary">
            第 {currentPage}/{totalPages || 1} 页
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
    </div>
  )
}
