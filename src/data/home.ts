import { artwork } from '@/utils/image'

export interface HeroItem {
  id: string
  title: string
  desc: string
  image: string
}

export const heroItems: HeroItem[] = [
  {
    id: 'vertex-texture',
    title: '修模师福音：一键顶点色转贴图',
    desc: '上传顶点色模型，一键烘焙贴图，直接进入全彩打印',
    image: '/images/home/hero-1.jpg',
  },
  {
    id: 'pet-figurine',
    title: '照片级还原-写实宠物手办',
    desc: '一张照片还原毛发细节，生成可打印的写实宠物手办',
    image: '/images/home/hero-2.jpg',
  },
  {
    id: 'full-color-statue',
    title: '复刻真人-全彩艺术雕像',
    desc: '全彩打印真人雕像，细节与神态完整保留',
    image: '/images/home/hero-3.jpg',
  },
  {
    id: 'printing-supply',
    title: '全彩3D打印供应链服务',
    desc: '从建模到全彩打印，一站式生产与交付',
    image: '/images/home/hero-4.jpg',
  },
]

export type FeatureIcon = 'bust' | 'full' | 'scan' | 'vertex'
export type FeatureTheme = 'violet' | 'green' | 'blue' | 'cyan'

export interface FeatureItem {
  id: FeatureIcon
  title: string
  desc: string
  icon: FeatureIcon
  theme: FeatureTheme
}

export const features: FeatureItem[] = [
  {
    id: 'bust',
    title: '半身人像建模',
    desc: '照片生成超写实半身人像',
    icon: 'bust',
    theme: 'violet',
  },
  {
    id: 'full',
    title: '全身人像建模',
    desc: '图片秒变高精度写实人像模型',
    icon: 'full',
    theme: 'green',
  },
  {
    id: 'scan',
    title: '扫描建模',
    desc: '扫描设备专用高精度建模',
    icon: 'scan',
    theme: 'blue',
  },
  {
    id: 'vertex',
    title: '顶点转贴图',
    desc: '一键将顶点色模型转为贴图模型',
    icon: 'vertex',
    theme: 'cyan',
  },
]

export type CommunityCategory = '萌宠摆件' | '黏土浮雕' | '冰箱贴'
export const communityCategories = ['全部', '萌宠摆件', '黏土浮雕', '冰箱贴'] as const
export type CommunityFilter = (typeof communityCategories)[number]

export interface CommunityItem {
  id: string
  title: string
  category: CommunityCategory
  image: string
}

export const communityItems: CommunityItem[] = [
  {
    id: 'halloween-cat',
    title: '奇幻万圣',
    category: '萌宠摆件',
    image: artwork(
      'Cute 3D printed clay cat figurine wearing a small Halloween pumpkin hat, playful pose, warm studio lighting, dark cozy background, product photography',
      'landscape_4_3',
    ),
  },
  {
    id: 'clay-badge',
    title: '黏土浮雕徽章',
    category: '黏土浮雕',
    image: artwork(
      'Handmade clay relief badge of a fluffy white dog, soft pastel palette, round badge, studio product photo, subtle shadows',
      'landscape_4_3',
    ),
  },
  {
    id: 'comic-husky',
    title: '美式漫画',
    category: '冰箱贴',
    image: artwork(
      'A 3D printed fridge magnet of a husky dog in bold American comic book style, vivid colors, attached to a home fridge, product photography',
      'landscape_4_3',
    ),
  },
  {
    id: 'magic-academy',
    title: '魔法学院',
    category: '萌宠摆件',
    image: artwork(
      'Clay relief fridge magnet depicting a magical academy crest with stars and a castle, fantasy warm lighting, handcrafted texture',
      'landscape_4_3',
    ),
  },
  {
    id: 'leather-keychain',
    title: '宠物皮雕挂件',
    category: '黏土浮雕',
    image: artwork(
      'Hand carved leather pet keychain with a white dog portrait, brass ring, warm leather background, macro product photography',
      'landscape_4_3',
    ),
  },
  {
    id: 'pet-fridge-magnet',
    title: '宠物大头冰箱贴',
    category: '冰箱贴',
    image: artwork(
      'Custom fridge magnet with a cute golden retriever puppy head, sticking on a modern kitchen wall, soft daylight, product photo',
      'landscape_4_3',
    ),
  },
  {
    id: 'q-cat-magnet',
    title: 'Q版冰箱贴',
    category: '冰箱贴',
    image: artwork(
      'Q version cat clay fridge magnet, pastel blue and cream colors, cute chubby style, clean studio background, product photography',
      'landscape_4_3',
    ),
  },
  {
    id: 'q-husky-magnet',
    title: 'Q版卡通',
    category: '冰箱贴',
    image: artwork(
      'Q version cartoon husky clay fridge magnet, playful expression, warm wooden wall background, product photography',
      'landscape_4_3',
    ),
  },
]

export type ProductCategory = '潮流潮玩' | '珍藏纪念' | '创意礼物' | '装饰美学'
export const productCategories = ['全部', '潮流潮玩', '珍藏纪念', '创意礼物', '装饰美学'] as const
export type ProductFilter = (typeof productCategories)[number]

export interface ProductItem {
  id: string
  title: string
  price: number
  sold: number
  category: ProductCategory
  badge?: 'fan' | 'limited'
  image: string
}

function product(
  id: string,
  title: string,
  price: number,
  sold: number,
  category: ProductCategory,
  prompt: string,
  badge: 'fan' | 'limited' = 'fan',
): ProductItem {
  return {
    id,
    title,
    price,
    sold,
    category,
    badge,
    image: artwork(prompt, 'square_hd'),
  }
}

export const products: ProductItem[] = [
  product(
    'spring-symphony',
    '《春日交响曲》2.9D浮雕画（by 汪小飘）',
    1350,
    0,
    '装饰美学',
    'Colorful 2.9D relief wall art of spring symphony, swirling phoenix and flowers, gold and teal, displayed on a dark gallery wall with spotlight',
  ),
  product(
    'nine-phoenix',
    '《九凤加冕》2.9D浮雕画（by 汪小飘）',
    1350,
    0,
    '珍藏纪念',
    'Ornate gold and crimson 3D relief artwork of nine phoenixes coronation, luxurious traditional Chinese style, museum spotlight, dark background',
    'limited',
  ),
  product(
    'flowers-fade',
    '《随花而逝》2.9D浮雕画（by 汪小飘）',
    1350,
    0,
    '装饰美学',
    'Blue and white porcelain style 3D relief painting with delicate flowers and swans, elegant wall art, gallery spotlight',
  ),
  product(
    'vajrapani',
    'Roben Zhang作品《金刚手菩萨》2.9D浮雕画',
    299,
    0,
    '珍藏纪念',
    'Vivid Tibetan Buddhist deity 3D relief painting in red and blue, intricate details, gallery wall spotlight, dark background',
  ),
  product(
    'purple-guardian',
    'Roben Zhang作品《紫玛护法》2.9D浮雕画',
    299,
    0,
    '珍藏纪念',
    'Tibetan protector deity relief painting in deep purple and gold, fierce expression, museum lighting, dark wall',
  ),
  product(
    'six-arm-mahakala',
    'Roben Zhang作品《六臂大黑天》2.9D浮雕画',
    299,
    0,
    '珍藏纪念',
    'Six armed Mahakala 3D relief painting, rich colors, intricate armor, gallery spotlight, dark background',
    'limited',
  ),
  product(
    'thousand-year-bond',
    '《千年之缘》2.9D浮雕画（by 汪小飘）',
    1350,
    0,
    '创意礼物',
    'Ethereal 3D relief painting of cranes flying over misty mountains, cream and gold, poetic Chinese art, soft gallery lighting',
  ),
  product(
    'midsummer-carnival',
    '《仲夏夜狂欢》2.9D浮雕画（by 汪小飘）',
    1350,
    0,
    '装饰美学',
    'Vibrant abstract 3D relief painting with flowing pink and purple waves, modern wall art, dramatic spotlight, dark gallery',
  ),
  product(
    'thousand-miles',
    '《千里江山图》2.9D浮雕画（by 汪小飘）',
    1350,
    0,
    '装饰美学',
    'Blue and white 3D relief painting of Chinese landscape with mountains and rivers, porcelain tones, gallery spotlight',
  ),
  product(
    'zodiac-awakening',
    '《生肖觉醒：神话之战》2.9D浮雕画（by 汪小飘）',
    1350,
    2,
    '潮流潮玩',
    'Dynamic 3D relief painting of zodiac animals in an epic battle, gold and crimson, dramatic lighting, dark gallery wall',
  ),
  product(
    'soul-dwelling',
    '《灵魂唯一的栖所》2.9D浮雕画（by 汪小飘）',
    1350,
    0,
    '创意礼物',
    'Soft pink and white abstract 3D relief painting, flowing organic textures, spiritual modern wall art, subtle spotlight',
    'limited',
  ),
  product(
    'white-wealth-deity',
    'Roben Zhang作品《白财神》2.9D浮雕画',
    299,
    1,
    '珍藏纪念',
    'White Tibetan wealth deity 3D relief painting with gold accents, serene expression, museum spotlight, dark background',
  ),
  product(
    'space-roaming',
    '《星际漫游》2.9D浮雕画（by 汪小飘）',
    259,
    0,
    '潮流潮玩',
    'Retro futuristic astronaut 3D relief painting, chrome and violet colors, space theme, pop art, gallery spotlight',
    'limited',
  ),
  product(
    'mecha-toy',
    '《潮玩机甲》2.9D浮雕画（by 汪小飘）',
    199,
    5,
    '潮流潮玩',
    'Cute mecha robot 3D relief painting, neon cyan and orange, toy art style, dramatic gallery lighting',
  ),
]
