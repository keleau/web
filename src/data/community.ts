/* 社区画廊数据：首页只取前几件，社区页使用完整列表 */

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
