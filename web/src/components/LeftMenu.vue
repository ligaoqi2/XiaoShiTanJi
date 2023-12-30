<template>
  <div class="menu_content">
    <div class="top">
      <el-menu :default-active="activeIndex" :router="true">
        <el-menu-item index="/upload">
          <el-icon>
            <Upload />
          </el-icon>
          <span>上传合同文件</span>
        </el-menu-item>
        <el-menu-item index="/change-password">
          <el-icon>
            <Setting />
          </el-icon>
          <span>合同列表</span>
        </el-menu-item>
        <el-menu-item @click="handleLogout">
          <el-icon>
            <Help />
          </el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="bottom">
      <div class="user_content">
        <div class="icon_box"><User class="icon" /></div>
        {{ auth.user.username }}
      </div>
      <div class="logout_content">
        <svg-icon className="logout" icon-class="logout"></svg-icon
        ><span>退出登录</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import {
  HomeFilled,
  SwitchButton,
  Setting,
  User,
  Upload,
  Help
} from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const activeIndex = ref('/index');
const currentRouteIndex = router.currentRoute.value.fullPath;
const getActiveIndex = () => {
  const paths = ['/index', '/change-password'];
  for (let path of paths) {
    if (currentRouteIndex.indexOf(path) !== -1) {
      activeIndex.value = path;
    }
  }
};

const handleLogout = () => {
  auth.logout();
  router.push({ name: 'login' });
};

onMounted(() => {
  getActiveIndex();
});
</script>
<style scoped lang="less">
.menu_content {
  height: calc(100% - 160px);
  .top {
    height: calc(100% - 60px);
  }
  .bottom {
    height: 60px;
    .user_content {
      height: 30px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #3a426b;
      font-weight: bold;
      .icon_box {
        height: 30px;
        width: 30px;
        border-radius: 50%;
        background-color: rgb(225, 233, 246);
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          height: 20px;
          width: 20px;
          color: rgb(32, 108, 245);
        }
      }
    }
    .logout_content {
      margin-top: 10px;
      height: 20px;
      display: flex;
      align-items: center;
      color: rgb(212, 212, 212);
      font-size: 12px;
      gap: 10px;
      .logout {
        height: 20px;
        width: 20px;
      }
    }
  }
}
.el-menu {
  border-right: none;
}
</style>
