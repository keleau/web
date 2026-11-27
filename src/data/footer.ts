/* 页脚导航配置：组与链接集中在此，SiteFooter 只负责渲染 */
import type { FooterGroup } from '@/types/content'

export const footerGroups: FooterGroup[] = [
  {
    title: '创作',
    links: [
      { label: '生产工具', to: '/#features' },
      { label: '制作流程', to: '/#process' },
      { label: '定价说明' },
    ],
  },
  {
    title: '商店',
    links: [
      { label: '产品商城', to: '/store' },
      { label: '限量版', to: '/store' },
      { label: '定制服务', to: '/custom' },
    ],
  },
  {
    title: '关于',
    links: [
      { label: '社区画廊', to: '/community' },
      { label: '联系我们' },
      { label: '服务条款' },
    ],
  },
]
