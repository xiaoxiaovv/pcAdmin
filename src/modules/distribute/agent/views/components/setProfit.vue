<template>
  <div>
    <el-form  ref="validateForm" label-width="100px" :model="params" :rules="rules" @submit.native.prevent>
      <el-form-item label="支付方式:">
        <el-radio-group v-model="payWay">
          <el-radio class="mb10" :label="1"  v-if="payConfig.indexOf('官方') > -1">微信</el-radio>
          <el-radio class="mb10" :label="2" v-if="payConfig.indexOf('官方') > -1">支付宝</el-radio>
          <el-radio class="mb10" :label="6" v-if="payConfig.indexOf('富友') > -1">富友</el-radio>
          <el-radio class="mb10" :label="7" v-if="payConfig.indexOf('随行付') > -1">随行付</el-radio>
          <el-radio class="mb10" :label="9" v-if="payConfig.indexOf('威富通') > -1">威富通</el-radio>
          <el-radio class="mb10" :label="10" v-if="payConfig.indexOf('乐刷') > -1">乐刷</el-radio>
          <el-radio class="mb10" :label="11" v-if="payConfig.indexOf('传化') > -1">传化</el-radio>
          <el-radio class="mb10" :label="12" v-if="payConfig.indexOf('天阙随行付') > -1">天阙随行付</el-radio>
          <el-radio class="mb10" :label="13" v-if="payConfig.indexOf('易生') > -1">易生</el-radio>
          <el-radio class="mb10" :label="14" v-if="payConfig.indexOf('新大陆') > -1">新大陆</el-radio>
          <el-radio class="mb10" :label="17" v-if="payConfig.indexOf('手机pos') > -1">手机pos</el-radio>
          <el-radio class="mb10" :label="18" v-if="payConfig.indexOf('网联') > -1">网联</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="抽佣比例:" show-message prop="payProrata">
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.wxPayProrata" v-if="payWay === 1">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.zfbPayProrata" v-if="payWay === 2">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.fyPayProrata" v-if="payWay === 6">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.sxfPayProrata" v-if="payWay === 7">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.ysPayProrata" v-if="payWay === 9">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.lsPayProrata" v-if="payWay === 10">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.chPayProrata" v-if="payWay === 11">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.tqSxfPayProrata" v-if="payWay === 12">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.yiShengPayProrata" v-if="payWay === 13">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.newLandPayProrata" v-if="payWay === 14">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.posPayProrata" v-if="payWay === 17">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.quickPayProrata" v-if="payWay === 18">
        </el-input-number>
        %
        <el-tooltip class="item" effect="dark" :content="typeVal===1?tipTextA:tipTextB" placement="top-start">
          <i class="el-icon-question"></i>
        </el-tooltip>
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
// import * as commissionApi from '../../../api/commission'
import * as listApi from '@/modules/operator/api/operator.js'
import {getSystemCOnfig} from '@/modules/pay/api/pay_config'
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
    typeVal: {
      type: [Number, String],
      default: 1
    }
  },
  data () {
    const levelAlias = JSON.parse(sessionStorage.levelAlias)
    return {
      tipTextA: `${levelAlias.firstName}的分佣比例，比如填写60%，则分商户流水佣金的60%给${levelAlias.firstName}`,
      tipTextB: `${levelAlias.secondName}的分佣比例，比如填写60%，则分商户流水佣金的60%给${levelAlias.secondName}`,
      payWay: 1,
      params: {
        zfbPayProrata: null,
        wxPayProrata: null,
        sxfPayProrata: null,
        fyPayProrata: null,
        ysPayProrata: null,
        lsPayProrata: null,
        chPayProrata: null,
        tqSxfPayProrata: null,
        yiShengPayProrata: null,
        newLandPayProrata: null,
        posPayProrata:null,
        quickPayProrata:null,
        id: null
      },
      rules: {
        payWay: [
          { required: true, message: '请选择支付方式' }
        ],
        payProrata: [
          // { required: true, message: '请上传支付凭证' }
        ]
      },
      payConfig: []
    }
  },
  watch: {},
  computed: {},
  created () {
    this.params.id = this.propsInfo.data.id
    this.getDetail()
    this.getSystemCOnfigInfo()
  },
  methods: {
    getSystemCOnfigInfo () {
      getSystemCOnfig().then(res => {
        this.payConfig = [...res.obj]
      })
    },
    getDetail () {
      let params = {
        id: this.params.id
      }
      listApi.rateDetailTwo(params).then(res => {
        let newRes = Object.assign({}, res.obj)
        newRes.fyPayProrata = Number(newRes.fyPayProrata) ? Number(newRes.fyPayProrata) * 100 : 0
        newRes.sxfPayProrata = Number(newRes.sxfPayProrata) ? Number(newRes.sxfPayProrata) * 100 : 0
        newRes.wxPayProrata = Number(newRes.wxPayProrata) ? Number(newRes.wxPayProrata) * 100 : 0
        newRes.zfbPayProrata = Number(newRes.zfbPayProrata) ? Number(newRes.zfbPayProrata) * 100 : 0

        newRes.ysPayProrata = Number(newRes.ysPayProrata) ? Number(newRes.ysPayProrata) * 100 : 0
        newRes.lsPayProrata = Number(newRes.lsPayProrata) ? Number(newRes.lsPayProrata) * 100 : 0
        newRes.chPayProrata = Number(newRes.chPayProrata) ? Number(newRes.chPayProrata) * 100 : 0
        newRes.tqSxfPayProrata = Number(newRes.tqSxfPayProrata) ? Number(newRes.tqSxfPayProrata) * 100 : 0

        newRes.yiShengPayProrata = Number(newRes.yiShengPayProrata) ? Number(newRes.yiShengPayProrata) * 100 : 0
        newRes.newLandPayProrata = Number(newRes.newLandPayProrata) ? Number(newRes.newLandPayProrata) * 100 : 0
        //手机pos和网联
        newRes.posPayProrata = Number(newRes.posPayProrata) ? Number(newRes.posPayProrata) * 100 : 0
        newRes.quickPayProrata = Number(newRes.quickPayProrata) ? Number(newRes.quickPayProrata) * 100 : 0
        this.params = newRes
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
      let params = Object.assign({}, this.params)
      params.fyPayProrata = Number(params.fyPayProrata) ? Number((params.fyPayProrata / 100).toFixed(4)) : 0
      params.sxfPayProrata = Number(params.sxfPayProrata) ? Number((params.sxfPayProrata / 100).toFixed(4)) : 0
      params.wxPayProrata = Number(params.wxPayProrata) ? Number((params.wxPayProrata / 100).toFixed(4)) : 0
      params.zfbPayProrata = Number(params.zfbPayProrata) ? Number((params.zfbPayProrata / 100).toFixed(4)) : 0

      params.ysPayProrata = Number(params.ysPayProrata) ? Number((params.ysPayProrata / 100).toFixed(4)) : 0
      params.lsPayProrata = Number(params.lsPayProrata) ? Number((params.lsPayProrata / 100).toFixed(4)) : 0
      params.chPayProrata = Number(params.chPayProrata) ? Number((params.chPayProrata / 100).toFixed(4)) : 0
      params.tqSxfPayProrata = Number(params.tqSxfPayProrata) ? Number((params.tqSxfPayProrata / 100).toFixed(4)) : 0

      params.yiShengPayProrata = Number(params.yiShengPayProrata) ? Number((params.yiShengPayProrata / 100).toFixed(4)) : 0
      params.newLandPayProrata = Number(params.newLandPayProrata) ? Number((params.newLandPayProrata / 100).toFixed(4)) : 0
      //手机pos和网联
      params.posPayProrata = Number(params.posPayProrata) ? Number((params.posPayProrata / 100).toFixed(4)) : 0
      params.quickPayProrata = Number(params.quickPayProrata) ? Number((params.quickPayProrata / 100).toFixed(4)) : 0
      listApi.rateSetTwo(params).then(res => {
        this.$message.success(res.msg)
        this.propsInfo.show = false
      })
    }
  }
}
</script>
