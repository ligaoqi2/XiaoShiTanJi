<template>
  <div class="excel_content">
    <div class="operate_line cursour" @click="changeHide">
      上传 <CaretBottom style="width: 20px" v-show="!showUpload" />
      <CaretRight style="width: 20px" v-show="showUpload" />
    </div>
    <div class="upload_content" v-show="showUpload">
      <el-upload
        class="upload-demo"
        drag
        :action="base_BASE + 'api/newExcelFile'"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">点击上传，或者将文件拖到这里上传</div>
        <template #tip>
          <div class="el-upload__tip">
            把excel拖到这里上传，或者点击一下图标，选择文件上传
          </div>
        </template>
      </el-upload>
    </div>
    <div class="main_content">
      <div class="operate_content">
        <div class="line">
          <el-input
            v-model="input"
            style="width: 240px"
            placeholder="输入名称进行查找"
            size="large"
          />
          <el-button type="primary" size="large" @click="getData"
            >查找</el-button
          >
        </div>
        <div class="line" style="display: flex; justify-content: flex-end">
          <el-button type="primary" size="large" plain @click="clear"
            >重新查找</el-button
          >
        </div>
      </div>
      <div
        class="table_content"
        v-loading="loading"
        element-loading-text="正在加载，请稍等一会"
      >
        <el-table
          :data="tableData"
          height="100%"
          border
          style="width: 100%"
          empty-text="在上面输入查询的名称，然后点击查找"
        >
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column prop="name" label="品名" />
          <el-table-column prop="specification" label="规格" width="100" />
          <el-table-column prop="unit" label="单位" width="60" />
          <el-table-column :label="date">
            <el-table-column prop="price" label="定价" width="70" />
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { CaretBottom, CaretRight, UploadFilled } from '@element-plus/icons-vue'
import { getExcelLine } from '@/api/index'
const base_BASE = import.meta.env.VITE_API_BASE

const showUpload = ref(false)

const changeHide = () => {
  showUpload.value = !showUpload.value
}

const input = ref('')

const getData = async () => {
  const res = await getExcelLine({ keyword: input.value })
  tableData.value = res.result
  if (res.result.length) {
    date.value = res.result[0].date
  }
}

const loading = ref(false)

const tableData = ref([])
const date = ref('4.1 - 5.1')

const clear = () => {
  tableData.value = []
  input.value = ''
}

onMounted(() => {
  getData()
})
</script>

<style lang="less" scoped>
.excel_content {
  height: 100vh;
  .cursour {
    cursor: pointer;
  }
  .operate_line {
    padding: 0px 20px;
    height: 35px;
    font-size: 16px;
    font-weight: bolder;
    background: #409eff;
    color: white;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .upload_content {
    display: flex;
    justify-content: center;
    padding: 20px;
    background-color: rgb(245, 247, 250);
    .el-upload {
      width: 100%;
    }
  }
  .main_content {
    height: calc(100% - 35px);
  }
  .operate_content {
    .line {
      padding: 0px 20px;
      height: 80px;
      display: flex;
      align-items: center;
      border: 1px solid #aaa;
      gap: 20px;
      .el-input {
        flex: 1;
      }
      .el-button {
        width: 100px;
      }
    }
  }
  .table_content {
    padding: 10px;
    height: calc(100% - 170px);
    :deep(.el-table) {
      .cell {
        padding: 0px;
        text-align: center;
        font-size: 16px;
      }
      th.el-table__cell {
        font-weight: bolder !important;
        color: #000;
        background-color: rgb(226, 239, 218);
      }
      --el-border-color-lighter: #000;
      .el-table__empty-text {
        width: 100%;
        font-size: 20px;
      }
    }
  }
}
</style>
