<template>
  <div class="home-banner">
    <el-carousel :interval="5000" :arrow="arrow" indicator-position="inside" height="100%" class="banner-carousel">
      <el-carousel-item v-for="banner in banners" :key="banner.id" class="banner-item">
        <div class="banner-content" :style="{ backgroundImage: `url(${banner.image})` }"
          @click="handleBannerClick(banner)">
          <div class="banner-overlay">
            <div class="banner-info">
              <h3 class="banner-title">{{ banner.title }}</h3>
              <p class="banner-subtitle">{{ banner.subtitle }}</p>
              <div class="banner-price" v-if="banner.price">
                <span class="price-label">限时特价</span>
                <span class="price-value">¥{{ banner.price }}</span>
                <span class="price-original" v-if="banner.originalPrice">¥{{ banner.originalPrice }}</span>
              </div>
              <el-button v-if="banner.buttonText" type="primary" size="large" class="banner-button"
                @click.stop="handleButtonClick(banner)">
                {{ banner.buttonText }}
              </el-button>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const arrow = ref('hover')

// 轮播图数据
const banners = reactive([
  {
    id: 1,
    title: '新年大促销',
    subtitle: '全场商品5折起，限时抢购',
    shortTitle: '新年大促',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
    price: '299',
    originalPrice: '599',
    buttonText: '立即抢购',
    link: '/products?category=promotion',
    type: 'promotion'
  },
  {
    id: 2,
    title: '智能手机专场',
    subtitle: '最新款智能手机，科技改变生活',
    shortTitle: '智能手机',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=400&fit=crop',
    price: '2999',
    originalPrice: '3999',
    buttonText: '查看详情',
    link: '/products?category=phone',
    type: 'product'
  },
  {
    id: 3,
    title: '电脑数码节',
    subtitle: '办公学习必备，高性能电脑推荐',
    shortTitle: '电脑数码',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=400&fit=crop',
    price: '4999',
    originalPrice: '6999',
    buttonText: '立即购买',
    link: '/products?category=computer',
    type: 'product'
  },
  {
    id: 4,
    title: '时尚服饰',
    subtitle: '春季新款上市，穿出你的风格',
    shortTitle: '时尚服饰',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    price: '199',
    originalPrice: '399',
    buttonText: '逛逛看',
    link: '/products?category=fashion',
    type: 'category'
  },
  {
    id: 5,
    title: '家居生活',
    subtitle: '品质生活从家开始，精选家居好物',
    shortTitle: '家居生活',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop',
    price: '599',
    originalPrice: '999',
    buttonText: '发现更多',
    link: '/products?category=home',
    type: 'category'
  }
])

// 处理轮播图点击
const handleBannerClick = (banner) => {
  if (banner.link) {
    router.push(banner.link)
  }
}

// 处理按钮点击
const handleButtonClick = (banner) => {
  if (banner.type === 'product') {
    // 跳转到商品详情页
    router.push(`/product/${banner.id}`)
  } else if (banner.link) {
    router.push(banner.link)
  }
}



onMounted(() => {
  // 可以在这里加载轮播图数据
  console.log('轮播图组件加载完成')
})
</script>

<style scoped>
.home-banner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.banner-carousel {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.banner-carousel :deep(.el-carousel__container) {
  width: 100%;
  height: 100%;
}

.banner-carousel :deep(.el-carousel__item) {
  width: 100%;
  height: 100%;
}

.banner-carousel :deep(.el-carousel__arrow) {
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  color: var(--text-white);
  width: 50px;
  height: 50px;
}

.banner-carousel :deep(.el-carousel__arrow:hover) {
  background-color: rgba(0, 0, 0, 0.7);
}

.banner-carousel :deep(.el-carousel__indicators) {
  bottom: 20px;
}

.banner-carousel :deep(.el-carousel__indicator) {
  width: 12px;
  height: 12px;
  margin: 0 6px;
  /* 增加圆点指示器之间的间距 */
}

.banner-carousel :deep(.el-carousel__button) {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
}

.banner-carousel :deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background-color: var(--primary-color);
}

.banner-item {
  height: 100%;
  cursor: pointer;
}

.banner-content {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0.1) 100%);
  display: flex;
  align-items: center;
  padding: var(--spacing-xxl);
}

.banner-info {
  max-width: 500px;
  color: var(--text-white);
}

.banner-title {
  font-size: var(--font-size-xxxl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-md) 0;
  line-height: var(--line-height-tight);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.banner-subtitle {
  font-size: var(--font-size-lg);
  margin: 0 0 var(--spacing-lg) 0;
  line-height: var(--line-height-normal);
  opacity: 0.9;
}

.banner-price {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.price-label {
  background-color: var(--danger-color);
  color: var(--text-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.price-value {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  color: var(--warning-color);
}

.price-original {
  font-size: var(--font-size-base);
  color: rgba(255, 255, 255, 0.7);
  text-decoration: line-through;
}

.banner-button {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-base);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.banner-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}



/* 响应式设计 */
@media (max-width: 768px) {
  .banner-overlay {
    padding: var(--spacing-lg);
  }

  .banner-title {
    font-size: var(--font-size-xxl);
  }

  .banner-subtitle {
    font-size: var(--font-size-base);
  }

  .price-value {
    font-size: var(--font-size-xl);
  }

  .banner-carousel :deep(.el-carousel__arrow) {
    display: none;
  }
}

@media (max-width: 480px) {
  .banner-overlay {
    padding: var(--spacing-md);
  }

  .banner-title {
    font-size: var(--font-size-xl);
  }

  .banner-subtitle {
    font-size: var(--font-size-sm);
  }

  .banner-button {
    padding: var(--spacing-sm) var(--spacing-lg);
    font-size: var(--font-size-sm);
  }
}
</style>