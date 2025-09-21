import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { authGuard, initAuth } from '@/utils/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/HomePage.vue'),
    meta: {
      title: '宁北商城 - 首页',
      requiresAuth: false
    }
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('@/views/product/ProductList.vue'),
    meta: { 
      title: '商品列表',
      requiresAuth: false 
    }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/product/ProductDetail.vue'),
    meta: {
      title: '商品详情',
      requiresAuth: false
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/cart/CartPage.vue'),
    meta: {
      title: '购物车',
      requiresAuth: true
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/views/order/OrderList.vue'),
    meta: {
      title: '我的订单',
      requiresAuth: true
    }
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: () => import('@/views/order/OrderDetail.vue'),
    meta: {
      title: '订单详情',
      requiresAuth: true
    }
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/user/UserCenter.vue'),
    meta: {
      title: '用户中心',
      requiresAuth: true
    }
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: () => import('@/views/user/UserProfile.vue'),
    meta: {
      title: '个人资料',
      requiresAuth: true
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/search/SearchResult.vue'),
    meta: {
      title: '搜索结果',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/common/NotFound.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '宁北商城'

  // 使用认证守卫
  authGuard(to, from, next)
})

export default router