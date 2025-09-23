<template>
  <div class="home-page">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧分类导航 -->
      <div class="left-sidebar">
        <CategoryNav />
      </div>
      
      <!-- 中间轮播图区域 -->
      <div class="center-banner">
        <HomeBanner />
      </div>
      
      <!-- 右侧推广区域 -->
      <div class="right-sidebar">
        <SidePromotion />
      </div>
    </div>
    
    <!-- 快捷入口 -->
    <section class="quick-section">
      <QuickEntry />
    </section>
    
    <!-- 今日推荐 -->
    <section class="recommend-section">
      <SectionTitle
        title="今日推荐"
        subtitle="精选好物，每日更新"
        more-link="/recommend"
      />
      <RecommendProducts />
    </section>
    
    <!-- 热门分类 -->
    <section class="categories-section">
      <SectionTitle
        title="热门分类"
        subtitle="发现更多精彩"
        more-link="/categories"
      />
      <HotCategories />
    </section>
    
    <!-- 新品上市 -->
    <section class="new-products-section">
      <SectionTitle
        title="新品上市"
        subtitle="抢先体验最新产品"
        more-link="/new-products"
      />
      <RecommendProducts />
    </section>
    
    <!-- 品牌推荐 -->
    <section class="brands-section">
      <SectionTitle
        title="品牌推荐"
        subtitle="优质品牌，值得信赖"
        more-link="/brands"
      />
      <BrandRecommend />
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import CategoryNav from '@/components/home/CategoryNav.vue'
import HomeBanner from '@/components/home/HomeBanner.vue'
import SidePromotion from '@/components/home/SidePromotion.vue'
import QuickEntry from '@/components/home/QuickEntry.vue'
import SectionTitle from '@/components/common/SectionTitle.vue'
import RecommendProducts from '@/components/home/RecommendProducts.vue'
import HotCategories from '@/components/home/HotCategories.vue'

import BrandRecommend from '@/components/home/BrandRecommend.vue'

// 页面初始化
onMounted(() => {
  console.log('首页加载完成')
  // 可以在这里加载页面数据
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-content {
  display: grid;
  grid-template-columns: 200px 1fr 300px;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  min-height: 400px;
}

/* PC端大屏幕优化 */
@media (min-width: 1400px) {
  .main-content {
    max-width: 1400px;
    grid-template-columns: 220px 1fr 320px;
    gap: 24px;
    padding: 24px;
  }
}

.left-sidebar {
  background-color: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.center-banner {
  background-color: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 400px;
  display: flex;
  align-items: stretch;
}

.center-banner > * {
  width: 100%;
  height: 100%;
}

.right-sidebar {
  background-color: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quick-section,
.recommend-section,
.categories-section,
.new-products-section,
.brands-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
}

.category-nav {
  background-color: var(--bg-white);
  border-radius: var(--radius-base);
  box-shadow: var(--shadow-sm);
}

.main-banner {
  border-radius: var(--radius-base);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.side-promotion {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.quick-entry-section,
.recommend-section,
.hot-category-section,
.new-products-section,
.brand-section {
  padding: var(--spacing-xxl) 0;
}

.quick-entry-section {
  background-color: var(--bg-white);
  border-bottom: 1px solid var(--border-light);
}

.recommend-section {
  background-color: var(--bg-light);
}

.hot-category-section {
  background-color: var(--bg-white);
}

.new-products-section {
  background-color: var(--bg-light);
}

.brand-section {
  background-color: var(--bg-white);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 180px 1fr 250px;
    gap: 8px;
  }
}

@media (max-width: 992px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 8px;
  }
  
  .left-sidebar {
    order: 2;
    display: none; /* 在平板端隐藏左侧导航 */
  }
  
  .center-banner {
    order: 1;
    height: 300px;
    display: flex;
    align-items: stretch;
  }
  
  .right-sidebar {
    order: 3;
    height: auto;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-xs);
    gap: var(--spacing-sm);
  }
  
  .center-banner {
    height: 250px;
    display: flex;
    align-items: stretch;
  }
  
  .right-sidebar {
    display: none; /* 在移动端隐藏右侧推广 */
  }
  
  .quick-section,
  .recommend-section,
  .categories-section,
  .new-products-section,
  .brands-section {
    padding: var(--spacing-lg) var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: var(--spacing-xs);
    gap: var(--spacing-xs);
  }
  
  .center-banner {
    height: 200px;
    display: flex;
    align-items: stretch;
  }
  
  .quick-section,
  .recommend-section,
  .categories-section,
  .new-products-section,
  .brands-section {
    padding: var(--spacing-md) var(--spacing-xs);
  }
}
</style>