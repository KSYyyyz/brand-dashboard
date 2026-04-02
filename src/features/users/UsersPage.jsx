import { useState, useMemo } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Table from '../../components/ui/Table'
import PieChartComponent from '../../components/charts/PieChart'
import BarChartComponent from '../../components/charts/BarChart'
import RefreshButton from '../../components/ui/RefreshButton'
import { useData } from '../../context/DataContext'

const MEMBER_LEVELS = ['龙涎', '沉香', '檀木', '麝香', '非会员']
const GENDERS = ['男', '女']
const OCCUPATIONS = ['企业主', '高管', '白领', '自由职业', '公务员', '医生', '律师', '设计师']

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function UsersPage() {
  const { loading, transactions, stats } = useData()
  const [filter, setFilter] = useState({ level: '', city: '', search: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const memberStats = stats?.member_stats || []

  // 从交易数据推导用户列表
  const users = useMemo(() => {
    const memberMap = {}
    MEMBER_LEVELS.forEach(level => {
      memberMap[level] = { level, totalAmount: 0, orderCount: 0, cities: [] }
    })

    transactions.forEach(tx => {
      if (tx.status !== '已完成') return
      const level = tx.member_level || '非会员'
      if (!memberMap[level]) memberMap[level] = { level, totalAmount: 0, orderCount: 0, cities: [] }

      memberMap[level].totalAmount += tx.final_amount
      memberMap[level].orderCount += 1
      if (!memberMap[level].cities.includes(tx.city)) {
        memberMap[level].cities.push(tx.city)
      }
    })

    return MEMBER_LEVELS.flatMap(level => {
      const data = memberMap[level]
      const count = data.orderCount > 0 ? Math.max(1, Math.floor(data.orderCount / 3)) : 0
      return Array.from({ length: count }, (_, i) => ({
        id: `${level}-${i}`,
        vip_no: level !== '非会员' ? `VIP${String(10000 + Math.floor(Math.random() * 9999)).slice(1)}` : null,
        name: `${level}会员${i + 1}`,
        gender: randomPick(GENDERS),
        phone: `138${String(Math.floor(Math.random() * 1e8)).padStart(8, '0')}`,
        level,
        province: data.cities[0] || '上海',
        city: data.cities[0] || '上海',
        occupation: randomPick(OCCUPATIONS),
        birthday: `199${Math.floor(Math.random() * 9)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        total_amount: count > 0 ? Math.floor(data.totalAmount / count) : 0,
        order_count: count > 0 ? Math.floor(data.orderCount / count) : 0
      }))
    })
  }, [transactions])

  // 用户分层统计
  const userStats = useMemo(() => {
    const statsData = MEMBER_LEVELS.map(level => ({
      name: level,
      value: memberStats.find(m => m.level === level)?.orders || users.filter(u => u.level === level).length
    }))

    const nonMemberOrders = memberStats.find(m => m.level === '非会员')?.orders || 0
    const user分层 = [
      { name: '潜客(非会员)', value: nonMemberOrders },
      { name: '龙涎客户', value: memberStats.find(m => m.level === '龙涎')?.orders || 0 },
      { name: '沉香客户', value: memberStats.find(m => m.level === '沉香')?.orders || 0 },
      { name: '檀木客户', value: memberStats.find(m => m.level === '檀木')?.orders || 0 },
      { name: '麝香客户', value: memberStats.find(m => m.level === '麝香')?.orders || 0 }
    ]

    return { stats: statsData, user分层 }
  }, [users, memberStats])

  // 城市分布
  const cityStats = useMemo(() => {
    const cityMap = {}
    users.forEach(u => {
      if (u && u.city) {
        cityMap[u.city] = (cityMap[u.city] || 0) + 1
      }
    })
    return Object.entries(cityMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [users])

  // 筛选后的用户
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (!user) return false
      if (filter.level && user.level !== filter.level) return false
      if (filter.city && user.city !== filter.city) return false
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
    { key: 'gender', title: '性别' },
    { key: 'phone', title: '手机号' },
    { key: 'level', title: '等级', render: (v) => <Badge variant="accent">{v || '-'}</Badge> },
    { key: 'occupation', title: '职业' },
    { key: 'city', title: '城市' },
    { key: 'order_count', title: '订单数' },
    { key: 'total_amount', title: '累计消费', render: (v) => `¥${(v || 0).toLocaleString()}` }
  ]

  if (loading && transactions.length === 0) {
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">用户画像</h1>
        <RefreshButton />
      </div>

      {/* 用户分层 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="会员等级分布">
          <PieChartComponent data={userStats.stats} nameKey="name" dataKey="value" height={280} />
        </Card>
        <Card title="用户分层模型">
          <div className="space-y-4">
            {userStats.user分层.map(item => {
              const totalOrders = userStats.user分层.reduce((sum, i) => sum + i.value, 0)
              const percent = totalOrders > 0 ? Math.round(item.value / totalOrders * 100) : 0
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-textSecondary">{item.value}单 ({percent}%)</span>
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
      <Card title="TOP10城市分布">
        <BarChartComponent data={cityStats} nameKey="name" dataKey="value" height={250} />
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
            value={filter.city}
            onChange={(e) => {
              setFilter({ ...filter, city: e.target.value })
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            <option value="">全部城市</option>
            {[...new Set(users.map(u => u.city).filter(Boolean))].map(p => <option key={p} value={p}>{p}</option>)}
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
