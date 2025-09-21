import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入用户store和认证工具
import { useUserStore } from './store/modules/user'
import { initAuth, startTokenCheck } from '@/utils/auth'

const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(pinia)
app.use(ElementPlus)

// 初始化认证状态
initAuth()

// 启动token检查
startTokenCheck()

// 初始化用户状态
const userStore = useUserStore()
userStore.initUserFromStorage()

app.mount('#app')
