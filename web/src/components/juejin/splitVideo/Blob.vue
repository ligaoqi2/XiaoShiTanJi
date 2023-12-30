<template>
  <div class="b_content">
    <video id="video_blob" controls></video>
    <el-button type="primary" @click="rangeVideo">
      <VideoPlay style="width: 50px; height: 50px" />
    </el-button>
  </div>
</template>

<script setup>
import { VideoPlay } from '@element-plus/icons-vue'

const rangeVideo = () => {
  const video = document.querySelector('#video_blob')
  const totalSize = 5524488
  const chunkSize = 500000
  const numChunks = Math.ceil(totalSize / chunkSize)
  let chunk = new Blob()
  let index = 0

  send()
  function send() {
    if (index >= numChunks) return
    const start = index * chunkSize
    const end = Math.min(start + chunkSize - 1, totalSize - 1)
    const url = 'https://www.xtr327.com:3000/api/backgroundVideo'
    fetch(url, {
      headers: { Range: `bytes=${start}-${end}` }
    })
      .then((response) => {
        index++
        return response.blob()
      })
      .then((blob) => {
        send()
        chunk = new Blob([chunk, blob], { type: 'video/mp4' })
        const url = URL.createObjectURL(chunk)
        const currentTime = video.currentTime
        video.src = url
        video.currentTime = currentTime
        video.play()
      })
  }
}
</script>

<style lang="less" scoped>
.b_content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 30px;
  .el-button {
    width: 150px;
    height: 100px;
  }
  video {
    height: 100%;
    width: 300px;
  }
}
</style>
