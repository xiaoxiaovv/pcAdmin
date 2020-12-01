<template>
  <div>
    <el-form  ref="validateForm" label-width="100px" style="margin-right: 30px;"  :model="params" :rules="rules" @submit.native.prevent>
      <!--<div class="setlogo-title">网站登录后左上角LOGO</div>-->
      <el-form-item label="代理名称:">
        <span>{{gradeInfo.companyName}}</span>
      </el-form-item>
      <el-form-item label="代理级别:">
        <span>{{gradeInfo.companyType}}</span>
      </el-form-item>
      <el-form-item label="升级为:" prop="companyType">
        <el-select v-model="params.companyType" placeholder="请选择" clearable>
          <el-option  v-for="item in gradeInfo.gradeVoList"
                      :key="item.gradeId"
                      :label="item.gradeName"
                      :value="item.gradeId">
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
        companyType: null
      },
      rules: {
        companyType: [
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
      upgradeApi.getUpgradeInfo(params).then(res => {
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
      params.companyId = this.propsInfo.data.id
      upgradeApi.saveUpgradeInfo(params).then(res => {
        this.$message.success('设置升级成功')
        this.$emit('refresh')
        this.propsInfo.show = false
      })
    }
  }
}
</script>
