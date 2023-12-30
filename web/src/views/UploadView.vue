<template>
  <div class="upload_content">
    <div class="title">上传合同文件</div>
    <div class="body_content">
      <div class="upload_box">
        <el-upload
          :action="uploadUrl"
          :on-success="importUploaded"
          :headers="token"
          :on-change="fileChange"
          drag
          multiple
        >
          <el-icon class="icon">
            <Upload />
          </el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            支持扩展名：.xlsx .xls .csv .doc .docx .pdf
          </div>
        </el-upload>
      </div>
      <div class="operate_content">
        <el-button type="primary" round @click="goExtract"
          >上传合同<el-icon class="icon"> <ArrowRight /> </el-icon
        ></el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Upload, ArrowRight } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const token = { Authorization: auth.token };
const fileList = ref([]);
const router = useRouter();

const uploadUrl = import.meta.env.VITE_API_BASE + 'api/upload';
const importUploaded = (res, file, list) => {
  fileList.value.push(res.data);
};

const goExtract = () => {
  router.push({
    name: 'extract',
    query: { files: JSON.stringify(fileList.value) }
  });
};
</script>

<style lang="less" scoped>
.upload_content {
  padding: 20px;
  .title {
    color: #3a426b;
    font-size: 16px;
    font-weight: bold;
  }
  .body_content {
    margin-top: 10px;
    padding: 50px 20px;
    background-color: white;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .upload_box {
      width: 400px;
      .icon {
        font-size: 50px;
        font-weight: bolder;
        width: 50px;
        height: 50px;
        color: rgb(24, 144, 255);
      }
    }
    .operate_content {
      margin-top: 50px;
      height: 100px;
      .el-button {
        width: 200px;
        height: 50px;
        border-radius: 25px;
      }
    }
  }
}
</style>
