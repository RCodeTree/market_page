import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'
import { userApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  const showLoginModal = ref(false)
  const redirectPath = ref('/')
  
  // 计算属性
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)
  const userName = computed(() => userInfo.value?.username || '')
  const resolveUrl = (u) => {
    if (!u) return ''
    if (/^https?:\/\//.test(u)) return u
    try {
      const origin = new URL(request.defaults.baseURL).origin
      return origin + u
    } catch (e) {
      return u
    }
  }
  const userAvatar = computed(() => resolveUrl(userInfo.value?.avatar || ''))

  const normalizeUser = (u) => {
    if (!u) return null
    const n = {}
    n.id = u.id ?? u.ID
    n.username = u.username ?? u.USERNAME ?? ''
    n.nickname = u.nickname ?? u.NICKNAME ?? ''
    n.email = u.email ?? u.EMAIL ?? ''
    n.phone = u.phone ?? u.PHONE ?? ''
    // avatar 保持相对路径，显示时由 userAvatar 处理为完整 URL
    n.avatar = u.avatar ?? u.AVATAR ?? ''
    const g = u.gender ?? u.GENDER
    if (typeof g === 'number') {
      n.gender = g === 1 ? 'male' : g === 2 ? 'female' : 'other'
    } else {
      n.gender = g || ''
    }
    const bd = u.birthday ?? u.BIRTHDAY
    if (bd) {
      const d = typeof bd === 'string' ? new Date(bd) : bd instanceof Date ? bd : null
      if (d && !isNaN(d.getTime())) {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        n.birthday = `${y}-${m}-${dd}`
      } else {
        n.birthday = ''
      }
    } else {
      n.birthday = ''
    }
    const ev = u.emailVerified ?? u.email_verified ?? u.EMAIL_VERIFIED
    const pv = u.phoneVerified ?? u.phone_verified ?? u.PHONE_VERIFIED
    n.emailVerified = !!(typeof ev === 'number' ? ev === 1 : ev)
    n.phoneVerified = !!(typeof pv === 'number' ? pv === 1 : pv)
    n.bio = u.bio ?? u.BIO ?? ''
    return n
  }
  
  // 方法
  const login = async (credentials) => {
    try {
      const response = await userApi.login(credentials)
      const { token: newToken, user } = response.data
      const normalized = normalizeUser(user)
      
      token.value = newToken
      userInfo.value = normalized
      localStorage.setItem('token', newToken)
      localStorage.setItem('userInfo', JSON.stringify(normalized))
      
      showLoginModal.value = false
      
      return true
    } catch (error) {
      const message = error.response?.data?.message || '登录失败'
      ElMessage.error(message)
      throw error
    }
  }
  
  const register = async (userData) => {
    try {
      const response = await userApi.register(userData)
      return true
    } catch (error) {
      const message = error.response?.data?.message || '注册失败'
      ElMessage.error(message)
      throw error
    }
  }
  
  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    
    // 跳转到首页
    window.location.href = '/'
  }
  
  const updateUserInfo = async (newUserInfo) => {
    try {
      const response = await userApi.updateProfile(newUserInfo)
      // 成功后再从后端获取最新资料，保证渲染与数据库一致
      const fresh = await userApi.getUserInfo()
      const merged = fresh?.data || response.data || {}
      const normalized = normalizeUser(merged)
      userInfo.value = { ...userInfo.value, ...normalized }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      return true
    } catch (error) {
      return false
    }
  }
  
  const initUserFromStorage = () => {
    const storedUserInfo = localStorage.getItem('userInfo')
    if (storedUserInfo && token.value) {
      try {
        const parsed = JSON.parse(storedUserInfo)
        userInfo.value = normalizeUser(parsed) || parsed
      } catch (error) {
        console.error('解析用户信息失败:', error)
        logout()
      }
    }
  }
  
  return {
    // 状态
    userInfo,
    token,
    showLoginModal,
    redirectPath,
    
    // 计算属性
    isLoggedIn,
    userName,
    userAvatar,
    
    // 方法
    login,
    register,
    logout,
    updateUserInfo,
    initUserFromStorage
  }
})