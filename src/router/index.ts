import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 76, behavior: 'smooth' }
    if (to.path !== from.path) return { top: 0 }
    return undefined
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: '趣丸 Deep-Mesh · 创作工坊｜一张照片，一件拿在手里的作品',
      },
    },
    {
      path: '/store',
      name: 'store',
      component: () => import('@/views/StoreView.vue'),
      meta: {
        title: '产品商城｜趣丸 Deep-Mesh 创作工坊',
      },
    },
    {
      path: '/store/:id',
      name: 'product-detail',
      component: () => import('@/views/ProductDetailView.vue'),
      meta: {
        title: '作品详情｜趣丸 Deep-Mesh 创作工坊',
      },
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('@/views/CommunityView.vue'),
      meta: {
        title: '社区画廊｜趣丸 Deep-Mesh 创作工坊',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.afterEach((to) => {
  if (typeof to.meta.title === 'string') {
    document.title = to.meta.title
  }
})

export default router
