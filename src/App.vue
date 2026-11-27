<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import FloatingCart from '@/components/common/FloatingCart.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'
import { useReveal } from '@/composables/useReveal'

const route = useRoute()

// 定制页是完整工作流页面，隐藏页脚让上传与预览占满视口
const showFooter = computed(() => route.name !== 'custom')

// 初始化滚动入场动画（IntersectionObserver）
useReveal()
</script>

<template>
  <el-config-provider :locale="zhCn">
    <div class="app-shell">
      <SiteHeader />
      <main class="site-main">
        <router-view />
      </main>
      <SiteFooter v-if="showFooter" />
      <FloatingCart />
      <CartDrawer />
    </div>
  </el-config-provider>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: var(--bg);
}

.site-main {
  flex: 1;
}
</style>
