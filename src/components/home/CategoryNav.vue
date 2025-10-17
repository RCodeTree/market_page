<template>
  <div class="category-nav">
    <!-- PC端显示 -->
    <div class="nav-pc" v-show="!isMobile">
      <div class="nav-header">
        <el-icon><Grid /></el-icon>
        <span>全部商品分类</span>
      </div>
      
      <div class="nav-list">
        <div
          v-for="category in categories"
          :key="category.id"
          class="nav-item"
          @mouseenter="showSubMenu(category)"
          @mouseleave="hideSubMenu"
        >
          <div class="item-content">
            <span class="item-text">{{ category.name }}</span>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
          
          <!-- 二级分类菜单 -->
          <transition name="submenu">
            <div
              v-if="activeCategory?.id === category.id"
              class="sub-menu"
              @mouseenter="keepSubMenu"
              @mouseleave="hideSubMenu"
            >
              <div class="sub-menu-content">
                <div
                  v-for="subCategory in category.children"
                  :key="subCategory.id"
                  class="sub-category"
                >
                  <h4 class="sub-title">{{ subCategory.name }}</h4>
                  <div class="sub-items">
                    <router-link
                      v-for="item in subCategory.items"
                      :key="item.id"
                      :to="`/products?category=${item.id}`"
                      class="sub-item"
                    >
                      {{ item.name }}
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 移动端显示 -->
    <div class="nav-mobile" v-show="isMobile">
      <div class="mobile-header">
        <el-icon><Grid /></el-icon>
        <span>商品分类</span>
        <el-button 
          v-if="showAllCategories" 
          text 
          size="small" 
          @click="toggleCategoryView"
          class="toggle-btn"
        >
          {{ isExpanded ? '收起' : '全部' }}
        </el-button>
      </div>
      
      <!-- 横向滚动分类标签 -->
      <div class="mobile-categories" v-if="!isExpanded">
        <div class="category-scroll">
          <div
            v-for="category in displayCategories"
            :key="category.id"
            class="category-tag"
            :class="{ active: activeMobileCategory?.id === category.id }"
            @click="selectMobileCategory(category)"
          >
            {{ category.name }}
          </div>
        </div>
      </div>

      <!-- 展开的分类列表 -->
      <div class="mobile-expanded" v-if="isExpanded">
        <div class="expanded-list">
          <div
            v-for="category in categories"
            :key="category.id"
            class="expanded-item"
            @click="selectMobileCategory(category)"
          >
            <div class="expanded-content">
              <span class="expanded-text">{{ category.name }}</span>
              <el-icon class="expanded-arrow">
                <ArrowRight v-if="!category.isOpen" />
                <ArrowDown v-else />
              </el-icon>
            </div>
            
            <!-- 子分类 -->
            <transition name="mobile-submenu">
              <div v-if="category.isOpen" class="mobile-sub-list">
                <div
                  v-for="subCategory in category.children"
                  :key="subCategory.id"
                  class="mobile-sub-item"
                  @click.stop="goToCategory(subCategory.id)"
                >
                  {{ subCategory.name }}
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- 移动端子分类弹窗 -->
      <transition name="mobile-popup">
        <div v-if="activeMobileCategory && !isExpanded" class="mobile-popup">
          <div class="popup-overlay" @click="closeMobilePopup"></div>
          <div class="popup-content">
            <div class="popup-header">
              <h3>{{ activeMobileCategory.name }}</h3>
              <el-button text @click="closeMobilePopup">
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
            <div class="popup-body">
              <div
                v-for="subCategory in activeMobileCategory.children"
                :key="subCategory.id"
                class="popup-sub-category"
              >
                <h4 class="popup-sub-title">{{ subCategory.name }}</h4>
                <div class="popup-sub-items">
                  <div
                    v-for="item in subCategory.items"
                    :key="item.id"
                    class="popup-sub-item"
                    @click="goToCategory(item.id)"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Grid, 
  ArrowRight,
  ArrowDown,
  Close
} from '@element-plus/icons-vue'

const router = useRouter()
const activeCategory = ref(null)
const activeMobileCategory = ref(null)
const isExpanded = ref(false)
const isMobile = ref(false)
let hideTimer = null

// 商品分类数据
const categories = reactive([
  {
    id: 1,
    name: '手机数码',
    isOpen: false,
    children: [
      { 
        id: 11, 
        name: '手机通讯',
        items: [
          { id: 111, name: '智能手机' },
          { id: 112, name: '老人机' },
          { id: 113, name: '游戏手机' }
        ]
      },
      { 
        id: 12, 
        name: '数码配件',
        items: [
          { id: 121, name: '手机壳' },
          { id: 122, name: '充电器' },
          { id: 123, name: '数据线' }
        ]
      },
      { 
        id: 13, 
        name: '智能设备',
        items: [
          { id: 131, name: '智能手表' },
          { id: 132, name: '蓝牙耳机' },
          { id: 133, name: '智能音箱' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '电脑办公',
    isOpen: false,
    children: [
      { 
        id: 21, 
        name: '电脑整机',
        items: [
          { id: 211, name: '笔记本' },
          { id: 212, name: '台式机' },
          { id: 213, name: '平板电脑' }
        ]
      },
      { 
        id: 22, 
        name: '电脑配件',
        items: [
          { id: 221, name: '显卡' },
          { id: 222, name: '内存' },
          { id: 223, name: '硬盘' }
        ]
      },
      { 
        id: 23, 
        name: '办公设备',
        items: [
          { id: 231, name: '打印机' },
          { id: 232, name: '投影仪' },
          { id: 233, name: '扫描仪' }
        ]
      }
    ]
  },
  {
    id: 3,
    name: '摄影摄像',
    isOpen: false,
    children: [
      { 
        id: 31, 
        name: '数码相机',
        items: [
          { id: 311, name: '单反相机' },
          { id: 312, name: '微单相机' },
          { id: 313, name: '运动相机' }
        ]
      },
      { 
        id: 32, 
        name: '摄像设备',
        items: [
          { id: 321, name: '摄像机' },
          { id: 322, name: '监控设备' },
          { id: 323, name: '直播设备' }
        ]
      }
    ]
  },
  {
    id: 4,
    name: '影音娱乐',
    isOpen: false,
    children: [
      { 
        id: 41, 
        name: '耳机音响',
        items: [
          { id: 411, name: '头戴耳机' },
          { id: 412, name: '音响设备' },
          { id: 413, name: '麦克风' }
        ]
      }
    ]
  },
  {
    id: 5,
    name: '服装服饰',
    isOpen: false,
    children: [
      { 
        id: 51, 
        name: '男装',
        items: [
          { id: 511, name: 'T恤' },
          { id: 512, name: '衬衫' },
          { id: 513, name: '外套' }
        ]
      },
      { 
        id: 52, 
        name: '女装',
        items: [
          { id: 521, name: '连衣裙' },
          { id: 522, name: '上衣' },
          { id: 523, name: '裤装' }
        ]
      }
    ]
  },
  {
    id: 6,
    name: '食品饮料',
    isOpen: false,
    children: [
      { 
        id: 61, 
        name: '休闲食品',
        items: [
          { id: 611, name: '零食' },
          { id: 612, name: '坚果' },
          { id: 613, name: '糖果' }
        ]
      }
    ]
  },
  {
    id: 7,
    name: '运动户外',
    isOpen: false,
    children: [
      { 
        id: 71, 
        name: '运动鞋服',
        items: [
          { id: 711, name: '运动鞋' },
          { id: 712, name: '运动服' },
          { id: 713, name: '运动配件' }
        ]
      }
    ]
  },
  {
    id: 8,
    name: '图书文娱',
    isOpen: false,
    children: [
      { 
        id: 81, 
        name: '图书音像',
        items: [
          { id: 811, name: '小说' },
          { id: 812, name: '教材' },
          { id: 813, name: '音像制品' }
        ]
      }
    ]
  }
])

// 移动端显示的分类（前6个）
const displayCategories = computed(() => {
  return categories.slice(0, 6)
})

// 是否显示全部分类按钮
const showAllCategories = computed(() => {
  return categories.length > 6
})

// 检测屏幕尺寸
const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
}

// PC端功能
const showSubMenu = (category) => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  activeCategory.value = category
}

const keepSubMenu = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const hideSubMenu = () => {
  hideTimer = setTimeout(() => {
    activeCategory.value = null
  }, 200)
}

// 移动端功能
const selectMobileCategory = (category) => {
  if (isExpanded.value) {
    // 展开模式下切换子分类显示
    category.isOpen = !category.isOpen
    // 关闭其他分类
    categories.forEach(cat => {
      if (cat.id !== category.id) {
        cat.isOpen = false
      }
    })
  } else {
    // 标签模式下显示弹窗
    activeMobileCategory.value = category
  }
}

const closeMobilePopup = () => {
  activeMobileCategory.value = null
}

const toggleCategoryView = () => {
  isExpanded.value = !isExpanded.value
  if (!isExpanded.value) {
    // 收起时关闭所有子分类
    categories.forEach(cat => {
      cat.isOpen = false
    })
  }
  closeMobilePopup()
}

const goToCategory = (categoryId) => {
  router.push(`/products?category=${categoryId}`)
  closeMobilePopup()
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  if (hideTimer) {
    clearTimeout(hideTimer)
  }
})
</script>

<style scoped>
.category-nav {
  background-color: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  border: 1px solid #f0f0f0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* PC端样式 */
.nav-pc {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.nav-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background-color: #e23e3e;
  color: #ffffff;
  font-weight: 500;
}

.nav-list {
  flex: 1;
  overflow: hidden;
}

.nav-item {
  position: relative;
  border-bottom: 1px solid #f0f0f0;
}

.nav-item:last-child {
  border-bottom: none;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.15s;
}

.item-content:hover {
  background-color: #fafafa;
  color: #e23e3e;
}

.item-text {
  flex: 1;
  font-size: 14px;
}

.arrow-icon {
  font-size: 14px;
  color: #666666;
}

.sub-menu {
  position: absolute;
  left: 100%;
  top: 0;
  width: 600px;
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.sub-menu-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding: 24px;
  max-height: 400px;
  overflow-y: auto;
}

.sub-category {
  margin-bottom: 16px;
}

.sub-title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin: 0 0 8px 0;
  padding-bottom: 4px;
  border-bottom: 1px solid #f0f0f0;
}

.sub-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sub-item {
  display: inline-block;
  padding: 4px 8px;
  font-size: 14px;
  color: #666666;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.15s;
}

.sub-item:hover {
  background-color: #f5f5f5;
  color: #e23e3e;
}

/* 移动端样式 */
.nav-mobile {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #e23e3e;
  color: #ffffff;
  font-weight: 500;
  font-size: 14px;
}

.mobile-header .el-icon {
  margin-right: 8px;
}

.toggle-btn {
  color: #ffffff !important;
  font-size: 12px;
  padding: 4px 8px;
}

.mobile-categories {
  padding: 12px 0;
  background-color: #ffffff;
}

.category-scroll {
  display: flex;
  gap: 8px;
  padding: 0 16px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-scroll::-webkit-scrollbar {
  display: none;
}

.category-tag {
  flex-shrink: 0;
  padding: 8px 16px;
  background-color: #f5f5f5;
  color: #666666;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.category-tag.active {
  background-color: #e23e3e;
  color: #ffffff;
}

.category-tag:hover {
  background-color: #e8e8e8;
}

.category-tag.active:hover {
  background-color: #d32f2f;
}

/* 展开的分类列表 */
.mobile-expanded {
  flex: 1;
  overflow-y: auto;
  background-color: #ffffff;
}

.expanded-list {
  padding: 8px 0;
}

.expanded-item {
  border-bottom: 1px solid #f0f0f0;
}

.expanded-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.expanded-content:hover {
  background-color: #fafafa;
}

.expanded-text {
  font-size: 14px;
  color: #333333;
}

.expanded-arrow {
  font-size: 14px;
  color: #999999;
}

.mobile-sub-list {
  background-color: #f8f8f8;
  padding: 8px 0;
}

.mobile-sub-item {
  padding: 8px 32px;
  font-size: 13px;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s;
}

.mobile-sub-item:hover {
  background-color: #f0f0f0;
  color: #e23e3e;
}

/* 移动端弹窗 */
.mobile-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
}

.popup-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 70vh;
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.popup-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
}

.popup-body {
  padding: 16px 20px;
  max-height: calc(70vh - 60px);
  overflow-y: auto;
}

.popup-sub-category {
  margin-bottom: 20px;
}

.popup-sub-title {
  font-size: 15px;
  font-weight: 500;
  color: #333333;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.popup-sub-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.popup-sub-item {
  padding: 8px 12px;
  background-color: #f8f8f8;
  border-radius: 6px;
  font-size: 13px;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.popup-sub-item:hover {
  background-color: #e8f5e8;
  color: #e23e3e;
}

/* 动画效果 */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s;
}

.submenu-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.submenu-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.mobile-submenu-enter-active,
.mobile-submenu-leave-active {
  transition: all 0.3s;
}

.mobile-submenu-enter-from,
.mobile-submenu-leave-to {
  opacity: 0;
  max-height: 0;
  padding: 0;
}

.mobile-popup-enter-active,
.mobile-popup-leave-active {
  transition: all 0.3s;
}

.mobile-popup-enter-from .popup-content,
.mobile-popup-leave-to .popup-content {
  transform: translateY(100%);
}

.mobile-popup-enter-from .popup-overlay,
.mobile-popup-leave-to .popup-overlay {
  opacity: 0;
}

/* 滚动条样式 */
.nav-list::-webkit-scrollbar,
.sub-menu-content::-webkit-scrollbar,
.mobile-expanded::-webkit-scrollbar,
.popup-body::-webkit-scrollbar {
  width: 4px;
}

.nav-list::-webkit-scrollbar-track,
.sub-menu-content::-webkit-scrollbar-track,
.mobile-expanded::-webkit-scrollbar-track,
.popup-body::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.nav-list::-webkit-scrollbar-thumb,
.sub-menu-content::-webkit-scrollbar-thumb,
.mobile-expanded::-webkit-scrollbar-thumb,
.popup-body::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 2px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .sub-menu {
    width: 500px;
    border-radius: 4px;
  }
  
  .sub-menu-content {
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .nav-pc {
    display: none;
  }
  
  .nav-mobile {
    display: flex;
  }
}

@media (max-width: 480px) {
  .mobile-header {
    padding: 10px 14px;
    font-size: 13px;
  }
  
  .category-scroll {
    padding: 0 14px;
    gap: 6px;
  }
  
  .category-tag {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .popup-sub-items {
    grid-template-columns: 1fr;
  }
  
  .popup-header {
    padding: 14px 16px;
  }
  
  .popup-body {
    padding: 14px 16px;
  }
}

@media (max-width: 360px) {
  .mobile-header {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .category-scroll {
    padding: 0 12px;
    gap: 4px;
  }
  
  .category-tag {
    padding: 5px 10px;
    font-size: 11px;
  }
  
  .popup-header {
    padding: 12px 14px;
  }
  
  .popup-body {
    padding: 12px 14px;
  }
  
  .popup-sub-item {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>