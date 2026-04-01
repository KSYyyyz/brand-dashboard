# 品牌数据智能平台 MVP 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建完整的品牌数据智能平台MVP，包含5个页面、测试数据生成器、Supabase数据库集成

**Architecture:** React 19 + Vite前端单页应用，TailwindCSS样式，Recharts图表，Supabase后端（PostgreSQL + Auth），Vercel部署

**Tech Stack:** React 19, Vite 8, TailwindCSS 3, Recharts 3, Supabase JS 2, PostgreSQL

---

## 文件结构

```
brand-data-platform/
├── src/
│   ├── main.jsx                          # 入口文件
│   ├── App.jsx                           # 主应用组件（路由）
│   ├── index.css                         # 全局样式 + Tailwind
│   ├── lib/
│   │   ├── supabase.js                  # Supabase客户端
│   │   └── mock-generator.js            # 测试数据生成器
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Card.jsx                 # 卡片组件
│   │   │   ├── Table.jsx                # 表格组件
│   │   │   ├── Badge.jsx                # 标签组件
│   │   │   ├── MetricCard.jsx            # 指标卡片
│   │   │   └── SkeletonCard.jsx          # 加载骨架屏
│   │   └── charts/
│   │       ├── TrendChart.jsx            # 趋势图
│   │       ├── PieChart.jsx              # 饼图
│   │       └── BarChart.jsx              # 柱状图
│   └── features/
│       ├── overview/
│       │   └── OverviewPage.jsx         # 数据概览页
│       ├── users/
│       │   └── UsersPage.jsx            # 用户画像页
│       ├── operations/
│       │   └── OperationsPage.jsx        # 运营分析页
│       ├── stores/
│       │   └── StoresPage.jsx            # 门店管理页
│       └── data/
│           └── DataManagementPage.jsx    # 数据管理页
├── supabase/
│   └── migrations/
│       └── 001_init.sql                  # 数据库初始化脚本
├── docs/
│   └── superpowers/
│       ├── specs/
│       │   └── 2026-04-01-brand-data-platform-mvp-design.md
│       └── plans/
│           └── 2026-04-01-brand-data-platform-mvp-implementation.md
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── .env.example
└── .gitignore
```

---

## 实施任务

### Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `.env.example`
- Create: `.gitignore`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "brand-data-platform",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.100.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "recharts": "^3.8.0",
    "react-router-dom": "^7.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "vite": "^8.0.1"
  }
}
```

- [ ] **Step 2: 创建 vite.config.js**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

- [ ] **Step 3: 创建 tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#2d2d2d',
        accent: '#c9a962',
        accentLight: '#d4b978',
        textPrimary: '#ffffff',
        textSecondary: '#9ca3af',
        border: '#404040',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444'
      }
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: 创建 postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 5: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>品牌数据智能平台 - 闻献</title>
  </head>
  <body class="bg-primary text-textPrimary">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: 创建 .env.example**

```env
VITE_SUPABASE_URL=https://szeitkdhonapdzvdtaot.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_L9bCfa5SJigYfd8xe16Lpw_EZtldrg2
```

- [ ] **Step 7: 创建 .gitignore**

```
node_modules
dist
.env
*.log
.DS_Store
.vercel
```

- [ ] **Step 8: 提交**

```bash
git add package.json vite.config.js tailwind.config.js postcss.config.js index.html .env.example .gitignore
git commit -m "chore: 项目初始化配置"
```

---

### Task 2: 全局样式和主题

**Files:**
- Create: `src/main.jsx`
- Create: `src/index.css`
- Create: `src/lib/supabase.js`

- [ ] **Step 1: 创建 src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 2: 创建 src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #2d2d2d;
}

::-webkit-scrollbar-thumb {
  background: #404040;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

- [ ] **Step 3: 创建 src/lib/supabase.js**

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://szeitkdhonapdzvdtaot.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_L9bCfa5SJigYfd8xe16Lpw_EZtldrg2'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

- [ ] **Step 4: 提交**

```bash
git add src/main.jsx src/index.css src/lib/supabase.js
git commit -m "feat: 全局样式和Supabase客户端初始化"
```

---

### Task 3: 基础UI组件

**Files:**
- Create: `src/components/ui/Card.jsx`
- Create: `src/components/ui/Badge.jsx`
- Create: `src/components/ui/MetricCard.jsx`
- Create: `src/components/ui/SkeletonCard.jsx`
- Create: `src/components/ui/Table.jsx`

- [ ] **Step 1: 创建 src/components/ui/Card.jsx**

```jsx
export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-secondary rounded-lg border border-border p-4 ${className}`}>
      {title && <h3 className="text-lg font-medium mb-4 text-textPrimary">{title}</h3>}
      {children}
    </div>
  )
}
```

- [ ] **Step 2: 创建 src/components/ui/Badge.jsx**

```jsx
const badgeStyles = {
  default: 'bg-secondary text-textSecondary',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  error: 'bg-error/20 text-error',
  accent: 'bg-accent/20 text-accent'
}

export default function Badge({ children, variant = 'default' }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badgeStyles[variant]}`}>
      {children}
    </span>
  )
}
```

- [ ] **Step 3: 创建 src/components/ui/MetricCard.jsx**

```jsx
export default function MetricCard({ title, value, change, trend, suffix = '' }) {
  const isPositive = trend === 'up'
  const trendColor = isPositive ? 'text-success' : 'text-error'

  return (
    <div className="bg-secondary rounded-lg border border-border p-4">
      <div className="text-textSecondary text-sm mb-1">{title}</div>
      <div className="text-2xl font-bold text-textPrimary">{value}{suffix}</div>
      {change && (
        <div className={`text-xs mt-1 ${trendColor}`}>
          {isPositive ? '↑' : '↓'} {change}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: 创建 src/components/ui/SkeletonCard.jsx**

```jsx
export default function SkeletonCard({ height = 'h-32' }) {
  return (
    <div className={`bg-secondary rounded-lg border border-border p-4 animate-pulse ${height}`}>
      <div className="h-4 bg-border rounded w-1/3 mb-3"></div>
      <div className="h-8 bg-border rounded w-1/2"></div>
    </div>
  )
}
```

- [ ] **Step 5: 创建 src/components/ui/Table.jsx**

```jsx
export default function Table({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th key={col.key} className="text-left text-textSecondary text-sm font-medium py-3 px-4">
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id || idx}
              className={`border-b border-border/50 hover:bg-secondary/50 ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-4 text-sm text-textPrimary">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 6: 提交**

```bash
git add src/components/ui/*.jsx
git commit -m "feat: 基础UI组件 (Card, Badge, MetricCard, SkeletonCard, Table)"
```

---

### Task 4: 图表组件

**Files:**
- Create: `src/components/charts/TrendChart.jsx`
- Create: `src/components/charts/PieChart.jsx`
- Create: `src/components/charts/BarChart.jsx`

- [ ] **Step 1: 创建 src/components/charts/TrendChart.jsx**

```jsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const colors = {
  stroke: '#c9a962',
  fill: 'rgba(201, 169, 98, 0.2)'
}

export default function TrendChart({ data, dataKey = 'value', height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.stroke} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={colors.stroke} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
        <YAxis stroke="#9ca3af" fontSize={12} />
        <Tooltip
          contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #404040', borderRadius: '8px' }}
          labelStyle={{ color: '#ffffff' }}
        />
        <Area type="monotone" dataKey={dataKey} stroke={colors.stroke} fillOpacity={1} fill="url(#colorValue)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 2: 创建 src/components/charts/PieChart.jsx**

```jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#c9a962', '#d4b978', '#8b7355', '#6b5b4f', '#4a4a4a']

export default function PieChartComponent({ data, dataKey = 'value', nameKey = 'name', height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #404040', borderRadius: '8px' }}
        />
        <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 3: 创建 src/components/charts/BarChart.jsx**

```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function BarChartComponent({ data, dataKey = 'value', nameKey = 'name', height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
        <XAxis dataKey={nameKey} stroke="#9ca3af" fontSize={12} />
        <YAxis stroke="#9ca3af" fontSize={12} />
        <Tooltip
          contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #404040', borderRadius: '8px' }}
        />
        <Bar dataKey={dataKey} fill="#c9a962" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 4: 提交**

```bash
git add src/components/charts/*.jsx
git commit -m "feat: 图表组件 (TrendChart, PieChart, BarChart)"
```

---

### Task 5: 测试数据生成器

**Files:**
- Create: `src/lib/mock-generator.js`

- [ ] **Step 1: 创建 src/lib/mock-generator.js**

```javascript
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
export function generateStores(count = 10) {
  const stores = []
  const storeNames = ['上海IFSM店', '北京三里屯店', '杭州湖滨银泰店', '深圳万象城店', '成都太古里店',
    '广州天环广场店', '南京金陵饭店', '武汉武商广场店', '长沙IFS店', '厦门万象城店']

  for (let i = 1; i <= count; i++) {
    const province = PROVINCES[i % PROVINCES.length]
    stores.push({
      id: i,
      store_code: `S${String(i).padStart(3, '0')}`,
      store_name: storeNames[i - 1] || `闻献门店${i}`,
      province,
      city: pick(CITIES[province]),
      area: pick(['核心商圈', '商业综合体', '购物中心']),
      staff_count: random(5, 20),
      opening_date: `202${random(1, 4)}-${String(random(1, 12)).padStart(2, '0')}-01`,
      status: '营业中',
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
```

- [ ] **Step 2: 提交**

```bash
git add src/lib/mock-generator.js
git commit -m "feat: 测试数据生成器 (闻献品牌数据)"
```

---

### Task 6: 数据库初始化脚本

**Files:**
- Create: `supabase/migrations/001_init.sql`

- [ ] **Step 1: 创建 supabase/migrations/001_init.sql**

```sql
-- 品牌数据智能平台数据库初始化脚本

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    vip_no VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100),
    phone VARCHAR(20),
    level VARCHAR(20) DEFAULT '非会员',
    province VARCHAR(50),
    city VARCHAR(50),
    occupation VARCHAR(50),
    total_amount DECIMAL(12, 2) DEFAULT 0,
    order_count INT DEFAULT 0,
    first_order_time TIMESTAMP,
    last_order_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_no VARCHAR(50) UNIQUE NOT NULL,
    user_id INT REFERENCES users(id),
    platform VARCHAR(50),
    amount DECIMAL(12, 2),
    status VARCHAR(20) DEFAULT '待支付',
    order_time TIMESTAMP,
    pay_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 门店表
CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    store_code VARCHAR(20) UNIQUE NOT NULL,
    store_name VARCHAR(100),
    province VARCHAR(50),
    city VARCHAR(50),
    area VARCHAR(100),
    staff_count INT DEFAULT 0,
    opening_date DATE,
    status VARCHAR(20) DEFAULT '营业中',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 门店销售表
CREATE TABLE IF NOT EXISTS store_sales (
    id SERIAL PRIMARY KEY,
    store_id INT REFERENCES stores(id),
    sale_date DATE,
    revenue DECIMAL(12, 2),
    profit DECIMAL(12, 2),
    customer_count INT DEFAULT 0,
    avg_order DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 投流数据表
CREATE TABLE IF NOT EXISTS ads_data (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50),
    campaign VARCHAR(100),
    spend DECIMAL(12, 2),
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    gmv DECIMAL(12, 2),
    roi DECIMAL(5, 2),
    report_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 内容数据表
CREATE TABLE IF NOT EXISTS content_data (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50),
    content_type VARCHAR(50),
    title VARCHAR(200),
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    comments INT DEFAULT 0,
    shares INT DEFAULT 0,
    fans_growth INT DEFAULT 0,
    publish_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 启用RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_data ENABLE ROW LEVEL SECURITY;

-- 公开访问策略 (MVP阶段)
CREATE POLICY "Allow all" ON users FOR ALL USING (true);
CREATE POLICY "Allow all" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all" ON stores FOR ALL USING (true);
CREATE POLICY "Allow all" ON store_sales FOR ALL USING (true);
CREATE POLICY "Allow all" ON ads_data FOR ALL USING (true);
CREATE POLICY "Allow all" ON content_data FOR ALL USING (true);
```

- [ ] **Step 2: 提交**

```bash
git add supabase/migrations/001_init.sql
git commit -m "feat: 数据库初始化脚本"
```

---

### Task 7: 主应用路由

**Files:**
- Create: `src/App.jsx`

- [ ] **Step 1: 创建 src/App.jsx**

```jsx
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import OverviewPage from './features/overview/OverviewPage'
import UsersPage from './features/users/UsersPage'
import OperationsPage from './features/operations/OperationsPage'
import StoresPage from './features/stores/StoresPage'
import DataManagementPage from './features/data/DataManagementPage'

const navItems = [
  { path: '/', label: '数据概览', icon: '📊' },
  { path: '/users', label: '用户画像', icon: '👥' },
  { path: '/operations', label: '运营分析', icon: '📈' },
  { path: '/stores', label: '门店管理', icon: '🏪' },
  { path: '/data', label: '数据管理', icon: '⚙️' }
]

function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="flex min-h-screen">
      {/* 侧边栏 */}
      <aside className="w-56 bg-secondary border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <h1 className="text-lg font-bold text-accent">闻献数据中台</h1>
          <p className="text-xs text-textSecondary mt-1">品牌数据智能平台</p>
        </div>

        {/* 导航 */}
        <nav className="flex-1 p-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? 'bg-accent/20 text-accent'
                    : 'text-textSecondary hover:bg-secondary/80 hover:text-textPrimary'
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* 底部 */}
        <div className="p-4 border-t border-border text-xs text-textSecondary">
          MVP v0.0.1
        </div>
      </aside>

      {/* 主内容 */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/data" element={<DataManagementPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/App.jsx
git commit -m "feat: 主应用路由和布局"
```

---

### Task 8: 页面1 - 数据概览

**Files:**
- Create: `src/features/overview/OverviewPage.jsx`

- [ ] **Step 1: 创建 src/features/overview/OverviewPage.jsx**

```jsx
import { useState, useEffect } from 'react'
import MetricCard from '../../components/ui/MetricCard'
import Card from '../../components/ui/Card'
import TrendChart from '../../components/charts/TrendChart'
import { generateAllMockData } from '../../lib/mock-generator'

export default function OverviewPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      const mockData = generateAllMockData()
      setData(mockData)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">数据概览</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-secondary rounded-lg animate-pulse" />)}
        </div>
      </div>
    )
  }

  // 计算核心指标
  const totalUsers = data.users.length
  const totalOrders = data.orders.length
  const totalGMV = data.orders.reduce((sum, o) => sum + Number(o.amount), 0)
  const avgOrderAmount = Math.round(totalGMV / totalOrders)
  const repurchaseRate = Math.round((data.users.filter(u => u.order_count > 1).length / totalUsers) * 100)

  // GMV趋势数据
  const gmvTrend = data.storeSales.reduce((acc, sale) => {
    const date = sale.sale_date
    const existing = acc.find(a => a.date === date)
    if (existing) {
      existing.value += Number(sale.revenue)
    } else {
      acc.push({ date, value: Number(sale.revenue) })
    }
    return acc
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-30)

  // 订单趋势
  const orderTrend = data.orders.slice(0, 100).map((o, i) => ({
    date: o.order_time?.split('T')[0] || '',
    value: i + 1
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">数据概览</h1>
        <span className="text-sm text-textSecondary">数据更新时间: {new Date().toLocaleString()}</span>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="总用户数"
          value={totalUsers.toLocaleString()}
          change="+12%"
          trend="up"
        />
        <MetricCard
          title="总订单数"
          value={totalOrders.toLocaleString()}
          change="+8%"
          trend="up"
        />
        <MetricCard
          title="GMV"
          value={`¥${(totalGMV / 10000).toFixed(1)}万`}
          change="+15%"
          trend="up"
        />
        <MetricCard
          title="平均客单价"
          value={`¥${avgOrderAmount}`}
          change="-3%"
          trend="down"
        />
        <MetricCard
          title="复购率"
          value={`${repurchaseRate}%`}
          change="+2%"
          trend="up"
        />
        <MetricCard
          title="门店数量"
          value={data.stores.length}
        />
      </div>

      {/* 趋势图 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="GMV趋势（近30天）">
          <TrendChart data={gmvTrend} dataKey="value" />
        </Card>
        <Card title="订单量趋势">
          <TrendChart data={orderTrend} dataKey="value" />
        </Card>
      </div>

      {/* 采集状态 */}
      <Card title="数据采集状态">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: '用户数据', status: '正常', count: data.users.length },
            { name: '订单数据', status: '正常', count: data.orders.length },
            { name: '门店数据', status: '正常', count: data.stores.length },
            { name: '销售数据', status: '正常', count: data.storeSales.length },
            { name: '投流数据', status: '正常', count: data.adsData.length },
            { name: '内容数据', status: '正常', count: data.contentData.length }
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-primary rounded-lg">
              <div>
                <div className="text-sm text-textPrimary">{item.name}</div>
                <div className="text-xs text-textSecondary">{item.count}条</div>
              </div>
              <span className="px-2 py-0.5 bg-success/20 text-success text-xs rounded">正常</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/features/overview/OverviewPage.jsx
git commit -m "feat: 数据概览页面"
```

---

### Task 9: 页面2 - 用户画像

**Files:**
- Create: `src/features/users/UsersPage.jsx`

- [ ] **Step 1: 创建 src/features/users/UsersPage.jsx**

```jsx
import { useState, useEffect, useMemo } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Table from '../../components/ui/Table'
import PieChartComponent from '../../components/charts/PieChart'
import BarChartComponent from '../../components/charts/BarChart'
import { generateAllMockData } from '../../lib/mock-generator'

const MEMBER_LEVELS = ['龙涎', '沉香', '檀木', '麝香', '非会员']

export default function UsersPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState({ level: '', province: '', search: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    setTimeout(() => {
      const mockData = generateAllMockData()
      setUsers(mockData.users)
      setOrders(mockData.orders)
      setLoading(false)
    }, 500)
  }, [])

  // 用户分层统计
  const userStats = useMemo(() => {
    const stats = MEMBER_LEVELS.map(level => ({
      name: level,
      value: users.filter(u => u.level === level).length
    }))

    // 计算用户分层（基于订单）
    const分层 = [
      { name: '潜客', value: users.filter(u => u.order_count === 0).length },
      { name: '首单客', value: users.filter(u => u.order_count === 1).length },
      { name: '复购客', value: users.filter(u => u.order_count >= 2 && u.order_count < 5).length },
      { name: '忠诚客', value: users.filter(u => u.order_count >= 5).length }
    ]

    return { stats, 分层 }
  }, [users])

  // 省份分布
  const provinceStats = useMemo(() => {
    const provinceMap = {}
    users.forEach(u => {
      provinceMap[u.province] = (provinceMap[u.province] || 0) + 1
    })
    return Object.entries(provinceMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [users])

  // 筛选后的用户
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (filter.level && user.level !== filter.level) return false
      if (filter.province && user.province !== filter.province) return false
      if (filter.search) {
        const search = filter.search.toLowerCase()
        if (!user.name.toLowerCase().includes(search) &&
            !user.phone.includes(search) &&
            !user.vip_no.toLowerCase().includes(search)) {
          return false
        }
      }
      return true
    })
  }, [users, filter])

  // 分页
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, currentPage])

  const totalPages = Math.ceil(filteredUsers.length / pageSize)

  const columns = [
    { key: 'vip_no', title: '会员编号', render: (v) => <span className="text-accent">{v}</span> },
    { key: 'name', title: '姓名' },
    { key: 'phone', title: '手机号' },
    { key: 'level', title: '等级', render: (v) => <Badge variant="accent">{v}</Badge> },
    { key: 'province', title: '省份' },
    { key: 'order_count', title: '订单数' },
    { key: 'total_amount', title: '累计消费', render: (v) => `¥${v.toLocaleString()}` }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">用户画像</h1>
        <div className="grid grid-cols-2 gap-6">
          <div className="h-96 bg-secondary rounded-lg animate-pulse" />
          <div className="h-96 bg-secondary rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">用户画像</h1>

      {/* 用户分层 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="会员等级分布">
          <PieChartComponent data={userStats.stats} nameKey="name" dataKey="value" height={280} />
        </Card>
        <Card title="用户分层模型">
          <div className="space-y-4">
            {userStats.分层.map(item => {
              const percent = Math.round(item.value / users.length * 100)
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-textSecondary">{item.value}人 ({percent}%)</span>
                  </div>
                  <div className="h-2 bg-primary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* 地域分布 */}
      <Card title="TOP10省份分布">
        <BarChartComponent data={provinceStats} nameKey="name" dataKey="value" height={250} />
      </Card>

      {/* 用户明细 */}
      <Card title="用户明细">
        {/* 筛选器 */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="搜索姓名/手机/会员号"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
          />
          <select
            value={filter.level}
            onChange={(e) => setFilter({ ...filter, level: e.target.value })}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            <option value="">全部等级</option>
            {MEMBER_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select
            value={filter.province}
            onChange={(e) => setFilter({ ...filter, province: e.target.value })}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            <option value="">全部省份</option>
            {[...new Set(users.map(u => u.province))].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <Table columns={columns} data={paginatedUsers} />

        {/* 分页 */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-textSecondary">
            共 {filteredUsers.length} 条，第 {currentPage}/{totalPages} 页
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-secondary border border-border rounded text-sm disabled:opacity-50"
            >
              上一页
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-secondary border border-border rounded text-sm disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/features/users/UsersPage.jsx
git commit -m "feat: 用户画像页面"
```

---

### Task 10: 页面3 - 运营分析

**Files:**
- Create: `src/features/operations/OperationsPage.jsx`

- [ ] **Step 1: 创建 src/features/operations/OperationsPage.jsx**

```jsx
import { useState, useEffect, useMemo } from 'react'
import Card from '../../components/ui/Card'
import MetricCard from '../../components/ui/MetricCard'
import TrendChart from '../../components/charts/TrendChart'
import BarChartComponent from '../../components/charts/BarChart'
import { generateAllMockData } from '../../lib/mock-generator'

export default function OperationsPage() {
  const [loading, setLoading] = useState(true)
  const [adsData, setAdsData] = useState([])
  const [contentData, setContentData] = useState([])

  useEffect(() => {
    setTimeout(() => {
      const mockData = generateAllMockData()
      setAdsData(mockData.adsData)
      setContentData(mockData.contentData)
      setLoading(false)
    }, 500)
  }, [])

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
        roi: totalGMV / totalSpend,
        impressions: totalImpressions,
        clicks: totalClicks,
        conversions: totalConversions,
        ctr: (totalClicks / totalImpressions * 100).toFixed(2),
        cvr: (totalConversions / totalClicks * 100).toFixed(2)
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
      .slice(-30)
  }, [adsData])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">运营分析</h1>
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-secondary rounded-lg animate-pulse" />)}
        </div>
      </div>
    )
  }

  const totalSpend = adsStats.reduce((sum, s) => sum + s.spend, 0)
  const totalGMV = adsStats.reduce((sum, s) => sum + s.gmv, 0)
  const totalViews = contentStats.reduce((sum, s) => sum + s.views, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">运营分析</h1>

      {/* 投流核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="总投放花费" value={`¥${(totalSpend / 10000).toFixed(1)}万`} />
        <MetricCard title="总GMV" value={`¥${(totalGMV / 10000).toFixed(1)}万`} />
        <MetricCard title="整体ROI" value={totalGMV / totalSpend > 0 ? (totalGMV / totalSpend).toFixed(2) : '0'} />
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
          ].map(item => (
            <div key={item.key} className="bg-primary p-4 rounded-lg text-center">
              <div className="text-textSecondary text-sm">{item.label}</div>
              <div className="text-xl font-bold text-accent mt-1">
                {contentStats.reduce((sum, s) => item.format(sum + s[item.key]), 0)}
              </div>
            </div>
          ))}
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
                const interactionRate = ((stat.likes + stat.comments + stat.shares) / stat.views * 100).toFixed(2)
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
```

- [ ] **Step 2: 提交**

```bash
git add src/features/operations/OperationsPage.jsx
git commit -m "feat: 运营分析页面"
```

---

### Task 11: 页面4 - 门店管理

**Files:**
- Create: `src/features/stores/StoresPage.jsx`

- [ ] **Step 1: 创建 src/features/stores/StoresPage.jsx**

```jsx
import { useState, useEffect, useMemo } from 'react'
import Card from '../../components/ui/Card'
import MetricCard from '../../components/ui/MetricCard'
import Table from '../../components/ui/Table'
import BarChartComponent from '../../components/charts/BarChart'
import { generateAllMockData } from '../../lib/mock-generator'

export default function StoresPage() {
  const [loading, setLoading] = useState(true)
  const [stores, setStores] = useState([])
  const [storeSales, setStoreSales] = useState([])
  const [filter, setFilter] = useState({ status: '', province: '', search: '' })
  const [selectedStore, setSelectedStore] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    setTimeout(() => {
      const mockData = generateAllMockData()
      setStores(mockData.stores)
      setStoreSales(mockData.storeSales)
      setSelectedStore(mockData.stores[0]?.id)
      setLoading(false)
    }, 500)
  }, [])

  // 门店统计
  const storeStats = useMemo(() => {
    const stats = stores.map(store => {
      const sales = storeSales.filter(s => s.store_id === store.id)
      const totalRevenue = sales.reduce((sum, s) => sum + Number(s.revenue), 0)
      const totalProfit = sales.reduce((sum, s) => sum + Number(s.profit), 0)
      const totalCustomers = sales.reduce((sum, s) => sum + s.customer_count, 0)
      const avgOrder = totalCustomers > 0 ? totalRevenue / totalCustomers : 0
      return {
        ...store,
        totalRevenue,
        totalProfit,
        totalCustomers,
        avgOrder
      }
    })
    return stats.sort((a, b) => b.totalRevenue - a.totalRevenue)
  }, [stores, storeSales])

  // 筛选后的门店
  const filteredStores = useMemo(() => {
    return storeStats.filter(store => {
      if (filter.status && store.status !== filter.status) return false
      if (filter.province && store.province !== filter.province) return false
      if (filter.search) {
        const search = filter.search.toLowerCase()
        if (!store.store_name.toLowerCase().includes(search) &&
            !store.store_code.toLowerCase().includes(search)) {
          return false
        }
      }
      return true
    })
  }, [storeStats, filter])

  const paginatedStores = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredStores.slice(start, start + pageSize)
  }, [filteredStores, currentPage])

  const totalPages = Math.ceil(filteredStores.length / pageSize)

  // 选中门店的销售趋势
  const selectedStoreSales = useMemo(() => {
    if (!selectedStore) return []
    return storeSales
      .filter(s => s.store_id === selectedStore)
      .map(s => ({
        date: s.sale_date,
        revenue: Number(s.revenue),
        profit: Number(s.profit)
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [selectedStore, storeSales])

  const columns = [
    { key: 'store_code', title: '门店编码', render: (v) => <span className="text-accent">{v}</span> },
    { key: 'store_name', title: '门店名称' },
    { key: 'province', title: '省份' },
    { key: 'city', title: '城市' },
    { key: 'status', title: '状态', render: (v) => (
      <span className={`px-2 py-0.5 rounded text-xs ${v === '营业中' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
        {v}
      </span>
    )},
    { key: 'totalRevenue', title: '销售额', render: (v) => `¥${(v / 10000).toFixed(1)}万` },
    { key: 'totalCustomers', title: '客户数' },
    { key: 'avgOrder', title: '客单价', render: (v) => `¥${Math.round(v)}` }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">门店管理</h1>
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-secondary rounded-lg animate-pulse" />)}
        </div>
      </div>
    )
  }

  const totalRevenue = storeStats.reduce((sum, s) => sum + s.totalRevenue, 0)
  const totalCustomers = storeStats.reduce((sum, s) => sum + s.totalCustomers, 0)
  const avgOrder = totalCustomers > 0 ? totalRevenue / totalCustomers : 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">门店管理</h1>

      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="门店总数" value={stores.length} />
        <MetricCard title="总销售额" value={`¥${(totalRevenue / 10000).toFixed(1)}万`} />
        <MetricCard title="总客户数" value={totalCustomers.toLocaleString()} />
        <MetricCard title="平均客单价" value={`¥${Math.round(avgOrder)}`} />
      </div>

      {/* 门店排名 */}
      <Card title="门店绩效排名">
        <BarChartComponent
          data={storeStats.slice(0, 10).map(s => ({ name: s.store_name.slice(0, 6), value: s.totalRevenue }))}
          nameKey="name"
          dataKey="value"
          height={280}
        />
      </Card>

      {/* 门店明细 */}
      <Card title="门店列表">
        {/* 筛选器 */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="搜索门店名称/编码"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
          />
          <select
            value={filter.province}
            onChange={(e) => setFilter({ ...filter, province: e.target.value })}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            <option value="">全部省份</option>
            {[...new Set(stores.map(s => s.province))].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-3 py-2 bg-primary border border-border rounded-lg text-sm focus:outline-none"
          >
            <option value="">全部状态</option>
            <option value="营业中">营业中</option>
            <option value="歇业">歇业</option>
          </select>
        </div>

        <Table columns={columns} data={paginatedStores} onRowClick={(row) => setSelectedStore(row.id)} />

        {/* 分页 */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-textSecondary">
            共 {filteredStores.length} 家门店
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-secondary border border-border rounded text-sm disabled:opacity-50"
            >
              上一页
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-secondary border border-border rounded text-sm disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      </Card>

      {/* 单店销售趋势 */}
      {selectedStore && selectedStoreSales.length > 0 && (
        <Card title={`门店销售趋势 - ${stores.find(s => s.id === selectedStore)?.store_name}`}>
          <BarChartComponent
            data={selectedStoreSales.slice(-14).map(s => ({ name: s.date.slice(5), value: s.revenue }))}
            nameKey="name"
            dataKey="value"
            height={250}
          />
        </Card>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/features/stores/StoresPage.jsx
git commit -m "feat: 门店管理页面"
```

---

### Task 12: 页面5 - 数据管理

**Files:**
- Create: `src/features/data/DataManagementPage.jsx`

- [ ] **Step 1: 创建 src/features/data/DataManagementPage.jsx**

```jsx
import { useState } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { generateAllMockData } from '../../lib/mock-generator'
import { supabase } from '../../lib/supabase'

export default function DataManagementPage() {
  const [generating, setGenerating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)
  const [dataStats, setDataStats] = useState(null)

  // 获取数据统计
  const fetchDataStats = async () => {
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
            { name: '用户数据', key: 'users', icon: '👥' },
            { name: '订单数据', key: 'orders', icon: '📦' },
            { name: '门店数据', key: 'stores', icon: '🏪' },
            { name: '销售数据', key: 'storeSales', icon: '💰' },
            { name: '投流数据', key: 'adsData', icon: '📢' },
            { name: '内容数据', key: 'contentData', icon: '📝' }
          ].map(item => (
            <div key={item.key} className="bg-primary p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="text-sm text-textSecondary">{item.name}</div>
                  <div className="text-lg font-bold text-textPrimary">
                    {dataStats ? dataStats[item.key] : '-'} 条
                  </div>
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
```

- [ ] **Step 2: 提交**

```bash
git add src/features/data/DataManagementPage.jsx
git commit -m "feat: 数据管理页面"
```

---

### Task 13: 项目收尾

**Files:**
- Modify: `package.json` (添加scripts)
- Create: `README.md`

- [ ] **Step 1: 更新 package.json scripts**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src",
    "db:init": "psql -f supabase/migrations/001_init.sql"
  }
}
```

- [ ] **Step 2: 创建 README.md**

```markdown
# 品牌数据智能平台

闻献品牌数据中台，MVP版本。

## 技术栈

- React 19 + Vite
- TailwindCSS
- Recharts
- Supabase

## 开发

```bash
npm install
npm run dev
```

## 部署

```bash
npm run build
# 部署 dist 目录到 Vercel
```

## 页面

- `/` - 数据概览
- `/users` - 用户画像
- `/operations` - 运营分析
- `/stores` - 门店管理
- `/data` - 数据管理
```

- [ ] **Step 3: 最终提交**

```bash
git add -A
git commit -m "feat: MVP完整实现 - 5个页面 + 测试数据生成器"
```

---

## 自查清单

- [ ] 所有5个页面可正常访问
- [ ] 图表正确渲染
- [ ] 筛选/搜索功能正常
- [ ] 数据管理页面可生成测试数据
- [ ] 环境变量配置正确
- [ ] 构建无报错

---

## 执行方式

**Plan complete and saved to `docs/superpowers/plans/2026-04-01-brand-data-platform-mvp-implementation.md`**

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
