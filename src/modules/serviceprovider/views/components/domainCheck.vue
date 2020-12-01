<template>
  <div>
    <el-form  ref="validateForm" label-width="100px" :model="params" :rules="rules" @submit.native.prevent>
      <el-form-item label="文件名称:" prop="fileName">
        <el-input v-model.trim="params.fileName" :maxlength="128" clearable></el-input>
      </el-form-item>
      <el-form-item label="文件内容:" prop="content">
        <el-input v-model.trim="params.content" :maxlength="128" clearable></el-input>
      </el-form-item>
      <el-form-item label="文件所属:" prop="type">
        <el-select v-model="params.type" placeholder="请选择" style="width: 260px;" clearable>
          <el-option label="微信" value="wx">
          </el-option>
          <el-option label="支付宝"  value="zfb">
          </el-option>
        </el-select>
        <!--<el-input v-model.trim="params.content" :maxlength="128"></el-input>-->
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
import * as commissionApi from '../../api/service_provider.js'
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
        fileName: '',
        content: '',
        type: ''
      },
      rules: {
        fileName: [
          { required: true, message: '请输入文件名' }
        ],
        content: [
          { required: true, message: '请输入文件内容' }
        ],
        type: [
          { required: true, message: '请选择文件所属' }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  created () {
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
      commissionApi.checkDomain(this.params).then(res => {
        this.$message.success('文件保存成功')
        this.propsInfo.show = false
      })
    }
  }
}
</script>
