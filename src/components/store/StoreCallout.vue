<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="store-callout page-section" aria-label="定制服务">
    <div class="store-callout__inner">
      <div class="store-callout__copy">
        <span class="store-callout__kicker">bespoke — 定制</span>
        <h2>没有找到合适的一件？<br />那就做一件只属于你的。</h2>
        <p>上传一张照片，选一种建模方式。剩下的打印、修边、装配和交付，都由工坊完成。</p>
      </div>

      <div class="store-callout__actions">
        <RouterLink class="store-callout__primary" :to="{ path: '/', hash: '#features' }">
          开始定制
          <el-icon :size="13"><ArrowRight /></el-icon>
        </RouterLink>
        <RouterLink class="store-callout__secondary" to="/community">
          看看别人做的
        </RouterLink>
      </div>

      <dl class="store-callout__stats">
        <div>
          <dt>1 件</dt>
          <dd>起印数量</dd>
        </div>
        <div>
          <dt>3–5 天</dt>
          <dd>生产周期</dd>
        </div>
        <div>
          <dt>全彩树脂</dt>
          <dd>成型工艺</dd>
        </div>
        <div>
          <dt>人工修边</dt>
          <dd>逐件质检</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.store-callout {
  margin-top: clamp(44px, 6vw, 84px);
}

.store-callout__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px 40px;
  padding: clamp(28px, 4vw, 52px);
  background: linear-gradient(120deg, #f1ddc2 0%, #e3bd93 100%);
  color: #17130e;
}

.store-callout__copy {
  max-width: 620px;
}

.store-callout__kicker {
  color: rgba(23, 19, 14, 0.6);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.store-callout h2 {
  margin-top: 14px;
  font-size: clamp(24px, 2.6vw, 38px);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.18;
}

.store-callout__copy p {
  max-width: 46ch;
  margin-top: 12px;
  color: rgba(23, 19, 14, 0.72);
  font-size: 12px;
  line-height: 1.8;
}

.store-callout__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.store-callout__primary {
  display: inline-flex;
  height: 44px;
  align-items: center;
  gap: 7px;
  padding: 0 22px;
  border-radius: var(--radius-pill);
  background: #17130e;
  color: #f7ecdc;
  font-size: 12.5px;
  font-weight: 600;
  transition:
    background-color 0.25s ease,
    transform 0.25s var(--ease-out);
}

.store-callout__primary:hover {
  background: #2a2118;
  transform: translateY(-1px);
}

.store-callout__secondary {
  display: inline-flex;
  height: 44px;
  align-items: center;
  padding: 0 20px;
  border: 1px solid rgba(23, 19, 14, 0.3);
  border-radius: var(--radius-pill);
  color: rgba(23, 19, 14, 0.82);
  font-size: 12.5px;
  transition:
    border-color 0.25s ease,
    background-color 0.25s ease;
}

.store-callout__secondary:hover {
  border-color: rgba(23, 19, 14, 0.6);
  background: rgba(23, 19, 14, 0.06);
}

.store-callout__stats {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 32px;
  margin-top: 4px;
  padding-top: 18px;
  border-top: 1px solid rgba(0, 0, 0, 0.16);
  list-style: none;
}

.store-callout__stats div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.store-callout__stats dt {
  color: #17130e;
  font-size: 14px;
  font-weight: 700;
}

.store-callout__stats dd {
  color: rgba(23, 19, 14, 0.58);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

@media (min-width: 768px) {
  .store-callout__stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
