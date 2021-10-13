<template>
  <div>
    <el-form  ref="validateForm" label-width="150px" :model="params" :rules="rules" @submit.native.prevent>
      <div style="max-height: 60vh; overflow-y: auto">
          <el-form-item label="支付宝公钥" prop="aliPublicKey">
            <el-input v-model.trim="params.aliPublicKey" placeholder="请输入支付宝公钥"></el-input>
          </el-form-item>
        <el-form-item label="支付宝私钥" prop="privateKey">
          <el-input v-model.trim="params.privateKey" placeholder="请输入支付宝私钥"></el-input>
        </el-form-item>
        <el-form-item label="appId" prop="appId">
          <el-input v-model.trim="params.appId" placeholder="请输入支付宝appId"></el-input>
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
    },
    keyType: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {

      tableData: [],
      params: {
        aliPublicKey: '',
        privateKey: '',
        appId: ''
      },
      rules: {
        aliPublicKey: [
          { required: true, message: '请输入支付宝公钥' }
        ],
        privateKey: [
          { required: true, message: '请输入支付宝私钥' }
        ],
        appId: [
          { required: true, message: '请输入支付宝appId' }
        ]

      }
    }
  },
  watch: {},
  computed: {},
  created () {
  },
  mounted () {
    this.getGaoDeKey()
  },
  methods: {
    getGaoDeKey(){
      let keyType = this.keyType
      toolApi.getAliXCXKey(keyType).then(res => {
        // this.$message.success(res.msg)
        this.params.aliPublicKey = res.obj.aliPublicKey;
        this.params.privateKey = res.obj.privateKey;
        this.params.appId = res.obj.appId;

      }).catch(() => {
        this.$message.error(res.msg)
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
      toolApi.saveAliKey(this.params).then(res => {
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
