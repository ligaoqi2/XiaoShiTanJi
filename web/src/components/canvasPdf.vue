<template>
  <canvas id="canv"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import png from '/canvas.png';

let ctx;

const draw = () => {
  ctx.fillStyle = 'green';
  ctx.fillRect(100, 200, 50, 30);
};

const init = () => {
  const canvas = document.querySelector('#canv');

  const img = new Image();
  img.src = png;
  ctx = canvas.getContext('2d');

  img.onload = () => {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    draw();
  };
};

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
#canvas {
  width: 100%;
  height: 100%;
}
</style>
