<template>
  <div class="home-page">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- PC端布局 -->
      <div class="pc-layout" v-show="!isMobile">
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

      <!-- 移动端布局 -->
      <div class="mobile-layout" v-show="isMobile">
        <!-- 移动端轮播图 -->
        <div class="mobile-banner">
          <HomeBanner />
        </div>
        
        <!-- 移动端分类导航 -->
        <div class="mobile-category">
          <CategoryNav />
        </div>
        
        <!-- 移动端推广区域 -->
        <div class="mobile-promotion">
          <SidePromotion />
        </div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import CategoryNav from '@/components/home/CategoryNav.vue'
import HomeBanner from '@/components/home/HomeBanner.vue'
import SidePromotion from '@/components/home/SidePromotion.vue'
import QuickEntry from '@/components/home/QuickEntry.vue'
import SectionTitle from '@/components/common/SectionTitle.vue'
import RecommendProducts from '@/components/home/RecommendProducts.vue'
import HotCategories from '@/components/home/HotCategories.vue'
import BrandRecommend from '@/components/home/BrandRecommend.vue'

const isMobile = ref(false)

// 检测屏幕尺寸
const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
}

// 页面初始化
onMounted(() => {
  console.log('首页加载完成')
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

/* PC端布局 */
.pc-layout {
  display: grid;
  grid-template-columns: 200px 1fr 300px;
  grid-template-rows: 400px;
  gap: 16px;
  height: 400px;
}

/* PC端大屏幕优化 */
@media (min-width: 1400px) {
  .main-content {
    max-width: 1400px;
    padding: 24px;
  }
  
  .pc-layout {
    grid-template-columns: 220px 1fr 320px;
    gap: 24px;
  }
}

.left-sidebar {
  background-color: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.center-banner {
  background-color: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
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
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 移动端布局 */
.mobile-layout {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-banner {
  background-color: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 250px;
}

.mobile-category {
  background-color: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 120px;
}

.mobile-promotion {
  background-color: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 100px;
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

/* 响应式设计 */
@media (max-width: 1200px) {
  .pc-layout {
    grid-template-columns: 180px 1fr 250px;
    gap: 12px;
  }
  
  .main-content {
    padding: 12px;
  }
}

@media (max-width: 992px) {
  .pc-layout {
    grid-template-columns: 160px 1fr 220px;
    gap: 10px;
  }
  
  .main-content {
    padding: 10px;
  }
}

@media (max-width: 768px) {
  .pc-layout {
    display: none;
  }
  
  .mobile-layout {
    display: flex;
  }
  
  .main-content {
    padding: 12px;
  }
  
  .mobile-banner {
    height: 220px;
    border-radius: 4px;
  }
  
  .mobile-category {
    min-height: 100px;
    border-radius: 4px;
  }
  
  .mobile-promotion {
    min-height: 80px;
    border-radius: 4px;
  }
  
  .quick-section,
  .recommend-section,
  .categories-section,
  .new-products-section,
  .brands-section {
    padding: 20px 12px;
  }
}

@media (max-width: 480px) {
  .home-page {
    padding: 0;
  }
  
  .main-content {
    padding: 8px;
  }
  
  .mobile-layout {
    gap: 8px;
  }
  
  .mobile-banner {
    height: 180px;
    border-radius: 4px;
  }
  
  .mobile-category {
    min-height: 80px;
    border-radius: 4px;
  }
  
  .mobile-promotion {
    min-height: 60px;
    border-radius: 4px;
  }
  
  .quick-section,
  .recommend-section,
  .categories-section,
  .new-products-section,
  .brands-section {
    padding: 16px 8px;
  }
}

@media (max-width: 360px) {
  .main-content {
    padding: 6px;
  }
  
  .mobile-layout {
    gap: 6px;
  }
  
  .mobile-banner {
    height: 160px;
  }
  
  .mobile-category {
    min-height: 70px;
  }
  
  .mobile-promotion {
    min-height: 50px;
  }
  
  .quick-section,
  .recommend-section,
  .categories-section,
  .new-products-section,
  .brands-section {
    padding: 12px 6px;
  }
}

/* 隐藏移动端布局在PC端 */
@media (min-width: 769px) {
  .mobile-layout {
    display: none;
  }
  
  .pc-layout {
    display: grid;
  }
}
</style>