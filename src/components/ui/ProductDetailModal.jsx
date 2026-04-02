export default function ProductDetailModal({ product, onClose }) {
  if (!product) return null

  const profit = product.price * 0.6 // 假设利润率60%
  const cost = product.price - profit

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 弹窗 */}
      <div className="relative bg-primary border border-border rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="shrink-0 bg-primary border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-textSecondary text-sm">商品详情</span>
            <h2 className="text-xl font-bold mt-1">{product.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors text-lg"
          >
            ×
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* 基本信息 */}
          <div>
            <h3 className="text-sm font-medium text-textSecondary mb-3">基本信息</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary rounded-lg p-3">
                <div className="text-textSecondary text-xs">商品编号</div>
                <div className="font-medium mt-1">#{String(product.id).padStart(3, '0')}</div>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <div className="text-textSecondary text-xs">分类</div>
                <div className="font-medium mt-1">{product.category}</div>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <div className="text-textSecondary text-xs">系列</div>
                <div className="font-medium mt-1">{product.collection}</div>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <div className="text-textSecondary text-xs">单价</div>
                <div className="font-medium text-accent mt-1">¥{product.price.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* 库存与销售 */}
          <div>
            <h3 className="text-sm font-medium text-textSecondary mb-3">库存与销售</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary rounded-lg p-3">
                <div className="text-textSecondary text-xs">当前库存</div>
                <div className={`font-medium text-lg mt-1 ${product.stock < 30 ? 'text-error' : 'text-success'}`}>
                  {product.stock}
                </div>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <div className="text-textSecondary text-xs">累计销量</div>
                <div className="font-medium text-lg text-accent mt-1">{product.sales}</div>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <div className="text-textSecondary text-xs">销售额</div>
                <div className="font-medium text-lg mt-1">¥{(product.sales * product.price / 10000).toFixed(1)}万</div>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <div className="text-textSecondary text-xs">库存状态</div>
                <div className={`font-medium mt-1 ${product.stock < 30 ? 'text-error' : 'text-success'}`}>
                  {product.stock < 30 ? '偏低' : '正常'}
                </div>
              </div>
            </div>
          </div>

          {/* 利润分析 */}
          <div>
            <h3 className="text-sm font-medium text-textSecondary mb-3">利润分析</h3>
            <div className="bg-secondary rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">单价</span>
                <span className="font-medium">¥{product.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">成本价 (40%)</span>
                <span className="text-textSecondary">-¥{cost.toFixed(0)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-center">
                <span className="text-textSecondary">单件利润</span>
                <span className="font-medium text-success">¥{profit.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">总利润</span>
                <span className="font-medium text-success">¥{(product.sales * profit / 10000).toFixed(1)}万</span>
              </div>
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