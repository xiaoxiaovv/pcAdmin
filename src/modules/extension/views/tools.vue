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
        </div>
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
  </div>
</template>

<script>
import * as toolApi from '../api/tool'
import { levelAliasMixin } from '@/mixins'
import ToolWechatConfig from './components/toolWechatConfig.vue'
import DynamicPsw from './components/dynamicPsw.vue'
export default {
  name: 'tools',
  mixins: [levelAliasMixin],
  components: {ToolWechatConfig, DynamicPsw},
  data () {
    return {
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
