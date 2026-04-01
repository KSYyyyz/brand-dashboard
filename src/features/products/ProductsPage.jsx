import { useState, useMemo } from 'react'
import Card from '../../components/ui/Card'
import MetricCard from '../../components/ui/MetricCard'
import Badge from '../../components/ui/Badge'
import Table from '../../components/ui/Table'
import BarChartComponent from '../../components/charts/BarChart'

// 闻献品牌真实商品数据
const PRODUCTS = [
  { id: 1, name: '瑶宫浓香水', category: '浓香水', price: 2980, stock: 45, sales: 156, collection: '第一季' },
  { id: 2, name: '兰汁浓香水', category: '浓香水', price: 2680, stock: 38, sales: 112, collection: '第一季' },
  { id: 3, name: '韭梦浓香水', category: '浓香水', price: 2680, stock: 52, sales: 98, collection: '第一季' },
  { id: 4, name: '鸣眼浓香水', category: '浓香水', price: 2880, stock: 28, sales: 87, collection: '第一季' },
  { id: 5, name: '斗梅浓香水', category: '浓香水', price: 2880, stock: 35, sales: 76, collection: '第一季' },
  { id: 6, name: '破照浓香水', category: '浓香水', price: 2680, stock: 42, sales: 65, collection: '第一季' },
  { id: 7, name: '喜复浓香水', category: '浓香水', price: 2480, stock: 58, sales: 143, collection: '第一季' },
  { id: 8, name: '满庭芳淡香水', category: '淡香水', price: 1680, stock: 72, sales: 198, collection: '第一季' },
  { id: 9, name: '方寸记忆香薰蜡烛', category: '香薰蜡烛', price: 480, stock: 95, sales: 67, collection: '第二季' },
  { id: 10, name: '少年与花身体乳', category: '身体护理', price: 380, stock: 120, sales: 89, collection: '第二季' },
  { id: 11, name: '少年与海淡香水', category: '淡香水', price: 1480, stock: 65, sales: 134, collection: '第二季' },
  { id: 12, name: '金色眼泪浓香水', category: '浓香水', price: 3280, stock: 22, sales: 45, collection: '节日限定' }
]

const COLLECTIONS = ['全部', '第一季', '第二季', '节日限定']
const CATEGORIES = ['全部', '浓香水', '淡香水', '香薰蜡烛', '身体护理']

export default function ProductsPage() {
  const [loading, setLoading] = useState(true)
  const [selectedCollection, setSelectedCollection] = useState('全部')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // 模拟加载
  useState(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  })

  // 筛选后的商品
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      if (selectedCollection !== '全部' && p.collection !== selectedCollection) return false
      if (selectedCategory !== '全部' && p.category !== selectedCategory) return false
      if (searchText && !p.name.toLowerCase().includes(searchText.toLowerCase())) return false
      return true
    })
  }, [selectedCollection, selectedCategory, searchText])

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, currentPage])

  const totalPages = Math.ceil(filteredProducts.length / pageSize)

  // 统计数据
  const stats = useMemo(() => {
    const totalSales = PRODUCTS.reduce((sum, p) => sum + p.sales, 0)
    const totalRevenue = PRODUCTS.reduce((sum, p) => sum + p.sales * p.price, 0)
    const avgPrice = PRODUCTS.reduce((sum, p) => sum + p.price, 0) / PRODUCTS.length
    const lowStock = PRODUCTS.filter(p => p.stock < 30).length
    return { totalSales, totalRevenue, avgPrice, lowStock }
  }, [])

  // 商品销量排行
  const salesRanking = useMemo(() => {
    return [...PRODUCTS]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map(p => ({ name: p.name.slice(0, 6), value: p.sales }))
  }, [])

  // 商品分类销量
  const categorySales = useMemo(() => {
    const map = {}
    PRODUCTS.forEach(p => {
      map[p.category] = (map[p.category] || 0) + p.sales
    })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [])

  const columns = [
    { key: 'id', title: '编号', render: (v) => <span className="text-textSecondary">#{String(v).padStart(3, '0')}</span> },
    { key: 'name', title: '商品名称', render: (v) => <span className="font-medium">{v}</span> },
    { key: 'category', title: '分类', render: (v) => <Badge variant="default">{v}</Badge> },
    { key: 'collection', title: '系列' },
    { key: 'price', title: '单价', render: (v) => `¥${v.toLocaleString()}` },
    { key: 'stock', title: '库存', render: (v) => (
      <span className={v < 30 ? 'text-error' : 'text-textPrimary'}>{v}</span>
    )},
    { key: 'sales', title: '销量' },
    { key: 'revenue', title: '销售额', render: (_, row) => `¥${(row.sales * row.price).toLocaleString()}` }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">商品管理</h1>
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-secondary rounded-lg animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">商品管理</h1>

      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="商品种类" value={PRODUCTS.length} />
        <MetricCard title="总销量" value={stats.totalSales} />
        <MetricCard title="总销售额" value={`¥${(stats.totalRevenue / 10000).toFixed(0)}万`} />
        <MetricCard title="低库存商品" value={stats.lowStock} />
      </div>

      {/* 销售分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="商品销量排行TOP5">
          <BarChartComponent data={salesRanking} nameKey="name" dataKey="value" height={250} />
        </Card>
        <Card title="分类销量分布">
          <BarChartComponent data={categorySales} nameKey="name" dataKey="value" height={250} />
        </Card>
      </div>

      {/* 商品列表 */}
      <Card title="商品列表">
        {/* 筛选器 */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="搜索商品名称"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value)
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
          />
          <select
            value={selectedCollection}
            onChange={(e) => {
              setSelectedCollection(e.target.value)
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            {COLLECTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="text-sm text-textSecondary self-center">
            共 {filteredProducts.length} 件商品
          </span>
        </div>

        <Table columns={columns} data={paginatedProducts} />

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

      {/* 库存预警 */}
      {stats.lowStock > 0 && (
        <Card title="库存预警">
          <div className="flex flex-wrap gap-2">
            {PRODUCTS.filter(p => p.stock < 30).map(p => (
              <div key={p.id} className="flex items-center gap-2 bg-error/10 px-3 py-2 rounded-lg">
                <span className="text-error font-medium">{p.name}</span>
                <Badge variant="error">库存 {p.stock}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
