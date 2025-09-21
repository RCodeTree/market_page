import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'

/**
 * 认证工具函数
 */

// 检查用户是否已登录
export const isAuthenticated = () => {
  const userStore = useUserStore()
  return userStore.isLoggedIn
}

// 检查token是否有效
export const isTokenValid = (token) => {
  if (!token) return false
  
  try {
    // 解析JWT token
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    
    // 检查token是否过期
    return payload.exp > currentTime
  } catch (error) {
    console.error('Token解析失败:', error)
    return false
  }
}

// 获取token过期时间
export const getTokenExpiration = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return new Date(payload.exp * 1000)
  } catch (error) {
    console.error('获取token过期时间失败:', error)
    return null
  }
}

// 清除认证信息
export const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
}

// 设置认证信息
export const setAuth = (token, userInfo) => {
  localStorage.setItem('token', token)
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
}

// 获取存储的用户信息
export const getStoredUserInfo = () => {
  try {
    const userInfo = localStorage.getItem('userInfo')
    return userInfo ? JSON.parse(userInfo) : null
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

// 获取存储的token
export const getStoredToken = () => {
  return localStorage.getItem('token')
}

// 需要登录的页面路径
export const authRequiredRoutes = [
  '/user',
  '/user/profile',
  '/user/orders',
  '/user/favorites',
  '/cart',
  '/checkout',
  '/order'
]

// 检查路径是否需要登录
export const requiresAuth = (path) => {
  return authRequiredRoutes.some(route => path.startsWith(route))
}

// 路由守卫函数
export const authGuard = (to, from, next) => {
  const userStore = useUserStore()
  
  // 检查是否需要登录
  if (requiresAuth(to.path)) {
    if (!isAuthenticated()) {
      // 保存目标路径，登录后跳转
      userStore.redirectPath = to.fullPath
      userStore.showLoginModal = true
      
      ElMessage.warning('请先登录')
      next(false) // 阻止导航
      return
    }
    
    // 检查token是否有效
    if (!isTokenValid(userStore.token)) {
      ElMessage.error('登录已过期，请重新登录')
      userStore.logout()
      userStore.redirectPath = to.fullPath
      userStore.showLoginModal = true
      next(false)
      return
    }
  }
  
  next()
}

// 初始化认证状态
export const initAuth = () => {
  const userStore = useUserStore()
  const token = getStoredToken()
  const userInfo = getStoredUserInfo()
  
  if (token && userInfo) {
    if (isTokenValid(token)) {
      userStore.token = token
      userStore.userInfo = userInfo
    } else {
      // token过期，清除认证信息
      clearAuth()
      ElMessage.warning('登录已过期，请重新登录')
    }
  }
}

// 自动刷新token（可选功能）
export const autoRefreshToken = () => {
  const userStore = useUserStore()
  
  if (!userStore.token) return
  
  const expiration = getTokenExpiration(userStore.token)
  if (!expiration) return
  
  const now = new Date()
  const timeUntilExpiration = expiration.getTime() - now.getTime()
  
  // 如果token在30分钟内过期，尝试刷新
  if (timeUntilExpiration < 30 * 60 * 1000 && timeUntilExpiration > 0) {
    // 这里可以调用刷新token的API
    console.log('Token即将过期，建议刷新')
  }
}

// 定期检查token状态
export const startTokenCheck = () => {
  // 每5分钟检查一次token状态
  setInterval(() => {
    autoRefreshToken()
  }, 5 * 60 * 1000)
}