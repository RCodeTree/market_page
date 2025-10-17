<template>
  <div class="home-banner">
    <el-carousel 
      :interval="5000" 
      :arrow="arrow" 
      indicator-position="inside" 
      height="100%" 
      class="banner-carousel"
      :autoplay="autoplay"
      :touch="true"
    >
      <el-carousel-item v-for="banner in banners" :key="banner.id" class="banner-item">
        <div class="banner-content" :style="{ backgroundImage: `url(${banner.image})` }"
          @click="handleBannerClick(banner)">
          <div class="banner-overlay">
            <div class="banner-info">
              <h3 class="banner-title">{{ isMobile ? banner.shortTitle || banner.title : banner.title }}</h3>
              <p class="banner-subtitle" v-if="!isMobile || banner.showSubtitleOnMobile">{{ banner.subtitle }}</p>
              <div class="banner-price" v-if="banner.price">
                <span class="price-label">限时特价</span>
                <span class="price-value">¥{{ banner.price }}</span>
                <span class="price-original" v-if="banner.originalPrice && (!isMobile || banner.showOriginalPriceOnMobile)">¥{{ banner.originalPrice }}</span>
              </div>
              <el-button 
                v-if="banner.buttonText" 
                type="primary" 
                :size="isMobile ? 'default' : 'large'" 
                class="banner-button"
                @click.stop="handleButtonClick(banner)"
              >
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMobile = ref(false)

// 响应式配置
const arrow = computed(() => isMobile.value ? 'never' : 'hover')
const autoplay = computed(() => !isMobile.value || true) // 移动端也启用自动播放

// 轮播图数据
const banners = reactive([
  {
    id: 1,
    title: '新年大促销',
    shortTitle: '新年大促',
    subtitle: '全场商品5折起，限时抢购',
    showSubtitleOnMobile: false,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
    price: '299',
    originalPrice: '599',
    showOriginalPriceOnMobile: true,
    buttonText: '立即抢购',
    link: '/products?category=promotion',
    type: 'promotion'
  },
  {
    id: 2,
    title: '智能手机专场',
    shortTitle: '智能手机',
    subtitle: '最新款智能手机，科技改变生活',
    showSubtitleOnMobile: false,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=400&fit=crop',
    price: '2999',
    originalPrice: '3999',
    showOriginalPriceOnMobile: false,
    buttonText: '查看详情',
    link: '/products?category=phone',
    type: 'product'
  },
  {
    id: 3,
    title: '电脑数码节',
    shortTitle: '电脑数码',
    subtitle: '办公学习必备，高性能电脑推荐',
    showSubtitleOnMobile: false,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=400&fit=crop',
    price: '4999',
    originalPrice: '6999',
    showOriginalPriceOnMobile: false,
    buttonText: '立即购买',
    link: '/products?category=computer',
    type: 'product'
  },
  {
    id: 4,
    title: '时尚服饰',
    shortTitle: '时尚服饰',
    subtitle: '春季新款上市，穿出你的风格',
    showSubtitleOnMobile: true,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    price: '199',
    originalPrice: '399',
    showOriginalPriceOnMobile: true,
    buttonText: '逛逛看',
    link: '/products?category=fashion',
    type: 'category'
  },
  {
    id: 5,
    title: '家居生活',
    shortTitle: '家居生活',
    subtitle: '品质生活从家开始，精选家居好物',
    showSubtitleOnMobile: false,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop',
    price: '599',
    originalPrice: '999',
    showOriginalPriceOnMobile: false,
    buttonText: '发现更多',
    link: '/products?category=home',
    type: 'category'
  }
])

// 检测屏幕尺寸
const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
}

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
  console.log('轮播图组件加载完成')
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
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
  color: #ffffff;
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
}

.banner-carousel :deep(.el-carousel__button) {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
}

.banner-carousel :deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background-color: #e23e3e;
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
  padding: 32px;
}

.banner-info {
  max-width: 500px;
  color: #ffffff;
}

.banner-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.banner-subtitle {
  font-size: 18px;
  margin: 0 0 24px 0;
  line-height: 1.5;
  opacity: 0.9;
}

.banner-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.price-label {
  background-color: #ff4d4f;
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.price-value {
  font-size: 28px;
  font-weight: 700;
  color: #faad14;
}

.price-original {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: line-through;
}

.banner-button {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
}

.banner-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .banner-overlay {
    padding: 24px;
  }

  .banner-title {
    font-size: 32px;
  }

  .banner-subtitle {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .price-value {
    font-size: 24px;
  }

  .banner-button {
    padding: 14px 28px;
    font-size: 15px;
  }
}

@media (max-width: 768px) {
  .banner-carousel {
    min-height: 250px;
  }

  .banner-overlay {
    padding: 20px;
    background: linear-gradient(135deg,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(0, 0, 0, 0.4) 100%);
  }

  .banner-info {
    max-width: 100%;
  }

  .banner-title {
    font-size: 24px;
    margin-bottom: 12px;
    line-height: 1.3;
  }

  .banner-subtitle {
    font-size: 14px;
    margin-bottom: 16px;
    line-height: 1.4;
  }

  .banner-price {
    margin-bottom: 20px;
    gap: 6px;
  }

  .price-value {
    font-size: 20px;
  }

  .price-label {
    font-size: 12px;
    padding: 3px 6px;
  }

  .price-original {
    font-size: 14px;
  }

  .banner-button {
    padding: 10px 20px;
    font-size: 14px;
  }

  .banner-carousel :deep(.el-carousel__arrow) {
    display: none;
  }

  .banner-carousel :deep(.el-carousel__indicators) {
    bottom: 12px;
  }

  .banner-carousel :deep(.el-carousel__indicator) {
    width: 8px;
    height: 8px;
    margin: 0 4px;
  }

  .banner-carousel :deep(.el-carousel__button) {
    width: 8px;
    height: 8px;
  }
}

@media (max-width: 480px) {
  .banner-carousel {
    min-height: 200px;
  }

  .banner-overlay {
    padding: 16px;
    align-items: flex-end;
    background: linear-gradient(to top,
        rgba(0, 0, 0, 0.8) 0%,
        rgba(0, 0, 0, 0.4) 50%,
        rgba(0, 0, 0, 0.1) 100%);
  }

  .banner-info {
    width: 100%;
  }

  .banner-title {
    font-size: 20px;
    margin-bottom: 8px;
    font-weight: 600;
  }

  .banner-subtitle {
    font-size: 13px;
    margin-bottom: 12px;
    opacity: 0.95;
  }

  .banner-price {
    margin-bottom: 16px;
    gap: 4px;
    align-items: flex-start;
  }

  .price-value {
    font-size: 18px;
  }

  .price-label {
    font-size: 11px;
    padding: 2px 5px;
  }

  .price-original {
    font-size: 12px;
  }

  .banner-button {
    padding: 8px 16px;
    font-size: 13px;
    border-radius: 4px;
  }

  .banner-carousel :deep(.el-carousel__indicators) {
    bottom: 8px;
  }

  .banner-carousel :deep(.el-carousel__indicator) {
    width: 6px;
    height: 6px;
    margin: 0 3px;
  }

  .banner-carousel :deep(.el-carousel__button) {
    width: 6px;
    height: 6px;
  }
}

@media (max-width: 360px) {
  .banner-carousel {
    min-height: 180px;
  }

  .banner-overlay {
    padding: 12px;
  }

  .banner-title {
    font-size: 18px;
    margin-bottom: 6px;
  }

  .banner-subtitle {
    font-size: 12px;
    margin-bottom: 10px;
  }

  .banner-price {
    margin-bottom: 12px;
  }

  .price-value {
    font-size: 16px;
  }

  .price-label {
    font-size: 10px;
    padding: 2px 4px;
  }

  .price-original {
    font-size: 11px;
  }

  .banner-button {
    padding: 6px 12px;
    font-size: 12px;
  }
}

/* 触摸优化 */
@media (hover: none) and (pointer: coarse) {
  .banner-item {
    -webkit-tap-highlight-color: transparent;
  }
  
  .banner-button {
    -webkit-tap-highlight-color: rgba(226, 62, 62, 0.3);
  }
  
  .banner-button:active {
    transform: scale(0.98);
  }
}

/* 高分辨率屏幕优化 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .banner-title {
    text-rendering: optimizeLegibility;
  }
  
  .banner-subtitle {
    text-rendering: optimizeLegibility;
  }
}
</style>