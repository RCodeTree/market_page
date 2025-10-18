# 仿京东商城 - 前端项目

基于 Vue 3 + Vite 构建的现代化电商平台前端项目，采用 Composition API 和响应式设计，实现完整的电商购物体验。

## 项目概述

本项目是一个仿京东商城的毕业设计项目前端部分，采用前后端分离架构，致力于打造功能完整、用户体验优秀的电商平台。

### 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **语言**: JavaScript/TypeScript
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **UI组件**: Element Plus
- **样式**: CSS3 + Sass/Less
- **HTTP客户端**: Axios
- **包管理**: pnpm

### 项目特色

- 🚀 基于 Vue 3 Composition API，性能优异
- 📱 响应式设计，完美适配移动端和桌面端
- 🎨 现代化 UI 设计，用户体验优秀
- 🔐 完整的用户认证系统
- 🛒 完整的购物流程
- 📦 组件化开发，代码复用性高

## 项目状态

### ✅ 已完成功能

- **用户认证模块**
  - 用户注册功能（已完成并通过后端联调测试）
  - 用户登录功能（已完成并通过后端联调测试）
  - 登录状态管理
  - 表单验证（用户名、密码、确认密码）
  - 错误提示和用户反馈

### 🚧 开发中功能

- 商品展示模块
- 购物车功能
- 订单管理
- 用户中心
- 商品搜索

## 快速启动

### 环境要求

- Node.js 16+
- pnpm (推荐) 或 npm
- 现代浏览器

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 开发环境启动

```bash
# 启动开发服务器
pnpm dev

# 或使用 npm
npm run dev
```

访问 `http://localhost:5173` 查看项目

### 生产环境构建

```bash
# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

## 项目结构

```
src/
├── components/           # 公共组件
│   ├── common/          # 通用组件 (Header, Footer, Loading等)
│   ├── product/         # 商品相关组件
│   ├── user/            # 用户相关组件
│   └── cart/            # 购物车相关组件
├── views/               # 页面组件
│   ├── home/            # 首页
│   ├── product/         # 商品页面
│   ├── user/            # 用户中心
│   ├── cart/            # 购物车
│   └── order/           # 订单页面
├── router/              # 路由配置
├── store/               # Pinia状态管理
│   ├── modules/         # 模块化store
│   └── index.js         # store入口
├── api/                 # API接口
│   ├── user.js          # 用户相关API
│   ├── product.js       # 商品相关API
│   └── order.js         # 订单相关API
├── utils/               # 工具函数
│   ├── request.js       # HTTP请求封装
│   ├── auth.js          # 认证相关
│   └── common.js        # 通用工具
└── assets/              # 静态资源
    ├── images/          # 图片资源
    ├── styles/          # 样式文件
    └── icons/           # 图标资源
```

## 已实现功能详细说明

### 用户认证模块

#### 1. 用户注册
- **功能描述**: 新用户账号注册
- **实现位置**: `src/components/common/LoginModal.vue`
- **主要特性**:
  - 用户名验证（长度、格式检查）
  - 密码强度验证
  - 确认密码一致性验证
  - 实时表单验证反馈
  - 注册成功后自动登录

#### 2. 用户登录
- **功能描述**: 已注册用户登录
- **实现位置**: `src/components/common/LoginModal.vue`
- **主要特性**:
  - 用户名/密码登录
  - 登录状态持久化
  - JWT Token 管理
  - 自动跳转功能

#### 3. 状态管理
- **实现位置**: `src/store/modules/user.js`
- **主要功能**:
  - 用户信息存储
  - 登录状态管理
  - Token 自动刷新
  - 登出功能

### 前后端集成

#### API 配置
- **基础配置**: `src/utils/request.js`
- **后端地址**: `http://localhost:3000`
- **请求拦截**: 自动添加 Authorization 头
- **响应拦截**: 统一错误处理

#### 已测试接口
- ✅ `POST /api/auth/register` - 用户注册
- ✅ `POST /api/auth/login` - 用户登录
- ✅ `GET /api/auth/profile` - 获取用户信息

## 开发规范

### 代码风格
- 使用 Composition API 优先
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case
- 使用 `<script setup>` 语法
- CSS 使用 scoped 样式

### 组件开发规范
- 单一职责原则
- Props 类型定义
- 事件命名规范
- 插槽合理使用

### 状态管理规范
- 模块化 Store 设计
- 异步操作统一处理
- 状态持久化策略

## 调试和测试

### 开发调试
- Vue DevTools 支持
- 热重载开发体验
- 源码映射支持

### 测试验证
- 用户注册流程测试 ✅
- 用户登录流程测试 ✅
- 表单验证测试 ✅
- 前后端接口联调测试 ✅

## 部署说明

### 环境变量配置
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000

# .env.production
VITE_API_BASE_URL=https://your-api-domain.com
```

### 构建优化
- 代码分割
- 资源压缩
- 缓存策略

## 下一步开发计划

### 短期目标
- [ ] 商品列表页面
- [ ] 商品详情页面
- [ ] 购物车功能
- [ ] 用户中心完善

### 中期目标
- [ ] 订单管理系统
- [ ] 支付集成
- [ ] 商品搜索功能
- [ ] 商品分类导航

### 长期目标
- [ ] 移动端优化
- [ ] 性能优化
- [ ] SEO 优化
- [ ] 国际化支持

## 常见问题

### Q: 如何解决跨域问题？
A: 在 `vite.config.js` 中配置代理，或确保后端正确设置 CORS。

### Q: 登录后刷新页面丢失状态？
A: 检查 Token 持久化存储和自动登录逻辑。

### Q: 开发服务器启动失败？
A: 检查端口占用，确保 Node.js 版本符合要求。

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 发起 Pull Request

## 推荐 IDE 配置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (禁用 Vetur)

### 推荐插件
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier

## 更多配置

参考 [Vite 配置文档](https://vite.dev/config/)

---

**项目负责人**: [不会敲代码的阿_rong]  
**创建时间**: 2024年  
**最后更新**: 2025年
