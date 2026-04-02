import { useState, useEffect, useMemo } from 'react'
import Card from '../../components/ui/Card'
import MetricCard from '../../components/ui/MetricCard'
import TrendChart from '../../components/charts/TrendChart'
import BarChartComponent from '../../components/charts/BarChart'
import DateRangePicker from '../../components/ui/DateRangePicker'
import { useDateRange, getDateRange } from '../../context/DateRangeContext'
import { generateAllMockData } from '../../lib/mock-generator'

export default function OperationsPage() {
  const [loading, setLoading] = useState(true)
  const [allAdsData, setAllAdsData] = useState([])
  const [allContentData, setAllContentData] = useState([])
  const [error, setError] = useState(null)
  const { range } = useDateRange()

  useEffect(() => {
    setTimeout(() => {
      try {
        const mockData = generateAllMockData()
        setAllAdsData(mockData.adsData || [])
        setAllContentData(mockData.contentData || [])
        setLoading(false)
      } catch (err) {
        console.error('运营数据加载失败:', err)
        setError(err.message)
        setLoading(false)
      }
    }, 500)
  }, [])

  // 根据日期范围过滤数据
  const { adsData, contentData } = useMemo(() => {
    const { start, end } = getDateRange(range)

    const filterByDate = (data, dateField) => {
      if (!start) return data
      return data.filter(d => {
        const date = new Date(d[dateField])
        return date >= start && date <= end
      })
    }

    return {
      adsData: filterByDate(allAdsData, 'report_date'),
      contentData: filterByDate(allContentData, 'publish_date')
    }
  }, [allAdsData, allContentData, range])

  // 投流统计
  const adsStats = useMemo(() => {
    const platforms = [...new Set(adsData.map(d => d.platform))]
    return platforms.map(platform => {
      const platformData = adsData.filter(d => d.platform === platform)
      const totalSpend = platformData.reduce((sum, d) => sum + Number(d.spend), 0)
      const totalGMV = platformData.reduce((sum, d) => sum + Number(d.gmv), 0)
      const totalImpressions = platformData.reduce((sum, d) => sum + d.impressions, 0)
      const totalClicks = platformData.reduce((sum, d) => sum + d.clicks, 0)
      const totalConversions = platformData.reduce((sum, d) => sum + d.conversions, 0)
      return {
        platform,
        spend: totalSpend,
        gmv: totalGMV,
        roi: totalSpend > 0 ? totalGMV / totalSpend : 0,
        impressions: totalImpressions,
        clicks: totalClicks,
        conversions: totalConversions,
        ctr: totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : '0',
        cvr: totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(2) : '0'
      }
    })
  }, [adsData])

  // 内容统计
  const contentStats = useMemo(() => {
    const platforms = [...new Set(contentData.map(d => d.platform))]
    return platforms.map(platform => {
      const platformData = contentData.filter(d => d.platform === platform)
      return {
        platform,
        views: platformData.reduce((sum, d) => sum + d.views, 0),
        likes: platformData.reduce((sum, d) => sum + d.likes, 0),
        comments: platformData.reduce((sum, d) => sum + d.comments, 0),
        shares: platformData.reduce((sum, d) => sum + d.shares, 0),
        fansGrowth: platformData.reduce((sum, d) => sum + d.fans_growth, 0)
      }
    })
  }, [contentData])

  // 投流趋势
  const adsTrend = useMemo(() => {
    const grouped = {}
    adsData.forEach(d => {
      const date = d.report_date
      if (!grouped[date]) grouped[date] = 0
      grouped[date] += Number(d.gmv)
    })
    return Object.entries(grouped)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [adsData])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">运营分析</h1>
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-secondary rounded-lg animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">运营分析</h1>
        <div className="p-4 bg-error/20 text-error rounded-lg">
          数据加载失败: {error}
        </div>
      </div>
    )
  }

  const totalSpend = adsStats.reduce((sum, s) => sum + s.spend, 0)
  const totalGMV = adsStats.reduce((sum, s) => sum + s.gmv, 0)
  const totalViews = contentStats.reduce((sum, s) => sum + s.views, 0)

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">运营分析</h1>
        <DateRangePicker />
      </div>

      {/* 投流核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="总投放花费" value={`¥${(totalSpend / 10000).toFixed(1)}万`} />
        <MetricCard title="总GMV" value={`¥${(totalGMV / 10000).toFixed(1)}万`} />
        <MetricCard title="整体ROI" value={totalSpend > 0 ? (totalGMV / totalSpend).toFixed(2) : '0'} />
        <MetricCard title="内容总播放" value={(totalViews / 10000).toFixed(1) + '万'} />
      </div>

      {/* 投流效率 */}
      <Card title="投流效率对比">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-textSecondary">平台</th>
                <th className="text-right py-3 px-4 text-textSecondary">花费</th>
                <th className="text-right py-3 px-4 text-textSecondary">GMV</th>
                <th className="text-right py-3 px-4 text-textSecondary">ROI</th>
                <th className="text-right py-3 px-4 text-textSecondary">点击率</th>
                <th className="text-right py-3 px-4 text-textSecondary">转化率</th>
              </tr>
            </thead>
            <tbody>
              {adsStats.map(stat => (
                <tr key={stat.platform} className="border-b border-border/50">
                  <td className="py-3 px-4 text-accent">{stat.platform}</td>
                  <td className="py-3 px-4 text-right">¥{stat.spend.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">¥{stat.gmv.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-success">{stat.roi.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">{stat.ctr}%</td>
                  <td className="py-3 px-4 text-right">{stat.cvr}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 投流趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="投流GMV趋势">
          <TrendChart data={adsTrend} dataKey="value" height={250} />
        </Card>
        <Card title="各平台ROI对比">
          <BarChartComponent
            data={adsStats.map(s => ({ name: s.platform, value: s.roi }))}
            nameKey="name"
            dataKey="value"
            height={250}
          />
        </Card>
      </div>

      {/* 内容表现 */}
      <Card title="内容表现">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: '总播放', key: 'views', format: (v) => (v / 10000).toFixed(1) + '万' },
            { label: '总点赞', key: 'likes', format: (v) => v.toLocaleString() },
            { label: '总评论', key: 'comments', format: (v) => v.toLocaleString() },
            { label: '总分享', key: 'shares', format: (v) => v.toLocaleString() },
            { label: '总涨粉', key: 'fansGrowth', format: (v) => v.toLocaleString() }
          ].map(item => {
            const total = contentStats.reduce((sum, s) => sum + (s[item.key] || 0), 0)
            return (
              <div key={item.key} className="bg-primary p-4 rounded-lg text-center">
                <div className="text-textSecondary text-sm">{item.label}</div>
                <div className="text-xl font-bold text-accent mt-1">
                  {item.format(total)}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* 平台对比 */}
      <Card title="平台内容效果对比">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-textSecondary">平台</th>
                <th className="text-right py-3 px-4 text-textSecondary">播放量</th>
                <th className="text-right py-3 px-4 text-textSecondary">点赞数</th>
                <th className="text-right py-3 px-4 text-textSecondary">互动率</th>
              </tr>
            </thead>
            <tbody>
              {contentStats.map(stat => {
                const interactionRate = stat.views > 0 ? ((stat.likes + stat.comments + stat.shares) / stat.views * 100).toFixed(2) : '0'
                return (
                  <tr key={stat.platform} className="border-b border-border/50">
                    <td className="py-3 px-4 text-accent">{stat.platform}</td>
                    <td className="py-3 px-4 text-right">{stat.views.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{stat.likes.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-success">{interactionRate}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}