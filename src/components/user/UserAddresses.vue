<template>
  <div class="user-addresses">
    <div class="header">
      <h3 class="section-title">收货地址</h3>
      <el-button type="primary" @click="openAdd">新增地址</el-button>
    </div>

    <el-table :data="addresses" style="width: 100%" v-loading="loading">
      <el-table-column prop="receiver_name" label="收货人" width="120" />
      <el-table-column prop="receiver_phone" label="电话" width="140" />
      <el-table-column label="地区/详细地址">
        <template #default="{ row }">
          <span>{{ row.province }}{{ row.city }}{{ row.district }} {{ row.detail_address }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address_tag" label="标签" width="100" />
      <el-table-column label="默认" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.is_default" type="success" size="small">默认</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="warning" @click="setDefault(row)" :disabled="row.is_default">设为默认</el-button>
          <el-button link type="danger" @click="deleteAddress(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑地址' : '新增地址'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="收货人" prop="receiver_name">
          <el-input v-model="form.receiver_name" />
        </el-form-item>
        <el-form-item label="电话" prop="receiver_phone">
          <el-input v-model="form.receiver_phone" />
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-input v-model="form.province" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="form.city" />
        </el-form-item>
        <el-form-item label="区县" prop="district">
          <el-input v-model="form.district" />
        </el-form-item>
        <el-form-item label="详细地址" prop="detail_address">
          <el-input v-model="form.detail_address" />
        </el-form-item>
        <el-form-item label="邮编" prop="postal_code">
          <el-input v-model="form.postal_code" />
        </el-form-item>
        <el-form-item label="标签" prop="address_tag">
          <el-input v-model="form.address_tag" placeholder="如：家、公司" />
        </el-form-item>
        <el-form-item label="设为默认" prop="is_default">
          <el-switch v-model="form.is_default" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="saving" @click="save">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userApi } from '@/api/user'

const loading = ref(false)
const addresses = ref([])

const dialogVisible = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const formRef = ref()
const form = reactive({
  id: null,
  receiver_name: '',
  receiver_phone: '',
  province: '',
  city: '',
  district: '',
  detail_address: '',
  postal_code: '',
  address_tag: '',
  is_default: false
})

const rules = {
  receiver_name: [{ required: true, message: '请输入收货人', trigger: 'blur' }],
  receiver_phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
  province: [{ required: true, message: '请输入省份', trigger: 'blur' }],
  city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
  district: [{ required: true, message: '请输入区县', trigger: 'blur' }],
  detail_address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await userApi.getAddresses()
    addresses.value = res?.data || []
  } catch (e) {
    ElMessage.error('加载地址失败')
  } finally {
    loading.value = false
  }
}

const openAdd = () => {
  isEdit.value = false
  Object.assign(form, {
    id: null,
    receiver_name: '',
    receiver_phone: '',
    province: '',
    city: '',
    district: '',
    detail_address: '',
    postal_code: '',
    address_tag: '',
    is_default: false
  })
  dialogVisible.value = true
}

const openEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

const save = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return
    saving.value = true
    if (isEdit.value && form.id) {
      await userApi.updateAddress(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await userApi.addAddress(form)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    await fetchList()
  } catch (e) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

const deleteAddress = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除该地址吗？', '提示', { type: 'warning' })
    await userApi.deleteAddress(row.id)
    ElMessage.success('删除成功')
    await fetchList()
  } catch (e) {
    // 错误提示已由拦截器统一处理
  }
}

const setDefault = async (row) => {
  try {
    await userApi.updateAddress(row.id, { is_default: true })
    ElMessage.success('已设为默认地址')
    await fetchList()
  } catch (e) {
    ElMessage.error('设置默认失败')
  }
}

onMounted(fetchList)
</script>

<style scoped>
.user-addresses {
  min-height: 300px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}
.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0;
}
</style>
