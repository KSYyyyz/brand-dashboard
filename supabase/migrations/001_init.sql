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
