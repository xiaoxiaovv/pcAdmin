<template>
  <div class="incoming-form">
    <el-form style="margin-top: -10px;" ref="validateForm" label-width="260px" :model="params" :rules="rules" :disabled="propsInfo.status === 2 || propsInfo.status === 3" @submit.native.prevent>
      <div class="el-form-body" :class="{'active': isView}">
        <div class="class-title">基础资料</div>
        <!--
        <el-form-item label="店铺所在地行政编码:" prop="merchantAddressCode">
          <ProviceCascader v-model="shopCityArr" placeholder="请输入店铺所在地行政编码" size="small" @getProviceInfo="getAddressCode" :level="2"></ProviceCascader>
          <el-input v-model.trim="params.merchantAddressCode" style="display: none;"></el-input>
          <el-input v-model.trim="params.merchantAddressCode" placeholder="请输入店铺所在地行政编码" size="small"></el-input>
        </el-form-item>
        -->
        <el-form-item label="经营主体:" prop="organizationType">
          <el-select v-model="params.organizationType" placeholder="请选择经营主体">
            <el-option label="企业"
                        value="1">
            </el-option>
            <el-option label="个体工商户"
                       value="2">
            </el-option>
          </el-select>
          <!--<Management  v-model="params.organizationType" placeholder="请选择经营主体" size="small"></Management>-->
        </el-form-item>
        <el-form-item label="经营类目:" prop="productDesc">
          <Category  v-model="params.productDesc" placeholder="请选择经营类目" size="small"></Category>
        </el-form-item>
        <el-form-item label="经营行业:" prop="merchantBusiness">
          <Business  v-if="initShow" :type="params.organizationType" v-model="params.merchantBusiness" :placeholder="params.organizationType?'请选择经营行业':'请先选择经营主体'" size="small"></Business>
        </el-form-item>
        <!--
        <el-form-item label="费率:" prop="wxEntryRate">
          <el-tag type="info" :class="params.wxEntryRate===0.38 ? 'active':''" @click="() => params.wxEntryRate = 0.38">0.38%</el-tag>
          <el-tag type="info" :class="params.wxEntryRate===0.39 ? 'active':''" @click="() => params.wxEntryRate = 0.39">0.39%</el-tag>
          <el-tag type="info" :class="params.wxEntryRate===0.4 ? 'active':''" @click="() => params.wxEntryRate = 0.4">0.4%</el-tag>
          <el-tag type="info" :class="params.wxEntryRate===0.45 ? 'active':''" @click="() => params.wxEntryRate = 0.45">0.45%</el-tag>

          <el-tag type="info" :class="params.wxEntryRate===0.48 ? 'active':''" @click="() => params.wxEntryRate = 0.48">0.48%</el-tag>
          <el-tag type="info" :class="params.wxEntryRate===0.49 ? 'active':''" @click="() => params.wxEntryRate = 0.49">0.49%</el-tag>
          <el-tag type="info" :class="params.wxEntryRate===0.5 ? 'active':''" @click="() => params.wxEntryRate = 0.5">0.5%</el-tag>
          <el-tag type="info" :class="params.wxEntryRate===0.55 ? 'active':''" @click="() => params.wxEntryRate = 0.55">0.55%</el-tag>

          <el-tag type="info" :class="params.wxEntryRate===0.58 ? 'active':''" @click="() => params.wxEntryRate = 0.58">0.58%</el-tag>
          <el-tag type="info" :class="params.wxEntryRate===0.59 ? 'active':''" @click="() => params.wxEntryRate = 0.59">0.59%</el-tag>
          <el-tag type="info" :class="params.wxEntryRate===0.6 ? 'active':''" @click="() => params.wxEntryRate = 0.6">0.6%</el-tag>
          <el-input v-model="params.wxEntryRate" style="display: none;"></el-input>
        </el-form-item>
        -->
        <el-form-item label="店铺门头照片:" prop="storeEntrancePicId">
          <ImgUpload v-model="params.storeEntrancePicId" :urlType="1" :delPower="!(propsInfo.status === 2 || propsInfo.status === 3)"></ImgUpload>
          <el-input v-model="params.storeEntrancePicId" style="display: none;"></el-input>
        </el-form-item>
        <el-form-item label="店内环境照片:" prop="indoorPicId">
          <ImgUpload v-model="params.indoorPicId" :urlType="1" :delPower="!(propsInfo.status === 2 || propsInfo.status === 3)"></ImgUpload>
          <el-input v-model="params.indoorPicId" style="display: none;"></el-input>
        </el-form-item>
        <div class="class-title">结算资料</div>
        <el-form-item label="对私账户开户人姓名:" prop="personAccountName">
          <el-input v-model.trim="params.personAccountName" placeholder="请输入对私账户开户人姓名" size="small"></el-input>
          <div style="line-height: 20px;font-size: 12px; color:darkorange;">必须与法人一致</div>
        </el-form-item>
        <el-form-item label="对私账户开户银行名称:" prop="personAccountBank">
          <!--<el-input v-model.trim="params.personAccountBank" placeholder="请输入对私账户开户银行名称" size="small"></el-input>-->
          <Directbank  v-model="params.personAccountBank" placeholder="请输入对私账户开户银行名称" size="small"></Directbank>
        </el-form-item>
        <el-form-item label="对私账户开户银行账号:" prop="personAccountNumber">
          <el-input v-model.trim="params.personAccountNumber" placeholder="请输入对私账户开户银行账号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="对私账户开户银行所在地:" prop="bankAddressCodeCity">
          <ProviceCascader v-model="bankCityArr" placeholder="对私账户开户银行所在地" size="small" @getProviceInfo="getBankCode" :level="2"></ProviceCascader>
          <el-input v-model.trim="params.bankAddressCodeCity" style="display: none;"></el-input>
          <!--<el-input v-model.trim="params.personBankAddressCode" placeholder="请输入对私账户开户银行所在地行政编码" size="small"></el-input>-->
        </el-form-item>
        <el-form-item label="对私开户银行全称（包括支行）:" prop="personBankName">
          <el-input v-model.trim="params.personBankName" placeholder="请输入对私开户银行全称（包括支行）" size="small"></el-input>
        </el-form-item>
        <!--
        <el-form-item label=" 对私开户银行全称（包括支行）:" prop="personBankName">
          <el-select v-model="params.personBankName"
                     filterable
                     size="small"
                     clearable
                     remote
                     reserve-keyword
                     placeholder="请输入对私开户银行全称（包括支行）"
                     :remote-method="remoteMethod"
                     :loading="loading">
            <el-option
              v-for="item in options"
              :key="item.bankName"
              :label="item.bankName"
              :value="item.bankName">
            </el-option>
          </el-select>
        </el-form-item>
        -->
      </div>
      <el-form-item v-if="!isView">
        <div class="vm-text-right">
          <el-button size="medium" @click="propsInfo.show = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="submitInfo('validateForm')">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as incomingApi from '@/modules/pay/api/incoming'
import ImgUpload from '@/components/imgUpload/index'
import Management from '@/components/libs/selectComponents/incomingWechatManagement.vue'
import Category from '@/components/libs/selectComponents/incomingWechatcategory.vue'
import Business from '@/components/libs/selectComponents/incomingWechatBusiness.vue'
import Directbank from '@/components/libs/selectComponents/incomingWechatDirectbank.vue'
import ProviceCascader from '@/components/incomWxProviceCityCascader/index'
export default {
  mixins: [],
  components: {
    ImgUpload,
    Management,
    Category,
    Business,
    Directbank,
    ProviceCascader
  },
  props: {
    propsInfo: {
      type: Object,
      default: function () {
        return {}
      }
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      initShow: true,
      isEdit: false,
      shopCityArr: [],
      bankCityArr: [],
      shopCityDetail: [],
      bankCityDetail: [],
      options: [],
      loading: false,
      params: {
        addressCodeProvince: '',
        addressCodeCity: '',
        wxEntryRate: '',
        accountAddressCode: '',
        merchantAddressCode: '',
        organizationType: '',
        productDesc: '',
        merchantBusiness: '',
        merchantId: '',
        storeEntrancePicId: '',
        indoorPicId: '',
        personAccountName: '',
        personAccountBank: '',
        personBankAddressCode: '',
        personBankName: '',
        personAccountNumber: '',
        bankAddressCodeProvince: '',
        bankAddressCodeCity: ''
      },
      rules: {
        merchantAddressCode: [
          { required: true, message: '请输入店铺所在地行政编码' }
        ],
        organizationType: [
          { required: true, message: '请选择经营主体' }
        ],
        productDesc: [
          { required: true, message: '请选择经营类目' }
        ],
        merchantBusiness: [
          { required: true, message: '请选择经营行业' }
        ],
        wxEntryRate: [
          { required: true, message: '请选择费率' }
        ],
        storeEntrancePicId: [
          { required: true, message: '请选择店铺门头照片' }
        ],
        indoorPicId: [
          { required: true, message: '请选择店内环境照片' }
        ],
        accountAddressCode: [
          { required: true, message: '请输入对公开户行所在地行政编码' }
        ],
        personAccountName: [
          { required: true, message: '请输入对私账户开户人姓名' }
        ],
        personAccountBank: [
          { required: true, message: '请输入对私账户开户银行名称' }
        ],
        personAccountNumber: [
          { required: true, message: '请输入对私账户开户银行账号' }
        ],
        personBankAddressCode: [
          { required: true, message: '请输入对私账户开户银行所在地行政编码' }
        ],
        personBankName: [
          { required: true, message: '请输入对私开户银行全称（包括支行）' }
        ]
      }
    }
  },
  computed: {},
  created () {
    this.params.merchantId = this.propsInfo.data.id
    this.initInfo()
  },
  watch: {
    'params.organizationType' (val, oldVal) {
      this.initShow = false
      this.params.merchantBusiness = ''
      this.$nextTick(() => {
        this.initShow = true
      })
    },
    'shopCityArr' (val, oldVal) {
      val = val || []
      this.params.addressCodeProvince = val[0] || ''
      this.params.addressCodeCity = val[1] || ''
    },
    'shopCityDetail' (val) {
      let code = ''
      if (val.length) {
        code = val[val.length - 1].code
      }
      this.params.merchantAddressCode = code
    },
    'bankCityArr' (val, oldVal) {
      val = val || []
      this.params.bankAddressCodeProvince = val[0] || ''
      this.params.bankAddressCodeCity = val[1] || ''
    },
    'bankCityDetail' (val) {
      let code = ''
      if (val.length) {
        code = val[val.length - 1].code
      }
      this.params.personBankAddressCode = code
    }
  },
  methods: {
    /**
     * 店铺所在地行政编码
     **/
    getAddressCode (val) {
      console.log(val)
      this.shopCityDetail = val
    },
    /**
     * 对私账户开户银行所在地行政编码--省市信息
     **/
    getBankCode (val) {
      console.log(val)
      this.bankCityDetail = val
    },
    /**
     * 对私开户银行全称（包括支行）
     **/
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          let params = {
            bankName: query
          }
          incomingApi.getsubbankname(params).then(res => {
            this.options = res.obj.filter(item => {
              return item.bankName.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    /**
     * 获取详情
     */
    initInfo () {
      let params = {
        merchantId: this.propsInfo.data.id
      }
      incomingApi.wechatDetail(params).then(res => {
        if (res.obj && res.obj.addressCodeCity) {
          res.obj.wxEntryRate = Number(res.obj.wxEntryRate)
          this.bankCityArr = [res.obj.bankAddressCodeProvince, res.obj.bankAddressCodeCity]
          this.shopCityArr = [res.obj.addressCodeProvince, res.obj.addressCodeCity]
          this.isEdit = true
          this.params = Object.assign({}, res.obj)
          this.$nextTick(() => {
            this.$set(this.params, 'merchantBusiness', res.obj.merchantBusiness)
          })
        }
      })
    },
    /**
     * 提交--表单校验
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
      incomingApi.wxfeedsupplementadd(this.params).then(res => {
        this.$message.success('微信进件资料添加成功')
        this.$emit('getTableList')
        this.propsInfo.show = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-form-body{
    position: relative;
    &.active:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
</style>
