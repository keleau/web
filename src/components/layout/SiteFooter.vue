<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BrandLogo from '@/components/common/BrandLogo.vue'
import { footerGroups } from '@/data/footer'
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__grid">
        <div class="site-footer__brand">
          <BrandLogo />
          <p>一张照片，一件可以拿在手里的作品。</p>
          <a class="site-footer__tel" href="tel:13380042016">客服 133 8004 2016</a>
        </div>

        <nav class="site-footer__links" aria-label="页脚导航">
          <div v-for="group in footerGroups" :key="group.title" class="site-footer__group">
            <span>{{ group.title }}</span>
            <template v-for="link in group.links" :key="link.label">
              <RouterLink v-if="link.to" :to="link.to">{{ link.label }}</RouterLink>
              <a v-else href="#" @click.prevent>{{ link.label }}</a>
            </template>
          </div>
        </nav>

        <div class="site-footer__legal">
          <p>Copyright © 2026 广州趣闯网络科技有限公司</p>
          <p>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
              粤ICP备2022108110号-1
            </a>
            · 粤公网安备44010502002530号
          </p>
          <p>网信算备440105311485401240061号 / 440105311485401240053号</p>
          <p>趣丸万相大模型：Guangdong-QuWanWanXiang-202507140065</p>
        </div>
      </div>

      <div class="site-footer__base">
        <span>造物工坊</span>
        <span>技术支持：Vast / 混元</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: clamp(48px, 6vw, 80px);
  padding: 0 clamp(18px, 3vw, 40px) 28px;
}

.site-footer__inner {
  max-width: var(--page-max);
  margin: 0 auto;
  padding-top: clamp(28px, 3.4vw, 44px);
  border-top: 1px solid var(--hairline);
}

.site-footer__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(26px, 3vw, 44px);
}

.site-footer__brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.site-footer__brand p {
  max-width: 300px;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.7;
}

.site-footer__tel {
  color: var(--text-dim);
  font-size: 11px;
  letter-spacing: 0.06em;
  transition: color 0.2s ease;
}

.site-footer__tel:hover {
  color: var(--sand);
}

.site-footer__links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.site-footer__group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.site-footer__group span {
  color: var(--text-dim);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.site-footer__group a {
  color: var(--text-secondary);
  font-size: 11.5px;
  transition: color 0.2s ease;
}

.site-footer__group a:hover {
  color: var(--brand-strong);
}

.site-footer__legal {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: var(--text-dim);
  font-size: 10px;
  line-height: 1.7;
}

.site-footer__legal a {
  color: var(--text-dim);
  transition: color 0.2s ease;
}

.site-footer__legal a:hover {
  color: var(--text-muted);
}

.site-footer__base {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 20px;
  margin-top: clamp(26px, 3.2vw, 40px);
  padding-top: 14px;
  border-top: 1px solid var(--hairline);
  color: var(--text-dim);
  font-size: 10px;
  letter-spacing: 0.08em;
}

@media (min-width: 900px) {
  .site-footer__grid {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.6fr) minmax(0, 1.3fr);
    align-items: start;
  }

  .site-footer__legal {
    text-align: right;
    align-items: flex-end;
  }
}
</style>
