<template>
  <div class="b_content">
    <video id="video_mediaSource" controls></video>
    <el-button type="primary" @click="rangeVideo">
      <VideoPlay style="width: 50px; height: 50px" />
    </el-button>
  </div>
</template>
<script setup>
import { VideoPlay } from '@element-plus/icons-vue'

const rangeVideo = () => {
  const video = document.querySelector('#video_mediaSource')
  const totalSize = 9350042
  const chunkSize = 1000000
  const numChunks = Math.ceil(totalSize / chunkSize)
  let index = 0

  const assetURL = 'https://www.xtr327.com:3000/api/backgroundVideo'
  var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'

  if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
    var mediaSource = new MediaSource()
    video.src = URL.createObjectURL(mediaSource)
    mediaSource.addEventListener('sourceopen', sourceOpen)
  } else {
    console.error('Unsupported MIME type or codec: ', mimeCodec)
  }

  function sourceOpen(e) {
    var mediaSource = e.target
    var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)

    const send = () => {
      if (index >= numChunks) {
        sourceBuffer.addEventListener('updateend', function (_) {
          mediaSource.endOfStream()
        })
      } else {
        const start = index * chunkSize
        const end = Math.min(start + chunkSize - 1, totalSize - 1)
        fetch(assetURL, {
          headers: {
            Range: `bytes=${start}-${end}`,
            responseType: 'arraybuffer'
          }
        }).then(async (response) => {
          response = await response.arrayBuffer()
          index++
          sourceBuffer.appendBuffer(response)
          send()
          video.play()
        })
      }
    }

    send()
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
