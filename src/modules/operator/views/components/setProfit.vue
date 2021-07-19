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
          <el-radio class="mb10" :label="18" v-if="payConfig.indexOf('网联') > -1">快捷支付</el-radio>
          <el-radio class="mb10" :label="19" v-if="payConfig.indexOf('开店宝') > -1">开店宝</el-radio>
          <el-radio class="mb10" :label="20" v-if="payConfig.indexOf('畅捷支付') > -1">畅捷</el-radio>
          <el-radio class="mb10" :label="21" v-if="payConfig.indexOf('敏付') > -1">敏付</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--<el-form-item label="抽佣比例:" show-message prop="payProrata">
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.wxPayProrata" v-show="payWay === 1000">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.zfbPayProrata" v-show="payWay === 2000">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.fyPayProrata" v-show="payWay === 6000">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.sxfPayProrata" v-show="payWay === 7000">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.ysPayProrata" v-show="payWay === 9000">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.lsPayProrata" v-show="payWay === 1000">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.chPayProrata" v-show="payWay === 1100">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.tqSxfPayProrata" v-show="payWay === 1200">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.yiShengPayProrata" v-show="payWay === 1300">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.newLandPayProrata" v-show="payWay === 1400">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.posPayProrata" v-show="payWay === 1700">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.quickPayProrata" v-show="payWay === 1800">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.kdbPayProrata" v-show="payWay === 1900">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.chanpayPayProrata" v-show="payWay === 2000">
        </el-input-number>
        %
        <el-tooltip class="item" effect="dark" :content="tipText" placement="top-start">
          <i class="el-icon-question"></i>
        </el-tooltip>
      </el-form-item>-->
      <el-form-item label="抽佣费率:" show-message prop="payProrata">
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.wxPayRate" v-if="payWay === 1">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.zfbPayRate" v-if="payWay === 2">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.fyPayRate" v-if="payWay === 6">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.sxfPayRate" v-if="payWay === 7">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.ysPayRate" v-if="payWay === 9">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.lsPayRate" v-if="payWay === 10">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.chPayRate" v-if="payWay === 11">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.tqSxfPayRate" v-if="payWay === 12">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.yiShengPayRate" v-if="payWay === 13">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.newLandPayRate" v-if="payWay === 14">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.posPayRate" v-if="payWay === 17">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.quickPayRate" v-if="payWay === 18">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.kdbPayRate" v-if="payWay === 19">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.chanpayPayRate" v-if="payWay === 20">
        </el-input-number>
        <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.mfPayRate" v-if="payWay === 21">
        </el-input-number>
        %

        <!--<el-tooltip class="item" effect="dark" :content="tipText" placement="top-start">
          <i class="el-icon-question"></i>
        </el-tooltip>-->
        <!--<el-tooltip class="item" effect="dark" :content="typeVal===1?tipTextA:tipTextB" placement="top-start">
          <i class="el-icon-question"></i>
        </el-tooltip>-->

       <!-- <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="params.chanpayPayRate" v-if="payWay === 20">
        </el-input-number>-->
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
import * as listApi from '../../api/operator.js'
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

    return {
      // tipTextA: `${levelAlias.firstName}的分佣比例，比如填写60%，则分商户流水佣金的60%给${levelAlias.firstName}`,
      // tipTextB: `${levelAlias.secondName}的分佣比例，比如填写60%，则分商户流水佣金的60%给${levelAlias.secondName}`,
      // tipText:'',
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
        unionPayProrata:null,
        posPayProrata:null,
        quickPayProrata:null,
        kdbPayProrata:null,
        chanpayPayProrata:null,
        // 费率分佣
        zfbPayRate: null,
        wxPayRate: null,
        sxfPayRate: null,
        fyPayRate: null,
        ysPayRate: null,
        lsPayRate: null,
        chPayRate: null,
        tqSxfPayRate: null,
        yiShengPayRate: null,
        newLandPayRate: null,
        posPayRate:null,
        quickPayRate:null,
        kdbPayRate:null,
        chanpayPayRate:null,
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
  mounted () {
    // this.setTipText()
  },
  watch: {},
  computed: {},
  created () {
    this.params.id = this.propsInfo.data.id
    this.getDetail()
    this.getSystemCOnfigInfo()
  },
  methods: {
    /*setTipText(){
      // const levelAlias = JSON.parse(sessionStorage.levelAlias)
      // let str = '的分佣比例，比如填写60%，则分商户流水佣金的60%给'
      if(this.typeVal === 1){
        // this.tipText = `${levelAlias.firstName}${str}${levelAlias.firstName}`;
      }else if(this.typeVal === 2){
        // this.tipText = `${levelAlias.secondName}${str}${levelAlias.secondName}`;
      }else if(this.typeVal === 3){
        // this.tipText = `${levelAlias.thirdName}${str}${levelAlias.thirdName}`;
      }
    },*/
    getSystemCOnfigInfo () {
      getSystemCOnfig().then(res => {
        this.payConfig = [...res.obj]
      })
    },
    getDetail () {
      let that = this;
      let params = {
        id: this.params.id
      }
      function rateDetail(res){
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
        newRes.unionPayProrata = Number(newRes.unionPayProrata) ? Number(newRes.unionPayProrata) * 100 : 0
        //手机pos和网联
        newRes.posPayProrata = Number(newRes.posPayProrata) ? Number(newRes.posPayProrata) * 100 : 0
        newRes.quickPayProrata = Number(newRes.quickPayProrata) ? Number(newRes.quickPayProrata) * 100 : 0
        newRes.kdbPayProrata = Number(newRes.kdbPayProrata) ? Number(newRes.kdbPayProrata) * 100 : 0
        newRes.chanpayPayProrata = Number(newRes.chanpayPayProrata) ? Number(newRes.chanpayPayProrata) * 100 : 0
        newRes.lakalaPayProrata = Number(newRes.lakalaPayProrata) ? Number(newRes.lakalaPayProrata) * 100 : 0
        //费率分佣
        newRes.fyPayRate = Number(newRes.fyPayRate) ? Number(newRes.fyPayRate) * 100 : 0
        newRes.sxfPayRate = Number(newRes.sxfPayRate) ? Number(newRes.sxfPayRate) * 100 : 0
        newRes.wxPayRate = Number(newRes.wxPayRate) ? Number(newRes.wxPayRate) * 100 : 0
        newRes.zfbPayRate = Number(newRes.zfbPayRate) ? Number(newRes.zfbPayRate) * 100 : 0

        newRes.ysPayRate = Number(newRes.ysPayRate) ? Number(newRes.ysPayRate) * 100 : 0
        newRes.lsPayRate = Number(newRes.lsPayRate) ? Number(newRes.lsPayRate) * 100 : 0
        newRes.chPayRate = Number(newRes.chPayRate) ? Number(newRes.chPayRate) * 100 : 0
        newRes.tqSxfPayRate = Number(newRes.tqSxfPayRate) ? Number(newRes.tqSxfPayRate) * 100 : 0

        newRes.yiShengPayRate = Number(newRes.yiShengPayRate) ? Number(newRes.yiShengPayRate) * 100 : 0
        newRes.newLandPayRate = Number(newRes.newLandPayRate) ? Number(newRes.newLandPayRate) * 100 : 0
        newRes.unionPayRate = Number(newRes.unionPayRate) ? Number(newRes.unionPayRate) * 100 : 0

        //手机pos和网联
        newRes.posPayRate = Number(newRes.posPayRate) ? Number(newRes.posPayRate) * 100 : 0
        newRes.quickPayRate = Number(newRes.quickPayRate) ? Number(newRes.quickPayRate) * 100 : 0
        newRes.kdbPayRate = Number(newRes.kdbPayRate) ? Number(newRes.kdbPayRate) * 100 : 0
        newRes.chanpayPayRate = Number(newRes.chanpayPayRate) ? Number(newRes.chanpayPayRate) * 100 : 0
        newRes.lakalaPayRate = Number(newRes.lakalaPayRate) ? Number(newRes.lakalaPayRate) * 100 : 0
        that.params = newRes
      };

      if(this.typeVal === 1){
        listApi.rateDetail(params).then(res => {
          rateDetail(res)
        })
      }else if(this.typeVal === 2){
        listApi.rateDetailTwo(params).then(res => {
          rateDetail(res)
        })
      }else if(this.typeVal === 3){
        listApi.rateDetailThree(params).then(res => {
          rateDetail(res)
        })
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
      params.unionPayProrata = Number(params.unionPayProrata) ? Number((params.unionPayProrata / 100).toFixed(4)) : 0

      //手机pos和网联
      params.posPayProrata = Number(params.posPayProrata) ? Number((params.posPayProrata / 100).toFixed(4)) : 0
      params.quickPayProrata = Number(params.quickPayProrata) ? Number((params.quickPayProrata / 100).toFixed(4)) : 0
      params.kdbPayProrata = Number(params.kdbPayProrata) ? Number((params.kdbPayProrata / 100).toFixed(4)) : 0
      params.chanpayPayProrata = Number(params.chanpayPayProrata) ? Number((params.chanpayPayProrata / 100).toFixed(4)) : 0
      //费率分佣
      params.unionPayRate = Number(params.unionPayRate) ? Number((params.unionPayRate / 100).toFixed(4)) : 0
      params.fyPayRate = Number(params.fyPayRate) ? Number((params.fyPayRate / 100).toFixed(4)) : 0
      params.sxfPayRate = Number(params.sxfPayRate) ? Number((params.sxfPayRate / 100).toFixed(4)) : 0
      params.wxPayRate = Number(params.wxPayRate) ? Number((params.wxPayRate / 100).toFixed(4)) : 0
      params.zfbPayRate = Number(params.zfbPayRate) ? Number((params.zfbPayRate / 100).toFixed(4)) : 0

      params.ysPayRate = Number(params.ysPayRate) ? Number((params.ysPayRate / 100).toFixed(4)) : 0
      params.lsPayRate = Number(params.lsPayRate) ? Number((params.lsPayRate / 100).toFixed(4)) : 0
      params.chPayRate = Number(params.chPayRate) ? Number((params.chPayRate / 100).toFixed(4)) : 0
      params.tqSxfPayRate = Number(params.tqSxfPayRate) ? Number((params.tqSxfPayRate / 100).toFixed(4)) : 0

      params.yiShengPayRate = Number(params.yiShengPayRate) ? Number((params.yiShengPayRate / 100).toFixed(4)) : 0
      params.newLandPayRate = Number(params.newLandPayRate) ? Number((params.newLandPayRate / 100).toFixed(4)) : 0
      //手机pos和网联
      params.posPayRate = Number(params.posPayRate) ? Number((params.posPayRate / 100).toFixed(4)) : 0
      params.quickPayRate = Number(params.quickPayRate) ? Number((params.quickPayRate / 100).toFixed(4)) : 0
      params.kdbPayRate = Number(params.kdbPayRate) ? Number((params.kdbPayRate / 100).toFixed(4)) : 0
      params.chanpayPayRate = Number(params.chanpayPayRate) ? Number((params.chanpayPayRate / 100).toFixed(4)) : 0
      params.lakalaPayRate = Number(params.lakalaPayRate) ? Number((params.lakalaPayRate / 100).toFixed(4)) : 0
      if(this.typeVal === 1){
        listApi.rateSet(params).then(res => {
          this.$message.success(res.msg)
          this.propsInfo.show = false
        })
      }else if(this.typeVal === 2){
        listApi.rateSetTwo(params).then(res => {
          this.$message.success(res.msg)
          this.propsInfo.show = false
        })
      }else if(this.typeVal === 3){
        listApi.rateSetThree(params).then(res => {
          this.$message.success(res.msg)
          this.propsInfo.show = false
        })
      }

    }
  }
}
</script>
