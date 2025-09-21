import request from '@/utils/request'

export const orderApi = {
  // 创建订单
  createOrder(orderData) {
    return request.post('/orders', orderData)
  },
  
  // 获取订单列表
  getOrderList(params = {}) {
    return request.get('/orders', { params })
  },
  
  // 获取用户订单列表
  getUserOrders(params = {}) {
    return request.get('/user/orders', { params })
  },
  
  // 获取订单详情
  getOrderDetail(orderId) {
    return request.get(`/orders/${orderId}`)
  },
  
  // 取消订单
  cancelOrder(orderId, reason) {
    return request.put(`/orders/${orderId}/cancel`, { reason })
  },
  
  // 确认收货
  confirmReceived(orderId) {
    return request.put(`/orders/${orderId}/confirm`)
  },
  
  // 删除订单
  deleteOrder(orderId) {
    return request.delete(`/orders/${orderId}`)
  },
  
  // 申请退款
  requestRefund(orderId, refundData) {
    return request.post(`/orders/${orderId}/refund`, refundData)
  },
  
  // 获取订单状态统计
  getOrderStats() {
    return request.get('/orders/stats')
  },
  
  // 支付订单
  payOrder(orderId, paymentData) {
    return request.post(`/orders/${orderId}/pay`, paymentData)
  },
  
  // 获取支付状态
  getPaymentStatus(orderId) {
    return request.get(`/orders/${orderId}/payment-status`)
  },
  
  // 评价订单
  reviewOrder(orderId, reviewData) {
    return request.post(`/orders/${orderId}/review`, reviewData)
  }
}