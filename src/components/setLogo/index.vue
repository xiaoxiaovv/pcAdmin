<template>
  <div>
    <el-form  ref="validateForm" label-width="120px" :model="params" :rules="rules" @submit.native.prevent>
      <!--<div class="setlogo-title">网站登录后左上角LOGO</div>-->
      <el-form-item label="LOGO:" prop="logo">
        <ImgUpload v-model="params.logo" :urlType="1"></ImgUpload><el-button type="text" @click="viewImg(logoDemoImg)">查看示例图</el-button>
        <el-input v-model="params.logo" style="display: none;"></el-input>
        <div>建议尺寸：200*60</div>
      </el-form-item>
      <el-form-item>
        <div class="vm-text-right">
          <el-button size="medium" @click="propsInfo.show = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="submitInfo('validateForm')">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!--图片预览-->
    <ImgView :propImgView="dialogImgViewData" v-if="dialogImgViewData.show"></ImgView>
  </div>
</template>

<script>
// import * as commissionApi from '../../../api/commission'
import ImgUpload from '@/components/imgUpload/index'
import ImgView from '@/components/imgView/index'
import logoDemoImg from '@/assets/images/index/logo-set-demo.png'
export default {
  mixins: [],
  components: {
    ImgUpload,
    ImgView
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
      logoDemoImg: logoDemoImg,
      params: {
        logo: null
      },
      rules: {
        logo: [
          // { required: true, message: '请选择logo' }
        ]
      },
      // 图片预览
      dialogImgViewData: {}
    }
  },
  watch: {},
  computed: {},
  created () {
    this.params.logo = this.propsInfo.data.logo
  },
  methods: {
    /**
     * 图片预览
     * @param item
     */
    viewImg (item) {
      this.dialogImgViewData = {
        show: true,
        url: item
      }
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
      this.$emit('modifyLogo', this.params.logo || null)
    }
  }
}
</script>
