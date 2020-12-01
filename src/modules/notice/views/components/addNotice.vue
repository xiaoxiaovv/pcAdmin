<template>
  <div v-loading='loading'>
    <el-form :model="form"
             :rules="rules"
             ref="ruleForm">
      <!-- <a href="http://pay-adm.h5h5h5.cn/fms/upload/resource/1197812686619500544.doc"
         download="cc">cc</a> -->
      <el-form-item label="公告标题"
                    label-width="120px"
                    prop="title">
        <el-input maxlength='20'
                  v-model="form.title"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="通知对象"
                    label-width="120px"
                    prop="noticeObj">
        <el-checkbox :indeterminate="isIndeterminate"
                     v-model="checkAll"
                     @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group placeholder="请选择通知对象"
                           size="small"
                           class="formItem"
                           clearable
                           multiple
                           @change="handleCheckedNoticeChange"
                           v-model="form.noticeObj">
          <span v-for="item in statusOption"
                :key="item.value">
            <el-checkbox v-if="(userType==='1'&&item.value===1)?false:true"
                         :label="item.value">{{item.name}}</el-checkbox>
          </span>

        </el-checkbox-group>

      </el-form-item>

      <el-form-item label="上传文件"
                    label-width="120px">
        <fileUpload v-model="form.filePath"
                    :urlType="2">
        </fileUpload>
        <!-- <div slot="tip"
             class="el-upload__tip">只能上传Word/Excel/Ppt/Pdf</div> -->
        </el-upload>
      </el-form-item>
      <el-form-item label="公告内容"
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
  data() {
    return {
      form: {
        content: '',
        title: null,
        filePath: '',
        type: '1, 2, 3, 4, 5',
        noticeObj: [1, 2, 3, 4, 5],
        createType: null
      },
      loading: false,

      userType: '',
      rules: {
        title: [{ required: true, message: '请输入通告标题', trigger: 'blur' }],
        noticeObj: [{ required: true, message: '至少选择一个通知对象', trigger: 'change' }],
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
  watch: {
    'form.noticeObj'(val) {
      this.form.type = val.join(',')
    }
  },
  mounted() {
    this.userType = sessionStorage.getItem('userType')
    if (this.userType === '1') {
      this.form.noticeObj = [2, 3, 4, 5]
      this.arrList = [2, 3, 4, 5]
      this.form.createType = '2'
    }
    if (this.userType === 'undefined') {
      this.form.createType = '1'
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.form.noticeObj = val ? this.arrList : []
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
          noticeApi.addNotice(this.form).then(res => {
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
