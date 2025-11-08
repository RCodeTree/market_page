<template>
  <div class="cart-page">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1>购物车</h1>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>购物车</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-loading v-loading="loading" element-loading-text="加载中...">
        <!-- 购物车内容 -->
        <div v-if="cartItems.length > 0" class="cart-content">
          <!-- 购物车头部操作 -->
          <div class="cart-header">
            <el-checkbox v-model="selectAll" :indeterminate="isIndeterminate" @change="handleSelectAll">
              全选
            </el-checkbox>

            <div class="header-actions">
              <el-button type="danger" :disabled="selectedItems.length === 0" @click="handleBatchDelete">
                删除选中商品
              </el-button>
              <el-button @click="handleClearCart">
                清空购物车
              </el-button>
            </div>
          </div>

          <!-- 购物车列表 -->
          <div class="cart-list">
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <el-checkbox v-model="item.selected" @change="handleItemSelect" />

              <div class="item-image">
                <img v-img-fallback :src="item.product.image" :alt="item.product.name" />
              </div>

              <div class="item-info">
                <h3 class="item-name" @click="goToProduct(item.product.id)">
                  {{ item.product.name }}
                </h3>
                <p class="item-specs">
                  <span v-for="(value, key) in item.specifications" :key="key">
                    {{ key }}: {{ value }}
                  </span>
                </p>
                <div class="item-price">
                  <span class="current-price">¥{{ item.product.price }}</span>
                  <span v-if="item.product.originalPrice" class="original-price">
                    ¥{{ item.product.originalPrice }}
                  </span>
                </div>
              </div>

              <div class="item-quantity">
                <el-input-number v-model="item.quantity" :min="1" :max="item.product.stock"
                  @change="handleQuantityChange(item)" />
                <div class="stock-info">
                  库存{{ item.product.stock }}件
                </div>
              </div>

              <div class="item-total">
                ¥{{ (item.product.price * item.quantity).toFixed(2) }}
              </div>

              <div class="item-actions">
                <el-button type="text" :icon="Star" @click="addToFavorites(item)">
                  移入收藏
                </el-button>
                <el-button type="text" :icon="Delete" @click="removeItem(item)">
                  删除
                </el-button>
              </div>
            </div>
          </div>

          <!-- 购物车底部结算 -->
          <div class="cart-footer">
            <div class="footer-left">
              <el-checkbox v-model="selectAll" :indeterminate="isIndeterminate" @change="handleSelectAll">
                全选
              </el-checkbox>
              <span class="selected-count">
                已选择 {{ selectedItems.length }} 件商品
              </span>
            </div>

            <div class="footer-right">
              <div class="total-info">
                <div class="total-price">
                  合计: <span class="price">¥{{ totalPrice }}</span>
                </div>
                <div class="save-amount" v-if="saveAmount > 0">
                  已优惠: <span class="save">¥{{ saveAmount }}</span>
                </div>
              </div>

              <el-button type="primary" size="large" :disabled="selectedItems.length === 0" @click="handleCheckout">
                结算 ({{ selectedItems.length }})
              </el-button>
            </div>
          </div>
        </div>

        <!-- 空购物车 -->
        <div v-else class="empty-cart">
          <el-empty description="购物车是空的">
            <el-button type="primary" @click="$router.push('/product')">
              去购物
            </el-button>
          </el-empty>
        </div>
      </el-loading>

      
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Star, Delete } from '@element-plus/icons-vue'
import { cartApi } from '@/api/cart'
import { userApi } from '@/api/user'
import { useCartStore } from '@/store/modules/cart'

const router = useRouter()
const cartStore = useCartStore()

// 响应式数据
const loading = ref(false)
const cartItems = ref([])
// 购物车页不展示推荐商品，保持页面纯净

// 计算属性
const selectedItems = computed(() => {
  return cartItems.value.filter(item => item.selected)
})

const selectAll = computed({
  get() {
    return cartItems.value.length > 0 && cartItems.value.every(item => item.selected)
  },
  set(value) {
    cartItems.value.forEach(item => {
      item.selected = value
    })
  }
})

const isIndeterminate = computed(() => {
  const selectedCount = selectedItems.value.length
  return selectedCount > 0 && selectedCount < cartItems.value.length
})

const totalPrice = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    return total + (item.product.price * item.quantity)
  }, 0).toFixed(2)
})

const saveAmount = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    if (item.product.originalPrice) {
      return total + ((item.product.originalPrice - item.product.price) * item.quantity)
    }
    return total
  }, 0).toFixed(2)
})

// 加载购物车数据
const loadCartData = async () => {
  loading.value = true
  try {
    const response = await cartApi.getCartItems()
    const list = Array.isArray(response.data) ? response.data : []
    // 转换为页面期望的结构：包含 product 嵌套对象
    cartItems.value = list.map(item => ({
      id: item.id,
      selected: false,
      quantity: item.quantity,
      specifications: {},
      product: {
        id: item.productId,
        name: item.productName,
        image: item.productImage,
        price: item.price ?? item.productPrice,
        originalPrice: item.productOriginalPrice || null,
        stock: item.productStock ?? 0
      }
    }))

    // 同步到全局购物车（用于头部徽标数量显示）
    // 将本地数据拍平成 store 结构
    cartStore.cartItems = cartItems.value.map(ci => ({
      id: ci.id,
      productId: ci.product.id,
      price: ci.product.price,
      quantity: ci.quantity,
      selected: false,
      productName: ci.product.name,
      productImage: ci.product.image
    }))
  } catch (error) {
    console.error('加载购物车失败:', error)
    ElMessage.error('加载购物车失败')
  } finally {
    loading.value = false
  }
}


// 全选处理
const handleSelectAll = (value) => {
  cartItems.value.forEach(item => {
    item.selected = value
  })
}

// 单项选择处理
const handleItemSelect = () => {
  // 触发计算属性更新
}

// 数量变化处理
const handleQuantityChange = async (item) => {
  try {
    await cartApi.updateQuantity(item.id, item.quantity)
    // 同步头部数量
    await cartStore.fetchCartItems()
  } catch (error) {
    console.error('更新数量失败:', error)
    ElMessage.error('更新数量失败')
    // 恢复原数量
    loadCartData()
  }
}

// 移除单个商品
const removeItem = async (item) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个商品吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await cartApi.removeFromCart(item.id)
    cartItems.value = cartItems.value.filter(cartItem => cartItem.id !== item.id)
    // 同步头部数量
    await cartStore.fetchCartItems()
    ElMessage.success('商品已删除')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除商品失败:', error)
      ElMessage.error('删除商品失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedItems.value.length} 个商品吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const cartIds = selectedItems.value.map(item => item.id)
    await cartApi.batchRemove(cartIds)

    cartItems.value = cartItems.value.filter(item => !item.selected)
    // 同步头部数量
    await cartStore.fetchCartItems()
    ElMessage.success('选中商品已删除')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 清空购物车
const handleClearCart = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空购物车吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await cartApi.clearCart()
    cartItems.value = []
    // 同步头部数量
    await cartStore.fetchCartItems()
    ElMessage.success('购物车已清空')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('清空购物车失败:', error)
      ElMessage.error('清空购物车失败')
    }
  }
}

// 移入收藏
const addToFavorites = async (item) => {
  try {
    await userApi.addFavorite(item.product.id)
    ElMessage.success('已添加到收藏')
  } catch (error) {
    console.error('添加收藏失败:', error)
    ElMessage.error('添加收藏失败')
  }
}

// 结算
const handleCheckout = () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请选择要结算的商品')
    return
  }

  // 跳转到订单确认页面
  const orderData = {
    items: selectedItems.value.map(item => ({
      cartId: item.id,
      productId: item.product.id,
      quantity: item.quantity,
      specifications: item.specifications,
      price: item.product.price
    }))
  }

  // 将订单数据存储到 sessionStorage
  sessionStorage.setItem('checkoutData', JSON.stringify(orderData))
  router.push('/order/checkout')
}

// 跳转到商品详情
const goToProduct = (productId) => {
  router.push(`/product/${productId}`)
}


// 页面初始化
onMounted(() => {
  loadCartData()
})
</script>

<style scoped>
.cart-page {
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

.cart-content {
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.header-actions {
  display: flex;
  gap: var(--spacing-md);
}

.cart-list {
  max-height: 600px;
  overflow-y: auto;
}

.cart-item {
  display: grid;
  grid-template-columns: auto 100px 1fr auto auto auto;
  gap: var(--spacing-lg);
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  transition: background-color var(--transition-fast);
}

.cart-item:hover {
  background-color: var(--bg-secondary);
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.item-name:hover {
  color: var(--primary-color);
}

.item-specs {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-sm) 0;
}

.item-specs span {
  margin-right: var(--spacing-md);
}

.item-price {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
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

.item-quantity {
  text-align: center;
}

.stock-info {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.item-total {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--danger-color);
  text-align: center;
  min-width: 100px;
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

.footer-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.selected-count {
  color: var(--text-secondary);
}

.footer-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.total-info {
  text-align: right;
}

.total-price {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xs);
}

.total-price .price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--danger-color);
}

.save-amount .save {
  color: var(--success-color);
}

.empty-cart {
  text-align: center;
  padding: var(--spacing-xxl) 0;
}

/* PC端大屏幕优化 */
@media (min-width: 1400px) {
  .container {
    max-width: 1400px;
  }

  .cart-item {
    padding: var(--spacing-lg);
    gap: var(--spacing-lg);
  }
}

/* 平板端优化 */
@media (max-width: 992px) {
  .cart-item {
    grid-template-columns: auto 100px 1fr auto auto auto;
    gap: var(--spacing-md);
  }

}

/* 响应式设计 */
@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: auto 80px 1fr;
    gap: var(--spacing-md);
  }

  .item-quantity,
  .item-total,
  .item-actions {
    grid-column: 1 / -1;
    justify-self: center;
    margin-top: var(--spacing-md);
  }

  .cart-footer {
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .footer-left,
  .footer-right {
    width: 100%;
    justify-content: center;
  }

}

@media (max-width: 480px) {
  .cart-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .header-actions {
    width: 100%;
    justify-content: center;
  }

}
</style>