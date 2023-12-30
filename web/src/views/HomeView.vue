<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <div class="logo">
          <div class="logo_img">
            <img src="/img/icon_dist.jpg" alt="" />
          </div>
          <p>
            <span>小石潭记</span>
          </p>
        </div>
        <div class="gitLink">
          <el-link type="primary" @click="goGitHub"
            >gitHub<Link style="width: 1em; height: 1em; margin-right: 8px"
          /></el-link>
        </div>
        <left-menu></left-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import LeftMenu from '@/components/LeftMenu.vue'
import { Link } from '@element-plus/icons-vue'

const goGitHub = () => {
  window.open('https://github.com/nt1107/XiaoShiTanJi')
}
</script>
<style lang="less" scoped>
.common-layout {
  height: 100%;

  .el-container {
    height: 100%;
  }

  .el-aside {
    height: 100%;
    color: var(--el-text-color-primary);
    text-align: center;

    .logo {
      margin-top: 10px;
      height: 150px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .logo_img {
        width: 100px;
        height: 100px;
        img {
          border-radius: 50%;
        }
      }
    }
    .gitLink {
      height: 30px;
    }
  }

  .el-main {
    background-color: var(--el-color-primary-light-9);
    color: var(--el-text-color-primary);
  }
}
</style>
