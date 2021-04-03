<template>
  <div>
    <el-form  ref="validateForm" label-width="150px" :model="params" :rules="rules" @submit.native.prevent>
      <div style="max-height: 60vh; overflow-y: auto">
          <el-form-item label="高德web服务key" prop="device">
            <el-input v-model.trim="params.gdWebServiceKey" placeholder="请输入高德web服务key"></el-input>
          </el-form-item>
        <el-form-item label="高德web端key" prop="version">
          <el-input v-model.trim="params.gdWebSideKey" placeholder="请输入高德web端key"></el-input>
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
        gdWebServiceKey: '',
        gdWebSideKey: ''
      },
      rules: {
        gdWebServiceKey: [
          { required: true, message: '高德web服务key' }
        ],
        gdWebSideKey: [
          { required: true, message: '请输入高德web端key' }
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
      toolApi.saveGaoDeKey(this.params).then(res => {
        this.$message.success(res.msg)
        /*this.$alert(msg, '动态密码', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })*/
        this.propsInfo.show = false
      }).catch(() => {
        this.$message.error(res.msg)
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
