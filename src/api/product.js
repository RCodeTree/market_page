import request from '@/utils/request'

export const productApi = {
  // 获取商品列表
  getProductList(params = {}) {
    return request.get('/products', { params })
  },
  
  // 获取商品详情
  getProductDetail(productId) {
    return request.get(`/products/${productId}`)
  },
  
  // 搜索商品
  searchProducts(params = {}) {
    return request.get('/products/search', { params })
  },
  
  // 获取商品分类
  getCategories() {
    return request.get('/categories')
  },
  
  // 获取分类下的商品
  getProductsByCategory(categoryId, params = {}) {
    return request.get(`/categories/${categoryId}/products`, { params })
  },
  
  // 获取热门商品
  getHotProducts(params = {}) {
    return request.get('/products/hot', { params })
  },
  
  // 获取推荐商品
  getRecommendedProducts(params = {}) {
    return request.get('/products/recommended', { params })
  },
  
  // 获取新品
  getNewProducts(params = {}) {
    return request.get('/products/new', { params })
  },
  
  // 获取商品评价
  getProductReviews(productId, params = {}) {
    return request.get(`/products/${productId}/reviews`, { params })
  },
  
  // 添加商品评价
  addProductReview(productId, reviewData) {
    return request.post(`/products/${productId}/reviews`, reviewData)
  },
  
  // 获取轮播图
  getBanners() {
    return request.get('/banners')
  },
  
  // 获取搜索建议
  getSearchSuggestions(keyword) {
    return request.get('/products/search/suggestions', { 
      params: { keyword } 
    })
  }
}