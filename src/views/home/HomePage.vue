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
}

.banner-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: var(--spacing-lg) 0;
}

.banner-content {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  gap: var(--spacing-lg);
  height: 400px;
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
  .banner-content {
    grid-template-columns: 180px 1fr 180px;
  }
}

@media (max-width: 992px) {
  .banner-content {
    grid-template-columns: 1fr;
    height: auto;
    gap: var(--spacing-md);
  }
  
  .category-nav {
    order: 2;
  }
  
  .main-banner {
    order: 1;
    height: 300px;
  }
  
  .side-promotion {
    order: 3;
    flex-direction: row;
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  .banner-section {
    padding: var(--spacing-md) 0;
  }
  
  .main-banner {
    height: 250px;
  }
  
  .side-promotion {
    flex-direction: column;
  }
  
  .quick-entry-section,
  .recommend-section,
  .hot-category-section,
  .new-products-section,
  .brand-section {
    padding: var(--spacing-xl) 0;
  }
}

@media (max-width: 480px) {
  .banner-content {
    gap: var(--spacing-sm);
  }
  
  .main-banner {
    height: 200px;
  }
}
</style>