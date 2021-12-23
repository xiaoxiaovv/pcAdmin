<template>
  <div v-loading='loading'>
    <el-form :model="form"
             :rules="rules"
             ref="ruleForm">
      <!-- <a href="http://pay-adm.h5h5h5.cn/fms/upload/resource/1197812686619500544.doc"
         download="cc">cc</a> -->
      <el-form-item label="标题"
                    label-width="120px"
                    prop="title">
        <el-input maxlength='20'
                  v-model="form.title"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="上传图片"
                    label-width="120px">
        <fileUpload v-model="form.photoId"
                    :urlType="2">
        </fileUpload>
        <img :src='form.photoId | previewLoadImage' style="width: 100px;"/>
        <!-- <div slot="tip"
             class="el-upload__tip">只能上传Word/Excel/Ppt/Pdf</div> -->
        </el-upload>
      </el-form-item>
      <el-form-item label="跳转类型"
                    label-width="120px">
        <el-radio-group v-model="form.type">
            <el-radio :label="1">app内部</el-radio>
            <el-radio :label="2">外部链接</el-radio>
            <el-radio :label="3">富文本</el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="跳转链接"
                    label-width="120px"
                    prop="showUrl">
        <el-input maxlength='100'
                  v-model="form.showUrl"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="是否展示"
                    label-width="120px">
        <el-radio-group v-model="form.isShow">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="内容"
                    label-width="120px"
                    prop="content">
        <Editor v-model="form.content"
                ref="editor"></Editor>
        <!-- <button @click="clear">清空内容</button>
        <button @click="disabled = true">禁用</button>-->
      </el-form-item>
    </el-form>
    <div class="vm-align-center">
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary"
                   @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </div>
  </div>
</template>
<script>
import * as noticeApi from '../../api/notice'
import fileUpload from '@/components/fileUpload' // 文件上传操作API
import Editor from '@/components/libs/editor'

export default {
  name: 'addNotice',
  components: {
    Editor,
    fileUpload
  },
  props: {
    data: {}
  },
  data() {
    return {
      form: {
        content: '',
        title: null,
        isShow: 1,
        photoId: '',
        type: 1,
        showUrl: '',
      },
      loading: false,

      userType: '',
      rules: {
        title: [{ required: true, message: '请输入通告标题', trigger: 'blur' }],
        content: [{ required: true, message: '请填写公告内容', trigger: 'blur' }]
      },
      checkAll: true,
      isIndeterminate: false,
      arrList: [1, 2, 3, 4, 5],
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
  mounted() {
      if (this.data.id) {
          this.form = this.data
      }
  },
  filters: {
    previewLoadImage(id) {
      return id ? window.serverUrl + `/fms/upload/resource/${id}` : ''
    },
  },
  methods: {
    handleCheckAllChange(val) {
      this.isIndeterminate = false
    },
    handleCheckedNoticeChange(value) {
      console.log(value)
      let checkedCount = value.length
      this.checkAll = checkedCount === this.arrList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.arrList.length
    },
    onClick(e, editor) {
      console.log('Element clicked')
      console.log(e)
      console.log(editor)
    },
    // 清空内容
    clear() {
      this.$refs.editor.clear()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!')
          this.loading = true
          console.log(this.form)
          delete this.form.createTime
          delete this.form.updateTime
          noticeApi.addSwiper(this.form).then(res => {
            this.$message.success('新增成功')
            this.loading = false
            this.$emit('submit')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    close() {
      this.$emit('close')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
