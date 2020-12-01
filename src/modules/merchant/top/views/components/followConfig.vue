<template>
  <div>
    <el-form  ref="validateForm" label-width="150px" :model="params" :rules="rules" @submit.native.prevent>
      <el-form-item label="关注类型" prop="targetType">
        <el-button :type="params.fallowType===1?'primary':''" size="medium" @click="params.fallowType = 1">小程序</el-button>
        <el-button :type="params.fallowType==2?'primary':''" size="medium" @click="params.fallowType = 2">公众号</el-button>
      </el-form-item>
      <el-form-item label="推荐小程序appid" prop="receiptAppId" v-if="params.fallowType===1" :key="1">
        <el-input v-model.trim="params.receiptAppId" size="medium" style="width: 300px;" :maxlength="50" clearable></el-input>
      </el-form-item>
      <el-form-item label="推荐公众号appid" prop="subscribeAppId" v-if="params.fallowType===2" :key="2">
        <el-input v-model.trim="params.subscribeAppId" size="medium" style="width: 300px;" :maxlength="50" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <div class="vm-text-right">
          <el-button size="medium" @click="propsInfo.open = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="submitInfo('validateForm')">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as merchantApi from '../../api/merchant.js'

export default {
  components: {},
  props: {
    propsInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      params: {
        fallowType: 1,
        receiptAppId: '', // 支付凭证推荐小程序appid
        subscribeAppId: '' // 推荐关注APPID
      },
      rules: {
        receiptAppId: [
          { required: true, message: '请输入推荐小程序appid' }
        ],
        subscribeAppId: [
          { required: true, message: '请输入推荐公众号appid' }
        ]
      }
    }
  },
  watch: {
  },
  computed: {
  },
  created () {
    if (this.propsInfo.configData) {
      this.params.receiptAppId = this.propsInfo.configData.receiptAppId
      this.params.subscribeAppId = this.propsInfo.configData.subscribeAppId
    }
  },
  methods: {
    submitInfo (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmSubmit()
        } else {
          return false
        }
      })
    },
    confirmSubmit () {
      let params = {
        merchantId: this.propsInfo.data.id
      }
      if (this.params.fallowType === 1) {
        params.receipt_appid = this.params.receiptAppId
      } else {
        params.subscribe_appid = this.params.subscribeAppId
      }
      merchantApi.addrecommendconf(params).then(res => {
        if (res.obj === 'FAIL') {
          this.$message.warning(res.msg)
        } else {
          this.$message.success('设置成功')
          this.propsInfo.open = false
          this.$emit('getTableList')
        }
      })
    }
  }
}
</script>
<style scoped>
  .el-button--medium{
    margin-right: 10px;
  }
  .el-button + .el-button {
    margin-left: 0;
    margin-right:10px;
  }
  /*图片上传*/
  .logo-uploader {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    height: 102px;
    overflow: hidden;
    background-color: #f8f8f8;
  }

  .logo-uploader:hover {
    border-color: #409EFF;
  }

  .logo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px !important;
    height: 100px !important;
    line-height: 100px;
    text-align: center;
  }

  .logo {
    width: 100px;
    height: 100px;
    display: block;
  }

  .advtips-img {
    margin-left: 10px;
    color: #3ebdff;
    opacity: 0.8;
    cursor: pointer;
  }
  .advtips-img:hover {
    opacity: 1;
  }
</style>
