<template>
  <div>
    <el-form  ref="validateForm" label-width="100px" :model="params" :rules="rules" @submit.native.prevent>
      <div style="max-height: 60vh; overflow-y: auto">
          <el-form-item label="设备编号" prop="device">
            <el-input v-model.trim="params.device" placeholder="请输入设备编号"></el-input>
          </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model.trim="params.version" placeholder="请输入版本号"></el-input>
        </el-form-item>
        <el-form-item label="动态口令" prop="password">
          <el-input v-model.trim="params.password" placeholder="请输入动态口令"></el-input>
        </el-form-item>
      </div>
      <div class="vm-text-right" style="padding-top: 20px;">
        <el-button size="medium" @click="propsInfo.show = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="submitInfo('validateForm')">确 定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import * as toolApi from '../../api/tool'
import ImgUpload from '@/components/imgUpload/index'
export default {
  mixins: [],
  components: {
    ImgUpload
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
      tableData: [],
      params: {
        device: '',
        version: '',
        password: ''
      },
      rules: {
        device: [
          { required: true, message: '请输入设备编号' }
        ],
        version: [
          { required: true, message: '请输入版本号' }
        ],
        password: [
          { required: true, message: '请输入动态口令' }
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
      toolApi.creatDynamicPswApi(this.params).then(res => {
        let msg = res.obj
        this.$alert(msg, '动态密码', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
        this.propsInfo.show = false
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .ellplist2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
