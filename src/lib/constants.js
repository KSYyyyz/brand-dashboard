// 闻献品牌真实商品数据 - 内嵌到代码
export const PRODUCTS = [
  // 浓香水
  { id: 1, name: '初熟之物 NAIVE', category: '浓香水', price: 2980 },
  { id: 2, name: '体物入微 SENSITIVE', category: '浓香水', price: 2980 },
  { id: 3, name: '夜漠回声 OFF', category: '浓香水', price: 2680 },
  { id: 4, name: '柔韧荆棘 Tough Love', category: '浓香水', price: 2680 },
  { id: 5, name: '腹语之术 Stock', category: '浓香水', price: 2880 },
  { id: 6, name: '席地而坐 Mat', category: '浓香水', price: 2880 },
  { id: 7, name: '席地而坐 SIT', category: '浓香水', price: 1750 },
  { id: 8, name: '羁旅归途 WONDER', category: '浓香水', price: 1750 },
  { id: 9, name: '相拥之后 HUG', category: '浓香水', price: 1750 },
  { id: 10, name: '芳草留痕 LAY', category: '浓香水', price: 1750 },
  { id: 11, name: '灵光没顶 THINK', category: '浓香水', price: 1750 },
  { id: 12, name: '空无一木 VOID', category: '浓香水', price: 1750 },
  { id: 13, name: '羽化仙 FEATHER', category: '浓香水', price: 3280 },
  { id: 14, name: '杉间', category: '浓香水', price: 2880 },
  { id: 15, name: '蛮柚', category: '浓香水', price: 2680 },
  { id: 16, name: '丹沉', category: '浓香水', price: 3280 },
  { id: 17, name: '赤檀', category: '浓香水', price: 3280 },
  { id: 18, name: '龙吟', category: '浓香水', price: 3580 },
  { id: 19, name: '麝语', category: '浓香水', price: 3580 },
  // 身体护理
  { id: 20, name: '初熟之物洗发水', category: '身体护理', price: 395 },
  { id: 21, name: '体物入微护发素', category: '身体护理', price: 395 },
  { id: 22, name: '初熟之物身体乳', category: '身体护理', price: 520 },
  { id: 23, name: '体物入微护手霜', category: '身体护理', price: 295 },
  { id: 24, name: '初熟之物洗手液', category: '身体护理', price: 295 },
  // 香薰
  { id: 25, name: '银炭滴香', category: '香薰', price: 1680 },
  { id: 26, name: '电子香薰机', category: '香薰', price: 980 },
  { id: 27, name: '车载香氛', category: '香薰', price: 480 }
]

// 闻献真实门店数据 - 内嵌到代码
export const STORES = [
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

// 门店状态映射
export const STORE_STATUS = {
  '夜庙': '升级中',
  '亮堂空间': '已关闭',
  '方舟ARK': '快闪店',
  '红房子': '快闪店'
}

// 系列映射
export const COLLECTION_KEYWORDS = {
  '第一季': ['初熟之物', '体物入微', '夜漠回声', '柔韧荆棘', '腹语之术', '席地而坐'],
  '第二季': ['SIT', '羁旅归途', '相拥之后', '芳草留痕', '灵光没顶', '空无一木'],
  '第四季': ['羽化仙'],
  '第五季': ['杉间'],
  '第六季': ['蛮柚'],
  '第七季': ['丹沉', '赤檀', '龙吟', '麝语'],
  '香氛洗护': ['洗发水', '护发素', '身体乳', '护手霜', '洗手液']
}

export function getCollection(productName) {
  for (const [collection, keywords] of Object.entries(COLLECTION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (productName.includes(keyword)) return collection
    }
  }
  return '其他'
}
