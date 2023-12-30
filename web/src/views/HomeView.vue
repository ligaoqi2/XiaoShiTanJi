<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <div class="logo">
          <img src="/logo.png" alt="logo" style="width: 100px" />
          <p>
            <span>智能合同解析系统</span>
          </p>
          <left-menu></left-menu>
        </div>
        <div class="bottom-div"></div>
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
import LeftMenu from '@/components/LeftMenu.vue';
</script>
<style lang="less" scoped>
.common-layout {
  height: 100%;

  .el-container {
    height: 100%;
  }

  .el-header,
  .el-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--el-color-primary-light-9);
    color: var(--el-text-color-primary);
    text-align: center;
  }

  .el-aside {
    height: 100%;
    color: var(--el-text-color-primary);
    text-align: center;

    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    justify-self: stretch;

    .logo {
      margin-top: 40px;
      height: calc(100% - 40px);

      span {
        font-family: '微软雅黑 Bold', '微软雅黑', serif;
        font-weight: 700;
        font-style: normal;
        font-size: 16px;
        color: rgb(58, 66, 107);
        text-align: center;
        border-width: 0;
      }
    }

    .user-info {
      margin-bottom: 36px;
    }
  }

  .el-main {
    background-color: var(--el-color-primary-light-9);
    color: var(--el-text-color-primary);
  }
}
</style>
