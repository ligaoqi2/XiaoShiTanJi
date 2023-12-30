<template>
  <div class="menu_content">
    <el-menu :default-active="activeIndex" :router="true">
      <el-menu-item index="/splitVideo">
        <div class="text">分片加载视频的实现，边播放边加载</div>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const activeIndex = ref('/index')
</script>

<style lang="less" scoped>
.menu_content {
  .text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
}
</style>
