<template>
  <h2>修改密码</h2>
  <el-row class="change-password-form">
    <el-form
      :model="passwordForm"
      ref="passwordFormRef"
      label-position="right"
      label-width="100px"
      style="max-width: 460px"
    >
      <el-form-item label="旧密码" prop="old_password">
        <el-input type="password" v-model="passwordForm.old_password" />
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input type="password" v-model="passwordForm.new_password" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="new_password_confirm">
        <el-input type="password" v-model="passwordForm.new_password_confirm" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认</el-button>
        <el-button @click="resetForm(passwordFormRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { postData } from '@/api'
import { ElMessage } from 'element-plus'

const passwordFormRef = ref()
const passwordForm = reactive({
  old_password: '',
  new_password: '',
  new_password_confirm: ''
})

const onSubmit = async () => {
  await postData('api/change_password', passwordForm)
  ElMessage({
    type: 'success',
    message: '修改成功'
  })
}
const resetForm = (formEl) => {
  formEl.resetFields()
}
</script>
<style scoped lang="less">
.change-password-form {
  background-color: var(--el-color-white);
  padding: 16px;
}
</style>
