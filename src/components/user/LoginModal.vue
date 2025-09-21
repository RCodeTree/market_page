<template>
  <el-dialog
    v-model="userStore.showLoginModal"
    :title="isLogin ? '登录' : '注册'"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="login-modal"
  >
    <div class="modal-content">
      <!-- 登录表单 -->
      <el-form
        v-if="isLogin"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0"
        class="login-form"
      >
        <div class="form-header">
          <h3 class="form-title">欢迎登录宁北商城</h3>
          <p class="form-subtitle">请输入您的账号和密码</p>
        </div>

        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名/手机号/邮箱"
            size="large"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <a href="#" class="forgot-link">忘记密码？</a>
        </div>

        <el-button
          type="primary"
          size="large"
          class="submit-btn"
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </el-button>

        <div class="form-footer">
          <span>还没有账号？</span>
          <a href="#" @click="switchMode">立即注册</a>
        </div>
      </el-form>

      <!-- 注册表单 -->
      <el-form
        v-else
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="0"
        class="register-form"
      >
        <div class="form-header">
          <h3 class="form-title">注册宁北商城</h3>
          <p class="form-subtitle">创建您的专属账号</p>
        </div>

        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            size="large"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱"
            size="large"
            :prefix-icon="Message"
            clearable
          />
        </el-form-item>

        <el-form-item prop="phone">
          <el-input
            v-model="registerForm.phone"
            placeholder="请输入手机号"
            size="large"
            :prefix-icon="Phone"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请确认密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="registerForm.agree">
            我已阅读并同意
            <a href="#" class="agreement-link">《用户协议》</a>
            和
            <a href="#" class="agreement-link">《隐私政策》</a>
          </el-checkbox>
        </div>

        <el-button
          type="primary"
          size="large"
          class="submit-btn"
          :loading="loading"
          :disabled="!registerForm.agree"
          @click="handleRegister"
        >
          注册
        </el-button>

        <div class="form-footer">
          <span>已有账号？</span>
          <a href="#" @click="switchMode">立即登录</a>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Lock, Message, Phone } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const isLogin = ref(true)
const loading = ref(false)
const loginFormRef = ref()
const registerFormRef = ref()

// 登录表单
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 注册表单
const registerForm = reactive({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agree: false
})

// 登录表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 注册表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 切换登录/注册模式
const switchMode = () => {
  isLogin.value = !isLogin.value
  resetForms()
}

// 重置表单
const resetForms = () => {
  Object.assign(loginForm, {
    username: '',
    password: '',
    remember: false
  })
  Object.assign(registerForm, {
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false
  })
  loginFormRef.value?.clearValidate()
  registerFormRef.value?.clearValidate()
}

// 处理登录
const handleLogin = async () => {
  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return

    loading.value = true
    
    const success = await userStore.login({
      username: loginForm.username,
      password: loginForm.password,
      remember: loginForm.remember
    })

    if (success) {
      ElMessage.success('登录成功')
      userStore.showLoginModal = false
      
      // 如果有重定向路径，跳转到目标页面
      if (userStore.redirectPath) {
        router.push(userStore.redirectPath)
        userStore.redirectPath = ''
      }
      
      resetForms()
    }
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  try {
    const valid = await registerFormRef.value.validate()
    if (!valid) return

    loading.value = true
    
    const success = await userStore.register({
      username: registerForm.username,
      email: registerForm.email,
      phone: registerForm.phone,
      password: registerForm.password
    })

    if (success) {
      ElMessage.success('注册成功，请登录')
      isLogin.value = true
      resetForms()
    }
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听模态框关闭，重置表单
watch(() => userStore.showLoginModal, (newVal) => {
  if (!newVal) {
    resetForms()
    isLogin.value = true
  }
})
</script>

<style scoped>
.login-modal :deep(.el-dialog) {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.login-modal :deep(.el-dialog__header) {
  padding: 0;
  margin: 0;
}

.login-modal :deep(.el-dialog__body) {
  padding: 0;
}

.modal-content {
  padding: var(--spacing-xl);
}

.form-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.form-title {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.form-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

.login-form,
.register-form {
  width: 100%;
}

.login-form :deep(.el-form-item),
.register-form :deep(.el-form-item) {
  margin-bottom: var(--spacing-lg);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  font-size: var(--font-size-sm);
}

.forgot-link,
.agreement-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.forgot-link:hover,
.agreement-link:hover {
  color: var(--primary-hover);
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-lg);
}

.form-footer {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.form-footer a {
  color: var(--primary-color);
  text-decoration: none;
  margin-left: var(--spacing-xs);
  transition: color var(--transition-fast);
}

.form-footer a:hover {
  color: var(--primary-hover);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-modal :deep(.el-dialog) {
    width: 90% !important;
    margin: 5vh auto;
  }
  
  .modal-content {
    padding: var(--spacing-lg);
  }
  
  .form-title {
    font-size: var(--font-size-xl);
  }
}
</style>