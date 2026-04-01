// 闻献品牌常量
const MEMBER_LEVELS = ['龙涎', '沉香', '檀木', '麝香', '非会员']
const PLATFORMS = ['天猫', '淘宝', '京东', '抖音', '微信小程序', '线下门店']
const ORDER_STATUS = ['待支付', '已支付', '已发货', '已完成', '已退款']
const PROVINCES = ['北京', '上海', '广东', '浙江', '江苏', '四川', '湖北', '湖南', '福建', '山东']
const CITIES = {
  '北京': ['北京'], '上海': ['上海'], '广东': ['广州', '深圳', '东莞', '佛山'],
  '浙江': ['杭州', '宁波', '温州', '义乌'], '江苏': ['南京', '苏州', '无锡'],
  '四川': ['成都', '绵阳'], '湖北': ['武汉'], '湖南': ['长沙'],
  '福建': ['厦门', '福州', '泉州'], '山东': ['济南', '青岛']
}
const OCCUPATIONS = ['企业主', '高管', '白领', '自由职业', '公务员', '医生', '律师', '设计师']

// 工具函数
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const generatePhone = () => `138${random(10000000, 99999999)}`
const generateOrderNo = () => `WX${Date.now()}${random(1000, 9999)}`

// 生成用户数据
export function generateUsers(count = 500) {
  const users = []
  const now = new Date()

  for (let i = 1; i <= count; i++) {
    const level = pick(MEMBER_LEVELS)
    const province = pick(PROVINCES)
    const city = pick(CITIES[province])
    const orderCount = level === '非会员' ? 0 : random(1, 20)
    const totalAmount = orderCount * random(500, 3000)

    const createdAt = new Date(now - random(1, 365) * 24 * 60 * 60 * 1000)
    const firstOrderTime = orderCount > 0
      ? new Date(createdAt.getTime() + random(1, 30) * 24 * 60 * 60 * 1000)
      : null
    const lastOrderTime = orderCount > 1
      ? new Date(firstOrderTime.getTime() + random(1, 180) * 24 * 60 * 60 * 1000)
      : firstOrderTime

    users.push({
      id: i,
      vip_no: `VIP${String(10000 + i).slice(1)}`,
      name: `用户${i}`,
      phone: generatePhone(),
      level,
      province,
      city,
      occupation: pick(OCCUPATIONS),
      total_amount: totalAmount,
      order_count: orderCount,
      first_order_time: firstOrderTime?.toISOString() || null,
      last_order_time: lastOrderTime?.toISOString() || null,
      created_at: createdAt.toISOString()
    })
  }

  return users
}

// 生成订单数据
export function generateOrders(users, count = 1500) {
  const orders = []
  const now = new Date()
  let orderId = 1

  for (let i = 0; i < count; i++) {
    const user = pick(users.filter(u => u.order_count > 0))
    if (!user) continue

    const orderTime = user.first_order_time
      ? new Date(new Date(user.first_order_time).getTime() + random(0, 180) * 24 * 60 * 60 * 1000)
      : new Date(now - random(1, 180) * 24 * 60 * 60 * 1000)

    const status = orderTime > new Date(now - 7 * 24 * 60 * 60 * 1000)
      ? pick(['待支付', '已支付', '已发货', '已完成'])
      : pick(ORDER_STATUS)

    orders.push({
      id: orderId++,
      order_no: generateOrderNo(),
      user_id: user.id,
      platform: pick(PLATFORMS),
      amount: random(500, 3000),
      status,
      order_time: orderTime.toISOString(),
      pay_time: status !== '待支付' ? new Date(orderTime.getTime() + random(1, 60) * 60 * 1000).toISOString() : null,
      created_at: orderTime.toISOString()
    })
  }

  return orders
}

// 生成门店数据
export function generateStores(count = 25) {
  const stores = []
  // 闻献真实门店名称（共25家）
  const storeNames = [
    '晶坛空间',        // 1 上海静安嘉里中心
    '珑宫',            // 2 上海西岸梦中心
    '愚园书室',        // 3 上海愚园路
    '密窖空间',        // 4 北京SKP-S
    '月朗空间',        // 5 北京
    '隐廊',            // 6 深圳K11
    '碧湾空间',        // 7 深圳
    '竹林',            // 8 成都
    '粼廊空间',        // 9 成都
    '富春明廊',        // 10 杭州万象城
    '富春书室',        // 11 杭州
    '芳庭',            // 12 武汉武商MALL
    '竹堂空间',        // 13 苏州
    '香亭空间',        // 14 西安
    '红房子',          // 15 上海/深圳限定快闪
    '夜庙',            // 16 上海（已关闭/升级中）
    '亮堂空间',        // 17 成都（已关闭）
    '方舟ARK',         // 18 北京SKP-S快闪
    '山东济南店',      // 19 济南
    '海南三亚店',      // 20 三亚
    '南京店',          // 21 南京
    '厦门店',          // 22 厦门
    '重庆店',          // 23 重庆
    '天津店',          // 24 天津
    '长沙店'           // 25 长沙
  ]

  const storeCities = [
    '上海', '上海', '上海', '北京', '北京', '深圳', '深圳', '成都', '成都', '杭州',
    '杭州', '武汉', '苏州', '西安', '上海', '上海', '成都', '北京', '济南', '三亚',
    '南京', '厦门', '重庆', '天津', '长沙'
  ]

  const storeStatus = [
    '营业中', '营业中', '营业中', '营业中', '营业中', '营业中', '营业中', '营业中', '营业中', '营业中',
    '营业中', '营业中', '营业中', '营业中', '快闪店', '升级中', '已关闭', '快闪店', '营业中', '营业中',
    '营业中', '营业中', '营业中', '营业中', '营业中'
  ]

  for (let i = 1; i <= count; i++) {
    stores.push({
      id: i,
      store_code: `DOC${String(i).padStart(3, '0')}`,
      store_name: storeNames[i - 1] || `闻献门店${i}`,
      province: storeCities[i - 1] || '上海',
      city: storeCities[i - 1] || '上海',
      area: pick(['核心商圈', '商业综合体', '购物中心']),
      staff_count: random(5, 20),
      opening_date: `202${random(1, 4)}-${String(random(1, 12)).padStart(2, '0')}-01`,
      status: storeStatus[i - 1] || '营业中',
      created_at: new Date().toISOString()
    })
  }

  return stores
}

// 生成门店销售数据
export function generateStoreSales(stores, days = 30) {
  const sales = []
  let id = 1
  const now = new Date()

  for (const store of stores) {
    for (let d = 0; d < days; d++) {
      const saleDate = new Date(now - d * 24 * 60 * 60 * 1000)
      const customerCount = random(5, 50)
      const avgOrder = random(800, 3500)

      sales.push({
        id: id++,
        store_id: store.id,
        sale_date: saleDate.toISOString().split('T')[0],
        revenue: customerCount * avgOrder,
        profit: customerCount * avgOrder * random(30, 50) / 100,
        customer_count: customerCount,
        avg_order: avgOrder,
        created_at: saleDate.toISOString()
      })
    }
  }

  return sales
}

// 生成投流数据
export function generateAdsData(days = 30) {
  const data = []
  const platforms = ['抖音千川', '腾讯广告', '小红书']
  let id = 1
  const now = new Date()

  for (const platform of platforms) {
    for (let d = 0; d < days; d++) {
      const reportDate = new Date(now - d * 24 * 60 * 60 * 1000)
      const spend = random(5000, 20000)
      const impressions = random(100000, 500000)
      const clicks = Math.floor(impressions * random(10, 30) / 100)
      const conversions = Math.floor(clicks * random(5, 15) / 100)
      const gmv = conversions * random(500, 2000)

      data.push({
        id: id++,
        platform,
        campaign: `${platform}品牌推广`,
        spend,
        impressions,
        clicks,
        conversions,
        gmv,
        roi: Math.round(gmv / spend * 100) / 100,
        report_date: reportDate.toISOString().split('T')[0],
        created_at: reportDate.toISOString()
      })
    }
  }

  return data
}

// 生成内容数据
export function generateContentData(days = 30) {
  const data = []
  const platforms = ['抖音', '小红书', '微信视频号']
  const contentTypes = ['产品种草', '品牌故事', 'KOL合作', '用户测评']
  let id = 1
  const now = new Date()

  for (const platform of platforms) {
    for (let d = 0; d < days; d++) {
      const publishDate = new Date(now - d * 24 * 60 * 60 * 1000)
      const views = random(10000, 100000)
      const likes = Math.floor(views * random(5, 20) / 100)
      const comments = Math.floor(likes * random(10, 30) / 100)
      const shares = Math.floor(likes * random(5, 15) / 100)

      data.push({
        id: id++,
        platform,
        content_type: pick(contentTypes),
        title: `${platform}内容笔记${d + 1}`,
        views,
        likes,
        comments,
        shares,
        fans_growth: random(50, 500),
        publish_date: publishDate.toISOString().split('T')[0],
        created_at: publishDate.toISOString()
      })
    }
  }

  return data
}

// 导出所有测试数据
export function generateAllMockData() {
  const users = generateUsers(500)
  const orders = generateOrders(users, 1500)
  const stores = generateStores(10)
  const storeSales = generateStoreSales(stores, 30)
  const adsData = generateAdsData(30)
  const contentData = generateContentData(30)

  return { users, orders, stores, storeSales, adsData, contentData }
}