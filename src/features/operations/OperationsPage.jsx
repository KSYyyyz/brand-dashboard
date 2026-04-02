import { useMemo } from 'react'
import Card from '../../components/ui/Card'
import MetricCard from '../../components/ui/MetricCard'
import TrendChart from '../../components/charts/TrendChart'
import BarChartComponent from '../../components/charts/BarChart'
import DateRangePicker from '../../components/ui/DateRangePicker'
import RefreshButton from '../../components/ui/RefreshButton'
import { useData } from '../../context/DataContext'
import { useDateRange, getDateRange, getPreviousDateRange } from '../../context/DateRangeContext'

export default function OperationsPage() {
  const { loading, transactions, stats } = useData()
  const { range } = useDateRange()

  // 根据日期范围过滤并计算对比
  const { filteredTx, adsData, contentData, periodComparison } = useMemo(() => {
    const { start, end } = getDateRange(range)
    const prevRange = getPreviousDateRange(range)
    let filtered = transactions
    let prevFiltered = transactions

    if (start && end) {
      filtered = transactions.filter(tx => {
        const date = new Date(tx.order_time)
        return date >= start && date <= end
      })
    }

    if (!prevRange.isAllTime && prevRange.start && prevRange.end) {
      prevFiltered = transactions.filter(tx => {
        const date = new Date(tx.order_time)
        return date >= prevRange.start && date <= prevRange.end
      })
    }

    // 从交易数据派生投流数据（按城市/平台模拟）
    const completedTx = filtered.filter(t => t.status === '已完成')
    const prevCompletedTx = prevRange.isAllTime ? [] : prevFiltered.filter(t => t.status === '已完成')
    const totalGMV = completedTx.reduce((sum, t) => sum + t.final_amount, 0)
    const totalOrders = completedTx.length
    const prevTotalGMV = prevCompletedTx.reduce((sum, t) => sum + t.final_amount, 0)
    const prevTotalOrders = prevCompletedTx.length

    // 按平台统计 GMV
    const platformGMV = {}
    completedTx.forEach(t => {
      if (!platformGMV[t.platform]) platformGMV[t.platform] = 0
      platformGMV[t.platform] += t.final_amount
    })

    // 模拟投流数据（基于 GMV 和平台）
    // 闻献是高端品牌，广告投放约占GMV的8-15%
    const adsPlatforms = ['抖音千川', '腾讯广告', '小红书']
    const adsData = adsPlatforms.map((platform, i) => {
      const gmvRatio = i === 0 ? 0.45 : i === 1 ? 0.30 : 0.25
      const platformGMV = platformGMV[platform] || (totalGMV * gmvRatio)
      // 高端品牌投流ROI约1.8-2.5
      const roi = (1.8 + Math.random() * 0.7).toFixed(2)
      const spend = Math.round(platformGMV / parseFloat(roi))
      const cpm = 80 + Math.round(Math.random() * 40) // CPM 80-120
      const impressions = Math.round((spend / platformGMV) * 1000000)
      const ctr = (0.02 + Math.random() * 0.01).toFixed(2) // 点击率2-3%
      const clicks = Math.round(impressions * parseFloat(ctr))
      const cvr = (0.03 + Math.random() * 0.02).toFixed(2) // 转化率3-5%
      const conversions = Math.round(clicks * parseFloat(cvr))
      return {
        platform,
        spend,
        impressions,
        clicks,
        conversions,
        gmv: platformGMV,
        roi
      }
    })

    // 模拟内容数据（基于订单量）
    const contentPlatforms = ['抖音', '小红书', '微信视频号']
    const contentData = contentPlatforms.map(platform => {
      // 基础播放量根据平台特性
      const baseViews = platform === '抖音' ? 50000 : platform === '小红书' ? 30000 : 15000
      // 实际播放与订单量挂钩
      const views = Math.max(1000, Math.round(baseViews * (totalOrders / 50) * (0.8 + Math.random() * 0.4)))
      // 点赞率约3-8%
      const likeRate = 0.03 + Math.random() * 0.05
      const likes = Math.round(views * likeRate)
      // 评论率约1-2%
      const comments = Math.round(views * (0.01 + Math.random() * 0.01))
      // 分享率约0.5-1.5%
      const shares = Math.round(views * (0.005 + Math.random() * 0.01))
      // 涨粉约为点赞的2-5%
      const fans_growth = Math.round(likes * (0.02 + Math.random() * 0.03))
      return {
        platform,
        views,
        likes,
        comments,
        shares,
        fans_growth
      }
    })

    // 计算对比
    const calcChange = (current, previous) => {
      if (prevRange.isAllTime) return null
      if (previous === 0) return current > 0 ? 100 : 0
      return ((current - previous) / previous * 100).toFixed(1)
    }

    const periodComparison = {
      totalSpend: {
        change: calcChange(adsData.reduce((sum, d) => sum + d.spend, 0), prevCompletedTx.length > 0 ? prevTotalGMV * 0.35 : 0),
        trend: prevRange.isAllTime ? null : adsData.reduce((sum, d) => sum + d.spend, 0) >= (prevCompletedTx.length > 0 ? prevTotalGMV * 0.35 : 0) ? 'up' : 'down'
      },
      totalGMV: {
        change: calcChange(totalGMV, prevTotalGMV),
        trend: prevRange.isAllTime ? null : totalGMV >= prevTotalGMV ? 'up' : 'down'
      },
      roi: { change: null, trend: null },
      totalViews: {
        change: calcChange(contentData.reduce((sum, d) => sum + d.views, 0), prevTotalOrders > 0 ? prevTotalOrders * 50000 * 0.5 : 0),
        trend: prevRange.isAllTime ? null : contentData.reduce((sum, d) => sum + d.views, 0) >= (prevTotalOrders > 0 ? prevTotalOrders * 50000 * 0.5 : 0) ? 'up' : 'down'
      }
    }

    return { filteredTx: filtered, adsData, contentData, periodComparison }
  }, [transactions, range])

  // 投流统计汇总
  const adsStats = useMemo(() => {
    const totalSpend = adsData.reduce((sum, d) => sum + d.spend, 0)
    const totalGMV = adsData.reduce((sum, d) => sum + d.gmv, 0)
    const totalViews = contentData.reduce((sum, d) => sum + d.views, 0)
    return { totalSpend, totalGMV, roi: totalSpend > 0 ? (totalGMV / totalSpend).toFixed(2) : '0', totalViews }
  }, [adsData, contentData])

  // 投流趋势（按天）
  const adsTrend = useMemo(() => {
    const dailyMap = {}
    filteredTx.filter(t => t.status === '已完成').forEach(t => {
      const date = t.order_time.split('T')[0]
      if (!dailyMap[date]) dailyMap[date] = 0
      dailyMap[date] += t.final_amount
    })
    return Object.entries(dailyMap)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [filteredTx])

  if (loading && transactions.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">运营分析</h1>
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-secondary rounded-lg animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">运营分析</h1>
        <div className="flex items-center gap-4">
          <RefreshButton />
          <DateRangePicker />
        </div>
      </div>

      {/* 投流核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="总投放花费"
          value={`¥${(adsStats.totalSpend / 10000).toFixed(1)}万`}
          change={periodComparison.totalSpend.change}
          trend={periodComparison.totalSpend.trend}
        />
        <MetricCard
          title="总GMV"
          value={`¥${(adsStats.totalGMV / 10000).toFixed(1)}万`}
          change={periodComparison.totalGMV.change}
          trend={periodComparison.totalGMV.trend}
        />
        <MetricCard title="整体ROI" value={adsStats.roi} />
        <MetricCard
          title="内容总播放"
          value={`${(adsStats.totalViews / 10000).toFixed(1)}万`}
          change={periodComparison.totalViews.change}
          trend={periodComparison.totalViews.trend}
        />
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
                <th className="text-right py-3 px-4 text-textSecondary">曝光</th>
                <th className="text-right py-3 px-4 text-textSecondary">点击</th>
              </tr>
            </thead>
            <tbody>
              {adsData.map(stat => (
                <tr key={stat.platform} className="border-b border-border/50">
                  <td className="py-3 px-4 text-accent">{stat.platform}</td>
                  <td className="py-3 px-4 text-right">¥{(stat.spend / 10000).toFixed(1)}万</td>
                  <td className="py-3 px-4 text-right">¥{(stat.gmv / 10000).toFixed(1)}万</td>
                  <td className="py-3 px-4 text-right text-success">{stat.roi}</td>
                  <td className="py-3 px-4 text-right">{(stat.impressions / 10000).toFixed(0)}万</td>
                  <td className="py-3 px-4 text-right">{(stat.clicks / 10000).toFixed(0)}万</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 趋势图 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="投流GMV趋势">
          <TrendChart data={adsTrend} dataKey="value" height={250} />
        </Card>
        <Card title="各平台ROI对比">
          <BarChartComponent
            data={adsData.map(s => ({ name: s.platform, value: parseFloat(s.roi) || 0 }))}
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
            { label: '总播放', key: 'views', format: (v) => `${(v / 10000).toFixed(1)}万` },
            { label: '总点赞', key: 'likes', format: (v) => v.toLocaleString() },
            { label: '总评论', key: 'comments', format: (v) => v.toLocaleString() },
            { label: '总分享', key: 'shares', format: (v) => v.toLocaleString() },
            { label: '总涨粉', key: 'fans_growth', format: (v) => v.toLocaleString() }
          ].map(item => {
            const total = contentData.reduce((sum, s) => sum + (s[item.key] || 0), 0)
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
              {contentData.map(stat => {
                const interactionRate = stat.views > 0 ? (((stat.likes + stat.comments + stat.shares) / stat.views) * 100).toFixed(2) : '0'
                return (
                  <tr key={stat.platform} className="border-b border-border/50">
                    <td className="py-3 px-4 text-accent">{stat.platform}</td>
                    <td className="py-3 px-4 text-right">{(stat.views / 10000).toFixed(1)}万</td>
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
