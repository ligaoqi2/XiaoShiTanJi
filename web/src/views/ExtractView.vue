<template>
  <div class="extract_content">
    <div class="title">提取合同参数</div>
    <div class="body_content">
      <div class="select_content">
        <div class="selct_box">
          <el-select v-model="selectSingle" placeholder="请选择" size="large">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="multi_select_box">
          <el-select
            v-model="selectMulti"
            multiple
            placeholder="请选择合同"
            size="large"
          >
            <el-option
              v-for="item in files"
              :key="item.id"
              :label="item.file_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <el-button size="large" type="primary" @click="extract"
          >提取参数</el-button
        >
      </div>
      <div class="link_content">
        <el-link type="primary" @click="router.push({ name: 'upload' })"
          >上传新的目标合同<el-icon class="icon"> <ArrowRight /> </el-icon
        ></el-link>
      </div>
    </div>
    <div class="main_content">
      <div class="empty_box" v-if="!mainShow">
        <el-icon class="icon"> <Reading /> </el-icon>
        <div class="text">请先选择目标合同</div>
      </div>
      <div class="no_empty_content" v-else>
        <div class="head_content">
          <div class="tag_content">
            <div
              class="tag_box"
              v-for="(item, index) in extractDatas"
              :key="index"
            >
              {{ item.file_name }}
            </div>
          </div>
          <div class="link_box">
            <el-link type="primary" @click="router.push({ name: 'upload' })"
              >下载已选合同参数</el-link
            >
          </div>
        </div>
        <div class="extract_main_content">
          <div class="left_content">
            <pdflib
              v-for="(item, index) in extractDatas"
              :filePath="baseAdress + item.save_path"
              :id="'pdfViewer'"
            >
              <embed
                id="pdfViewer"
                type="application/pdf"
                width="100%"
                height="100%"
                src="about:blank"
              />
            </pdflib>
          </div>
          <div class="right_content">
            <div class="title_content">
              <span class="title">核心参数提取</span>
              <el-link type="primary" @click="router.push({ name: 'upload' })"
                >下载当前合同参数</el-link
              >
            </div>
            <div class="params_content" v-for="(item, index) in extractDatas">
              <div class="param_box" v-for="(line, index2) in item.params">
                <div
                  class="param_name_box"
                  :style="{
                    color: line.color,
                    borderColor: line.color,
                    backgroundColor: line.bg_color
                  }"
                >
                  {{ line.name }}
                </div>
                <div class="param_value_box">
                  <el-input
                    v-model="line.value"
                    placeholder="请输入内容"
                  ></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { ArrowRight, Reading } from '@element-plus/icons-vue';
import canvasPdf from '../components/canvasPdf.vue';
import pdflib from '../components/pdflib.vue';
import { useRoute, useRouter } from 'vue-router';
import { parse } from '@/api/index';
import { extractValue } from '@/utils/help';

const route = useRoute();
const router = useRouter();
const mainShow = ref(false);
const selectSingle = ref();
const selectMulti = ref([]);
const options = ref([]);
const files = ref(JSON.parse(route.query.files));
const extractDatas = ref([]);
const baseAdress = import.meta.env.VITE_API_BASE;

const extract = () => {
  parseFiles(selectMulti.value);
};
const parseFiles = async (ids) => {
  const res = await parse({ ids });
  extractDatas.value = res.data;
  mainShow.value = true;
};
watchEffect(() => {
  selectMulti.value = extractValue(files.value, 'id');
});
</script>

<style lang="less" scoped>
.extract_content {
  height: 100%;
  padding: 20px;
  padding-bottom: 0px;
  box-sizing: border-box;
  .title {
    color: #3a426b;
    font-size: 16px;
    font-weight: bold;
  }
  .body_content {
    margin-top: 10px;
    .select_content {
      display: flex;
      gap: 10px;
      .selct_box {
        width: 140px;
      }
      .multi_select_box {
        flex: 1;
        .el-select {
          width: 100%;
        }
      }
      .el-button {
        width: 150px;
      }
    }
    .link_content {
      height: 30px;
    }
  }
  .main_content {
    height: calc(100% - 100px);
    background-color: white;
    .empty_box {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .icon {
        font-size: 100px;
        color: rgb(93, 131, 255);
      }
      .text {
        font-size: 50px;
        font-weight: bold;
        background: linear-gradient(
          to bottom,
          rgb(233, 237, 249),
          rgb(212, 221, 244)
        );
        -webkit-background-clip: text;
        color: transparent;
      }
    }
    .no_empty_content {
      height: 100%;
      width: 100%;
      position: relative;
      .head_content {
        width: 100%;
        box-sizing: border-box;
        position: absolute;
        height: 40px;
        top: 0px;
        background-color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0px 20px 0px 0px;
        border-bottom: 1px solid #ccc;
        .tag_content {
          .tag_box {
            cursor: pointer;
            padding: 10px 20px;
            font-size: 13px;
            border: 1px solid #ccc;
            border-bottom: none;
          }
        }
      }
      .extract_main_content {
        display: flex;
        height: 100%;
        .left_content {
          height: 100%;
          flex: 2;
        }
        .right_content {
          height: 100%;
          flex: 1;
          padding: 60px 20px 0px 20px;
          .title_content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
              font-size: 16px;
              color: #000;
            }
          }
          .params_content {
            .param_box {
              padding: 10px;
              display: flex;
              gap: 10px;
              .param_name_box {
                width: 100px;
                height: 30px;
                cursor: pointer;
                border: 1px solid black;
                border-radius: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .param_value_box {
                flex: 1;
              }
            }
          }
        }
      }
    }
  }
}
</style>
