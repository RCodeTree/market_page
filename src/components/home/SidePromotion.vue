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
            <p class="promotion-desc" v-if="!isMobile || promotion.showDescOnMobile">{{ promotion.description }}</p>
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
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const isMobile = ref(false)

// 推广数据
const promotions = reactive([
  {
    id: 1,
    title: '会员专享',
    description: '开通会员享受更多优惠',
    showDescOnMobile: true,
    actionText: '立即开通',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=180&fit=crop',
    link: '/membership',
    type: 'membership'
  },
  {
    id: 2,
    title: '每日签到',
    description: '签到领积分，兑换好礼',
    showDescOnMobile: false,
    actionText: '去签到',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=180&fit=crop',
    link: '/checkin',
    type: 'checkin'
  }
])

// 检测屏幕尺寸
const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
}

// 处理点击事件
const handleClick = (promotion) => {
  if (promotion.link) {
    router.push(promotion.link)
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
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
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.promotion-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.promotion-item:active {
  transform: translateY(0);
  transition: transform 0.1s ease;
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
  transition: transform 0.3s ease;
}

.promotion-item:hover .promotion-image img {
  transform: scale(1.05);
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
  transition: background 0.3s ease;
}

.promotion-item:hover .promotion-overlay {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

.promotion-content {
  text-align: center;
  color: #ffffff;
  width: 100%;
}

.promotion-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  line-height: 1.3;
}

.promotion-desc {
  font-size: 14px;
  margin: 0 0 16px 0;
  opacity: 0.9;
  line-height: 1.5;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.promotion-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #faad14;
  transition: all 0.3s ease;
}

.promotion-item:hover .promotion-action {
  color: #ffc53d;
  transform: translateX(2px);
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
    flex-direction: row;
    gap: 10px;
    height: auto;
  }
  
  .promotion-item {
    min-height: 120px;
    border-radius: 4px;
  }
  
  .promotion-image {
    min-height: 120px;
  }
  
  .promotion-overlay {
    padding: 12px;
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
}

@media (max-width: 480px) {
  .side-promotion {
    flex-direction: row;
    gap: 8px;
    height: auto;
  }
  
  .promotion-item {
    min-height: 100px;
    border-radius: 4px;
  }
  
  .promotion-image {
    min-height: 100px;
  }
  
  .promotion-overlay {
    padding: 10px;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.4) 50%,
      rgba(0, 0, 0, 0.1) 100%
    );
    align-items: flex-end;
  }
  
  .promotion-content {
    text-align: left;
    width: 100%;
  }
  
  .promotion-title {
    font-size: 14px;
    margin-bottom: 4px;
    font-weight: 500;
  }
  
  .promotion-desc {
    font-size: 11px;
    margin-bottom: 8px;
    opacity: 0.95;
  }
  
  .promotion-action {
    font-size: 11px;
    gap: 2px;
    justify-content: flex-start;
  }
}

@media (max-width: 360px) {
  .side-promotion {
    gap: 6px;
  }
  
  .promotion-item {
    min-height: 80px;
  }
  
  .promotion-image {
    min-height: 80px;
  }
  
  .promotion-overlay {
    padding: 8px;
  }
  
  .promotion-title {
    font-size: 13px;
    margin-bottom: 3px;
  }
  
  .promotion-desc {
    font-size: 10px;
    margin-bottom: 6px;
  }
  
  .promotion-action {
    font-size: 10px;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .promotion-item {
    -webkit-tap-highlight-color: rgba(226, 62, 62, 0.2);
  }
  
  .promotion-item:hover {
    transform: none;
  }
  
  .promotion-item:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
  
  .promotion-item:hover .promotion-image img {
    transform: none;
  }
  
  .promotion-item:hover .promotion-overlay {
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
  }
  
  .promotion-item:hover .promotion-action {
    color: #faad14;
    transform: none;
  }
}

/* 高分辨率屏幕优化 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .promotion-title {
    text-rendering: optimizeLegibility;
  }
  
  .promotion-desc {
    text-rendering: optimizeLegibility;
  }
}

/* 减少动画效果在低性能设备上 */
@media (prefers-reduced-motion: reduce) {
  .promotion-item {
    transition: none;
  }
  
  .promotion-image img {
    transition: none;
  }
  
  .promotion-overlay {
    transition: none;
  }
  
  .promotion-action {
    transition: none;
  }
  
  .promotion-item:hover {
    transform: none;
  }
  
  .promotion-item:hover .promotion-image img {
    transform: none;
  }
  
  .promotion-item:hover .promotion-action {
    transform: none;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .promotion-overlay {
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.5) 100%
    );
  }
  
  .promotion-item:hover .promotion-overlay {
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(0, 0, 0, 0.6) 100%
    );
  }
}
</style>