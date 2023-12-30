<template>
  <el-container>
    <el-main>
      <el-card shadow="always">
        <el-form class="login-form">
          <img src="/logo.png" alt="logo" style="width: 100px" />
          <p>
            <span>自动数据上传工具</span>
          </p>
          <el-form-item>
            <el-input
              v-model="username"
              size="large"
              placeholder="请输入用户名"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="password"
              type="password"
              size="large"
              placeholder="请输入密码"
              :prefix-icon="Lock"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              style="width: 100%"
              @click="handleLogin"
              :loading="loginLoading"
              :disabled="loginLoading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        <!-- <el-dialog v-model="smsFormVisible">
          <el-form :model="smsForm">
            <el-form-item label="验证码" :label-width="100">
              <el-input
                v-model="smsForm.sms_code"
                autocomplete="off"
                placeholder="请输入短信验证码"
              />
            </el-form-item>
            <input type="hidden" v-model="smsForm.code_id" />
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="smsFormVisible = false">取消</el-button>
              <el-button type="primary" @click="handleSmsSubmit">
                提交
              </el-button>
            </span>
          </template>
        </el-dialog> -->
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { User, Lock } from '@element-plus/icons-vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth';
import { login } from '@/api/index';

const auth = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const loginLoading = ref(false);

const handleLogin = () => {
  loginLoading.value = true;
  const API_BASE = import.meta.env.VITE_API_BASE;

  // 用户名密码登录
  login({ username: username.value, password: password.value })
    .then((response) => {
      const user = response.data;
      auth.login(user);
      router.push({ name: 'home' });
    })
    .catch((error) => {
      let message = error.message;
      if (error.response && error.response.data && error.response.data.error) {
        message = error.response.data.error;
      }
      ElMessage({
        message: message,
        type: 'error'
      });
    })
    .finally(() => {
      loginLoading.value = false;
    });
};

const handleSmsSubmit = () => {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const client = axios.create({
    baseURL: API_BASE
  });
  // 二步验证，短信
  client({
    method: 'post',
    url: `api/sms_login`,
    data: smsForm
  })
    .then((response) => {
      let user = response.data.data;
      console.log(user);
      auth.login(user);
      if (!user.password_confirmed) {
        console.log('change-password');
        router.push({ name: 'change-password' });
        return;
      }
      router.push({ name: 'home' });
    })
    .catch((error) => {
      let message = error.message;
      if (error.response && error.response.data && error.response.data.error) {
        message = error.response.data.error;
      }
      ElMessage({
        message: message,
        type: 'error'
      });
    });
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-main {
  height: 100%;
  background-color: var(--el-color-primary-light-9);
  color: var(--el-text-color-primary);
  text-align: center;

  display: flex;
  justify-content: center;
  align-items: center;

  .el-card {
    width: 460px;
    height: 430px;

    .login-form {
      padding: 20px 40px;

      span {
        font-family: '微软雅黑 Bold', '微软雅黑', serif;
        font-weight: 700;
        font-style: normal;
        font-size: 16px;
        letter-spacing: 12px;
        color: rgb(58, 66, 107);
        text-align: center;
        border-width: 0;
      }
    }
  }
}
</style>
