import request from '@/utils/request'

export const userApi = {
  // 用户登录
  login(credentials) {
    return request.post('/auth/login', credentials)
  },

  // 用户注册
  register(userData) {
    return request.post('/auth/register', userData)
  },

  // 获取用户信息
  getUserInfo() {
    return request.get('/user/profile')
  },

  // 更新用户信息
  updateProfile(userData) {
    return request.put('/user/profile', userData)
  },

  // 修改密码
  changePassword(passwordData) {
    return request.put('/user/password', passwordData)
  },

  // 上传头像
  uploadAvatar(payload) {
    return request.post('/user/avatar', payload)
  },

  // 获取用户订单列表
  getUserOrders(params = {}) {
    return request.get('/user/orders', { params })
  },

  // 获取用户收藏列表
  getUserFavorites(params = {}) {
    return request.get('/user/favorites', { params })
  },

  // 添加收藏
  addFavorite(productId) {
    return request.post('/user/favorites', { productId })
  },

  // 取消收藏
  removeFavorite(favoriteId) {
    return request.delete(`/user/favorites/${favoriteId}`)
  },

  // 批量取消收藏
  batchRemoveFavorites(favoriteIds) {
    return request.delete('/user/favorites/batch', { data: { favoriteIds } })
  },

  // 获取用户统计
  getUserStats() {
    return request.get('/user/stats')
  },

  // 收货地址
  getAddresses() {
    return request.get('/user/addresses')
  },
  addAddress(data) {
    return request.post('/user/addresses', data)
  },
  updateAddress(id, data) {
    return request.put(`/user/addresses/${id}`, data)
  },
  deleteAddress(id) {
    return request.delete(`/user/addresses/${id}`)
  },

  // 获取搜索历史
  getSearchHistory() {
    return request.get('/user/search-history')
  },

  // 添加搜索记录
  addSearchHistory(keyword) {
    return request.post('/user/search-history', { keyword })
  },

  // 清空搜索历史
  clearSearchHistory() {
    return request.delete('/user/search-history')
  }
}
