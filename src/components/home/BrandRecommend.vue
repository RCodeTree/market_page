<template>
  <div class="brand-recommend">
    <div class="brands-container">
      <div class="brands-scroll" ref="brandsScrollRef">
        <div
          v-for="brand in brands"
          :key="brand.id"
          class="brand-card"
          @click="goToBrand(brand.id)"
        >
          <div class="brand-logo">
            <img :src="brand.logo" :alt="brand.name" />
          </div>
          
          <div class="brand-info">
            <h4 class="brand-name">{{ brand.name }}</h4>
            <p class="brand-desc">{{ brand.description }}</p>
            
            <div class="brand-stats">
              <div class="stat-item">
                <span class="stat-label">商品数</span>
                <span class="stat-value">{{ brand.productCount }}+</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">销量</span>
                <span class="stat-value">{{ formatSales(brand.sales) }}</span>
              </div>
            </div>
            
            <div class="brand-tags">
              <span
                v-for="tag in brand.tags"
                :key="tag"
                class="brand-tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          
          <div class="brand-badge" v-if="brand.isOfficial">
            <el-icon><Checked /></el-icon>
            <span>官方</span>
          </div>
        </div>
      </div>
      
      <div class="scroll-controls">
        <el-button
          type="primary"
          circle
          size="small"
          @click="scrollLeft"
          :disabled="!canScrollLeft"
        >
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <el-button
          type="primary"
          circle
          size="small"
          @click="scrollRight"
          :disabled="!canScrollRight"
        >
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
    
    <div class="view-all">
      <el-button type="text" size="large" @click="viewAllBrands">
        查看全部品牌
        <el-icon class="ml-1"><ArrowRight /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, Checked } from '@element-plus/icons-vue'

const router = useRouter()
const brandsScrollRef = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

// 品牌数据
const brands = reactive([
  {
    id: 1,
    name: 'Apple',
    description: '创新科技，改变世界',
    logo: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=100&h=100&fit=crop',
    productCount: 156,
    sales: 1250000,
    isOfficial: true,
    tags: ['科技', '创新', '高端']
  },
  {
    id: 2,
    name: 'Samsung',
    description: '三星电子，品质保证',
    logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop',
    productCount: 234,
    sales: 980000,
    isOfficial: true,
    tags: ['电子', '智能', '可靠']
  },
  {
    id: 3,
    name: 'Nike',
    description: 'Just Do It',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
    productCount: 189,
    sales: 750000,
    isOfficial: true,
    tags: ['运动', '时尚', '专业']
  },
  {
    id: 4,
    name: 'Adidas',
    description: 'Impossible is Nothing',
    logo: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=100&h=100&fit=crop',
    productCount: 167,
    sales: 680000,
    isOfficial: true,
    tags: ['运动', '经典', '品质']
  },
  {
    id: 5,
    name: 'Sony',
    description: '索尼，创意娱乐',
    logo: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop',
    productCount: 145,
    sales: 560000,
    isOfficial: true,
    tags: ['娱乐', '音响', '游戏']
  },
  {
    id: 6,
    name: 'Xiaomi',
    description: '小米，为发烧而生',
    logo: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=100&h=100&fit=crop',
    productCount: 298,
    sales: 1100000,
    isOfficial: true,
    tags: ['性价比', '智能', '生态']
  },
  {
    id: 7,
    name: 'Huawei',
    description: '华为，构建万物互联',
    logo: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=100&h=100&fit=crop',
    productCount: 201,
    sales: 890000,
    isOfficial: true,
    tags: ['通信', '5G', '创新']
  },
  {
    id: 8,
    name: 'Tesla',
    description: '特斯拉，加速世界向可持续能源转变',
    logo: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=100&h=100&fit=crop',
    productCount: 45,
    sales: 320000,
    isOfficial: true,
    tags: ['电动车', '科技', '环保']
  }
])

// 格式化销量数字
const formatSales = (sales) => {
  if (sales >= 1000000) {
    return Math.floor(sales / 10000) + '万'
  } else if (sales >= 10000) {
    return Math.floor(sales / 10000) + '万'
  } else {
    return sales.toString()
  }
}

// 滚动控制
const scrollLeft = () => {
  if (brandsScrollRef.value) {
    brandsScrollRef.value.scrollBy({
      left: -300,
      behavior: 'smooth'
    })
  }
}

const scrollRight = () => {
  if (brandsScrollRef.value) {
    brandsScrollRef.value.scrollBy({
      left: 300,
      behavior: 'smooth'
    })
  }
}

// 检查滚动状态
const checkScrollStatus = () => {
  if (brandsScrollRef.value) {
    const { scrollLeft, scrollWidth, clientWidth } = brandsScrollRef.value
    canScrollLeft.value = scrollLeft > 0
    canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1
  }
}

// 跳转到品牌页面
const goToBrand = (brandId) => {
  router.push(`/brand/${brandId}`)
}

// 查看全部品牌
const viewAllBrands = () => {
  router.push('/brands')
}

onMounted(() => {
  if (brandsScrollRef.value) {
    brandsScrollRef.value.addEventListener('scroll', checkScrollStatus)
    checkScrollStatus()
  }
})

onUnmounted(() => {
  if (brandsScrollRef.value) {
    brandsScrollRef.value.removeEventListener('scroll', checkScrollStatus)
  }
})
</script>

<style scoped>
.brand-recommend {
  width: 100%;
}

.brands-container {
  position: relative;
  margin-bottom: var(--spacing-lg);
}

.brands-scroll {
  display: flex;
  gap: var(--spacing-lg);
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: var(--spacing-sm) 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.brands-scroll::-webkit-scrollbar {
  display: none;
}

.brand-card {
  flex: 0 0 280px;
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  cursor: pointer;
  position: relative;
}

.brand-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.brand-logo {
  width: 60px;
  height: 60px;
  margin: 0 auto var(--spacing-md) auto;
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--bg-gray-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-info {
  text-align: center;
}

.brand-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: var(--line-height-tight);
}

.brand-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md) 0;
  line-height: var(--line-height-normal);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.brand-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm) 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.stat-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.brand-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-xs);
}

.brand-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--bg-gray-light);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.brand-card:hover .brand-tag {
  background-color: var(--primary-color);
  color: var(--text-white);
}

.brand-badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--success-color);
  color: var(--text-white);
  font-size: var(--font-size-xs);
  border-radius: var(--radius-sm);
}

.scroll-controls {
  position: absolute;
  top: 50%;
  right: var(--spacing-sm);
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  z-index: 10;
}

.view-all {
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.ml-1 {
  margin-left: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .brand-card {
    flex: 0 0 240px;
    padding: var(--spacing-md);
  }
  
  .brand-logo {
    width: 50px;
    height: 50px;
  }
  
  .brand-name {
    font-size: var(--font-size-base);
  }
  
  .scroll-controls {
    display: none;
  }
}

@media (max-width: 480px) {
  .brand-card {
    flex: 0 0 200px;
    padding: var(--spacing-sm);
  }
  
  .brand-logo {
    width: 40px;
    height: 40px;
  }
  
  .brand-name {
    font-size: var(--font-size-sm);
  }
  
  .brand-desc {
    font-size: var(--font-size-xs);
  }
  
  .brands-scroll {
    gap: var(--spacing-md);
  }
}
</style>