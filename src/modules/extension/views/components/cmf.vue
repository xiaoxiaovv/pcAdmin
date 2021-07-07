<template>
  <div>
    <el-form  ref="validateForm" label-width="150px" :model="params" :rules="rules" @submit.native.prevent>
      <div style="max-height: 60vh; overflow-y: auto">
        <el-form-item label="插件秘钥" prop="cmfKey">
          <el-input v-model.trim="params.cmfKey" placeholder="请输入插件秘钥"></el-input>
        </el-form-item>
        <el-form-item label="插件合作商id" prop="cmfAgentId">
          <el-input v-model.trim="params.cmfAgentId" placeholder="请输入插件合作商id"></el-input>
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
        cmfKey: '',
        cmfAgentId:''
      },
      rules: {
        cmfKey: [
          { required: true, message: '请输入插件秘钥' }
        ],
        cmfAgentId: [
          { required: true, message: '请输入插件合作商id' }
        ],

      }
    }
  },
  watch: {},
  computed: {},
  created () {
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData(){
      let companyId = sessionStorage.getItem("companyId")
      toolApi.getAliKey(companyId).then(res => {
        // this.$message.success(res.msg)
        this.params.cmfKey = res.obj.cmfKey;
        this.params.cmfAgentId = res.obj.cmfAgentId;
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
