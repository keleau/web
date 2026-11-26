/* 首页内容数据：图片均为本地素材，避免外部生成接口的不稳定 */

export interface HeroItem {
  id: string
  title: string
  desc: string
  spec: string
  image: string
}

export const heroItems: HeroItem[] = [
  {
    id: 'vertex-texture',
    title: '修模师福音：一键顶点色转贴图',
    desc: '上传顶点色模型，一键烘焙贴图，直接进入全彩打印',
    spec: '顶点烘焙 · 20 分钟',
    image: '/images/home/hero-1.jpg',
  },
  {
    id: 'pet-figurine',
    title: '照片级还原-写实宠物手办',
    desc: '一张照片还原毛发细节，生成可打印的写实宠物手办',
    spec: '全彩树脂 · 高 120 mm',
    image: '/images/home/hero-2.jpg',
  },
  {
    id: 'full-color-statue',
    title: '复刻真人-全彩艺术雕像',
    desc: '全彩打印真人雕像，细节与神态完整保留',
    spec: '全身像 · 高 260 mm',
    image: '/images/home/hero-3.jpg',
  },
  {
    id: 'printing-supply',
    title: '全彩3D打印供应链服务',
    desc: '从建模到全彩打印，一站式生产与交付',
    spec: '一件起印 · 3–5 天',
    image: '/images/home/hero-4.jpg',
  },
]

export interface ProcessStep {
  no: string
  title: string
  desc: string
  meta: string
}

export const processSteps: ProcessStep[] = [
  {
    no: '01',
    title: '上传照片',
    desc: '正面清晰照、手持扫描或现成模型文件，都从这里进入。',
    meta: '1–3 张 / 约 5 分钟',
  },
  {
    no: '02',
    title: '生成模型',
    desc: '按题材选择建模方式，AI 还原比例、结构与表面细节。',
    meta: '约 10–40 分钟',
  },
  {
    no: '03',
    title: '全彩打印',
    desc: '树脂逐层堆叠色彩与纹理，无需后期上色。',
    meta: '2–3 天',
  },
  {
    no: '04',
    title: '修边交付',
    desc: '人工修边、装配、质检后包装发出，进度全程可查。',
    meta: '1–2 天',
  },
]

export type FeatureIcon = 'bust' | 'full' | 'scan' | 'vertex'

export interface FeatureItem {
  id: FeatureIcon
  title: string
  desc: string
  icon: FeatureIcon
  duration: string
  image: string
}

export const features: FeatureItem[] = [
  {
    id: 'bust',
    title: '半身人像建模',
    desc: '照片生成超写实半身人像，适合胸像与纪念摆件',
    icon: 'bust',
    duration: '25 min',
    image: '/images/tools/bust.jpg',
  },
  {
    id: 'full',
    title: '全身人像建模',
    desc: '图片秒变高精度写实人像模型，可打印全身站姿',
    icon: 'full',
    duration: '40 min',
    image: '/images/tools/full.jpg',
  },
  {
    id: 'scan',
    title: '扫描建模',
    desc: '扫描设备专用高精度重建，适合文物与手办翻模',
    icon: 'scan',
    duration: '15 min',
    image: '/images/tools/scan.jpg',
  },
  {
    id: 'vertex',
    title: '顶点转贴图',
    desc: '一键把顶点色模型烘焙为贴图模型，进入全彩打印',
    icon: 'vertex',
    duration: '10 min',
    image: '/images/tools/vertex.jpg',
  },
]

export type CommunityCategory = '萌宠摆件' | '黏土浮雕' | '冰箱贴'
export const communityCategories = ['全部', '萌宠摆件', '黏土浮雕', '冰箱贴'] as const
export type CommunityFilter = (typeof communityCategories)[number]

export interface CommunityItem {
  id: string
  title: string
  category: CommunityCategory
  maker: string
  craft: string
  size: string
  image: string
}

export const communityItems: CommunityItem[] = [
  {
    id: 'halloween-cat',
    title: '奇幻万圣',
    category: '萌宠摆件',
    maker: '@阿橘',
    craft: '全彩树脂 / 手绘补色',
    size: '90 × 70 × 110 mm',
    image: '/images/community/halloween-cat.jpg',
  },
  {
    id: 'clay-badge',
    title: '黏土浮雕徽章',
    category: '黏土浮雕',
    maker: '@小满',
    craft: '黏土浮雕 / UV 打印',
    size: '80 × 80 × 14 mm',
    image: '/images/community/clay-badge.jpg',
  },
  {
    id: 'comic-husky',
    title: '美式漫画',
    category: '冰箱贴',
    maker: '@K',
    craft: '磁吸背板 / 全彩树脂',
    size: '70 × 55 × 12 mm',
    image: '/images/community/comic-husky.jpg',
  },
  {
    id: 'magic-academy',
    title: '魔法学院',
    category: '萌宠摆件',
    maker: '@鹿鸣',
    craft: '黏土浮雕 / 金属粉',
    size: '120 × 90 × 18 mm',
    image: '/images/community/magic-academy.jpg',
  },
  {
    id: 'leather-keychain',
    title: '宠物皮雕挂件',
    category: '黏土浮雕',
    maker: '@老周',
    craft: '植鞣皮雕 / 黄铜环',
    size: '65 × 45 mm',
    image: '/images/community/leather-keychain.jpg',
  },
  {
    id: 'pet-fridge-magnet',
    title: '宠物大头冰箱贴',
    category: '冰箱贴',
    maker: '@米粒',
    craft: '磁吸背板 / 高光涂层',
    size: '60 × 60 × 10 mm',
    image: '/images/community/pet-fridge-magnet.jpg',
  },
  {
    id: 'q-cat-magnet',
    title: 'Q版冰箱贴',
    category: '冰箱贴',
    maker: '@布丁',
    craft: '全彩树脂 / 哑光',
    size: '55 × 55 × 12 mm',
    image: '/images/community/q-cat-magnet.jpg',
  },
  {
    id: 'q-husky-magnet',
    title: 'Q版卡通',
    category: '冰箱贴',
    maker: '@Nori',
    craft: '全彩树脂 / 亮面',
    size: '58 × 50 × 11 mm',
    image: '/images/community/q-husky-magnet.jpg',
  },
]

export type ProductCategory = '潮流潮玩' | '珍藏纪念' | '创意礼物' | '装饰美学'
export const productCategories = ['全部', '潮流潮玩', '珍藏纪念', '创意礼物', '装饰美学'] as const
export type ProductFilter = (typeof productCategories)[number]

export type ProductRatio = '1:1' | '4:5' | '3:4' | '5:4'

export interface ProductItem {
  id: string
  title: string
  price: number
  sold: number
  category: ProductCategory
  badge?: 'fan' | 'limited'
  edition: string
  ratio: ProductRatio
  image: string
}

export const products: ProductItem[] = [
  {
    id: 'spring-symphony',
    title: '《春日交响曲》2.9D 浮雕',
    price: 1350,
    sold: 0,
    category: '装饰美学',
    badge: 'limited',
    edition: '限量 12 版',
    ratio: '4:5',
    image: '/images/products/spring-symphony.jpg',
  },
  {
    id: 'nine-phoenix',
    title: '《九凤加冕》2.9D 浮雕',
    price: 1350,
    sold: 0,
    category: '珍藏纪念',
    badge: 'limited',
    edition: '限量 8 版',
    ratio: '4:5',
    image: '/images/products/nine-phoenix.jpg',
  },
  {
    id: 'flowers-fade',
    title: '《随花而逝》2.9D 浮雕',
    price: 1350,
    sold: 0,
    category: '装饰美学',
    badge: 'fan',
    edition: '开放版',
    ratio: '4:5',
    image: '/images/products/flowers-fade.jpg',
  },
  {
    id: 'six-arm-mahakala',
    title: '《六臂大黑天》2.9D 浮雕',
    price: 299,
    sold: 0,
    category: '珍藏纪念',
    badge: 'limited',
    edition: '限量 16 版',
    ratio: '4:5',
    image: '/images/products/six-arm-mahakala.jpg',
  },
  {
    id: 'white-wealth-deity',
    title: '《白财神》2.9D 浮雕',
    price: 299,
    sold: 1,
    category: '珍藏纪念',
    badge: 'fan',
    edition: '开放版',
    ratio: '4:5',
    image: '/images/products/white-wealth-deity.jpg',
  },
  {
    id: 'zhulong',
    title: '《山海·烛龙》2.9D 浮雕',
    price: 880,
    sold: 0,
    category: '珍藏纪念',
    badge: 'limited',
    edition: '限量 6 版',
    ratio: '4:5',
    image: '/images/products/zhulong.jpg',
  },
  {
    id: 'thousand-year-bond',
    title: '《千年之缘》2.9D 浮雕',
    price: 1350,
    sold: 0,
    category: '创意礼物',
    badge: 'fan',
    edition: '开放版',
    ratio: '4:5',
    image: '/images/products/thousand-year-bond.jpg',
  },
  {
    id: 'soul-dwelling',
    title: '《灵魂唯一的栖所》2.9D 浮雕',
    price: 1350,
    sold: 0,
    category: '创意礼物',
    badge: 'limited',
    edition: '限量 9 版',
    ratio: '4:5',
    image: '/images/products/soul-dwelling.jpg',
  },
  {
    id: 'clay-guard',
    title: '《陶俑·守》桌面摆件',
    price: 480,
    sold: 0,
    category: '创意礼物',
    badge: 'limited',
    edition: '限量 24 版',
    ratio: '4:5',
    image: '/images/products/clay-guard.jpg',
  },
  {
    id: 'thousand-miles',
    title: '《千里江山图》2.9D 浮雕',
    price: 1350,
    sold: 0,
    category: '装饰美学',
    badge: 'fan',
    edition: '开放版',
    ratio: '5:4',
    image: '/images/products/thousand-miles.jpg',
  },
  {
    id: 'dunhuang-flying',
    title: '《敦煌飞天》2.9D 浮雕',
    price: 680,
    sold: 0,
    category: '装饰美学',
    badge: 'fan',
    edition: '开放版',
    ratio: '4:5',
    image: '/images/products/dunhuang-flying.jpg',
  },
  {
    id: 'midsummer-carnival',
    title: '《仲夏夜狂欢》2.9D 浮雕',
    price: 1350,
    sold: 0,
    category: '装饰美学',
    badge: 'fan',
    edition: '开放版',
    ratio: '5:4',
    image: '/images/products/midsummer-carnival.jpg',
  },
  {
    id: 'zodiac-awakening',
    title: '《生肖觉醒》2.9D 浮雕',
    price: 1350,
    sold: 2,
    category: '潮流潮玩',
    badge: 'limited',
    edition: '限量 20 版',
    ratio: '4:5',
    image: '/images/products/zodiac-awakening.jpg',
  },
  {
    id: 'space-roaming',
    title: '《星际漫游》2.9D 浮雕',
    price: 259,
    sold: 0,
    category: '潮流潮玩',
    badge: 'limited',
    edition: '限量 30 版',
    ratio: '4:5',
    image: '/images/products/space-roaming.jpg',
  },
  {
    id: 'mecha-toy',
    title: '《潮玩机甲》2.9D 浮雕',
    price: 199,
    sold: 5,
    category: '潮流潮玩',
    badge: 'fan',
    edition: '开放版',
    ratio: '4:5',
    image: '/images/products/mecha-toy.jpg',
  },
  {
    id: 'mecha-butterfly',
    title: '《机械蝴蝶》雕塑摆件',
    price: 399,
    sold: 0,
    category: '潮流潮玩',
    badge: 'fan',
    edition: '开放版',
    ratio: '4:5',
    image: '/images/products/mecha-butterfly.jpg',
  },
]
