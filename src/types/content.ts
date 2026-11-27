/** 站点静态内容类型：导航、页脚、首页模块 */

export interface NavItem {
  label: string
  to?: string
  anchor?: string
  demo?: boolean
}

export interface FooterLink {
  label: string
  to?: string
}

export interface FooterGroup {
  title: string
  links: FooterLink[]
}

export interface HeroItem {
  id: string
  title: string
  desc: string
  spec: string
  image: string
}

export interface ProcessStep {
  no: string
  title: string
  desc: string
  meta: string
}

export type FeatureIcon = 'bust' | 'full' | 'scan' | 'vertex'

export interface FeatureItem {
  id: FeatureIcon
  title: string
  desc: string
  icon: FeatureIcon
  duration: string
  image: string
}
