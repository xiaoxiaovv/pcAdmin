<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        style="width: 200px"
        class="formItem"
        placeholder="商户名称"
        v-model="merchantName" @keyup.enter.native="search" size="small" clearable></el-input>
      <!--开通支付通道-->
      <el-select v-model="isFindPayChanel" placeholder="是否配置支付通道" size="small" class="formItem" clearable>
        <el-option label="是" :value="1"></el-option>
        <el-option label="否" :value="0"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" class="filter-item" @click="search" size="small">查询</el-button>
    </div>
    <!--表格-->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        label="商户名">
        <!--防止字符串过长，影响表格，加了一个鼠标经过文字提示-->
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.name" placement="top">
            <span>{{ scope.row.name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        min-width="100"
        label="商户账号">
        <!--防止字符串过长，影响表格，加了一个鼠标经过文字提示-->
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.phone" placement="top">
            <span>{{ scope.row.phone }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        min-width="100"
        label="联系人">
        <!--防止字符串过长，影响表格，加了一个鼠标经过文字提示-->
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.contact" placement="top">
            <span>{{ scope.row.contact }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        min-width="200"
        label="配置通道">
        <template slot-scope="scope">
          <div>微信公众号支付通道配置：<span class="color-orange">{{showChannel(1, scope.row.mchPayChanelInfo.wxWebPay)}}</span></div>
          <div>微信付款码支付通道配置：<span class="color-orange">{{showChannel(1, scope.row.mchPayChanelInfo.wxScanPay)}}</span></div>
          <div>支付宝公众号支付通道配置：<span class="color-orange">{{showChannel(2, scope.row.mchPayChanelInfo.aliWebPay)}}</span></div>
          <div>支付宝付款码支付通道配置：<span class="color-orange">{{showChannel(2, scope.row.mchPayChanelInfo.aliScanPay)}}</span></div>
          <div>银联公众号支付通道配置：<span class="color-orange">{{showChannel(9, scope.row.mchPayChanelInfo.ylWebPay)}}</span></div>
          <div>银联付款码支付通道配置：<span class="color-orange">{{showChannel(9, scope.row.mchPayChanelInfo.ylScanPay)}}</span></div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="openChannelDialog(scope.row)">支付通道配置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--翻页-->
    <pagination
      :total-elements="totalElements"
      :change-callback="getMerchantList"
      ref="page"></pagination>

    <el-dialog
      title="支付通道配置"
      :visible.sync="configDialog"
      :before-close="closeConfigDialog"
      width="880px">
      <el-tabs type="border-card" class="pay-channel-config">
        <el-tab-pane label="微信">
          <div class="sl-flex">
            <div class="paychannel-config-title">
              <span>付款码支付(B扫C)</span>
            </div>
            <div class="sl-flex-1">
              <el-radio v-model="form.wx.scanPay" label="1" v-if="payConfig.indexOf('官方') > -1" border>微信服务商</el-radio>
              <el-radio v-model="form.wx.scanPay" label="6" v-if="payConfig.indexOf('富友') > -1" border>富友</el-radio>
              <el-radio v-model="form.wx.scanPay" label="7" v-if="payConfig.indexOf('随行付') > -1" border>随行付</el-radio>
              <el-radio v-model="form.wx.scanPay" label="9" v-if="payConfig.indexOf('威富通') > -1" border>威富通</el-radio>
              <el-radio v-model="form.wx.scanPay" label="10" v-if="payConfig.indexOf('乐刷') > -1" border>乐刷</el-radio>
              <el-radio v-model="form.wx.scanPay" label="11" v-if="payConfig.indexOf('传化') > -1" border>传化</el-radio>
              <el-radio v-model="form.wx.scanPay" label="12" v-if="payConfig.indexOf('天阙随行付') > -1" border>天阙随行付</el-radio>
              <el-radio v-model="form.wx.scanPay" label="13" v-if="payConfig.indexOf('易生') > -1" border>易生</el-radio>
              <el-radio v-model="form.wx.scanPay" label="14" v-if="payConfig.indexOf('新大陆') > -1" border>新大陆</el-radio>
              <el-radio v-model="form.wx.scanPay" label="19" v-if="payConfig.indexOf('开店宝') > -1" border>开店宝</el-radio>
              <el-radio v-model="form.wx.scanPay" label="20" v-if="payConfig.indexOf('畅捷') > -1" border>畅捷</el-radio>

<!--			        <el-radio v-model="form.wx.scanPay" label="15" v-if="payConfig.indexOf('银联') > -1" border>中国银联</el-radio>-->
<!--              <el-radio v-model="form.wx.scanPay" label="16" v-if="payConfig.indexOf('拉卡拉') > -1" border>拉卡拉</el-radio>-->

			</div>
          </div>
          <!--
          <el-radio v-model="form.wx.scanPay" label="5" border>惠闪付</el-radio>
          <el-radio v-model="form.wx.scanPay" label="3" border>易融码</el-radio>
          -->
          <br>
          <div class="sl-flex">
            <div class="paychannel-config-title">
              <span>公众号支付(C扫B)</span>
            </div>
            <div class="sl-flex-1">
              <el-radio v-model="form.wx.wapPay" label="1" v-if="payConfig.indexOf('官方') > -1" border>微信服务商</el-radio>
              <el-radio v-model="form.wx.wapPay" label="6" v-if="payConfig.indexOf('富友') > -1" border>富友</el-radio>
              <el-radio v-model="form.wx.wapPay" label="7" v-if="payConfig.indexOf('随行付') > -1" border>随行付</el-radio>
              <el-radio v-model="form.wx.wapPay" label="9" v-if="payConfig.indexOf('威富通') > -1" border>威富通</el-radio>
              <el-radio v-model="form.wx.wapPay" label="10" v-if="payConfig.indexOf('乐刷') > -1" border>乐刷</el-radio>
              <el-radio v-model="form.wx.wapPay" label="11" v-if="payConfig.indexOf('传化') > -1" border>传化</el-radio>
              <el-radio v-model="form.wx.wapPay" label="12" v-if="payConfig.indexOf('天阙随行付') > -1" border>天阙随行付</el-radio>
              <el-radio v-model="form.wx.wapPay" label="13" v-if="payConfig.indexOf('易生') > -1" border>易生</el-radio>
              <el-radio v-model="form.wx.wapPay" label="14" v-if="payConfig.indexOf('新大陆') > -1" border>新大陆</el-radio>
              <el-radio v-model="form.wx.wapPay" label="19" v-if="payConfig.indexOf('开店宝') > -1" border>开店宝</el-radio>
              <el-radio v-model="form.wx.wapPay" label="20" v-if="payConfig.indexOf('畅捷') > -1" border>畅捷</el-radio>

			        <!--<el-radio v-model="form.wx.wapPay" label="15" v-if="payConfig.indexOf('银联') > -1" border>中国银联</el-radio>
              <el-radio v-model="form.wx.wapPay" label="16" v-if="payConfig.indexOf('拉卡拉') > -1" border>拉卡拉</el-radio>-->

            </div>
          </div>
          <!--
          <el-radio v-model="form.wx.wapPay" label="2" border>会员宝</el-radio>
          <el-radio v-model="form.wx.wapPay" label="3" border>易融码</el-radio>
          -->
        </el-tab-pane>
        <el-tab-pane label="支付宝">
          <div class="sl-flex">
            <div class="paychannel-config-title">
              <span>付款码支付(B扫C)</span>
            </div>
            <div class="sl-flex-1">
              <el-radio v-model="form.ali.scanPay" label="1" v-if="payConfig.indexOf('官方') > -1" border>支付宝服务商</el-radio>
              <el-radio v-model="form.ali.scanPay" label="6" v-if="payConfig.indexOf('富友') > -1" border>富友</el-radio>
              <el-radio v-model="form.ali.scanPay" label="7" v-if="payConfig.indexOf('随行付') > -1" border>随行付</el-radio>
              <el-radio v-model="form.ali.scanPay" label="9" v-if="payConfig.indexOf('威富通') > -1" border>威富通</el-radio>
              <el-radio v-model="form.ali.scanPay" label="10" v-if="payConfig.indexOf('乐刷') > -1" border>乐刷</el-radio>
              <el-radio v-model="form.ali.scanPay" label="11" v-if="payConfig.indexOf('传化') > -1" border>传化</el-radio>
              <el-radio v-model="form.ali.scanPay" label="12" v-if="payConfig.indexOf('天阙随行付') > -1" border>天阙随行付</el-radio>
              <el-radio v-model="form.ali.scanPay" label="13" v-if="payConfig.indexOf('易生') > -1" border>易生</el-radio>
              <el-radio v-model="form.ali.scanPay" label="14" v-if="payConfig.indexOf('新大陆') > -1" border>新大陆</el-radio>
              <el-radio v-model="form.ali.scanPay" label="19" v-if="payConfig.indexOf('开店宝') > -1" border>开店宝</el-radio>
              <el-radio v-model="form.ali.scanPay" label="20" v-if="payConfig.indexOf('畅捷') > -1" border>畅捷</el-radio>

              <!--<el-radio v-model="form.ali.scanPay" label="15" v-if="payConfig.indexOf('银联') > -1" border>中国银联</el-radio>
              <el-radio v-model="form.ali.scanPay" label="16" v-if="payConfig.indexOf('拉卡拉') > -1" border>拉卡拉</el-radio>-->

            </div>
          </div>
          <!--
          <el-radio v-model="form.ali.scanPay" label="5" border>惠闪付</el-radio>
          <el-radio v-model="form.ali.scanPay" label="3" border>易融码</el-radio>
          -->
          <br>
          <div class="sl-flex">
            <div class="paychannel-config-title">
              <span>公众号支付(C扫B)</span>
            </div>
            <div class="sl-flex-1">
              <el-radio v-model="form.ali.wapPay" label="1" v-if="payConfig.indexOf('官方') > -1" border>支付宝服务商</el-radio>
              <el-radio v-model="form.ali.wapPay" label="6" v-if="payConfig.indexOf('富友') > -1" border>富友</el-radio>
              <el-radio v-model="form.ali.wapPay" label="7" v-if="payConfig.indexOf('随行付') > -1" border>随行付</el-radio>
              <el-radio v-model="form.ali.wapPay" label="9" v-if="payConfig.indexOf('威富通') > -1" border>威富通</el-radio>
              <el-radio v-model="form.ali.wapPay" label="10" v-if="payConfig.indexOf('乐刷') > -1" border>乐刷</el-radio>
              <el-radio v-model="form.ali.wapPay" label="11" v-if="payConfig.indexOf('传化') > -1" border>传化</el-radio>
              <el-radio v-model="form.ali.wapPay" label="12" v-if="payConfig.indexOf('天阙随行付') > -1" border>天阙随行付</el-radio>
              <el-radio v-model="form.ali.wapPay" label="13" v-if="payConfig.indexOf('易生') > -1" border>易生</el-radio>
              <el-radio v-model="form.ali.wapPay" label="14" v-if="payConfig.indexOf('新大陆') > -1" border>新大陆</el-radio>
              <el-radio v-model="form.ali.wapPay" label="19" v-if="payConfig.indexOf('开店宝') > -1" border>开店宝</el-radio>
              <el-radio v-model="form.ali.wapPay" label="20" v-if="payConfig.indexOf('畅捷') > -1" border>畅捷</el-radio>

			        <!--<el-radio v-model="form.ali.wapPay" label="15" v-if="payConfig.indexOf('银联') > -1" border>中国银联</el-radio>
              <el-radio v-model="form.ali.wapPay" label="16" v-if="payConfig.indexOf('拉卡拉') > -1" border>拉卡拉</el-radio>-->

			</div>
          </div>

          <!--
          <el-radio v-model="form.ali.wapPay" label="2" border>会员宝</el-radio>
          <el-radio v-model="form.ali.wapPay" label="3" border>易融码</el-radio>
          -->
        </el-tab-pane>

        <el-tab-pane label="银联">
          <div class="sl-flex">
            <div class="paychannel-config-title">
              <span>付款码支付(B扫C)</span>
            </div>
            <div class="sl-flex-1">
              <el-radio v-model="form.yl.scanPay" label="1" v-if="payConfig.indexOf('官方') > -1" border>支付宝服务商</el-radio>
              <el-radio v-model="form.yl.scanPay" label="6" v-if="payConfig.indexOf('富友') > -1" border>富友</el-radio>
              <el-radio v-model="form.yl.scanPay" label="7" v-if="payConfig.indexOf('随行付') > -1" border>随行付</el-radio>
              <el-radio v-model="form.yl.scanPay" label="9" v-if="payConfig.indexOf('威富通') > -1" border>威富通</el-radio>
              <el-radio v-model="form.yl.scanPay" label="10" v-if="payConfig.indexOf('乐刷') > -1" border>乐刷</el-radio>
              <el-radio v-model="form.yl.scanPay" label="11" v-if="payConfig.indexOf('传化') > -1" border>传化</el-radio>
              <el-radio v-model="form.yl.scanPay" label="12" v-if="payConfig.indexOf('天阙随行付') > -1" border>天阙随行付</el-radio>
              <el-radio v-model="form.yl.scanPay" label="13" v-if="payConfig.indexOf('易生') > -1" border>易生</el-radio>
              <el-radio v-model="form.yl.scanPay" label="14" v-if="payConfig.indexOf('新大陆') > -1" border>新大陆</el-radio>
              <el-radio v-model="form.yl.scanPay" label="19" v-if="payConfig.indexOf('开店宝') > -1" border>开店宝</el-radio>
              <el-radio v-model="form.yl.scanPay" label="20" v-if="payConfig.indexOf('畅捷') > -1" border>畅捷</el-radio>

              <!--<el-radio v-model="form.yl.scanPay" label="15" v-if="payConfig.indexOf('银联') > -1" border>中国银联</el-radio>
              <el-radio v-model="form.yl.scanPay" label="16" v-if="payConfig.indexOf('拉卡拉') > -1" border>拉卡拉</el-radio>-->

            </div>
          </div>
          <!--
          <el-radio v-model="form.yl.scanPay" label="5" border>惠闪付</el-radio>
          <el-radio v-model="form.yl.scanPay" label="3" border>易融码</el-radio>
          -->
          <br>
          <div class="sl-flex">
            <div class="paychannel-config-title">
              <span>公众号支付(C扫B)</span>
            </div>
            <div class="sl-flex-1">
              <el-radio v-model="form.yl.wapPay" label="1" v-if="payConfig.indexOf('官方') > -1" border>支付宝服务商</el-radio>
              <el-radio v-model="form.yl.wapPay" label="6" v-if="payConfig.indexOf('富友') > -1" border>富友</el-radio>
              <el-radio v-model="form.yl.wapPay" label="7" v-if="payConfig.indexOf('随行付') > -1" border>随行付</el-radio>
              <el-radio v-model="form.yl.wapPay" label="9" v-if="payConfig.indexOf('威富通') > -1" border>威富通</el-radio>
              <el-radio v-model="form.yl.wapPay" label="10" v-if="payConfig.indexOf('乐刷') > -1" border>乐刷</el-radio>
              <el-radio v-model="form.yl.wapPay" label="11" v-if="payConfig.indexOf('传化') > -1" border>传化</el-radio>
              <el-radio v-model="form.yl.wapPay" label="12" v-if="payConfig.indexOf('天阙随行付') > -1" border>天阙随行付</el-radio>
              <el-radio v-model="form.yl.wapPay" label="13" v-if="payConfig.indexOf('易生') > -1" border>易生</el-radio>
              <el-radio v-model="form.yl.wapPay" label="14" v-if="payConfig.indexOf('新大陆') > -1" border>新大陆</el-radio>
              <el-radio v-model="form.yl.wapPay" label="19" v-if="payConfig.indexOf('开店宝') > -1" border>开店宝</el-radio>
              <el-radio v-model="form.yl.wapPay" label="20" v-if="payConfig.indexOf('畅捷') > -1" border>畅捷</el-radio>

              <!--<el-radio v-model="form.yl.wapPay" label="15" v-if="payConfig.indexOf('银联') > -1" border>中国银联</el-radio>
              <el-radio v-model="form.yl.wapPay" label="16" v-if="payConfig.indexOf('拉卡拉') > -1" border>拉卡拉</el-radio>-->

            </div>
          </div>

          <!--
          <el-radio v-model="form.ali.wapPay" label="2" border>会员宝</el-radio>
          <el-radio v-model="form.ali.wapPay" label="3" border>易融码</el-radio>
          -->
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeConfigDialog">取 消</el-button>
        <el-button type="primary" @click="configSave">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import {getMerchant, findPayChannel, configSave, getSystemCOnfig} from '@/modules/pay/api/pay_config'
import pagination from '@/components/pagination/index'

export default {
  name: 'payConfig',
  components: {pagination},
  data () {
    return {
      loading: true,
      tableData: [], // 表格数据
      totalElements: 0, // 数据条数
      merchantName: '',
      isFindPayChanel: null, // 支付通道配置
      configDialog: false,
      merchantId: '',
      form: {
        wx: {
          scanPay: '',
          wapPay: ''
        },
        ali: {
          scanPay: '',
          wapPay: ''
        },
        yl: {
          scanPay: '',
          wapPay: ''
        }

      },
      // 支付参数
      payDialog: false,
      fileList: [],
      payConfig: []
    }
  },
  mounted () {
    this.getMerchantList()
    this.getSystemCOnfigInfo()
  },
  computed: {
    showChannel () {
      return function (type, channelName) {
        return channelName || '--'
      }
    }
  },
  methods: {
    getSystemCOnfigInfo () {
      getSystemCOnfig().then(res => {
        this.payConfig = [...res.obj]
        // debugger
      })
    },
    /*
     * 获取{{levelAlias.firstName}}对应的商户列表
     * */
    getMerchantList (number, pageSize) {
      this.loading = true
      getMerchant(number, pageSize, this.merchantName, this.isFindPayChanel).then(response => {
        let data = response.obj
        this.totalElements = data.totalElements
        this.tableData = data.content
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(() => {
        this.loading = false
      })
    },
    search () {
      this.$refs.page.search()
    },
    openChannelDialog (row) {
      this.configDialog = true
      this.merchantId = row.id
      this.findPayChannel(this.merchantId)
    },
    closeConfigDialog () {
      this.configDialog = false
      this.clearForm()
    },

    // 获取商户对应的支付配置
    findPayChannel (merchantId) {
      findPayChannel(merchantId).then(response => {
        let data = response.obj
        for (let i = 0; i < data.length; i++) {
          let obj = data[i]
          if (obj.payWay == 1) {
            this.form.wx.scanPay = obj.scanPayChannel + ''
            this.form.wx.wapPay = obj.webPayChannel + ''
          } else if (obj.payWay == 2) {
            this.form.ali.scanPay = obj.scanPayChannel + ''
            this.form.ali.wapPay = obj.webPayChannel + ''
          } else if (obj.payWay == 9) {
            this.form.yl.scanPay = obj.scanPayChannel + ''
            this.form.yl.wapPay = obj.webPayChannel + ''
          }
        }
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(() => {
        this.loading = false
      })
    },

    clearForm () {
      this.form.wx.scanPay = ''
      this.form.wx.wapPay = ''
      this.form.ali.scanPay = ''
      this.form.ali.wapPay = ''
      this.form.yl.scanPay = ''
      this.form.yl.wapPay = ''
    },

    /**
       * 保存支付配置
       */
    configSave () {
      configSave(JSON.stringify(this.form), this.merchantId).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.clearForm()
        this.configDialog = false
      }).catch(() => {
        this.loading = false
      })
    }

  }
}
</script>

<style scoped>
  .logo-uploader {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
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
</style>
