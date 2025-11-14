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

      <div class="form-section">
        <h4 class="form-section-title">详细信息</h4>

        <el-form-item label="所在地区" prop="location">
          <el-cascader v-model="profileForm.location" :options="locationOptions" placeholder="请选择所在地区" clearable />
        </el-form-item>

        <el-form-item label="个人简介" prop="bio">
          <el-input v-model="profileForm.bio" type="textarea" :rows="4" placeholder="介绍一下自己吧..." maxlength="200"
            show-word-limit />
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
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { userApi } from '@/api/user'

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
  location: [],
  bio: '',

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
  },
  {
    value: 'guangxi',
    label: '广西',
    children: [
      { value: 'nanning', label: '南宁' },
      { value: 'liuzhou', label: '柳州' },
      { value: 'guilin', label: '桂林' },
      { value: 'wuzhou', label: '梧州' },
      { value: 'beihai', label: '北海' },
      { value: 'fangchenggang', label: '防城港' },
      { value: 'qinzhou', label: '钦州' },
      { value: 'guigang', label: '贵港' },
      { value: 'yulin', label: '玉林' },
      { value: 'baise', label: '百色' },
      { value: 'hechi', label: '河池' },
      { value: 'laibin', label: '来宾' },
      { value: 'chongzuo', label: '崇左' }
    ]
  }
]

// 禁用未来日期
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}

// 加载默认地址并填充所在地区
const loadDefaultAddress = async () => {
  if (!userStore.isLoggedIn) return
  try {
    const res = await userApi.getAddresses()
    const list = res?.data || []
    const def = list.find(a => a.is_default) || list[0]
    if (def) {
      profileForm.location = [
        (def.province || '').toLowerCase(),
        (def.city || '').toLowerCase()
      ].filter(Boolean)
    }
  } catch (e) {
    // ignore
  }
}

// 同步所在地区到默认地址（若不存在则创建默认地址）
const syncLocationToAddress = async () => {
  if (!userStore.isLoggedIn) return
  const loc = profileForm.location || []
  if (!Array.isArray(loc) || loc.length < 1) return
  const provinceMap = {
    beijing: '北京', shanghai: '上海', guangzhou: '广州', guangxi: '广西'
  }
  const cityMap = {
    haidian: '海淀区', chaoyang: '朝阳区', dongcheng: '东城区', xicheng: '西城区',
    huangpu: '黄浦区', xuhui: '徐汇区', changning: '长宁区', jingan: '静安区',
    tianhe: '天河区', yuexiu: '越秀区', haizhu: '海珠区', liwan: '荔湾区',
    nanning: '南宁', liuzhou: '柳州', guilin: '桂林', wuzhou: '梧州', beihai: '北海',
    fangchenggang: '防城港', qinzhou: '钦州', guigang: '贵港', yulin: '玉林',
    baise: '百色', hechi: '河池', laibin: '来宾', chongzuo: '崇左'
  }
  const provinceKey = loc[0]
  const cityKey = loc[1]
  const province = provinceMap[provinceKey] || provinceKey
  const city = cityMap[cityKey] || cityKey || province
  const district = city

  const res = await userApi.getAddresses()
  const list = res?.data || []
  const def = list.find(a => a.is_default) || null
  if (def) {
    await userApi.updateAddress(def.id, { province, city, district })
  } else {
    const user = userStore.userInfo || {}
    const receiver_name = user.nickname || user.username || '收货人'
    const receiver_phone = user.phone || '13800000000'
    await userApi.addAddress({
      receiver_name,
      receiver_phone,
      province,
      city,
      district,
      detail_address: '默认地址（请完善详细地址）',
      postal_code: '',
      address_tag: 'home',
      is_default: true
    })
  }
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
      await syncLocationToAddress()
      await loadDefaultAddress()
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
        location: userInfo.location || [],
        bio: userInfo.bio || '',

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
  loadDefaultAddress()
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