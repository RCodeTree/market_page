import request from '@/utils/request'

export const cartApi = {
  // 获取购物车列表
  getCartItems() {
    return request.get('/cart')
  },
  
  // 添加商品到购物车
  addToCart(data) {
    return request.post('/cart', data)
  },
  
  // 更新购物车商品数量
  updateQuantity(itemId, quantity) {
    return request.put(`/cart/${itemId}`, { quantity })
  },
  
  // 从购物车移除商品
  removeFromCart(itemId) {
    return request.delete(`/cart/${itemId}`)
  },
  
  // 清空购物车
  clearCart() {
    return request.delete('/cart')
  },
  
  // 批量删除购物车商品
  batchRemove(itemIds) {
    return request.delete('/cart/batch', { data: { itemIds } })
  }
}