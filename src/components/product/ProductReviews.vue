<template>
  <div class="product-reviews">
    <div class="reviews-header">
      <h3>商品评价</h3>
      <div class="review-stats">
        <div class="rating-summary">
          <div class="overall-rating">
            <span class="rating-score">{{ overallRating }}</span>
            <el-rate
              v-model="overallRating"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value} 分"
            />
          </div>
          <div class="rating-distribution">
            <div v-for="(count, star) in ratingDistribution" :key="star" class="rating-bar">
              <span class="star-label">{{ star }}星</span>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: (count / totalReviews * 100) + '%' }"
                ></div>
              </div>
              <span class="count">{{ count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="reviews-filter">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="全部评价" name="all"></el-tab-pane>
        <el-tab-pane label="好评" name="positive"></el-tab-pane>
        <el-tab-pane label="中评" name="neutral"></el-tab-pane>
        <el-tab-pane label="差评" name="negative"></el-tab-pane>
        <el-tab-pane label="有图" name="with-images"></el-tab-pane>
      </el-tabs>
    </div>

    <div class="reviews-list">
      <div v-for="review in filteredReviews" :key="review.id" class="review-item">
        <div class="review-header">
          <div class="user-info">
            <el-avatar :src="review.user.avatar" :alt="review.user.name">
              {{ review.user.name.charAt(0) }}
            </el-avatar>
            <div class="user-details">
              <span class="username">{{ maskUsername(review.user.name) }}</span>
              <span class="review-date">{{ formatDate(review.createdAt) }}</span>
            </div>
          </div>
          <el-rate v-model="review.rating" disabled size="small" />
        </div>
        
        <div class="review-content">
          <p class="review-text">{{ review.content }}</p>
          <div v-if="review.images && review.images.length > 0" class="review-images">
            <el-image
              v-for="(image, index) in review.images"
              :key="index"
              :src="image"
              :preview-src-list="review.images"
              class="review-image"
              fit="cover"
            />
          </div>
        </div>

        <div v-if="review.reply" class="merchant-reply">
          <div class="reply-header">
            <span class="reply-label">商家回复：</span>
            <span class="reply-date">{{ formatDate(review.reply.createdAt) }}</span>
          </div>
          <p class="reply-content">{{ review.reply.content }}</p>
        </div>

        <div class="review-actions">
          <el-button 
            text 
            :icon="review.isHelpful ? 'Check' : 'Plus'"
            @click="toggleHelpful(review)"
          >
            有用 ({{ review.helpfulCount }})
          </el-button>
        </div>
      </div>
    </div>

    <div v-if="filteredReviews.length === 0" class="no-reviews">
      <el-empty description="暂无评价" />
    </div>

    <div v-if="hasMore" class="load-more">
      <el-button @click="loadMoreReviews" :loading="loadingMore">
        加载更多评价
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  productId: {
    type: [String, Number],
    required: true
  }
})

// 响应式数据
const reviews = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const activeTab = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)

// 评分统计
const overallRating = ref(4.5)
const ratingDistribution = ref({
  5: 120,
  4: 80,
  3: 30,
  2: 10,
  1: 5
})

// 计算属性
const totalReviews = computed(() => {
  return Object.values(ratingDistribution.value).reduce((sum, count) => sum + count, 0)
})

const filteredReviews = computed(() => {
  switch (activeTab.value) {
    case 'positive':
      return reviews.value.filter(review => review.rating >= 4)
    case 'neutral':
      return reviews.value.filter(review => review.rating === 3)
    case 'negative':
      return reviews.value.filter(review => review.rating <= 2)
    case 'with-images':
      return reviews.value.filter(review => review.images && review.images.length > 0)
    default:
      return reviews.value
  }
})

// 方法
const loadReviews = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟评价数据
    const mockReviews = [
      {
        id: 1,
        user: {
          name: '张三',
          avatar: ''
        },
        rating: 5,
        content: '商品质量很好，物流速度快，包装精美，非常满意！',
        images: [],
        createdAt: new Date('2024-01-15'),
        helpfulCount: 12,
        isHelpful: false,
        reply: {
          content: '感谢您的好评，我们会继续努力提供优质的商品和服务！',
          createdAt: new Date('2024-01-16')
        }
      },
      {
        id: 2,
        user: {
          name: '李四',
          avatar: ''
        },
        rating: 4,
        content: '整体不错，性价比很高，就是颜色和图片有点差异。',
        images: [
          'https://via.placeholder.com/200x200/ff6b6b/ffffff?text=评价图1',
          'https://via.placeholder.com/200x200/4ecdc4/ffffff?text=评价图2'
        ],
        createdAt: new Date('2024-01-14'),
        helpfulCount: 8,
        isHelpful: false
      },
      {
        id: 3,
        user: {
          name: '王五',
          avatar: ''
        },
        rating: 5,
        content: '非常棒的商品，推荐购买！客服态度也很好。',
        images: [],
        createdAt: new Date('2024-01-13'),
        helpfulCount: 15,
        isHelpful: true
      }
    ]
    
    reviews.value = mockReviews
  } catch (error) {
    console.error('加载评价失败:', error)
  } finally {
    loading.value = false
  }
}

const loadMoreReviews = async () => {
  loadingMore.value = true
  try {
    // 模拟加载更多数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    hasMore.value = false // 模拟没有更多数据
  } catch (error) {
    console.error('加载更多评价失败:', error)
  } finally {
    loadingMore.value = false
  }
}

const handleTabClick = (tab) => {
  activeTab.value = tab.name
}

const toggleHelpful = (review) => {
  review.isHelpful = !review.isHelpful
  review.helpfulCount += review.isHelpful ? 1 : -1
}

const maskUsername = (username) => {
  if (username.length <= 2) return username
  return username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadReviews()
})
</script>

<style scoped>
.product-reviews {
  margin-top: 20px;
}

.reviews-header {
  margin-bottom: 20px;
}

.reviews-header h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: 600;
}

.review-stats {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.rating-summary {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.overall-rating {
  text-align: center;
}

.rating-score {
  display: block;
  font-size: 36px;
  font-weight: bold;
  color: #ff9900;
  margin-bottom: 10px;
}

.rating-distribution {
  flex: 1;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.star-label {
  width: 40px;
  font-size: 14px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #ff9900;
  transition: width 0.3s ease;
}

.count {
  width: 30px;
  text-align: right;
  font-size: 14px;
  color: #666;
}

.reviews-filter {
  margin-bottom: 20px;
}

.reviews-list {
  space-y: 20px;
}

.review-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-weight: 500;
  color: #333;
}

.review-date {
  font-size: 12px;
  color: #999;
}

.review-content {
  margin-bottom: 15px;
}

.review-text {
  margin: 0 0 15px 0;
  line-height: 1.6;
  color: #333;
}

.review-images {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.review-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  cursor: pointer;
}

.merchant-reply {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.reply-label {
  font-weight: 500;
  color: #e6a23c;
}

.reply-date {
  font-size: 12px;
  color: #999;
}

.reply-content {
  margin: 0;
  line-height: 1.6;
  color: #666;
}

.review-actions {
  display: flex;
  gap: 15px;
}

.no-reviews {
  text-align: center;
  padding: 40px 0;
}

.load-more {
  text-align: center;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .rating-summary {
    flex-direction: column;
    gap: 20px;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .review-images {
    gap: 8px;
  }
  
  .review-image {
    width: 60px;
    height: 60px;
  }
}
</style>