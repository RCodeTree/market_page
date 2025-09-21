<template>
  <div class="order-list-page">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1>我的订单</h1>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/user' }">用户中心</el-breadcrumb-item>
          <el-breadcrumb-item>我的订单</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 订单状态筛选 -->
      <div class="order-tabs">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="全部订单" name="all" />
          <el-tab-pane label="待付款" name="pending" />
          <el-tab-pane label="待发货" name="paid" />
          <el-tab-pane label="待收货" name="shipped" />
          <el-tab-pane label="待评价" name="delivered" />
          <el-tab-pane label="已完成" name="completed" />
          <el-tab-pane label="已取消" name="cancelled" />
        </el-tabs>
      </div>

      <!-- 搜索和筛选 -->
      <div class="search-section">
        <div class="search-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索订单号、商品名称"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </div>
        
        <div class="filter-bar">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="handleDateChange"
          />
          
          <el-select
            v-model="sortBy"
            placeholder="排序方式"
            @change="handleSortChange"
          >
            <el-option label="下单时间（最新）" value="created_desc" />
            <el-option label="下单时间（最早）" value="created_asc" />
            <el-option label="订单金额（高到低）" value="amount_desc" />
            <el-option label="订单金额（低到高）" value="amount_asc" />
          </el-select>
        </div>
      </div>

      <el-loading v-loading="loading" element-loading-text="加载中...">
        <!-- 订单列表 -->
        <div v-if="orders.length > 0" class="order-list">
          <div
            v-for="order in orders"
            :key="order.id"
            class="order-item"
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

            <!-- 订单商品列表 -->
            <div class="order-products">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="product-item"
                @click="goToProductDetail(item.productId)"
              >
                <div class="product-image">
                  <img :src="item.product.image" :alt="item.product.name" />
                </div>
                
                <div class="product-info">
                  <h4 class="product-name">{{ item.product.name }}</h4>
                  <p class="product-specs">
                    <span v-for="(value, key) in item.specifications" :key="key">
                      {{ key }}: {{ value }}
                    </span>
                  </p>
                  <div class="product-price">
                    <span class="price">¥{{ item.price }}</span>
                    <span class="quantity">x{{ item.quantity }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 订单金额 -->
            <div class="order-amount">
              <div class="amount-detail">
                <div class="amount-item">
                  <span>商品金额：</span>
                  <span>¥{{ order.productAmount }}</span>
                </div>
                <div v-if="order.shippingFee > 0" class="amount-item">
                  <span>运费：</span>
                  <span>¥{{ order.shippingFee }}</span>
                </div>
                <div v-if="order.discountAmount > 0" class="amount-item">
                  <span>优惠：</span>
                  <span class="discount">-¥{{ order.discountAmount }}</span>
                </div>
                <div class="amount-item total">
                  <span>实付款：</span>
                  <span class="total-amount">¥{{ order.totalAmount }}</span>
                </div>
              </div>
            </div>

            <!-- 订单操作 -->
            <div class="order-actions">
              <el-button
                type="primary"
                size="small"
                @click="goToOrderDetail(order.id)"
              >
                查看详情
              </el-button>
              
              <!-- 根据订单状态显示不同操作 -->
              <template v-if="order.status === 'pending'">
                <el-button
                  type="danger"
                  size="small"
                  @click="cancelOrder(order)"
                >
                  取消订单
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="payOrder(order)"
                >
                  立即付款
                </el-button>
              </template>
              
              <template v-else-if="order.status === 'shipped'">
                <el-button
                  type="primary"
                  size="small"
                  @click="confirmReceive(order)"
                >
                  确认收货
                </el-button>
                <el-button
                  size="small"
                  @click="trackOrder(order)"
                >
                  查看物流
                </el-button>
              </template>
              
              <template v-else-if="order.status === 'delivered'">
                <el-button
                  type="primary"
                  size="small"
                  @click="goToReview(order)"
                >
                  评价商品
                </el-button>
                <el-button
                  size="small"
                  @click="applyAfterSale(order)"
                >
                  申请售后
                </el-button>
              </template>
              
              <template v-else-if="order.status === 'completed'">
                <el-button
                  size="small"
                  @click="buyAgain(order)"
                >
                  再次购买
                </el-button>
                <el-button
                  size="small"
                  @click="applyAfterSale(order)"
                >
                  申请售后
                </el-button>
              </template>
              
              <template v-else-if="order.status === 'paid'">
                <el-button
                  size="small"
                  @click="remindShipping(order)"
                >
                  提醒发货
                </el-button>
              </template>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-orders">
          <el-empty :description="getEmptyDescription()">
            <el-button type="primary" @click="$router.push('/product')">
              去购物
            </el-button>
          </el-empty>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { orderApi } from '@/api/order'
import { cartApi } from '@/api/cart'

const router = useRouter()
const route = useRoute()

// 响应式数据
const loading = ref(false)
const orders = ref([])
const activeTab = ref('all')
const searchKeyword = ref('')
const dateRange = ref([])
const sortBy = ref('created_desc')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 订单状态映射
const statusMap = {
  pending: { text: '待付款', type: 'warning' },
  paid: { text: '待发货', type: 'primary' },
  shipped: { text: '待收货', type: 'info' },
  delivered: { text: '待评价', type: 'success' },
  completed: { text: '已完成', type: 'success' },
  cancelled: { text: '已取消', type: 'danger' }
}

// 计算属性
const getStatusText = (status) => {
  return statusMap[status]?.text || '未知状态'
}

const getStatusType = (status) => {
  return statusMap[status]?.type || 'info'
}

const getEmptyDescription = () => {
  if (activeTab.value === 'all') {
    return '暂无订单'
  }
  return `暂无${statusMap[activeTab.value]?.text || ''}订单`
}

// 加载订单列表
const loadOrders = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      status: activeTab.value === 'all' ? undefined : activeTab.value,
      keyword: searchKeyword.value || undefined,
      startDate: dateRange.value?.[0],
      endDate: dateRange.value?.[1],
      sortBy: sortBy.value
    }
    
    const response = await orderApi.getOrderList(params)
    orders.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    console.error('加载订单列表失败:', error)
    ElMessage.error('加载订单列表失败')
  } finally {
    loading.value = false
  }
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

// 标签页切换
const handleTabChange = (tabName) => {
  activeTab.value = tabName
  currentPage.value = 1
  loadOrders()
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadOrders()
}

// 日期范围变化
const handleDateChange = () => {
  currentPage.value = 1
  loadOrders()
}

// 排序变化
const handleSortChange = () => {
  currentPage.value = 1
  loadOrders()
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadOrders()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadOrders()
}

// 跳转到订单详情
const goToOrderDetail = (orderId) => {
  router.push(`/order/${orderId}`)
}

// 跳转到商品详情
const goToProductDetail = (productId) => {
  router.push(`/product/${productId}`)
}

// 取消订单
const cancelOrder = async (order) => {
  try {
    await ElMessageBox.confirm(
      '确定要取消这个订单吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await orderApi.cancelOrder(order.id)
    ElMessage.success('订单已取消')
    loadOrders()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error)
      ElMessage.error('取消订单失败')
    }
  }
}

// 支付订单
const payOrder = (order) => {
  // 跳转到支付页面
  router.push(`/order/pay/${order.id}`)
}

// 确认收货
const confirmReceive = async (order) => {
  try {
    await ElMessageBox.confirm(
      '确定已收到商品吗？',
      '确认收货',
      {
        confirmButtonText: '确认收货',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    
    await orderApi.confirmReceive(order.id)
    ElMessage.success('确认收货成功')
    loadOrders()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('确认收货失败:', error)
      ElMessage.error('确认收货失败')
    }
  }
}

// 查看物流
const trackOrder = (order) => {
  router.push(`/order/track/${order.id}`)
}

// 去评价
const goToReview = (order) => {
  router.push(`/order/review/${order.id}`)
}

// 申请售后
const applyAfterSale = (order) => {
  router.push(`/order/aftersale/${order.id}`)
}

// 再次购买
const buyAgain = async (order) => {
  try {
    // 将订单商品重新加入购物车
    for (const item of order.items) {
      await cartApi.addToCart({
        productId: item.productId,
        quantity: item.quantity,
        specifications: item.specifications
      })
    }
    ElMessage.success('商品已加入购物车')
    router.push('/cart')
  } catch (error) {
    console.error('再次购买失败:', error)
    ElMessage.error('再次购买失败')
  }
}

// 提醒发货
const remindShipping = async (order) => {
  try {
    await orderApi.remindShipping(order.id)
    ElMessage.success('提醒发货成功')
  } catch (error) {
    console.error('提醒发货失败:', error)
    ElMessage.error('提醒发货失败')
  }
}

// 监听路由参数变化
watch(() => route.query.status, (newStatus) => {
  if (newStatus && statusMap[newStatus]) {
    activeTab.value = newStatus
  }
}, { immediate: true })

// 页面初始化
onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.order-list-page {
  min-height: 100vh;
  background-color: var(--bg-secondary);
  padding: var(--spacing-lg) 0;
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  font-size: var(--font-size-xxl);
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-primary);
}

.order-tabs {
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: 0 var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.search-section {
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.search-bar {
  margin-bottom: var(--spacing-md);
}

.filter-bar {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.order-item {
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-fast);
}

.order-item:hover {
  box-shadow: var(--shadow-md);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

.order-info {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
}

.order-number {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.order-date {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.order-products {
  padding: var(--spacing-lg);
}

.product-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md) 0;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.product-item:hover {
  background-color: var(--bg-secondary);
}

.product-item:not(:last-child) {
  border-bottom: 1px solid var(--border-color);
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
  line-height: 1.4;
}

.product-specs {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-sm) 0;
}

.product-specs span {
  margin-right: var(--spacing-md);
}

.product-price {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--danger-color);
}

.quantity {
  color: var(--text-secondary);
}

.order-amount {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

.amount-detail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  align-items: flex-end;
}

.amount-item {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
}

.amount-item.total {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-color);
}

.discount {
  color: var(--success-color);
}

.total-amount {
  color: var(--danger-color);
  font-size: var(--font-size-lg);
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.empty-orders {
  text-align: center;
  padding: var(--spacing-xxl) 0;
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
    gap: var(--spacing-md);
    align-items: flex-start;
  }

  .order-info {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: flex-start;
  }

  .product-item {
    flex-direction: column;
  }

  .product-image {
    align-self: center;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .order-actions {
    flex-wrap: wrap;
    justify-content: center;
  }

  .amount-detail {
    align-items: stretch;
  }

  .amount-item {
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .order-actions {
    flex-direction: column;
  }

  .order-actions .el-button {
    width: 100%;
  }
}
</style>