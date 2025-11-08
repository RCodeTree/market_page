<template>
  <div class="order-detail-page">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/user' }">用户中心</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/order' }">我的订单</el-breadcrumb-item>
          <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
        
        <div class="header-actions">
          <el-button @click="$router.go(-1)">
            返回
          </el-button>
        </div>
      </div>

      <el-loading v-loading="loading" element-loading-text="加载中...">
        <div v-if="order" class="order-detail">
          <!-- 订单状态 -->
          <div class="order-status-section">
            <div class="status-info">
              <el-icon class="status-icon" :class="getStatusIconClass(order.status)">
                <component :is="getStatusIcon(order.status)" />
              </el-icon>
              <div class="status-text">
                <h2>{{ getStatusText(order.status) }}</h2>
                <p>{{ getStatusDescription(order.status) }}</p>
              </div>
            </div>
            
            <div class="order-basic-info">
              <div class="info-item">
                <span class="label">订单号：</span>
                <span class="value">{{ order.orderNumber }}</span>
                <el-button type="text" @click="copyOrderNumber">复制</el-button>
              </div>
              <div class="info-item">
                <span class="label">下单时间：</span>
                <span class="value">{{ formatDate(order.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- 订单进度 -->
          <div class="order-progress-section">
            <h3>订单进度</h3>
            <el-steps :active="getProgressStep(order.status)" align-center>
              <el-step title="提交订单" :description="formatDate(order.createdAt)" />
              <el-step 
                title="付款成功" 
                :description="order.paidAt ? formatDate(order.paidAt) : ''"
              />
              <el-step 
                title="商家发货" 
                :description="order.shippedAt ? formatDate(order.shippedAt) : ''"
              />
              <el-step 
                title="确认收货" 
                :description="order.deliveredAt ? formatDate(order.deliveredAt) : ''"
              />
              <el-step 
                title="交易完成" 
                :description="order.completedAt ? formatDate(order.completedAt) : ''"
              />
            </el-steps>
          </div>

          <!-- 收货信息 -->
          <div class="shipping-info-section">
            <h3>收货信息</h3>
            <div class="shipping-card">
              <div class="address-info">
                <div class="recipient">
                  <span class="name">{{ order.shippingAddress.recipientName }}</span>
                  <span class="phone">{{ order.shippingAddress.phone }}</span>
                </div>
                <div class="address">
                  {{ order.shippingAddress.province }} 
                  {{ order.shippingAddress.city }} 
                  {{ order.shippingAddress.district }} 
                  {{ order.shippingAddress.detailAddress }}
                </div>
              </div>
              
              <div v-if="order.trackingNumber" class="tracking-info">
                <div class="tracking-item">
                  <span class="label">物流公司：</span>
                  <span class="value">{{ order.shippingCompany }}</span>
                </div>
                <div class="tracking-item">
                  <span class="label">运单号：</span>
                  <span class="value">{{ order.trackingNumber }}</span>
                  <el-button type="text" @click="trackOrder">查看物流</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 商品信息 -->
          <div class="products-section">
            <h3>商品信息</h3>
            <div class="products-list">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="product-item"
              >
                <div class="product-image" @click="goToProduct(item.productId)">
                  <img :src="item.product.image" :alt="item.product.name" />
                </div>
                
                <div class="product-info" @click="goToProduct(item.productId)">
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
                
                <div class="product-actions">
                  <el-button
                    v-if="order.status === 'delivered' || order.status === 'completed'"
                    type="primary"
                    size="small"
                    @click="goToReview(item)"
                  >
                    {{ item.isReviewed ? '查看评价' : '评价商品' }}
                  </el-button>
                  
                  <el-button
                    size="small"
                    @click="buyAgain(item)"
                  >
                    再次购买
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 费用明细 -->
          <div class="cost-detail-section">
            <h3>费用明细</h3>
            <div class="cost-detail">
              <div class="cost-item">
                <span class="label">商品金额：</span>
                <span class="value">¥{{ order.productAmount }}</span>
              </div>
              <div v-if="order.shippingFee > 0" class="cost-item">
                <span class="label">运费：</span>
                <span class="value">¥{{ order.shippingFee }}</span>
              </div>
              <div v-if="order.discountAmount > 0" class="cost-item">
                <span class="label">优惠金额：</span>
                <span class="value discount">-¥{{ order.discountAmount }}</span>
              </div>
              <div v-if="order.couponAmount > 0" class="cost-item">
                <span class="label">优惠券：</span>
                <span class="value discount">-¥{{ order.couponAmount }}</span>
              </div>
              <div class="cost-item total">
                <span class="label">实付款：</span>
                <span class="value">¥{{ order.totalAmount }}</span>
              </div>
            </div>
          </div>

          <!-- 支付信息 -->
          <div v-if="order.paymentInfo" class="payment-info-section">
            <h3>支付信息</h3>
            <div class="payment-detail">
              <div class="payment-item">
                <span class="label">支付方式：</span>
                <span class="value">{{ getPaymentMethodText(order.paymentInfo.method) }}</span>
              </div>
              <div v-if="order.paymentInfo.transactionId" class="payment-item">
                <span class="label">交易号：</span>
                <span class="value">{{ order.paymentInfo.transactionId }}</span>
              </div>
              <div v-if="order.paidAt" class="payment-item">
                <span class="label">支付时间：</span>
                <span class="value">{{ formatDate(order.paidAt) }}</span>
              </div>
            </div>
          </div>

          <!-- 订单操作 -->
          <div class="order-actions-section">
            <div class="actions-container">
              <!-- 根据订单状态显示不同操作 -->
              <template v-if="order.status === 'pending'">
                <el-button @click="cancelOrder">取消订单</el-button>
                <el-button type="primary" @click="payOrder">立即付款</el-button>
              </template>
              
              <template v-else-if="order.status === 'paid'">
                <el-button @click="remindShipping">提醒发货</el-button>
              </template>
              
              <template v-else-if="order.status === 'shipped'">
                <el-button @click="trackOrder">查看物流</el-button>
                <el-button type="primary" @click="confirmReceive">确认收货</el-button>
              </template>
              
              <template v-else-if="order.status === 'delivered'">
                <el-button @click="applyAfterSale">申请售后</el-button>
                <el-button type="primary" @click="goToReviewAll">评价商品</el-button>
              </template>
              
              <template v-else-if="order.status === 'completed'">
                <el-button @click="applyAfterSale">申请售后</el-button>
                <el-button @click="buyAgainAll">再次购买</el-button>
              </template>
            </div>
          </div>
        </div>

        <!-- 订单不存在 -->
        <div v-else-if="!loading" class="order-not-found">
          <el-empty description="订单不存在或已被删除">
            <el-button type="primary" @click="$router.push('/order')">
              返回订单列表
            </el-button>
          </el-empty>
        </div>
      </el-loading>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Clock, 
  Money, 
  Van, 
  Check, 
  Close,
  Warning
} from '@element-plus/icons-vue'
import { orderApi } from '@/api/order'
import { cartApi } from '@/api/cart'
import { useCartStore } from '@/store/modules/cart'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

// 响应式数据
const loading = ref(false)
const order = ref(null)

// 订单状态配置
const statusConfig = {
  pending: {
    text: '待付款',
    description: '请在24小时内完成支付，超时订单将自动取消',
    icon: Clock,
    iconClass: 'warning'
  },
  paid: {
    text: '待发货',
    description: '商家正在准备您的商品，请耐心等待',
    icon: Money,
    iconClass: 'success'
  },
  shipped: {
    text: '待收货',
    description: '商品正在配送中，请注意查收',
    icon: Van,
    iconClass: 'primary'
  },
  delivered: {
    text: '待评价',
    description: '商品已送达，快来评价一下吧',
    icon: Check,
    iconClass: 'success'
  },
  completed: {
    text: '已完成',
    description: '交易已完成，感谢您的购买',
    icon: Check,
    iconClass: 'success'
  },
  cancelled: {
    text: '已取消',
    description: '订单已取消',
    icon: Close,
    iconClass: 'danger'
  }
}

// 支付方式映射
const paymentMethods = {
  alipay: '支付宝',
  wechat: '微信支付',
  unionpay: '银联支付',
  balance: '余额支付'
}

// 获取状态相关信息
const getStatusText = (status) => statusConfig[status]?.text || '未知状态'
const getStatusDescription = (status) => statusConfig[status]?.description || ''
const getStatusIcon = (status) => statusConfig[status]?.icon || Warning
const getStatusIconClass = (status) => statusConfig[status]?.iconClass || 'info'

// 获取进度步骤
const getProgressStep = (status) => {
  const stepMap = {
    pending: 0,
    paid: 1,
    shipped: 2,
    delivered: 3,
    completed: 4,
    cancelled: 0
  }
  return stepMap[status] || 0
}

// 获取支付方式文本
const getPaymentMethodText = (method) => {
  return paymentMethods[method] || method
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 加载订单详情
const loadOrderDetail = async () => {
  loading.value = true
  try {
    const orderId = route.params.id
    const response = await orderApi.getOrderDetail(orderId)
    order.value = response.data
  } catch (error) {
    console.error('加载订单详情失败:', error)
    ElMessage.error('加载订单详情失败')
  } finally {
    loading.value = false
  }
}

// 复制订单号
const copyOrderNumber = async () => {
  try {
    await navigator.clipboard.writeText(order.value.orderNumber)
    ElMessage.success('订单号已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败')
  }
}

// 跳转到商品详情
const goToProduct = (productId) => {
  router.push(`/product/${productId}`)
}

// 取消订单
const cancelOrder = async () => {
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
    
    await orderApi.cancelOrder(order.value.id)
    ElMessage.success('订单已取消')
    loadOrderDetail()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error)
      ElMessage.error('取消订单失败')
    }
  }
}

// 支付订单（简化：直接成功并刷新订单状态）
const payOrder = async () => {
  try {
    await orderApi.payOrder(order.value.id, { method: 'alipay' })
    ElMessage.success('付款成功')
    // 同步购物车徽标（创建订单时已清空对应条目，确保头部一致）
    try { await cartStore.fetchCartItems() } catch {}
    // 刷新订单详情
    await loadOrderDetail()
  } catch (error) {
    console.error('付款失败:', error)
    ElMessage.error('付款失败')
  }
}

// 提醒发货
const remindShipping = async () => {
  try {
    await orderApi.remindShipping(order.value.id)
    ElMessage.success('提醒发货成功')
  } catch (error) {
    console.error('提醒发货失败:', error)
    ElMessage.error('提醒发货失败')
  }
}

// 查看物流
const trackOrder = () => {
  router.push(`/order/track/${order.value.id}`)
}

// 确认收货
const confirmReceive = async () => {
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
    
    await orderApi.confirmReceive(order.value.id)
    ElMessage.success('确认收货成功')
    loadOrderDetail()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('确认收货失败:', error)
      ElMessage.error('确认收货失败')
    }
  }
}

// 评价单个商品
const goToReview = (item) => {
  if (item.isReviewed) {
    router.push(`/review/${item.reviewId}`)
  } else {
    router.push(`/order/review/${order.value.id}?productId=${item.productId}`)
  }
}

// 评价所有商品
const goToReviewAll = () => {
  router.push(`/order/review/${order.value.id}`)
}

// 申请售后
const applyAfterSale = () => {
  router.push(`/order/aftersale/${order.value.id}`)
}

// 单个商品再次购买
const buyAgain = async (item) => {
  // 跳转到订单确认页，复用当前商品信息构造会话数据
  const checkoutData = {
    items: [
      {
        cartId: null,
        productId: item.productId,
        quantity: item.quantity,
        specifications: item.specifications,
        price: item.price,
        product: item.product
      }
    ]
  }
  sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData))
  router.push('/order/checkout')
}

// 所有商品再次购买
const buyAgainAll = async () => {
  const checkoutData = {
    items: order.value.items.map(item => ({
      cartId: null,
      productId: item.productId,
      quantity: item.quantity,
      specifications: item.specifications,
      price: item.price,
      product: item.product
    }))
  }
  sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData))
  router.push('/order/checkout')
}

// 页面初始化
onMounted(() => {
  loadOrderDetail()
})
</script>

<style scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: var(--bg-secondary);
  padding: var(--spacing-lg) 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.order-detail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.order-status-section,
.order-progress-section,
.shipping-info-section,
.products-section,
.cost-detail-section,
.payment-info-section {
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.order-status-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.status-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.status-icon {
  font-size: 48px;
}

.status-icon.warning {
  color: var(--warning-color);
}

.status-icon.success {
  color: var(--success-color);
}

.status-icon.primary {
  color: var(--primary-color);
}

.status-icon.danger {
  color: var(--danger-color);
}

.status-text h2 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
}

.status-text p {
  margin: 0;
  color: var(--text-secondary);
}

.order-basic-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.info-item .label {
  color: var(--text-secondary);
  min-width: 80px;
}

.info-item .value {
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.order-progress-section h3,
.shipping-info-section h3,
.products-section h3,
.cost-detail-section h3,
.payment-info-section h3 {
  margin: 0 0 var(--spacing-lg) 0;
  color: var(--text-primary);
}

.shipping-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}

.recipient {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.recipient .name {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.recipient .phone {
  color: var(--text-secondary);
}

.address {
  color: var(--text-primary);
  line-height: 1.5;
  margin-bottom: var(--spacing-lg);
}

.tracking-info {
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-lg);
}

.tracking-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.tracking-item:last-child {
  margin-bottom: 0;
}

.tracking-item .label {
  color: var(--text-secondary);
  min-width: 80px;
}

.tracking-item .value {
  color: var(--text-primary);
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.product-item {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.product-image {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  cursor: pointer;
}

.product-name {
  font-size: var(--font-size-lg);
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

.product-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.cost-detail,
.payment-detail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.cost-item,
.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cost-item .label,
.payment-item .label {
  color: var(--text-secondary);
}

.cost-item .value,
.payment-item .value {
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.cost-item.total {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.cost-item.total .value {
  color: var(--danger-color);
  font-size: var(--font-size-xl);
}

.discount {
  color: var(--success-color) !important;
}

.order-actions-section {
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.actions-container {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

.order-not-found {
  text-align: center;
  padding: var(--spacing-xxl) 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .order-status-section {
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .status-info {
    flex-direction: column;
    text-align: center;
  }

  .product-item {
    flex-direction: column;
    text-align: center;
  }

  .product-actions {
    flex-direction: row;
    justify-content: center;
  }

  .actions-container {
    flex-direction: column;
  }

  .actions-container .el-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }

  .recipient {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .tracking-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>