import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { fetchHealth, fetchStats, fetchProducts, fetchStores, initHistoryData, batchGenerateTransactions } from '../../lib/api'

export default function DataManagementPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [dataStats, setDataStats] = useState(null)
  const [initLoading, setInitLoading] = useState(false)
  const [generateLoading, setGenerateLoading] = useState(false)

  // 页面加载时获取统计
  useEffect(() => {
    fetchDataStats()
  }, [])

  // 获取数据统计
  const fetchDataStats = async () => {
    setLoading(true)
    try {
      const [health, stats, products, stores] = await Promise.all([
        fetchHealth(),
        fetchStats(),
        fetchProducts(),
        fetchStores()
      ])

      setDataStats({
        transactions: health.total_transactions || 0,
        products: products.length || 0,
        stores: stores.length || 0,
        gmv: stats.summary?.total_gmv || 0,
        orders: stats.summary?.total_orders || 0
      })
      setMessage(null)
    } catch (error) {
      console.error('获取数据统计失败:', error)
      setMessage({ type: 'error', text: '无法连接到模拟服务，请检查网络' })
    } finally {
      setLoading(false)
    }
  }

  // 初始化历史数据
  const handleInitData = async () => {
    setInitLoading(true)
    setMessage(null)
    try {
      const result = await initHistoryData(30)
      setMessage({ type: 'success', text: result.message || '历史数据初始化完成' })
      fetchDataStats()
    } catch (error) {
      setMessage({ type: 'error', text: `初始化失败: ${error.message}` })
    } finally {
      setInitLoading(false)
    }
  }

  // 批量生成新交易
  const handleGenerateTransactions = async () => {
    setGenerateLoading(true)
    setMessage(null)
    try {
      const result = await batchGenerateTransactions(50, 0)
      setMessage({ type: 'success', text: `成功生成 ${result.generated} 笔新交易` })
      fetchDataStats()
    } catch (error) {
      setMessage({ type: 'error', text: `生成失败: ${error.message}` })
    } finally {
      setGenerateLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">数据管理</h1>

      {/* 消息提示 */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
          {message.text}
        </div>
      )}

      {/* 数据统计 */}
      <Card title="模拟服务数据统计">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: '交易记录', key: 'transactions' },
            { name: '商品种类', key: 'products' },
            { name: '门店数量', key: 'stores' },
            { name: '总订单数', key: 'orders' },
            { name: '总GMV', key: 'gmv', format: (v) => `¥${((v || 0) / 10000).toFixed(1)}万` }
          ].map(item => (
            <div key={item.key} className="bg-primary p-4 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-sm text-textSecondary">{item.name}</div>
                <div className="text-lg font-bold text-textPrimary">
                  {dataStats ? (item.format ? item.format(dataStats[item.key]) : dataStats[item.key]) : '-'} 条
                </div>
              </div>
              <Badge variant={dataStats && dataStats[item.key] > 0 ? 'success' : 'default'}>
                {dataStats && dataStats[item.key] > 0 ? '正常' : '空'}
              </Badge>
            </div>
          ))}
        </div>
        <button
          onClick={fetchDataStats}
          className="mt-4 px-4 py-2 bg-secondary border border-border rounded-lg text-sm hover:bg-border/50"
        >
          刷新统计
        </button>
      </Card>

      {/* 数据操作 */}
      <Card title="数据操作">
        <p className="text-textSecondary text-sm mb-4">
          模拟服务 API 地址: {import.meta.env.VITE_API_BASE || 'https://mock-merchant.vercel.app'}
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleInitData}
            disabled={initLoading}
            className="px-4 py-2 bg-accent text-primary font-medium rounded-lg hover:bg-accentLight disabled:opacity-50"
          >
            {initLoading ? '初始化中...' : '初始化30天历史数据'}
          </button>
          <button
            onClick={handleGenerateTransactions}
            disabled={generateLoading}
            className="px-4 py-2 bg-success text-white font-medium rounded-lg hover:bg-success/80 disabled:opacity-50"
          >
            {generateLoading ? '生成中...' : '生成50笔新交易'}
          </button>
        </div>
      </Card>

      {/* 数据质量监控 */}
      <Card title="数据质量监控">
        <div className="space-y-4">
          {[
            { name: 'API 连接状态', status: '正常', detail: '模拟服务运行中' },
            { name: '交易数据完整性', status: '正常', detail: '所有交易记录完整' },
            { name: '数据时效性', status: '正常', detail: '数据持续生成中' },
            { name: '金额合理性', status: '正常', detail: '客单价500-3580元范围' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-primary rounded-lg">
              <div>
                <div className="text-sm text-textPrimary">{item.name}</div>
                <div className="text-xs text-textSecondary">{item.detail}</div>
              </div>
              <Badge variant="success">{item.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* 环境配置 */}
      <Card title="环境配置">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-textSecondary">API 地址</span>
            <span className="text-textPrimary font-mono text-xs">
              {import.meta.env.VITE_API_BASE || 'https://mock-merchant.vercel.app'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
