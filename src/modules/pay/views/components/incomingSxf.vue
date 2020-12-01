<template>
  <div class="incoming-form">
    <el-form style="margin-top: -10px;" ref="validateForm" label-width="200px" :model="params" :rules="rules" :disabled="propsInfo.status === 2 || propsInfo.status === 3" @submit.native.prevent>
      <div class="el-form-body">
        <div class="class-title">基础资料</div>
        <!--
        <el-form-item label="营业执照注册:" prop="businessLicenseName">
          <el-input v-model.trim="params.businessLicenseName" placeholder="请输入营业执照注册" size="small"></el-input>
        </el-form-item>
        <el-form-item label="经营地址:" prop="regDistCd" required>
          <ProviceCascader v-model="cityArr" placeholder="请选择经营地址" size="small"></ProviceCascader>
          <el-input v-model.trim="params.regDistCd" style="display: none;"></el-input>
        </el-form-item>
        -->
        <!--
        <el-form-item label="详细地址:" prop="title">
          <el-input v-model.trim="params.licence" placeholder="请输入详细地址" size="small"></el-input>
        </el-form-item>
        -->
        <el-form-item label="经营类目:" prop="mccCd">
          <sxfCategory v-model="category" placeholder="请选择经营类目" size="small" ref="sxfCategory" @getInfo="getCategoryInfo"></sxfCategory>
          <el-input v-model="params.mccCd" style="display: none;"></el-input>
        </el-form-item>
        <el-form-item label="费率:" prop="sxfRate">
          <el-input-number v-model="params.sxfRate" :min="0.01" :max="1.00" label="费率" :step="0.01" :precision="2" size="small"></el-input-number>%
        </el-form-item>
        <el-form-item label="店铺门头照片:" prop="storePicId">
          <ImgUpload v-model="params.storePicId" :urlType="1" :delPower="!(propsInfo.status === 2 || propsInfo.status === 3)"></ImgUpload>
          <el-input v-model="params.storePicId" style="display: none;"></el-input>
        </el-form-item>
        <div class="class-title">结算资料</div>
        <el-form-item label="开户总行银行编码:" prop="bnkCd">
          <SxfBankCode  v-model="params.bnkCd" placeholder="请选择开户总行银行编码" size="small"></SxfBankCode>
        </el-form-item>
        <el-form-item label="开户支行所在省市行政编码:" prop="lbnkCity">
          <BankAddressCascader  v-model="bnkProvArr" placeholder="请选择开户支行所在省市行政编码" size="small" ref="addressCascader" @getInfo="getBnkAddressInfo"></BankAddressCascader>
          <el-input v-model="params.lbnkCity" style="display: none;"></el-input>
        </el-form-item>
        <el-form-item label="开户支行行号编码:" prop="lbnkNo">
          <SxfBankBranchCode  v-model="params.lbnkNo" placeholder="请选择开户支行行号编码" ref="bankBranchCode"  @getInfo="getBranchCode" :branchParams="branchParams" :id="params.id" size="small"></SxfBankBranchCode>
        </el-form-item>
        <el-form-item label="对私账户:" prop="actTyp">
          <el-radio v-model="params.actTyp" label="01" @change="toggelRadio">开通</el-radio>
          <el-radio v-model="params.actTyp" label="00" @change="toggelRadio">不开通</el-radio>
        </el-form-item>
        <el-form-item label="结算人姓名:" prop="settleName">
          <el-input v-model.trim="params.settleName" placeholder="请输入结算人姓名" size="small"></el-input>
          <div style="font-size: 12px; color: darkorange;line-height: 20px;">必须与法人一致</div>
        </el-form-item>
        <el-form-item label="结算人身份证号:" :prop="params.actTyp==='01'?'bnkCertificateNum':''">
          <el-input v-model.trim="params.bnkCertificateNum" placeholder="请输入结算人身份证号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="结算人身份证正面照片:" :prop="params.actTyp==='01'?'settlePersonIdcardPositiveId':''">
          <ImgUpload v-model="params.settlePersonIdcardPositiveId" :urlType="1" :delPower="!(propsInfo.status === 2 || propsInfo.status === 3)"></ImgUpload>
          <el-input v-model="params.settlePersonIdcardPositiveId" style="display: none;"></el-input>
        </el-form-item>
        <el-form-item label="结算人身份证反面照片:" :prop="params.actTyp==='01'?'settlePersonIdcardOppositeId':''">
          <ImgUpload v-model="params.settlePersonIdcardOppositeId" :urlType="1" :delPower="!(propsInfo.status === 2 || propsInfo.status === 3)"></ImgUpload>
          <el-input v-model="params.settlePersonIdcardOppositeId" style="display: none;"></el-input>
        </el-form-item>
        <el-form-item label="结算人银行卡照片:" :prop="params.actTyp==='01'?'bankCardPositivePicId':''">
          <ImgUpload v-model="params.bankCardPositivePicId" :urlType="1" :delPower="!(propsInfo.status === 2 || propsInfo.status === 3)"></ImgUpload>
          <el-input v-model="params.bankCardPositivePicId" style="display: none;"></el-input>
        </el-form-item>
      </div>
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
import ImgUpload from '@/components/imgUpload/index'
// import ProviceCascader from '@/components/proviceCityCascader/index'
import sxfCategory from './incomingSxfCategory.vue'
import { SxfBankCode, SxfBankBranchCode } from '@/components/libs/selectComponents'
import { BankAddressCascader } from '@/components/libs/cascaderComponents'
import * as incomingApi from '@/modules/pay/api/incoming'
export default {
  mixins: [],
  components: {
    ImgUpload,
    // ProviceCascader,
    sxfCategory,
    SxfBankCode,
    SxfBankBranchCode,
    BankAddressCascader
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
        id: '',
        // sxfFeedStatus: 0,
        // businessLicenseName: '',
        // regProvCd: '',
        // regCityCd: '',
        // regDistCd: '',
        mccClassCd: '',
        mccCd: '',
        storePicId: null,
        bnkCd: '',
        lbnkProv: '',
        lbnkCity: '',
        lbnkNo: '',
        // lbnkNoName: '',
        actTyp: '00',
        settleName: '',
        bnkCertificateNum: '',
        settlePersonIdcardPositiveId: '',
        settlePersonIdcardOppositeId: '',
        bankCardPositivePicId: ''
      },
      // cityArr: [],
      category: [],
      bnkProvArr: [],
      radio: '',
      value: '',
      options: [],
      rules: {
        businessLicenseName: [
          { required: true, message: '请输入营业执照注册名称' }
        ],
        regDistCd: [
          { required: true, message: '请选择经营地址' }
        ],
        mccCd: [
          { required: true, message: '请选择经营类目' }
        ],
        sxfRate: [
          { required: true, message: '请输入费率' }
        ],
        storePicId: [
          { required: true, message: '请上传店铺门头照片' }
        ],
        bnkCd: [
          { required: true, message: '请选择开户总行银行编码' }
        ],
        lbnkCity: [
          { required: true, message: '开户支行所在省市行政编码' }
        ],
        lbnkNo: [
          { required: true, message: '请选择开户支行行号编码' }
        ],
        settleName: [
          { required: true, message: '请输入结算人姓名' }
        ],
        bnkCertificateNum: [
          { required: true, message: '请输入结算人身份证号' }
        ],
        settlePersonIdcardPositiveId: [
          { required: true, message: '请上传结算人身份证正面照片' }
        ],
        settlePersonIdcardOppositeId: [
          { required: true, message: '请上传结算人身份证反面照片' }
        ],
        bankCardPositivePicId: [
          { required: true, message: '请上传结算人银行卡照片' }
        ]
      },
      lbnkProvNameObj: {},
      getCategoryInfoObj: {},
      getBranchCodeObj: {}
    }
  },
  watch: {
    /*
    'cityArr'(val, oldVal) {
      val = val || []
      this.params.regProvCd = val[0] || ''
      this.params.regCityCd = val[1] || ''
      this.params.regDistCd = val[2] || ''
    },
    */
    'category' (val, oldVal) {
      val = val || []
      this.params.mccClassCd = val[0] || ''
      this.params.mccCd = val[val.length - 1] || ''
    },
    'bnkProvArr' (val, oldVal) {
      val = val || []
      this.params.lbnkProv = val[0] || ''
      this.params.lbnkCity = val[1] || ''
    },
    'branchParams' (val, oldVal) {
      this.lbnkNo = ''
    }
  },
  computed: {
    branchParams () {
      let params = {
        bnkCd: this.params.bnkCd,
        lbnkProv: this.bnkProvArr[0] || '',
        lbnkCity: this.bnkProvArr[1] || ''
      }
      return params
    }
  },
  created () {
    this.params.id = this.propsInfo.data.id
    this.initInfo()
  },
  methods: {
    initInfo () {
      let params = {
        id: this.propsInfo.data.id
      }
      incomingApi.sxfDetail(params).then(res => {
        if (res.obj.mccCd) {
          this.fmtData(res.obj)
          this.params = Object.assign({}, res.obj)
        }
      })
    },
    fmtData (data) {
      // this.cityArr = [data.regProvCd, data.regCityCd, data.regDistCd]
      this.bnkProvArr = [data.lbnkProv, data.lbnkCity]
      this.category = [data.mccClassCd, data.mccCd]
    },
    /**
     * 经营类目
     * @param val
     */
    getCategoryInfo(val) {
      console.log(val)
      this.getCategoryInfoObj = val
    },
    /**
     * 开户支行所在省市行政编码
     * @param val
     */
    getBnkAddressInfo (val) {
      console.log(val)
      this.lbnkProvNameObj = val
    },
    /**
     * 开户支行行号编码
     * @param val
     */
    getBranchCode(val) {
      console.log(val)
      this.getBranchCodeObj = val
    },
    toggelRadio (val) {
      console.log(val)
    },
    submitInfo (formName) {
      this.$refs.sxfCategory.getDetailInfo()
      this.$refs.addressCascader.getDetailInfo()
      this.$refs.bankBranchCode.getDetailInfo()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.params.actTyp === '01') {
            if (!this.params.bnkCertificateNum) {
              this.$message.warning('请输入结算人身份证号')
              return
            }
            if (!this.params.settlePersonIdcardPositiveId) {
              this.$message.warning('请上传结算人身份证正面照片')
              return
            }
            if (!this.params.settlePersonIdcardOppositeId) {
              this.$message.warning('请上传结算人身份证反面照片')
              return
            }
            if (!this.params.bankCardPositivePicId) {
              this.$message.warning('请上传结算人银行卡照片')
              return
            }
          }
          this.$refs.sxfCategory.getDetailInfo()
          this.$refs.addressCascader.getDetailInfo()
          this.$refs.bankBranchCode.getDetailInfo()
          this.confirmSubmit()
        } else {
          return false
        }
      })
    },
    confirmSubmit () {
      let params = Object.assign({}, this.params)
      params.lbnkNoName = this.getBranchCodeObj.lbnkNm
      // 开户支行所在省市行政编码
      params.lbnkCityName = this.lbnkProvNameObj[0].label
      params.lbnkProvName = this.lbnkProvNameObj[1].label
      // 经营类目
      params.mccCdName = this.getCategoryInfoObj[1].mccName
      incomingApi.sxfSave(params).then(res => {
        this.$message.success(res.msg)
        this.propsInfo.show = false
        this.$emit('getTableList')
      })
    }
  }
}
</script>
