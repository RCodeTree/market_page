<template>
  <div class="user-profile-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">个人资料</h1>
        <p class="page-subtitle">管理您的个人信息和偏好设置</p>
      </div>
      
      <div class="profile-content">
        <UserProfile />
      </div>
    </div>
  </div>
</template>

<script setup>
import UserProfile from '@/components/user/UserProfile.vue'
</script>

<style scoped>
.user-profile-page {
  min-height: 100vh;
  background-color: var(--bg-secondary);
  padding: var(--spacing-lg) 0;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.page-subtitle {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin: 0;
}

.profile-content {
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-content {
    padding: var(--spacing-lg);
    margin: 0 var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .profile-content {
    padding: var(--spacing-md);
    margin: 0 var(--spacing-sm);
  }
}
</style>