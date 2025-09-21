<template>
  <div class="user-favorites">
    <div class="favorites-header">
      <h3 class="section-title">我的收藏</h3>
      <p class="section-subtitle">管理您收藏的商品</p>
    </div>

    <!-- 操作栏 -->
    <div class="favorites-toolbar">
      <div class="toolbar-left">
        <el-checkbox 
          v-model="selectAll" 
          :indeterminate="isIndeterminate"
          @change="handleSelectAll"
        >
          全选
        </el-checkbox>
        <span class="selected-count">
          已选择 {{ selectedItems.length }} 件商品
        </span>
      </div>
      <div class="toolbar-right">
        <el-button 
          v-if="selectedItems.length > 0"
          type="danger" 
          :icon="Delete"
          @click="batchRemoveFavorites"
        >
          批量删除
        </el-button>
        <el-button 
          v-if="selectedItems.length > 0"
          type="primary" 
          :icon="ShoppingCart"
          @click="batchAddToCart"
        >
          批量加入购物车
        </el-button>
        <el-dropdown @command="handleSortChange">
          <el-button :icon="Sort">
            {{ currentSort.label }}
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item 
                v-for="sort in sortOptions" 
                :key="sort.value"
                :command="sort.value"
                :class="{ 'is-active': currentSort.value === sort.value }"
              >
                {{ sort.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 收藏列表 -->
    <div class="favorites-content">
      <el-loading v-loading="loading" class="loading-container">
        <div v-if="favorites.length === 0" class="empty-state">
          <el-empty 
            :image-size="120"
            description="暂无收藏商品"
          >
            <el-button type="primary" @click="$router.push('/')">
              去逛逛
            </el-button>
          </el-empty>
        </div>

        <div v-else class="favorites-grid">
          <div 
            v-for="item in favorites" 
            :key="item.id"
            class="favorite-card"
            :class="{ 'is-selected': selectedItems.includes(item.id) }"
          >
            <!-- 选择框 -->
            <div class="card-checkbox">
              <el-checkbox 
                :model-value="selectedItems.includes(item.id)"
                @change="handleItemSelect(item.id, $event)"
              />
            </div>

            <!-- 商品图片 -->
            <div class="card-image" @click="goToProduct(item.productId)">
              <el-image 
                :src="item.image" 
                :alt="item.name"
                fit="cover"
                lazy
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              
              <!-- 商品标签 -->
              <div v-if="item.tags && item.tags.length > 0" class="product-tags">
                <el-tag 
                  v-for="tag in item.tags.slice(0, 2)" 
                  :key="tag"
                  size="small"
                  type="danger"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>

            <!-- 商品信息 -->
            <div class="card-content">
              <h4 class="product-name" @click="goToProduct(item.productId)">
                {{ item.name }}
              </h4>
              
              <div class="product-price">
                <span class="current-price">¥{{ item.currentPrice }}</span>
                <span 
                  v-if="item.originalPrice && item.originalPrice > item.currentPrice" 
                  class="original-price"
                >
                  ¥{{ item.originalPrice }}
                </span>
              </div>

              <div class="product-meta">
                <div class="product-rating">
                  <el-rate 
                    v-model="item.rating" 
                    disabled 
                    size="small"
                    show-score
                    text-color="#ff9900"
                  />
                </div>
                <div class="favorite-date">
                  收藏于 {{ formatDate(item.createdAt) }}
                </div>
              </div>

              <!-- 商品状态 -->
              <div v-if="item.status !== 'available'" class="product-status">
                <el-tag 
                  :type="getStatusType(item.status)"
                  size="small"
                >
                  {{ getStatusText(item.status) }}
                </el-tag>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="card-actions">
              <el-button 
                size="small" 
                type="primary"
                :disabled="item.status !== 'available'"
                @click="addToCart(item)"
              >
                加入购物车
              </el-button>
              <el-button 
                size="small" 
                :icon="Delete"
                @click="removeFavorite(item.id)"
              >
                移除
              </el-button>
            </div>
          </div>
        </div>
      </el-loading>

      <!-- 分页 -->
      <div v-if="total > 0" class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[12, 24, 48]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Delete, 
  ShoppingCart, 
  Sort, 
  ArrowDown, 
  Picture 
} from '@element-plus/icons-vue'
import { userApi } from '@/api/user'
import { cartApi } from '@/api/cart'
import { useCartStore } from '@/store/modules/cart'

const router = useRouter()
const cartStore = useCartStore()

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const favorites = ref([])
const selectedItems = ref([])

// 排序选项
const sortOptions = [
  { value: 'latest', label: '最新收藏' },
  { value: 'price_asc', label: '价格从低到高' },
  { value: 'price_desc', label: '价格从高到低' },
  { value: 'rating', label: '评分最高' },
  { value: 'sales', label: '销量最高' }
]

const currentSort = ref(sortOptions[0])

// 全选状态
const selectAll = computed({
  get() {
    return favorites.value.length > 0 && selectedItems.value.length === favorites.value.length
  },
  set(value) {
    if (value) {
      selectedItems.value = favorites.value.map(item => item.id)
    } else {
      selectedItems.value = []
    }
  }
})

// 半选状态
const isIndeterminate = computed(() => {
  return selectedItems.value.length > 0 && selectedItems.value.length < favorites.value.length
})

// 获取商品状态类型
const getStatusType = (status) => {
  const statusMap = {
    out_of_stock: 'danger',
    discontinued: 'info',
    price_changed: 'warning'
  }
  return statusMap[status] || 'info'
}

// 获取商品状态文本
const getStatusText = (status) => {
  const statusMap = {
    out_of_stock: '缺货',
    discontinued: '已下架',
    price_changed: '价格变动'
  }
  return statusMap[status] || '未知状态'
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 处理全选
const handleSelectAll = (value) => {
  selectAll.value = value
}

// 处理单项选择
const handleItemSelect = (itemId, checked) => {
  if (checked) {
    if (!selectedItems.value.includes(itemId)) {
      selectedItems.value.push(itemId)
    }
  } else {
    const index = selectedItems.value.indexOf(itemId)
    if (index > -1) {
      selectedItems.value.splice(index, 1)
    }
  }
}

// 处理排序变化
const handleSortChange = (sortValue) => {
  const sort = sortOptions.find(s => s.value === sortValue)
  if (sort) {
    currentSort.value = sort
    currentPage.value = 1
    loadFavorites()
  }
}

// 处理页码变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  loadFavorites()
}

// 处理页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadFavorites()
}

// 加载收藏列表
const loadFavorites = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      sort: currentSort.value.value
    }
    
    const response = await userApi.getUserFavorites(params)
    favorites.value = response.data.favorites
    total.value = response.data.total
    
    // 清空选择
    selectedItems.value = []
  } catch (error) {
    console.error('加载收藏失败:', error)
    ElMessage.error('加载收藏失败')
  } finally {
    loading.value = false
  }
}

// 跳转到商品详情
const goToProduct = (productId) => {
  router.push(`/product/${productId}`)
}

// 添加到购物车
const addToCart = async (item) => {
  try {
    await cartStore.addToCart({
      productId: item.productId,
      quantity: 1,
      specs: item.specs || {}
    })
    ElMessage.success('已添加到购物车')
  } catch (error) {
    console.error('添加到购物车失败:', error)
    ElMessage.error('添加到购物车失败')
  }
}

// 批量添加到购物车
const batchAddToCart = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请先选择商品')
    return
  }

  try {
    const availableItems = favorites.value.filter(
      item => selectedItems.value.includes(item.id) && item.status === 'available'
    )

    if (availableItems.length === 0) {
      ElMessage.warning('所选商品暂时无法购买')
      return
    }

    loading.value = true
    
    for (const item of availableItems) {
      await cartStore.addToCart({
        productId: item.productId,
        quantity: 1,
        specs: item.specs || {}
      })
    }

    ElMessage.success(`已将 ${availableItems.length} 件商品添加到购物车`)
    selectedItems.value = []
  } catch (error) {
    console.error('批量添加到购物车失败:', error)
    ElMessage.error('批量添加到购物车失败')
  } finally {
    loading.value = false
  }
}

// 移除收藏
const removeFavorite = async (favoriteId) => {
  try {
    await ElMessageBox.confirm(
      '确定要移除这个收藏吗？',
      '移除收藏',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    loading.value = true
    await userApi.removeFavorite(favoriteId)
    ElMessage.success('已移除收藏')
    loadFavorites()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('移除收藏失败:', error)
      ElMessage.error('移除收藏失败')
    }
  } finally {
    loading.value = false
  }
}

// 批量移除收藏
const batchRemoveFavorites = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请先选择要删除的商品')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要移除选中的 ${selectedItems.value.length} 个收藏吗？`,
      '批量移除收藏',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    loading.value = true
    await userApi.batchRemoveFavorites(selectedItems.value)
    ElMessage.success('批量移除成功')
    selectedItems.value = []
    loadFavorites()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量移除收藏失败:', error)
      ElMessage.error('批量移除收藏失败')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFavorites()
})
</script>

<style scoped>
.user-favorites {
  max-width: 1200px;
}

.favorites-header {
  margin-bottom: var(--spacing-xl);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.section-subtitle {
  color: var(--text-secondary);
  margin: 0;
}

.favorites-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.selected-count {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.toolbar-right {
  display: flex;
  gap: var(--spacing-sm);
}

.loading-container {
  min-height: 400px;
}

.empty-state {
  padding: var(--spacing-xxl) 0;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.favorite-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-fast);
  position: relative;
}

.favorite-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.favorite-card.is-selected {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.card-checkbox {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  z-index: 2;
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs);
}

.card-image {
  position: relative;
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}

.card-image .el-image {
  width: 100%;
  height: 100%;
  transition: transform var(--transition-fast);
}

.card-image:hover .el-image {
  transform: scale(1.05);
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: var(--font-size-xl);
}

.product-tags {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.card-content {
  padding: var(--spacing-md);
}

.product-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.4;
  cursor: pointer;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color var(--transition-fast);
}

.product-name:hover {
  color: var(--primary-color);
}

.product-price {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.current-price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.original-price {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-decoration: line-through;
}

.product-meta {
  margin-bottom: var(--spacing-sm);
}

.product-rating {
  margin-bottom: var(--spacing-xs);
}

.favorite-date {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.product-status {
  margin-bottom: var(--spacing-sm);
}

.card-actions {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-light);
}

.card-actions .el-button {
  flex: 1;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .favorites-toolbar {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }

  .toolbar-left,
  .toolbar-right {
    justify-content: center;
  }

  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--spacing-md);
  }

  .card-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .favorites-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }

  .favorite-card {
    margin: 0 -var(--spacing-md);
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  .card-image {
    height: 160px;
  }

  .toolbar-right {
    flex-direction: column;
  }
}
</style>