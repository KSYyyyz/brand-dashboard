import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001

// Supabase 配置
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://szeitkdhonapdzvdtaot.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || 'sb_publishable_L9bCfa5SJigYfd8xe16Lpw_EZtldrg2'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 闻献商品真实数据
const PRODUCTS = [
  { id: 1, name: '初熟之物 NAIVE', price: 2980, category: '浓香水' },
  { id: 2, name: '体物入微 SENSITIVE', price: 2980, category: '浓香水' },
  { id: 3, name: '夜漠回声 OFF', price: 2680, category: '浓香水' },
  { id: 4, name: '柔韧荆棘 Tough Love', price: 2680, category: '浓香水' },
  { id: 5, name: '腹语之术 Stock', price: 2880, category: '浓香水' },
  { id: 6, name: '席地而坐 Mat', price: 2880, category: '浓香水' },
  { id: 7, name: '席地而坐 SIT', price: 1750, category: '浓香水' },
  { id: 8, name: '羁旅归途 WONDER', price: 1750, category: '浓香水' },
  { id: 9, name: '相拥之后 HUG', price: 1750, category: '浓香水' },
  { id: 10, name: '芳草留痕 LAY', price: 1750, category: '浓香水' },
  { id: 11, name: '灵光没顶 THINK', price: 1750, category: '浓香水' },
  { id: 12, name: '空无一木 VOID', price: 1750, category: '浓香水' },
  { id: 13, name: '羽化仙 FEATHER', price: 3280, category: '浓香水' },
  { id: 14, name: '杉间', price: 2880, category: '浓香水' },
  { id: 15, name: '蛮柚', price: 2680, category: '浓香水' },
  { id: 16, name: '丹沉', price: 3280, category: '浓香水' },
  { id: 17, name: '赤檀', price: 3280, category: '浓香水' },
  { id: 18, name: '龙吟', price: 3580, category: '浓香水' },
  { id: 19, name: '麝语', price: 3580, category: '浓香水' },
  { id: 20, name: '初熟之物洗发水', price: 395, category: '身体护理' },
  { id: 21, name: '体物入微护发素', price: 395, category: '身体护理' },
  { id: 22, name: '初熟之物身体乳', price: 520, category: '身体护理' },
  { id: 23, name: '体物入微护手霜', price: 295, category: '身体护理' },
  { id: 24, name: '初熟之物洗手液', price: 295, category: '身体护理' },
  { id: 25, name: '银炭滴香', price: 1680, category: '香薰' },
  { id: 26, name: '电子香薰机', price: 980, category: '香薰' },
  { id: 27, name: '车载香氛', price: 480, category: '香薰' }
]

const STORES = [
  { id: 1, name: '晶坛空间', city: '上海' },
  { id: 2, name: '珑宫', city: '上海' },
  { id: 3, name: '愚园书室', city: '上海' },
  { id: 4, name: '密窖空间', city: '北京' },
  { id: 5, name: '月朗空间', city: '北京' },
  { id: 6, name: '隐廊', city: '深圳' },
  { id: 7, name: '碧湾空间', city: '深圳' },
  { id: 8, name: '竹林', city: '成都' },
  { id: 9, name: '粼廊空间', city: '成都' },
  { id: 10, name: '富春明廊', city: '杭州' },
  { id: 11, name: '富春书室', city: '杭州' },
  { id: 12, name: '芳庭', city: '武汉' },
  { id: 13, name: '竹堂空间', city: '苏州' },
  { id: 14, name: '香亭空间', city: '西安' },
  { id: 15, name: '红房子', city: '上海' },
  { id: 16, name: '夜庙', city: '上海' },
  { id: 17, name: '亮堂空间', city: '成都' },
  { id: 18, name: '方舟ARK', city: '北京' },
  { id: 19, name: '山东济南店', city: '济南' },
  { id: 20, name: '海南三亚店', city: '三亚' },
  { id: 21, name: '南京店', city: '南京' },
  { id: 22, name: '厦门店', city: '厦门' },
  { id: 23, name: '重庆店', city: '重庆' },
  { id: 24, name: '天津店', city: '天津' },
  { id: 25, name: '长沙店', city: '长沙' }
]

const PLATFORMS = ['天猫旗舰店', '淘宝店', '京东旗舰店', '抖音直播间', '微信小程序', '线下门店']
const PAYMENT_METHODS = ['支付宝', '微信支付', '银行卡', '会员积分抵扣']
const MEMBER_LEVELS = ['龙涎', '沉香', '檀木', '麝香', '非会员']

// 工具函数
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
let orderCounter = Date.now()
const generateOrderNo = () => {
  orderCounter++
  return `WX${orderCounter}${random(10, 99)}`
}

// 生成单笔交易
function generateTransaction(timestamp = new Date()) {
  const store = pick(STORES)
  const product = pick(PRODUCTS)
  const platform = pick(PLATFORMS)
  const payment = pick(PAYMENT_METHODS)
  const hour = random(9, 22)

  const orderTime = new Date(timestamp)
  orderTime.setHours(hour, random(0, 59), random(0, 59))

  const memberLevel = pick(MEMBER_LEVELS)
  let discount = 1
  let points = 0
  if (memberLevel === '龙涎') { discount = 0.8; points = Math.floor(product.price * 0.02) }
  else if (memberLevel === '沉香') { discount = 0.85; points = Math.floor(product.price * 0.015) }
  else if (memberLevel === '檀木') { discount = 0.9; points = Math.floor(product.price * 0.012) }
  else if (memberLevel === '麝香') { discount = 0.95; points = Math.floor(product.price * 0.01) }

  const statusRand = Math.random()
  let status = '已完成'
  if (statusRand > 0.98) status = '已退款'
  else if (statusRand > 0.95) status = '已支付'

  const quantity = Math.random() > 0.85 ? random(2, 3) : 1
  const originalAmount = product.price * quantity
  const finalAmount = Math.round(originalAmount * discount)
  const profit = Math.round(finalAmount * random(30, 50) / 100)

  return {
    order_no: generateOrderNo(),
    order_time: orderTime.toISOString(),
    store_id: store.id,
    store_name: store.name,
    city: store.city,
    product_id: product.id,
    product_name: product.name,
    category: product.category,
    original_price: originalAmount,
    final_amount: finalAmount,
    discount: discount,
    discount_amount: originalAmount - finalAmount,
    profit: profit,
    quantity: quantity,
    payment_method: payment,
    platform: platform,
    member_level: memberLevel,
    points_earned: points,
    status: status,
    hour: hour
  }
}

// API 路由

// 1. 健康检查
app.get('/api/health', async (req, res) => {
  try {
    const { count } = await supabase
      .from('merchant_transactions')
      .select('*', { count: 'exact', head: true })

    res.json({
      status: 'ok',
      supabase: 'connected',
      total_transactions: count || 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// 2. 获取统计数据
app.get('/api/stats', async (req, res) => {
  try {
    const { start_date, end_date } = req.query
    let query = supabase
      .from('merchant_transactions')
      .select('*', { count: 'exact' })

    if (start_date) {
      query = query.gte('order_time', start_date)
    }
    if (end_date) {
      const end = new Date(end_date)
      end.setHours(23, 59, 59)
      query = query.lte('order_time', end.toISOString())
    }

    const { data: transactions, error } = await query

    if (error) throw error

    const filtered = transactions || []

    // 基础统计
    const completedTx = filtered.filter(t => t.status === '已完成')
    const totalGMV = completedTx.reduce((sum, t) => sum + t.final_amount, 0)
    const totalProfit = completedTx.reduce((sum, t) => sum + t.profit, 0)
    const avgOrderAmount = completedTx.length > 0 ? Math.round(totalGMV / completedTx.length) : 0

    // 按平台统计
    const platformStats = PLATFORMS.map(p => {
      const platformTx = completedTx.filter(t => t.platform === p)
      return {
        platform: p,
        orders: platformTx.length,
        gmv: platformTx.reduce((sum, t) => sum + t.final_amount, 0)
      }
    }).filter(p => p.orders > 0).sort((a, b) => b.gmv - a.gmv)

    // 按城市统计
    const cityStats = [...new Set(completedTx.map(t => t.city))].map(city => {
      const cityTx = completedTx.filter(t => t.city === city)
      return {
        city,
        orders: cityTx.length,
        gmv: cityTx.reduce((sum, t) => sum + t.final_amount, 0)
      }
    }).sort((a, b) => b.gmv - a.gmv)

    // 按商品统计 TOP10
    const productStats = [...new Set(completedTx.map(t => t.product_id))].map(pid => {
      const productTx = completedTx.filter(t => t.product_id === pid)
      const product = PRODUCTS.find(p => p.id === pid)
      return {
        product_id: pid,
        product_name: product?.name || '',
        category: product?.category || '',
        orders: productTx.length,
        gmv: productTx.reduce((sum, t) => sum + t.final_amount, 0)
      }
    }).sort((a, b) => b.gmv - a.gmv).slice(0, 10)

    // 会员等级分布
    const memberStats = MEMBER_LEVELS.map(level => ({
      level,
      orders: completedTx.filter(t => t.member_level === level).length,
      gmv: completedTx.filter(t => t.member_level === level).reduce((sum, t) => sum + t.final_amount, 0)
    }))

    res.json({
      summary: {
        total_orders: filtered.length,
        completed_orders: completedTx.length,
        refunded_orders: filtered.filter(t => t.status === '已退款').length,
        total_gmv: totalGMV,
        total_profit: totalProfit,
        avg_order_amount: avgOrderAmount
      },
      platform_stats: platformStats,
      city_stats: cityStats,
      product_stats: productStats,
      member_stats: memberStats
    })
  } catch (error) {
    console.error('Stats error:', error)
    res.status(500).json({ error: error.message })
  }
})

// 3. 获取每日趋势
app.get('/api/stats/daily', async (req, res) => {
  try {
    const { days = 30 } = req.query
    const result = []
    const now = new Date()

    for (let d = parseInt(days) - 1; d >= 0; d--) {
      const date = new Date(now)
      date.setDate(date.getDate() - d)
      const dateStr = date.toISOString().split('T')[0]
      const nextDateStr = new Date(date.getTime() + 86400000).toISOString().split('T')[0]

      const { data: dayTx } = await supabase
        .from('merchant_transactions')
        .select('*')
        .gte('order_time', dateStr)
        .lt('order_time', nextDateStr)
        .eq('status', '已完成')

      const completed = dayTx || []
      result.push({
        date: dateStr,
        orders: completed.length,
        gmv: completed.reduce((sum, t) => sum + t.final_amount, 0),
        profit: completed.reduce((sum, t) => sum + t.profit, 0),
        customers: new Set(completed.map(t => t.member_level + t.city)).size
      })
    }

    res.json(result)
  } catch (error) {
    console.error('Daily stats error:', error)
    res.status(500).json({ error: error.message })
  }
})

// 4. 获取交易列表
app.get('/api/transactions', async (req, res) => {
  try {
    const { limit = 50, offset = 0, date, status, city, platform } = req.query

    let query = supabase
      .from('merchant_transactions')
      .select('*', { count: 'exact' })
      .order('order_time', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    if (date) {
      query = query.eq('order_time', date)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (city) {
      query = query.eq('city', city)
    }
    if (platform) {
      query = query.eq('platform', platform)
    }

    const { data, error, count } = await query

    if (error) throw error

    res.json({
      total: count || 0,
      offset: Number(offset),
      limit: Number(limit),
      data: data || []
    })
  } catch (error) {
    console.error('Transactions error:', error)
    res.status(500).json({ error: error.message })
  }
})

// 5. 生成单笔新交易
app.post('/api/transactions/generate', async (req, res) => {
  try {
    const transaction = generateTransaction()
    const { data, error } = await supabase
      .from('merchant_transactions')
      .insert(transaction)
      .select()
      .single()

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Generate error:', error)
    res.status(500).json({ error: error.message })
  }
})

// 6. 批量生成交易
app.post('/api/transactions/batch', async (req, res) => {
  try {
    const { count = 10, backfill_days = 0 } = req.body
    const transactions = []
    const now = new Date()

    for (let i = 0; i < count; i++) {
      let timestamp = now
      if (backfill_days > 0) {
        timestamp = new Date(now.getTime() - random(0, backfill_days * 24 * 60 * 60 * 1000))
      }
      transactions.push(generateTransaction(timestamp))
    }

    const { data, error } = await supabase
      .from('merchant_transactions')
      .insert(transactions)
      .select()

    if (error) throw error

    res.json({
      generated: count,
      transactions: data
    })
  } catch (error) {
    console.error('Batch generate error:', error)
    res.status(500).json({ error: error.message })
  }
})

// 7. 初始化历史数据
app.post('/api/init', async (req, res) => {
  try {
    const { days = 30 } = req.body
    const now = new Date()
    let inserted = 0

    // 检查是否已有数据
    const { count } = await supabase
      .from('merchant_transactions')
      .select('*', { count: 'exact', head: true })

    if (count > 0) {
      return res.json({
        message: '数据已存在',
        total: count,
        action: 'skipped'
      })
    }

    // 生成历史数据
    const transactions = []
    for (let d = days; d >= 1; d--) {
      const date = new Date(now)
      date.setDate(date.getDate() - d)
      const txPerDay = random(80, 150)

      for (let i = 0; i < txPerDay; i++) {
        const hour = random(9, 22)
        const txDate = new Date(date)
        txDate.setHours(hour, random(0, 59), random(0, 59))
        transactions.push(generateTransaction(txDate))
      }
    }

    // 分批插入（每批100条）
    const batchSize = 100
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize)
      const { error } = await supabase
        .from('merchant_transactions')
        .insert(batch)

      if (error) throw error
      inserted += batch.length
    }

    res.json({
      message: '历史数据初始化完成',
      days,
      transactions_per_day: '80-150',
      inserted,
      total: inserted
    })
  } catch (error) {
    console.error('Init error:', error)
    res.status(500).json({ error: error.message })
  }
})

// 8. 获取商品列表
app.get('/api/products', (req, res) => {
  res.json(PRODUCTS)
})

// 9. 获取门店列表
app.get('/api/stores', (req, res) => {
  res.json(STORES)
})

// 启动
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║       闻献商户交易模拟服务 (Supabase)                 ║
╠═══════════════════════════════════════════════════════╣
║  服务地址: http://localhost:${PORT}                       ║
║                                                       ║
║  API 接口:                                            ║
║  • GET  /api/stats          - 获取聚合统计            ║
║  • GET  /api/stats/daily   - 获取每日趋势            ║
║  • GET  /api/transactions  - 获取交易列表            ║
║  • POST /api/transactions/generate  - 生成单笔      ║
║  • POST /api/transactions/batch     - 批量生成  ║
║  • POST /api/init          - 初始化历史数据        ║
║  • GET  /api/products      - 获取商品列表          ║
║  • GET  /api/stores        - 获取门店列表          ║
║  • GET  /api/health        - 健康检查               ║
╚═══════════════════════════════════════════════════════╝
  `)
})