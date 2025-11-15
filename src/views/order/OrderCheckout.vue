<template>
  <div class="order-checkout-page">
    <div class="container">
      <!-- 面包屑导航 -->
      <div class="page-header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/cart' }">购物车</el-breadcrumb-item>
          <el-breadcrumb-item>订单确认</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-loading v-loading="loading" element-loading-text="提交中...">
        <div v-if="items.length > 0" class="checkout-content">
          <!-- 收货信息 -->
          <div class="section">
            <h2>收货信息</h2>
            <div class="receiver-form">
              <el-form label-width="100px">
                <el-form-item label="地址来源">
                  <el-radio-group v-model="addressMode">
                    <el-radio label="existing">选择已有地址</el-radio>
                    <el-radio label="new">自定义新地址</el-radio>
                  </el-radio-group>
                </el-form-item>

                <template v-if="addressMode === 'existing'">
                  <el-form-item label="选择地址">
                    <el-select v-model="selectedAddressId" placeholder="请选择收货地址" style="width: 100%"
                      @change="applySelectedAddress">
                      <el-option v-for="addr in addressList" :key="addr.id" :label="formatAddressOption(addr)"
                        :value="addr.id" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="买家留言">
                    <el-input v-model="buyerMessage" type="textarea" rows="2" maxlength="200" show-word-limit />
                  </el-form-item>
                </template>

                <template v-else>
                  <el-form-item label="收货人">
                    <el-input v-model="receiver.recipientName" maxlength="50" />
                  </el-form-item>
                  <el-form-item label="手机">
                    <el-input v-model="receiver.phone" maxlength="20" />
                  </el-form-item>
                  <el-form-item label="省市区">
                    <div class="address-row">
                      <el-input v-model="receiver.province" placeholder="省" />
                      <el-input v-model="receiver.city" placeholder="市" />
                      <el-input v-model="receiver.district" placeholder="区/县" />
                    </div>
                  </el-form-item>
                  <el-form-item label="详细地址">
                    <el-input v-model="receiver.detailAddress" type="textarea" rows="2" />
                  </el-form-item>
                  <el-form-item label="买家留言">
                    <el-input v-model="buyerMessage" type="textarea" rows="2" maxlength="200" show-word-limit />
                  </el-form-item>
                </template>
              </el-form>
            </div>
          </div>

          <!-- 商品列表 -->
          <div class="section">
            <h2>商品信息</h2>
            <div class="items-list">
              <div v-for="it in items" :key="it.cartId" class="checkout-item">
                <div class="item-image">
                  <img v-img-fallback :src="it.product?.image" :alt="it.product?.name" />
                </div>
                <div class="item-info">
                  <h4 class="item-name">{{ it.product?.name }}</h4>
                  <p class="item-specs">
                    <span v-for="(val, key) in it.specifications" :key="key">{{ key }}: {{ val }}</span>
                  </p>
                </div>
                <div class="item-price">¥{{ it.price }}</div>
                <div class="item-quantity">×{{ it.quantity }}</div>
                <div class="item-total">¥{{ (it.price * it.quantity).toFixed(2) }}</div>
              </div>
            </div>
          </div>

          <!-- 费用合计 -->
          <div class="section">
            <h2>费用合计</h2>
            <div class="summary">
              <div class="row">
                <span>商品金额：</span>
                <span>¥{{ productAmount }}</span>
              </div>
              <div class="row" v-if="discountAmount > 0">
                <span>优惠：</span>
                <span class="discount">-¥{{ discountAmount }}</span>
              </div>
              <div class="row" v-if="couponAmount > 0">
                <span>优惠券：</span>
                <span class="discount">-¥{{ couponAmount }}</span>
              </div>
              <div class="row" v-if="pointsAmount > 0">
                <span>积分抵扣：</span>
                <span class="discount">-¥{{ pointsAmount }}</span>
              </div>
              <div class="row" v-if="shippingFee > 0">
                <span>运费：</span>
                <span>¥{{ shippingFee }}</span>
              </div>
              <div class="row total">
                <span>应付金额：</span>
                <span class="value">¥{{ actualAmount }}</span>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="actions">
            <el-button @click="goBack">返回购物车</el-button>
            <el-button type="primary" :loading="loading" @click="submitOrder">提交订单</el-button>
          </div>
        </div>

        <div v-else class="empty-checkout">
          <el-empty description="没有待结算的商品">
            <el-button type="primary" @click="$router.push('/cart')">返回购物车</el-button>
          </el-empty>
        </div>
      </el-loading>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { orderApi } from '@/api/order'
import { productApi } from '@/api/product'
import { userApi } from '@/api/user'
import { useCartStore } from '@/store/modules/cart'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore?.() || { isLoggedIn: true, userName: '用户' }
const loading = ref(false)
const items = ref([])
const addressMode = ref('existing')
const addressList = ref([])
const selectedAddressId = ref(null)
const receiver = ref({
  recipientName: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: ''
})
const buyerMessage = ref('')

const productAmount = computed(() => {
  return items.value.reduce((sum, it) => sum + Number(it.price) * Number(it.quantity), 0).toFixed(2)
})
const productAmountNum = computed(() => Number(productAmount.value))
// 简单优惠规则（演示）：
// 1) 满5000减100；
// 2) 登录用户享受20元优惠券；
// 3) 暂不启用积分抵扣（为0）。
const discountAmount = computed(() => {
  const amt = productAmountNum.value
  return amt >= 5000 ? 100 : 0
})
const couponAmount = computed(() => {
  return userStore?.isLoggedIn ? 20 : 0
})
const pointsAmount = computed(() => 0)
const shippingFee = ref(0)
const actualAmount = computed(() => {
  const total = productAmountNum.value + Number(shippingFee.value) - discountAmount.value - couponAmount.value - pointsAmount.value
  return total.toFixed(2)
})

const goBack = () => router.push('/cart')

const submitOrder = async () => {
  if (items.value.length === 0) {
    ElMessage.warning('没有待结算的商品')
    return
  }
  if (addressMode.value === 'existing') {
    if (!selectedAddressId.value) {
      ElMessage.warning('请选择收货地址')
      return
    }
    const sel = addressList.value.find(a => a.id === selectedAddressId.value)
    if (!sel) {
      ElMessage.warning('请选择有效的收货地址')
      return
    }
    receiver.value = {
      recipientName: sel.receiver_name || '',
      phone: sel.receiver_phone || '',
      province: sel.province || '',
      city: sel.city || '',
      district: sel.district || '',
      detailAddress: sel.detail_address || ''
    }
  } else {
    const required = ['recipientName', 'phone', 'province', 'city', 'district', 'detailAddress']
    for (const f of required) {
      const val = String(receiver.value[f] || '').trim()
      if (!val) {
        ElMessage.warning('请完整填写收货信息')
        return
      }
    }
    const phoneStr = String(receiver.value.phone || '').trim()
    const phonePattern = /^1[3-9]\d{9}$/
    if (!phonePattern.test(phoneStr)) {
      ElMessage.warning('手机号格式不正确')
      return
    }
  }
  loading.value = true
  try {
    if (addressMode.value === 'new') {
      try {
        await userApi.addAddress({
          receiver_name: receiver.value.recipientName,
          receiver_phone: receiver.value.phone,
          province: receiver.value.province,
          city: receiver.value.city,
          district: receiver.value.district,
          detail_address: receiver.value.detailAddress,
          postal_code: '',
          address_tag: 'home',
          is_default: false
        })
      } catch { }
    }
    const payload = {
      items: items.value.map(it => ({
        productId: it.productId,
        skuId: it.skuId || null,
        quantity: it.quantity,
        price: it.price,
        specifications: it.specifications || {}
      })),
      receiver: receiver.value,
      buyerMessage: buyerMessage.value,
      discountAmount: discountAmount.value,
      couponAmount: couponAmount.value,
      pointsAmount: pointsAmount.value,
      shippingAmount: Number(shippingFee.value) || 0,
      cartIds: items.value.map(it => it.cartId).filter(Boolean)
    }
    const res = await orderApi.createOrder(payload)
    const { id } = res.data
    ElMessage.success('订单创建成功')
    // 同步头部购物车数量
    try { await cartStore.fetchCartItems() } catch { }
    // 清理会话数据
    sessionStorage.removeItem('checkoutData')
    router.push(`/order/${id}`)
  } catch (err) {
    console.error('提交订单失败:', err)
    ElMessage.error('提交订单失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 从会话中恢复选中商品
  try {
    const raw = sessionStorage.getItem('checkoutData')
    if (!raw) {
      return
    }
    const data = JSON.parse(raw)
    // 兼容 CartPage 的结构
    const fromCart = Array.isArray(data.items) ? data.items : []
    items.value = fromCart.map(it => ({
      cartId: it.cartId,
      productId: it.productId,
      quantity: it.quantity,
      specifications: it.specifications || {},
      price: Number(it.price) || 0,
      product: it.product || null
    }))
    // 补全缺失的商品展示信息（名称、图片）
    ensureProductInfo()
  } catch (e) {
    console.warn('解析结算数据失败:', e)
  }
  loadAddresses()
})

// 若存在缺失的商品信息，则从后端加载商品详情补齐图片与名称
const ensureProductInfo = async () => {
  try {
    const needFetch = items.value.filter(it => !it.product || !it.product.image || !it.product.name)
    for (const it of needFetch) {
      try {
        const res = await productApi.getProductDetail(it.productId)
        const p = res.data
        it.product = {
          id: p.id,
          name: p.name,
          image: (p.images && p.images[0]) || p.mainImage || ''
        }
      } catch (err) {
        console.warn('加载商品详情失败，用占位信息代替:', err)
        it.product = it.product || { id: it.productId, name: '商品', image: '' }
      }
    }
  } catch (e) {
    console.warn('补全商品信息失败:', e)
  }
}

const loadAddresses = async () => {
  try {
    const res = await userApi.getAddresses()
    addressList.value = res?.data || []
    if (addressList.value.length > 0) {
      addressMode.value = 'existing'
      selectedAddressId.value = addressList.value.find(a => a.is_default)?.id || addressList.value[0].id
      applySelectedAddress()
    } else {
      addressMode.value = 'new'
    }
  } catch {
    addressMode.value = 'new'
  }
}

const applySelectedAddress = () => {
  const sel = addressList.value.find(a => a.id === selectedAddressId.value)
  if (!sel) return
  receiver.value = {
    recipientName: sel.receiver_name || '',
    phone: sel.receiver_phone || '',
    province: sel.province || '',
    city: sel.city || '',
    district: sel.district || '',
    detailAddress: sel.detail_address || ''
  }
}

const formatAddressOption = (addr) => {
  const head = `${addr.receiver_name || ''} ${addr.receiver_phone || ''}`.trim()
  const body = `${addr.province || ''}${addr.city || ''}${addr.district || ''} ${addr.detail_address || ''}`.trim()
  return head ? `${head} | ${body}` : body
}
</script>

<style scoped>
.order-checkout-page {
  min-height: 100vh;
  background-color: var(--bg-secondary);
  padding: var(--spacing-lg) 0;
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.checkout-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.section {
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.receiver-form .address-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--spacing-sm);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.checkout-item {
  display: grid;
  grid-template-columns: 100px 1fr 120px 80px 120px;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-light);
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-name {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-primary);
}

.item-specs span {
  margin-right: var(--spacing-sm);
}

.item-price,
.item-total {
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.summary {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  align-items: flex-end;
}

.summary .row {
  display: flex;
  gap: var(--spacing-md);
}

.summary .row.total .value {
  color: var(--danger-color);
  font-size: var(--font-size-xl);
}

.summary .discount {
  color: var(--success-color);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}
</style>