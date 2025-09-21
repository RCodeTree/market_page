<template>
  <footer class="app-footer">
    <div class="footer-main">
      <div class="container">
        <div class="footer-content">
          <!-- 服务支持 -->
          <div class="footer-section">
            <h3 class="section-title">服务支持</h3>
            <ul class="section-links">
              <li><a href="#">售后政策</a></li>
              <li><a href="#">自助服务</a></li>
              <li><a href="#">相关下载</a></li>
              <li><a href="#">维修服务</a></li>
            </ul>
          </div>

          <!-- 购物指南 -->
          <div class="footer-section">
            <h3 class="section-title">购物指南</h3>
            <ul class="section-links">
              <li><a href="#">购物流程</a></li>
              <li><a href="#">会员介绍</a></li>
              <li><a href="#">生活旅行</a></li>
              <li><a href="#">常见问题</a></li>
            </ul>
          </div>

          <!-- 配送方式 -->
          <div class="footer-section">
            <h3 class="section-title">配送方式</h3>
            <ul class="section-links">
              <li><a href="#">上门自提</a></li>
              <li><a href="#">211限时达</a></li>
              <li><a href="#">配送服务查询</a></li>
              <li><a href="#">配送费收取标准</a></li>
            </ul>
          </div>

          <!-- 支付方式 -->
          <div class="footer-section">
            <h3 class="section-title">支付方式</h3>
            <ul class="section-links">
              <li><a href="#">货到付款</a></li>
              <li><a href="#">在线支付</a></li>
              <li><a href="#">分期付款</a></li>
              <li><a href="#">邮局汇款</a></li>
            </ul>
          </div>

          <!-- 售后服务 -->
          <div class="footer-section">
            <h3 class="section-title">售后服务</h3>
            <ul class="section-links">
              <li><a href="#">售后政策</a></li>
              <li><a href="#">价格保护</a></li>
              <li><a href="#">退款说明</a></li>
              <li><a href="#">返修/退换货</a></li>
            </ul>
          </div>

          <!-- 特色服务 -->
          <div class="footer-section">
            <h3 class="section-title">特色服务</h3>
            <ul class="section-links">
              <li><a href="#">夺宝岛</a></li>
              <li><a href="#">DIY装机</a></li>
              <li><a href="#">延保服务</a></li>
              <li><a href="#">宁北E卡</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="footer-bottom">
      <div class="container">
        <div class="bottom-content">
          <!-- 公司信息 -->
          <div class="company-info">
            <div class="company-logo">
              <img src="@/assets/logo.svg" alt="宁北商城" class="logo" />
              <span class="company-name">宁北商城</span>
            </div>
            <p class="company-desc">
              宁北商城 - 专业的综合网上购物商城，销售家电、数码通讯、电脑、家居百货、服装服饰、母婴、图书、食品等数万个品牌优质商品。
            </p>
          </div>

          <!-- 联系方式 -->
          <div class="contact-info">
            <h4 class="contact-title">联系我们</h4>
            <div class="contact-item">
              <el-icon><Phone /></el-icon>
              <span>客服热线：400-618-4000</span>
            </div>
            <div class="contact-item">
              <el-icon><Message /></el-icon>
              <span>在线客服：7×24小时</span>
            </div>
            <div class="contact-item">
              <el-icon><Location /></el-icon>
              <span>公司地址：北京市朝阳区宁北大厦</span>
            </div>
          </div>

          <!-- 二维码 -->
          <div class="qr-codes">
            <div class="qr-item">
              <div class="qr-placeholder">
                <el-icon size="40"><Cellphone /></el-icon>
              </div>
              <span class="qr-text">手机宁北</span>
            </div>
            <div class="qr-item">
              <div class="qr-placeholder">
                <el-icon size="40"><ChatDotRound /></el-icon>
              </div>
              <span class="qr-text">微信公众号</span>
            </div>
          </div>
        </div>

        <!-- 版权信息 -->
        <div class="copyright">
          <div class="copyright-links">
            <a href="#">关于我们</a>
            <span class="divider">|</span>
            <a href="#">联系我们</a>
            <span class="divider">|</span>
            <a href="#">人才招聘</a>
            <span class="divider">|</span>
            <a href="#">商家入驻</a>
            <span class="divider">|</span>
            <a href="#">广告服务</a>
            <span class="divider">|</span>
            <a href="#">手机宁北</a>
            <span class="divider">|</span>
            <a href="#">友情链接</a>
            <span class="divider">|</span>
            <a href="#">销售联盟</a>
          </div>
          <div class="copyright-text">
            <p>Copyright © 2024 宁北商城 版权所有 | 京ICP备12345678号 | 京公网安备12345678901234号</p>
            <p>违法和不良信息举报电话：400-618-4000 | 举报邮箱：jubao@ningbei.com</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { 
  Phone, 
  Message, 
  Location, 
  Cellphone, 
  ChatDotRound 
} from '@element-plus/icons-vue'
</script>

<style scoped>
.app-footer {
  background-color: var(--bg-dark);
  color: var(--text-white);
  margin-top: auto;
}

.footer-main {
  padding: var(--spacing-xxl) 0 var(--spacing-xl);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--spacing-xl);
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-md);
  color: var(--text-white);
}

.section-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.section-links li {
  margin-bottom: var(--spacing-sm);
}

.section-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.section-links a:hover {
  color: var(--text-white);
}

.footer-bottom {
  background-color: rgba(0, 0, 0, 0.2);
  padding: var(--spacing-xl) 0;
}

.bottom-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.company-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.company-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo {
  width: 32px;
  height: 32px;
}

.company-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.company-desc {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-loose);
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.contact-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-white);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.8);
}

.qr-codes {
  display: flex;
  gap: var(--spacing-lg);
}

.qr-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.qr-placeholder {
  width: 80px;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-base);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
}

.qr-text {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.8);
}

.copyright {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: var(--spacing-lg);
  text-align: center;
}

.copyright-links {
  margin-bottom: var(--spacing-md);
}

.copyright-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.copyright-links a:hover {
  color: var(--text-white);
}

.divider {
  margin: 0 var(--spacing-sm);
  color: rgba(255, 255, 255, 0.4);
}

.copyright-text {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.6);
  line-height: var(--line-height-loose);
}

.copyright-text p {
  margin: var(--spacing-xs) 0;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .bottom-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .qr-codes {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .footer-main {
    padding: var(--spacing-xl) 0;
  }
  
  .copyright-links {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .divider {
    display: none;
  }
}
</style>