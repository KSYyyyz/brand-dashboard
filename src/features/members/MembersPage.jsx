import { useState, useEffect, useMemo } from 'react'
import Card from '../../components/ui/Card'
import MetricCard from '../../components/ui/MetricCard'
import Badge from '../../components/ui/Badge'
import Table from '../../components/ui/Table'
import PieChartComponent from '../../components/charts/PieChart'
import { generateAllMockData } from '../../lib/mock-generator'

const MEMBER_LEVELS = ['龙涎', '沉香', '檀木', '麝香', '非会员']

export default function MembersPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    setTimeout(() => {
      try {
        const mockData = generateAllMockData()
        setUsers(mockData.users || [])
        setOrders(mockData.orders || [])
        setLoading(false)
      } catch (err) {
        console.error('会员数据加载失败:', err)
        setError(err.message)
        setLoading(false)
      }
    }, 500)
  }, [])

  // 会员等级统计
  const levelStats = useMemo(() => {
    const userList = users || []
    return MEMBER_LEVELS.map(level => ({
      name: level,
      value: userList.filter(u => u && u.level === level).length
    }))
  }, [users])

  // 会员消费等级分布
  const consumptionStats = useMemo(() => {
    const userList = users || []
    return [
      { name: '高消费(>1万)', value: userList.filter(u => u && u.total_amount > 10000).length },
      { name: '中消费(5千-1万)', value: userList.filter(u => u && u.total_amount >= 5000 && u.total_amount <= 10000).length },
      { name: '低消费(<5千)', value: userList.filter(u => u && u.total_amount < 5000).length }
    ]
  }, [users])

  // 会员状态统计
  const statusStats = useMemo(() => {
    const userList = users || []
    const now = new Date()
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)

    const active = userList.filter(u => u && u.last_order_time && new Date(u.last_order_time) > thirtyDaysAgo).length
    const inactive = userList.length - active

    return [
      { name: '活跃会员', value: active },
      { name: '沉默会员', value: inactive }
    ]
  }, [users])

  // 筛选后的会员
  const filteredMembers = useMemo(() => {
    let filtered = (users || []).filter(u => u && u.level)
    if (selectedLevel) {
      filtered = filtered.filter(u => u.level === selectedLevel)
    }
    return filtered.sort((a, b) => b.total_amount - a.total_amount)
  }, [users, selectedLevel])

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredMembers.slice(start, start + pageSize)
  }, [filteredMembers, currentPage])

  const totalPages = Math.ceil(filteredMembers.length / pageSize)

  // 会员等级权益说明
  const levelBenefits = {
    '龙涎': { threshold: '累计消费满10万', discount: '8折', point: '2倍积分', exclusive: '专属顾问服务' },
    '沉香': { threshold: '累计消费满5万', discount: '8.5折', point: '1.5倍积分', exclusive: '新品优先购买' },
    '檀木': { threshold: '累计消费满2万', discount: '9折', point: '1.2倍积分', exclusive: '生日专属礼遇' },
    '麝香': { threshold: '累计消费满5千', discount: '9.5折', point: '1倍积分', exclusive: '会员日活动' },
    '非会员': { threshold: '未消费', discount: '无', point: '无', exclusive: '无' }
  }

  const columns = [
    { key: 'vip_no', title: '会员编号', render: (v) => <span className="text-accent font-mono">{v}</span> },
    { key: 'name', title: '姓名' },
    { key: 'phone', title: '手机号' },
    { key: 'level', title: '等级', render: (v) => (
      <Badge variant={v === '龙涎' ? 'accent' : 'default'}>{v}</Badge>
    )},
    { key: 'total_amount', title: '累计消费', render: (v) => `¥${(v || 0).toLocaleString()}` },
    { key: 'order_count', title: '订单数' },
    { key: 'last_order_time', title: '最近购买', render: (v) => v ? new Date(v).toLocaleDateString() : '-' }
  ]

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">会员管理</h1>
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-secondary rounded-lg animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">会员管理</h1>
        <div className="p-4 bg-error/20 text-error rounded-lg">
          数据加载失败: {error}
        </div>
      </div>
    )
  }

  const totalMembers = users.length
  const activeMembers = statusStats[0].value
  const totalConsumption = users.reduce((sum, u) => sum + (u?.total_amount || 0), 0)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">会员管理</h1>

      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="会员总数" value={totalMembers} />
        <MetricCard title="活跃会员" value={activeMembers} change={`${(activeMembers / totalMembers * 100).toFixed(0)}%`} />
        <MetricCard title="会员总消费" value={`¥${(totalConsumption / 10000).toFixed(0)}万`} />
        <MetricCard title="平均消费" value={`¥${Math.round(totalConsumption / totalMembers)}`} />
      </div>

      {/* 会员分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="会员等级分布">
          <PieChartComponent data={levelStats} nameKey="name" dataKey="value" height={220} />
        </Card>
        <Card title="消费等级分布">
          <PieChartComponent data={consumptionStats} nameKey="name" dataKey="value" height={220} />
        </Card>
        <Card title="活跃度分布">
          <PieChartComponent data={statusStats} nameKey="name" dataKey="value" height={220} />
        </Card>
      </div>

      {/* 会员等级权益 */}
      <Card title="会员等级权益">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-textSecondary">等级</th>
                <th className="text-left py-3 px-4 text-textSecondary">升级门槛</th>
                <th className="text-left py-3 px-4 text-textSecondary">折扣</th>
                <th className="text-left py-3 px-4 text-textSecondary">积分</th>
                <th className="text-left py-3 px-4 text-textSecondary">专属权益</th>
              </tr>
            </thead>
            <tbody>
              {MEMBER_LEVELS.map(level => (
                <tr key={level} className="border-b border-border/50">
                  <td className="py-3 px-4"><Badge variant={level === '龙涎' ? 'accent' : 'default'}>{level}</Badge></td>
                  <td className="py-3 px-4 text-textSecondary">{levelBenefits[level].threshold}</td>
                  <td className="py-3 px-4 text-accent">{levelBenefits[level].discount}</td>
                  <td className="py-3 px-4">{levelBenefits[level].point}</td>
                  <td className="py-3 px-4 text-textSecondary">{levelBenefits[level].exclusive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 会员列表 */}
      <Card title="会员列表">
        {/* 筛选 */}
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={selectedLevel}
            onChange={(e) => {
              setSelectedLevel(e.target.value)
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            <option value="">全部等级</option>
            {MEMBER_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <span className="text-sm text-textSecondary self-center">
            共 {filteredMembers.length} 位会员
          </span>
        </div>

        <Table columns={columns} data={paginatedMembers} />

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
