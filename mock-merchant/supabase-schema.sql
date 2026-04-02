-- 闻献商户交易数据表
CREATE TABLE IF NOT EXISTS merchant_transactions (
  id BIGSERIAL PRIMARY KEY,
  order_no VARCHAR(50) UNIQUE NOT NULL,
  order_time TIMESTAMPTZ NOT NULL,
  store_id INTEGER NOT NULL,
  store_name VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  product_id INTEGER NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  original_price INTEGER NOT NULL,
  final_amount INTEGER NOT NULL,
  discount DECIMAL(3,2) NOT NULL,
  discount_amount INTEGER NOT NULL,
  profit INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  member_level VARCHAR(20) NOT NULL,
  points_earned INTEGER DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT '已完成',
  hour INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_transactions_order_time ON merchant_transactions(order_time);
CREATE INDEX IF NOT EXISTS idx_transactions_store_id ON merchant_transactions(store_id);
CREATE INDEX IF NOT EXISTS idx_transactions_product_id ON merchant_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_transactions_platform ON merchant_transactions(platform);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON merchant_transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_member_level ON merchant_transactions(member_level);
CREATE INDEX IF NOT EXISTS idx_transactions_city ON merchant_transactions(city);

-- RLS 策略（公开读写）
ALTER TABLE merchant_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON merchant_transactions FOR ALL USING (true) WITH CHECK (true);