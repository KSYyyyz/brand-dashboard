import { useState, useEffect, useMemo } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Table from '../../components/ui/Table'
import PieChartComponent from '../../components/charts/PieChart'
import BarChartComponent from '../../components/charts/BarChart'
import { generateAllMockData } from '../../lib/mock-generator'

const MEMBER_LEVELS = ['龙涎', '沉香', '檀木', '麝香', '非会员']

export default function UsersPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState({ level: '', province: '', search: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const mockData = generateAllMockData()
        setUsers(mockData.users || [])
        setLoading(false)
      } catch (err) {
        console.error('用户数据加载失败:', err)
        setError(err.message)
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // 用户分层统计
  const userStats = useMemo(() => {
    const userList = users || []
    const stats = MEMBER_LEVELS.map(level => ({
      name: level,
      value: userList.filter(u => u && u.level === level).length
    }))

    const user分层 = [
      { name: '潜客', value: userList.filter(u => u && u.order_count === 0).length },
      { name: '首单客', value: userList.filter(u => u && u.order_count === 1).length },
      { name: '复购客', value: userList.filter(u => u && u.order_count >= 2 && u.order_count < 5).length },
      { name: '忠诚客', value: userList.filter(u => u && u.order_count >= 5).length }
    ]

    return { stats, user分层 }
  }, [users])

  // 省份分布
  const provinceStats = useMemo(() => {
    const provinceMap = {}
    ;(users || []).forEach(u => {
      if (u && u.province) {
        provinceMap[u.province] = (provinceMap[u.province] || 0) + 1
      }
    })
    return Object.entries(provinceMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [users])

  // 筛选后的用户
  const filteredUsers = useMemo(() => {
    return (users || []).filter(user => {
      if (!user) return false
      if (filter.level && user.level !== filter.level) return false
      if (filter.province && user.province !== filter.province) return false
      if (filter.search) {
        const search = filter.search.toLowerCase()
        const name = (user.name || '').toLowerCase()
        const phone = user.phone || ''
        const vipNo = (user.vip_no || '').toLowerCase()
        if (!name.includes(search) && !phone.includes(search) && !vipNo.includes(search)) {
          return false
        }
      }
      return true
    })
  }, [users, filter])

  // 分页
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, currentPage])

  const totalPages = Math.ceil(filteredUsers.length / pageSize)

  const columns = [
    { key: 'vip_no', title: '会员编号', render: (v) => <span className="text-accent">{v || '-'}</span> },
    { key: 'name', title: '姓名' },
    { key: 'phone', title: '手机号' },
    { key: 'level', title: '等级', render: (v) => <Badge variant="accent">{v || '-'}</Badge> },
    { key: 'province', title: '省份' },
    { key: 'order_count', title: '订单数' },
    { key: 'total_amount', title: '累计消费', render: (v) => `¥${(v || 0).toLocaleString()}` }
  ]

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">用户画像</h1>
        <div className="grid grid-cols-2 gap-6">
          <div className="h-96 bg-secondary rounded-lg animate-pulse" />
          <div className="h-96 bg-secondary rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">用户画像</h1>
        <div className="p-4 bg-error/20 text-error rounded-lg">
          数据加载失败: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">用户画像</h1>

      {/* 用户分层 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="会员等级分布">
          <PieChartComponent data={userStats.stats} nameKey="name" dataKey="value" height={280} />
        </Card>
        <Card title="用户分层模型">
          <div className="space-y-4">
            {userStats.user分层.map(item => {
              const percent = users.length > 0 ? Math.round(item.value / users.length * 100) : 0
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-textSecondary">{item.value}人 ({percent}%)</span>
                  </div>
                  <div className="h-2 bg-primary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* 地域分布 */}
      <Card title="TOP10省份分布">
        <BarChartComponent data={provinceStats} nameKey="name" dataKey="value" height={250} />
      </Card>

      {/* 用户明细 */}
      <Card title="用户明细">
        {/* 筛选器 */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="搜索姓名/手机/会员号"
            value={filter.search}
            onChange={(e) => {
              setFilter({ ...filter, search: e.target.value })
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
          />
          <select
            value={filter.level}
            onChange={(e) => {
              setFilter({ ...filter, level: e.target.value })
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            <option value="">全部等级</option>
            {MEMBER_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select
            value={filter.province}
            onChange={(e) => {
              setFilter({ ...filter, province: e.target.value })
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            <option value="">全部省份</option>
            {[...new Set((users || []).map(u => u.province).filter(Boolean))].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <Table columns={columns} data={paginatedUsers} />

        {/* 分页 */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-textSecondary">
            共 {filteredUsers.length} 条，第 {currentPage}/{totalPages || 1} 页
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
