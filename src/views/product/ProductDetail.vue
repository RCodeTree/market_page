<template>
  <div class="product-detail-page">
    <el-loading v-loading="loading" element-loading-text="加载中...">
      <div v-if="product" class="container">
        <!-- 面包屑导航 -->
        <div class="breadcrumb-section">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/product' }">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- 商品主要信息 -->
        <div class="product-main">
          <!-- 商品图片 -->
          <div class="product-images">
            <div class="main-image">
              <img :src="currentImage" :alt="product.name" />
              <div class="image-actions">
                <el-button 
                  type="primary" 
                  :icon="ZoomIn"
                  circle
                  @click="showImagePreview = true"
                />
              </div>
            </div>
            
            <div class="thumbnail-list">
              <div
                v-for="(image, index) in product.images"
                :key="index"
                :class="['thumbnail', { active: currentImage === image }]"
                @click="currentImage = image"
              >
                <img :src="image" :alt="`${product.name} ${index + 1}`" />
              </div>
            </div>
          </div>

          <!-- 商品信息 -->
          <div class="product-info">
            <h1 class="product-title">{{ product.name }}</h1>
            
            <div class="product-subtitle">
              {{ product.subtitle }}
            </div>

            <div class="product-rating">
              <el-rate
                v-model="product.rating"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}分"
              />
              <span class="review-count">({{ product.reviewCount }}条评价)</span>
            </div>

            <div class="product-price">
              <span class="current-price">¥{{ product.price }}</span>
              <span v-if="product.originalPrice" class="original-price">
                ¥{{ product.originalPrice }}
              </span>
              <el-tag v-if="product.discount" type="danger" size="small">
                {{ product.discount }}折
              </el-tag>
            </div>

            <div class="product-sales">
              <span>已售 {{ product.sales }} 件</span>
              <span>库存 {{ product.stock }} 件</span>
            </div>

            <!-- 商品规格选择 -->
            <div v-if="product.specifications" class="product-specs">
              <div
                v-for="spec in product.specifications"
                :key="spec.name"
                class="spec-group"
              >
                <label class="spec-label">{{ spec.name }}：</label>
                <div class="spec-options">
                  <el-radio-group v-model="selectedSpecs[spec.name]">
                    <el-radio-button
                      v-for="option in spec.options"
                      :key="option.value"
                      :label="option.value"
                      :disabled="!option.available"
                    >
                      {{ option.label }}
                    </el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </div>

            <!-- 购买数量 -->
            <div class="quantity-section">
              <label class="quantity-label">数量：</label>
              <el-input-number
                v-model="quantity"
                :min="1"
                :max="product.stock"
                size="large"
              />
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <el-button
                type="primary"
                size="large"
                :icon="ShoppingCart"
                :loading="addingToCart"
                @click="addToCart"
              >
                加入购物车
              </el-button>
              
              <el-button
                type="danger"
                size="large"
                :loading="buyingNow"
                @click="buyNow"
              >
                立即购买
              </el-button>
              
              <el-button
                :type="isFavorite ? 'warning' : 'default'"
                size="large"
                :icon="Star"
                :loading="favoriteLoading"
                @click="toggleFavorite"
              >
                {{ isFavorite ? '已收藏' : '收藏' }}
              </el-button>
            </div>

            <!-- 服务保障 -->
            <div class="service-guarantee">
              <h4>服务保障</h4>
              <div class="guarantee-list">
                <div class="guarantee-item">
                  <el-icon><Shield /></el-icon>
                  <span>正品保证</span>
                </div>
              <div class="guarantee-item">
                  <el-icon><Van /></el-icon>
                  <span>快速配送</span>
                </div>
                <div class="guarantee-item">
                  <el-icon><RefreshRight /></el-icon>
                  <span>7天无理由退换</span>
                </div>
                <div class="guarantee-item">
                  <el-icon><Service /></el-icon>
                  <span>售后服务</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 商品详情标签页 -->
        <div class="product-details">
          <el-tabs v-model="activeTab" class="detail-tabs">
            <el-tab-pane label="商品详情" name="details">
              <div class="detail-content" v-html="product.details"></div>
            </el-tab-pane>
            
            <el-tab-pane label="规格参数" name="specifications">
              <div class="spec-table">
                <table>
                  <tbody>
                    <tr v-for="param in product.parameters" :key="param.name">
                      <td class="param-name">{{ param.name }}</td>
                      <td class="param-value">{{ param.value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-tab-pane>
            
            <el-tab-pane :label="`用户评价(${product.reviewCount})`" name="reviews">
              <ProductReviews :product-id="product.id" />
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 推荐商品 -->
        <div class="recommend-section">
          <h3>相关推荐</h3>
          <div class="recommend-products">
            <div
              v-for="item in recommendProducts"
              :key="item.id"
              class="recommend-item"
              @click="goToProduct(item.id)"
            >
              <img :src="item.image" :alt="item.name" />
              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <span class="item-price">¥{{ item.price }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品不存在 -->
      <div v-else-if="!loading" class="not-found">
        <el-empty description="商品不存在或已下架" />
        <el-button type="primary" @click="$router.push('/product')">
          返回商品列表
        </el-button>
      </div>
    </el-loading>

    <!-- 图片预览 -->
    <el-dialog
      v-model="showImagePreview"
      title="商品图片"
      width="80%"
      center
    >
      <el-carousel height="500px" indicator-position="outside">
        <el-carousel-item v-for="(image, index) in product?.images" :key="index">
          <img :src="image" :alt="`${product?.name} ${index + 1}`" class="preview-image" />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ShoppingCart, Star, ZoomIn, Shield, Van, 
  RefreshRight, Service
} from '@element-plus/icons-vue'
import { productApi } from '@/api/product'
import { cartApi } from '@/api/cart'
import { userApi } from '@/api/user'
import { orderApi } from '@/api/order'
import ProductReviews from '@/components/product/ProductReviews.vue'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const product = ref(null)
const currentImage = ref('')
const quantity = ref(1)
const activeTab = ref('details')
const showImagePreview = ref(false)
const addingToCart = ref(false)
const buyingNow = ref(false)
const favoriteLoading = ref(false)
const isFavorite = ref(false)
const recommendProducts = ref([])

const selectedSpecs = reactive({})

// 计算属性
const productId = computed(() => route.params.id)

// 加载商品详情
const loadProductDetail = async () => {
  loading.value = true
  try {
    const response = await productApi.getProductDetail(productId.value)
    product.value = response.data
    currentImage.value = product.value.images?.[0] || ''
    isFavorite.value = product.value.isFavorite || false
    
    // 初始化规格选择
    if (product.value.specifications) {
      product.value.specifications.forEach(spec => {
        selectedSpecs[spec.name] = spec.options[0]?.value || ''
      })
    }
    
    // 加载推荐商品
    loadRecommendProducts()
  } catch (error) {
    console.error('加载商品详情失败:', error)
    ElMessage.error('加载商品详情失败')
  } finally {
    loading.value = false
  }
}

// 加载推荐商品
const loadRecommendProducts = async () => {
  try {
    // 使用后端推荐接口，排除当前商品ID
    const response = await productApi.getRecommendedProducts({ excludeId: productId.value, limit: 8 })
    recommendProducts.value = response.data
  } catch (error) {
    console.error('加载推荐商品失败:', error)
  }
}

// 添加到购物车
const addToCart = async () => {
  if (!validateSelection()) return
  
  addingToCart.value = true
  try {
    await cartApi.addToCart({
      productId: product.value.id,
      quantity: quantity.value,
      specifications: selectedSpecs
    })
    ElMessage.success('已添加到购物车')
  } catch (error) {
    console.error('添加到购物车失败:', error)
    ElMessage.error('添加到购物车失败')
  } finally {
    addingToCart.value = false
  }
}

// 立即购买
const buyNow = async () => {
  if (!validateSelection()) return
  
  buyingNow.value = true
  try {
    // 跳转到订单确认页
    const checkoutData = {
      items: [{
        cartId: null,
        productId: product.value.id,
        quantity: quantity.value,
        specifications: selectedSpecs,
        price: product.value.price,
        product: {
          name: product.value.name,
          image: product.value.images?.[0] || product.value.mainImage || ''
        }
      }]
    }
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData))
    router.push('/order/checkout')
  } catch (error) {
    console.error('创建订单失败:', error)
    ElMessage.error('创建订单失败')
  } finally {
    buyingNow.value = false
  }
}

// 切换收藏状态
const toggleFavorite = async () => {
  favoriteLoading.value = true
  try {
    if (isFavorite.value) {
      await userApi.removeFavorite(product.value.favoriteId)
      isFavorite.value = false
      ElMessage.success('已取消收藏')
    } else {
      await userApi.addFavorite(product.value.id)
      isFavorite.value = true
      ElMessage.success('已添加到收藏')
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  } finally {
    favoriteLoading.value = false
  }
}

// 验证选择
const validateSelection = () => {
  if (product.value.specifications) {
    for (const spec of product.value.specifications) {
      if (!selectedSpecs[spec.name]) {
        ElMessage.warning(`请选择${spec.name}`)
        return false
      }
    }
  }
  
  if (quantity.value > product.value.stock) {
    ElMessage.warning('购买数量超过库存')
    return false
  }
  
  return true
}

// 跳转到其他商品
const goToProduct = (id) => {
  router.push(`/product/${id}`)
}

// 监听路由变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadProductDetail()
  }
})

// 页面初始化
onMounted(() => {
  loadProductDetail()
})
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background-color: var(--bg-secondary);
  padding: var(--spacing-lg) 0;
}

.breadcrumb-section {
  margin-bottom: var(--spacing-lg);
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xxl);
  background-color: var(--bg-white);
  padding: var(--spacing-xxl);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.main-image {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--bg-secondary);
}

.main-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
}

.thumbnail-list {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color var(--transition-fast);
}

.thumbnail.active {
  border-color: var(--primary-color);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.product-title {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  margin: 0;
  color: var(--text-primary);
}

.product-subtitle {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.review-count {
  color: var(--text-secondary);
}

.product-price {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.current-price {
  font-size: var(--font-size-xxxl);
  font-weight: var(--font-weight-bold);
  color: var(--danger-color);
}

.original-price {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  text-decoration: line-through;
}

.product-sales {
  display: flex;
  gap: var(--spacing-lg);
  color: var(--text-secondary);
}

.product-specs {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}

.spec-group {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.spec-group:last-child {
  margin-bottom: 0;
}

.spec-label {
  width: 100px;
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.spec-options {
  flex: 1;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.quantity-label {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);
}

.action-buttons .el-button {
  flex: 1;
}

.service-guarantee {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}

.service-guarantee h4 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-primary);
}

.guarantee-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.guarantee-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
}

.product-details {
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.detail-content {
  line-height: var(--line-height-relaxed);
}

.spec-table table {
  width: 100%;
  border-collapse: collapse;
}

.spec-table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.param-name {
  width: 200px;
  font-weight: var(--font-weight-medium);
  background-color: var(--bg-secondary);
}

.recommend-section {
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.recommend-section h3 {
  margin: 0 0 var(--spacing-lg) 0;
  color: var(--text-primary);
}

.recommend-products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.recommend-item {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.recommend-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.recommend-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.item-info {
  padding: var(--spacing-md);
}

.item-info h4 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-base);
  color: var(--text-primary);
}

.item-price {
  color: var(--danger-color);
  font-weight: var(--font-weight-bold);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.not-found {
  text-align: center;
  padding: var(--spacing-xxl) 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-main {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
  }

  .main-image img {
    height: 300px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .guarantee-list {
    grid-template-columns: 1fr;
  }

  .spec-group {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .spec-label {
    width: auto;
  }

  .quantity-section {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .product-detail-page {
    padding: var(--spacing-md) 0;
  }

  .recommend-products {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>