<template>
  <div>
    <el-form  ref="validateForm" label-width="150px" :model="params" :rules="rules" @submit.native.prevent>
      <el-form-item label="商户ID：" prop="merchantPid">
        <el-input v-model.trim="params.merchantPid" size="medium" style="width: 300px;" :maxlength="200" clearable></el-input>
      </el-form-item>
      <el-form-item label="授权Token：" prop="lifeAppToken">
        <el-input v-model.trim="params.lifeAppToken" size="medium" style="width: 300px;" :maxlength="1000" clearable></el-input>
      </el-form-item>
      <el-form-item label="生活号APPID：" prop="lifeAppId">
        <el-input v-model.trim="params.lifeAppId" size="medium" style="width: 300px;" :maxlength="200" clearable></el-input>
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
        merchantPid: '', // 商户ID
        lifeAppId: '', // 生活号APPID
        lifeAppToken: '' // 授权Token
      },
      rules: {
        merchantPid: [
          { required: true, message: '请输入商户ID' }
        ],
        lifeAppId: [
          { required: true, message: '请输入生活号APPID' }
        ],
        lifeAppToken: [
          { required: true, message: '请输入授权Token' }
        ]
      }
    }
  },
  watch: {
  },
  computed: {
  },
  created () {
    this.getAliLifeAppInfo() // 先获取详情，在获取配置信息
  },
  methods: {
    /**
     * 获取生活号信息
     */
    getAliLifeAppInfo () {
      let params = {
        merchantId: this.propsInfo.data.id
      }
      merchantApi.getAliLifeInfo(params).then(res => {
        this.getAliLifeConfigInfo(res.obj.id)
      })
    },
    /**
     * 获取商户支付宝生活号配置信息
     * @param id
     */
    getAliLifeConfigInfo (id) {
      let params = {
        lifeInfoId: id
      }
      merchantApi.getAliConfig(params).then(res => {
        if (res.obj.lifeAppId) {
          this.params = Object.assign({}, res.obj)
        }
      })
    },
    /**
     * 保存支付宝生活号配置信息
     * @param formName
     */
    submitInfo (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmSubmit()
        } else {
          return false
        }
      })
    },
    /**
     * 确认提交
     */
    confirmSubmit () {
      merchantApi.editAliConfig(this.params).then(res => {
        this.$message.success('操作成功')
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
