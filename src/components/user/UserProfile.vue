<template>
  <div class="user-profile">
    <div class="profile-header">
      <h3 class="section-title">个人资料</h3>
      <p class="section-subtitle">管理您的个人信息</p>
    </div>

    <el-form
      ref="profileFormRef"
      :model="profileForm"
      :rules="profileRules"
      label-width="100px"
      class="profile-form"
    >
      <div class="form-section">
        <h4 class="form-section-title">基本信息</h4>
        
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="profileForm.username"
            placeholder="请输入用户名"
            :disabled="true"
          >
            <template #suffix>
              <el-tooltip content="用户名不可修改" placement="top">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="profileForm.nickname"
            placeholder="请输入昵称"
            clearable
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="profileForm.email"
            placeholder="请输入邮箱"
            clearable
          >
            <template #suffix>
              <el-tag 
                v-if="profileForm.emailVerified" 
                type="success" 
                size="small"
              >
                已验证
              </el-tag>
              <el-tag 
                v-else 
                type="warning" 
                size="small"
              >
                未验证
              </el-tag>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="profileForm.phone"
            placeholder="请输入手机号"
            clearable
          >
            <template #suffix>
              <el-tag 
                v-if="profileForm.phoneVerified" 
                type="success" 
                size="small"
              >
                已验证
              </el-tag>
              <el-tag 
                v-else 
                type="warning" 
                size="small"
              >
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
          <el-date-picker
            v-model="profileForm.birthday"
            type="date"
            placeholder="请选择生日"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
          />
        </el-form-item>
      </div>

      <div class="form-section">
        <h4 class="form-section-title">详细信息</h4>
        
        <el-form-item label="所在地区" prop="location">
          <el-cascader
            v-model="profileForm.location"
            :options="locationOptions"
            placeholder="请选择所在地区"
            clearable
          />
        </el-form-item>

        <el-form-item label="个人简介" prop="bio">
          <el-input
            v-model="profileForm.bio"
            type="textarea"
            :rows="4"
            placeholder="介绍一下自己吧..."
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="兴趣标签" prop="interests">
          <div class="interests-section">
            <el-tag
              v-for="tag in profileForm.interests"
              :key="tag"
              closable
              @close="removeInterest(tag)"
              class="interest-tag"
            >
              {{ tag }}
            </el-tag>
            
            <el-input
              v-if="inputVisible"
              ref="inputRef"
              v-model="inputValue"
              size="small"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
              class="interest-input"
            />
            
            <el-button
              v-else
              size="small"
              @click="showInput"
              class="add-interest-btn"
            >
              <el-icon><Plus /></el-icon>
              添加兴趣
            </el-button>
          </div>
        </el-form-item>
      </div>

      <div class="form-actions">
        <el-button @click="resetForm">重置</el-button>
        <el-button 
          type="primary" 
          :loading="loading"
          @click="handleSubmit"
        >
          保存修改
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled, Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const profileFormRef = ref()
const inputRef = ref()
const loading = ref(false)
const inputVisible = ref(false)
const inputValue = ref('')

// 表单数据
const profileForm = reactive({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  gender: '',
  birthday: '',
  location: [],
  bio: '',
  interests: [],
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
  bio: [
    { max: 200, message: '个人简介不能超过200个字符', trigger: 'blur' }
  ]
}

// 地区选项（示例数据）
const locationOptions = [
  {
    value: 'beijing',
    label: '北京',
    children: [
      { value: 'haidian', label: '海淀区' },
      { value: 'chaoyang', label: '朝阳区' },
      { value: 'dongcheng', label: '东城区' },
      { value: 'xicheng', label: '西城区' }
    ]
  },
  {
    value: 'shanghai',
    label: '上海',
    children: [
      { value: 'huangpu', label: '黄浦区' },
      { value: 'xuhui', label: '徐汇区' },
      { value: 'changning', label: '长宁区' },
      { value: 'jingan', label: '静安区' }
    ]
  },
  {
    value: 'guangzhou',
    label: '广州',
    children: [
      { value: 'tianhe', label: '天河区' },
      { value: 'yuexiu', label: '越秀区' },
      { value: 'haizhu', label: '海珠区' },
      { value: 'liwan', label: '荔湾区' }
    ]
  }
]

// 禁用未来日期
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}

// 移除兴趣标签
const removeInterest = (tag) => {
  const index = profileForm.interests.indexOf(tag)
  if (index > -1) {
    profileForm.interests.splice(index, 1)
  }
}

// 显示输入框
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// 确认输入
const handleInputConfirm = () => {
  if (inputValue.value) {
    if (!profileForm.interests.includes(inputValue.value)) {
      profileForm.interests.push(inputValue.value)
    }
  }
  inputVisible.value = false
  inputValue.value = ''
}

// 重置表单
const resetForm = () => {
  profileFormRef.value?.resetFields()
  loadUserProfile()
}

// 提交表单
const handleSubmit = async () => {
  try {
    const valid = await profileFormRef.value.validate()
    if (!valid) return

    loading.value = true
    
    const success = await userStore.updateUserInfo(profileForm)
    if (success) {
      ElMessage.success('个人资料更新成功')
    }
  } catch (error) {
    console.error('更新个人资料失败:', error)
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
        location: userInfo.location || [],
        bio: userInfo.bio || '',
        interests: userInfo.interests || [],
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
  max-width: 800px;
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