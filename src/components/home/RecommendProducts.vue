<template>
  <div class="recommend-products">
    <div class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card" @click="goToProduct(product.id)">
        <div class="product-image">
          <img :src="product.image" :alt="product.name" />
          <div class="product-badges">
            <span v-if="product.isHot" class="badge hot">热销</span>
            <span v-if="product.isNew" class="badge new">新品</span>
            <span v-if="product.discount" class="badge discount">{{ product.discount }}折</span>
          </div>
          <div class="product-actions">
            <el-button type="primary" size="small" circle @click.stop="addToCart(product)">
              <el-icon>
                <ShoppingCart />
              </el-icon>
            </el-button>
            <el-button type="info" size="small" circle @click.stop="toggleFavorite(product)">
              <el-icon>
                <Star />
              </el-icon>
            </el-button>
          </div>
        </div>

        <div class="product-info">
          <h4 class="product-name">{{ product.name }}</h4>
          <p class="product-desc">{{ product.description }}</p>

          <div class="product-price">
            <span class="current-price">¥{{ product.price }}</span>
            <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
          </div>

          <div class="product-stats">
            <div class="rating">
              <el-rate v-model="product.rating" disabled size="small" show-score text-color="#ff9900" />
            </div>
            <span class="sales">已售{{ product.sales }}件</span>
          </div>
        </div>
      </div>
    </div>

    <div class="load-more">
      <el-button type="primary" size="large" :loading="loading" @click="loadMore">
        查看更多推荐
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingCart, Star } from '@element-plus/icons-vue'
import { useCartStore } from '@/store/modules/cart'

const router = useRouter()
const cartStore = useCartStore()
const loading = ref(false)

// 推荐商品数据
const products = reactive([
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    description: '钛金属设计，A17 Pro芯片，专业级摄像系统',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
    price: 9999,
    originalPrice: 10999,
    rating: 4.8,
    sales: 1234,
    isHot: true,
    isNew: true,
    discount: 9.1
  },
  {
    id: 2,
    name: 'MacBook Pro 14英寸',
    description: 'M3芯片，Liquid Retina XDR显示屏',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
    price: 14999,
    originalPrice: 16999,
    rating: 4.9,
    sales: 856,
    isHot: true,
    isNew: false,
    discount: 8.8
  },
  {
    id: 3,
    name: 'AirPods Pro 第3代',
    description: '主动降噪，空间音频，无线充电盒',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop',
    price: 1899,
    originalPrice: 2199,
    rating: 4.7,
    sales: 2341,
    isHot: true,
    isNew: true,
    discount: 8.6
  },
  {
    id: 4,
    name: 'iPad Air 第5代',
    description: 'M1芯片，10.9英寸Liquid Retina显示屏',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop',
    price: 4399,
    originalPrice: 4799,
    rating: 4.6,
    sales: 1567,
    isHot: false,
    isNew: true,
    discount: 9.2
  },
  {
    id: 5,
    name: 'Apple Watch Series 9',
    description: 'S9芯片，Always-On Retina显示屏',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop',
    price: 2999,
    originalPrice: 3299,
    rating: 4.5,
    sales: 987,
    isHot: false,
    isNew: true,
    discount: 9.1
  },
  {
    id: 6,
    name: 'Sony WH-1000XM5',
    description: '业界领先的降噪技术，30小时续航',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
    price: 2399,
    originalPrice: 2699,
    rating: 4.8,
    sales: 1876,
    isHot: true,
    isNew: false,
    discount: 8.9
  },
  {
    id: 7,
    name: 'Nintendo Switch OLED',
    description: '7英寸OLED屏幕，增强音频体验',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop',
    price: 2599,
    originalPrice: 2899,
    rating: 4.7,
    sales: 1432,
    isHot: false,
    isNew: false,
    discount: 9.0
  },
  {
    id: 8,
    name: 'Samsung Galaxy S24 Ultra',
    description: 'AI摄影，S Pen，200MP主摄',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop',
    price: 8999,
    originalPrice: 9999,
    rating: 4.6,
    sales: 743,
    isHot: false,
    isNew: true,
    discount: 9.0
  }
])

// 跳转到商品详情
const goToProduct = (productId) => {
  router.push(`/product/${productId}`)
}

// 添加到购物车
const addToCart = async (product) => {
  try {
    await cartStore.addToCart({
      productId: product.id,
      quantity: 1
    })
    ElMessage.success('已添加到购物车')
  } catch (error) {
    ElMessage.error('添加失败，请重试')
  }
}

// 切换收藏状态
const toggleFavorite = (product) => {
  // 这里可以调用收藏相关的API
  ElMessage.success('已添加到收藏')
}

// 加载更多商品
const loadMore = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('已加载更多商品')
  } catch (error) {
    ElMessage.error('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 可以在这里加载推荐商品数据
  console.log('推荐商品组件加载完成')
})
</script>

<style scoped>
.recommend-products {
  width: 100%;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xxl);
}

.product-card {
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.product-image {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-badges {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--text-white);
  line-height: 1;
}

.badge.hot {
  background-color: var(--danger-color);
}

.badge.new {
  background-color: var(--success-color);
}

.badge.discount {
  background-color: var(--warning-color);
}

.product-actions {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  opacity: 0;
  transform: translateX(10px);
  transition: all var(--transition-normal);
}

.product-card:hover .product-actions {
  opacity: 1;
  transform: translateX(0);
}

.product-info {
  padding: var(--spacing-lg);
}

.product-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: var(--line-height-tight);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md) 0;
  line-height: var(--line-height-normal);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.current-price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--danger-color);
}

.original-price {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  text-decoration: line-through;
}

.product-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating {
  display: flex;
  align-items: center;
}

.sales {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.load-more {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-sm);
  }

  .product-image {
    height: 200px;
  }

  .product-info {
    padding: var(--spacing-md);
  }

  .product-name {
    font-size: var(--font-size-base);
  }

  .current-price {
    font-size: var(--font-size-lg);
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .product-image {
    height: 160px;
  }

  .product-info {
    padding: var(--spacing-sm);
  }

  .product-name {
    font-size: var(--font-size-sm);
  }

  .product-desc {
    font-size: var(--font-size-xs);
  }

  .current-price {
    font-size: var(--font-size-base);
  }

  .product-actions {
    display: none;
  }
}
</style>