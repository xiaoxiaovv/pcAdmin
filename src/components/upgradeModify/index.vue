<template>
  <div>
    <el-form  ref="validateForm" label-width="100px" style="margin-right: 30px;"  :model="params" :rules="rules" @submit.native.prevent>
      <!--<div class="setlogo-title">网站登录后左上角LOGO</div>-->
      <el-form-item label="代理名称:">
        <span>{{gradeInfo.companyName}}</span>
      </el-form-item>
      <el-form-item label="原上级代理:">
        <span>{{gradeInfo.formerCompanyName}}</span>
      </el-form-item>
      <el-form-item label="修改为:" prop="targetCompanyId">
        <el-select v-model="params.targetCompanyId" placeholder="请选择" clearable>
          <el-option  v-for="item in gradeInfo.targetComapnyList"
                      :key="item.targetCompanyId"
                      :label="item.targetCompanyName"
                      :value="item.targetCompanyId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <div class="vm-text-right">
          <el-button size="medium" @click="propsInfo.show = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="submitInfo('validateForm')">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import * as commissionApi from '../../../api/commission'
import * as upgradeApi from '@/api/common.js'
export default {
  mixins: [],
  components: {
  },
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
      gradeInfo: {},
      params: {
        targetCompanyId: null
      },
      rules: {
        targetCompanyId: [
          { required: true, message: '请选择要升级到的代理' }
        ]
      },
      options: []
    }
  },
  watch: {},
  computed: {},
  created () {
    this.getGradeInfo()
  },
  methods: {
    getGradeInfo () {
      let params = {
        companyId: this.propsInfo.data.id
      }
      upgradeApi.getChangeUpgradeInfo(params).then(res => {
        this.gradeInfo = Object.assign({}, res.obj)
      })
    },
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
      let params = Object.assign({}, this.params)
      params.presentCompanyId = this.propsInfo.data.id
      upgradeApi.changeUpgradeCompanyInfo(params).then(res => {
        this.$message.success('修改成功')
        this.$emit('refresh')
        this.propsInfo.show = false
      })
    }
  }
}
</script>
