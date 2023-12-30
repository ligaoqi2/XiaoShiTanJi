<template>
  <h2>上传文件</h2>
  <el-row class="file-upload" justify="space-between">
    <el-form>
      <el-form-item style="margin-bottom: 0">
        <el-upload
          ref="uploadRef"
          name="file"
          accept=".xlsx, .xls"
          v-model:file-list="fileList"
          :action="uploadUrl"
          :headers="headers"
          :auto-upload="false"
          :limit="1"
          :on-exceed="handleExceed"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
        >
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
          <el-button class="ml-3" type="success" @click="submitUpload">
            确认上传
          </el-button>
          <template #tip>
            <div class="el-upload__tip">只能上传 xlsx/xls 文件</div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="filesDialogVisible = true"
      >已上传文件列表
    </el-button>
  </el-row>
  <el-dialog v-model="filesDialogVisible" title="已上传文件列表" width="50%">
    <el-table ref="filesTableRef" :data="filesTableData">
      <el-table-column width="80" align="center" label="序号">
        <template #default="scope">
          <span>
            {{
              (filesPagination.page - 1) * filesPagination.pageSize +
              scope.$index +
              1
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="upload_time" width="240" label="上传时间">
        <template #default="scope">
          {{ dayjs.unix(scope.row.upload_time).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="file_name" label="文件名称" />
      <el-table-column fixed="right" width="80" align="center" label="下载">
        <template #default="scope">
          <el-link
            type="primary"
            :icon="Download"
            :href="
              API_BASE + `api/files/${scope.row.id}/download?_token=${token}`
            "
          >
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        v-model:current-page="filesPagination.page"
        v-model:page-size="filesPagination.pageSize"
        :total="filesPagination.total"
        @current-change="handleFilesCurrentChange"
        layout="prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </el-dialog>
  <h2>历史数据</h2>
  <div class="records-list">
    <el-table
      :data="recordsTableData"
      ref="recordsTableRef"
      border
      header-cell-class-name="records-list-header"
      :row-class-name="tableRowClassName"
      @select="handleSelectionChange"
      @select-all="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="payment_company_code" label="付款公司代码" />
      <el-table-column prop="bank_code" label="开户行" />
      <el-table-column prop="account_identifier" label="帐户标识" />
      <el-table-column prop="bank_account_name" label="开户行户名" />
      <el-table-column prop="transaction_amount" label="交易金额" />
      <el-table-column prop="transaction_date" label="交易时间" />
      <el-table-column prop="counterparty_bank_account_name" label="对方户名" />
      <el-table-column prop="counterparty_bank_name" label="对方开户行" />
      <el-table-column
        prop="bank_transaction_unique_number"
        label="银行交易唯一号"
      />
      <el-table-column fixed="right" align="center" label="操作">
        <template #default="scope">
          <el-button v-if="scope.row.duplicated !== 0" disabled
            >重复记录
          </el-button>
          <template v-else>
            <el-button
              v-if="scope.row.status === 0"
              type="primary"
              @click="handleSingleSubmit(scope.row.id)"
            >
              提交
            </el-button>
            <el-button v-else-if="scope.row.status === 1" disabled
              >已提交
            </el-button>
            <el-button
              v-else-if="scope.row.status === -1"
              type="warning"
              @click="handleSingleSubmit(scope.row.id)"
              >重新提交
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px">
      <el-popconfirm
        v-if="multipleSelection.length"
        title="确认批量提交？"
        @confirm="handleMultiSubmit"
      >
        <template #reference>
          <el-button type="primary" v-if="multipleSelection.length"
            >批量提交
          </el-button>
        </template>
      </el-popconfirm>
      <el-button v-if="multipleSelection.length" @click="clearSelection()"
        >清空选择
      </el-button>
      <el-dialog v-model="batchDialogVisible" title="处理进度" width="50%">
        <el-steps
          direction="vertical"
          :active="activeStep"
          finish-status="success"
        >
          <el-step
            v-for="(step, index) in batchSteps"
            :key="index"
            :title="step.title"
            :description="step.description"
            :status="step.status"
          />
        </el-steps>
      </el-dialog>
    </div>
    <div class="pagination-box">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        @current-change="handleCurrentChange"
        layout="prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { onMounted, reactive, ref, nextTick } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage, genFileId } from 'element-plus'
import { getToken } from '@/api/request'
import { getList, postData } from '@/api'

// file upload/download
const token = getToken()
const API_BASE = import.meta.env.VITE_API_BASE
  ? import.meta.env.VITE_API_BASE
  : '/'

const uploadUrl = import.meta.env.VITE_API_BASE
  ? `${import.meta.env.VITE_API_BASE}api/upload`
  : '/api/upload'

const headers = {
  Authorization: 'Bearer' + ' ' + getToken(),
  Accept: 'application/json'
}

const uploadRef = ref()
const fileList = ref([])

const submitUpload = () => {
  uploadRef.value.submit()
}
/**
 * 处理文件上传超出
 * @param files
 */
const handleExceed = (files) => {
  uploadRef.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  uploadRef.value.handleStart(file)
}
const handleUploadSuccess = () => {
  fileList.value.map((item) => {
    let count = item.response.data.payment_records.length
    ElMessage({
      type: 'success',
      message: `新增 ${count} 条记录。`
    })
  })
  pagination.page = 1
  refreshRecordsData()
  refreshFilesData()
}

const handleUploadError = (e) => {
  ElMessage({
    type: 'error',
    message: e
  })
}

// 文件列表
const filesPagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})
const filesDialogVisible = ref(false)
const filesTableRef = ref()
const filesTableData = ref([])

const refreshFilesData = () => {
  getList('api/files', {
    page: filesPagination.page,
    per_page: filesPagination.pageSize
  }).then((res) => {
    filesTableData.value = res.data
    filesPagination.total = res.meta.total
  })
}

const handleFilesCurrentChange = () => {
  refreshFilesData()
}

// 付款单记录
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})
const recordsTableRef = ref()
const recordsTableData = ref([])

// 新传的数据行显示绿色
const tableRowClassName = ({ row, rowIndex }) => {
  let seconds = dayjs().unix() - row.created_at
  if (seconds >= 0 && seconds < 180) {
    return `success-row success-row-${rowIndex}`
  }
  return ''
}

/**
 * 所有分页被选的数据
 * @type {Ref<UnwrapRef<*[]>>}
 */
const multipleSelection = ref([])

// 处理当页选中行有变化
const handleSelectionChange = (selectedVal) => {
  let toDeleteIdx = []
  // 检查现有的全部被选数据，剔除当前分页被取消的
  for (let i = 0; i < multipleSelection.value.length; i++) {
    // 若不是当页数据，保留
    let inPage = false
    for (let j = 0; j < recordsTableData.value.length; j++) {
      if (recordsTableData.value[j].id === multipleSelection.value[i].id) {
        inPage = true
        break
      }
    }
    if (!inPage) {
      continue
    }
    // 若是当页数据，且在 selectedData 内，保留，否则标记待删除
    let selected = false
    for (let k = 0; k < selectedVal.length; k++) {
      if (selectedVal[k].id === multipleSelection.value[i].id) {
        selected = true
        break
      }
    }
    if (!selected) {
      toDeleteIdx.push(i)
    }
  }
  // 执行删除
  toDeleteIdx.reverse().forEach((idx) => {
    multipleSelection.value.splice(idx, 1)
  })
  // 当前分页被选中的行数据，插入新勾选上的
  for (let k = 0; k < selectedVal.length; k++) {
    let inMultiple = false
    for (let i = 0; i < multipleSelection.value.length; i++) {
      if (selectedVal[k].id === multipleSelection.value[i].id) {
        inMultiple = true
        break
      }
    }
    if (!inMultiple) {
      multipleSelection.value.push(selectedVal[k])
    }
  }
}
// 清空所有选中行
const clearSelection = () => {
  recordsTableRef.value.clearSelection()
  multipleSelection.value = []
}

/**
 * 单个提交
 * @param record_id
 * @returns {Promise<void>}
 */
const handleSingleSubmit = async (record_id) => {
  const data = {
    record_id: record_id
  }
  try {
    const submitRes = await postData('api/erp_sales_receipt_add', data)
    ElMessage({
      message: submitRes.message,
      type: 'success'
    })
    refreshRecordsData()
  } catch (error) {
    refreshRecordsData()
  }
}
/* 处理批量提交 */
const batchSteps = ref([])
const batchDialogVisible = ref(false)
const activeStep = ref(0)
const handleMultiSubmit = async () => {
  batchSteps.value = []
  for (let o of multipleSelection.value) {
    batchSteps.value.push({
      title:
        o.counterparty_bank_account_name +
        '-' +
        o.bank_transaction_unique_number,
      description: '',
      status: 'finish'
    })
  }
  batchDialogVisible.value = true
  for (let i in multipleSelection.value) {
    let record_status = multipleSelection.value[i].status
    let record_duplicated = multipleSelection.value[i].duplicated
    let record_id = multipleSelection.value[i].id

    if (record_status === 1) {
      batchSteps.value[i].description = '已提交，无需处理'
      batchSteps.value[i].status = 'finish'
    } else {
      if (record_duplicated !== 0) {
        batchSteps.value[i].description = '重复记录，无法提交'
        batchSteps.value[i].status = 'wait'
      } else {
        batchSteps.value[i].status = 'process'
        try {
          let submitRes = await postData('api/erp_sales_receipt_add', {
            record_id
          })
          batchSteps.value[i].description = submitRes.message
          batchSteps.value[i].status = 'finish'
        } catch (error) {
          console.log(error)
          let error_msg = '提交出错'
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            error_msg = error.response.data.error
          }
          batchSteps.value[i].description = error_msg
          batchSteps.value[i].status = 'error'
        }
      }
    }
    activeStep.value++
  }
  refreshRecordsData()
}

const refreshRecordsData = () => {
  getList('api/records', {
    page: pagination.page,
    per_page: pagination.pageSize
  }).then((res) => {
    pagination.total = res.meta.total
    pagination.pageSize = res.meta.page_size
    recordsTableData.value = res.data
    nextTick(() => {
      // 分页加载完数据后初始化选中行
      recordsTableData.value.forEach((item) => {
        let selected = false
        for (let i = 0; i < multipleSelection.value.length; i++) {
          if (item.id === multipleSelection.value[i].id) {
            selected = true
            break
          }
        }
        if (selected) {
          recordsTableRef.value.toggleRowSelection(item, true)
        }
      })
    })
  })
}

const handleCurrentChange = () => {
  refreshRecordsData()
}

onMounted(() => {
  refreshRecordsData()
  refreshFilesData()
})
</script>
<style scoped lang="less">
.file-upload {
  background-color: var(--el-color-white);
  padding: 16px;
}

.records-list {
  .pagination-box {
    padding: 12px 0;
    display: flex;
    justify-content: right;
    align-items: center;
  }
}

.el-table {
  --el-table-header-bg-color: var(--el-color-primary);
  --el-table-header-text-color: var(--el-color-white);
}
</style>
<style>
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
