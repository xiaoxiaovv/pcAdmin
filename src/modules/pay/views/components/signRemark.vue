<template>
  <div>
    <el-form  ref="validateForm" label-width="100px" :model="params" :rules="rules" @submit.native.prevent>
      <el-form-item label="驳回原因:" prop="remark">
        <el-input v-model.trim="params.remark"
                  :maxlength="200"
                  type="textarea"
                  :rows="3"></el-input>
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
import * as signApi from '@/modules/merchant/agent/api/merchantInfo'
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
      params: {
        remark: '',
        id: '',
        status: ''
      },
      rules: {
        remark: [
          // { required: true, message: '请输入文件名' }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  created () {
    this.params.id = this.propsInfo.data.id
    this.params.status = this.propsInfo.status
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
      signApi.sign(this.params).then(res => {
        this.$message.success('驳回成功')
        this.$emit('getTableList')
        this.propsInfo.show = false
      })
    }
  }
}
</script>
