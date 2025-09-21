<template>
  <header class="app-header">
    <!-- 顶部工具栏 -->
    <div class="header-toolbar">
      <div class="container flex-between">
        <div class="toolbar-left">
          <span class="text-sm text-secondary">宁北商城，品质生活从这里开始</span>
        </div>
        <div class="toolbar-right">
          <template v-if="userStore.isLoggedIn">
            <span class="text-sm">欢迎，{{ userStore.userName }}</span>
            <el-divider direction="vertical" />
            <a href="#" @click="handleLogout" class="text-sm">退出登录</a>
          </template>
          <template v-else>
            <a href="#" @click="showLogin" class="text-sm">登录</a>
            <el-divider direction="vertical" />
            <a href="#" @click="showRegister" class="text-sm">注册</a>
          </template>
          <el-divider direction="vertical" />
          <a href="#" class="text-sm">客服</a>
          <el-divider direction="vertical" />
          <a href="#" class="text-sm">手机宁北</a>
        </div>
      </div>
    </div>

    <!-- 主导航栏 -->
    <div class="header-main">
      <div class="container">
        <div class="header-content">
          <!-- Logo -->
          <div class="header-logo">
            <router-link to="/" class="logo-link">
              <img src="@/assets/logo.svg" alt="宁北商城" class="logo-image" />
              <span class="logo-text">宁北商城</span>
            </router-link>
          </div>

          <!-- 搜索区域 -->
          <div class="header-search">
            <div class="search-container">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索商品、品牌、店铺"
                class="search-input"
                @keyup.enter="handleSearch"
                @input="handleSearchInput"
              >
                <template #suffix>
                  <el-button 
                    type="primary" 
                    :icon="Search" 
                    @click="handleSearch"
                    class="search-button"
                  />
                </template>
              </el-input>
              
              <!-- 搜索建议 -->
              <div v-if="showSuggestions && suggestions.length" class="search-suggestions">
                <div 
                  v-for="suggestion in suggestions" 
                  :key="suggestion"
                  class="suggestion-item"
                  @click="selectSuggestion(suggestion)"
                >
                  {{ suggestion }}
                </div>
              </div>
            </div>
            
            <!-- 热门搜索 -->
            <div class="hot-keywords">
              <span 
                v-for="keyword in hotKeywords" 
                :key="keyword"
                class="hot-keyword"
                @click="searchKeyword = keyword; handleSearch()"
              >
                {{ keyword }}
              </span>
            </div>
          </div>

          <!-- 用户操作区域 -->
          <div class="header-actions">
            <!-- 购物车 -->
            <div class="action-item cart-action" @click="goToCart">
              <el-badge :value="cartStore.cartCount" :hidden="cartStore.cartCount === 0">
                <el-icon size="24"><ShoppingCart /></el-icon>
              </el-badge>
              <span class="action-text">购物车</span>
            </div>

            <!-- 用户中心 -->
            <div class="action-item" @click="goToUser">
              <el-icon size="24"><User /></el-icon>
              <span class="action-text">我的</span>
            </div>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="header-nav">
          <div class="nav-categories">
            <el-dropdown trigger="hover" @command="handleCategorySelect">
              <div class="categories-trigger">
                <el-icon><Menu /></el-icon>
                <span>全部商品分类</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item 
                    v-for="category in categories" 
                    :key="category.id"
                    :command="category.id"
                  >
                    <el-icon><component :is="category.icon" /></el-icon>
                    {{ category.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <div class="nav-links">
            <router-link to="/" class="nav-link">首页</router-link>
            <router-link to="/product" class="nav-link">商品</router-link>
            <router-link to="/order" class="nav-link">订单</router-link>
            <router-link to="/user" class="nav-link">个人中心</router-link>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useCartStore } from '@/store/modules/cart'
import { productApi } from '@/api/product'
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  ArrowDown,
  Cellphone,
  Monitor,
  VideoPlay,
  Camera,
  Watch
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()

// 搜索相关
const searchKeyword = ref('')
const suggestions = ref([])
const showSuggestions = ref(false)
const hotKeywords = ref(['手机', '电脑', '耳机', '相机', '手表'])

// 商品分类
const categories = ref([
  { id: 1, name: '手机数码', icon: 'Cellphone' },
  { id: 2, name: '电脑办公', icon: 'Monitor' },
  { id: 3, name: '影音娱乐', icon: 'VideoPlay' },
  { id: 4, name: '摄影摄像', icon: 'Camera' },
  { id: 5, name: '钟表配饰', icon: 'Watch' }
])

// 搜索处理
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      name: 'Search',
      query: { keyword: searchKeyword.value.trim() }
    })
    showSuggestions.value = false
  }
}

const handleSearchInput = async () => {
  if (searchKeyword.value.length > 1) {
    try {
      const response = await productApi.getSearchSuggestions(searchKeyword.value)
      suggestions.value = response.data || []
      showSuggestions.value = true
    } catch (error) {
      console.error('获取搜索建议失败:', error)
    }
  } else {
    showSuggestions.value = false
  }
}

const selectSuggestion = (suggestion) => {
  searchKeyword.value = suggestion
  handleSearch()
}

// 分类选择
const handleCategorySelect = (categoryId) => {
  router.push({
    name: 'Product',
    query: { category: categoryId }
  })
}

// 导航处理
const goToCart = () => {
  if (userStore.isLoggedIn) {
    router.push('/cart')
  } else {
    userStore.showLoginModal = true
  }
}

const goToUser = () => {
  if (userStore.isLoggedIn) {
    router.push('/user')
  } else {
    userStore.showLoginModal = true
  }
}

// 登录注册
const showLogin = () => {
  userStore.showLoginModal = true
}

const showRegister = () => {
  userStore.showLoginModal = true
}

const handleLogout = () => {
  userStore.logout()
}

// 初始化
onMounted(() => {
  if (userStore.isLoggedIn) {
    cartStore.fetchCartItems()
  }
})
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: var(--z-index-sticky);
  background-color: var(--bg-primary);
  box-shadow: var(--shadow-light);
}

.header-toolbar {
  background-color: var(--bg-tertiary);
  padding: var(--spacing-xs) 0;
  font-size: var(--font-size-sm);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.header-main {
  padding: var(--spacing-md) 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

/* PC端大屏幕优化 */
@media (min-width: 1400px) {
  .header-content {
    gap: var(--spacing-xl);
    padding: var(--spacing-lg) 0;
  }
  
  .header-search {
    max-width: 700px;
  }
  
  .header-actions {
    gap: var(--spacing-xl);
  }
}

.header-logo {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  color: var(--text-primary);
}

.logo-image {
  width: 40px;
  height: 40px;
}

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.header-search {
  flex: 1;
  max-width: 600px;
}

.search-container {
  position: relative;
  margin-bottom: var(--spacing-xs);
}

.search-input {
  width: 100%;
}

.search-button {
  border-radius: 0 var(--radius-base) var(--radius-base) 0;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-top: none;
  border-radius: 0 0 var(--radius-base) var(--radius-base);
  box-shadow: var(--shadow-base);
  z-index: var(--z-index-dropdown);
}

.suggestion-item {
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.suggestion-item:hover {
  background-color: var(--bg-tertiary);
}

.hot-keywords {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.hot-keyword {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.hot-keyword:hover {
  color: var(--primary-color);
}

.header-actions {
  display: flex;
  gap: var(--spacing-lg);
  flex-shrink: 0;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.action-item:hover {
  color: var(--primary-color);
}

.action-text {
  font-size: var(--font-size-sm);
}

.header-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-light);
}

.nav-categories {
  flex-shrink: 0;
}

.categories-trigger {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--primary-color);
  color: var(--text-white);
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.categories-trigger:hover {
  background-color: var(--primary-hover);
}

.nav-links {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary-color);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .header-toolbar {
    padding: var(--spacing-xs) 0;
  }
  
  .toolbar-right {
    display: none; /* 在平板端隐藏部分工具栏项目 */
  }
}

@media (max-width: 768px) {
  .header-toolbar {
    display: none;
  }
  
  .header-main {
    padding: var(--spacing-sm) 0;
  }
  
  .header-content {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: stretch;
  }
  
  .header-logo {
    order: 1;
    text-align: center;
  }
  
  .header-search {
    order: 2;
    max-width: none;
  }
  
  .header-actions {
    order: 3;
    justify-content: center;
    gap: var(--spacing-xl);
  }
  
  .header-nav {
    flex-direction: column;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);
    padding-top: var(--spacing-sm);
  }
  
  .nav-categories {
    order: 1;
    align-self: center;
  }
  
  .nav-links {
    order: 2;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }
  
  .categories-trigger {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
  }
}

@media (max-width: 480px) {
  .header-main {
    padding: var(--spacing-xs) 0;
  }
  
  .header-content {
    gap: var(--spacing-xs);
  }
  
  .logo-text {
    display: none;
  }
  
  .hot-keywords {
    display: none;
  }
  
  .action-text {
    display: none;
  }
  
  .header-actions {
    gap: var(--spacing-lg);
  }
  
  .nav-links {
    gap: var(--spacing-sm);
  }
  
  .nav-link {
    font-size: var(--font-size-sm);
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}
</style>