<template>
  <div class="quick-entry">
    <div class="entry-grid">
      <div
        v-for="entry in entries"
        :key="entry.id"
        class="entry-item"
        @click="handleClick(entry)"
      >
        <div class="entry-icon">
          <el-icon :size="32">
            <component :is="entry.icon" />
          </el-icon>
        </div>
        <span class="entry-text">{{ entry.name }}</span>
        <div v-if="entry.badge" class="entry-badge">{{ entry.badge }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ShoppingCart,
  Star,
  Clock,
  Present,
  Ticket,
  Service,
  Phone,
  QuestionFilled,
  TrendCharts,
  Medal
} from '@element-plus/icons-vue'

const router = useRouter()

// 快捷入口数据
const entries = reactive([
  {
    id: 1,
    name: '限时抢购',
    icon: 'Clock',
    link: '/flash-sale',
    badge: 'HOT'
  },
  {
    id: 2,
    name: '优惠券',
    icon: 'Ticket',
    link: '/coupons',
    badge: '领券'
  },
  {
    id: 3,
    name: '积分商城',
    icon: 'Star',
    link: '/points-mall',
    badge: null
  },
  {
    id: 4,
    name: '礼品卡',
    icon: 'Present',
    link: '/gift-cards',
    badge: null
  },
  {
    id: 5,
    name: '客服中心',
    icon: 'Service',
    link: '/customer-service',
    badge: null
  },
  {
    id: 6,
    name: '联系我们',
    icon: 'Phone',
    link: '/contact',
    badge: null
  },
  {
    id: 7,
    name: '帮助中心',
    icon: 'QuestionFilled',
    link: '/help',
    badge: null
  },
  {
    id: 8,
    name: '销量排行',
    icon: 'TrendCharts',
    link: '/rankings',
    badge: 'NEW'
  },
  {
    id: 9,
    name: '品牌专区',
    icon: 'Medal',
    link: '/brands',
    badge: null
  },
  {
    id: 10,
    name: '购物车',
    icon: 'ShoppingCart',
    link: '/cart',
    badge: null
  }
])

// 处理点击事件
const handleClick = (entry) => {
  if (entry.link) {
    router.push(entry.link)
  }
}
</script>

<style scoped>
.quick-entry {
  padding: var(--spacing-lg) 0;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  background-color: var(--bg-white);
  border: 1px solid transparent;
}

.entry-item:hover {
  background-color: var(--bg-light);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.entry-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  border-radius: 50%;
  color: var(--text-white);
  transition: transform var(--transition-fast);
}

.entry-item:hover .entry-icon {
  transform: scale(1.1);
}

.entry-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  text-align: center;
  line-height: var(--line-height-normal);
}

.entry-badge {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  background-color: var(--danger-color);
  color: var(--text-white);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  padding: 2px var(--spacing-xs);
  border-radius: var(--radius-sm);
  line-height: 1;
  transform: scale(0.9);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .entry-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}

@media (max-width: 992px) {
  .entry-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: var(--spacing-md);
  }
  
  .entry-icon {
    width: 50px;
    height: 50px;
  }
  
  .entry-text {
    font-size: var(--font-size-xs);
  }
}

@media (max-width: 768px) {
  .entry-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: var(--spacing-sm);
  }
  
  .entry-item {
    padding: var(--spacing-sm);
  }
  
  .entry-icon {
    width: 45px;
    height: 45px;
  }
}

@media (max-width: 480px) {
  .entry-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .entry-icon {
    width: 40px;
    height: 40px;
  }
  
  .entry-icon :deep(.el-icon) {
    font-size: 24px;
  }
}
</style>