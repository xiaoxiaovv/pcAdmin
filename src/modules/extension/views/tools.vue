<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>微信开放平台{{levelAlias.oemName}}设置</span>
      </div>
      <div>
        <div class="tools-group">
          <div class="tools-item" @click="manageWechatConfig(0)">
            <div class="tools-item-img">
              <img src="../../../assets/images/extension/wechat.png" alt="">
            </div>
            <div class="tools-item-content">
              <p>微信开放平台配置</p>
              <p></p>
            </div>
          </div>
          <div class="tools-item" @click="manageWechatConfig(1)">
            <div class="tools-item-img">
              <img src="../../../assets/images/extension/wechat.png" alt="">
            </div>
            <div class="tools-item-content">
              <p>小程序发布配置</p>
              <p></p>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>其他功能</span>
      </div>
      <div>
        <div class="tools-group">
          <div class="tools-item" @click="createDynamicPsw">
            <div class="tools-item-img">
              <img src="../../../assets/images/extension/wechat.png" alt="">
            </div>
            <div class="tools-item-content">
              <p>生成动态密码</p>
              <p></p>
            </div>
          </div>
          <div class="tools-item" @click="configGaoDeKey">
            <div class="tools-item-img">
              <img src="../../../assets/images/extension/wechat.png" alt="">
            </div>
            <div class="tools-item-content">
              <p>配置高德秘钥</p>
              <p></p>
            </div>
          </div>
          <div class="tools-item" @click="aliConfig">
            <div class="tools-item-img">
              <img src="../../../assets/images/extension/wechat.png" alt="">
            </div>
            <div class="tools-item-content">
              <p>配置如意秘钥</p>
              <p></p>
            </div>
          </div>

          <div class="tools-item" @click="aliCycleConfig">
            <div class="tools-item-img">
              <img src="../../../assets/images/extension/wechat.png" alt="">
            </div>
            <div class="tools-item-content">
              <p>配置周期扣款秘钥</p>
              <p></p>
            </div>
          </div>

          <div class="tools-item" @click="cmfConfig">
            <div class="tools-item-img">
              <img src="../../../assets/images/extension/wechat.png" alt="">
            </div>
            <div class="tools-item-content">
              <p>配置插件秘钥</p>
              <p></p>
            </div>
          </div>

          <div class="tools-item" @click="emailConfig">
            <div class="tools-item-img">
              <img src="../../../assets/images/extension/wechat.png" alt="">
            </div>
            <div class="tools-item-content">
              <p>配置进件邮箱通知</p>
              <p></p>
            </div>
          </div>

        </div>
      </div>
      <div>

      </div>
    </el-card>
    <el-card class="box-card" style="display: none">
      <div slot="header" class="clearfix">
        <span>运营工具</span>
      </div>
      <div>
        <div class="tools-group">
          <!--二维码扩展-->
          <div class="tools-item" @click="goPage('/extension/views/QRgeneratedRecords')">
            <div class="tools-item-img">
              <img src="../../../assets/images/extension/qr.png" alt="">
            </div>
            <div class="tools-item-content">
              <p>收款码</p>
              <p>可批量生成无归属二维码</p>
            </div>
          </div>

        </div>
      </div>
    </el-card>

    <el-card class="box-card"  style="display: none">
      <div slot="header" class="clearfix">
        <span>广告系统</span>
      </div>
      <div>
        <div class="tools-group">
          <!--二维码扩展-->
          <div class="tools-item" @click="goPage('/extension/views/postPaymentAD')">
            <div class="tools-item-img">
              <img src="../../../assets/images/extension/ad.png" alt="">
            </div>
            <div class="tools-item-content">
              <p>支付后广告</p>
              <p>多维度营销传播、流量变现</p>
            </div>
          </div>
          <!--二维码扩展-->
          <div class="tools-item" @click="goPage('/extension/views/appAd')">
            <div class="tools-item-img">
              <img src="../../../assets/images/extension/ad.png" alt="">
            </div>
            <div class="tools-item-content">
              <p>App广告</p>
              <p>App广告</p>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <!--微信小程序配置-->
    <el-dialog title="微信开放平台配置"
               :visible.sync="wechatInfo.show"
               width="600px">
      <div v-if="wechatInfo.show">
        <el-form  ref="validateForm" label-width="150px" :model="params" :rules="rules" @submit.native.prevent>
          <el-form-item label="APPID" prop="appId">
            <el-input v-model.trim="params.appId" size="medium" style="width: 300px;" clearable></el-input>
          </el-form-item>
          <el-form-item label="APPSECRET" prop="appSecret">
            <el-input v-model.trim="params.appSecret" size="medium" style="width: 300px;" clearable></el-input>
          </el-form-item>
          <el-form-item label="消息校验Token" prop="token">
            <el-input v-model.trim="params.token" size="medium" style="width: 300px;" clearable></el-input>
          </el-form-item>
          <el-form-item label="消息加解密Key" prop="msgKey">
            <el-input v-model.trim="params.msgKey" size="medium" style="width: 300px;" clearable></el-input>
          </el-form-item>
          <el-form-item label="文件名" prop="filename">
            <el-input v-model.trim="params.filename" size="medium" style="width: 300px;" clearable></el-input>
          </el-form-item>
          <el-form-item label="文件内容" prop="filecontent">
            <el-input v-model.trim="params.filecontent" size="medium" style="width: 300px;" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <div class="vm-text-right">
              <el-button @click="wechatInfo.show = false">取 消</el-button>
              <el-button type="primary" @click="submitInfo">确 定</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--小程序发布配置-->
    <el-dialog class="vm-dialog"
               title="小程序发布配置"
               width="800px"
               v-if="dialogWechatConfig.show"
               :visible.sync="dialogWechatConfig.show">
      <ToolWechatConfig :propsInfo="dialogWechatConfig"></ToolWechatConfig>
    </el-dialog>
    <!--生成动态密码-->
    <el-dialog class="vm-dialog"
               title="生成动态密码"
               width="400px"
               v-if="dialogDynamicPsw.show"
               :visible.sync="dialogDynamicPsw.show">
      <DynamicPsw :propsInfo="dialogDynamicPsw"></DynamicPsw>
    </el-dialog>
    <!--高德-->
    <el-dialog class="vm-dialog"
               title="配置高德秘钥"
               width="400px"
               v-if="gaoDe.show"
               :visible.sync="gaoDe.show">
      <GaoDe :propsInfo="gaoDe"></GaoDe>
    </el-dialog>
    <!--支付宝如意-->
    <el-dialog class="vm-dialog"
               title="配置支付宝如意秘钥"
               width="400px"
               v-if="ali.show"
               :visible.sync="ali.show">
      <Ali :propsInfo="ali"></Ali>
    </el-dialog>
    <!--支付宝周期扣款-->
    <el-dialog class="vm-dialog"
               title="配置周期扣款秘钥"
               width="400px"
               v-if="aliCycle.show"
               :visible.sync="aliCycle.show">
      <AliCycle :propsInfo="aliCycle"></AliCycle>
    </el-dialog>
    <!--聪明付插件-->
    <el-dialog class="vm-dialog"
               title="配置插件秘钥"
               width="400px"
               v-if="cmf.show"
               :visible.sync="cmf.show">
      <Cmf :propsInfo="cmf"></Cmf>
    </el-dialog>
    <!--进件邮箱通知-->
    <el-dialog class="vm-dialog"
               title="配置邮箱"
               width="400px"
               v-if="email.show"
               :visible.sync="email.show">
      <Email :propsInfo="email"></Email>
    </el-dialog>

  </div>
</template>

<script>
import * as toolApi from '../api/tool'
import { levelAliasMixin } from '@/mixins'
import ToolWechatConfig from './components/toolWechatConfig.vue'
import DynamicPsw from './components/dynamicPsw.vue'
import GaoDe from './components/gaoDe.vue'
import Ali from './components/ali.vue'
import AliCycle from './components/aliCycle.vue'
import Cmf from './components/cmf.vue'
import Email from './components/email.vue'
export default {
  name: 'tools',
  mixins: [levelAliasMixin],
  components: {ToolWechatConfig, DynamicPsw, GaoDe, Ali,AliCycle,Cmf,Email},
  data () {
    return {
      email: {
        show: false
      },
      cmf: {
        show: false
      },
      aliCycle: {
        show: false
      },
      gaoDe: {
        show: false
      },
      ali: {
        show: false
      },
      wechatInfo: {
        show: false
      },
      params: {
        appId: '',
        appSecret: '',
        token: '',
        msgKey: '',
        filename: '',
        filecontent: '',
        serviceProviderId: sessionStorage.getItem('companyId')
      },
      dialogWechatConfig: {
        show: false
      },
      dialogDynamicPsw: {
        show: false
      },
      rules: {
        appId: [
          { required: true, message: '请输入APPID' }
        ],
        appSecret: [
          { required: true, message: '请输入APPSECRET' }
        ],
        token: [
          { required: true, message: '请输入消息校验Token' }
        ],
        msgKey: [
          { required: true, message: '请输入消息加解密Key' }
        ],
        filename: [
          { required: true, message: '请输入文件名' }
        ],
        filecontent: [
          { required: true, message: '请输入文件内容' }
        ]
      }
    }
  },
  methods: {
    emailConfig(){
      this.email.show = true
    },
    cmfConfig(){
      this.cmf.show = true
    },
    aliCycleConfig(){
      this.aliCycle.show = true
    },
    aliConfig(){
      this.ali.show = true
    },
    configGaoDeKey(){
      this.gaoDe.show = true
    },
    /**
       * 前往页面
       * @param handle url路径
       */
    goPage (handle) {
      if (handle != '' && handle != null) {
        this.$router.push({path: handle})
      } else {
        this.$message.error('URL错误')
      }
    },
    manageWechatConfig (type) {
      if (!type) {
        this.getConfigInfo()
      } else {
        this.getWechatConfig()
      }
    },
    /**
     * 获取配置信息
     */
    getConfigInfo () {
      this.wechatInfo = {
        show: true
      }
      toolApi.getweOpenConfig({companyId: sessionStorage.getItem('companyId')}).then(res => {
        this.params.appId = res.obj.appId
        this.params.appSecret = res.obj.appSecret
        this.params.msgKey = res.obj.msgKey
        this.params.token = res.obj.token
        this.params.id = res.obj.id
        this.params.serviceProviderId = res.obj.serviceProviderId
        this.params.filename = res.obj.filename
        this.params.filecontent = res.obj.filecontent
      })
    },
    /**
     * 小程序配置
     */
    getWechatConfig () {
      this.dialogWechatConfig.show = true
    },
    /**
     * 提交信息
     */
    submitInfo () {
      this.$refs.validateForm.validate((valid) => {
        if (valid) {
          this.confirmSubmit()
        } else {
          return false
        }
      })
    },
    confirmSubmit () {
      toolApi.modifyOpenConfig(this.params).then(res => {
        this.$message.success('保存成功！')
        this.wechatInfo = {
          show: false
        }
        this.params = {
          appId: '',
          appSecret: '',
          token: '',
          msgKey: '',
          filename: '',
          filecontent: '',
          serviceProviderId: sessionStorage.getItem('companyId')
        }
      })
    },
    /**
     * 生成动态密码
     */
    createDynamicPsw () {
      this.dialogDynamicPsw = {
        show: true
      }
    }
  }
}
</script>

<style scoped>
  .block {
    display: inline-block;
    vertical-align: middle;
  }

  .box-card {
    margin-bottom: 16px;
  }

  .tools-group {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }

  .tools-item {
    width: 500px;
    height: 100px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    box-shadow: 0px 3px 5px 0px #eeeeee;
    padding: 0 20px;
    cursor: pointer;
    margin-right: 20px;
  }

  .tools-item:hover {
    box-shadow: 0px 3px 5px 0px #d8d8d8;
  }

  .tools-item-content p {
    margin: 0 0 0 20px;
    color: #1f2d3d;
  }

  .tools-item-content p:nth-child(1) {
    font-size: 14px;
    font-weight: bold;
  }

  .tools-item-content p:nth-child(2) {
    margin-top: 8px;
    font-size: 13px;
    color: #808080;
  }

</style>
