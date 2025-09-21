<template>
  <div class="main-layout">
    <!-- 头部导航 -->
    <AppHeader />
    
    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    
    <!-- 底部信息 -->
    <AppFooter />
    
    <!-- 返回顶部按钮 -->
    <BackToTop />
    
    <!-- 登录注册模态框 -->
    <LoginModal />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import BackToTop from '@/components/common/BackToTop.vue'
import LoginModal from '@/components/user/LoginModal.vue'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

// 页面加载时初始化用户状态
onMounted(() => {
  userStore.initUserFromStorage()
})
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  min-height: calc(100vh - 200px);
}

/* 页面切换动画 */
.page-enter-active,
.page-leave-active {
  transition: all var(--transition-normal);
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    min-height: calc(100vh - 150px);
  }
}
</style>