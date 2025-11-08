import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartApi } from '@/api/cart'

export const useCartStore = defineStore('cart', () => {
  // 状态
  const cartItems = ref([])
  const loading = ref(false)

  // 计算属性
  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  const selectedItems = computed(() => {
    return cartItems.value.filter(item => item.selected)
  })

  const selectedTotal = computed(() => {
    return selectedItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  // 方法
  const fetchCartItems = async () => {
    try {
      loading.value = true
      const response = await cartApi.getCartItems()
      const list = Array.isArray(response.data) ? response.data : []
      cartItems.value = list.map(item => ({
        id: item.id,
        productId: item.productId,
        price: item.price ?? item.productPrice,
        quantity: item.quantity,
        selected: !!item.selected,
        productName: item.productName,
        productImage: item.productImage
      }))
    } catch (error) {
      console.error('获取购物车失败:', error)
      cartItems.value = []
    } finally {
      loading.value = false
    }
  }

  const addToCart = async (product, quantity = 1) => {
    try {
      const response = await cartApi.addToCart({
        productId: product.id,
        quantity
      })

      // 更新本地购物车
      const existingItem = cartItems.value.find(item => item.productId === product.id)
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cartItems.value.push({
          id: response.data.id,
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          price: product.price,
          quantity,
          selected: true
        })
      }

      return { success: true, message: '已添加到购物车' }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '添加失败'
      }
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    try {
      await cartApi.updateQuantity(itemId, quantity)

      const item = cartItems.value.find(item => item.id === itemId)
      if (item) {
        item.quantity = quantity
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '更新失败'
      }
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      await cartApi.removeFromCart(itemId)

      const index = cartItems.value.findIndex(item => item.id === itemId)
      if (index > -1) {
        cartItems.value.splice(index, 1)
      }

      return { success: true, message: '已从购物车移除' }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '移除失败'
      }
    }
  }

  const toggleSelect = (itemId) => {
    const item = cartItems.value.find(item => item.id === itemId)
    if (item) {
      item.selected = !item.selected
    }
  }

  const selectAll = (selected) => {
    cartItems.value.forEach(item => {
      item.selected = selected
    })
  }

  const clearCart = async () => {
    try {
      await cartApi.clearCart()
      cartItems.value = []
      return { success: true, message: '购物车已清空' }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '清空失败'
      }
    }
  }

  return {
    // 状态
    cartItems,
    loading,

    // 计算属性
    cartCount,
    cartTotal,
    selectedItems,
    selectedTotal,

    // 方法
    fetchCartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleSelect,
    selectAll,
    clearCart
  }
})