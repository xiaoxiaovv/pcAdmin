<template>
  <div class="app-container" v-loading="loading">
    <el-form  ref="validateForm" label-width="150px" :model="params" :rules="rules" @submit.native.prevent>
      <el-form-item label="状态:" prop="status">
        <el-switch v-model="params.status"
                   :active-value="1"
                   :inactive-value="0">
        </el-switch>
        <span class="tipcolor">{{params.status?'启用':'禁用'}}</span>
      </el-form-item>
      <el-form-item :label="`${levelAlias.oemName}别名`">
        <el-input size="medium"
                  :placeholder="`${levelAlias.oemName}别名`"
                  :maxlength="8"
                  class="rolename-width"
                  v-model.trim="params.oemName"></el-input>
      </el-form-item>
      <el-form-item :label="`${levelAlias.firstName}别名`">
        <el-input size="medium"
                  :placeholder="`${levelAlias.firstName}别名`"
                  :maxlength="8"
                  class="rolename-width"
                  v-model.trim="params.firstName"></el-input>
      </el-form-item>
      <el-form-item :label="`${levelAlias.secondName}别名`">
        <el-input size="medium"
                  :placeholder="`${levelAlias.secondName}别名`"
                  :maxlength="8"
                  class="rolename-width"
                  v-model.trim="params.secondName"></el-input>
      </el-form-item>
      <el-form-item :label="`${levelAlias.thirdName}别名`">
        <el-input size="medium"
                  :placeholder="`${levelAlias.thirdName}别名`"
                  :maxlength="8"
                  class="rolename-width"
                  v-model.trim="params.thirdName"></el-input>
      </el-form-item>
      <el-form-item style="margin-bottom:0;">
        <div>
          <el-button size="medium" @click="propsInfo.show = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="submitInfo('validateForm')">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
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
    const levelAlias = JSON.parse(sessionStorage.levelAlias)
    return {
      loading: true, // loading效果
      params: {
        status: 1,
        oemName: '',
        firstName: '',
        secondName: '',
        thirdName: ''
      },
      rules: {
        oemName: [
          { required: true, message: `请输入${levelAlias.oemName}别名` }
        ],
        firstName: [
          { required: true, message: `${levelAlias.firstName}别名` }
        ],
        secondName: [
          { required: true, message: `${levelAlias.secondName}别名` }
        ],
        thirdName: [
          { required: true, message: `${levelAlias.thirdName}别名` }
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
      roleApi.getNameCofig(this.params).then(res => {
        this.loading = false
        if (res.obj) {
          this.params = Object.assign({}, res.obj)
        }
      }).catch(() => {
        this.loading = false
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
      roleApi.saveNameCofig(params).then(res => {
        if (this.params.status) {
          params.oemName = params.oemName || '服务商'
          params.firstName = params.firstName || '一级代理商'
          params.secondName = params.secondName || '二级代理商'
          params.thirdName = params.thirdName || '三级代理商'
          sessionStorage.levelAlias = JSON.stringify(params)
        } else {
          let params = {
            oemName: '服务商',
            firstName: '一级代理商',
            secondName: '二级代理商',
            thirdName: '三级代理商'
          }
          sessionStorage.levelAlias = JSON.stringify(params)
        }
        this.$message.success('保存成功')
        window.location.reload()
      })
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
