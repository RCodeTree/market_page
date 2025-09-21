import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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
  const userAvatar = computed(() => userInfo.value?.avatar || '')
  
  // 方法
  const login = async (credentials) => {
    try {
      const response = await userApi.login(credentials)
      const { token: newToken, user } = response.data
      
      token.value = newToken
      userInfo.value = user
      localStorage.setItem('token', newToken)
      localStorage.setItem('userInfo', JSON.stringify(user))
      
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
      userInfo.value = { ...userInfo.value, ...response.data }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '更新失败' 
      }
    }
  }
  
  const initUserFromStorage = () => {
    const storedUserInfo = localStorage.getItem('userInfo')
    if (storedUserInfo && token.value) {
      try {
        userInfo.value = JSON.parse(storedUserInfo)
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