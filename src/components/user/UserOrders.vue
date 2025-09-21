<template>
  <div class="user-orders">
    <div class="orders-header">
      <h3 class="section-title">我的订单</h3>
      <p class="section-subtitle">查看和管理您的订单</p>
    </div>

    <!-- 订单状态筛选 -->
    <div class="order-tabs">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane 
          v-for="tab in orderTabs" 
          :key="tab.name"
          :label="tab.label" 
          :name="tab.name"
        >
          <template #label>
            <span class="tab-label">
              {{ tab.label }}
              <el-badge 
                v-if="tab.count > 0" 
                :value="tab.count" 
                class="tab-badge"
              />
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 订单列表 -->
    <div class="orders-content">
      <el-loading v-loading="loading" class="loading-container">
        <div v-if="orders.length === 0" class="empty-state">
          <el-empty 
            :image-size="120"
            description="暂无订单"
          >
            <el-button type="primary" @click="$router.push('/')">
              去购物
            </el-button>
          </el-empty>
        </div>

        <div v-else class="orders-list">
          <div 
            v-for="order in orders" 
            :key="order.id"
            class="order-card"
          >
            <!-- 订单头部 -->
            <div class="order-header">
              <div class="order-info">
                <span class="order-number">订单号：{{ order.orderNumber }}</span>
                <span class="order-date">{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="order-status">
                <el-tag 
                  :type="getStatusType(order.status)"
                  size="large"
                >
                  {{ getStatusText(order.status) }}
                </el-tag>
              </div>
            </div>

            <!-- 订单商品 -->
            <div class="order-items">
              <div 
                v-for="item in order.items" 
                :key="item.id"
                class="order-item"
                @click="goToProduct(item.productId)"
              >
                <div class="item-image">
                  <el-image 
                    :src="item.image" 
                    :alt="item.name"
                    fit="cover"
                    lazy
                  />
                </div>
                <div class="item-details">
                  <h4 class="item-name">{{ item.name }}</h4>
                  <p class="item-specs">{{ item.specs }}</p>
                  <div class="item-price-qty">
                    <span class="item-price">¥{{ item.price }}</span>
                    <span class="item-quantity">×{{ item.quantity }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 订单总计 -->
            <div class="order-summary">
              <div class="summary-info">
                <span class="total-items">共{{ order.totalItems }}件商品</span>
                <span class="total-amount">
                  实付款：<strong>¥{{ order.totalAmount }}</strong>
                </span>
              </div>
            </div>

            <!-- 订单操作 -->
            <div class="order-actions">
              <el-button 
                size="small" 
                @click="viewOrderDetail(order.id)"
              >
                查看详情
              </el-button>
              
              <el-button 
                v-if="order.status === 'pending'"
                size="small" 
                type="danger"
                @click="cancelOrder(order.id)"
              >
                取消订单
              </el-button>
              
              <el-button 
                v-if="order.status === 'pending'"
                size="small" 
                type="primary"
                @click="payOrder(order.id)"
              >
                立即付款
              </el-button>
              
              <el-button 
                v-if="order.status === 'shipped'"
                size="small" 
                type="primary"
                @click="confirmReceived(order.id)"
              >
                确认收货
              </el-button>
              
              <el-button 
                v-if="order.status === 'completed'"
                size="small"
                @click="reviewOrder(order.id)"
              >
                评价
              </el-button>
              
              <el-button 
                v-if="['completed', 'cancelled'].includes(order.status)"
                size="small"
                @click="deleteOrder(order.id)"
              >
                删除订单
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
          :page-sizes="[10, 20, 50]"
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
import { orderApi } from '@/api/order'

const router = useRouter()

const loading = ref(false)
const activeTab = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const orders = ref([])

// 订单状态标签
const orderTabs = reactive([
  { name: 'all', label: '全部订单', count: 0 },
  { name: 'pending', label: '待付款', count: 0 },
  { name: 'paid', label: '待发货', count: 0 },
  { name: 'shipped', label: '待收货', count: 0 },
  { name: 'completed', label: '已完成', count: 0 },
  { name: 'cancelled', label: '已取消', count: 0 }
])

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    pending: 'warning',
    paid: 'info',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待付款',
    paid: '待发货',
    shipped: '待收货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知状态'
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 处理标签切换
const handleTabChange = (tabName) => {
  activeTab.value = tabName
  currentPage.value = 1
  loadOrders()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  loadOrders()
}

// 处理页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadOrders()
}

// 加载订单列表
const loadOrders = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      status: activeTab.value === 'all' ? undefined : activeTab.value
    }
    
    const response = await orderApi.getUserOrders(params)
    orders.value = response.data.orders
    total.value = response.data.total
    
    // 更新标签计数
    updateTabCounts(response.data.statusCounts)
  } catch (error) {
    console.error('加载订单失败:', error)
    ElMessage.error('加载订单失败')
  } finally {
    loading.value = false
  }
}

// 更新标签计数
const updateTabCounts = (statusCounts) => {
  orderTabs.forEach(tab => {
    if (tab.name === 'all') {
      tab.count = Object.values(statusCounts).reduce((sum, count) => sum + count, 0)
    } else {
      tab.count = statusCounts[tab.name] || 0
    }
  })
}

// 查看订单详情
const viewOrderDetail = (orderId) => {
  router.push(`/order/${orderId}`)
}

// 跳转到商品详情
const goToProduct = (productId) => {
  router.push(`/product/${productId}`)
}

// 取消订单
const cancelOrder = async (orderId) => {
  try {
    await ElMessageBox.confirm(
      '确定要取消这个订单吗？',
      '取消订单',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    loading.value = true
    await orderApi.cancelOrder(orderId)
    ElMessage.success('订单已取消')
    loadOrders()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error)
      ElMessage.error('取消订单失败')
    }
  } finally {
    loading.value = false
  }
}

// 支付订单
const payOrder = (orderId) => {
  router.push(`/checkout?orderId=${orderId}`)
}

// 确认收货
const confirmReceived = async (orderId) => {
  try {
    await ElMessageBox.confirm(
      '确定已收到商品吗？',
      '确认收货',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    
    loading.value = true
    await orderApi.confirmReceived(orderId)
    ElMessage.success('确认收货成功')
    loadOrders()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('确认收货失败:', error)
      ElMessage.error('确认收货失败')
    }
  } finally {
    loading.value = false
  }
}

// 评价订单
const reviewOrder = (orderId) => {
  router.push(`/order/${orderId}/review`)
}

// 删除订单
const deleteOrder = async (orderId) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个订单吗？删除后无法恢复。',
      '删除订单',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    loading.value = true
    await orderApi.deleteOrder(orderId)
    ElMessage.success('订单已删除')
    loadOrders()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除订单失败:', error)
      ElMessage.error('删除订单失败')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.user-orders {
  max-width: 1000px;
}

.orders-header {
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

.order-tabs {
  margin-bottom: var(--spacing-xl);
}

.tab-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.tab-badge {
  margin-left: var(--spacing-xs);
}

.loading-container {
  min-height: 200px;
}

.empty-state {
  padding: var(--spacing-xxl) 0;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.order-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: box-shadow var(--transition-fast);
}

.order-card:hover {
  box-shadow: var(--shadow-md);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.order-number {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.order-date {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.order-items {
  padding: var(--spacing-lg);
}

.order-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.order-item:last-child {
  border-bottom: none;
}

.order-item:hover {
  background-color: var(--bg-secondary);
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
}

.item-image .el-image {
  width: 100%;
  height: 100%;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-specs {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-sm) 0;
}

.item-price-qty {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--primary-color);
}

.item-quantity {
  color: var(--text-secondary);
}

.order-summary {
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

.summary-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-items {
  color: var(--text-secondary);
}

.total-amount {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}

.total-amount strong {
  color: var(--primary-color);
  font-size: var(--font-size-xl);
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .order-item {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .item-image {
    width: 60px;
    height: 60px;
  }

  .item-price-qty {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .summary-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .order-actions {
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .order-actions .el-button {
    flex: 1;
    min-width: 80px;
  }
}

@media (max-width: 480px) {
  .order-card {
    margin: 0 -var(--spacing-md);
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  .order-header,
  .order-items,
  .order-summary,
  .order-actions {
    padding: var(--spacing-md);
  }

  .order-actions {
    flex-direction: column;
  }

  .order-actions .el-button {
    width: 100%;
  }
}
</style>