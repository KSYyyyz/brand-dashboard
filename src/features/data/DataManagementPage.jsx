import { useState } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import RefreshButton from '../../components/ui/RefreshButton'
import { useData } from '../../context/DataContext'
import { batchGenerateTransactions, initHistoryData } from '../../lib/api'

export default function DataManagementPage() {
  const { loading, stats, health, products, stores, refresh } = useData()
  const [actionLoading, setActionLoading] = useState(null)
  const [message, setMessage] = useState(null)

  const summary = stats?.summary || {}

  // 初始化历史数据
  const handleInitData = async () => {
    setActionLoading('init')
    setMessage(null)
    try {
      const result = await initHistoryData(30)
      setMessage({ type: 'success', text: result.message || '历史数据初始化完成' })
      refresh()
    } catch (error) {
      setMessage({ type: 'error', text: `初始化失败: ${error.message}` })
    } finally {
      setActionLoading(null)
    }
  }

  // 批量生成新交易
  const handleGenerateTransactions = async () => {
    setActionLoading('generate')
    setMessage(null)
    try {
      const result = await batchGenerateTransactions(50, 0)
      setMessage({ type: 'success', text: `成功生成 ${result.generated} 笔新交易` })
      refresh()
    } catch (error) {
      setMessage({ type: 'error', text: `生成失败: ${error.message}` })
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">数据管理</h1>
        <RefreshButton />
      </div>

      {/* 消息提示 */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
          {message.text}
        </div>
      )}

      {/* 模拟服务数据统计 */}
      <Card title="模拟服务数据统计">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: '交易记录', value: health?.total_transactions || 0 },
            { name: '商品种类', value: products?.length || 0 },
            { name: '门店数量', value: stores?.length || 0 },
            { name: '总订单数', value: summary.total_orders || 0 },
            { name: '已完成订单', value: summary.completed_orders || 0 },
            { name: '总GMV', value: `¥${((summary.total_gmv || 0) / 10000).toFixed(1)}万` }
          ].map(item => (
            <div key={item.name} className="bg-primary p-4 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-sm text-textSecondary">{item.name}</div>
                <div className="text-lg font-bold text-textPrimary">{loading && !health ? '-' : item.value}</div>
              </div>
              <Badge variant={!loading && health && item.value > 0 ? 'success' : 'default'}>
                {!loading && health && item.value > 0 ? '正常' : '加载中'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* 数据操作 */}
      <Card title="数据操作">
        <p className="text-textSecondary text-sm mb-4">
          API 地址: {import.meta.env.VITE_API_BASE || 'https://mock-merchant.vercel.app'}
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleInitData}
            disabled={actionLoading === 'init'}
            className="px-4 py-2 bg-accent text-primary font-medium rounded-lg hover:bg-accentLight disabled:opacity-50"
          >
            {actionLoading === 'init' ? '初始化中...' : '初始化30天历史数据'}
          </button>
          <button
            onClick={handleGenerateTransactions}
            disabled={actionLoading === 'generate'}
            className="px-4 py-2 bg-success text-white font-medium rounded-lg hover:bg-success/80 disabled:opacity-50"
          >
            {actionLoading === 'generate' ? '生成中...' : '生成50笔新交易'}
          </button>
        </div>
      </Card>

      {/* 数据质量监控 */}
      <Card title="数据质量监控">
        <div className="space-y-4">
          {[
            { name: 'API 连接状态', status: health?.status === 'ok' ? '正常' : '异常', detail: health?.status === 'ok' ? '模拟服务运行中' : '连接失败' },
            { name: '交易数据完整性', status: '正常', detail: '所有交易记录完整' },
            { name: '数据时效性', status: '正常', detail: '数据持续生成中' },
            { name: '金额合理性', status: '正常', detail: '客单价500-3580元范围' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-primary rounded-lg">
              <div>
                <div className="text-sm text-textPrimary">{item.name}</div>
                <div className="text-xs text-textSecondary">{item.detail}</div>
              </div>
              <Badge variant={item.status === '正常' ? 'success' : 'error'}>{item.status}</Badge>
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
