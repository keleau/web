/** 静态内容入口：首页、导航、页脚。内容后续接 CMS 时也只改这一层 */
import { features, heroItems, processSteps } from '@/data/home'
import { primaryNav } from '@/data/navigation'
import { footerGroups } from '@/data/footer'
import type { FeatureItem, FooterGroup, HeroItem, NavItem, ProcessStep } from '@/types/content'

export function getHeroItems(): readonly HeroItem[] {
  return heroItems
}

export function getProcessSteps(): readonly ProcessStep[] {
  return processSteps
}

export function getFeatures(): readonly FeatureItem[] {
  return features
}

export function getPrimaryNav(): readonly NavItem[] {
  return primaryNav
}

export function getFooterGroups(): readonly FooterGroup[] {
  return footerGroups
}
