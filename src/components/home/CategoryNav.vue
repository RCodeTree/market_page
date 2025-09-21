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
          <el-icon class="item-icon">
            <component :is="category.icon" />
          </el-icon>
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
  ArrowRight,
  Cellphone,
  Monitor,
  Camera,
  VideoPlay,
  ShoppingBag,
  Coffee,
  Basketball,
  Reading,
  Female,
  Male
} from '@element-plus/icons-vue'

const activeCategory = ref(null)
let hideTimer = null

// 商品分类数据
const categories = reactive([
  {
    id: 1,
    name: '手机数码',
    icon: 'Cellphone',
    children: [
      {
        id: 11,
        name: '手机通讯',
        items: [
          { id: 111, name: '手机' },
          { id: 112, name: '对讲机' },
          { id: 113, name: '手机配件' }
        ]
      },
      {
        id: 12,
        name: '数码产品',
        items: [
          { id: 121, name: '平板电脑' },
          { id: 122, name: '智能手表' },
          { id: 123, name: '耳机音响' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '电脑办公',
    icon: 'Monitor',
    children: [
      {
        id: 21,
        name: '电脑整机',
        items: [
          { id: 211, name: '笔记本' },
          { id: 212, name: '台式机' },
          { id: 213, name: '一体机' }
        ]
      },
      {
        id: 22,
        name: '电脑配件',
        items: [
          { id: 221, name: '显示器' },
          { id: 222, name: '键盘鼠标' },
          { id: 223, name: '硬盘存储' }
        ]
      }
    ]
  },
  {
    id: 3,
    name: '摄影摄像',
    icon: 'Camera',
    children: [
      {
        id: 31,
        name: '数码相机',
        items: [
          { id: 311, name: '单反相机' },
          { id: 312, name: '微单相机' },
          { id: 313, name: '拍立得' }
        ]
      },
      {
        id: 32,
        name: '摄像设备',
        items: [
          { id: 321, name: '摄像机' },
          { id: 322, name: '运动相机' },
          { id: 323, name: '无人机' }
        ]
      }
    ]
  },
  {
    id: 4,
    name: '影音娱乐',
    icon: 'VideoPlay',
    children: [
      {
        id: 41,
        name: '耳机音响',
        items: [
          { id: 411, name: '耳机' },
          { id: 412, name: '音响' },
          { id: 413, name: '麦克风' }
        ]
      }
    ]
  },
  {
    id: 5,
    name: '服装服饰',
    icon: 'ShoppingBag',
    children: [
      {
        id: 51,
        name: '男装',
        items: [
          { id: 511, name: 'T恤' },
          { id: 512, name: '衬衫' },
          { id: 513, name: '裤装' }
        ]
      },
      {
        id: 52,
        name: '女装',
        items: [
          { id: 521, name: '连衣裙' },
          { id: 522, name: '上衣' },
          { id: 523, name: '下装' }
        ]
      }
    ]
  },
  {
    id: 6,
    name: '食品饮料',
    icon: 'Coffee',
    children: [
      {
        id: 61,
        name: '休闲食品',
        items: [
          { id: 611, name: '坚果' },
          { id: 612, name: '饼干' },
          { id: 613, name: '糖果' }
        ]
      }
    ]
  },
  {
    id: 7,
    name: '运动户外',
    icon: 'Basketball',
    children: [
      {
        id: 71,
        name: '运动器材',
        items: [
          { id: 711, name: '健身器材' },
          { id: 712, name: '球类运动' },
          { id: 713, name: '户外装备' }
        ]
      }
    ]
  },
  {
    id: 8,
    name: '图书文娱',
    icon: 'Reading',
    children: [
      {
        id: 81,
        name: '图书',
        items: [
          { id: 811, name: '小说' },
          { id: 812, name: '教育' },
          { id: 813, name: '科技' }
        ]
      }
    ]
  }
])

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
  background-color: var(--bg-white);
  border-radius: var(--radius-base);
  overflow: hidden;
  position: relative;
}

.nav-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: var(--primary-color);
  color: var(--text-white);
  font-weight: var(--font-weight-medium);
}

.nav-list {
  max-height: 350px;
  overflow-y: auto;
}

.nav-item {
  position: relative;
  border-bottom: 1px solid var(--border-light);
}

.nav-item:last-child {
  border-bottom: none;
}

.item-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.item-content:hover {
  background-color: var(--bg-light);
  color: var(--primary-color);
}

.item-icon {
  font-size: var(--font-size-lg);
  color: var(--primary-color);
}

.item-text {
  flex: 1;
  font-size: var(--font-size-sm);
}

.arrow-icon {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.sub-menu {
  position: absolute;
  left: 100%;
  top: 0;
  width: 600px;
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-base);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-index-dropdown);
}

.sub-menu-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  max-height: 400px;
  overflow-y: auto;
}

.sub-category {
  margin-bottom: var(--spacing-md);
}

.sub-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--border-light);
}

.sub-items {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.sub-item {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.sub-item:hover {
  background-color: var(--bg-light);
  color: var(--primary-color);
}

/* 动画效果 */
.submenu-enter-active,
.submenu-leave-active {
  transition: all var(--transition-normal);
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
  background: var(--bg-light);
}

.nav-list::-webkit-scrollbar-thumb,
.sub-menu-content::-webkit-scrollbar-thumb {
  background: var(--border-base);
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
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
  }
  
  .item-content {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .item-text {
    font-size: var(--font-size-xs);
  }
  
  .sub-menu {
    width: 100vw;
    left: -200px;
  }
}
</style>