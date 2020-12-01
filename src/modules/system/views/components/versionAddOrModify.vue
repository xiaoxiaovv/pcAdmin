<template>
  <div>
    <el-form  ref="validateForm" label-width="120px" :model="params" :rules="rules" @submit.native.prevent>
      <el-form-item label="客户端类型" prop="clientType">
        <el-select  placeholder="客户端类型"
                    size="small"
                    class="formItem"
                    clearable
                    style="width: 300px;"
                    v-model="params.clientType">
          <el-option v-for="item in statusOption"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适用版本号" prop="version">
        <el-input v-model.trim="params.version" size="medium" style="width: 300px;" placeholder="适用版本号" clearable></el-input>
      </el-form-item>
      <el-form-item label="升级状态" prop="status">
        <el-radio-group v-model="params.status">
          <el-radio :label="1">正在升级中</el-radio>
          <el-radio :label="0">完成升级</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="版本黑名单" prop="blackList">
        <el-input v-model.trim="params.blackList" size="medium" style="width: 300px;" placeholder="多个版本用逗号分割" clearable></el-input>
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
import * as versionApi from '../../api/versionManagement'
// import { levelAliasMixin } from '@/mixins'

export default {
  mixins: [],
  components: {},
  props: {
    propsInfo: {
      type: Object,
      default: function () {
        return {}
      }
    },
    statusOption: {
      type: Array,
      default: function () {
        return []
      }
    },
    statusOptionLevel: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    const regRule = /^([1-9]\d|[1-9])(\.([0-9]\d|\d)){2}$$/
    const versionValidator = (rule, value, callback, source, options) => {
      let errors = []
      let re = regRule
      if (!re.test(value)) {
        errors.push('请输入正确版本号')
      }
      callback(errors)
    }
    return {
      params: {
        clientType: '',
        name: '',
        version: '',
        status: '',
        blackList: ''
      },
      regRule: regRule,
      rules: {
        clientType: [
          { required: true, message: '请选择客户端类型' }
        ],
        version: [
          { required: true, message: '请输入适用版本号' },
          { required: true, validator: versionValidator }
        ],
        status: [
          { required: true, message: '请选择升级状态' }
        ]
      }
    }
  },
  watch: {
    'params.clientType' (val, oldVal) {
      let name = ''
      this.statusOption.forEach(item => {
        if (item.value === val) {
          name = item.name
        }
      })
      this.params.name = name
    }
  },
  computed: {
  },
  created () {
    if (this.propsInfo.type === 2) {
      // 编辑
      this.params.id = this.propsInfo.data.id
      this.params.name = this.propsInfo.data.name
      this.params.version = this.propsInfo.data.version
      this.params.status = this.propsInfo.data.status
      this.params.blackList = this.propsInfo.data.blackList
      this.params.clientType = this.propsInfo.data.clientType
    }
  },
  methods: {
    submitInfo (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.params.blackList) {
            let blackListArr = this.params.blackList.split(',')
            let errNo = 0
            for (let i = 0; i < blackListArr.length; i++) {
              if (!this.regRule.test(blackListArr[i])) {
                errNo += 1
              }
            }
            if (errNo) {
              this.$message.warning('请输入正确的版本黑名单')
              return false
            }
          }
          if (this.propsInfo.type === 1) {
            // 新增
            this.addConfirmSubmit()
          } else {
            // 修改
            this.modifyConfirmSubmit()
          }
          // this.confirmSubmit()
        } else {
          return false
        }
      })
    },
    /**
     * 新增
     */
    addConfirmSubmit () {
      versionApi.versionAdd(this.params).then(res => {
        this.$message.success('新增成功')
        this.successCall()
      })
    },
    /**
     * 修改
     */
    modifyConfirmSubmit () {
      versionApi.versionEdit(this.params).then(res => {
        this.$message.success('修改成功')
        this.successCall()
      })
    },
    successCall () {
      this.propsInfo.show = false
      this.$emit('getTableList')
    }
  }
}
</script>

<style scoped>
</style>
