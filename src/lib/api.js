// 闻献数据平台 - API 服务层
// 调用 mock-merchant 后端 API

const API_BASE = import.meta.env.VITE_API_BASE || 'https://mock-merchant.vercel.app'

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(`API Error (${endpoint}):`, err)
    throw err
  }
}

// 健康检查
export async function fetchHealth() {
  return fetchAPI('/api/health')
}

// 获取统计数据
export async function fetchStats(startDate, endDate) {
  const params = new URLSearchParams()
  if (startDate) params.set('start_date', startDate)
  if (endDate) params.set('end_date', endDate)
  const query = params.toString() ? `?${params.toString()}` : ''
  return fetchAPI(`/api/stats${query}`)
}

// 获取每日趋势
export async function fetchDailyStats(days = 30) {
  return fetchAPI(`/api/stats/daily?days=${days}`)
}

// 获取交易列表
export async function fetchTransactions({ limit = 100, offset = 0, date, status, city, platform } = {}) {
  const params = new URLSearchParams({ limit, offset })
  if (date) params.set('date', date)
  if (status) params.set('status', status)
  if (city) params.set('city', city)
  if (platform) params.set('platform', platform)
  return fetchAPI(`/api/transactions?${params}`)
}

// 生成单笔交易
export async function generateTransaction() {
  return fetchAPI('/api/transactions/generate', { method: 'POST' })
}

// 批量生成交易
export async function batchGenerateTransactions(count = 10, backfillDays = 0) {
  return fetchAPI('/api/transactions/batch', {
    method: 'POST',
    body: JSON.stringify({ count, backfill_days: backfillDays })
  })
}

// 初始化历史数据
export async function initHistoryData(days = 30) {
  return fetchAPI('/api/init', {
    method: 'POST',
    body: JSON.stringify({ days })
  })
}

// 获取商品列表
export async function fetchProducts() {
  return fetchAPI('/api/products')
}

// 获取门店列表
export async function fetchStores() {
  return fetchAPI('/api/stores')
}

// 将交易数据转换为平台需要的格式
export function transformTransactionData(data) {
  return data.map(tx => ({
    id: tx.order_no,
    order_no: tx.order_no,
    order_time: tx.order_time,
    platform: tx.platform,
    store_name: tx.store_name,
    city: tx.city,
    product_name: tx.product_name,
    category: tx.category,
    amount: tx.final_amount,
    original_price: tx.original_price,
    discount: tx.discount,
    profit: tx.profit,
    quantity: tx.quantity,
    payment_method: tx.payment_method,
    member_level: tx.member_level,
    points_earned: tx.points_earned,
    status: tx.status,
    hour: tx.hour
  }))
}
