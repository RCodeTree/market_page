<template>
  <div class="user-center">
    <!-- 用户信息头部 -->
    <div class="user-header">
      <div class="container">
        <div class="user-info">
          <div class="avatar-section">
            <el-avatar :size="80" :src="userStore.userAvatar" class="user-avatar">
              <el-icon>
                <User />
              </el-icon>
            </el-avatar>
            <el-button type="text" class="change-avatar-btn" @click="showAvatarUpload = true">
              更换头像
            </el-button>
          </div>

          <div class="user-details">
            <h2 class="username">{{ userStore.userName }}</h2>
            <p class="user-level">
              <el-tag type="warning" size="small">
                <el-icon>
                  <Crown />
                </el-icon>
                普通会员
              </el-tag>
            </p>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-number">{{ userStats.orderCount }}</span>
                <span class="stat-label">订单数</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ userStats.favoriteCount }}</span>
                <span class="stat-label">收藏数</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ userStats.followingCount }}</span>
                <span class="stat-label">关注数</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能导航 -->
    <div class="nav-section">
      <div class="container">
        <div class="nav-grid">
          <div v-for="item in navItems" :key="item.name" class="nav-item" @click="handleNavClick(item)">
            <div class="nav-icon">
              <el-icon :size="24">
                <component :is="item.icon" />
              </el-icon>
            </div>
            <span class="nav-label">{{ item.label }}</span>
            <el-badge v-if="item.badge" :value="item.badge" class="nav-badge" />
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="container">
        <div class="content-grid">
          <!-- 左侧菜单 -->
          <div class="sidebar">
            <el-menu :default-active="activeMenu" class="user-menu" @select="handleMenuSelect">
              <el-menu-item index="profile">
                <el-icon>
                  <User />
                </el-icon>
                <span>个人资料</span>
              </el-menu-item>
              <el-menu-item index="orders">
                <el-icon>
                  <Document />
                </el-icon>
                <span>我的订单</span>
              </el-menu-item>
              <el-menu-item index="favorites">
                <el-icon>
                  <Star />
                </el-icon>
                <span>我的收藏</span>
              </el-menu-item>
              <el-menu-item index="following">
                <el-icon>
                  <UserFilled />
                </el-icon>
                <span>我的关注</span>
              </el-menu-item>
              <el-menu-item index="address">
                <el-icon>
                  <Location />
                </el-icon>
                <span>收货地址</span>
              </el-menu-item>
              <el-menu-item index="security">
                <el-icon>
                  <Lock />
                </el-icon>
                <span>账户安全</span>
              </el-menu-item>
            </el-menu>
          </div>

          <!-- 右侧内容 -->
          <div class="content-area">
            <UserProfile v-if="activeMenu === 'profile'" />
            <UserOrders v-else-if="activeMenu === 'orders'" />
            <UserFavorites v-else-if="activeMenu === 'favorites'" />

            <div v-else-if="activeMenu === 'addresses'" class="content-placeholder">
              <h3>收货地址</h3>
              <p>地址管理功能开发中...</p>
            </div>

            <div v-else-if="activeMenu === 'security'" class="content-placeholder">
              <h3>账户安全</h3>
              <p>安全设置功能开发中...</p>
            </div>

            <div v-else class="content-placeholder">
              <h3>功能开发中</h3>
              <p>该功能正在开发中，敬请期待...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 头像上传对话框 -->
    <el-dialog v-model="showAvatarUpload" title="更换头像" width="400px">
      <el-upload class="avatar-uploader" action="#" :show-file-list="false" :before-upload="beforeAvatarUpload"
        :http-request="handleAvatarUpload">
        <img v-if="previewAvatar" :src="previewAvatar" class="avatar-preview" />
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAvatarUpload = false">取消</el-button>
          <el-button type="primary" :loading="uploadLoading" @click="confirmAvatarUpload">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User, Crown, Document, Star, UserFilled,
  Location, Lock, Plus, SwitchButton
} from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'

// 导入子组件
import UserProfile from '@/components/user/UserProfileComponent.vue'
import UserOrders from '@/components/user/UserOrders.vue'
import UserFavorites from '@/components/user/UserFavorites.vue'

const router = useRouter()
const userStore = useUserStore()

const activeMenu = ref('profile')
const showAvatarUpload = ref(false)
const previewAvatar = ref('')
const uploadLoading = ref(false)

// 用户统计数据
const userStats = reactive({
  orderCount: 0,
  favoriteCount: 0,
  followingCount: 0
})

// 导航项目
const navItems = [
  {
    name: 'orders',
    label: '我的订单',
    icon: 'Document',
    badge: userStats.orderCount > 0 ? userStats.orderCount : null
  },
  {
    name: 'favorites',
    label: '我的收藏',
    icon: 'Star',
    badge: userStats.favoriteCount > 0 ? userStats.favoriteCount : null
  },
  {
    name: 'following',
    label: '我的关注',
    icon: 'UserFilled',
    badge: userStats.followingCount > 0 ? userStats.followingCount : null
  },
  {
    name: 'address',
    label: '收货地址',
    icon: 'Location'
  },
  {
    name: 'security',
    label: '账户安全',
    icon: 'Lock'
  },
  {
    name: 'logout',
    label: '退出登录',
    icon: 'SwitchButton'
  }
]

// 当前显示的组件
const currentComponent = computed(() => {
  const components = {
    profile: UserProfile,
    orders: UserOrders,
    favorites: UserFavorites
  }
  return components[activeMenu.value] || UserProfile
})

// 处理导航点击
const handleNavClick = (item) => {
  if (item.name === 'logout') {
    handleLogout()
  } else {
    activeMenu.value = item.name
  }
}

// 处理菜单选择
const handleMenuSelect = (index) => {
  activeMenu.value = index
}

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/')
  }).catch(() => {
    // 用户取消
  })
}

// 头像上传前验证
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('头像图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过 2MB!')
    return false
  }

  // 预览图片
  const reader = new FileReader()
  reader.onload = (e) => {
    previewAvatar.value = e.target.result
  }
  reader.readAsDataURL(file)

  return false // 阻止自动上传
}

// 处理头像上传
const handleAvatarUpload = () => {
  // 这里只是预览，实际上传在确认时进行
}

// 确认头像上传
const confirmAvatarUpload = async () => {
  if (!previewAvatar.value) {
    ElMessage.warning('请选择头像图片')
    return
  }

  uploadLoading.value = true
  try {
    // 这里应该调用上传API
    // const formData = new FormData()
    // formData.append('avatar', file)
    // await userApi.uploadAvatar(formData)

    // 模拟上传成功
    setTimeout(() => {
      ElMessage.success('头像更新成功')
      showAvatarUpload.value = false
      previewAvatar.value = ''
      uploadLoading.value = false
    }, 1000)
  } catch (error) {
    ElMessage.error('头像上传失败')
    uploadLoading.value = false
  }
}

// 加载用户统计数据
const loadUserStats = async () => {
  try {
    // 这里应该调用API获取用户统计数据
    // const stats = await userApi.getUserStats()
    // Object.assign(userStats, stats)

    // 模拟数据
    Object.assign(userStats, {
      orderCount: 12,
      favoriteCount: 8,
      followingCount: 5
    })
  } catch (error) {
    console.error('加载用户统计失败:', error)
  }
}

onMounted(() => {
  loadUserStats()
})
</script>

<style scoped>
.user-center {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.user-header {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  color: white;
  padding: var(--spacing-xl) 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.avatar-section {
  text-align: center;
}

.user-avatar {
  border: 3px solid rgba(255, 255, 255, 0.3);
  margin-bottom: var(--spacing-sm);
}

.change-avatar-btn {
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--font-size-sm);
}

.change-avatar-btn:hover {
  color: white;
}

.user-details {
  flex: 1;
}

.username {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-sm) 0;
}

.user-level {
  margin: 0 0 var(--spacing-lg) 0;
}

.user-stats {
  display: flex;
  gap: var(--spacing-xl);
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-sm);
  opacity: 0.8;
}

.nav-section {
  background: white;
  padding: var(--spacing-lg) 0;
  border-bottom: 1px solid var(--border-color);
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-lg);
  max-width: 800px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}

.nav-item:hover {
  background-color: var(--bg-secondary);
  transform: translateY(-2px);
}

.nav-icon {
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.nav-label {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.nav-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

.main-content {
  padding: var(--spacing-xl) 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--spacing-xl);
}

.sidebar {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  height: fit-content;
  box-shadow: var(--shadow-sm);
}

.user-menu {
  border: none;
}

.user-menu .el-menu-item {
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-xs);
}

.content-area {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  min-height: 600px;
}

/* 头像上传样式 */
.avatar-uploader {
  text-align: center;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--transition-fast);
  width: 178px;
  height: 178px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--primary-color);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.avatar-preview {
  width: 178px;
  height: 178px;
  object-fit: cover;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-info {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-lg);
  }

  .user-stats {
    justify-content: center;
  }

  .nav-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .sidebar {
    order: 2;
  }

  .content-area {
    order: 1;
  }
}

@media (max-width: 480px) {
  .user-header {
    padding: var(--spacing-lg) 0;
  }

  .nav-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .nav-item {
    padding: var(--spacing-sm);
  }

  .main-content {
    padding: var(--spacing-lg) 0;
  }
}
</style>