<template>
  <div class="product-list-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="search-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品..."
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button 
                type="primary" 
                :icon="Search"
                @click="handleSearch"
              />
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 筛选和排序 -->
    <div class="filter-section">
      <div class="container">
        <div class="filter-bar">
          <div class="filter-left">
            <el-select v-model="filters.category" placeholder="商品分类" clearable>
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
            
            <el-select v-model="filters.priceRange" placeholder="价格区间" clearable>
              <el-option label="0-100元" value="0-100" />
              <el-option label="100-500元" value="100-500" />
              <el-option label="500-1000元" value="500-1000" />
              <el-option label="1000元以上" value="1000+" />
            </el-select>
            
            <el-button @click="resetFilters">重置筛选</el-button>
          </div>
          
          <div class="filter-right">
            <el-radio-group v-model="sortBy" @change="handleSort">
              <el-radio-button label="default">默认排序</el-radio-button>
              <el-radio-button label="price_asc">价格升序</el-radio-button>
              <el-radio-button label="price_desc">价格降序</el-radio-button>
              <el-radio-button label="sales">销量优先</el-radio-button>
            </el-radio-group>
            
            <div class="view-mode">
              <el-button-group>
                <el-button 
                  :type="viewMode === 'grid' ? 'primary' : 'default'"
                  :icon="Grid"
                  @click="viewMode = 'grid'"
                />
                <el-button 
                  :type="viewMode === 'list' ? 'primary' : 'default'"
                  :icon="List"
                  @click="viewMode = 'list'"
                />
              </el-button-group>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="products-section">
      <div class="container">
        <div class="loading-container" v-loading="loading" element-loading-text="加载中...">
          <div v-if="products.length > 0" :class="['products-grid', viewMode]">
            <div
              v-for="product in products"
              :key="product.id"
              class="product-card"
              @click="goToDetail(product.id)"
            >
              <div class="product-image">
                <img :src="product.image" :alt="product.name" />
                <div class="product-actions">
                  <el-button
                    type="primary"
                    :icon="ShoppingCart"
                    circle
                    @click.stop="addToCart(product)"
                  />
                  <el-button
                    :type="product.isFavorite ? 'danger' : 'default'"
                    :icon="Star"
                    circle
                    @click.stop="toggleFavorite(product)"
                  />
                </div>
              </div>
              
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-desc">{{ product.description }}</p>
                
                <div class="product-price">
                  <span class="current-price">¥{{ product.price }}</span>
                  <span v-if="product.originalPrice" class="original-price">
                    ¥{{ product.originalPrice }}
                  </span>
                </div>
                
                <div class="product-stats">
                  <span class="sales">已售{{ product.sales }}件</span>
                  <el-rate
                    v-model="product.rating"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="!loading" class="empty-state">
            <el-empty description="暂无商品数据" />
          </div>
        </div>
        
        <!-- 分页 -->
        <div v-if="total > 0" class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[12, 24, 48, 96]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, ShoppingCart, Star, Grid, List } from '@element-plus/icons-vue'
import { productApi } from '@/api/product'
import { cartApi } from '@/api/cart'
import { userApi } from '@/api/user'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const viewMode = ref('grid')
const sortBy = ref('default')
const currentPage = ref(1)
const pageSize = ref(24)
const total = ref(0)

const products = ref([])
const categories = ref([
  { id: 1, name: '电子产品' },
  { id: 2, name: '服装鞋帽' },
  { id: 3, name: '家居用品' },
  { id: 4, name: '图书音像' },
  { id: 5, name: '运动户外' }
])

const filters = reactive({
  category: '',
  priceRange: ''
})

// 加载商品列表
const loadProducts = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      category: filters.category,
      priceRange: filters.priceRange,
      sortBy: sortBy.value
    }
    
    const response = await productApi.getProductList(params)
    products.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    console.error('加载商品列表失败:', error)
    ElMessage.error('加载商品列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索商品
const handleSearch = () => {
  currentPage.value = 1
  loadProducts()
}

// 排序处理
const handleSort = () => {
  currentPage.value = 1
  loadProducts()
}

// 重置筛选
const resetFilters = () => {
  filters.category = ''
  filters.priceRange = ''
  sortBy.value = 'default'
  currentPage.value = 1
  loadProducts()
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  loadProducts()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadProducts()
}

// 跳转到商品详情
const goToDetail = (productId) => {
  router.push(`/product/${productId}`)
}

// 添加到购物车
const addToCart = async (product) => {
  try {
    await cartApi.addToCart({
      productId: product.id,
      quantity: 1
    })
    ElMessage.success('已添加到购物车')
  } catch (error) {
    console.error('添加到购物车失败:', error)
    ElMessage.error('添加到购物车失败')
  }
}

// 切换收藏状态
const toggleFavorite = async (product) => {
  try {
    if (product.isFavorite) {
      await userApi.removeFavorite(product.favoriteId)
      product.isFavorite = false
      product.favoriteId = undefined
      ElMessage.success('已取消收藏')
    } else {
      const res = await userApi.addFavorite(product.id)
      product.isFavorite = true
      product.favoriteId = res.data?.id || product.favoriteId
      ElMessage.success('已添加到收藏')
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 监听筛选条件变化
watch([() => filters.category, () => filters.priceRange], () => {
  currentPage.value = 1
  loadProducts()
})

// 页面初始化
onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.product-list-page {
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

.page-header {
  background-color: var(--bg-white);
  padding: var(--spacing-lg) 0;
  border-bottom: 1px solid var(--border-color);
}

.breadcrumb {
  margin-bottom: var(--spacing-md);
}

.search-bar {
  max-width: 600px;
}

.search-input {
  width: 100%;
}

.filter-section {
  background-color: var(--bg-white);
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-color);
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
}

.filter-left {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.filter-left .el-select {
  min-width: 140px;
}

.filter-left .el-button {
  white-space: nowrap;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.filter-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: 4px;
  white-space: nowrap;
}

.filter-right {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.view-mode {
  margin-left: var(--spacing-md);
}

.products-section {
  padding: var(--spacing-xl) 0;
  min-height: calc(100vh - 200px); /* 确保有足够的高度 */
}

.loading-container {
  width: 100%;
  min-height: 600px; /* 增加最小高度 */
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: transparent;
}

/* 当有商品时，loading-container应该包含整个products-grid */
.loading-container .products-grid {
  width: 100%;
  min-height: inherit;
}

.products-grid {
  display: grid;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  width: 100%;
}

.products-grid.grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.products-grid.list {
  grid-template-columns: 1fr;
}

.product-card {
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.product-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.products-grid.list .product-card {
  display: flex;
  padding: var(--spacing-lg);
}

.product-image {
  position: relative;
  overflow: hidden;
}

.products-grid.grid .product-image {
  height: 200px;
}

.products-grid.list .product-image {
  width: 200px;
  height: 150px;
  flex-shrink: 0;
  margin-right: var(--spacing-lg);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-fast);
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-actions {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.product-card:hover .product-actions {
  opacity: 1;
}

.product-info {
  padding: var(--spacing-lg);
}

.products-grid.list .product-info {
  padding: 0;
  flex: 1;
}

.product-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  margin-bottom: var(--spacing-md);
}

.current-price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--danger-color);
}

.original-price {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-decoration: line-through;
  margin-left: var(--spacing-sm);
}

.product-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xxl) 0;
}

/* PC端大屏幕优化 */
@media (min-width: 1400px) {
  .container {
    max-width: 1400px;
  }
  
  .products-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }
  
  .filter-bar {
    padding: var(--spacing-lg);
  }
}

/* 平板端优化 */
@media (max-width: 992px) {
  .filter-right {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
  
  .products-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .filter-left,
  .filter-right {
    width: 100%;
    justify-content: center;
  }

  .products-section {
    padding: var(--spacing-lg) 0;
    min-height: calc(100vh - 180px); /* 移动端调整高度 */
  }

  .loading-container {
    min-height: 500px; /* 移动端适配高度 */
  }

  .products-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .products-grid.list .product-card {
    flex-direction: column;
  }

  .products-grid.list .product-image {
    width: 100%;
    height: 200px;
    margin-right: 0;
    margin-bottom: var(--spacing-md);
  }

  .products-grid.list .product-info {
    padding: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .products-section {
    padding: var(--spacing-md) 0;
    min-height: calc(100vh - 160px); /* 小屏幕进一步调整 */
  }

  .loading-container {
    min-height: 400px; /* 小屏幕适配高度 */
  }

  .products-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .filter-left {
    flex-direction: column;
    width: 100%;
  }

  .filter-right {
    flex-direction: column;
    width: 100%;
  }
}
</style>
