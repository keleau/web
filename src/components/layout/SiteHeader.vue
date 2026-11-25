<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, Close, Menu, Service } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import BrandLogo from '@/components/common/BrandLogo.vue'

interface NavItem {
  label: string
  action: 'home' | 'anchor' | 'demo'
  target?: string
}

const router = useRouter()
const drawerOpen = ref(false)

const navItems: NavItem[] = [
  { label: '首页', action: 'home' },
  { label: '生产工具', action: 'anchor', target: '#features' },
  { label: '手办商城', action: 'anchor', target: '#products' },
  { label: '我的资产', action: 'demo' },
  { label: '我的订单', action: 'demo' },
  { label: '打印中心', action: 'demo' },
]

function handleNav(item: NavItem) {
  drawerOpen.value = false

  if (item.action === 'home') {
    if (router.currentRoute.value.path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    router.push('/')
    return
  }

  if (item.action === 'anchor' && item.target) {
    const target = document.querySelector(item.target)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
  }

  ElMessage.info(`「${item.label}」需要登录后使用（演示）`)
}

function contact() {
  ElMessage.info('客服热线：13380042016（演示）')
}

function login() {
  ElMessage.success('登录功能为演示占位，敬请期待')
}
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <div class="site-header__left">
        <button
          class="icon-button menu-button"
          type="button"
          aria-label="打开导航菜单"
          @click="drawerOpen = true"
        >
          <el-icon :size="18"><Menu /></el-icon>
        </button>

        <BrandLogo />

        <nav class="site-nav" aria-label="主导航">
          <button
            v-for="item in navItems"
            :key="item.label"
            class="site-nav__item"
            :class="{ 'is-active': item.action === 'home' }"
            type="button"
            @click="handleNav(item)"
          >
            {{ item.label }}
          </button>
        </nav>
      </div>

      <div class="site-header__right">
        <button class="contact-button" type="button" @click="contact">
          <el-icon :size="14"><Service /></el-icon>
          <span>联系我们</span>
        </button>

        <el-popover placement="bottom-end" :width="200" trigger="click" popper-class="msg-popover">
          <template #reference>
            <button class="icon-button message-button" type="button" aria-label="消息中心">
              <el-icon :size="16"><Bell /></el-icon>
            </button>
          </template>
          <div class="message-popover">
            <strong>消息中心</strong>
            <span>暂无消息</span>
          </div>
        </el-popover>

        <button class="login-button" type="button" @click="login">登录</button>
      </div>
    </div>

    <el-drawer
      v-model="drawerOpen"
      direction="ltr"
      size="280px"
      :with-header="false"
      append-to-body
      class="nav-drawer"
    >
      <div class="drawer-head">
        <BrandLogo />
        <button class="icon-button" type="button" aria-label="关闭导航菜单" @click="drawerOpen = false">
          <el-icon :size="16"><Close /></el-icon>
        </button>
      </div>

      <nav class="drawer-nav" aria-label="移动端导航">
        <button
          v-for="item in navItems"
          :key="item.label"
          class="drawer-nav__item"
          :class="{ 'is-active': item.action === 'home' }"
          type="button"
          @click="handleNav(item)"
        >
          {{ item.label }}
        </button>
      </nav>

      <div class="drawer-foot">
        <button class="contact-button" type="button" @click="contact">
          <el-icon :size="14"><Service /></el-icon>
          <span>联系我们</span>
        </button>
        <button class="login-button" type="button" @click="login">登录</button>
      </div>
    </el-drawer>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 130;
  background-color: rgba(9, 9, 11, 0.82);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.site-header__inner {
  display: flex;
  width: 100%;
  max-width: var(--page-max);
  height: var(--header-height);
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 0 auto;
  padding: 0 20px;
}

.site-header__left {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 18px;
}

.site-header__right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-button {
  display: inline-flex;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  color: var(--text-muted);
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.icon-button:hover {
  border-color: rgba(255, 255, 255, 0.34);
  background-color: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
}

.contact-button {
  display: inline-flex;
  height: 36px;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  color: var(--text-secondary);
  font-size: 13px;
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}

.contact-button:hover {
  border-color: rgba(255, 255, 255, 0.42);
  color: var(--text-primary);
}

.login-button {
  display: inline-flex;
  height: 36px;
  align-items: center;
  padding: 0 22px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 999px;
  color: var(--text-primary);
  font-size: 13px;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.login-button:hover {
  border-color: rgba(255, 255, 255, 0.9);
  background-color: rgba(255, 255, 255, 0.08);
}

.site-nav {
  display: none;
  height: 100%;
  align-items: center;
  gap: 28px;
}

.site-nav__item {
  position: relative;
  display: inline-flex;
  height: 100%;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  transition: color 0.2s ease;
}

.site-nav__item:hover {
  color: var(--text-primary);
}

.site-nav__item.is-active {
  color: var(--text-primary);
}

.site-nav__item.is-active::after {
  position: absolute;
  bottom: 10px;
  left: 50%;
  width: 16px;
  height: 2px;
  border-radius: 2px;
  background: var(--brand);
  content: '';
  transform: translateX(-50%);
}

.message-popover {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.message-popover strong {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
}

.message-popover span {
  color: var(--text-muted);
  font-size: 12px;
}

.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 4px 20px;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.drawer-nav__item {
  padding: 12px 14px;
  border-radius: 10px;
  color: var(--text-muted);
  font-size: 14px;
  text-align: left;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.drawer-nav__item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.drawer-nav__item.is-active {
  background-color: var(--brand-soft);
  color: var(--text-primary);
}

.drawer-foot {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 28px;
}

.drawer-foot .contact-button,
.drawer-foot .login-button {
  justify-content: center;
}

@media (max-width: 767px) {
  .contact-button {
    display: none;
  }

  .drawer-foot .contact-button {
    display: inline-flex;
  }
}

@media (max-width: 639px) {
  .message-button {
    display: none;
  }
}

@media (min-width: 1280px) {
  .site-nav {
    display: flex;
    margin-left: 24px;
  }

  .menu-button {
    display: none;
  }
}
</style>
