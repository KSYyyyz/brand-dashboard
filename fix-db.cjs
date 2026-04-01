import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://szeitkdhonapdzvdtaot.supabase.co'
const supabaseKey = 'sb_publishable_L9bCfa5SJigYfd8xe16Lpw_EZtldrg2'
const supabase = createClient(supabaseUrl, supabaseKey)

async function fixAndUpload() {
  console.log('删除所有旧表...')

  // 删除现有表(按依赖顺序)
  await supabase.rpc('run_sql', {
    query: 'DROP TABLE IF EXISTS content_data CASCADE'
  }).catch(() => {})
  await supabase.rpc('run_sql', {
    query: 'DROP TABLE IF EXISTS ads_data CASCADE'
  }).catch(() => {})
  await supabase.rpc('run_sql', {
    query: 'DROP TABLE IF EXISTS store_sales CASCADE'
  }).catch(() => {})
  await supabase.rpc('run_sql', {
    query: 'DROP TABLE IF EXISTS orders CASCADE'
  }).catch(() => {})
  await supabase.rpc('run_sql', {
    query: 'DROP TABLE IF EXISTS stores CASCADE'
  }).catch(() => {})
  await supabase.rpc('run_sql', {
    query: 'DROP TABLE IF EXISTS users CASCADE'
  }).catch(() => {})

  console.log('开始创建表结构...')

  // 创建用户表
  let { error } = await supabase.rpc('run_sql', {
    query: `
      CREATE TABLE users (
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
    `
  })
  if (error) console.log('用户表创建:', error.message || '成功')

  // 创建订单表
  ;({ error } = await supabase.rpc('run_sql', {
    query: `
      CREATE TABLE orders (
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
    `
  }))
  if (error) console.log('订单表创建:', error.message || '成功')

  // 创建门店表
  ;({ error } = await supabase.rpc('run_sql', {
    query: `
      CREATE TABLE stores (
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
    `
  }))
  if (error) console.log('门店表创建:', error.message || '成功')

  // 创建销售表
  ;({ error } = await supabase.rpc('run_sql', {
    query: `
      CREATE TABLE store_sales (
        id SERIAL PRIMARY KEY,
        store_id INT REFERENCES stores(id),
        sale_date DATE,
        revenue DECIMAL(12, 2),
        profit DECIMAL(12, 2),
        customer_count INT DEFAULT 0,
        avg_order DECIMAL(12, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `
  }))
  if (error) console.log('销售表创建:', error.message || '成功')

  // 创建投流表
  ;({ error } = await supabase.rpc('run_sql', {
    query: `
      CREATE TABLE ads_data (
        id SERIAL PRIMARY KEY,
        platform VARCHAR(50),
        campaign VARCHAR(100),
        spend DECIMAL(12, 2),
        impressions INT DEFAULT 0,
        clicks INT DEFAULT 0,
        conversions INT DEFAULT 0,
        gmv DECIMAL(12, 2),
        roi DECIMAL(10, 2),
        report_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `
  }))
  if (error) console.log('投流表创建:', error.message || '成功')

  // 创建内容表
  ;({ error } = await supabase.rpc('run_sql', {
    query: `
      CREATE TABLE content_data (
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
    `
  }))
  if (error) console.log('内容表创建:', error.message || '成功')

  console.log('表创建完成')
}

fixAndUpload()
