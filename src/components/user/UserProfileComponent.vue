<template>
  <div class="user-profile">
    <div class="profile-header">
      <h3 class="section-title">个人资料</h3>
      <p class="section-subtitle">管理您的个人信息</p>
    </div>

    <el-form ref="profileFormRef" :model="profileForm" :rules="profileRules" label-width="100px" class="profile-form">
      <div class="form-section">
        <h4 class="form-section-title">基本信息</h4>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="profileForm.username" placeholder="请输入用户名" :disabled="true">
            <template #suffix>
              <el-tooltip content="用户名不可修改" placement="top">
                <el-icon>
                  <InfoFilled />
                </el-icon>
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="profileForm.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="profileForm.email" placeholder="请输入邮箱" clearable>
            <template #suffix>
              <el-tag v-if="profileForm.emailVerified" type="success" size="small">
                已验证
              </el-tag>
              <el-tag v-else type="warning" size="small">
                未验证
              </el-tag>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="profileForm.phone" placeholder="请输入手机号" clearable>
            <template #suffix>
              <el-tag v-if="profileForm.phoneVerified" type="success" size="small">
                已验证
              </el-tag>
              <el-tag v-else type="warning" size="small">
                未验证
              </el-tag>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="profileForm.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
            <el-radio label="other">其他</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="生日" prop="birthday">
          <el-date-picker v-model="profileForm.birthday" type="date" placeholder="请选择生日" format="YYYY-MM-DD"
            value-format="YYYY-MM-DD" :disabled-date="disabledDate" />
        </el-form-item>
      </div>

      

      <div class="form-actions">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          保存修改
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const profileFormRef = ref()
const loading = ref(false)

// 表单数据
const profileForm = reactive({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  gender: '',
  birthday: '',
  

  emailVerified: false,
  phoneVerified: false
})

// 表单验证规则
const profileRules = {
  nickname: [
    { max: 20, message: '昵称长度不能超过20个字符', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
}

 

// 禁用未来日期
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}

 

// 兴趣标签已移除

// 重置表单
const resetForm = () => {
  profileFormRef.value?.resetFields()
  loadUserProfile()
}

// 提交表单
const handleSubmit = async () => {
  const valid = await profileFormRef.value.validate().then(() => true).catch(() => false)
  if (!valid) {
    ElMessage.error('请检查表单填写')
    return
  }

  loading.value = true
  try {
    const success = await userStore.updateUserInfo(profileForm)
    if (success) {
      ElMessage.success('个人资料更新成功')
    } else {
      ElMessage.error('更新失败')
    }
  } finally {
    loading.value = false
  }
}

// 加载用户资料
const loadUserProfile = async () => {
  try {
    // 从store获取用户信息
    const userInfo = userStore.userInfo
    if (userInfo) {
      Object.assign(profileForm, {
        username: userInfo.username || '',
        nickname: userInfo.nickname || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        gender: userInfo.gender || '',
        birthday: userInfo.birthday || '',
        

        emailVerified: userInfo.emailVerified || false,
        phoneVerified: userInfo.phoneVerified || false
      })
    }
  } catch (error) {
    console.error('加载用户资料失败:', error)
    ElMessage.error('加载用户资料失败')
  }
}

onMounted(() => {
  loadUserProfile()
})
</script>

<style scoped>
.user-profile {
  width: 100%;
  max-width: none;
}

.profile-header {
  margin-bottom: var(--spacing-xl);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.section-subtitle {
  color: var(--text-secondary);
  margin: 0;
}

.profile-form {
  background: var(--bg-secondary);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  width: 100%;
}

.form-section {
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--border-color);
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-lg) 0;
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--primary-color);
  display: inline-block;
}

.profile-form :deep(.el-form-item) {
  margin-bottom: var(--spacing-lg);
}

.profile-form :deep(.el-form-item__label) {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.interests-section {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  align-items: center;
}

.interest-tag {
  margin: 0;
}

.interest-input {
  width: 120px;
}

.add-interest-btn {
  border-style: dashed;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--border-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-form {
    padding: var(--spacing-lg);
  }

  .profile-form :deep(.el-form-item__label) {
    width: 80px !important;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .el-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .profile-form {
    padding: var(--spacing-md);
  }

  .profile-form :deep(.el-form-item) {
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-form :deep(.el-form-item__label) {
    width: 100% !important;
    margin-bottom: var(--spacing-xs);
  }

  .profile-form :deep(.el-form-item__content) {
    width: 100%;
    margin-left: 0 !important;
  }
}
</style>