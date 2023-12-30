<template>
  <div class="splitVideo_content">
    <div class="title">
      <h1>分片加载视频的实现，边播放边加载</h1>
    </div>
    <div class="splitVideo_body">
      <div class="title_line">
        <h2>Blob</h2>
      </div>
      <div class="link_line">
        <el-link type="primary" @click="goGitHub"
          >源码 <Link style="width: 1em; height: 1em; margin-right: 8px"
        /></el-link>
      </div>
      <div class="body_line">
        <Blob />
      </div>
    </div>
    <div class="splitVideo_body">
      <div class="title_line">
        <h2>mediaSource</h2>
      </div>
      <div class="link_line">
        <el-link type="primary" @click="goGitHub"
          >源码 <Link style="width: 1em; height: 1em; margin-right: 8px"
        /></el-link>
      </div>
      <div class="body_line">
        <mediaSource />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Blob from './Blob.vue'
import mediaSource from './mediaSource.vue'
import { Link } from '@element-plus/icons-vue'

const init = () => {}

onMounted(() => {})
</script>

<style lang="less" scoped>
.splitVideo_content {
  .title {
    h1 {
      text-align: center;
    }
  }
  .splitVideo_body {
    .body_line {
      height: 300px;
      width: 100%;
    }
  }
}
</style>
