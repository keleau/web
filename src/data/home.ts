/* 首页数据：只负责「看效果 → 懂流程 → 选工具」这一段 */

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
