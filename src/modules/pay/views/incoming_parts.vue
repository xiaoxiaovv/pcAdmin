<template>
  <div class="app-container" v-loading='loading'>
    <!--<el-form :rules="rules" ref="form" :model="form" label-width="150px">-->
    <div class="title-header">
      <span class="name_title">{{mName}}</span>
      <span class="name_back" @click="goback">返回列表</span>
    </div>
    <el-steps :active="active" simple>
      <el-step title="填写经营信息" icon="el-icon-edit"></el-step>
      <el-step title="填写商户信息" icon="el-icon-edit"></el-step>
      <el-step title="填写结算账户" icon="el-icon-edit"></el-step>
      <el-step title="填写组织机构信息" icon="el-icon-edit"></el-step>
      <el-step title="确认提交" icon="el-icon-upload"></el-step>
    </el-steps>
    <br>
    <div v-show="active==0">
      <el-form :rules="rules" ref="form0" :model="form" label-width="150px">
        <!--<el-form :model="form" label-width="150px">-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div class="box-card-header">联系信息</div>
          </div>
          <div class="text item">
            <el-form-item label="联系人姓名" prop="contact">
              <el-input v-model="form.contact" class="form_input"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" class="form_input"></el-input>
            </el-form-item>
            <el-form-item label="常用邮箱" prop="email">
              <el-input v-model="form.email" class="form_input"></el-input>
            </el-form-item>
          </div>
        </el-card>
        <br>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div class="box-card-header">经营信息</div>
          </div>
          <div class="text item">
            <div class="info">
              <p>商户信息</p>
            </div>
            <el-form-item label="商户简称" prop="shortName">
              <el-input v-model="form.shortName" class="form_input"
                        placeholder="该名称将于在支付完成页面向消费者进行展示"></el-input>
            </el-form-item>
            <el-form-item label="经营类目" prop="category">
              <el-cascader
                v-model="form.category"
                placeholder="请搜索"
                :options="options"
                filterable
                class="form_input"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="商户名称" prop="merchantName">
              <el-input v-model="form.merchantName" class="form_input" placeholder="商户名称需与营业执照登记公司名称一致"></el-input>
            </el-form-item>
            <el-form-item label="注册地址" prop="registerAddress">
              <el-input v-model="form.registerAddress" class="form_input" placeholder="注册地址需与营业执照登记住所一致"></el-input>
            </el-form-item>
            <div class="info">
              <p>经营信息</p>
            </div>
            <el-form-item label="售卖商品场景" prop="sellCheck">
              <el-checkbox-group v-model="form.sellCheck" :min="1">
                <el-checkbox label="1">线下</el-checkbox>
                <el-checkbox label="2">公众号</el-checkbox>
                <el-checkbox label="5">小程序</el-checkbox>
                <el-checkbox label="3">网站</el-checkbox>
                <el-checkbox label="4">APP</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="门店地址" v-if="sellScene_offline" prop="address">
              <el-input v-model="form.address" class="form_input" placeholder="请填写详细的经营场所地址"></el-input>
              <!--<div class="line"></div>-->
            </el-form-item>
            <el-form-item label="公众号名称" v-if="sellScene_wxapp" prop="officialAccountsName">
              <el-input v-model="form.officialAccountsName" class="form_input" placeholder="公众号/小程序能清晰介绍功能"></el-input>
            </el-form-item>
            <el-form-item label="公众号APPID" prop="officialAccountsAppId" v-if="sellScene_wxapp">
              <el-input v-model="form.officialAccountsAppId" class="form_input" placeholder="请输入公众号APPID"></el-input>
            </el-form-item>
            <el-form-item label="公众号截图" v-if="sellScene_wxapp" prop="officialAccountsPicId">
              <ImgUpload v-model="form.officialAccountsPicId" :urlType="1"></ImgUpload>
              <el-input v-model="form.officialAccountsPicId" style="display: none;"></el-input>
            </el-form-item>
            <el-form-item label="小程序名称" v-if="sellScene_wxapp_mini" prop="miniProgramName">
              <el-input v-model="form.miniProgramName" class="form_input" placeholder="公众号/小程序能清晰介绍功能"></el-input>
            </el-form-item>
            <el-form-item label="小程序APPID" prop="miniProgramAppId" v-if="sellScene_wxapp_mini">
              <el-input v-model="form.miniProgramAppId" class="form_input" placeholder="请输入小程序APPID"></el-input>
            </el-form-item>
            <el-form-item label="小程序截图" v-if="sellScene_wxapp_mini" prop="miniProgramPhotoId">
              <ImgUpload v-model="form.miniProgramPhotoId" :urlType="1"></ImgUpload>
              <el-input v-model="form.miniProgramPhotoId" style="display: none;"></el-input>
            </el-form-item>
            <el-form-item label="公司网站" v-if="sellScene_website" prop="companyWeb">
              <el-input v-model="form.companyWeb" class="form_input" placeholder="公众号/小程序能清晰介绍功能"></el-input>
              <!--<div class="line"></div>-->
            </el-form-item>
            <el-form-item label="APP上线状态" v-if="sellScene_app" prop="appStatus">
              <el-select v-model="form.appStatus" placeholder="请选择">
                <el-option :value="1" label="APP未上线"></el-option>
                <el-option :value="2" label="APP已上线"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="APPID" prop="appId" v-if="sellScene_app">
              <el-input v-model="form.appId" class="form_input" placeholder="请输入APPID"></el-input>
            </el-form-item>
            <el-form-item label="APP页面截图" v-if="sellScene_app" prop="appPhotoId">
              <ImgUpload v-model="form.appPhotoId" :urlType="1"></ImgUpload>
              <el-input v-model="form.appPhotoId" style="display: none;"></el-input>
            </el-form-item>
            <el-form-item label="客服电话" prop="cusServiceTel">
              <el-input v-model="form.cusServiceTel" class="form_input" placeholder="审核人员会对电话进行回拨确认"></el-input>
            </el-form-item>
            <el-form-item label="网站域名" v-if="sellScene_website" prop="domainName">
              <el-input v-model="form.domainName" class="form_input" placeholder="请输入网站域名"></el-input>
            </el-form-item>
            <el-form-item label="网站授权函" v-if="sellScene_website" prop="authorizationLetter">
              <ImgUpload v-model="form.authorizationLetter" :urlType="1"></ImgUpload>
              <el-input v-model="form.authorizationLetter" style="display: none;"></el-input>
            </el-form-item>
            <el-form-item label="特殊资质" prop="specialQualificationPhotoId">
              <ImgUpload v-model="form.specialQualificationPhotoId" :urlType="1"></ImgUpload>
              <el-input v-model="form.specialQualificationPhotoId" style="display: none;"></el-input>
            </el-form-item>
            <el-form-item label="补充材料" prop="supplementPhotoId">
              <ImgUpload v-model="form.supplementPhotoId" :urlType="1"></ImgUpload>
              <el-input v-model="form.supplementPhotoId" style="display: none;"></el-input>
            </el-form-item>
          </div>
        </el-card>
        <br>
      </el-form>
    </div>
    <div v-show="active==1">
      <el-form :rules="rules" ref="form1" :model="form" label-width="150px">
        <!--<el-form :model="form" label-width="150px">-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div class="box-card-header">商户信息</div>
          </div>
          <div class="text item">
            <div class="info">
              <p>营业执照</p>
            </div>
            <el-form-item label="营业执照注册号" prop="license">
              <el-input v-model="form.license" class="form_input"></el-input>
            </el-form-item>
            <el-form-item label="经营范围" prop="businessScope">
              <el-input type="textarea" :rors="3" v-model="form.businessScope" class="form_input"
                        placeholder="与企业工商营业执照上一致"></el-input>
            </el-form-item>
            <el-form-item label="营业期限" required>
              <el-form-item prop="startBusinessTime" style="display:inline-block;">
                <el-date-picker
                  v-model="form.startBusinessTime"
                  type="date"
                  placeholder="开始日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              至
              <el-form-item prop="endBusinessTime" style="display:inline-block;">
                <el-date-picker
                  v-model="form.endBusinessTime"
                  type="date"
                  placeholder="结束日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item label="营业执照照片" prop="businessLicensePhotoId">
              <ImgUpload v-model="form.businessLicensePhotoId" :urlType="1"></ImgUpload>
              <el-input v-model="form.businessLicensePhotoId" style="display: none;"></el-input>
            </el-form-item>
            <el-form-item label="营业执照注册名称:" prop="businessLicenseName">
              <el-input v-model.trim="form.businessLicenseName" placeholder="请输入营业执照注册名称" class="form_input"></el-input>
            </el-form-item>
            <el-form-item label="经营地址:" prop="regDistCd" required>
              <ProviceCascader v-model="cityArr" placeholder="请选择经营地址" @getProviceInfo="getProviceInfo"></ProviceCascader>
              <el-input v-model.trim="form.regDistCd" style="display: none;"></el-input>
            </el-form-item>
            <div class="info">
              <p>企业法人/经办人</p>
            </div>
            <el-form-item label="证件持有人类型" prop="representativeType">
              <el-select v-model="form.representativeType" placeholder="请选择">
                <el-option :value="1" label="法人"></el-option>
                <el-option :value="2" label="经办人"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件持有人姓名" prop="representativeName">
              <el-input v-model="form.representativeName" class="form_input"></el-input>
            </el-form-item>
            <el-form-item label="证件类型" prop="certificate">
              <el-select v-model="form.certificate" placeholder="请选择">
                <el-option :value="1" label="身份证"></el-option>
                <el-option :value="2" label="护照"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件号码" prop="certificateNum">
              <el-input v-model="form.certificateNum" class="form_input"></el-input>
            </el-form-item>
            <el-form-item label="证件有效期" required>
              <el-form-item prop="startCertificateTime" style="display:inline-block;">
                <el-date-picker
                  v-model="form.startCertificateTime"
                  type="date"
                  placeholder="开始日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              至
              <el-form-item prop="endCertificateTime" style="display:inline-block;">
                <el-date-picker
                  v-model="form.endCertificateTime"
                  type="date"
                  placeholder="结束日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item label="证件扫描件" prop="epresentativePhotoId">
              <ImgUpload v-model="form.epresentativePhotoId" :urlType="1"></ImgUpload>
              <el-input v-model="form.epresentativePhotoId" style="display: none;"></el-input>
            </el-form-item>
            <el-form-item label="证件扫描件反面" prop="epresentativePhotoId2" v-if="form.certificate===1">
              <ImgUpload v-model="form.epresentativePhotoId2" :urlType="1"></ImgUpload>
              <el-input v-model="form.epresentativePhotoId2" style="display: none;"></el-input>
            </el-form-item>
            <el-form-item label="是否开通电子发票" required>
              <el-radio-group v-model="form.isOpenElectronicInvoice">
                <el-radio :label="1">开通</el-radio>
                <el-radio :label="0">不开通</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-card>
        <br>
        <br>
      </el-form>
    </div>
    <div v-show="active==2">
      <el-form :rules="rules" ref="form2" :model="form" label-width="150px">
        <!--<el-form :model="form" label-width="150px">-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div class="box-card-header">结算信息</div>
          </div>
          <div class="text item">
            <el-form-item label="微信费率" prop="wxRate">
              <el-input-number :precision="2" :step="0.01" :min="0.01" :max="100" v-model="form.wxRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="支付宝费率" prop="zfbRate">
              <el-input-number :precision="2" :step="0.01" :min="0.01" :max="100" v-model="form.zfbRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="随行付支付宝费率" prop="sxfZfbRate">
              <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="form.sxfZfbRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="随行付微信费率" prop="sxfWxRate">
              <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="form.sxfWxRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="富友支付宝费率" prop="fyZfbRate">
              <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="form.fyZfbRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="富友微信费率" prop="fyWxRate">
              <el-input-number :precision="2" :step="0.01" :min="0" :max="100" v-model="form.fyWxRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="账户类型" prop="accountType">
              <el-select v-model="form.accountType" placeholder="请选择账户类型">
                <el-option value="对公账户" label="对公账户"></el-option>
                <el-option value="经营者账户" label="经营者账户"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开户名称" prop="accountHolder">
              <el-input v-model="form.accountHolder" class="form_input" placeholder="请输入开户名称"></el-input>
            </el-form-item>
            <el-form-item label="开户银行城市" prop="bankCity">
              <el-input v-model="form.bankCity" class="form_input" placeholder="请输入开户行所在地（县/市）"></el-input>
            </el-form-item>
            <el-form-item label="开户银行" prop="bankName">
              <el-input v-model="form.bankName" class="form_input" placeholder="请输入开户银行（如:'工商银行'）"></el-input>
            </el-form-item>
            <el-form-item label="开户支行" prop="bankOutlet">
              <el-input v-model="form.bankOutlet" class="form_input" placeholder="请输入开户支行名称（如:'福州华林支行'）"></el-input>
            </el-form-item>
            <el-form-item label="银行账号" prop="accountNumber">
              <el-input v-model="form.accountNumber" class="form_input" placeholder="请输入银行账号并仔细核对"></el-input>
            </el-form-item>
            <el-form-item label="开户许可证" v-if="form.accountType==='对公账户'" prop="openingAccountLicensePicId">
              <ImgUpload v-model="form.openingAccountLicensePicId" :urlType="1"></ImgUpload>
              <el-input v-model="form.openingAccountLicensePicId" style="display: none;"></el-input>
            </el-form-item>
          </div>
        </el-card>
        <br>
        <br>
      </el-form>
    </div>
    <div v-show="active==3">
      <el-form :rules="rules" ref="form3" :model="form" label-width="150px">
        <!--<el-form :model="form" label-width="150px">-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div class="box-card-header">组织机构信息</div>
          </div>
          <div class="text item">
            <div class="info">
              <p>组织机构代码信息</p>
            </div>
            <el-form-item label="组织机构代码" da-prop="organizationCode">
              <el-input v-model="form.organizationCode" class="form_input"></el-input>
            </el-form-item>
            <el-form-item label="组织机构有效期" da-required>
              <el-form-item da-prop="startOrganizationTime" style="display:inline-block;">
                <el-date-picker
                  v-model="form.startOrganizationTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              至
              <el-form-item da-prop="endOrganizationTime" style="display:inline-block;">
                <el-date-picker
                  v-model="form.endOrganizationTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item label="组织机构代码证照片" da-prop="organizationPhotoId">
              <ImgUpload v-model="form.organizationPhotoId" :urlType="1"></ImgUpload>
              <el-input v-model="form.organizationPhotoId" style="display: none;"></el-input>
            </el-form-item>
          </div>
        </el-card>
        <br>
        <br>
      </el-form>
    </div>
    <div align="center">
      <el-button type="info" v-if="active==1 || active==2 || active==3 || active==4" @click="prev">上一步</el-button>
      <el-button type="primary" v-if="active==0 || active==1 || active==2 || active==3" @click="next()">下一步</el-button>
      <el-button type="danger" v-if="active==4" @click="addMchInfo">提&nbsp;&nbsp;交</el-button>
    </div>
    <!--</el-form>-->
  </div>
</template>

<script>
import getCateGory from '@/modules/pay/api/business_category'
import {detail, addMchInfo} from '@/modules/merchant/agent/api/merchantInfo'
import {returnThumbnailUrl, uploadUrl} from '@/modules/file/api/upload' // 图片操作API
import ImgUpload from '@/components/imgUpload/index'
import ProviceCascader from '@/components/proviceCityCascader/index'
export default {
  components: {
    ImgUpload,
    ProviceCascader
  },
  data () {
    /**
     * 手机号校验
     */
    let checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    /**
     * 售卖场景校验
     */
    let sellCheck = (rule, value, callback) => {
      if (value.length == 0) {
        return callback(new Error('请至少选择一个'))
      } else {
        callback()
      }
    }

    let categoryCheck = (rule, value, callback) => {
      if (value.length == 0) {
        return callback(new Error('请选择经营类目'))
      } else {
        callback()
      }
    }
    /**
     * 营业期限校验
     */
    const businessTermDateValidator = (rule, value, callback, source, options) => {
      let errors = []
      if (this.form.startBusinessTime >= value) {
        errors.push('结束时间必须大于开始时间')
      }
      callback(errors)
    }
    const endCertificateTimeValidator = (rule, value, callback, source, options) => {
      let errors = []
      if (this.form.startCertificateTime >= value) {
        errors.push('结束时间必须大于开始时间')
      }
      callback(errors)
    }
    const endOrganizationTimeValidator = (rule, value, callback, source, options) => {
      let errors = []
      if (this.form.startOrganizationTime >= value) {
        errors.push('结束时间必须大于开始时间')
      }
      callback(errors)
    }

    return {
      loading: true,
      active: 0,
      options: [], // 营业选项
      cityArr: [],
      mName: '****',
      form: {
        id: '', // 进件id
        contact: '',
        phone: '',
        email: '',
        shortName: '', // 商户简称
        merchantName: '', // 商户名称
        category: [],
        sellCheck: [],
        address: '',
        miniProgramName: '', // 小程序名称
        miniProgramAppId: '', // 小程序appid
        officialAccountsName: '', // 公众号名称
        officialAccountsAppId: '', // 公众号appid
        companyWeb: '',
        appStatus: 1,
        appId: '',
        cusServiceTel: '',
        domainName: '',
        authorizationLetter: '',

        registerAddress: '', // 注册地址
        license: '', // 营业执照
        businessLicenseName: '', // 营业执照注册名称
        regProvCd: '', // 经营地址
        regCityCd: '', // 经营地址
        regDistCd: '', // 经营地址
        regProvCdName: '', // 经营地址
        regCityCdName: '', // 经营地址
        regDistCdName: '', // 经营地址
        startBusinessTime: '', // 营业执照有效期 start
        endBusinessTime: '', // 营业执照有效期 end

        representativeType: '', // 证件持有人类型
        representativeName: '', // 证件持有人姓名

        certificate: '', // 证件类型
        startCertificateTime: '', // 开始证件期限
        endCertificateTime: '', // 开始证件期限
        certificateNum: '', // 证件号码
        isOpenElectronicInvoice: 1, // 是否开通电子发票

        organizationCode: '', // 组织机构代码
        startOrganizationTime: '', // 开始组织机构期限
        endOrganizationTime: '', // 结束组织机构期限

        businessScope: '', // 经营范围

        accountType: '', // 账户类型
        openingAccountLicensePicId: '', // 开户许可证
        accountHolder: '', // 户主
        bankOutlet: '', // 开户支行
        bankName: '', // 银行名字
        bankCity: '', // 账户类型
        accountNumber: '', // 账户类型
        wxRate: '', // 微信费率
        zfbRate: '', // 支付宝费率
        sxfZfbRate: '', // 随行付支付宝费率
        sxfWxRate: '', // 随行付微信费率
        fyZfbRate: '', // 富友支付宝费率
        fyWxRate: '', // 富友微信费率

        // ---------图片
        miniProgramPhotoId: '', // 微信小程序图片ID
        officialAccountsPicId: '', // 微信公众号图片ID
        appPhotoId: '', // app图片ID
        specialQualificationPhotoId: '', // 特殊资质文件图片ID
        supplementPhotoId: '', // 补充文件
        businessLicensePhotoId: '', // 营业执照
        organizationPhotoId: '', // 组织机构代码
        epresentativePhotoId: '', // 法人证件照
        epresentativePhotoId2: '' // 法人证件照
      },
      rules: {
        contact: [
          {required: true, message: '联系人姓名不能为空', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '常用邮箱不能为空', trigger: 'blur'}
        ],
        merchantShortName: [
          {required: true, message: '商户简称不能为空', trigger: 'blur'}
        ],
        category: [
          {required: true, message: '经营类目必须选择', trigger: 'change'},
          {validator: categoryCheck, trigger: 'change'}
        ],
        address: [
          {required: true, message: '门店地址不能为空', trigger: 'blur'}
        ],
        miniProgramName: [
          {required: true, message: '小程序名称不能为空'}
        ],
        miniProgramAppId: [
          {required: true, message: '小程序APPID不能为空'}
        ],
        miniProgramPhotoId: [
          {required: true, message: '必须上传小程序主要界面截图'}
        ],
        officialAccountsName: [
          {required: true, message: '公众号名称不能为空'}
        ],
        officialAccountsAppId: [
          {required: true, message: '公众号APPID不能为空'}
        ],
        officialAccountsPicId: [
          {required: true, message: '必须上传公众号主要界面截图'}
        ],
        companyWeb: [
          {required: true, message: '公司网址不能为空', trigger: 'blur'}
        ],
        appStatus: [
          {required: true, message: 'APP上线状态必须选择', trigger: 'blur'}
        ],
        appPhotoId: [
          {required: true, message: '必须上传APP页面截图'}
        ],
        appId: [
          {required: true, message: 'APPID不能为空'}
        ],
        cusServiceTel: [
          {required: true, message: '公司客服联系电话不能为空', trigger: 'blur'}
        ],
        domainName: [
          {required: true, message: '网站域名不能为空', trigger: 'blur'}
        ],
        authorizationLetter: [
          {required: true, message: '网站授权函不能为空'}
        ],
        sellCheck: [
          {required: true, message: '至少选择一个', trigger: 'change'},
          {validator: sellCheck, trigger: 'change'}
        ],
        phone: [
          {required: true, message: '请输入手机号码', trigger: 'blur'},
          {validator: checkPhone, trigger: 'blur'}
        ],
        merchantName: [
          {required: true, message: '商户名称不能为空', trigger: 'blur'}
        ],
        registerAddress: [
          {required: true, message: '注册地址不能为空', trigger: 'blur'}
        ],
        license: [
          {required: true, message: '营业执照注册号不能为空', trigger: 'blur'}
        ],
        businessLicenseName: [
          {required: true, message: '营业执照注册名称不能为空'}
        ],
        regDistCd: [
          {required: true, message: '请选择经营地址'}
        ],
        businessScope: [
          {required: true, message: '经营范围不能为空', trigger: 'blur'}
        ],
        // 营业期限
        startBusinessTime: [
          {required: true, message: '营业期限不能为空', trigger: 'blur'}
        ],
        endBusinessTime: [
          {required: true, message: '营业期限不能为空', trigger: 'blur'},
          {validator: businessTermDateValidator, trigger: 'blur'}
        ],

        // 证件有效期
        startCertificateTime: [
          {required: true, message: '证件有效期不能为空', trigger: 'blur'}
        ],
        endCertificateTime: [
          {required: true, message: '证件有效期不能为空', trigger: 'blur'},
          {validator: endCertificateTimeValidator, trigger: 'blur'}
        ],

        epresentativePhotoId: [
          {required: true, message: '证件扫描件不能为空'}
        ],

        epresentativePhotoId2: [
          {required: true, message: '证件扫描件反面不能为空'}
        ],

        // 组织机构有效期
        startOrganizationTime: [
          {required: true, message: '组织机构有效期不能为空', trigger: 'blur'}
        ],
        endOrganizationTime: [
          {required: true, message: '组织机构有效期不能为空', trigger: 'blur'},
          {validator: endOrganizationTimeValidator, trigger: 'blur'}
        ],

        // businessTerm: [
        //   {required: true, message: '营业期限不能为空', trigger: 'blur'}
        // ],
        // businessTerm: [{
        //   type: 'array',
        //   required: true,
        //   message: '请选择活动时间'
        // }, {
        //   required: true,
        //   validator: businessTermDateValidator
        // }],
        businessLicensePhotoId: [
          {required: true, message: '营业执照图片不能为空'}
        ],
        organizationCode: [
          {required: true, message: '组织机构代码不能为空', trigger: 'blur'}
        ],
        representativeType: [
          {required: true, message: '证件类型不能为空', trigger: 'change'}
        ],
        representativeName: [
          {required: true, message: '证件持有人姓名不能为空', trigger: 'blur'}
        ],
        certificate: [
          {required: true, message: '证件类型不能为空', trigger: 'change'}
        ],
        certificateNum: [
          {required: true, message: '证件号码不能为空', trigger: 'blur'}
        ],
        organizationPhotoId: [
          {required: true, message: '组织机构代码证照不能为空', trigger: 'blur'}
        ],
        accountType: [
          {required: true, message: '账户类型不能为空', trigger: 'change'}
        ],
        openingAccountLicensePicId: [
          {required: true, message: '请选择开户许可证'}
        ],
        accountHolder: [
          {required: true, message: '账户持有人不能为空', trigger: 'blur'}
        ],
        wxRate: [
          {required: true, message: '微信费率不能为空'}
        ],
        zfbRate: [
          {required: true, message: '支付宝费率不能为空'}
        ],
        bankOutlet: [
          {required: true, message: '开户支行不能为空', trigger: 'blur'}
        ],
        bankName: [
          {required: true, message: '银行名不能为空', trigger: 'blur'}
        ],
        bankCity: [
          {required: true, message: '开户城市不能为空', trigger: 'blur'}
        ],
        accountNumber: [
          {required: true, message: '账户号码不能为空', trigger: 'blur'}
        ]

      }, // 校验触发
      // 售卖场景------------------
      sellScene_offline: false,
      sellScene_wxapp: false,
      sellScene_wxapp_mini: false,
      sellScene_website: false,
      sellScene_app: false,
      // 售卖场景------------------

      // 图片上传-------------------
      filesData: {
        module: 'image'
      },
      url: uploadUrl + '/user',
      headers: {
        authorized: sessionStorage.token
      }
      // 图片上传-------------------
      // 场景图片返回链接区
      // miniProgramPhotoIdUrl: '', // 微信小程序截图
      // appPhotoIdUrl: '', // app页面截图
      // specialQualificationPhotoIdUrl: '', // 特殊资质文件
      // supplementPhotoIdUrl: '', // 补充文件
      // businessLicensePhotoIdUrl: '', // 营业执照
      // organizationPhotoIdUrl: '', // 组织机构代码
      // representativeImgUrl: '', // 法人机构代码
      // representativeImgUrl2: '' // 法人机构代码
      // 场景图片返回链接区
    }
  },
  mounted () {
    this.options = getCateGory
    this.form.id = this.$route.query.id // 接收ID
    this.mName = this.$route.query.n // 接收ID
    this.getDetail(this.form.id)
    // 获取本{{levelAlias.firstName}}详情
  },

  watch: {
    // 售卖商品场景判断
    'form.sellCheck': {
      handler: function (nv, ov) {
        // if (nv.length < 1) {
        //   this.$message({
        //     message: '请至少选择一个售卖场景。',
        //     type: 'warning'
        //   })
        //   this.form.sellCheck = ov
        // }
        let select = this.form.sellCheck
        let offlice = false
        let wxapp = false
        let wxappmini = false
        let website = false
        let app = false
        // 判断是否有选中某个属性
        for (let i in select) {
          if (select[i] == '1') {
            offlice = true
          }
          if (select[i] == '2') {
            wxapp = true
          }
          if (select[i] == '3') {
            website = true
          }
          if (select[i] == '4') {
            app = true
          }
          if (select[i] == '5') {
            wxappmini = true
          }
        }
        this.sellScene_offline = offlice
        this.sellScene_wxapp = wxapp
        this.sellScene_wxapp_mini = wxappmini
        this.sellScene_website = website
        this.sellScene_app = app
      },
      deep: true
    }

  },
  methods: {
    getProviceInfo (addArr) {
      addArr = addArr || []
      if (addArr.length) {
        this.form.regProvCd = addArr[0].id
        this.form.regCityCd = addArr[1].id
        this.form.regDistCd = addArr[2].id
        this.form.regProvCdName = addArr[0].name
        this.form.regCityCdName = addArr[1].name
        this.form.regDistCdName = addArr[2].name
      } else {
        this.form.regProvCd = ''
        this.form.regCityCd = ''
        this.form.regDistCd = ''
        this.form.regProvCdName = ''
        this.form.regCityCdName = ''
        this.form.regDistCdName = ''
      }
    },
    getDetail: function (id) {
      if (id != '') {
        detail(id).then(res => {
          console.warn('详情页回显已有信息')
          console.log(res.obj)
          let data = res.obj
          this.form.contact = data.contact
          this.form.phone = data.phone
          this.form.email = data.email
          this.form.shortName = data.shortName// 商户简称
          this.form.merchantName = data.merchantName // 商户名称
          if (data.businessLevOne) {
            this.form.category = [data.businessLevOne, data.businessLevTwo, data.businessLevThree]
          }
          this.form.address = data.address
          this.form.officialAccountsName = data.officialAccountsName
          this.form.officialAccountsAppId = data.officialAccountsAppId
          this.form.miniProgramName = data.miniProgramName
          this.form.miniProgramAppId = data.miniProgramAppId
          this.form.companyWeb = data.companyWeb
          this.form.appStatus = data.appStatus
          this.form.appId = data.appId
          this.form.cusServiceTel = data.cusServiceTel
          this.form.domainName = data.domainName
          this.form.authorizationLetter = data.authorizationLetter
          this.form.registerAddress = data.registerAddress // 注册地址
          this.form.license = data.license
          this.form.businessLicenseName = data.businessLicenseName || ''// 营业执照注册名称
          this.form.representativeType = data.representativeType || ''// 证件持有人类型
          this.form.representativeName = data.representativeName// 证件持有人姓名
          this.form.certificate = data.certificate || ''// 证件类型

          this.form.startCertificateTime = data.startCertificateTime ? this.format(data.startCertificateTime) : '' // 证件有效期
          this.form.endCertificateTime = data.endCertificateTime ? this.format(data.endCertificateTime) : '' // 证件有效期
          this.form.isOpenElectronicInvoice = (data.isOpenElectronicInvoice === 0 || data.isOpenElectronicInvoice === 1) ? data.isOpenElectronicInvoice : 1 // 是否开通电子发票

          this.form.certificateNum = data.certificateNum// 证件号码
          this.form.organizationCode = data.organizationCode// 组织机构代码

          this.form.startOrganizationTime = data.startOrganizationTime ? this.format(data.startOrganizationTime) : ''// 组织机构代码有效期
          this.form.endOrganizationTime = data.endOrganizationTime ? this.format(data.endOrganizationTime) : ''// 组织机构代码有效期

          this.form.businessScope = data.businessScope // 经营范围
          this.form.startBusinessTime = data.startBusinessTime ? this.format(data.startBusinessTime) : '' // 营业期限
          this.form.endBusinessTime = data.endBusinessTime ? this.format(data.endBusinessTime) : '' // 营业期限

          this.form.accountType = data.accountType || '' // 账户类型
          this.form.openingAccountLicensePicId = data.openingAccountLicensePicId || '' // 开户许可证
          this.form.accountHolder = data.accountHolder // 户主
          this.form.bankOutlet = data.bankOutlet // 开户支行
          this.form.bankName = data.bankName // 银行名字
          this.form.bankCity = data.bankCity// 账户类型
          this.form.accountNumber = data.accountNumber // 账户类型
          this.form.wxRate = Number(data.wxRate) ? Number(data.wxRate) * 100 : 0 // 微信费率
          this.form.zfbRate = Number(data.zfbRate) ? Number(data.zfbRate) * 100 : 0 // 支付宝费率
          this.form.sxfZfbRate = Number(data.sxfZfbRate) ? Number(data.sxfZfbRate) * 100 : 0 // 随行付支付宝费率
          this.form.sxfWxRate = Number(data.sxfWxRate) ? Number(data.sxfWxRate) * 100 : 0 // 随行付微信费率
          this.form.fyZfbRate = Number(data.fyZfbRate) ? Number(data.fyZfbRate) * 100 : 0 // 富友支付宝费率
          this.form.fyWxRate = Number(data.fyWxRate) ? Number(data.fyWxRate) * 100 : 0 // 富友微信费率

          this.form.regProvCd = data.regProvCd || ''
          this.form.regCityCd = data.regCityCd || ''
          this.form.regDistCd = data.regDistCd || ''
          this.form.regProvCdName = data.regProvCdName || ''
          this.form.regCityCdName = data.regCityCdName || ''
          this.form.regDistCdName = data.regDistCdName || ''
          this.cityArr = [data.regProvCd, data.regCityCd, data.regDistCd] // 经营地址
          // 微信小程序图片ID
          if (data.miniProgramPhotoId == '' || data.miniProgramPhotoId == null) {
            this.form.miniProgramPhotoId = ''
          } else {
            this.form.miniProgramPhotoId = data.miniProgramPhotoId
          }
          // 微信公众号图片ID
          if (data.officialAccountsPicId == '' || data.officialAccountsPicId == null) {
            this.form.officialAccountsPicId = ''
          } else {
            this.form.officialAccountsPicId = data.officialAccountsPicId // 微信小程序图片ID
          }

          if (data.appPhotoId == '' || data.appPhotoId == null) {
            this.form.appPhotoId = ''
          } else {
            this.form.appPhotoId = data.appPhotoId
          }

          if (data.specialQualificationPhotoId == '' || data.specialQualificationPhotoId == null) {
            this.form.specialQualificationPhotoId = ''
          } else {
            this.form.specialQualificationPhotoId = data.specialQualificationPhotoId// 特殊资质文件图片ID
          }

          if (data.supplementPhotoId == '' || data.supplementPhotoId == null) {
            this.form.supplementPhotoId = ''
          } else {
            this.form.supplementPhotoId = data.supplementPhotoId// 补充文件
          }

          if (data.businessLicensePhotoId == '' || data.businessLicensePhotoId == null) {
            this.form.businessLicensePhotoId = ''
          } else {
            this.form.businessLicensePhotoId = data.businessLicensePhotoId// 营业执照
          }

          if (data.organizationCode == '' || data.organizationCode == null) {
            this.form.organizationPhotoId = ''
          } else {
            this.form.organizationPhotoId = data.organizationPhotoId// 组织机构代码
          }

          if (data.epresentativePhotoId == '' || data.epresentativePhotoId == null) {
            this.form.epresentativePhotoId = ''
          } else {
            this.form.epresentativePhotoId = data.epresentativePhotoId // 法人证件照
          }

          if (data.epresentativePhotoId2 == '' || data.epresentativePhotoId2 == null) {
            this.form.epresentativePhotoId2 = ''
          } else {
            this.form.epresentativePhotoId2 = data.epresentativePhotoId2// 法人证件照
          }

          // 销售场景
          if (data.sellCheck == '[]' || data.sellCheck == null) {
            // this.$set(this.form, 'sellCheck', [])
          } else {
            console.log('sellcheck not null')
            this.$set(this.form, 'sellCheck', JSON.parse(data.sellCheck))
          }
          this.loading = false // 解除加载遮罩
        }).catch(e => {
          console.log(e)
          this.$message.error('进件资料获取失败，请退出重试')
        })
      }
    },
    // 上一步
    prev () {
      --this.active
      if (this.active < 0) {
        this.active = 0
      }
    },
    // 下一步
    next () {
      if (this.active == 0) {
        this.$refs['form0'].validate((valid, obj) => {
          console.log(valid)
          if (valid) {
            this.active = 1
          } else {
            return false
          }
        })
      } else if (this.active == 1) {
        this.$refs['form1'].validate((valid, obj) => {
          console.log(valid)
          if (valid) {
            this.active = 2
          } else {
            return false
          }
        })
      } else if (this.active == 2) {
        this.$refs['form2'].validate((valid, obj) => {
          console.log(valid)
          if (valid) {
            this.active = 3
          } else {
            return false
          }
        })
      } else if (this.active == 3) {
        this.$refs['form3'].validate((valid, obj) => {
          if (valid) {
            // 校验时间
            // startOrganizationTime: '', // 开始组织机构期限
            // endOrganizationTime: '', // 结束组织机构期限
            if (this.form.startOrganizationTime || this.form.endOrganizationTime) {
              let startOrganizationTime = new Date(this.form.startOrganizationTime).getTime()
              let endOrganizationTime = new Date(this.form.endOrganizationTime).getTime()
              startOrganizationTime = startOrganizationTime || ''
              endOrganizationTime = endOrganizationTime || ''
              if (startOrganizationTime && endOrganizationTime) {
                if (startOrganizationTime > endOrganizationTime) {
                  this.$message.warning('组织机构有效期开始时间不能大于结束时间')
                  return false
                } else {
                  this.active = 4
                }
              } else {
                let msg = this.form.startOrganizationTime ? '请选择组织机构有效期结束时间' : '请选择组织机构有效期开始时间'
                this.$message.warning(msg)
                return false
              }
            } else {
              this.active = 4
            }
          } else {
            return false
          }
        })
      }
    },

    addMchInfo: function () {
      this.loading = true
      this.btnLoading = true
      console.warn('原始表单')
      console.log(this.form)
      let originalFormCopy = this.deepCopy(this.form)
      let modifyForm = {} // 最后对象容器

      modifyForm.sellCheck = JSON.stringify(originalFormCopy.sellCheck)
      modifyForm.businessLevOne = originalFormCopy.category[0] || ''
      modifyForm.businessLevTwo = originalFormCopy.category[1] || ''
      modifyForm.businessLevThree = originalFormCopy.category[2] || ''
      modifyForm.id = originalFormCopy.id

      modifyForm.contact = originalFormCopy.contact
      modifyForm.phone = originalFormCopy.phone
      modifyForm.email = originalFormCopy.email
      modifyForm.shortName = originalFormCopy.shortName
      modifyForm.merchantName = originalFormCopy.merchantName
      modifyForm.address = originalFormCopy.address
      modifyForm.miniProgramName = originalFormCopy.miniProgramName
      modifyForm.miniProgramAppId = originalFormCopy.miniProgramAppId
      modifyForm.officialAccountsName = originalFormCopy.officialAccountsName
      modifyForm.officialAccountsAppId = originalFormCopy.officialAccountsAppId
      modifyForm.companyWeb = originalFormCopy.companyWeb
      modifyForm.appStatus = originalFormCopy.appStatus
      modifyForm.appId = originalFormCopy.appId
      modifyForm.cusServiceTel = originalFormCopy.cusServiceTel
      modifyForm.domainName = originalFormCopy.domainName
      modifyForm.authorizationLetter = originalFormCopy.authorizationLetter
      modifyForm.registerAddress = originalFormCopy.registerAddress
      modifyForm.license = originalFormCopy.license
      modifyForm.startBusinessTime = originalFormCopy.startBusinessTime
      modifyForm.endBusinessTime = originalFormCopy.endBusinessTime

      modifyForm.businessLicenseName = originalFormCopy.businessLicenseName
      modifyForm.representativeType = originalFormCopy.representativeType
      modifyForm.representativeName = originalFormCopy.representativeName

      modifyForm.certificate = originalFormCopy.certificate
      modifyForm.startCertificateTime = originalFormCopy.startCertificateTime
      modifyForm.endCertificateTime = originalFormCopy.endCertificateTime
      modifyForm.certificateNum = originalFormCopy.certificateNum
      modifyForm.isOpenElectronicInvoice = originalFormCopy.isOpenElectronicInvoice

      modifyForm.organizationCode = originalFormCopy.organizationCode
      modifyForm.startOrganizationTime = originalFormCopy.startOrganizationTime
      modifyForm.endOrganizationTime = originalFormCopy.endOrganizationTime

      modifyForm.businessScope = originalFormCopy.businessScope

      modifyForm.accountType = originalFormCopy.accountType
      modifyForm.openingAccountLicensePicId = originalFormCopy.openingAccountLicensePicId
      modifyForm.accountHolder = originalFormCopy.accountHolder
      modifyForm.bankOutlet = originalFormCopy.bankOutlet
      modifyForm.bankName = originalFormCopy.bankName
      modifyForm.bankCity = originalFormCopy.bankCity
      modifyForm.accountNumber = originalFormCopy.accountNumber

      modifyForm.wxRate = Number(originalFormCopy.wxRate) ? Number((originalFormCopy.wxRate / 100).toFixed(4)) : 0
      modifyForm.zfbRate = Number(originalFormCopy.zfbRate) ? Number((originalFormCopy.zfbRate / 100).toFixed(4)) : 0
      modifyForm.sxfZfbRate = Number(originalFormCopy.sxfZfbRate) ? Number((originalFormCopy.sxfZfbRate / 100).toFixed(4)) : 0
      modifyForm.sxfWxRate = Number(originalFormCopy.sxfWxRate) ? Number((originalFormCopy.sxfWxRate / 100).toFixed(4)) : 0
      modifyForm.fyZfbRate = Number(originalFormCopy.fyZfbRate) ? Number((originalFormCopy.fyZfbRate / 100).toFixed(4)) : 0
      modifyForm.fyWxRate = Number(originalFormCopy.fyWxRate) ? Number((originalFormCopy.fyWxRate / 100).toFixed(4)) : 0

      modifyForm.miniProgramPhotoId = originalFormCopy.miniProgramPhotoId
      modifyForm.officialAccountsPicId = originalFormCopy.officialAccountsPicId
      modifyForm.appPhotoId = originalFormCopy.appPhotoId
      modifyForm.specialQualificationPhotoId = originalFormCopy.specialQualificationPhotoId
      modifyForm.supplementPhotoId = originalFormCopy.supplementPhotoId
      modifyForm.businessLicensePhotoId = originalFormCopy.businessLicensePhotoId
      modifyForm.organizationPhotoId = originalFormCopy.organizationPhotoId
      modifyForm.epresentativePhotoId = originalFormCopy.epresentativePhotoId
      modifyForm.epresentativePhotoId2 = originalFormCopy.epresentativePhotoId2

      // 经营地址
      modifyForm.regProvCd = originalFormCopy.regProvCd
      modifyForm.regCityCd = originalFormCopy.regCityCd
      modifyForm.regDistCd = originalFormCopy.regDistCd

      modifyForm.regProvCdName = originalFormCopy.regProvCdName
      modifyForm.regCityCdName = originalFormCopy.regCityCdName
      modifyForm.regDistCdName = originalFormCopy.regDistCdName

      modifyForm.status = 2
      this.dataOptimization(modifyForm)
    },
    // 数据过滤优化器
    dataOptimization: function (data) {
      addMchInfo(data).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.btnLoading = false
        this.rooterDeatil(this.form.id)
        this.$refs.page.refresh()
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 深拷贝
     */
    deepCopy: function (obj) {
      var result = Array.isArray(obj) ? [] : {}
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object') {
            result[key] = this.deepCopy(obj[key]) // 递归复制
          } else {
            result[key] = obj[key]
          }
        }
      }
      return result
    },
    /*
     * 上传失败
     * */
    handleImageFailed () {
      this.$message({
        message: '图片上传失败',
        type: 'error'
      })
    },
    /*
     * 对类型、大小做限制
     * */
    beforeLogoUpload (file) {
      let isImage = file.type.substring(0, 5) === 'image'
      if (!isImage) {
        this.$message.error('只允许图片格式（jpg / jpeg / png）')
        return false
      }
      return true
    },
    getPicUrl (picid) {
      // console.log(returnThumbnailUrl(picid))
      return returnThumbnailUrl(picid)
    },
    // 返回详情页
    goback () {
      this.$router.go('-1')
    },

    // 跳转详情页
    rooterDeatil (data) {
      // console.log(data)
      // query发送ID到详情
      let id = data
      this.$router.push({path: '/pay/views/detail', query: {id: id}})
    },

    /**
     * 工具
     * @param ts 时间戳
     * @returns {string} 格式化事时间
     */
    // 时间格式化
    format (ts) {
      let time = new Date(ts)
      let y = time.getFullYear()
      let m = time.getMonth() + 1
      let d = time.getDate()
      return y + '-' + this.add0(m) + '-' + this.add0(d)
    },

    /**
     * 补充0
     * @param  m 月和日，补齐2位
     * @returns {string} 补齐2二位后的时间
     */
    add0 (m) {
      return m < 10 ? '0' + m : m
    }

  }
}
</script>

<style scoped>
  .box-card-header {
    margin: -18px -20px;
    padding: 10px 20px;
    background: #F4F5F9;
  }

  .form_input {
    width: 350px;
  }

  .info {
    padding: 0px 16px;
    border-left: 5px solid #6c6fbf;
    margin: 20px 0;
  }

  .line {
    width: 350px;
    height: 1px;
    background-color: #D3E2FF;
    box-shadow: 0 1px 5px 0px #d3e2ff;
    margin-top: 8px;
  }

  /*图片上传*/
  .logo-uploader {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    vertical-align: top;
  }

  .logo-uploader:hover {
    border-color: #409EFF;
  }

  .logo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .logo {
    width: 178px;
    height: 178px;
    display: block;
  }

  .title-header {
    margin-bottom: 10px;
  }

  .name_title {
    font-size: 24px;
    margin: 0 0 10px 0;
  }

  .name_back {
    cursor: pointer;
    float: right;
    font-size: 14px;
    color: #409eff;
  }
</style>
