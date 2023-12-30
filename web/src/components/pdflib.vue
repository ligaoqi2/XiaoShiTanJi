<template>
  <slot />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { PDFDocument, rgb, PDFName } from 'pdf-lib';

const prop = defineProps({
  filePath: String,
  id: String
});
const init = async () => {
  const iframe = document.getElementById(prop.id);
  if (!iframe) return;
  const existingPdfBytes = await fetch(prop.filePath).then((res) =>
    res.arrayBuffer()
  );
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const [firstPage, secondPage] = pdfDoc.getPages();

  secondPage.drawRectangle({
    x: 100,
    y: 100,
    width: 200,
    height: 100,
    color: rgb(1, 0, 0, 0.5),
    opacity: 0.5
  });

  const modifiedPdfBytes = await pdfDoc.save();
  const modifiedPdfBlob = new Blob([modifiedPdfBytes], {
    type: 'application/pdf'
  });
  const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);

  iframe.src = modifiedPdfUrl + '#page=2';
};

onMounted(() => {
  init();
});

watch(
  prop.filePath,
  () => {
    init();
  },
  {
    immediate: true
  }
);
</script>

<style lang="less" scoped></style>
