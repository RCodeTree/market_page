<template>
  <div class="not-found">
    <div class="container">
      <div class="not-found-content">
        <div class="error-image">
          <svg viewBox="0 0 200 200" class="error-svg">
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" class="error-text">404</text>
          </svg>
        </div>
        
        <h1 class="error-title">页面未找到</h1>
        <p class="error-description">
          抱歉，您访问的页面不存在或已被移除
        </p>
        
        <div class="error-actions">
          <el-button type="primary" size="large" @click="goHome">
            <el-icon><House /></el-icon>
            返回首页
          </el-button>
          <el-button size="large" @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回上页
          </el-button>
        </div>
        
        <div class="suggestions">
          <h3>您可能想要：</h3>
          <ul class="suggestion-list">
            <li><router-link to="/">浏览首页</router-link></li>
            <li><router-link to="/product">查看商品</router-link></li>
            <li><router-link to="/search">搜索商品</router-link></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { House, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: var(--spacing-xl);
}

.container {
  max-width: 600px;
  width: 100%;
}

.not-found-content {
  background-color: var(--bg-white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xxl);
  text-align: center;
  box-shadow: var(--shadow-xl);
}

.error-image {
  margin-bottom: var(--spacing-xl);
}

.error-svg {
  width: 200px;
  height: 200px;
  max-width: 100%;
}

.error-text {
  font-size: 80px;
  font-weight: var(--font-weight-bold);
  fill: var(--primary-color);
  opacity: 0.8;
}

.error-title {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.error-description {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-xl) 0;
  line-height: var(--line-height-relaxed);
}

.error-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
}

.suggestions {
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-lg);
}

.suggestions h3 {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.suggestion-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
}

.suggestion-list li {
  margin: 0;
}

.suggestion-list a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.suggestion-list a:hover {
  color: var(--primary-color-dark);
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .not-found {
    padding: var(--spacing-lg);
  }
  
  .not-found-content {
    padding: var(--spacing-xl);
  }
  
  .error-svg {
    width: 150px;
    height: 150px;
  }
  
  .error-text {
    font-size: 60px;
  }
  
  .error-title {
    font-size: var(--font-size-xl);
  }
  
  .error-description {
    font-size: var(--font-size-base);
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .suggestion-list {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .not-found-content {
    padding: var(--spacing-lg);
  }
  
  .error-svg {
    width: 120px;
    height: 120px;
  }
  
  .error-text {
    font-size: 48px;
  }
}
</style>