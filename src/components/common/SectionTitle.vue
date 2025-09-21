<template>
  <div class="section-title">
    <div class="title-content">
      <h2 class="main-title">{{ title }}</h2>
      <p v-if="subtitle" class="sub-title">{{ subtitle }}</p>
    </div>
    <div v-if="showMore" class="title-action">
      <router-link :to="moreLink" class="more-link">
        更多
        <el-icon><ArrowRight /></el-icon>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  showMore: {
    type: Boolean,
    default: false
  },
  moreLink: {
    type: String,
    default: '#'
  }
})
</script>

<style scoped>
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--primary-color);
  position: relative;
}

.section-title::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background-color: var(--primary-color);
}

.title-content {
  flex: 1;
}

.main-title {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: var(--line-height-tight);
}

.sub-title {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
  line-height: var(--line-height-normal);
}

.title-action {
  flex-shrink: 0;
}

.more-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.more-link:hover {
  color: var(--primary-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-title {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .main-title {
    font-size: var(--font-size-xl);
  }
  
  .title-action {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: var(--font-size-lg);
  }
  
  .sub-title {
    font-size: var(--font-size-xs);
  }
}
</style>