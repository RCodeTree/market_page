<template>
  <div class="hot-categories">
    <div class="categories-grid">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-card"
        @click="goToCategory(category.id)"
      >
        <div class="category-image">
          <img :src="category.image" :alt="category.name" />
          <div class="category-overlay">
            <div class="category-stats">
              <span class="product-count">{{ category.productCount }}+商品</span>
              <span class="hot-tag" v-if="category.isHot">🔥 热门</span>
            </div>
          </div>
        </div>
        
        <div class="category-info">
          <h3 class="category-name">{{ category.name }}</h3>
          <p class="category-desc">{{ category.description }}</p>
          
          <div class="category-tags">
            <span
              v-for="tag in category.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
          
          <div class="category-action">
            <el-button type="primary" size="small">
              立即选购
              <el-icon class="ml-1"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()

// 热门分类数据
const categories = reactive([
  {
    id: 1,
    name: '数码科技',
    description: '最新科技产品，引领潮流',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop',
    productCount: 1580,
    isHot: true,
    tags: ['手机', '电脑', '智能设备']
  },
  {
    id: 2,
    name: '时尚服饰',
    description: '潮流服装，彰显个性',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    productCount: 2340,
    isHot: true,
    tags: ['男装', '女装', '配饰']
  },
  {
    id: 3,
    name: '家居生活',
    description: '品质生活，从家开始',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    productCount: 1890,
    isHot: false,
    tags: ['家具', '装饰', '收纳']
  },
  {
    id: 4,
    name: '美妆护肤',
    description: '美丽从这里开始',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
    productCount: 1260,
    isHot: true,
    tags: ['护肤', '彩妆', '香水']
  },
  {
    id: 5,
    name: '运动户外',
    description: '健康生活，运动先行',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    productCount: 980,
    isHot: false,
    tags: ['运动鞋', '健身', '户外']
  },
  {
    id: 6,
    name: '母婴用品',
    description: '呵护宝贝，关爱成长',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop',
    productCount: 1450,
    isHot: true,
    tags: ['奶粉', '玩具', '童装']
  },
  {
    id: 7,
    name: '食品生鲜',
    description: '新鲜美味，健康生活',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
    productCount: 2100,
    isHot: false,
    tags: ['水果', '蔬菜', '零食']
  },
  {
    id: 8,
    name: '汽车用品',
    description: '爱车养护，安全出行',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    productCount: 760,
    isHot: false,
    tags: ['配件', '保养', '装饰']
  }
])

// 跳转到分类页面
const goToCategory = (categoryId) => {
  router.push(`/category/${categoryId}`)
}
</script>

<style scoped>
.hot-categories {
  width: 100%;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.category-card {
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.category-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.category-card:hover .category-image img {
  transform: scale(1.1);
}

.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 70%,
    rgba(0, 0, 0, 0.7) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: var(--spacing-lg);
}

.category-stats {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.product-count {
  color: var(--text-white);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.hot-tag {
  color: var(--text-white);
  font-size: var(--font-size-xs);
  background-color: rgba(255, 255, 255, 0.2);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  backdrop-filter: blur(10px);
  width: fit-content;
}

.category-info {
  padding: var(--spacing-lg);
}

.category-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: var(--line-height-tight);
}

.category-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md) 0;
  line-height: var(--line-height-normal);
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-lg);
}

.tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--bg-gray-light);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.tag:hover {
  background-color: var(--primary-color);
  color: var(--text-white);
}

.category-action {
  display: flex;
  justify-content: flex-end;
}

.ml-1 {
  margin-left: 4px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--spacing-sm);
  }
  
  .category-image {
    height: 160px;
  }
  
  .category-info {
    padding: var(--spacing-md);
  }
  
  .category-name {
    font-size: var(--font-size-lg);
  }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .category-image {
    height: 140px;
  }
  
  .category-info {
    padding: var(--spacing-sm);
  }
  
  .category-name {
    font-size: var(--font-size-base);
  }
  
  .category-desc {
    font-size: var(--font-size-xs);
  }
  
  .category-overlay {
    padding: var(--spacing-md);
  }
}
</style>