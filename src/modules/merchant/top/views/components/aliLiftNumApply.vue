<template>
  <div>
    <el-form  ref="validateForm" label-width="150px" :model="params" :rules="rules" @submit.native.prevent  style="max-height: 50vh;overflow: auto" :disabled="(statusInfo.orderStatus === 2 ||statusInfo.orderStatus === 3 || statusInfo.orderStatus === 4)">
      <el-form-item label="经营类目：" prop="oneLevel">
        <el-input v-model.trim="params.oneLevel" style="display: none;"></el-input>
        <AliLifeCate ref="aliLifeCateEle" v-model="cateArr" placeholder="请选择经营类目" :width="'300px'" size="medium" :disabled="!editStatus"></AliLifeCate>
        <!--
        <el-cascader placeholder="请选择经营类目"
                     style="width: 300px;"
                     size="medium"
                     v-model="cateArr"
                     :options="categoryTree"></el-cascader>-->
      </el-form-item>
      <el-form-item label="生活号名称：" prop="publicName">
        <el-input v-model.trim="params.publicName" size="medium" style="width: 300px;" placeholder="最多20字" :maxlength="20" :disabled="!editStatus" clearable></el-input>
        <el-input v-model.trim="params.publicName" style="display: none;"></el-input>
        <div class="alilisttip">审核通过后终身仅允许修改1次，请谨慎填写(支付宝官方进行修改)</div>
        <div class="alilisttip">建议填写与行业类目相关联的信息</div>
      </el-form-item>
      <el-form-item label="设置头像：" prop="logoPic">
        <ImgUpload v-model="params.logoPic" :urlType="1" :delPower="editStatus"></ImgUpload>
        <el-input v-model.trim="params.logoPic" style="display: none;"></el-input>
        <div class="alilisttip">审核通过后每月有1次修改机会(支付宝官方进行修改)</div>
        <div class="alilisttip">建议尺寸320*320px,支持jpg、jpeg、png格式，小于1M</div>
      </el-form-item>
      <el-form-item label="设置背景图：" prop="backgroundPic">
        <ImgUpload v-model="params.backgroundPic" :urlType="1" :delPower="editStatus"></ImgUpload>
        <el-input v-model.trim="params.backgroundPic" style="display: none;"></el-input>
        <div class="alilisttip">审核通过后每月有1次修改机会(支付宝官方进行修改)</div>
        <div class="alilisttip">建议尺寸1600*1000px,支持jpg、jpeg、png格式，小于1M</div>
      </el-form-item>
      <el-form-item label="简介：" prop="publicDesc">
        <el-input v-model.trim="params.publicDesc"  :disabled="!editStatus"  type="textarea" :rows="3" size="medium" style="width: 300px;vertical-align: baseline;" placeholder="最多100字" :maxlength="100" clearable></el-input><span class="publicdesc-len">{{params.publicDesc?params.publicDesc.length:0}}/100</span>
        <div class="alilisttip" style="margin-top: -15px;">填写生活号提供服务内容与范围</div>
      </el-form-item>
      <el-form-item label="状态：">
        <div>{{statusInfo.orderStatusBizDesc}} {{statusInfo.refusedReason}} {{statusInfo.subMsg}}</div>
      </el-form-item>
      <el-form-item>
      </el-form-item>
    </el-form>
    <div class="vm-text-right">
      <el-button size="medium" @click="propsInfo.open = false">取 消</el-button>
      <el-button size="medium" type="primary" @click="submitInfo('validateForm')">申请并开通</el-button>
    </div>
  </div>
</template>

<script>
import * as merchantApi from '../../api/merchant.js'
import ImgUpload from '@/components/imgUpload/index'
import AliLifeCate from './categoryTree.vue'
export default {
  components: {
    ImgUpload,
    AliLifeCate
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
      cateArr: [],
      categoryTree: [],
      params: {
        oneLevel: '123', // 经营类目--一级
        secondLevel: '', // 经营类目--二级
        thirdLevel: '', // 经营类目--三级
        publicName: '', // 生活号名称
        logoPic: '', // 设置头像
        backgroundPic: '', // 设置背景图
        publicDesc: '' // 简介
      },
      orignalParams: {},
      rules: {
        oneLevel: [
          { required: true, message: '请选择经营类目' }
        ],
        publicName: [
          { required: true, message: '请输入生活号名称' }
        ],
        logoPic: [
          { required: true, message: '请设置头像' }
        ],
        backgroundPic: [
          { required: true, message: '请设置背景图' }
        ],
        publicDesc: [
          { required: true, message: '请输入简介' }
        ]
      },
      statusInfo: {}
    }
  },
  watch: {
    'cateArr' (val, oldVal) {
      val = val || []
      this.params.oneLevel = val[0]
      this.params.secondLevel = val[1]
      this.params.thirdLevel = val[2]
    }
  },
  computed: {
    editStatus() {
      let status = true
      if (this.statusInfo.orderStatus) {
        if (this.statusInfo.orderStatus === 2 || this.statusInfo.orderStatus === 3 || this.statusInfo.orderStatus === 4) {
          status = false
        }
      }
      return status
    }
  },
  created () {
    this.getAliLifeAppInfo() // 先获取详情，在获取状态
  },
  methods: {
    /**
     * 获取生活号信息
     */
    getAliLifeAppInfo () {
      let params = {
        merchantId: this.propsInfo.data.id
      }
      merchantApi.getAliLifeInfo(params).then(res => {
        this.getAliLifeStatusInfo(res.obj.id)
        if (res.obj.publicName) {
          // 编辑
          this.params = Object.assign({}, res.obj)
        }
        this.orignalParams = Object.assign({}, res.obj)
        if (res.obj.oneLevel) {
          this.cateArr.push(res.obj.oneLevel)
        }
        if (res.obj.secondLevel) {
          this.cateArr.push(res.obj.secondLevel)
        }
        if (res.obj.thirdLevel) {
          this.cateArr.push(res.obj.thirdLevel)
        }
      })
    },
    /**
     * 获取生活号信息状态
     * @param formName
     */
    getAliLifeStatusInfo (id) {
      let params = {
        serviceInfoId: id
      }
      merchantApi.getAliLifeStatus(params).then(res => {
        // orderStatus 1-暂存 2-审核中 3-确认 4-成功 5-失败
        this.statusInfo = res.obj
      })
    },
    /**
     * 保存支付宝生活号信息
     * @param formName
     */
    submitInfo (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmSubmit()
        } else {
          return false
        }
      })
    },
    /**
     * 确认提交
     */
    confirmSubmit () {
      let params = Object.assign({}, this.orignalParams)
      params = Object.assign(params, this.params)
      let checkedNodes = this.$refs.aliLifeCateEle.getCheckedNodes()
      console.log('checkedNodes', checkedNodes)
      params.oneLevel = checkedNodes[0].pathLabels[0]
      params.secondLevel = checkedNodes[0].pathLabels[1]
      params.thirdLevel = checkedNodes[0].pathLabels[2]
      merchantApi.editComissionStatus(params).then(res => {
        this.openAliLife()
      })
    },
    openAliLife () {
      let params = {
        serviceInfoId: this.orignalParams.id
      }
      merchantApi.openAliApply(params).then(res => {
        // 1-暂存 2-审核中 3-确认 4-成功 5-失败
        if (res.obj && res.obj.orderStatus) {
          if (res.obj.orderStatus === 1 || res.obj.orderStatus === 2 || res.obj.orderStatus === 3 || res.obj.orderStatus === 5) {
            let msg = (res.obj.orderStatusBizDesc || '') + ' ' + (res.obj.refusedReason || '') + ' ' + (res.obj.subMsg || '') || '操作成功，但开通异常'
            this.$message.warning(msg)
          } else {
            this.$message.success('操作成功')
          }
        } else {
          this.$message.warning('操作失败')
        }
        this.getAliLifeStatusInfo(this.orignalParams.id)
      })
    }
  }
}
</script>
<style scoped>
  .el-button--medium{
    margin-right: 10px;
  }
  .el-button + .el-button {
    margin-left: 0;
    margin-right:10px;
  }
  /*图片上传*/
  .logo-uploader {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    height: 102px;
    overflow: hidden;
    background-color: #f8f8f8;
  }

  .logo-uploader:hover {
    border-color: #409EFF;
  }

  .logo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px !important;
    height: 100px !important;
    line-height: 100px;
    text-align: center;
  }

  .logo {
    width: 100px;
    height: 100px;
    display: block;
  }

  .advtips-img {
    margin-left: 10px;
    color: #3ebdff;
    opacity: 0.8;
    cursor: pointer;
  }
  .advtips-img:hover {
    opacity: 1;
  }
</style>
