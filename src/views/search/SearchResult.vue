<template>
  <div class="search-result-page">
    <div class="container">
      <!-- 搜索头部 -->
      <div class="search-header">
        <div class="search-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prepend>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </div>
        
        <div class="search-info">
          <span class="search-keyword">
            搜索"<strong>{{ currentKeyword }}</strong>"
          </span>
          <span class="result-count">
            找到 {{ total }} 个相关商品
          </span>
        </div>
      </div>

      <!-- 筛选和排序 -->
      <div class="filter-section">
        <!-- 分类筛选 -->
        <div class="category-filter">
          <span class="filter-label">分类：</span>
          <div class="category-tags">
            <el-tag
              v-for="category in categories"
              :key="category.id"
              :type="selectedCategory === category.id ? 'primary' : ''"
              :effect="selectedCategory === category.id ? 'dark' : 'plain'"
              @click="handleCategoryChange(category.id)"
            >
              {{ category.name }} ({{ category.count }})
            </el-tag>
          </div>
        </div>

        <!-- 价格筛选 -->
        <div class="price-filter">
          <span class="filter-label">价格：</span>
          <div class="price-tags">
            <el-tag
              v-for="range in priceRanges"
              :key="range.key"
              :type="selectedPriceRange === range.key ? 'primary' : ''"
              :effect="selectedPriceRange === range.key ? 'dark' : 'plain'"
              @click="handlePriceRangeChange(range.key)"
            >
              {{ range.label }}
            </el-tag>
          </div>
          
          <div class="custom-price">
            <el-input
              v-model="customPriceMin"
              placeholder="最低价"
              type="number"
              size="small"
            />
            <span>-</span>
            <el-input
              v-model="customPriceMax"
              placeholder="最高价"
              type="number"
              size="small"
            />
            <el-button size="small" @click="handleCustomPriceFilter">
              确定
            </el-button>
          </div>
        </div>

        <!-- 品牌筛选 -->
        <div class="brand-filter">
          <span class="filter-label">品牌：</span>
          <div class="brand-tags">
            <el-tag
              v-for="brand in brands"
              :key="brand.id"
              :type="selectedBrands.includes(brand.id) ? 'primary' : ''"
              :effect="selectedBrands.includes(brand.id) ? 'dark' : 'plain'"
              @click="handleBrandChange(brand.id)"
            >
              {{ brand.name }} ({{ brand.count }})
            </el-tag>
          </div>
        </div>

        <!-- 其他筛选 -->
        <div class="other-filters">
          <span class="filter-label">筛选：</span>
          <div class="filter-tags">
            <el-tag
              :type="onlyInStock ? 'primary' : ''"
              :effect="onlyInStock ? 'dark' : 'plain'"
              @click="onlyInStock = !onlyInStock"
            >
              仅显示有货
            </el-tag>
            <el-tag
              :type="onlyDiscount ? 'primary' : ''"
              :effect="onlyDiscount ? 'dark' : 'plain'"
              @click="onlyDiscount = !onlyDiscount"
            >
              仅显示促销
            </el-tag>
            <el-tag
              :type="freeShipping ? 'primary' : ''"
              :effect="freeShipping ? 'dark' : 'plain'"
              @click="freeShipping = !freeShipping"
            >
              包邮
            </el-tag>
          </div>
        </div>

        <!-- 排序 -->
        <div class="sort-section">
          <span class="sort-label">排序：</span>
          <div class="sort-options">
            <el-button
              v-for="option in sortOptions"
              :key="option.value"
              :type="sortBy === option.value ? 'primary' : ''"
              size="small"
              @click="handleSortChange(option.value)"
            >
              {{ option.label }}
              <el-icon v-if="sortBy === option.value && sortOrder === 'desc'">
                <ArrowDown />
              </el-icon>
              <el-icon v-else-if="sortBy === option.value && sortOrder === 'asc'">
                <ArrowUp />
              </el-icon>
            </el-button>
          </div>
        </div>

        <!-- 清除筛选 -->
        <div class="clear-filters">
          <el-button size="small" @click="clearAllFilters">
            清除筛选
          </el-button>
        </div>
      </div>

      <!-- 视图切换 -->
      <div class="view-controls">
        <div class="view-toggle">
          <el-button-group>
            <el-button
              :type="viewMode === 'grid' ? 'primary' : ''"
              :icon="Grid"
              @click="viewMode = 'grid'"
            >
              网格
            </el-button>
            <el-button
              :type="viewMode === 'list' ? 'primary' : ''"
              :icon="List"
              @click="viewMode = 'list'"
            >
              列表
            </el-button>
          </el-button-group>
        </div>
        
        <div class="page-size-control">
          <span>每页显示：</span>
          <el-select v-model="pageSize" size="small" @change="handlePageSizeChange">
            <el-option label="20" :value="20" />
            <el-option label="40" :value="40" />
            <el-option label="60" :value="60" />
          </el-select>
        </div>
      </div>

      <el-loading v-loading="loading" element-loading-text="搜索中...">
        <!-- 搜索结果 -->
        <div v-if="products.length > 0" class="search-results">
          <!-- 网格视图 -->
          <div v-if="viewMode === 'grid'" class="grid-view">
            <div
              v-for="product in products"
              :key="product.id"
              class="product-card"
              @click="goToProduct(product.id)"
            >
              <div class="product-image">
                <img :src="product.image" :alt="product.name" />
                <div v-if="product.discount" class="discount-badge">
                  {{ product.discount }}折
                </div>
              </div>
              
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-description">{{ product.description }}</p>
                
                <div class="product-price">
                  <span class="current-price">¥{{ product.price }}</span>
                  <span v-if="product.originalPrice" class="original-price">
                    ¥{{ product.originalPrice }}
                  </span>
                </div>
                
                <div class="product-meta">
                  <span class="sales">已售{{ product.sales }}件</span>
                  <span class="rating">
                    <el-rate
                      v-model="product.rating"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}"
                    />
                  </span>
                </div>
                
                <div class="product-tags">
                  <el-tag v-if="product.freeShipping" size="small" type="success">
                    包邮
                  </el-tag>
                  <el-tag v-if="product.isNew" size="small" type="primary">
                    新品
                  </el-tag>
                  <el-tag v-if="product.isHot" size="small" type="danger">
                    热销
                  </el-tag>
                </div>
              </div>
              
              <div class="product-actions">
                <el-button
                  type="primary"
                  size="small"
                  @click.stop="addToCart(product)"
                >
                  加入购物车
                </el-button>
              </div>
            </div>
          </div>

          <!-- 列表视图 -->
          <div v-else class="list-view">
            <div
              v-for="product in products"
              :key="product.id"
              class="product-item"
              @click="goToProduct(product.id)"
            >
              <div class="item-image">
                <img :src="product.image" :alt="product.name" />
                <div v-if="product.discount" class="discount-badge">
                  {{ product.discount }}折
                </div>
              </div>
              
              <div class="item-info">
                <h3 class="item-name">{{ product.name }}</h3>
                <p class="item-description">{{ product.description }}</p>
                
                <div class="item-features">
                  <span v-for="feature in product.features" :key="feature">
                    {{ feature }}
                  </span>
                </div>
                
                <div class="item-meta">
                  <span class="brand">{{ product.brand }}</span>
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
              
              <div class="item-price">
                <div class="price-info">
                  <span class="current-price">¥{{ product.price }}</span>
                  <span v-if="product.originalPrice" class="original-price">
                    ¥{{ product.originalPrice }}
                  </span>
                </div>
                
                <div class="item-tags">
                  <el-tag v-if="product.freeShipping" size="small" type="success">
                    包邮
                  </el-tag>
                  <el-tag v-if="product.isNew" size="small" type="primary">
                    新品
                  </el-tag>
                  <el-tag v-if="product.isHot" size="small" type="danger">
                    热销
                  </el-tag>
                </div>
                
                <el-button
                  type="primary"
                  @click.stop="addToCart(product)"
                >
                  加入购物车
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 无搜索结果 -->
        <div v-else-if="!loading" class="no-results">
          <el-empty description="没有找到相关商品">
            <div class="suggestions">
              <p>建议您：</p>
              <ul>
                <li>检查输入的关键词是否正确</li>
                <li>尝试更换关键词或减少关键词</li>
                <li>使用更通用的关键词</li>
              </ul>
            </div>
          </el-empty>
        </div>
      </el-loading>

      <!-- 分页 -->
      <div v-if="total > 0" class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[20, 40, 60]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Search, 
  Grid, 
  List, 
  ArrowDown, 
  ArrowUp 
} from '@element-plus/icons-vue'
import { productApi } from '@/api/product'
import { cartApi } from '@/api/cart'

const router = useRouter()
const route = useRoute()

// 响应式数据
const loading = ref(false)
const products = ref([])
const categories = ref([])
const brands = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)

// 搜索相关
const searchKeyword = ref('')
const currentKeyword = ref('')

// 筛选相关
const selectedCategory = ref('')
const selectedBrands = ref([])
const selectedPriceRange = ref('')
const customPriceMin = ref('')
const customPriceMax = ref('')
const onlyInStock = ref(false)
const onlyDiscount = ref(false)
const freeShipping = ref(false)

// 排序相关
const sortBy = ref('default')
const sortOrder = ref('desc')

// 视图相关
const viewMode = ref('grid')

// 价格区间选项
const priceRanges = [
  { key: '', label: '不限' },
  { key: '0-50', label: '50元以下' },
  { key: '50-100', label: '50-100元' },
  { key: '100-200', label: '100-200元' },
  { key: '200-500', label: '200-500元' },
  { key: '500-1000', label: '500-1000元' },
  { key: '1000-', label: '1000元以上' }
]

// 排序选项
const sortOptions = [
  { value: 'default', label: '综合' },
  { value: 'sales', label: '销量' },
  { value: 'price', label: '价格' },
  { value: 'rating', label: '评价' },
  { value: 'created', label: '新品' }
]

// 搜索商品
const searchProducts = async () => {
  loading.value = true
  try {
    const params = {
      keyword: currentKeyword.value,
      page: currentPage.value,
      pageSize: pageSize.value,
      category: selectedCategory.value || undefined,
      brands: selectedBrands.value.length > 0 ? selectedBrands.value : undefined,
      priceRange: selectedPriceRange.value || undefined,
      minPrice: customPriceMin.value || undefined,
      maxPrice: customPriceMax.value || undefined,
      onlyInStock: onlyInStock.value || undefined,
      onlyDiscount: onlyDiscount.value || undefined,
      freeShipping: freeShipping.value || undefined,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value
    }
    
    const response = await productApi.searchProducts(params)
    products.value = response.data.list
    total.value = response.data.total
    categories.value = response.data.categories || []
    brands.value = response.data.brands || []
  } catch (error) {
    console.error('搜索商品失败:', error)
    ElMessage.error('搜索商品失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  currentKeyword.value = searchKeyword.value.trim()
  currentPage.value = 1
  clearAllFilters()
  
  // 更新URL
  router.push({
    path: '/search',
    query: { q: currentKeyword.value }
  })
  
  searchProducts()
}

// 分类筛选
const handleCategoryChange = (categoryId) => {
  selectedCategory.value = selectedCategory.value === categoryId ? '' : categoryId
  currentPage.value = 1
  searchProducts()
}

// 品牌筛选
const handleBrandChange = (brandId) => {
  const index = selectedBrands.value.indexOf(brandId)
  if (index > -1) {
    selectedBrands.value.splice(index, 1)
  } else {
    selectedBrands.value.push(brandId)
  }
  currentPage.value = 1
  searchProducts()
}

// 价格区间筛选
const handlePriceRangeChange = (range) => {
  selectedPriceRange.value = selectedPriceRange.value === range ? '' : range
  customPriceMin.value = ''
  customPriceMax.value = ''
  currentPage.value = 1
  searchProducts()
}

// 自定义价格筛选
const handleCustomPriceFilter = () => {
  if (customPriceMin.value && customPriceMax.value) {
    if (Number(customPriceMin.value) >= Number(customPriceMax.value)) {
      ElMessage.warning('最低价不能大于等于最高价')
      return
    }
  }
  
  selectedPriceRange.value = ''
  currentPage.value = 1
  searchProducts()
}

// 排序处理
const handleSortChange = (sort) => {
  if (sortBy.value === sort) {
    sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  } else {
    sortBy.value = sort
    sortOrder.value = 'desc'
  }
  currentPage.value = 1
  searchProducts()
}

// 清除所有筛选
const clearAllFilters = () => {
  selectedCategory.value = ''
  selectedBrands.value = []
  selectedPriceRange.value = ''
  customPriceMin.value = ''
  customPriceMax.value = ''
  onlyInStock.value = false
  onlyDiscount.value = false
  freeShipping.value = false
  sortBy.value = 'default'
  sortOrder.value = 'desc'
}

// 分页处理
const handlePageSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  searchProducts()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  searchProducts()
}

// 跳转到商品详情
const goToProduct = (productId) => {
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

// 监听筛选条件变化
watch([onlyInStock, onlyDiscount, freeShipping], () => {
  currentPage.value = 1
  searchProducts()
})

// 监听路由查询参数
watch(() => route.query.q, (newKeyword) => {
  if (newKeyword) {
    searchKeyword.value = newKeyword
    currentKeyword.value = newKeyword
    searchProducts()
  }
}, { immediate: true })

// 页面初始化
onMounted(() => {
  const keyword = route.query.q
  if (keyword) {
    searchKeyword.value = keyword
    currentKeyword.value = keyword
    searchProducts()
  }
})
</script>

<style scoped>
.search-result-page {
  min-height: 100vh;
  background-color: var(--bg-secondary);
  padding: var(--spacing-lg) 0;
}

.search-header {
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.search-bar {
  margin-bottom: var(--spacing-lg);
}

.search-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-keyword {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}

.result-count {
  color: var(--text-secondary);
}

.filter-section {
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.category-filter,
.price-filter,
.brand-filter,
.other-filters,
.sort-section {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.filter-label,
.sort-label {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  min-width: 60px;
}

.category-tags,
.brand-tags,
.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.price-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-right: var(--spacing-lg);
}

.custom-price {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.custom-price .el-input {
  width: 100px;
}

.sort-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.clear-filters {
  margin-left: auto;
}

.view-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.page-size-control {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.search-results {
  margin-bottom: var(--spacing-xl);
}

/* 网格视图 */
.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.product-card {
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.product-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background-color: var(--danger-color);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
}

.product-info {
  padding: var(--spacing-lg);
}

.product-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md) 0;
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
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--danger-color);
}

.original-price {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-decoration: line-through;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.product-tags {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.product-actions {
  padding: 0 var(--spacing-lg) var(--spacing-lg);
}

.product-actions .el-button {
  width: 100%;
}

/* 列表视图 */
.list-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.product-item {
  display: flex;
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.product-item:hover {
  box-shadow: var(--shadow-md);
}

.item-image {
  position: relative;
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  padding: var(--spacing-lg);
}

.item-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-primary);
  line-height: 1.4;
}

.item-description {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md) 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-features {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.item-features span {
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  background-color: var(--primary-light);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.item-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.item-price {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: var(--spacing-lg);
  min-width: 200px;
}

.price-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: var(--spacing-md);
}

.item-tags {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.no-results {
  text-align: center;
  padding: var(--spacing-xxl) 0;
}

.suggestions {
  margin-top: var(--spacing-lg);
  text-align: left;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.suggestions ul {
  padding-left: var(--spacing-lg);
}

.suggestions li {
  margin-bottom: var(--spacing-sm);
  color: var(--text-secondary);
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-info {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: flex-start;
  }

  .category-filter,
  .price-filter,
  .brand-filter,
  .other-filters,
  .sort-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .view-controls {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .grid-view {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .product-item {
    flex-direction: column;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }

  .item-price {
    min-width: auto;
    align-items: stretch;
  }

  .price-info {
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .grid-view {
    grid-template-columns: 1fr;
  }

  .custom-price {
    flex-direction: column;
    align-items: stretch;
  }

  .custom-price .el-input {
    width: 100%;
  }
}
</style>