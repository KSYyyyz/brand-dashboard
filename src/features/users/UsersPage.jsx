import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Table from '../../components/ui/Table'
import { generateAllMockData } from '../../lib/mock-generator'

const MEMBER_LEVELS = ['龙涎', '沉香', '檀木', '麝香', '非会员']

export default function UsersPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)

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

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">用户画像</h1>
        <div className="text-textSecondary">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">用户画像</h1>
        <div className="p-4 bg-error/20 text-error rounded-lg">
          数据加载失败: {error}
        </div>
      </div>
    )
  }

  // 简单的数据验证
  const validUsers = (users || []).filter(u => u && u.id)
  const totalUsers = validUsers.length

  const columns = [
    { key: 'vip_no', title: '会员编号', render: (v) => <span className="text-accent">{v || '-'}</span> },
    { key: 'name', title: '姓名' },
    { key: 'phone', title: '手机号' },
    { key: 'level', title: '等级', render: (v) => <Badge variant="accent">{v || '-'}</Badge> },
    { key: 'province', title: '省份' },
    { key: 'order_count', title: '订单数' },
    { key: 'total_amount', title: '累计消费', render: (v) => `¥${(v || 0).toLocaleString()}` }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">用户画像</h1>

      <Card title="用户统计">
        <div className="text-lg">
          共 {totalUsers} 位用户
        </div>
      </Card>

      <Card title="用户明细">
        <Table columns={columns} data={validUsers.slice(0, 10)} />
      </Card>
    </div>
  )
}
