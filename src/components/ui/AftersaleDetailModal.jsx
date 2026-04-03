import Badge from './Badge'

export default function AftersaleDetailModal({ aftersale, onClose }) {
  if (!aftersale) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-secondary rounded-lg border border-border w-full max-w-2xl max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
        {/* 标题 */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-bold">售后详情</h3>
          <button onClick={onClose} className="text-textSecondary hover:text-textPrimary text-xl">&times;</button>
        </div>

        {/* 内容 */}
        <div className="p-4 space-y-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-textSecondary text-sm">售后编号</div>
              <div className="font-mono text-accent">{aftersale.id}</div>
            </div>
            <div>
              <div className="text-textSecondary text-sm">状态</div>
              <Badge variant={
                aftersale.as_status === '已完成' ? 'success' :
                aftersale.as_status === '处理中' ? 'warning' : 'error'
              }>
                {aftersale.as_status}
              </Badge>
            </div>
            <div>
              <div className="text-textSecondary text-sm">客户姓名</div>
              <div className="font-medium">{aftersale.customer_name}</div>
            </div>
            <div>
              <div className="text-textSecondary text-sm">会员等级</div>
              <Badge variant="default">{aftersale.member_level}</Badge>
            </div>
            <div>
              <div className="text-textSecondary text-sm">电话</div>
              <div className="font-mono">{aftersale.phone}</div>
            </div>
            <div>
              <div className="text-textSecondary text-sm">售后类型</div>
              <Badge variant="default">{aftersale.as_type}</Badge>
            </div>
          </div>

          {/* 关联订单 */}
          <div className="border-t border-border pt-4">
            <div className="text-textSecondary text-sm mb-2">关联订单</div>
            <div className="bg-primary rounded-lg p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-textSecondary">订单号</span>
                <span className="font-mono text-accent">{aftersale.order_no}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textSecondary">商品</span>
                <span>{aftersale.product_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textSecondary">订单日期</span>
                <span>{aftersale.order_date ? new Date(aftersale.order_date).toLocaleDateString() : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textSecondary">订单金额</span>
                <span className="text-accent">¥{aftersale.order_amount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 售后信息 */}
          <div className="border-t border-border pt-4">
            <div className="text-textSecondary text-sm mb-2">售后信息</div>
            <div className="bg-primary rounded-lg p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-textSecondary">申请日期</span>
                <span>{aftersale.as_date ? new Date(aftersale.as_date).toLocaleDateString() : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textSecondary">售后原因</span>
                <span>{aftersale.as_reason}</span>
              </div>
              <div>
                <div className="text-textSecondary text-sm mb-1">售后说明</div>
                <div className="bg-secondary rounded p-2 text-sm">{aftersale.as_content}</div>
              </div>
            </div>
          </div>

          {/* 处理结果 */}
          <div className="border-t border-border pt-4">
            <div className="text-textSecondary text-sm mb-2">处理结果</div>
            <div className="bg-primary rounded-lg p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-textSecondary">处理人</span>
                <span>{aftersale.handler || '-'}</span>
              </div>
              {aftersale.refund_amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-textSecondary">退款金额</span>
                  <span className="text-error font-bold">¥{aftersale.refund_amount.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end gap-2 p-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary border border-border rounded-lg text-sm hover:bg-primary"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
