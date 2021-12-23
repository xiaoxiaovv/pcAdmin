<template>
  <div>
    <el-form>
      <el-form-item label="公告标题"
                    label-width="80px"
                    prop="title">
        <div>{{data.title}}</div>
      </el-form-item>
      <el-form-item label="发布时间"
                    label-width="80px"
                    prop="title">
        <div>{{data.createTime}}</div>
      </el-form-item>
      <el-form-item label="下载内容"
                    label-width="80px"
                    prop="title">
        <div>
          <a class="file-name"
             v-for="(item,index) in downloadList"
             :key="index"
             :href="returnFilesUrl(item.code)"
             :download="item.name">{{item.name}}</a>
        </div>
      </el-form-item>
      <el-form-item label="通知对象"
                    label-width="80px"
                    prop="noticeObj">
        <div>{{getNoticeObj(data.type )}}</div>
      </el-form-item>
      <el-form-item label="公告内容"
                    label-width="80px"
                    prop="content">
        <div v-html="data.content"
             class="rich-text"></div>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
import * as noticeApi from '../../api/notice'
import { returnFilesUrl } from '@/modules/file/api/upload' // 图片操作API

export default {
  name: 'detail',
  props: {
    data: {}
  },
  data() {
    return {
      downloadList: [],
      statusOption: [
        {
          value: 1,
          name: '贴牌商'
        },
        {
          value: 2,
          name: '一级代理商'
        },
        {
          value: 3,
          name: '二级代理商'
        },
        {
          value: 4,
          name: '三级代理商'
        },
        {
          value: 5,
          name: '商户'
        }
      ]
    }
  },
  created() {
    if (this.data.filePath) {
      noticeApi.getFileNameList(this.data.filePath).then(res => {
        if (res.obj) {
          this.downloadList = res.obj
        }
      })
    }
  },
  methods: {
    returnFilesUrl,
    getNoticeObj(type) {
      if (type) {
        let name = []
        this.statusOption.forEach(element => {
          if (type.indexOf(element.value) !== -1) {
            name.push(element.name)
          }
        })
        name = name.join('/')
        return name
      }
    }
  }
}
</script>
<style lang='scss'>
.file-name {
  color: #108ee9;
  margin: 5px;
}
.rich-text {
  &:first-child {
    img {
      margin-top: 24px;
    }
  }
  div,
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  strong {
    width: 100% !important;
  }
  h1 {
    padding-top: 0 !important;
  }
  pre {
    white-space: pre-wrap; /*css-3*/
    white-space: -moz-pre-wrap; /*Mozilla,since1999*/
    white-space: -pre-wrap; /*Opera4-6*/
    white-space: -o-pre-wrap; /*Opera7*/
    word-wrap: break-word; /*InternetExplorer5.5+*/
  }
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: auto;
  }
  margin-right: 80px;
  margin-top: -12px;
}
</style>
