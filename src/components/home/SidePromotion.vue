<template>
  <div class="side-promotion">
    <div
      v-for="promotion in promotions"
      :key="promotion.id"
      class="promotion-item"
      @click="handleClick(promotion)"
    >
      <div class="promotion-image">
        <img :src="promotion.image" :alt="promotion.title" />
        <div class="promotion-overlay">
          <div class="promotion-content">
            <h4 class="promotion-title">{{ promotion.title }}</h4>
            <p class="promotion-desc">{{ promotion.description }}</p>
            <div class="promotion-action">
              <span class="action-text">{{ promotion.actionText }}</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
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

// 推广数据
const promotions = reactive([
  {
    id: 1,
    title: '会员专享',
    description: '开通会员享受更多优惠',
    actionText: '立即开通',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=180&fit=crop',
    link: '/membership',
    type: 'membership'
  },
  {
    id: 2,
    title: '每日签到',
    description: '签到领积分，兑换好礼',
    actionText: '去签到',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=180&fit=crop',
    link: '/checkin',
    type: 'checkin'
  }
])

// 处理点击事件
const handleClick = (promotion) => {
  if (promotion.link) {
    router.push(promotion.link)
  }
}
</script>

<style scoped>
.side-promotion {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.promotion-item {
  flex: 1;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.promotion-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.promotion-image {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 180px;
}

.promotion-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.promotion-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.promotion-content {
  text-align: center;
  color: #ffffff;
}

.promotion-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.promotion-desc {
  font-size: 14px;
  margin: 0 0 16px 0;
  opacity: 0.9;
  line-height: 1.5;
}

.promotion-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #faad14;
}

.action-text {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .side-promotion {
    flex-direction: row;
    height: auto;
    gap: 12px;
  }
  
  .promotion-item {
    flex: 1;
    min-height: 180px;
    border-radius: 4px;
  }
  
  .promotion-image {
    min-height: 180px;
  }
  
  .promotion-title {
    font-size: 16px;
  }
  
  .promotion-desc {
    font-size: 13px;
    margin-bottom: 12px;
  }
  
  .promotion-action {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .side-promotion {
    gap: 10px;
  }
  
  .promotion-item {
    min-height: 150px;
    border-radius: 4px;
  }
  
  .promotion-image {
    min-height: 150px;
  }
  
  .promotion-title {
    font-size: 15px;
    margin-bottom: 6px;
  }
  
  .promotion-desc {
    font-size: 12px;
    margin-bottom: 10px;
  }
  
  .promotion-action {
    font-size: 12px;
    gap: 3px;
  }
  
  .promotion-overlay {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .side-promotion {
    flex-direction: column;
    gap: 8px;
  }
  
  .promotion-item {
    min-height: 120px;
    border-radius: 4px;
  }
  
  .promotion-image {
    min-height: 120px;
  }
  
  .promotion-title {
    font-size: 14px;
    margin-bottom: 5px;
  }
  
  .promotion-desc {
    font-size: 11px;
    margin-bottom: 8px;
  }
  
  .promotion-action {
    font-size: 11px;
    gap: 2px;
  }
  
  .promotion-overlay {
    padding: 10px;
  }
}

@media (max-width: 360px) {
  .side-promotion {
    gap: 6px;
  }
  
  .promotion-item {
    min-height: 100px;
  }
  
  .promotion-image {
    min-height: 100px;
  }
  
  .promotion-title {
    font-size: 13px;
    margin-bottom: 4px;
  }
  
  .promotion-desc {
    font-size: 10px;
    margin-bottom: 6px;
  }
  
  .promotion-action {
    font-size: 10px;
  }
  
  .promotion-overlay {
    padding: 8px;
  }
}
</style>