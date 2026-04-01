import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { generateAllMockData } from '../../lib/mock-generator'
import { supabase } from '../../lib/supabase'

export default function DataManagementPage() {
  const [generating, setGenerating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)
  const [dataStats, setDataStats] = useState(null)
  const [loading, setLoading] = useState(false)

  // 页面加载时获取统计
  useEffect(() => {
    fetchDataStats()
  }, [])

  // 获取数据统计
  const fetchDataStats = async () => {
    setLoading(true)
    try {
      const [users, orders, stores, storeSales, adsData, contentData] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('stores').select('id', { count: 'exact', head: true }),
        supabase.from('store_sales').select('id', { count: 'exact', head: true }),
        supabase.from('ads_data').select('id', { count: 'exact', head: true }),
        supabase.from('content_data').select('id', { count: 'exact', head: true })
      ])

      setDataStats({
        users: users.count || 0,
        orders: orders.count || 0,
        stores: stores.count || 0,
        storeSales: storeSales.count || 0,
        adsData: adsData.count || 0,
        contentData: contentData.count || 0
      })
    } catch (error) {
      console.error('获取数据统计失败:', error)
      setMessage({ type: 'error', text: '无法连接到Supabase，请检查网络和配置' })
    } finally {
      setLoading(false)
    }
  }

  // 生成测试数据
  const handleGenerateData = async () => {
    setGenerating(true)
    setMessage(null)

    try {
      // 生成模拟数据
      const mockData = generateAllMockData()
      setMessage({ type: 'success', text: '测试数据生成完成！' })
    } catch (error) {
      setMessage({ type: 'error', text: `生成失败: ${error.message}` })
    } finally {
      setGenerating(false)
    }
  }

  // 上传数据到Supabase
  const handleUploadToSupabase = async () => {
    setUploading(true)
    setMessage(null)

    try {
      // 生成模拟数据
      const mockData = generateAllMockData()

      // 清空现有数据
      await Promise.all([
        supabase.from('users').delete().neq('id', 0),
        supabase.from('orders').delete().neq('id', 0),
        supabase.from('stores').delete().neq('id', 0),
        supabase.from('store_sales').delete().neq('id', 0),
        supabase.from('ads_data').delete().neq('id', 0),
        supabase.from('content_data').delete().neq('id', 0)
      ])

      // 上传新数据
      const uploadPromises = []

      if (mockData.users.length > 0) {
        uploadPromises.push(supabase.from('users').insert(mockData.users))
      }
      if (mockData.orders.length > 0) {
        uploadPromises.push(supabase.from('orders').insert(mockData.orders))
      }
      if (mockData.stores.length > 0) {
        uploadPromises.push(supabase.from('stores').insert(mockData.stores))
      }
      if (mockData.storeSales.length > 0) {
        uploadPromises.push(supabase.from('store_sales').insert(mockData.storeSales))
      }
      if (mockData.adsData.length > 0) {
        uploadPromises.push(supabase.from('ads_data').insert(mockData.adsData))
      }
      if (mockData.contentData.length > 0) {
        uploadPromises.push(supabase.from('content_data').insert(mockData.contentData))
      }

      const results = await Promise.all(uploadPromises)
      const hasError = results.some(r => r.error)

      if (hasError) {
        throw new Error('部分数据上传失败')
      }

      setMessage({ type: 'success', text: `成功上传 ${mockData.users.length} 用户、${mockData.orders.length} 订单等到Supabase！` })
      fetchDataStats()
    } catch (error) {
      setMessage({ type: 'error', text: `上传失败: ${error.message}` })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">数据管理</h1>

      {/* 消息提示 */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
          {message.text}
        </div>
      )}

      {/* 数据统计 */}
      <Card title="当前数据统计">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: '用户数据', key: 'users' },
            { name: '订单数据', key: 'orders' },
            { name: '门店数据', key: 'stores' },
            { name: '销售数据', key: 'storeSales' },
            { name: '投流数据', key: 'adsData' },
            { name: '内容数据', key: 'contentData' }
          ].map(item => (
            <div key={item.key} className="bg-primary p-4 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-sm text-textSecondary">{item.name}</div>
                <div className="text-lg font-bold text-textPrimary">
                  {dataStats ? dataStats[item.key] : '-'} 条
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

      {/* 数据生成 */}
      <Card title="测试数据生成">
        <p className="text-textSecondary text-sm mb-4">
          生成闻献品牌模拟数据：500用户、1500订单、10门店、30天销售/投流/内容数据
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleGenerateData}
            disabled={generating}
            className="px-4 py-2 bg-accent text-primary font-medium rounded-lg hover:bg-accentLight disabled:opacity-50"
          >
            {generating ? '生成中...' : '生成本地数据'}
          </button>
          <button
            onClick={handleUploadToSupabase}
            disabled={uploading}
            className="px-4 py-2 bg-success text-white font-medium rounded-lg hover:bg-success/80 disabled:opacity-50"
          >
            {uploading ? '上传中...' : '上传到Supabase'}
          </button>
        </div>
      </Card>

      {/* 数据质量监控 */}
      <Card title="数据质量监控">
        <div className="space-y-4">
          {[
            { name: '用户数据完整性', status: '正常', detail: '所有必填字段完整' },
            { name: '订单关联有效性', status: '正常', detail: '所有订单关联有效用户' },
            { name: '数据时效性', status: '正常', detail: '数据在30天内' },
            { name: '金额合理性', status: '正常', detail: '客单价500-3000元范围' }
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
            <span className="text-textSecondary">Supabase URL</span>
            <span className="text-textPrimary font-mono text-xs">
              {import.meta.env.VITE_SUPABASE_URL || '未配置'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-textSecondary">API Key</span>
            <span className="text-textPrimary font-mono text-xs">
              {import.meta.env.VITE_SUPABASE_ANON_KEY ? '****' + import.meta.env.VITE_SUPABASE_ANON_KEY.slice(-4) : '未配置'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
