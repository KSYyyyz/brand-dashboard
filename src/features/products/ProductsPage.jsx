import { useState, useEffect, useMemo } from 'react'
import Card from '../../components/ui/Card'
import MetricCard from '../../components/ui/MetricCard'
import Badge from '../../components/ui/Badge'
import Table from '../../components/ui/Table'
import BarChartComponent from '../../components/charts/BarChart'
import ProductDetailModal from '../../components/ui/ProductDetailModal'
import { fetchProducts, fetchStats } from '../../lib/api'

// 系列映射
const COLLECTION_MAP = {
  '初熟之物': '第一季', '体物入微': '第一季', '夜漠回声': '第一季', '柔韧荆棘': '第一季',
  '腹语之术': '第一季', '席地而坐': '第一季', '人无完人': '第一季',
  'SIT': '第二季', '羁旅归途': '第二季', '相拥之后': '第二季', '芳草留痕': '第二季',
  '灵光没顶': '第二季', '空无一木': '第二季', '人面兽心': '第二季',
  '羽化仙': '第四季', '仙': '第四季',
  '杉间': '第五季',
  '蛮柚': '第六季',
  '丹沉': '第七季', '赤檀': '第七季', '龙吟': '第七季', '麝语': '第七季', '沉檀龙麝': '第七季',
  '洗发水': '香氛洗护', '护发素': '香氛洗护', '身体乳': '香氛洗护', '护手霜': '香氛洗护', '洗手液': '香氛洗护',
  '银炭': '其他', '电子香薰机': '其他', '车载香氛': '其他'
}

function getCollection(productName) {
  for (const [key, value] of Object.entries(COLLECTION_MAP)) {
    if (productName.includes(key)) return value
  }
  return '其他'
}

const COLLECTIONS = ['全部', '第一季', '第二季', '第四季', '第五季', '第六季', '第七季', '香氛洗护', '其他']
const CATEGORIES = ['全部', '浓香水', '身体护理', '香薰']

export default function ProductsPage() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [productStats, setProductStats] = useState([])
  const [selectedCollection, setSelectedCollection] = useState('全部')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const pageSize = 10

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [productsData, statsData] = await Promise.all([
          fetchProducts(),
          fetchStats()
        ])
        // 合并产品数据和销售统计
        const merged = productsData.map(p => {
          const stat = (statsData.product_stats || []).find(s => s.product_id === p.id)
          return {
            ...p,
            sales: stat?.orders || 0,
            revenue: stat?.gmv || 0,
            collection: getCollection(p.name)
          }
        })
        setProducts(merged)
        setProductStats(statsData.product_stats || [])
      } catch (err) {
        console.error('商品数据加载失败:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // 筛选后的商品
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCollection !== '全部' && p.collection !== selectedCollection) return false
      if (selectedCategory !== '全部' && p.category !== selectedCategory) return false
      if (searchText && !p.name.toLowerCase().includes(searchText.toLowerCase())) return false
      return true
    })
  }, [products, selectedCollection, selectedCategory, searchText])

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, currentPage])

  const totalPages = Math.ceil(filteredProducts.length / pageSize)

  // 统计数据
  const stats = useMemo(() => {
    const totalSales = productStats.reduce((sum, p) => sum + p.orders, 0)
    const totalRevenue = productStats.reduce((sum, p) => sum + p.gmv, 0)
    const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0
    return { totalSales, totalRevenue, avgPrice, lowStock: 0 }
  }, [products, productStats])

  // 商品销量排行
  const salesRanking = useMemo(() => {
    return [...productStats]
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5)
      .map(p => ({ name: p.product_name?.slice(0, 6) || '', value: p.orders }))
  }, [productStats])

  // 商品分类销量
  const categorySales = useMemo(() => {
    const map = {}
    products.forEach(p => {
      const stat = productStats.find(s => s.product_id === p.id)
      const orders = stat?.orders || 0
      map[p.category] = (map[p.category] || 0) + orders
    })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [products, productStats])

  const columns = [
    { key: 'id', title: '编号', render: (v) => <span className="text-textSecondary">#{String(v).padStart(3, '0')}</span> },
    { key: 'name', title: '商品名称', render: (v) => <span className="font-medium">{v}</span> },
    { key: 'category', title: '分类', render: (v) => <Badge variant="default">{v}</Badge> },
    { key: 'collection', title: '系列' },
    { key: 'price', title: '单价', render: (v) => `¥${v.toLocaleString()}` },
    { key: 'sales', title: '销量', render: (v) => v || 0 },
    { key: 'revenue', title: '销售额', render: (_, row) => `¥${((row.revenue || 0)).toLocaleString()}` }
  ]

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">商品管理</h1>
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-secondary rounded-lg animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">商品管理</h1>

      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="商品种类" value={products.length} />
        <MetricCard title="总销量" value={stats.totalSales} />
        <MetricCard title="总销售额" value={`¥${(stats.totalRevenue / 10000).toFixed(0)}万`} />
        <MetricCard title="平均单价" value={`¥${Math.round(stats.avgPrice)}`} />
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

        <Table columns={columns} data={paginatedProducts} onRowClick={setSelectedProduct} />

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

      {/* 商品详情弹窗 */}
      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  )
}
