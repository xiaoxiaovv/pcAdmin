<template>
  <div class="app-container" v-loading="loading">
    <el-form  ref="validateForm" label-width="160px" :model="params" :rules="rules" :disabled="!modifyStatus" @submit.native.prevent>
      <el-form-item label="证件识别通道:">
        <div>阿里云</div>
      </el-form-item>
      <el-form-item label="启用证件识别状态:" prop="status">
        <el-switch v-model="params.isUse"
                   :active-value="1"
                   :inactive-value="0">
        </el-switch>
        <span class="tipcolor">{{params.isUse?'开启':'关闭'}}</span>
      </el-form-item>
      <el-form-item label="阿里云参数appcode:" prop="appcode" v-if="showParam">
        <el-input size="medium"
                  placeholder="请输入阿里云参数appcode"
                  :maxlength="100"
                  class="rolename-width"
                  v-model.trim="params.appcode"></el-input>
      </el-form-item>
      <el-form-item style="margin-bottom:10px;margin-top: 10px;" v-if="modifyStatus">
        <div>
          <el-button size="small" @click="cancel">取 消</el-button>
          <el-button size="small" type="primary" @click="submitInfo('validateForm')">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-button type="primary" size="small" @click="modifyStatus = true" v-if="!modifyStatus" style="margin-left: 160px;margin-top: 10px;">修 改</el-button>
  </div>
</template>

<script>
import * as roleApi from '@/modules/system/api/role'
import { levelAliasMixin } from '@/mixins'
export default {
  name: 'role',
  mixins: [levelAliasMixin],
  components: {},
  data () {
    return {
      loading: true,
      modifyStatus: false,
      showParam: true,
      originalParams: {},
      params: {
        isUse: 0,
        channel: 2,
        appcode: ''
      },
      rules: {
        appcode: [
          { required: true, message: `请输入阿里云参数appcode` }
        ]
      }
    }
  },
  mounted () {
  },
  created () {
    this.getConfigInfo()
  },
  methods: {
    /**
     * 获取配置信息
     */
    getConfigInfo () {
      roleApi.getCertCofig(this.params).then(res => {
        this.loading = false
        if (res.obj) {
          this.params = Object.assign({}, res.obj)
          this.originalParams = Object.assign({}, res.obj)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 确认修改
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
     * 提交修改
     */
    confirmSubmit () {
      let params = Object.assign({}, this.params)
      roleApi.setCertCofig(params).then(res => {
        this.$message.success('保存成功')
        this.modifyStatus = false
        this.getConfigInfo()
      })
    },
    /**
     * 取消
     */
    cancel () {
      this.modifyStatus = false
      this.showParam = false
      this.$nextTick(() => {
        this.showParam = true
      })
      let params = Object.assign({}, this.originalParams)
      this.params = Object.assign({}, params)
    }
  }
}
</script>
<style scoped>
  .rolename-width {
    max-width: 300px;
  }
  .tipcolor {
    color: #999;
  }
</style>
