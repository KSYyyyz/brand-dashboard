import TrendChart from '../charts/TrendChart'

const STATUS_COLORS = {
  '营业中': 'bg-success/20 text-success',
  '快闪店': 'bg-accent/20 text-accent',
  '升级中': 'bg-warning/20 text-warning',
  '已关闭': 'bg-error/20 text-error'
}

export default function StoreDetailModal({ store, sales, onClose }) {
  if (!store) return null

  // 计算统计数据
  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.revenue), 0)
  const totalProfit = sales.reduce((sum, s) => sum + Number(s.profit), 0)
  const totalCustomers = sales.reduce((sum, s) => sum + s.customer_count, 0)
  const avgOrder = totalCustomers > 0 ? totalRevenue / totalCustomers : 0
  const profitRate = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0

  // 销售趋势数据
  const salesTrendData = sales.slice(-30).map(s => ({
    date: s.sale_date,
    revenue: Number(s.revenue),
    profit: Number(s.profit),
    customers: s.customer_count
  })).sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 弹窗 */}
      <div className="relative bg-primary border border-border rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="sticky top-0 bg-primary border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <span className="text-textSecondary text-sm">门店详情</span>
            <h2 className="text-xl font-bold mt-1">{store.store_name}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded text-sm ${STATUS_COLORS[store.status] || 'bg-secondary text-textSecondary'}`}>
              {store.status}
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors text-lg"
            >
              ×
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* 核心指标 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-secondary rounded-lg p-3">
              <div className="text-textSecondary text-xs">累计销售额</div>
              <div className="text-lg font-bold text-accent">¥{(totalRevenue / 10000).toFixed(1)}万</div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <div className="text-textSecondary text-xs">累计利润</div>
              <div className="text-lg font-bold text-success">¥{(totalProfit / 10000).toFixed(1)}万</div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <div className="text-textSecondary text-xs">利润率</div>
              <div className="text-lg font-bold">{profitRate.toFixed(1)}%</div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <div className="text-textSecondary text-xs">总客流量</div>
              <div className="text-lg font-bold">{totalCustomers}</div>
            </div>
          </div>

          {/* 门店信息 */}
          <div>
            <h3 className="text-sm font-medium text-textSecondary mb-3">基本信息</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary rounded-lg p-3">
                <div className="text-textSecondary text-xs">门店编码</div>
                <div className="font-medium mt-1">{store.store_code}</div>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <div className="text-textSecondary text-xs">地区</div>
                <div className="font-medium mt-1">{store.province} {store.city}</div>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <div className="text-textSecondary text-xs">员工数量</div>
                <div className="font-medium mt-1">{store.staff_count}人</div>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <div className="text-textSecondary text-xs">开业时间</div>
                <div className="font-medium mt-1">{store.opening_date}</div>
              </div>
            </div>
          </div>

          {/* 销售趋势 */}
          <div>
            <h3 className="text-sm font-medium text-textSecondary mb-3">近30天销售趋势</h3>
            <div className="bg-secondary rounded-lg p-3">
              <TrendChart data={salesTrendData} dataKey="revenue" height={180} />
            </div>
          </div>

          {/* 每日明细 */}
          <div>
            <h3 className="text-sm font-medium text-textSecondary mb-3">每日销售明细</h3>
            <div className="bg-secondary rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-border/50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">日期</th>
                    <th className="text-right px-3 py-2 font-medium">销售额</th>
                    <th className="text-right px-3 py-2 font-medium">利润</th>
                    <th className="text-right px-3 py-2 font-medium">客流量</th>
                  </tr>
                </thead>
                <tbody>
                  {salesTrendData.slice().reverse().slice(0, 10).map((s, i) => (
                    <tr key={i} className="border-t border-border/50">
                      <td className="px-3 py-2">{s.date}</td>
                      <td className="text-right px-3 py-2">¥{Number(s.revenue).toLocaleString()}</td>
                      <td className="text-right px-3 py-2 text-success">¥{Number(s.profit).toLocaleString()}</td>
                      <td className="text-right px-3 py-2">{s.customers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 底部 */}
        <div className="sticky bottom-0 bg-primary border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="w-full py-2 bg-secondary hover:bg-border rounded-lg transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}