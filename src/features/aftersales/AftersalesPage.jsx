import { useState, useMemo } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Table from '../../components/ui/Table'
import AftersaleDetailModal from '../../components/ui/AftersaleDetailModal'
import RefreshButton from '../../components/ui/RefreshButton'
import { useData } from '../../context/DataContext'

const AS_TYPES = ['全部', '退货退款', '换货', '投诉', '咨询', '退款']
const AS_STATUS = ['全部', '处理中', '已完成', '已拒绝']

const AS_REASONS = [
  '商品与描述不符',
  '收到商品破损',
  '尺码不合适',
  '颜色不喜欢',
  '重复下单',
  '价格问题',
  '物流问题',
  '产品过敏',
  '其他'
]

const MEMBER_LEVELS = ['龙涎', '沉香', '檀木', '麝香', '非会员']

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function AftersalesPage() {
  const { loading, transactions, lastRefresh } = useData()
  const [filter, setFilter] = useState({ type: '', status: '', search: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAftersale, setSelectedAftersale] = useState(null)
  const pageSize = 10

  // 从退款订单和随机抽样生成售后数据
  const aftersalesList = useMemo(() => {
    const list = []

    // 从已退款订单生成售后记录
    transactions.filter(tx => tx.status === '已退款').forEach(tx => {
      list.push({
        id: `AS-${tx.order_no}`,
        order_no: tx.order_no,
        customer_name: tx.member_name || `客户${tx.member_level?.slice(-2) || ''}`,
        phone: `138${String(Math.floor(Math.random() * 1e8)).padStart(8, '0')}`,
        member_level: tx.member_level || '非会员',
        product_name: tx.product_name,
        order_date: tx.order_time,
        order_amount: tx.final_amount,
        as_type: '退货退款',
        as_reason: randomPick(AS_REASONS),
        as_content: `申请退货退款，订单金额¥${tx.final_amount?.toLocaleString()}`,
        as_date: new Date(new Date(tx.order_time).getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        as_status: '已完成',
        refund_amount: tx.final_amount,
        handler: randomPick(['张伟', '李娜', '王芳', '刘洋'])
      })
    })

    // 随机生成一些其他售后记录
    const sampleTx = transactions.filter(tx => tx.status === '已完成').slice(0, 50)
    sampleTx.forEach((tx, i) => {
      if (Math.random() > 0.7) {
        const type = randomPick(AS_TYPES.slice(1))
        const isCompleted = Math.random() > 0.3
        list.push({
          id: `AS-${String(10000 + i)}`,
          order_no: tx.order_no,
          customer_name: tx.member_name || `客户${tx.member_level?.slice(-2) || ''}`,
          phone: `138${String(Math.floor(Math.random() * 1e8)).padStart(8, '0')}`,
          member_level: tx.member_level || '非会员',
          product_name: tx.product_name,
          order_date: tx.order_time,
          order_amount: tx.final_amount,
          as_type: type,
          as_reason: randomPick(AS_REASONS),
          as_content: type === '咨询' ? '咨询产品使用方法' : `反馈：${randomPick(AS_REASONS)}`,
          as_date: new Date(new Date(tx.order_time).getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
          as_status: isCompleted ? '已完成' : '处理中',
          refund_amount: isCompleted && (type === '退货退款' || type === '退款') ? Math.round(tx.final_amount * 0.8) : 0,
          handler: randomPick(['张伟', '李娜', '王芳', '刘洋'])
        })
      }
    })

    return list.sort((a, b) => new Date(b.as_date) - new Date(a.as_date))
  }, [transactions])

  // 统计
  const asStats = useMemo(() => ({
    total: aftersalesList.length,
    processing: aftersalesList.filter(a => a.as_status === '处理中').length,
    completed: aftersalesList.filter(a => a.as_status === '已完成').length,
    refused: aftersalesList.filter(a => a.as_status === '已拒绝').length,
    totalRefund: aftersalesList.reduce((sum, a) => sum + (a.refund_amount || 0), 0)
  }), [aftersalesList])

  // 筛选
  const filteredList = useMemo(() => {
    return aftersalesList.filter(a => {
      if (filter.type && a.as_type !== filter.type) return false
      if (filter.status && a.as_status !== filter.status) return false
      if (filter.search) {
        const search = filter.search.toLowerCase()
        if (!a.order_no?.toLowerCase().includes(search) &&
            !a.customer_name?.toLowerCase().includes(search) &&
            !a.phone?.includes(search)) {
          return false
        }
      }
      return true
    })
  }, [aftersalesList, filter])

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredList.slice(start, start + pageSize)
  }, [filteredList, currentPage])

  const totalPages = Math.ceil(filteredList.length / pageSize)

  const columns = [
    { key: 'id', title: '售后编号', render: (v) => <span className="text-xs font-mono text-accent">{v}</span> },
    { key: 'customer_name', title: '客户姓名' },
    { key: 'member_level', title: '会员等级', render: (v) => <Badge variant="default">{v}</Badge> },
    { key: 'phone', title: '电话', render: (v) => <span className="text-xs">{v}</span> },
    { key: 'product_name', title: '商品名称' },
    { key: 'order_date', title: '订单日期', render: (v) => v ? new Date(v).toLocaleDateString() : '-' },
    { key: 'as_type', title: '售后类型', render: (v) => <Badge variant="default">{v}</Badge> },
    { key: 'as_date', title: '售后申请日期', render: (v) => v ? new Date(v).toLocaleDateString() : '-' },
    { key: 'as_status', title: '状态', render: (v) => {
      const variants = { '已完成': 'success', '处理中': 'warning', '已拒绝': 'error' }
      return <Badge variant={variants[v] || 'default'}>{v}</Badge>
    }},
    { key: 'refund_amount', title: '退款金额', render: (v) => v > 0 ? `¥${v.toLocaleString()}` : '-' }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">售后管理</h1>
        <div className="flex items-center gap-4">
          {lastRefresh && (
            <span className="text-sm text-textSecondary">
              更新: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <RefreshButton />
        </div>
      </div>

      {/* 售后统计 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-secondary rounded-lg border border-border p-4">
          <div className="text-textSecondary text-sm">售后总数</div>
          <div className="text-2xl font-bold">{asStats.total.toLocaleString()}</div>
        </div>
        <div className="bg-secondary rounded-lg border border-border p-4">
          <div className="text-textSecondary text-sm">处理中</div>
          <div className="text-2xl font-bold text-warning">{asStats.processing.toLocaleString()}</div>
        </div>
        <div className="bg-secondary rounded-lg border border-border p-4">
          <div className="text-textSecondary text-sm">已完成</div>
          <div className="text-2xl font-bold text-success">{asStats.completed.toLocaleString()}</div>
        </div>
        <div className="bg-secondary rounded-lg border border-border p-4">
          <div className="text-textSecondary text-sm">已拒绝</div>
          <div className="text-2xl font-bold text-error">{asStats.refused.toLocaleString()}</div>
        </div>
        <div className="bg-secondary rounded-lg border border-border p-4">
          <div className="text-textSecondary text-sm">退款总额</div>
          <div className="text-2xl font-bold">¥{(asStats.totalRefund / 10000).toFixed(1)}万</div>
        </div>
      </div>

      {/* 售后列表 */}
      <Card title="售后明细">
        {/* 筛选器 */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="搜索编号/客户/电话"
            value={filter.search}
            onChange={(e) => {
              setFilter({ ...filter, search: e.target.value })
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
          />
          <select
            value={filter.type}
            onChange={(e) => {
              setFilter({ ...filter, type: e.target.value })
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            {AS_TYPES.map(t => <option key={t} value={t === '全部' ? '' : t}>{t}</option>)}
          </select>
          <select
            value={filter.status}
            onChange={(e) => {
              setFilter({ ...filter, status: e.target.value })
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            {AS_STATUS.map(s => <option key={s} value={s === '全部' ? '' : s}>{s}</option>)}
          </select>
          <span className="text-sm text-textSecondary self-center">
            共 {filteredList.length} 条记录
          </span>
        </div>

        <Table columns={columns} data={paginatedList} onRowClick={setSelectedAftersale} />

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

      {/* 售后详情弹窗 */}
      {selectedAftersale && (
        <AftersaleDetailModal
          aftersale={selectedAftersale}
          onClose={() => setSelectedAftersale(null)}
        />
      )}
    </div>
  )
}
