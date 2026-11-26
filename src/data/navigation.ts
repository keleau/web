/* 顶部导航配置：页面跳转与锚点跳转写在一处，避免散落在模板里 */

export interface NavItem {
  label: string
  to?: string
  anchor?: string
  demo?: boolean
}

export const primaryNav: NavItem[] = [
  { label: '首页', to: '/' },
  { label: '生产工具', to: '/', anchor: '#features' },
  { label: '产品商城', to: '/store' },
  { label: '社区', to: '/community' },
  { label: '我的资产', demo: true },
  { label: '我的订单', demo: true },
]
