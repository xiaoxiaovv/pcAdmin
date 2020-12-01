<template>
  <div>
    <el-form  ref="validateForm" label-width="100px" :model="params" :rules="rules" @submit.native.prevent>
      <el-form-item label="结算费率:" prop="rate" v-if="propsInfo.channel !== 3">
        <el-input-number :precision="2" :min="0.01" :max="1" :step="0.01" v-model="params.rate">
        </el-input-number>%
      </el-form-item>
      <el-form-item label="阿里费率:" prop="leAliRate" v-if="propsInfo.channel === 3">
        <el-input-number :precision="2" :min="0.01" :max="1" :step="0.01" v-model="params.leAliRate">
        </el-input-number>%
      </el-form-item>
      <el-form-item label="微信费率:" prop="leWxRate" v-if="propsInfo.channel === 3">
        <el-input-number :precision="2" :min="0.01" :max="1" :step="0.01" v-model="params.leWxRate">
        </el-input-number>%
      </el-form-item>
      <el-form-item style="margin-bottom: 0;">
        <div class="vm-text-right">
          <el-button size="medium" @click="propsInfo.show = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="submitInfo('validateForm')">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as detailApi from '../../api/detail.js'
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
        rate: undefined,
        leAliRate: undefined,
        leWxRate: undefined
      },
      rules: {
        rate: [
          { required: true, message: '请输入费率' }
        ],
        leAliRate: [
          { required: true, message: '请输入阿里费率' }
        ],
        leWxRate: [
          { required: true, message: '请输入微信费率' }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  created () {
    this.params.rate = this.propsInfo.rate
    // this.params.id = this.propsInfo.detail.id
    // this.params.status = this.propsInfo.status
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
        id: this.propsInfo.detail.id,
        channel: this.propsInfo.channel
      }
      if (this.propsInfo.channel !== 3) {
        params.rate = this.params.rate
      } else {
        params.leAliRate = this.params.leAliRate
        params.leWxRate = this.params.leWxRate
      }
      detailApi.setRate(params).then(res => {
        this.$message.success('修改成功')
        this.$emit('refresh')
        this.propsInfo.show = false
      })
    }
  }
}
</script>
