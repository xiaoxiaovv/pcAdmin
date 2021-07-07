<template>
  <div>
    <el-form  ref="validateForm" label-width="150px" :model="params" :rules="rules" @submit.native.prevent>
      <div style="max-height: 60vh; overflow-y: auto">
        <el-form-item label="邮箱地址" prop="emails">
          <el-input v-model.trim="params.emails" placeholder="请输入邮箱地址,英文逗号分隔"></el-input>
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
        emails: '',
      },
      rules: {
        emails: [
          { required: true, message: '请输入邮箱地址' },
          // { pattern: /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/, required: true, message: "邮箱格式错误", trigger: "blur" },
          { pattern: /^((([a-z0-9_.-]+)@([\da-z.-]+).([a-z.]{2,6},))*(([a-z0-9_.-]+)@([\da-z.-]+).([a-z.]{2,6})))$/, required: true, message: "格式错误", trigger: "blur" },
          
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
      toolApi.getGaoDeKey(companyId).then(res => {
        // this.$message.success(res.msg)
        this.params.emails = res.obj.emails;
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
      toolApi.saveEmails(this.params).then(res => {
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
