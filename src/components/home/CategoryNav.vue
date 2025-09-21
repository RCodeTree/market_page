<template>
  <div class="category-nav">
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
</template>

<script setup>
import { ref, reactive } from 'vue'
import { 
  Grid, 
  ArrowRight
} from '@element-plus/icons-vue'

const activeCategory = ref(null)
let hideTimer = null

// 商品分类数据
const categories = [
  {
    id: 1,
    name: '手机数码',
    children: [
      { id: 11, name: '手机通讯' },
      { id: 12, name: '数码配件' },
      { id: 13, name: '智能设备' }
    ]
  },
  {
    id: 2,
    name: '电脑办公',
    children: [
      { id: 21, name: '电脑整机' },
      { id: 22, name: '电脑配件' },
      { id: 23, name: '办公设备' }
    ]
  },
  {
    id: 3,
    name: '摄影摄像',
    children: [
      { id: 31, name: '数码相机' },
      { id: 32, name: '摄像设备' },
      { id: 33, name: '影音娱乐' }
    ]
  },
  {
    id: 4,
    name: '影音娱乐',
    children: [
      { id: 41, name: '耳机音响' },
      { id: 42, name: '音乐器材' },
      { id: 43, name: '麦克风' }
    ]
  },
  {
    id: 5,
    name: '服装服饰',
    children: [
      { id: 51, name: '男装' },
      { id: 52, name: '女装' },
      { id: 53, name: '内衣配饰' }
    ]
  },
  {
    id: 6,
    name: '食品饮料',
    children: [
      { id: 61, name: '休闲食品' },
      { id: 62, name: '茶叶酒水' },
      { id: 63, name: '生鲜食品' }
    ]
  },
  {
    id: 7,
    name: '运动户外',
    children: [
      { id: 71, name: '运动鞋服' },
      { id: 72, name: '健身器材' },
      { id: 73, name: '户外装备' }
    ]
  },
  {
    id: 8,
    name: '图书文娱',
    children: [
      { id: 81, name: '图书音像' },
      { id: 82, name: '文具用品' },
      { id: 83, name: '乐器' }
    ]
  }
]

// 显示子菜单
const showSubMenu = (category) => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  activeCategory.value = category
}

// 保持子菜单显示
const keepSubMenu = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

// 隐藏子菜单
const hideSubMenu = () => {
  hideTimer = setTimeout(() => {
    activeCategory.value = null
  }, 200)
}
</script>

<style scoped>
.category-nav {
  background-color: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  border: 1px solid #f0f0f0;
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
  max-height: 350px;
  overflow-y: auto;
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

/* 滚动条样式 */
.nav-list::-webkit-scrollbar,
.sub-menu-content::-webkit-scrollbar {
  width: 4px;
}

.nav-list::-webkit-scrollbar-track,
.sub-menu-content::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.nav-list::-webkit-scrollbar-thumb,
.sub-menu-content::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 2px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .sub-menu {
    width: 500px;
  }
  
  .sub-menu-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .nav-header {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .item-content {
    padding: 8px 16px;
  }
  
  .item-text {
    font-size: 12px;
  }
  
  .sub-menu {
    width: 100vw;
    left: -200px;
  }
}
</style>