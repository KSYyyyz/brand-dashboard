# 品牌数据智能平台 MVP 设计文档

> 创建时间：2026-04-01
> 状态：已批准
> 品牌：闻献

---

## 一、项目概述

### 1.1 项目定位

用数据驱动产品开发和营销投放的智能决策系统，定位为品牌数据中台。

### 1.2 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | React 19 + Vite | 现有基础设施 |
| UI框架 | TailwindCSS | 快速响应式开发 |
| 图表库 | Recharts | 已有依赖 |
| 后端/数据库 | Supabase | 已有基础设施 |
| 部署 | Vercel | 已有基础设施 |
| 数据生成 | Mock数据生成器 | 自研 |

### 1.3 品牌风格（闻献）

- **色调**：深色系（黑色庙宇空间）
- **主色**：深灰/墨黑 `#1a1a1a` + 金色点缀 `#c9a962`
- **字体**：简洁现代
- **布局**：数据优先、留白充足

---

## 二、数据模型

### 2.1 用户表 (users)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | serial | 主键 |
| vip_no | varchar | 会员编号 (VIPxxxxx) |
| name | varchar | 姓名 |
| phone | varchar | 手机号 |
| level | varchar | 会员等级 |
| province | varchar | 省份 |
| city | varchar | 城市 |
| occupation | varchar | 职业 |
| total_amount | decimal | 累计消费 |
| order_count | int | 订单数 |
| first_order_time | timestamp | 首单时间 |
| last_order_time | timestamp | 最近订单时间 |
| created_at | timestamp | 创建时间 |

**会员等级（闻献体系）**：
- 龙涎（最高）
- 沉香
- 檀木
- 麝香
- 非会员

**用户分层**：

| 层级 | 定义 | 占比目标 |
|------|------|----------|
| 潜客 | 浏览未购买 | 60% |
| 首单客 | 首单用户 | 15% |
| 复购客 | 复购2次+ | 15% |
| 忠诚客 | 复购5次+ | 5% |
| 流失预警 | 30天未活跃 | 5% |

### 2.2 订单表 (orders)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | serial | 主键 |
| order_no | varchar | 订单号 |
| user_id | int | FK → users |
| platform | varchar | 平台来源 |
| amount | decimal | 订单金额 |
| status | varchar | 订单状态 |
| order_time | timestamp | 下单时间 |
| pay_time | timestamp | 支付时间 |
| created_at | timestamp | 创建时间 |

**平台来源**：
- 天猫 / 淘宝 / 京东 / 抖音 / 微信小程序 / 线下门店 / 未知

**订单状态**：
- 待支付 / 已支付 / 已发货 / 已完成 / 已退款

### 2.3 门店表 (stores)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | serial | 主键 |
| store_code | varchar | 门店编码 |
| store_name | varchar | 门店名称 |
| province | varchar | 省份 |
| city | varchar | 城市 |
| area | varchar | 商圈 |
| staff_count | int | 员工数 |
| opening_date | date | 开业日期 |
| status | varchar | 营业状态 |
| created_at | timestamp | 创建时间 |

### 2.4 门店销售表 (store_sales)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | serial | 主键 |
| store_id | int | FK → stores |
| sale_date | date | 销售日期 |
| revenue | decimal | 营业收入 |
| profit | decimal | 利润 |
| customer_count | int | 客户数 |
| avg_order | decimal | 客单价 |
| created_at | timestamp | 创建时间 |

### 2.5 投流数据表 (ads_data)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | serial | 主键 |
| platform | varchar | 投放平台 |
| campaign | varchar | 投放计划 |
| spend | decimal | 花费 |
| impressions | int | 曝光 |
| clicks | int | 点击 |
| conversions | int | 转化 |
| gmv | decimal | GMV |
| roi | decimal | ROI |
| report_date | date | 报表日期 |
| created_at | timestamp | 创建时间 |

**投放平台**：抖音千川 / 腾讯广告 / 小红书 / 微博

### 2.6 内容数据表 (content_data)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | serial | 主键 |
| platform | varchar | 平台 |
| content_type | varchar | 内容类型 |
| title | varchar | 标题/话题 |
| views | int | 播放/浏览量 |
| likes | int | 点赞数 |
| comments | int | 评论数 |
| shares | int | 分享数 |
| fans_growth | int | 涨粉数 |
| publish_date | date | 发布日期 |
| created_at | timestamp | 创建时间 |

---

## 三、页面规划

### 3.1 页面列表

| 序号 | 页面 | 路由 | 模块 |
|------|------|------|------|
| 1 | 数据概览 | `/` | 中台基础 |
| 2 | 用户画像 | `/users` | A |
| 3 | 运营分析 | `/operations` | B |
| 4 | 门店管理 | `/stores` | 新增 |
| 5 | 数据管理 | `/data` | C |

### 3.2 页面详细设计

#### 页面1：数据概览

**路由**：`/`

**功能**：
1. **核心指标卡片**（4-6个）
   - 总用户数 + 本期新增
   - 总订单数 + GMV
   - 平均订单金额
   - 复购率

2. **趋势图**
   - GMV趋势（近30天）
   - 订单量趋势

3. **采集状态**
   - 各数据源接入状态
   - 最后更新时间

#### 页面2：用户画像

**路由**：`/users`

**功能**：
1. **用户分层看板**
   - 各层级用户数量 + 占比
   - 层级分布饼图

2. **地域分布**
   - 省份分布热力图/柱状图
   - TOP10城市

3. **用户明细**
   - 分页表格
   - 支持筛选（等级/省份/注册时间）
   - 支持搜索（手机号/姓名）

#### 页面3：运营分析

**路由**：`/operations`

**功能**：
1. **投流效率**
   - 各平台ROI对比
   - 投流趋势图

2. **内容表现**
   - 播放量/互动率趋势
   - 内容类型效果对比

3. **私域概览**
   - 社群活跃度
   - 裂变率

#### 页面4：门店管理

**路由**：`/stores`

**功能**：
1. **门店列表**
   - 门店名称/编码/城市/状态
   - 支持筛选和搜索

2. **销售数据**
   - 单店销售趋势
   - 门店排名

3. **绩效看板**
   - 门店GMV对比
   - 客单价对比

#### 页面5：数据管理

**路由**：`/data`

**功能**：
1. **测试数据生成**
   - 用户数据生成（500条）
   - 订单数据生成（1500条）
   - 门店数据生成（10条）
   - 投流/内容数据生成

2. **数据质量监控**
   - 缺失值统计
   - 异常值标记
   - 采集日志

---

## 四、目录结构

```
brand-data-platform/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Card.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Badge.jsx
│   │   └── charts/
│   │       ├── TrendChart.jsx
│   │       ├── PieChart.jsx
│   │       └── BarChart.jsx
│   ├── features/
│   │   ├── overview/
│   │   │   └── OverviewPage.jsx
│   │   ├── users/
│   │   │   └── UsersPage.jsx
│   │   ├── operations/
│   │   │   └── OperationsPage.jsx
│   │   ├── stores/
│   │   │   └── StoresPage.jsx
│   │   └── data/
│   │       └── DataManagementPage.jsx
│   ├── lib/
│   │   ├── supabase.js
│   │   └── mock-generator.js
│   └── styles/
│       └── theme.js
├── supabase/
│   └── migrations/
│       └── 001_init.sql
├── docs/
│   └── specs/
│       └── 2026-04-01-brand-data-platform-mvp-design.md
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

---

## 五、质量标准

### 5.1 代码规范

- ESLint + Prettier
- 组件文件不超过200行
- 样式使用TailwindCSS，不混用内联样式
- 环境变量统一管理（.env.example）

### 5.2 测试数据标准

**闻献品牌特征**：
- 定价：高端（单品500-3000元）
- 风格：禅酷CHANKU
- 浓度：15%-25%

**数据规模（MVP）**：
- 用户：500条
- 订单：1500条
- 门店：10条
- 投流数据：90条（3平台 x 30天）
- 内容数据：90条（3平台 x 30天）

### 5.3 验收标准

1. 所有5个页面可正常访问
2. 图表正确渲染
3. 筛选/搜索功能正常
4. 数据管理页面可重新生成测试数据
5. 部署到Vercel无报错

---

## 六、部署信息

| 服务 | URL/配置 |
|------|----------|
| Supabase URL | https://szeitkdhonapdzvdtaot.supabase.co |
| Vercel | 待配置 |
| GitHub | brand-data-platform (新建) |

---

## 七、后续扩展

### Phase 2
- 用户画像深度分析
- 投流智能优化建议
- 自动周报生成

### Phase 3
- 实时数据采集
- 竞品监控
- 供应链数据集成
