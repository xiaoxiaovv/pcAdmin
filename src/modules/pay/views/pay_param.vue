<template>
  <div class="app-container">
    <!--功能-->
    <div class="action-container">
      <!--商户名/代理名称-->
      <el-input v-model.trim="searchForm.companyName"
                @keyup.enter.native="search"
                placeholder="代理名称"
                size="small"
                clearable
                class="formItem"></el-input>
      <!--商户名-->
      <el-input v-model.trim="searchForm.name"
                @keyup.enter.native="search"
                placeholder="商户名"
                size="small"
                clearable
                class="formItem"></el-input>
      <!--联系人-->
      <el-input v-model.trim="searchForm.contact"
                @keyup.enter.native="search"
                placeholder="联系人"
                size="small"
                clearable
                class="formItem"></el-input>
      <!--开通支付通道-->
      <!--
      <el-select v-model="searchForm.isFindPayChanel" placeholder="是否配置支付通道" size="small" class="formItem" clearable>
        <el-option label="是" :value="1"></el-option>
        <el-option label="否" :value="0"></el-option>
      </el-select>
      -->
      <!--开通支付配置-->
      <el-select v-model="searchForm.isFindPayConfig"
                 placeholder="是否配置支付参数"
                 size="small"
                 class="formItem"
                 clearable>
        <el-option key="1"
                   label="是"
                   :value="1"></el-option>
        <el-option key="0"
                   label="否"
                   :value="0"></el-option>
      </el-select>
      <!--按钮-->
      <el-button type="primary"
                 size="small"
                 @click="search">查询</el-button>
      <el-button type="primary"
                 size="small"
                 @click="reset">重置</el-button>
      <el-button type="primary"
                 size="small"
                 @click="openTopConfigDialog">{{levelAlias.oemName}}支付参数</el-button>
      <el-button type="primary"
                 size="small"
                 @click="openCommissionConfigDialog">佣金提现参数</el-button>
      <!--<el-button type="primary"
                 size="small"
                 @click="getCommissionConfig">获取佣金生成参数</el-button>-->
     <!-- <el-button type="primary"
                 size="small"
                 @click="findCommissionCurrentMonth">获取当月佣金</el-button>-->
      <el-button type="primary"
                 size="small"
                 @click="openTopCommissionDialog">佣金生成</el-button>
    </div>

    <!--表格-->
    <el-table :data="tableData"
              style="width: 100%">
      <el-table-column type="index"
                       label="序号"
                       width="50">
      </el-table-column>
      <el-table-column label="商户名">
        <!--防止字符串过长，影响表格，加了一个鼠标经过文字提示-->
        <template slot-scope="scope">
          <el-tooltip effect="dark"
                      :content="scope.row.name"
                      placement="top">
            <span>{{ scope.row.name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="商户账号">
        <!--防止字符串过长，影响表格，加了一个鼠标经过文字提示-->
        <template slot-scope="scope">
          <el-tooltip effect="dark"
                      :content="scope.row.phone"
                      placement="top">
            <span>{{ scope.row.phone }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="联系人">
        <!--防止字符串过长，影响表格，加了一个鼠标经过文字提示-->
        <template slot-scope="scope">
          <el-tooltip effect="dark"
                      :content="scope.row.contact"
                      placement="top">
            <span>{{ scope.row.contact }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <!--上级代理-->
      <el-table-column label="上级代理">
        <template slot-scope="scope">
          <span>{{ scope.row.companyName }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200"
                       label="配置通道">
        <template slot-scope="scope">
          <div>
            已配置参数通道列表：
            <span class="color-orange">{{showChannelList(scope.row.mchPayChanelInfo) || '--'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="260"
                       label="操作">

        <template slot-scope="scope">
          <!--//如果有方法，传入参数“scope.row”-->
          <!--//如果需要索引，传入参数“scope.$index”-->
          <!--//如果需要当前整页表格数据，传入参数“tableData”-->
          <el-button type="text"
                     @click="openConfigDialog(scope.row)">支付配置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--翻页-->
    <pagination :total-elements="totalElements"
                :change-callback="getMerchantList"
                ref="page"></pagination>
<!--服务商支付参数配置-->
    <el-dialog :title="`佣金提现参数配置`"
               :visible.sync="commissionDialog"
               :before-close="closeCommissionDialog"
               width="700px">
      <el-form :model="commissionParam"
               label-width="auto">
        <el-form-item label="是否开启提现" :disabled="payDisable">
        <el-switch v-model="commissionParam.isAllow"
                   :active-value="1"
                   :inactive-value="-1">
        </el-switch>
        </el-form-item>
        <el-form-item label="最小提现金额">
          <el-input-number :disabled="payDisable"
                           :precision="2"
                           :min="0"
                           :max="100"
                           :step="10"
                           v-model="commissionParam.minCashAmount">
          </el-input-number>
        </el-form-item>
        <el-form-item label="最大提现金额">
          <el-input-number :disabled="payDisable"
                           :precision="2"
                           :min="0"
                           :max="100"
                           :step="10"
                           v-model="commissionParam.maxCashAmount">
          </el-input-number>
        </el-form-item>
        <el-form-item label="佣金提现费率">
          <el-input-number :disabled="payDisable"
                           :precision="2"
                           :min="0"
                           :max="100"
                           :step="0.01"
                           v-model="commissionParam.rateCash">
          </el-input-number>
          %
        </el-form-item>
        <el-form-item label="佣金提现服务费">
          <el-input-number :disabled="payDisable"
                           :precision="2"
                           :min="0"
                           :max="100"
                           :step="0.01"
                           v-model="commissionParam.serviceFee">
          </el-input-number>
          元
        </el-form-item>

        <el-form-item label="提现方式">
          <el-radio-group :disabled="payDisable"
                          @change="radioChange"
                          v-model="commissionParam.cashOutWay"
                          class="radio-bottom-params">
            <el-radio label="1">手动</el-radio>
            <el-radio label="2">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="支持到账账号类型" prop="cashOutTypes">
          <el-checkbox-group :disabled="payDisable" v-model="commissionParam.cashOutTypes" @change="cashChange">
            <el-checkbox label="1" name="cashOutTypes">微信</el-checkbox>
            <el-checkbox label="2" name="cashOutTypes">支付宝</el-checkbox>
            <el-checkbox label="3" name="cashOutTypes">银行卡</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeCommissionDialog">取 消</el-button>
        <el-button type="warning"
                   @click="canConfig">配 置</el-button>
        <el-button type="primary"
                   @click="saveCommissionConfig"
                   v-loading="btnLoading"
                   :disabled="payDisable">提 交</el-button>
      </div>
    </el-dialog>
<!--服务商支付参数配置-->
    <el-dialog :title="`${levelAlias.oemName}支付参数配置`"
               :visible.sync="topPayDialog"
               :before-close="closeTopPayDialog"
               width="700px">
      <el-form :model="payParam"
               label-width="auto">
        <el-form-item label="支付方式">
          <el-radio-group v-model="payParam.payWay"
                          class="radio-bottom-params">
            <el-radio label="1"
                      v-if="payConfig.indexOf('官方') > -1">微信</el-radio>
            <el-radio label="2"
                      v-if="payConfig.indexOf('官方') > -1">支付宝</el-radio>
            <el-radio label="6"
                      v-if="payConfig.indexOf('富友') > -1">富友</el-radio>
            <el-radio label="7"
                      v-if="payConfig.indexOf('随行付') > -1">随行付</el-radio>
            <el-radio label="9"
                      v-if="payConfig.indexOf('威富通') > -1">威富通</el-radio>
            <el-radio label="10"
                      v-if="payConfig.indexOf('乐刷') > -1">乐刷</el-radio>
            <el-radio label="11"
                      v-if="payConfig.indexOf('传化') > -1">传化</el-radio>
            <el-radio label="12"
                      v-if="payConfig.indexOf('天阙随行付') > -1">天阙随行付</el-radio>
            <el-radio label="13"
                      v-if="payConfig.indexOf('易生') > -1">易生</el-radio>
            <el-radio label="14"
                      v-if="payConfig.indexOf('新大陆') > -1">新大陆</el-radio>

			     <!-- <el-radio label="15"
			          v-if="payConfig.indexOf('银联') > -1">中国银联</el-radio>-->
           <!-- <el-radio label="16"
                      v-if="payConfig.indexOf('拉卡拉') > -1">拉卡拉</el-radio>-->
            <el-radio label="17"
                      v-if="payConfig.indexOf('手机pos') > -1">手机pos</el-radio>
            <el-radio label="19"
                      v-if="payConfig.indexOf('开店宝') > -1">开店宝</el-radio>
            <el-radio label="20"
                      v-if="payConfig.indexOf('畅捷支付') > -1">畅捷</el-radio>

          </el-radio-group>
        </el-form-item>
        <div style="max-height: 50vh;overflow-y: auto;padding-right: 10px;">
          <!--微信配置-->
          <div v-show="payParam.payWay==1">
            <el-form-item label="appId">
              <el-input v-model.trim="topParam.wxAppId"
                        :disabled="payDisable"
                        placeholder="公众账号ID"></el-input>
            </el-form-item>
            <el-form-item label="mchId">
              <el-input v-model.trim="topParam.wxMchId"
                        :disabled="payDisable"
                        placeholder="服务商商户号"></el-input>
            </el-form-item>
            <el-form-item label="API密钥">
              <el-input v-model.trim="topParam.wxAppKey"
                        :disabled="payDisable"
                        placeholder="API密钥"></el-input>
            </el-form-item>
            <el-form-item label="appSecret">
              <el-input v-model.trim="topParam.wxAppSecret"
                        :disabled="payDisable"
                        placeholder="开发者密码"></el-input>
            </el-form-item>
            <el-form-item label="证书路径">
              <el-input v-model.trim="topParam.wxCertPath"
                        :disabled="payDisable"
                        placeholder="证书"></el-input>
            </el-form-item>
            <el-form-item label="apiV3密钥">
              <el-input v-model.trim="topParam.wxApiv3key"
                        :disabled="payDisable"
                        placeholder="请输入apiV3密钥"></el-input>
            </el-form-item>
            <el-form-item label="微信商户证书序列号">
              <el-input v-model.trim="topParam.certificateSerialNo"
                        :disabled="payDisable"
                        placeholder="请输入微信商户证书序列号"></el-input>
            </el-form-item>
            <el-form-item label="证书"
                          :disabled="payDisable">
              <el-upload :disabled="payDisable"
                         class="upload-demo"
                         :headers="headers"
                         :action="uploadUrl"
                         :data="fileData"
                         :on-success="handleSuccess"
                         :show-file-list="false">
                <el-button size="small"
                           type="primary"
                           :disabled="payDisable">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.wxRate">
              </el-input-number>
              %
            </el-form-item>
          </div>
          <!--支付宝配置-->
          <div v-show="payParam.payWay==2">
            <el-form-item label="appId">
              <el-input v-model.trim="topParam.aliAppId"
                        :disabled="payDisable"
                        placeholder="应用ID"></el-input>
            </el-form-item>
            <el-form-item label="privateKey">
              <el-input type="text"
                        v-model.trim="topParam.aliPrivateKey"
                        :disabled="payDisable"
                        placeholder="应用私钥"></el-input>
            </el-form-item>
            <el-form-item label="publicKey">
              <el-input type="text"
                        v-model.trim="topParam.aliPublicKey"
                        :disabled="payDisable"
                        placeholder="支付宝公钥"></el-input>
            </el-form-item>
            <el-form-item label="利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.zfbRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="小程序密钥">
              <el-input type="text"
                        v-model.trim="topParam.aliApplePrivateKey"
                        :disabled="payDisable"
                        placeholder="小程序密钥"></el-input>
            </el-form-item>
            <el-form-item label="小程序AppId">
              <el-input type="text"
                        v-model.trim="topParam.aliAppletAppId"
                        :disabled="payDisable"
                        placeholder="小程序AppId"></el-input>
            </el-form-item>
            <el-form-item label="支付宝pid">
              <el-input type="text"
                        v-model.trim="topParam.aliPartnerId"
                        :disabled="payDisable"
                        placeholder="支付宝pid"></el-input>
            </el-form-item>
            <!--支付宝生活号配置-->
            <!--
            <el-form-item label="生活号appId">
              <el-input type="text" v-model.trim="topParam.aliLifeServiceAppId" :disabled="payDisable"
                        placeholder="支付宝生活号appId"></el-input>
            </el-form-item>
            <el-form-item label="生活号私钥">
              <el-input type="text" v-model.trim="topParam.aliLifeServicePrivateKey" :disabled="payDisable"
                        placeholder="支付宝生活号私钥"></el-input>
            </el-form-item>
            <el-form-item label="生活号公钥">
              <el-input type="text" v-model.trim="topParam.aliLifeServicePublicKey" :disabled="payDisable"
                        placeholder="支付宝生活号公钥"></el-input>
            </el-form-item>
            -->
          </div>
          <!--富友-->
          <div v-show="payParam.payWay==6">
            <el-form-item label="微信利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.fyWxRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="支付宝利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.fyAliRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="富友私钥">
              <el-input v-model.trim="topParam.fyInsPrivateKey"
                        :disabled="payDisable"
                        placeholder="富友私钥"></el-input>
            </el-form-item>
            <el-form-item label="富友公钥">
              <el-input v-model.trim="topParam.fyPublicKey"
                        :disabled="payDisable"
                        placeholder="富友公钥"></el-input>
            </el-form-item>
            <el-form-item label="富友机构编码">
              <el-input type="text"
                        v-model.trim="topParam.fyInsCd"
                        :disabled="payDisable"
                        placeholder="富友机构编码"></el-input>
            </el-form-item>
            <el-form-item label="富友订单编码">
              <el-input type="text"
                        v-model.trim="topParam.fyPreOrder"
                        :disabled="payDisable"
                        placeholder="富友订单编码"></el-input>
            </el-form-item>
            <el-form-item label="富友进件验签私钥">
              <el-input type="text"
                        v-model.trim="topParam.fyFeedSignKey"
                        :disabled="payDisable"
                        placeholder="富友进件验签私钥"></el-input>
            </el-form-item>
            <el-form-item label="富友FTP图片上传帐户">
              <el-input type="text"
                        v-model.trim="topParam.fyFtpUsername"
                        :disabled="payDisable"
                        placeholder="富友FTP图片上传帐户"></el-input>
            </el-form-item>
            <el-form-item label="富友FTP图片上传帐户密码">
              <el-input type="password"
                        v-model.trim="topParam.fyFtpPassword"
                        :disabled="payDisable"
                        placeholder="富友FTP图片上传帐户密码"></el-input>
            </el-form-item>
          </div>
          <!--随行付-->
          <div v-show="payParam.payWay==7">
            <el-form-item label="微信利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.sxfWxRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="支付宝利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.sxfAliRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="随行付私钥">
              <el-input type="text"
                        v-model.trim="topParam.sxfPrivateKey"
                        :disabled="payDisable"
                        placeholder="随行付私钥"></el-input>
            </el-form-item>
            <el-form-item label="随行付机构编码">
              <el-input type="text"
                        v-model.trim="topParam.sxfOrgId"
                        :disabled="payDisable"
                        placeholder="随行付机构编码"></el-input>
            </el-form-item>
          </div>
          <!--=威富通-->
          <div v-show="payParam.payWay==9">
            <el-form-item label="微信利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.ysWxRate">
              </el-input-number>
              %
              <el-tooltip class="item"
                          effect="dark"
                          content="威富通微信通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                          placement="top-start">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="支付宝利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.ysAliRate">
              </el-input-number>
              %
              <el-tooltip class="item"
                          effect="dark"
                          content="威富通支付宝通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                          placement="top-start">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="商户编码">
              <el-input v-model.trim="topParam.ysAgentId"
                        :disabled="payDisable"
                        placeholder="商户编码"></el-input>
            </el-form-item>
            <el-form-item label="key密钥">
              <el-input v-model.trim="topParam.ysSecurityKey"
                        :disabled="payDisable"
                        placeholder="key密钥"></el-input>
            </el-form-item>
            <el-form-item label="威富通支付类型">
              <el-input v-model.trim="topParam.ysPayTypeId"
                        :disabled="payDisable"
                        placeholder="威富通支付类型,多个用;隔开"></el-input>
            </el-form-item>
          </div>
          <!--乐刷-->
          <div v-show="payParam.payWay==10">
            <el-form-item label="微信利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.lsWxRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="支付宝利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.lsAliRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="商户号">
              <el-input type="text"
                        v-model.trim="topParam.lsMerchantId"
                        :disabled="payDisable"
                        placeholder="乐刷服务商商户号"></el-input>
            </el-form-item>
            <el-form-item label="支付时使用的加密key">
              <el-input type="text"
                        v-model.trim="topParam.lsPayKey"
                        :disabled="payDisable"
                        placeholder="支付时使用的加密key"></el-input>
            </el-form-item>
            <el-form-item label="通知时使用的key">
              <el-input type="text"
                        v-model.trim="topParam.lsNoticeKey"
                        :disabled="payDisable"
                        placeholder="通知时使用的key"></el-input>
            </el-form-item>
          </div>
          <!--传化-->
          <div v-show="payParam.payWay==11">
            <el-form-item label="微信利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.chWxInterestRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="支付宝利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.chAliInterestRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label=" 渠道商户号">
              <el-input type="text"
                        v-model.trim="topParam.chMchId"
                        :disabled="payDisable"
                        placeholder="渠道商户号"></el-input>
            </el-form-item>
            <el-form-item label="RSA秘钥">
              <el-input type="text"
                        v-model.trim="topParam.chRSAKey"
                        :disabled="payDisable"
                        placeholder="RSA秘钥"></el-input>
            </el-form-item>
          </div>
          <!--天阙随行付-->
          <div v-show="payParam.payWay==12">
            <el-form-item label="微信利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.tqSxfWxRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="支付宝利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.tqSxfAliRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="天阙随行付私钥">
              <el-input type="text"
                        v-model.trim="topParam.tqSxfPrivateKey"
                        :disabled="payDisable"
                        placeholder="天阙随行付私钥"></el-input>
            </el-form-item>
            <el-form-item label="天阙随行付机构编码">
              <el-input type="text"
                        v-model.trim="topParam.tqSxfOrgId"
                        :disabled="payDisable"
                        placeholder="天阙随行付机构编码"></el-input>
            </el-form-item>
          </div>
          <!--易生-->
          <div v-show="payParam.payWay==13">
            <el-form-item label="微信利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.ysPayWxRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="支付宝利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.ysPayAliRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="商户进件D0费率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.ysPayServiceRate">
              </el-input-number>
              %
            </el-form-item>

            <el-form-item label="易生渠道号">
              <el-input type="text"
                        v-model.trim="topParam.ysPayChannelId"
                        :disabled="payDisable"
                        placeholder="易生渠道号"></el-input>
            </el-form-item>
            <el-form-item label="易生进件系统机构号">
              <el-input type="text"
                        v-model.trim="topParam.ysImportOrgId"
                        :disabled="payDisable"
                        placeholder="易生进件系统机构号"></el-input>
            </el-form-item>
            <el-form-item label="易生主密钥">
              <el-input type="text"
                        v-model.trim="topParam.ysMainKey"
                        :disabled="payDisable"
                        placeholder="易生主密钥"></el-input>
            </el-form-item>
            <el-form-item label="易生进件系统秘钥">
              <el-input type="text"
                        v-model.trim="topParam.ysImportKey"
                        :disabled="payDisable"
                        placeholder="易生进件系统秘钥"></el-input>
            </el-form-item>
            <el-form-item label="易生协议系统商户编号">
            <el-input type="text"
                      v-model.trim="topParam.ysAgreementMerId"
                      :disabled="payDisable"
                      placeholder="易生协议系统商户编号"></el-input>
          </el-form-item>
            <el-form-item label="易生协议系统终端编号">
            <el-input type="text"
                      v-model.trim="topParam.ysAgreementTermId"
                      :disabled="payDisable"
                      placeholder="易生协议系统终端编号"></el-input>
          </el-form-item>
            <el-form-item label="易生协议系统秘钥">
            <el-input type="text"
                      v-model.trim="topParam.ysAgreementKey"
                      :disabled="payDisable"
                      placeholder="易生协议系统秘钥"></el-input>
          </el-form-item>
            <el-form-item label="易生协议系统模板编号">
            <el-input type="text"
                      v-model.trim="topParam.ysAgreementTemplateId"
                      :disabled="payDisable"
                      placeholder="易生协议系统模板编号"></el-input>
          </el-form-item>
            <el-form-item label="易生签名私钥">
              <div style="display: flex;">
                <el-input type="text"
                          v-model.trim="topParam.ysPaySignKey"
                          :disabled="payDisable"
                          placeholder="易生签名私钥"></el-input>
                <el-button style="margin-left: 10px;"
                           type="primary"
                           @click="getYspayPrivateSignKey"
                           size="small"
                           v-loading="btnLoading"
                           :disabled="payDisable">获取签名密钥</el-button>
              </div>
            </el-form-item>
            <el-form-item label="易生协议系统签名秘钥">
              <div style="display: flex;">
                <el-input type="text"
                          v-model.trim="topParam.ysAgreementSignKey"
                          :disabled="payDisable"
                          placeholder="易生协议系统签名秘钥"></el-input>
                <el-button style="margin-left: 10px;"
                           type="primary"
                           @click="getYsAgreementPrivateSignKeyVal"
                           size="small"
                           v-loading="btnLoading"
                           :disabled="payDisable">获取签名密钥</el-button>
              </div>
            </el-form-item>
          </div>
          <!--新大陆-->
          <div v-show="payParam.payWay==14">
            <el-form-item label="微信利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.newLandWxRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="支付宝利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.newLandAliRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="新大陆渠道号">
              <el-input type="text"
                        v-model.trim="topParam.newLandChannelId"
                        :disabled="payDisable"
                        placeholder="新大陆渠道号"></el-input>
            </el-form-item>
          </div>
          <!--中国银联-->
          <!--<div v-show="payParam.payWay==15">
            <el-form-item label="微信利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.tqSxfWxRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="支付宝利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.tqSxfAliRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="中国银联私钥">
              <el-input type="text"
                        v-model.trim="topParam.tqSxfPrivateKey"
                        :disabled="payDisable"
                        placeholder="中国银联私钥"></el-input>
            </el-form-item>
            <el-form-item label="中国银联机构编码">
              <el-input type="text"
                        v-model.trim="topParam.tqSxfOrgId"
                        :disabled="payDisable"
                        placeholder="中国银联机构编码"></el-input>
            </el-form-item>
          </div>-->
          <!--拉卡拉-->
          <div v-show="payParam.payWay==16">
            <el-form-item label="微信利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.lakalaWxRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="支付宝利率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.lakalaAliRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="拉卡拉APPID">
              <el-input type="text"
                        v-model.trim="topParam.lklShopNo"
                        :disabled="payDisable"
                        placeholder="拉卡拉APPID"></el-input>
            </el-form-item>
            <el-form-item label="拉卡拉TOKEN">
              <el-input type="text"
                        v-model.trim="topParam.lklToken"
                        :disabled="payDisable"
                        placeholder="拉卡拉TOKEN"></el-input>
            </el-form-item>
            <el-form-item label="拉卡拉秘钥">
              <el-input type="text"
                        v-model.trim="topParam.lakalaRSAKey"
                        :disabled="payDisable"
                        placeholder="拉卡拉秘钥"></el-input>
            </el-form-item>
          </div>

          <!--手机pos-->
          <div v-show="payParam.payWay==17">
            <el-form-item label="手机pos机构号">
              <el-input type="text"
                        v-model.trim="topParam.posOrgId"
                        :disabled="payDisable"
                        placeholder="手机pos机构号"></el-input>
            </el-form-item>
            <el-form-item label="手机pos交易费率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.posTradeRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="手机pos提现费">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.5"
                               v-model="topParam.posDrawFee">
              </el-input-number>
              <!--<el-input type="text"
                        v-model.trim="topParam.posDrawFee"
                        :disabled="payDisable"
                        placeholder="手机pos提现费"></el-input>-->
            </el-form-item>
            <el-form-item label="网联交易费率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.quickTradeRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="网联提现费">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.5"
                               v-model="topParam.quickDrawFee">
              </el-input-number>
              <!--<el-input type="text"
                        v-model.trim="topParam.quickDrawFee"
                        :disabled="payDisable"
                        placeholder="网联提现费"></el-input>-->
            </el-form-item>
            <el-form-item label="手机posMd5Key">
              <el-input type="text"
                        v-model.trim="topParam.posMd5Key"
                        :disabled="payDisable"
                        placeholder="手机posMd5Key"></el-input>
            </el-form-item>
            <el-form-item label="手机posAesKey">
              <el-input type="text"
                        v-model.trim="topParam.posAesKey"
                        :disabled="payDisable"
                        placeholder="手机posAesKey"></el-input>
            </el-form-item>
          </div>

          <!--开店宝-->
          <div v-show="payParam.payWay==19">
            <el-form-item label="开店宝渠道号">
              <el-input type="text"
                        v-model.trim="topParam.kdbChannelCode"
                        :disabled="payDisable"
                        placeholder="开店宝渠道号"></el-input>
            </el-form-item>
            <el-form-item label="费率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.kdbWxTradeRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="商户进件D0费率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.kdbServiceRate">
              </el-input-number>
              %
            </el-form-item>
            <el-form-item label="appid">
              <el-input type="text"
                        v-model.trim="topParam.kdbAppId"
                        :disabled="payDisable"
                        placeholder="appid"></el-input>
            </el-form-item>
            <el-form-item label="商户私钥">
              <el-input type="text"
                        v-model.trim="topParam.kdbMercPrivateKey"
                        :disabled="payDisable"
                        placeholder="商户私钥"></el-input>
            </el-form-item>
            <el-form-item label="商户公钥">
              <el-input type="text"
                        v-model.trim="topParam.kdbMercPublicKey"
                        :disabled="payDisable"
                        placeholder="商户公钥"></el-input>
            </el-form-item>
            <el-form-item label="Md5Key">
              <el-input type="text"
                        v-model.trim="topParam.kdbAppsecret"
                        :disabled="payDisable"
                        placeholder="Md5Key"></el-input>
            </el-form-item>
          </div>

          <!--畅捷-->
          <div v-show="payParam.payWay==20">
            <el-form-item label="畅捷渠道号">
              <el-input type="text"
                        v-model.trim="topParam.acqSpId"
                        :disabled="payDisable"
                        placeholder="畅捷渠道号"></el-input>
            </el-form-item>
            <el-form-item label="费率">
              <el-input-number :disabled="payDisable"
                               :precision="2"
                               :min="0"
                               :max="100"
                               :step="0.01"
                               v-model="topParam.chanpayTradeRate">
              </el-input-number>
              %
            </el-form-item>

            <el-form-item label="服务商私钥">
              <el-input type="text"
                        v-model.trim="topParam.merchantPrivateKey"
                        :disabled="payDisable"
                        placeholder="服务商私钥"></el-input>
            </el-form-item>
            <el-form-item label="平台公钥">
              <el-input type="text"
                        v-model.trim="topParam.chanpayPublicKey"
                        :disabled="payDisable"
                        placeholder="平台公钥"></el-input>
            </el-form-item>
            <el-form-item label="算法类型">
              <el-input type="text"
                        v-model.trim="topParam.signType"
                        :disabled="payDisable"
                        placeholder="算法类型"></el-input>
            </el-form-item>
          </div>
        </div>


      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeTopPayDialog">取 消</el-button>
        <el-button type="warning"
                   @click="canConfig">配 置</el-button>
        <el-button type="primary"
                   @click="saveTopPayConfig"
                   v-loading="btnLoading"
                   :disabled="payDisable">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="商户支付参数配置"
               :visible.sync="payDialog"
               :before-close="closePayDialog"
               width="620px">
      <el-form :model="payParam"
               label-width="auto">
        <el-form-item label="支付方式">
          <el-radio-group v-model="payParam.payWay">
            <el-radio label="1"
                      class="mt10"
                      v-if="payConfig.indexOf('官方') > -1">微信</el-radio>
            <el-radio label="2"
                      class="mt10"
                      v-if="payConfig.indexOf('官方') > -1">支付宝</el-radio>
            <el-radio label="6"
                      class="mt10"
                      v-if="payConfig.indexOf('富友') > -1">富友</el-radio>
            <el-radio label="7"
                      class="mt10"
                      v-if="payConfig.indexOf('随行付') > -1">随行付</el-radio>
            <el-radio label="9"
                      class="mt10"
                      v-if="payConfig.indexOf('威富通') > -1">威富通</el-radio>
            <el-radio label="10"
                      class="mt10"
                      v-if="payConfig.indexOf('乐刷') > -1">乐刷</el-radio>
            <el-radio label="11"
                      class="mt10"
                      v-if="payConfig.indexOf('传化') > -1">传化</el-radio>
            <el-radio label="12"
                      class="mt10"
                      v-if="payConfig.indexOf('天阙随行付') > -1">天阙随行付</el-radio>
            <el-radio label="13"
                      class="mt10"
                      v-if="payConfig.indexOf('易生') > -1">易生</el-radio>
            <el-radio label="14"
                      class="mt10"
                      v-if="payConfig.indexOf('新大陆') > -1">新大陆</el-radio>
<!--            15银联   16拉卡拉-->
            <el-radio label="17"
                      class="mt10"
                      v-if="payConfig.indexOf('手机pos') > -1">手机pos</el-radio>
            <el-radio label="19"
                      class="mt10"
                      v-if="payConfig.indexOf('开店宝') > -1">开店宝</el-radio>
            <el-radio label="20"
                      class="mt10"
                      v-if="payConfig.indexOf('畅捷支付') > -1">畅捷</el-radio>


            <!--<el-radio label="15"
                  class="mt10"
                  v-if="payConfig.indexOf('银联') > -1">中国银联</el-radio>-->
           <!-- <el-radio label="16"
                      class="mt10"
                      v-if="payConfig.indexOf('拉卡拉') > -1">拉卡拉</el-radio>-->

            <!--
            <el-radio label="5">惠闪付</el-radio>
            <el-radio label="3">会员宝</el-radio>
            <el-radio label="4">易融码</el-radio>
            -->
          </el-radio-group>
        </el-form-item>
        <!--微信配置-->
        <div v-show="payParam.payWay==1">
          <el-form-item label="利率">
            <!-- <el-input type="number" v-model="payParam.wx.interestRate" :disabled="payDisable"
                      placeholder="例如：0.002"></el-input> -->
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.wx.interestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="微信签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <!-- subMchId -->
          <el-form-item label="子商户号">
            <el-input v-model.trim="payParam.wx.subMchId"
                      :disabled="payDisable"
                      placeholder="子商户号"></el-input>
          </el-form-item>
        </div>
        <!--支付宝配置-->
        <div v-show="payParam.payWay==2">
          <el-form-item label="利率">
            <!-- <el-input v-model="payParam.ali.interestRate" type="number" placeholder="例如：0.002"
                      :disabled="payDisable"></el-input> -->
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.ali.interestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="支付宝签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <!-- authToken -->
          <el-form-item label="授权token">
            <el-input v-model.trim="payParam.ali.appAuthToken"
                      :disabled="payDisable"
                      placeholder="商户授权令牌"></el-input>
          </el-form-item>
          <el-form-item label="pid">
            <el-input v-model.trim="payParam.ali.pid"
                      :disabled="payDisable"
                      placeholder="pid"></el-input>
          </el-form-item>
        </div>
        <!--=会员宝配置-->
        <div v-show="payParam.payWay==3">
          <el-form-item label="微信利率">
            <!-- <el-input v-model="payParam.hyb.wxInterestRate" type="number" placeholder="例如：0.002"
                      :disabled="payDisable"></el-input> -->
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.hyb.wxInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="会员宝微信通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="支付宝利率">
            <!-- <el-input v-model="payParam.hyb.aliInterestRate" type="number" placeholder="例如：0.002"
                      :disabled="payDisable"></el-input> -->
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.hyb.aliInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="会员宝支付宝通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="appId">
            <el-input v-model.trim="payParam.hyb.appId"
                      :disabled="payDisable"
                      placeholder="应用ID"></el-input>
          </el-form-item>
          <el-form-item label="appKey">
            <el-input v-model.trim="payParam.hyb.appKey"
                      :disabled="payDisable"
                      placeholder="密钥"></el-input>
          </el-form-item>
        </div>
        <!--=易融码配置-->
        <div v-show="payParam.payWay==4">
          <el-form-item label="微信利率">
            <!-- <el-input v-model="payParam.yrm.wxInterestRate" type="number" placeholder="例如：0.002"
                      :disabled="payDisable"></el-input> -->
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.yrm.wxInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="易融码微信通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="支付宝利率">
            <!-- <el-input v-model="payParam.yrm.aliInterestRate" type="number" placeholder="例如：0.002"
                      :disabled="payDisable"></el-input> -->
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.yrm.aliInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="易融码支付宝通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="mid">
            <el-input v-model.trim="payParam.yrm.mid"
                      :disabled="payDisable"
                      placeholder="商户号"></el-input>
          </el-form-item>
          <el-form-item label="key">
            <el-input v-model.trim="payParam.yrm.appKey"
                      :disabled="payDisable"
                      placeholder="密钥"></el-input>
          </el-form-item>
        </div>
        <!--=惠闪付配置-->
        <div v-show="payParam.payWay==5">
          <el-form-item label="微信利率">
            <!-- <el-input v-model="payParam.hsf.wxInterestRate" type="number" placeholder="例如：0.002" :disabled="payDisable"></el-input> -->
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.hsf.wxInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="惠闪付微信通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="支付宝利率">
            <!-- <el-input v-model="payParam.hsf.aliInterestRate" type="number" placeholder="例如：0.002" :disabled="payDisable"></el-input> -->
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.hsf.aliInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="惠闪付支付宝通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="shopId">
            <el-input v-model.trim="payParam.hsf.shopId"
                      placeholder="商户号"
                      :disabled="payDisable"></el-input>
          </el-form-item>
          <el-form-item label="appKey">
            <el-input v-model.trim="payParam.hsf.appKey"
                      placeholder="签名密钥"
                      :disabled="payDisable"></el-input>
          </el-form-item>
        </div>
        <!--=富友配置-->
        <div v-show="payParam.payWay==6">
          <el-form-item label="微信利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.fy.wxInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="富友微信通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="支付宝利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.fy.aliInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="富友支付宝通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="商户号">
            <el-input v-model.trim="payParam.fy.mchntCd"
                      :disabled="payDisable"
                      placeholder="商户号"></el-input>
          </el-form-item>
        </div>
        <!--=随行付配置-->
        <div v-show="payParam.payWay==7">
          <el-form-item label="微信利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.sxf.wxInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="随行付微信通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="支付宝利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.sxf.aliInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="随行付支付宝通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="商户编码">
            <el-input v-model.trim="payParam.sxf.mno"
                      :disabled="payDisable"
                      placeholder="商户编码"></el-input>
          </el-form-item>
          <el-form-item label="随行付子商户号">
            <el-input v-model.trim="payParam.sxf.subMchId"
                      :disabled="payDisable"
                      placeholder="随行付子商户号"></el-input>
          </el-form-item>
          <el-form-item label="随行付任务编码">
            <div style="display: flex;">
              <el-input v-model.trim="taskCode"
                        :disabled="payDisable"
                        placeholder="随行付任务编码"
                        clearable></el-input>
              <el-button style="margin-left: 10px;"
                         :disabled="payDisable"
                         type="primary"
                         @click="getSxfSubmchidByTaskCode">获取子商户号</el-button>
            </div>
            <div v-if="sxFrepoInfoArr.length > 1">
              <el-radio-group v-model="payParam.sxf.subMchId">
                <el-radio :key="item.childNo"
                          :label="item.childNo"
                          v-for="item in sxFrepoInfoArr">{{item.childNo}}</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </div>
        <!--=威富通-->
        <div v-show="payParam.payWay==9">
          <el-form-item label="微信利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.ys.wxInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="威富通微信通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="支付宝利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.ys.aliInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="威富通支付宝通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="商户编码">
            <el-input v-model.trim="payParam.ys.mchId"
                      :disabled="payDisable"
                      placeholder="商户编码"></el-input>
          </el-form-item>
          <el-form-item label="key密钥">
            <el-input v-model.trim="payParam.ys.privateKey"
                      :disabled="payDisable"
                      placeholder="key密钥"></el-input>
          </el-form-item>
          <el-form-item label="公钥">
            <el-input v-model.trim="payParam.ys.ysPayPublicKey"
                      :disabled="payDisable"
                      placeholder="公钥"></el-input>
          </el-form-item>
        </div>
        <!--=乐刷-->
        <div v-show="payParam.payWay==10">
          <el-form-item label="微信利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.ls.wxInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="乐刷微信通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="支付宝利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.ls.aliInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="乐刷支付宝通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="商户编码">
            <el-input v-model.trim="payParam.ls.mchId"
                      :disabled="payDisable"
                      placeholder="商户编码"></el-input>
          </el-form-item>
        </div>
        <!--=传化-->
        <div v-show="payParam.payWay==11">
          <el-form-item label="微信利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.ch.wxInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="传化微信通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="支付宝利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.ch.aliInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="传化支付宝通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="商户号">
            <el-input v-model.trim="payParam.ch.mchId"
                      :disabled="payDisable"
                      placeholder="商户号"></el-input>
          </el-form-item>
          <el-form-item label="商户绑定APPID">
            <el-button type="primary"
                       size="small"
                       :disabled="payDisable"
                       @click="bindChAppId(merchantId, 11)">绑定APPID</el-button>
          </el-form-item>
        </div>
        <!--=天阙随行付配置-->
        <div v-show="payParam.payWay==12">
          <el-form-item label="微信利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.tqsxf.wxInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="天阙随行付微信通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="支付宝利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.tqsxf.aliInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="天阙随行付支付宝通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="商户编码">
            <el-input v-model.trim="payParam.tqsxf.mno"
                      :disabled="payDisable"
                      placeholder="商户编码"></el-input>
          </el-form-item>
          <el-form-item label="天阙随行付子商户号">
            <div style="display: flex;">
              <!-- <el-input v-model.trim="taskCode"
                        :disabled="payDisable"
                        placeholder="随行付任务编码"
                        clearable></el-input> -->
              <el-input v-model.trim="payParam.tqsxf.subMchId"
                        :disabled="payDisable"
                        placeholder="天阙随行付子商户号"></el-input>
              <el-button style="margin-left: 10px;"
                         :disabled="payDisable"
                         type="primary"
                         @click="getTqSxfSubmchidByTaskCode">获取子商户号</el-button>
            </div>

          </el-form-item>
        </div>
        <!--=易生配置-->
        <div v-show="payParam.payWay==13">
          <el-form-item label="微信利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.yspay.wxInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="易生微信通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="支付宝利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.yspay.aliInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="易生支付宝通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="商户编码">
            <el-input v-model.trim="payParam.yspay.mchId"
                      :disabled="payDisable"
                      placeholder="商户编码"></el-input>
          </el-form-item>
          <el-form-item label="商户终端号">
            <el-input v-model.trim="payParam.yspay.termId"
                      :disabled="payDisable"
                      placeholder="商户终端号"></el-input>
          </el-form-item>
        </div>
        <!--=新大陆配置-->
        <div v-show="payParam.payWay==14">
          <el-form-item label="微信利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.newland.wxInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="新大陆微信通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="支付宝利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.newland.aliInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="新大陆支付宝通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="商户号">
            <el-input v-model.trim="payParam.newland.mercId"
                      :disabled="payDisable"
                      placeholder="商户号"></el-input>
          </el-form-item>
          <el-form-item label="设备号">
            <el-input v-model.trim="payParam.newland.trmNo"
                      :disabled="payDisable"
                      placeholder="设备号"></el-input>
          </el-form-item>
          <el-form-item label="交易密钥">
            <el-input v-model.trim="payParam.newland.tradeKey"
                      :disabled="payDisable"
                      placeholder="交易密钥"></el-input>
          </el-form-item>
        </div>
        <!--=中国银联配置-->
       <!-- <div v-show="payParam.payWay==15">
          <el-form-item label="微信利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.tqsxf.wxInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="天阙随行付微信通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="支付宝利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.tqsxf.aliInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="天阙随行付支付宝通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="商户编码">
            <el-input v-model.trim="payParam.tqsxf.mno"
                      :disabled="payDisable"
                      placeholder="商户编码"></el-input>
          </el-form-item>
          <el-form-item label="天阙随行付子商户号">
            <div style="display: flex;">
              &lt;!&ndash; <el-input v-model.trim="taskCode"
                        :disabled="payDisable"
                        placeholder="随行付任务编码"
                        clearable></el-input> &ndash;&gt;
              <el-input v-model.trim="payParam.tqsxf.subMchId"
                        :disabled="payDisable"
                        placeholder="天阙随行付子商户号"></el-input>
              <el-button style="margin-left: 10px;"
                         :disabled="payDisable"
                         type="primary"
                         @click="getTqSxfSubmchidByTaskCode">获取子商户号</el-button>
            </div>

          </el-form-item>
        </div>-->
        <!--=拉卡拉配置-->
        <!--<div v-show="payParam.payWay==16">
          <el-form-item label="微信利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.lakala.wxInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="天阙随行付微信通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="支付宝利率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.lakala.aliInterestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="拉卡拉支付宝通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="商户编码">
            <el-input v-model.trim="payParam.lakala.lklMercId"
                      :disabled="payDisable"
                      placeholder="商户编码"></el-input>
          </el-form-item>
          <el-form-item label="商户终端号">
            <div style="display: flex;">
              &lt;!&ndash; <el-input v-model.trim="taskCode"
                        :disabled="payDisable"
                        placeholder="随行付任务编码"
                        clearable></el-input> &ndash;&gt;
              <el-input v-model.trim="payParam.lakala.termId"
                        :disabled="payDisable"
                        placeholder="商户终端号"></el-input>
            </div>

          </el-form-item>
        </div>-->
        <!--=手机pos配置-->
        <div v-show="payParam.payWay==17">
          <el-form-item label="手机pos交易费率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.sjPos.posTradeRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="手机pos交易费率签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="手机pos提现费">
            <el-input v-model.trim="payParam.sjPos.posDrawFee"
                      :disabled="payDisable"
                      placeholder="手机pos提现费"></el-input>
          </el-form-item>
          <el-form-item label="网联交易费率">
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.sjPos.quickTradeRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="手机pos商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="网联提现费">
            <el-input v-model.trim="payParam.sjPos.quickDrawFee"
                      :disabled="payDisable"
                      placeholder="网联提现费"></el-input>
          </el-form-item>
          <el-form-item label="商户编号">
            <el-input v-model.trim="payParam.sjPos.merCode"
                      :disabled="payDisable"
                      placeholder="商户编号"></el-input>
          </el-form-item>
        </div>
        <!--开店宝配置-->
        <div v-show="payParam.payWay==19">
          <el-form-item label="利率">
            <!-- <el-input type="number" v-model="payParam.wx.interestRate" :disabled="payDisable"
                      placeholder="例如：0.002"></el-input> -->
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.kdb.kdbWxTradeRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="开店宝商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <!-- subMchId -->
          <el-form-item label="商户号">
            <el-input v-model.trim="payParam.kdb.merCode"
                      :disabled="payDisable"
                      placeholder="商户号"></el-input>
          </el-form-item>
        </div>

        <!--畅捷配置-->
        <div v-show="payParam.payWay==20">
          <el-form-item label="费率">
            <!-- <el-input type="number" v-model="payParam.wx.interestRate" :disabled="payDisable"
                      placeholder="例如：0.002"></el-input> -->
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.cj.chanpayWxTradeRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <!-- subMchId -->
          <el-form-item label="商户号">
            <el-input v-model.trim="payParam.cj.merCode"
                      :disabled="payDisable"
                      placeholder="商户号"></el-input>
          </el-form-item>
        </div>
        <!--=秒到配置-->
        <!-- <div v-show="payParam.payWay==4">
          <el-form-item label="微信利率">
            <el-input v-model="payParam.yrm.wxInterestRate" type="number" placeholder="例如：0.2"></el-input>
          </el-form-item>
          <el-form-item label="支付宝利率">
            <el-input v-model="payParam.yrm.aliInterestRate" type="number" placeholder="例如：0.2"></el-input>
          </el-form-item>
          <el-form-item label="mid">
            <el-input v-model="payParam.yrm.mid"></el-input>
          </el-form-item>
          <el-form-item label="key">
            <el-input v-model="payParam.yrm.appKey"></el-input>
          </el-form-item>
        </div> -->


		<!-- 中国银联 配置-->
	<!--	<div v-show="payParam.payWay==15">
		  <el-form-item label="微信利率">
		    <el-input-number :disabled="payDisable"
		                     :precision="2"
		                     :min="0"
		                     :max="100"
		                     :step="0.01"
		                     v-model="payParam.tqsxf.wxInterestRate">
		    </el-input-number>
		    %
		    <el-tooltip class="item"
		                effect="dark"
		                content="微信通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
		                placement="top-start">
		      <i class="el-icon-question"></i>
		    </el-tooltip>
		  </el-form-item>
		  <el-form-item label="支付宝利率">
		    <el-input-number :disabled="payDisable"
		                     :precision="2"
		                     :min="0"
		                     :max="100"
		                     :step="0.01"
		                     v-model="payParam.tqsxf.aliInterestRate">
		    </el-input-number>
		    %
		    <el-tooltip class="item"
		                effect="dark"
		                content="支付宝通道签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
		                placement="top-start">
		      <i class="el-icon-question"></i>
		    </el-tooltip>
		  </el-form-item>
		  <el-form-item label="商户编码">
		    <el-input v-model.trim="payParam.tqsxf.mno"
		              :disabled="payDisable"
		              placeholder="商户编码"></el-input>
		  </el-form-item>
		  <el-form-item label="中国银联子商户号">
		    <div style="display: flex;">
		      &lt;!&ndash; <el-input v-model.trim="taskCode"
		                :disabled="payDisable"
		                placeholder="随行付任务编码"
		                clearable></el-input> &ndash;&gt;
		      <el-input v-model.trim="payParam.tqsxf.subMchId"
		                :disabled="payDisable"
		                placeholder="中国银联子商户号"></el-input>
		      <el-button style="margin-left: 10px;"
		                 :disabled="payDisable"
		                 type="primary"
		                 @click="getTqSxfSubmchidByTaskCode">获取子商户号</el-button>
		    </div>

		  </el-form-item>
		</div>-->
        <!--拉卡拉配置-->
        <!--<div v-show="payParam.payWay==16">
          <el-form-item label="利率">
            &lt;!&ndash; <el-input type="number" v-model="payParam.wx.interestRate" :disabled="payDisable"
                      placeholder="例如：0.002"></el-input> &ndash;&gt;
            <el-input-number :disabled="payDisable"
                             :precision="2"
                             :min="0"
                             :max="100"
                             :step="0.01"
                             v-model="payParam.wx.interestRate">
            </el-input-number>
            %
            <el-tooltip class="item"
                        effect="dark"
                        content="拉卡拉签约商户的费率，比如填写0.38%，则每笔交易收取商户0.38%手续费"
                        placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          &lt;!&ndash; subMchId &ndash;&gt;
          <el-form-item label="商户号">
            <el-input v-model.trim="payParam.wx.subMchId"
                      :disabled="payDisable"
                      placeholder="商户号"></el-input>
          </el-form-item>
        </div>-->

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closePayDialog">取 消</el-button>
        <el-button type="warning"
                   @click="canConfig">配 置</el-button>
        <el-button type="primary"
                   @click="savePayConfig"
                   v-loading="btnLoading"
                   :disabled="payDisable">提 交</el-button>
      </div>
    </el-dialog>
    <!--域名校验-->
    <el-dialog class="vm-dialog"
               title="佣金生成"
               width="560px"
               v-if="dialogCommisssion.show"
               :visible.sync="dialogCommisssion.show">
      <CreateCommission :propsInfo="dialogCommisssion"></CreateCommission>
    </el-dialog>
  </div>
</template>

<script>
import { getMerchantList } from '@/modules/merchant/top/api/merchant'
import { findCommissionCurrentMonth } from '@/modules/index/api'
import pagination from '@/components/pagination/index'
import { url } from '@/utils/request'
import { findTopPayConfig, saveTopPayConfig, findPayConfig, savePayConfig, updateAppid, getSystemCOnfig, getYspayPrivateSignKeyVal, getYsAgreementPrivateSignKeyVal,getSxfMerchantQuery, saveCommissionConfig, getCommissionConfig} from '@/modules/pay/api/pay_config'
// import {fileUpload} from '@/modules/file/api/upload'
import { levelAliasMixin } from '@/mixins'
import CreateCommission from './components/createCommission.vue'
export default {
  name: 'merchant',
  components: { pagination, CreateCommission },
  mixins: [levelAliasMixin],
  data() {
    return {
      taskCode: '', // 随行付任务编码
      sxFrepoInfoArr: [],
      tqsxFrepoInfoArr: [],
      formLabelWidth: '130px',
      btnLoading: false,
      loading: true,
      tableData: [], // 表格数据
      totalElements: 0,
      searchForm: {
        isFindPayChanel: null, // 配置支付通道
        isFindPayConfig: '', // 配置支付参数
        companyName: '', // 代理名称
        name: '', // 公司名
        contact: '' // 联系人，
      },
      // 服务商支付参数
      topPayDialog: false,
      topParam: {
        id: '',
        // 微信服务商参数
        wxAppId: '', // 公众号
        wxAppKey: '', // API密钥
        wxAppSecret: '', // 支付密钥
        wxMchId: '', // 商户id
        wxCertPath: '', // 证书路径
        wxApiv3key: '', // apiV3密钥
        certificateSerialNo: '', // 微信商户证书序列号
        wxRate: '', // 微信利率
        // 支付宝服务商支付参数
        aliAppId: '', // 第三方应用ID
        aliPrivateKey: '', // 应用私钥
        aliPublicKey: '', // 支付宝平台公钥
        aliApplePrivateKey: '', // 支付宝秘钥
        aliAppletAppId: '', // 支付宝appid
        aliPartnerId: '', // 支付宝aliPartnerId
        zfbRate: '', // 微信利率
        aliLifeServiceAppId: '', // 支付宝生活号appId
        aliLifeServicePrivateKey: '', // 支付宝生活号私钥
        aliLifeServicePublicKey: '', // 支付宝生活号公钥
        // 随行付
        sxfPrivateKey: '', // 随行付私钥
        sxfOrgId: '', // 随行付机构编码
        sxfWxRate: '', // 随行付微信利率
        sxfAliRate: '', // 随行付支付宝利率
        // 富友
        fyInsPrivateKey: '', // 富友私钥
        fyPublicKey: '', // 富友公钥
        fyInsCd: '', // 富友机构编码
        fyPreOrder: '', // 富友订单编码
        fyFeedSignKey: '', // 富友进件验签私钥
        fyFtpUsername: '', // 富友指定服务商FTP图片上传帐户
        fyFtpPassword: '', // 富友指定服务商FTP图片上传帐户密码
        fyWxRate: '', // 富友微信利率
        fyAliRate: '', // 富友支付宝利率
        // 乐刷
        lsMerchantId: '', // 乐刷服务商商户号
        lsPayKey: '', // 乐刷支付时使用的加密key
        lsNoticeKey: '', // 乐刷通知时使用的key
        lsWxRate: '', // 乐刷微信利率
        lsAliRate: '', // 乐刷支付宝利率
        // 威富通
        ysSecurityKey: '', // 威富通key密钥
        ysAgentId: '', // 威富通商户编码
        ysPayTypeId: '', // 威富通支付类型
        ysWxRate: '', // 威富通微信利率
        ysAliRate: '', // 威富通支付宝利率
        // 传化
        chAliInterestRate: '', // 传化支付宝利率
        chWxInterestRate: '', // 传化微信利率
        chMchId: '', // 渠道商户号
        chRSAKey: '', // RSA秘钥
        // 天阙随行付
        tqSxfPrivateKey: '', // 随行付私钥
        tqSxfOrgId: '', // 随行付机构编码
        tqSxfWxRate: '', // 随行付微信利率
        tqSxfAliRate: '', // 随行付支付宝利率
        // 易生
        ysPayChannelId: '', // 易生渠道号
        ysPayWxRate: '', // 易生微信利率
        ysPayAliRate: '', // 易生支付宝利率
        ysMainKey: '', // 易生主密钥
        ysPaySignKey: '', // 易生签名私钥
        //新增
        ysPayServiceRate:  '',  //易生D0服务费率
        ysImportOrgId:  '',  //易生进件系统机构号
        ysImportKey :  '',  //易生进件系统秘钥
        ysAgreementMerId:  '',  //易生协议系统商户编号
        ysAgreementTermId:  '',  //易生协议系统终端编号
        ysAgreementKey :  '',  //易生协议系统秘钥
        ysAgreementTemplateId:  '',  //易生协议系统模板编号
        ysAgreementSignKey :  '',  //易生协议系统签名秘钥
        // 新大陆
        newLandWxRate: '', // 新大陆微信利率
        newLandAliRate: '', // 新大陆支付宝利率
        newLandChannelId: '', // 新大陆渠道号
        // 银联 暂时没有
      //  拉卡拉
        lakalaWxRate: '', // 拉卡拉微信利率
        lakalaAliRate: '', // 拉卡拉支付宝利率
        lakalaChannelId: '', // 拉卡拉渠道号
        lklShopNo: '',           //拉卡拉appid
        lklToken: '',        //拉卡拉token
        lakalaRSAKey:'',  //拉卡拉秘钥
        //  手机pos
        posDrawFee: '', // 手机pos提现费
        posTradeRate: '', // 手机pos交易费率
        quickDrawFee: '', // 网联提现费
        quickTradeRate: '', // 网联交易费率
        posOrgId: '', // 手机pos机构号
        posMd5Key: '',           //手机posMd5Key
        posAesKey: '',        //手机posAesKey
      //  开店宝
        kdbAppId:'',
        kdbAppsecret:'', //md5key
        kdbChannelCode:'', //渠道编号
        kdbMercPrivateKey:'', //私钥
        kdbMercPublicKey:'', //公钥
        kdbWxTradeRate:'', //费率
        kdbServiceRate: '', // D0费率

        //  畅捷
        signType:'', //畅捷支付算法类型
        acqSpId:'', //渠道编号
        merchantPrivateKey:'', //私钥
        chanpayPublicKey:'', //公钥
        chanpayTradeRate:'' //费率
      },
      // 商户支付参数
      payDialog: false,
      payDisable: true,
      payParam: {
        payWay: '1',
        ali: {
          interestRate: '',
          id: '',
          appAuthToken: '',
          pid: ''
        },
        wx: {
          interestRate: '',
          id: '',
          subMchId: ''
        },
        hyb: {
          wxInterestRate: '',
          aliInterestRate: '',
          id: '',
          appId: '',
          appKey: ''
        },
        yrm: {
          wxInterestRate: '',
          aliInterestRate: '',
          id: '',
          mid: '',
          appKey: ''
        },
        hsf: {
          wxInterestRate: '',
          aliInterestRate: '',
          id: '',
          shopId: '',
          appKey: ''
        },
        fy: {
          aliInterestRate: '',
          wxInterestRate: '',
          id: '',
          mchntCd: ''
        },
        sxf: {
          aliInterestRate: '',
          wxInterestRate: '',
          id: '',
          mno: '',
          subMchId: ''
        },
        ys: {
          aliInterestRate: '',
          wxInterestRate: '',
          id: '',
          mchId: '',
          privateKey: '',
          ysPayPublicKey: ''
          // ysPayTypeId: ''
        },
        ls: {
          aliInterestRate: '',
          wxInterestRate: '',
          id: '',
          mchId: ''
        },
        ch: {
          aliInterestRate: '', // 支付宝利率
          wxInterestRate: '', // 微信利率
          id: '',
          mchId: '' // 商户编码
        },
        // 天阙随行付
        tqsxf: {
          aliInterestRate: '',
          wxInterestRate: '',
          subMchId: '',
          id: '',
          mno: ''
        },
        // 易生
        yspay: {
          aliInterestRate: '',
          wxInterestRate: '',
          id: '',
          mchId: '',
          termId: ''
        },
        newland: {
          wxInterestRate: '',
          aliInterestRate: '',
          mercId: '',
          trmNo: '',
          tradeKey: '',
          id: ''
        },
        lakala: {
          wxInterestRate: '',
          aliInterestRate: '',
          lklMercId: '',  //拉卡拉 商户编码
          termId: ''  //拉卡拉终端号
        },
        sjPos: {
          posTradeRate: '', //手机pos交易费率
          posDrawFee: '', //手机pos提现费
          quickTradeRate: '',  //网联交易费率
          quickDrawFee: '',  //网联提现费
          merCode: '' //
        },
        //  开店宝
        kdb: {
          merCode:'', //通道商户编号
          kdbWxTradeRate:'' //费率
        },
        //  畅捷
        cj: {
          merCode:'', //通道商户编号
          chanpayWxTradeRate:'' //费率
        }


      },
      //佣金提现参数
      commissionDialog: false,
      commissionDisable: true,
      commissionParam:{
        minCashAmount: 0, // 最小提现金额
        maxCashAmount: 0, // 最大提现金额
        rateCash: 0,  // 佣金提现费率
        cashOutWay: '', // 提现方式:1手动2自动
        cashOutTypes: [], // 支持账号类型:1微信2支付宝3银行卡
        isAllow:'-1' //是否开启提现
      },
      headers: {
        authorized: sessionStorage.token
      },
      uploadUrl: url + '/fms/upload/file_upload', // 上传接口
      fileData: {
        module: 'cert'
      },
      fileList: [],
      dialogCommisssion: {
        show: false
      },
      payConfig: []
    }
  },
  mounted() {
    this.getMerchantList()
    this.getSystemCOnfigInfo()
  },
  computed: {
    showChannelList() {
      return function (mchPayChanelInfo) {
        mchPayChanelInfo = mchPayChanelInfo || {}
        let arr = mchPayChanelInfo.payChanel || []
        return arr.join(',')
      }
    }
  },
  watch: {
    'sxFrepoInfoArr'(val, oldVal) {
      if (val && val.length === 1) {
        this.payParam.sxf.subMchId = this.sxFrepoInfoArr[0].childNo
      }
    },
    tqsxFrepoInfoArr(val, oldVal) {
      if (val && val.length === 1) {
        this.payParam.tqsxf.subMchId = val[0].childNo
      }
    }
  },
  methods: {
    getSystemCOnfigInfo() {
      getSystemCOnfig().then(res => {
        this.payConfig = [...res.obj]
        console.log('66666666666666666666666666',this.payConfig)
      })
    },
    /**
       * 获取商户列表
       * @param number
       * @param pageSize
       */
    getMerchantList: function (number, pageSize) {
      this.loading = true
      let companyId = sessionStorage.getItem('companyId')
      getMerchantList(number, pageSize, this.searchForm, companyId).then(res => {
        this.tableData = []
        this.totalElements = 0
        let data = res.obj
        this.tableData = data.content
        this.totalElements = data.totalElements
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(e => {
        this.loading = false
      })
    },

    /**
       * 搜索与重置
       */
    search() {
      this.$refs.page.search()
    },
    reset() {
      // channel 设置为“本商户”
      this.searchForm = {
        name: '', // 公司名
        contact: '' // 联系人，
      }// 搜索用的表单
      this.$refs.page.search()
    },
    // =====================服务商支付参数配置=====================
    openTopConfigDialog() {
      this.topPayDialog = true
      this.findTopPayConfig()
    },
    closeTopPayDialog() {
      this.topPayDialog = false
      this.payDisable = true
      let clear = this
      setTimeout(function () {
        clear.clearTopPayParam()
      }, 100)
    },
    clearTopPayParam() {
      this.topParam.wxAppId = ''
      this.topParam.wxMchId = ''
      this.topParam.wxAppKey = ''
      this.topParam.wxAppSecret = ''
      this.topParam.wxCertPath = ''
      this.topParam.wxApiv3key = ''
      this.topParam.certificateSerialNo = ''
      this.topParam.wxRate = ''
      // 支付宝
      this.topParam.aliAppId = ''
      this.topParam.aliPrivateKey = ''
      this.topParam.aliPublicKey = ''
      this.topParam.aliApplePrivateKey = ''
      this.topParam.aliAppletAppId = ''
      this.topParam.aliPartnerId = ''
      this.topParam.zfbRate = ''
      this.topParam.aliLifeServiceAppId = ''
      this.topParam.aliLifeServicePrivateKey = ''
      this.topParam.aliLifeServicePublicKey = ''
      // 随行付
      this.topParam.sxfPrivateKey = ''
      this.topParam.sxfOrgId = ''
      this.topParam.sxfWxRate = ''
      this.topParam.sxfAliRate = ''
      // 富友
      this.topParam.fyInsPrivateKey = ''
      this.topParam.fyPublicKey = ''
      this.topParam.fyInsCd = ''
      this.topParam.fyPreOrder = ''
      this.topParam.fyFeedSignKey = ''
      this.topParam.fyFtpUsername = ''
      this.topParam.fyFtpPassword = ''
      this.topParam.fyWxRate = ''
      this.topParam.fyAliRate = ''
      // 乐刷
      this.topParam.lsWxRate = ''
      this.topParam.lsAliRate = ''
      this.topParam.lsMerchantId = ''
      this.topParam.lsPayKey = ''
      this.topParam.lsNoticeKey = ''
      // 传化
      this.topParam.chAliInterestRate = ''
      this.topParam.chWxInterestRate = ''
      this.topParam.chMchId = ''
      this.topParam.chRSAKey = ''
      // 天阙随行付
      this.topParam.tqSxfPrivateKey = ''
      this.topParam.tqSxfOrgId = ''
      this.topParam.tqSxfWxRate = ''
      this.topParam.tqSxfAliRate = ''
      // 易生
      this.topParam.ysPayChannelId = ''
      this.topParam.ysPayWxRate = ''
      this.topParam.ysPayAliRate = ''
      this.topParam.ysMainKey = ''
      this.topParam.ysPaySignKey = ''
      this.topParam.ysPayServiceRate = ''  //易生D0服务费率
      this.topParam.ysImportOrgId = ''  //易生进件系统机构号
      this.topParam.ysImportKey  = ''  //易生进件系统秘钥
      this.topParam.ysAgreementMerId = ''  //易生协议系统商户编号
      this.topParam.ysAgreementTermId = ''  //易生协议系统终端编号
      this.topParam.ysAgreementKey  = ''  //易生协议系统秘钥
      this.topParam.ysAgreementTemplateId = ''  //易生协议系统模板编号
      this.topParam.ysAgreementSignKey  = ''  //易生协议系统签名秘钥
      // 新大陆
      this.topParam.newLandWxRate = ''
      this.topParam.newLandAliRate = ''
      this.topParam.newLandChannelId = ''
      // 银联 暂时没有
      //  拉卡拉
      this.topParam.lakalaWxRate = '' // 拉卡拉微信利率
      this.topParam.lakalaAliRate = '' // 拉卡拉支付宝利率
      this.topParam.lakalaChannelId = '' // 拉卡拉渠道号
      this.topParam.lklShopNo = ''          //拉卡拉appid
      this.topParam.lklToken = ''        //拉卡拉token
      this.topParam.lakalaRSAKey =''  //拉卡拉秘钥
      //  手机pos
      this.topParam.posDrawFee = '' // 手机pos提现费
      this.topParam.posTradeRate = '' // 手机pos交易费率
      this.topParam.quickDrawFee = '' // 网联提现费
      this.topParam.quickTradeRate = '' // 网联交易费率
      this.topParam.posOrgId = '' // 手机pos机构号
      this.topParam.posMd5Key = ''           //手机posMd5Key
      this.topParam.posAesKey = ''        //手机posAesKey

      //  开店宝
      this.topParam.kdbAppId = '' //
      this.topParam.kdbAppsecret = '' // md5key
      this.topParam.kdbChannelCode = '' // 渠道编号
      this.topParam.kdbMercPrivateKey = '' // 私钥
      this.topParam.kdbMercPublicKey = '' // 公钥
      this.topParam.kdbWxTradeRate = ''   //费率
      this.topParam.kdbServiceRate = ''   //D0费率

      //  畅捷
      this.topParam.signType = '' // 算法类型
      this.topParam.acqSpId = '' // 渠道编号
      this.topParam.merchantPrivateKey = '' // 私钥
      this.topParam.chanpayPublicKey = '' // 公钥
      this.topParam.chanpayTradeRate = ''   //费率





    },
    // 获取服务商支付参数
    findTopPayConfig() {
      findTopPayConfig().then(response => {
        let data = response.obj
        this.topParam.serviceProviderId = data.serviceProviderId
        this.topParam.id = data.id
        this.topParam.wxAppId = data.wxAppId
        this.topParam.wxMchId = data.wxMchId
        this.topParam.wxAppKey = data.wxAppKey
        this.topParam.wxAppSecret = data.wxAppSecret
        this.topParam.wxCertPath = data.wxCertPath
        this.topParam.wxApiv3key = data.wxApiv3key
        this.topParam.certificateSerialNo = data.certificateSerialNo
        this.topParam.wxRate = Number(data.wxRate) ? Number(data.wxRate) * 100 : 0
        // 支付宝
        this.topParam.aliAppId = data.aliAppId
        this.topParam.aliPrivateKey = data.aliPrivateKey
        this.topParam.aliPublicKey = data.aliPublicKey
        this.topParam.aliApplePrivateKey = data.aliApplePrivateKey
        this.topParam.aliAppletAppId = data.aliAppletAppId
        this.topParam.aliPartnerId = data.aliPartnerId
        this.topParam.aliLifeServiceAppId = data.aliLifeServiceAppId
        this.topParam.aliLifeServicePrivateKey = data.aliLifeServicePrivateKey
        this.topParam.aliLifeServicePublicKey = data.aliLifeServicePublicKey
        this.topParam.zfbRate = Number(data.zfbRate) ? Number(data.zfbRate) * 100 : 0
        // 随行付
        this.topParam.sxfPrivateKey = data.sxfPrivateKey
        this.topParam.sxfOrgId = data.sxfOrgId
        this.topParam.sxfWxRate = Number(data.sxfWxRate) ? Number(data.sxfWxRate) * 100 : 0
        this.topParam.sxfAliRate = Number(data.sxfAliRate) ? Number(data.sxfAliRate) * 100 : 0
        // 富友
        this.topParam.fyInsPrivateKey = data.fyInsPrivateKey
        this.topParam.fyPublicKey = data.fyPublicKey
        this.topParam.fyInsCd = data.fyInsCd
        this.topParam.fyPreOrder = data.fyPreOrder
        this.topParam.fyFeedSignKey = data.fyFeedSignKey
        this.topParam.fyFtpUsername = data.fyFtpUsername
        this.topParam.fyFtpPassword = data.fyFtpPassword
        this.topParam.fyWxRate = Number(data.fyWxRate) ? Number(data.fyWxRate) * 100 : 0
        this.topParam.fyAliRate = Number(data.fyAliRate) ? Number(data.fyAliRate) * 100 : 0
        console.log(response)
        // 威富通
        this.topParam.ysAgentId = data.ysAgentId
        this.topParam.ysPayTypeId = data.ysPayTypeId
        this.topParam.ysSecurityKey = data.ysSecurityKey
        this.topParam.ysAliRate = Number(data.ysAliRate) ? Number(data.ysAliRate) * 100 : 0
        this.topParam.ysWxRate = Number(data.ysWxRate) ? Number(data.ysWxRate) * 100 : 0
        console.log(response)
        // 乐刷
        this.topParam.lsNoticeKey = data.lsNoticeKey
        this.topParam.lsPayKey = data.lsPayKey
        this.topParam.lsMerchantId = data.lsMerchantId
        this.topParam.lsWxRate = Number(data.lsWxRate) ? Number(data.lsWxRate) * 100 : 0
        this.topParam.lsAliRate = Number(data.lsAliRate) ? Number(data.lsAliRate) * 100 : 0
        // 传化
        this.topParam.chRSAKey = data.chRSAKey
        this.topParam.chMchId = data.chMchId
        this.topParam.chWxInterestRate = Number(data.chWxInterestRate) ? Number(data.chWxInterestRate) * 100 : 0
        this.topParam.chAliInterestRate = Number(data.chAliInterestRate) ? Number(data.chAliInterestRate) * 100 : 0
        // 天阙随行付
        this.topParam.tqSxfPrivateKey = data.tqSxfPrivateKey
        this.topParam.tqSxfOrgId = data.tqSxfOrgId
        this.topParam.tqSxfWxRate = Number(data.tqSxfWxRate) ? Number(data.tqSxfWxRate) * 100 : 0
        this.topParam.tqSxfAliRate = Number(data.tqSxfAliRate) ? Number(data.tqSxfAliRate) * 100 : 0
        // 易生
        this.topParam.ysPayChannelId = data.ysPayChannelId
        this.topParam.ysMainKey = data.ysMainKey
        this.topParam.ysPaySignKey = data.ysPaySignKey
        this.topParam.ysPayWxRate = Number(data.ysPayWxRate) ? Number(data.ysPayWxRate) * 100 : 0
        this.topParam.ysPayAliRate = Number(data.ysPayAliRate) ? Number(data.ysPayAliRate) * 100 : 0
        this.topParam.ysPayServiceRate = Number(data.ysPayServiceRate) ? Number(data.ysPayServiceRate) : 0//易生D0服务费率
        this.topParam.ysImportOrgId = data.ysImportOrgId //易生进件系统机构号
        this.topParam.ysImportKey = data.ysImportKey //易生进件系统秘钥
        this.topParam.ysAgreementMerId = data.ysAgreementMerId //易生协议系统商户编号
        this.topParam.ysAgreementTermId = data.ysAgreementTermId //易生协议系统终端编号
        this.topParam.ysAgreementKey = data.ysAgreementKey //易生协议系统秘钥
        this.topParam.ysAgreementTemplateId = data.ysAgreementTemplateId //易生协议系统模板编号
        this.topParam.ysAgreementSignKey = data.ysAgreementSignKey //易生协议系统签名秘钥


        // 新大陆
        this.topParam.newLandChannelId = data.newLandChannelId
        this.topParam.newLandWxRate = Number(data.newLandWxRate) ? Number(data.newLandWxRate) * 100 : 0
        this.topParam.newLandAliRate = Number(data.newLandAliRate) ? Number(data.newLandAliRate) * 100 : 0
        // 银联 暂时没有
        //  拉卡拉
        this.topParam.lakalaWxRate = Number(data.lakalaWxRate) ? Number(data.lakalaWxRate) * 100 : 0 // 拉卡拉微信利率
        this.topParam.lakalaAliRate = Number(data.lakalaAliRate) ? Number(data.lakalaAliRate) * 100 : 0 // 拉卡拉支付宝利率
        this.topParam.lakalaChannelId = data.lakalaChannelId // 拉卡拉渠道号
        this.topParam.lklShopNo = data.lklShopNo          //拉卡拉appid
        this.topParam.lklToken = data.lklToken        //拉卡拉token
        this.topParam.lakalaRSAKey =data.lakalaRSAKey  //拉卡拉秘钥
        //  手机pos
        this.topParam.posDrawFee = data.posDrawFee // 手机pos提现费
        this.topParam.posTradeRate = Number(data.posTradeRate) ? Number(data.posTradeRate) * 100 : 0 // 手机pos交易费率
        this.topParam.quickDrawFee = data.quickDrawFee // 网联提现费
        this.topParam.quickTradeRate = Number(data.quickTradeRate) ? Number(data.quickTradeRate) * 100 : 0 // 网联交易费率
        this.topParam.posOrgId = data.posOrgId // 手机pos机构号
        this.topParam.posMd5Key = data.posMd5Key           //手机posMd5Key
        this.topParam.posAesKey = data.posAesKey        //手机posAesKey

        //  开店宝
        this.topParam.kdbAppId = data.kdbAppId //
        this.topParam.kdbAppsecret = data.kdbAppsecret // md5key
        this.topParam.kdbChannelCode = data.kdbChannelCode // 渠道编号
        this.topParam.kdbMercPrivateKey = data.kdbMercPrivateKey // 私钥
        this.topParam.kdbMercPublicKey = data.kdbMercPublicKey // 公钥
        this.topParam.kdbWxTradeRate = Number(data.kdbWxTradeRate) ? Number(data.kdbWxTradeRate) * 100 : 0   //费率
        this.topParam.kdbServiceRate = Number(data.kdbServiceRate) ? Number(data.kdbServiceRate)  : 0   //D0费率

        //  畅捷
        this.topParam.signType = data.signType // 算法类型
        this.topParam.acqSpId = data.acqSpId // 渠道编号
        this.topParam.merchantPrivateKey = data.merchantPrivateKey // 私钥
        this.topParam.chanpayPublicKey = data.chanpayPublicKey // 公钥
        this.topParam.chanpayTradeRate = Number(data.chanpayTradeRate) ? Number(data.chanpayTradeRate) * 100 : 0    //费率

        // console.log(response)
      }).catch(() => {
        this.loading = false
      })
    },
    // 保存服务商支付参数
    saveTopPayConfig() {
      this.btnLoading = true // 锁定按钮
      this.payDisable = true
      let params = Object.assign(this.topParam)
      params.wxRate = (Number(params.wxRate) / 100).toFixed(4)
      params.zfbRate = (Number(params.zfbRate) / 100).toFixed(4)
      // 随行付
      params.sxfWxRate = (Number(params.sxfWxRate) / 100).toFixed(4)
      params.sxfAliRate = (Number(params.sxfAliRate) / 100).toFixed(4)
      // 富友
      params.fyWxRate = (Number(params.fyWxRate) / 100).toFixed(4)
      params.fyAliRate = (Number(params.fyAliRate) / 100).toFixed(4)
      // 威富通
      params.ysWxRate = (Number(params.ysWxRate) / 100).toFixed(4)
      params.ysAliRate = (Number(params.ysAliRate) / 100).toFixed(4)
      // 乐刷
      params.lsWxRate = (Number(params.lsWxRate) / 100).toFixed(4)
      params.lsAliRate = (Number(params.lsAliRate) / 100).toFixed(4)
      // 传化
      params.chWxInterestRate = (Number(params.chWxInterestRate) / 100).toFixed(4)
      params.chAliInterestRate = (Number(params.chAliInterestRate) / 100).toFixed(4)
      // 天阙随行付
      params.tqSxfWxRate = (Number(params.tqSxfWxRate) / 100).toFixed(4)
      params.tqSxfAliRate = (Number(params.tqSxfAliRate) / 100).toFixed(4)
      // 易生
      params.ysPayWxRate = (Number(params.ysPayWxRate) / 100).toFixed(4)
      params.ysPayAliRate = (Number(params.ysPayAliRate) / 100).toFixed(4)
      // params.ysPayServiceRate = (Number(params.ysPayServiceRate) / 100).toFixed(4) //D0费率

      // 新大陆
      params.newLandWxRate = (Number(params.newLandWxRate) / 100).toFixed(4)
      params.newLandAliRate = (Number(params.newLandAliRate) / 100).toFixed(4)
      // 银联 暂时没有
      //  拉卡拉
      params.lakalaWxRate = (Number(params.lakalaWxRate) / 100).toFixed(4) // 拉卡拉微信利率
      params.lakalaAliRate = (Number(params.lakalaAliRate) / 100).toFixed(4) // 拉卡拉支付宝利率
      //  手机pos
      params.posTradeRate = (Number(params.posTradeRate) / 100).toFixed(4) // 手机pos交易费率
      params.quickTradeRate = (Number(params.quickTradeRate) / 100).toFixed(4) // 网联交易费率
      //开店宝
      params.kdbWxTradeRate = (Number(params.kdbWxTradeRate) / 100).toFixed(4)    //费率
      // params.kdbServiceRate = (Number(params.kdbServiceRate) / 100).toFixed(4)    //D0费率
      //畅捷
      params.chanpayTradeRate = (Number(params.chanpayTradeRate) / 100).toFixed(4)    //费率

      params.payWay = parseInt(this.payParam.payWay)
      saveTopPayConfig(params).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.btnLoading = false
        this.closeTopPayDialog()
      }).catch(() => {
        this.payDisable = false
        this.btnLoading = false
        this.loading = false
      })
    },

    // ====================商户支付参数配置========================
    canConfig() {
      this.payDisable = false
    },
    openConfigDialog(row) {
      this.clearPayParam()
      this.payDialog = true
      this.payParam.payWay = '1'
      this.merchantId = row.id
      this.findPayConfig(row.id)
    },
    closePayDialog() {
      this.payDialog = false
      this.payDisable = true
      let se = this
      setTimeout(function () {
        se.clearPayParam()
      }, 100)
    },
    clearPayParam() {
      this.payParam.ali.interestRate = ''
      this.payParam.ali.id = ''
      this.payParam.ali.appAuthToken = ''
      this.payParam.ali.pid = ''
      this.payParam.wx.interestRate = ''
      this.payParam.wx.id = ''
      this.payParam.wx.subMchId = ''
      this.payParam.hyb.wxInterestRate = ''
      this.payParam.hyb.aliInterestRate = ''
      this.payParam.hyb.id = ''
      this.payParam.hyb.appId = ''
      this.payParam.hyb.appKey = ''
      this.payParam.yrm.wxInterestRate = ''
      this.payParam.yrm.aliInterestRate = ''
      this.payParam.yrm.id = ''
      this.payParam.yrm.mid = ''
      this.payParam.yrm.appKey = ''
      this.payParam.hsf.wxInterestRate = ''
      this.payParam.hsf.aliInterestRate = ''
      this.payParam.hsf.id = ''
      this.payParam.hsf.shopId = ''
      this.payParam.hsf.appKey = ''
      // 富友
      this.payParam.fy.wxInterestRate = ''
      this.payParam.fy.aliInterestRate = ''
      this.payParam.fy.mchntCd = ''
      this.payParam.fy.id = ''
      // 随行付
      this.payParam.sxf.wxInterestRate = ''
      this.payParam.sxf.aliInterestRate = ''
      this.payParam.sxf.mno = ''
      this.payParam.sxf.subMchId = ''
      this.payParam.sxf.id = ''
      // 威富通
      this.payParam.ys.wxInterestRate = ''
      this.payParam.ys.aliInterestRate = ''
      this.payParam.ys.mchId = ''
      this.payParam.ys.privateKey = ''
      this.payParam.ys.id = ''
      this.payParam.ys.ysPayPublicKey = ''
      // this.payParam.ys.ysPayTypeId = ''
      // 乐刷
      this.payParam.ls.wxInterestRate = ''
      this.payParam.ls.aliInterestRate = ''
      this.payParam.ls.mchId = ''
      this.payParam.ls.id = ''
      // 传化
      this.payParam.ch.wxInterestRate = ''
      this.payParam.ch.aliInterestRate = ''
      this.payParam.ch.mchId = ''
      this.payParam.ch.id = ''
      // 天阙随行付
      this.payParam.tqsxf.wxInterestRate = ''
      this.payParam.tqsxf.aliInterestRate = ''
      this.payParam.tqsxf.mno = ''
      this.payParam.tqsxf.id = ''
      // 易生
      this.payParam.yspay.wxInterestRate = ''
      this.payParam.yspay.aliInterestRate = ''
      this.payParam.yspay.id = ''
      this.payParam.yspay.mchId = ''
      this.payParam.yspay.termId = ''
      // 新大陆
      this.payParam.newland.wxInterestRate = ''
      this.payParam.newland.aliInterestRate = ''
      this.payParam.newland.id = ''
      this.payParam.newland.mercId = ''
      this.payParam.newland.trmNo = ''
      this.payParam.newland.tradeKey = ''
      //银联暂时没有
      // 拉卡拉
      this.payParam.lakala.wxInterestRate = ''
      this.payParam.lakala.aliInterestRate = ''
      this.payParam.lakala.lklMercId = '' //编码
      this.payParam.lakala.termId = '' //终端号

      //手机pos
      this.payParam.sjPos.posTradeRate = ''
      this.payParam.sjPos.posDrawFee = ''
      this.payParam.sjPos.quickTradeRate = ''
      this.payParam.sjPos.quickDrawFee = ''
      this.payParam.sjPos.merCode = ''
      //  开店宝
      this.payParam.kdb.merCode = '' // 通道商户编号
      this.payParam.kdb.kdbWxTradeRate = '' // 费率
      //  畅捷
      this.payParam.cj.merCode = '' // 通道商户编号
      this.payParam.cj.chanpayWxTradeRate = '' // 费率
    },
    findPayConfig(merchantId) {
      findPayConfig(merchantId).then(response => {
        let data = response.obj
        console.log('data', data)
        // 微信
        let wxData = data.wx
        if (wxData) {
          this.payParam.wx.interestRate = wxData.interestRate * 100
          this.payParam.wx.id = wxData.id
          this.payParam.wx.subMchId = wxData.subMchId
        }
        // 支付宝
        let aliData = data.ali
        if (aliData) {
          this.payParam.ali.interestRate = aliData.interestRate * 100
          this.payParam.ali.id = aliData.id
          this.payParam.ali.appAuthToken = aliData.appAuthToken
          this.payParam.ali.pid = aliData.pid
        }
        // 会员宝
        let hybData = data.hyb
        if (hybData) {
          this.payParam.hyb.wxInterestRate = hybData.wxInterestRate * 100
          this.payParam.hyb.aliInterestRate = hybData.aliInterestRate * 100
          this.payParam.hyb.id = hybData.id
          this.payParam.hyb.appId = hybData.appId
          this.payParam.hyb.appKey = hybData.appKey
        }
        // 易融码
        let yrmData = data.yrm
        if (yrmData) {
          this.payParam.yrm.wxInterestRate = yrmData.wxInterestRate * 100
          this.payParam.yrm.aliInterestRate = yrmData.aliInterestRate * 100
          this.payParam.yrm.id = yrmData.id
          this.payParam.yrm.mid = yrmData.mid
          this.payParam.yrm.appKey = yrmData.appKey
        }
        // 惠闪付
        let hsfData = data.hsf
        if (hsfData) {
          this.payParam.hsf.wxInterestRate = hsfData.wxInterestRate * 100
          this.payParam.hsf.aliInterestRate = hsfData.aliInterestRate * 100
          this.payParam.hsf.id = hsfData.id
          this.payParam.hsf.shopId = hsfData.shopId
          this.payParam.hsf.appKey = hsfData.appKey
        }
        // sxf
        let sxfData = data.sxf
        if (sxfData) {
          this.payParam.sxf.wxInterestRate = sxfData.wxInterestRate * 100
          this.payParam.sxf.aliInterestRate = sxfData.aliInterestRate * 100
          this.payParam.sxf.id = sxfData.id
          // this.payParam.sxf.orgId = sxfData.orgId
          this.payParam.sxf.mno = sxfData.mno
          this.payParam.sxf.subMchId = sxfData.subMchId
          // this.payParam.sxf.privateKey = sxfData.privateKey
        }
        // fy
        let fyData = data.fy
        if (fyData) {
          this.payParam.fy.wxInterestRate = fyData.wxInterestRate * 100
          this.payParam.fy.aliInterestRate = fyData.aliInterestRate * 100
          this.payParam.fy.id = fyData.id
          // this.payParam.fy.insCd = fyData.insCd
          this.payParam.fy.mchntCd = fyData.mchntCd
          this.payParam.fy.ysPayPublicKey = fyData.ysPayPublicKey
          // this.payParam.fy.insPrivateKey = fyData.insPrivateKey
        }

        // ys
        let ysData = data.ys
        if (ysData) {
          this.payParam.ys.wxInterestRate = ysData.wxInterestRate * 100
          this.payParam.ys.aliInterestRate = ysData.aliInterestRate * 100
          this.payParam.ys.mchId = ysData.mchId
          this.payParam.ys.privateKey = ysData.privateKey
          this.payParam.ys.ysPayPublicKey = ysData.ysPayPublicKey
          this.payParam.ys.id = ysData.id
          // this.payParam.ys.ysPayTypeId = ysData.ysPayTypeId
        }

        // ls
        let lsData = data.ls
        if (lsData) {
          this.payParam.ls.wxInterestRate = lsData.wxInterestRate * 100
          this.payParam.ls.aliInterestRate = lsData.aliInterestRate * 100
          this.payParam.ls.mchId = lsData.mchId
          this.payParam.ls.id = lsData.id
        }

        // ch
        let chData = data.ch
        if (chData) {
          this.payParam.ch.wxInterestRate = chData.wxInterestRate * 100
          this.payParam.ch.aliInterestRate = chData.aliInterestRate * 100
          this.payParam.ch.id = chData.id
          this.payParam.ch.mchId = chData.mchId
        }

        // tqsxf
        let tqsxfData = data.tqsxf
        if (tqsxfData) {
          this.payParam.tqsxf.wxInterestRate = tqsxfData.wxInterestRate * 100
          this.payParam.tqsxf.aliInterestRate = tqsxfData.aliInterestRate * 100
          this.payParam.tqsxf.id = tqsxfData.id
          this.payParam.tqsxf.mno = tqsxfData.mno
        }

        // yspay
        let yspayData = data.yspay
        if (yspayData) {
          this.payParam.yspay.wxInterestRate = yspayData.wxInterestRate * 100
          this.payParam.yspay.aliInterestRate = yspayData.aliInterestRate * 100
          this.payParam.yspay.id = yspayData.id
          this.payParam.yspay.mchId = yspayData.mchId
          this.payParam.yspay.termId = yspayData.termId
        }

        // newland
        let newlandData = data.newland
        if (newlandData) {
          this.payParam.newland.wxInterestRate = newlandData.wxInterestRate * 100
          this.payParam.newland.aliInterestRate = newlandData.aliInterestRate * 100
          this.payParam.newland.id = newlandData.id
          this.payParam.newland.mercId = newlandData.mercId
          this.payParam.newland.trmNo = newlandData.trmNo
          this.payParam.newland.tradeKey = newlandData.tradeKey
        }
        // 拉卡拉
        let lakalaData = data.lakala
        if (lakalaData) {
          this.payParam.lakala.wxInterestRate = lakalaData.wxInterestRate * 100
          this.payParam.lakala.aliInterestRate = lakalaData.aliInterestRate * 100
          this.payParam.lakala.lklMercId = lakalaData.lklMercId //编码
          this.payParam.lakala.termId = lakalaData.termId //终端号
        }
        // 手机pos
        let sjPosData = data.sjPos
        if (sjPosData) {
          this.payParam.sjPos.posTradeRate = sjPosData.posTradeRate * 100
          this.payParam.sjPos.posDrawFee = sjPosData.posDrawFee
          this.payParam.sjPos.quickTradeRate = sjPosData.quickTradeRate * 100
          this.payParam.sjPos.quickDrawFee = sjPosData.quickDrawFee
          this.payParam.sjPos.merCode = sjPosData.merCode
        }

        // 开店宝
        let kdbData = data.kdb
        if (kdbData) {
          this.payParam.kdb.kdbWxTradeRate = kdbData.kdbWxTradeRate * 100
          this.payParam.kdb.merCode = kdbData.merCode //商户编号
        }

        // 畅捷
        let cjData = data.chanpay
        if (cjData) {
          this.payParam.cj.chanpayWxTradeRate = cjData.chanpayWxTradeRate * 100
          this.payParam.cj.merCode = cjData.merCode //商户编号
        }

      }).catch(() => {
        this.loading = false
      })
    },
    radioChange(){
      console.log(2222222222,this.commissionParam.cashOutWay)
    },
    cashChange(){
      console.log(111111111111,this.commissionParam.cashOutTypes)
    },
    //获取佣金配置
    getCommissionConfig(){
      getCommissionConfig().then(res=>{
        let commissionParamData = res.obj
        this.commissionParam.rateCash = commissionParamData.rateCash * 100;
        this.commissionParam.cashOutWay = commissionParamData.cashOutWay //提现方式
        this.commissionParam.minCashAmount = commissionParamData.minCashAmount
        this.commissionParam.maxCashAmount = commissionParamData.maxCashAmount
        this.commissionParam.cashOutTypes = commissionParamData.cashOutTypes
      }).catch(() => {
        this.loading = false
      })
    },
    //当月佣金总额
    findCommissionCurrentMonth(){
      this.companyId = sessionStorage.getItem('companyId')
      findCommissionCurrentMonth(this.companyId)
    },
    /**
     * 佣金提现参数配置
     */
    openCommissionConfigDialog(){
      this.commissionDialog = true;
      this.getCommissionConfig()


    },

    // 保存分佣提现参数
    saveCommissionConfig() {
      let postData = {};
      postData.minCashAmount = 10
      postData.maxCashAmount = 20
      postData.rateCash = 0.02
      postData.cashOutWay = '1'
      // postData.cashOutTypes = []
      // console.log('postData444444444444',postData)
      this.btnLoading = true // 锁定按钮
      this.payDisable = true
      this.commissionParam.rateCash = Number((this.commissionParam.rateCash / 100).toFixed(4))
      console.log(33333333,this.commissionParam.rateCash)
      // todo 不进行深拷贝，在浏览器看请求数据，费率会自动变为0
      let newData = JSON.parse(JSON.stringify(this.commissionParam))
      saveCommissionConfig(newData).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.btnLoading = false
        this.clearCommissionParam()
        this.closeCommissionDialog()
      }).catch(() => {
        this.payDisable = false
        this.btnLoading = false
        this.loading = false
      })
    },
    clearCommissionParam(){
      this.commissionParam.rateCash = 0;
      this.commissionParam.cashOutTypes = []
      this.commissionParam.cashOutWay = ''
      this.commissionParam.maxCashAmount = 0
      this.commissionParam.minCashAmount = 0
    },
    closeCommissionDialog() {
      this.commissionDialog = false
      this.payDisable = true
      let se = this
      setTimeout(function () {
        se.clearCommissionParam()
      }, 100)
    },
    // 保存支付参数
    savePayConfig() {
      this.btnLoading = true // 锁定按钮
      this.payDisable = true
      let config = ''
      let arr = []
      // 微信
      if (this.payParam.wx && (this.payParam.wx.id || this.payParam.wx.interestRate || this.payParam.wx.subMchId)) {
        config = JSON.parse(JSON.stringify(this.payParam.wx))
        config.interestRate = Number((config.interestRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 1,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }
      /*
      if (this.payParam.payWay == 1) {
        config = JSON.parse(JSON.stringify(this.payParam.wx))
        config.interestRate = Number((config.interestRate / 100).toFixed(4))
      }
      */
      // 支付宝
      if (this.payParam.ali && (this.payParam.ali.id || this.payParam.ali.appAuthToken || this.payParam.ali.interestRate || this.payParam.ali.pid)) {
        config = JSON.parse(JSON.stringify(this.payParam.ali))
        config.interestRate = Number((this.payParam.ali.interestRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 2,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }
      /*
      if (this.payParam.payWay == 2) {
        config = JSON.parse(JSON.stringify(this.payParam.ali))
        config.interestRate = Number((this.payParam.ali.interestRate / 100).toFixed(4))
      }
      */
      // hyb
      if (this.payParam.hyb && (this.payParam.hyb.id || this.payParam.hyb.aliInterestRate || this.payParam.hyb.appId || this.payParam.hyb.appKey || this.payParam.hyb.wxInterestRate)) {
        config = JSON.parse(JSON.stringify(this.payParam.hyb))
        config.wxInterestRate = Number((this.payParam.hyb.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.hyb.aliInterestRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 3,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }
      /*
      if (this.payParam.payWay == 3) {
        config = JSON.parse(JSON.stringify(this.payParam.hyb))
        config.wxInterestRate = Number((this.payParam.hyb.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.hyb.aliInterestRate / 100).toFixed(4))
      }
      */
      // yrm
      if (this.payParam.yrm && (this.payParam.yrm.id || this.payParam.yrm.aliInterestRate || this.payParam.yrm.appKey || this.payParam.yrm.mid || this.payParam.yrm.wxInterestRate)) {
        config = JSON.parse(JSON.stringify(this.payParam.yrm))
        config.wxInterestRate = Number((this.payParam.yrm.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.yrm.aliInterestRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 4,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }
      /*
      if (this.payParam.payWay == 4) {
        config = JSON.parse(JSON.stringify(this.payParam.yrm))
        config.wxInterestRate = Number((this.payParam.yrm.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.yrm.aliInterestRate / 100).toFixed(4))
      }
      */
      // hsf
      if (this.payParam.hsf && (this.payParam.hsf.id || this.payParam.hsf.aliInterestRate || this.payParam.hsf.appKey || this.payParam.hsf.shopId || this.payParam.hsf.wxInterestRate)) {
        config = JSON.parse(JSON.stringify(this.payParam.hsf))
        config.wxInterestRate = Number((this.payParam.hsf.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.hsf.aliInterestRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 5,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }
      /*
      if (this.payParam.payWay == 5) {
        config = JSON.parse(JSON.stringify(this.payParam.hsf))
        config.wxInterestRate = Number((this.payParam.hsf.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.hsf.aliInterestRate / 100).toFixed(4))
      }
      */
      // sxf
      if (this.payParam.sxf && (this.payParam.sxf.aliInterestRate || this.payParam.sxf.mno || this.payParam.sxf.wxInterestRate)) {
        config = JSON.parse(JSON.stringify(this.payParam.sxf))
        config.wxInterestRate = Number((this.payParam.sxf.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.sxf.aliInterestRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 7,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }
      /*
      // 随行付
      if (this.payParam.payWay == 7) {
        config = JSON.parse(JSON.stringify(this.payParam.sxf))
        config.wxInterestRate = Number((this.payParam.sxf.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.sxf.aliInterestRate / 100).toFixed(4))
      }
      */
      // fy
      if (this.payParam.fy && (this.payParam.fy.id || this.payParam.fy.aliInterestRate || this.payParam.fy.mchntCd || this.payParam.fy.wxInterestRate)) {
        config = JSON.parse(JSON.stringify(this.payParam.fy))
        config.wxInterestRate = Number((this.payParam.fy.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.fy.aliInterestRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 6,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }
      /*
      // 富友
      if (this.payParam.payWay == 6) {
        config = JSON.parse(JSON.stringify(this.payParam.fy))
        config.wxInterestRate = Number((this.payParam.fy.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.fy.aliInterestRate / 100).toFixed(4))
      }
      */
      // ys
      if (this.payParam.ys && (this.payParam.ys.id || this.payParam.ys.aliInterestRate || this.payParam.ys.mchId || this.payParam.ys.privateKey || this.payParam.ys.wxInterestRate || this.payParam.ys.ysPayPublicKey)) {
        config = JSON.parse(JSON.stringify(this.payParam.ys))
        config.wxInterestRate = Number((this.payParam.ys.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.ys.aliInterestRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 9,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }
      /*
      // 威富通
      if (this.payParam.payWay == 9) {
        config = JSON.parse(JSON.stringify(this.payParam.ys))
        config.wxInterestRate = Number((this.payParam.ys.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.ys.aliInterestRate / 100).toFixed(4))
      }
      */
      // ls
      if (this.payParam.ls && (this.payParam.ls.id || this.payParam.ls.aliInterestRate || this.payParam.ls.mchId || this.payParam.ls.wxInterestRate)) {
        config = JSON.parse(JSON.stringify(this.payParam.ls))
        config.wxInterestRate = Number((this.payParam.ls.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.ls.aliInterestRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 10,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }
      /*
      // 乐刷
      if (this.payParam.payWay == 10) {
        config = JSON.parse(JSON.stringify(this.payParam.ls))
        config.wxInterestRate = Number((this.payParam.ls.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.ls.aliInterestRate / 100).toFixed(4))
      }
      */
      // ch
      if (this.payParam.ch && (this.payParam.ch.id || this.payParam.ch.aliInterestRate || this.payParam.ch.mchId || this.payParam.ch.wxInterestRate)) {
        config = JSON.parse(JSON.stringify(this.payParam.ch))
        config.wxInterestRate = Number((this.payParam.ch.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.ch.aliInterestRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 11,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }
      /*
      // 传化
      if (this.payParam.payWay == 11) {
        config = JSON.parse(JSON.stringify(this.payParam.ch))
        config.wxInterestRate = Number((this.payParam.ch.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.ch.aliInterestRate / 100).toFixed(4))
      }
      */
      // tqsxf
      if (this.payParam.tqsxf && (this.payParam.tqsxf.aliInterestRate || this.payParam.tqsxf.mno || this.payParam.tqsxf.wxInterestRate)) {
        config = JSON.parse(JSON.stringify(this.payParam.tqsxf))
        config.wxInterestRate = Number((this.payParam.tqsxf.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.tqsxf.aliInterestRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 12,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }

      // yspay
      if (this.payParam.yspay && (this.payParam.yspay.aliInterestRate || this.payParam.yspay.wxInterestRate || this.payParam.yspay.mchId || this.payParam.yspay.termId)) {
        config = JSON.parse(JSON.stringify(this.payParam.yspay))
        config.wxInterestRate = Number((this.payParam.yspay.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.yspay.aliInterestRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 13,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }

      // newland
      if (this.payParam.newland && (this.payParam.newland.aliInterestRate || this.payParam.newland.wxInterestRate || this.payParam.newland.mercId || this.payParam.newland.trmNo || this.payParam.newland.tradeKey)) {
        config = JSON.parse(JSON.stringify(this.payParam.newland))
        config.wxInterestRate = Number((this.payParam.newland.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.newland.aliInterestRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 14,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }
      // 拉卡拉
      if (this.payParam.lakala && (this.payParam.lakala.aliInterestRate || this.payParam.lakala.mno || this.payParam.lakala.wxInterestRate)) {
        config = JSON.parse(JSON.stringify(this.payParam.lakala))
        config.wxInterestRate = Number((this.payParam.lakala.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.lakala.aliInterestRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 16,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }
      // 手机pos
      if (this.payParam.sjPos && (this.payParam.sjPos.posTradeRate || this.payParam.sjPos.posDrawFee || this.payParam.sjPos.quickTradeRate || this.payParam.sjPos.quickDrawFee || this.payParam.sjPos.merCode)) {
        config = JSON.parse(JSON.stringify(this.payParam.sjPos))
        config.posTradeRate = Number((this.payParam.sjPos.posTradeRate / 100).toFixed(4))
        config.quickTradeRate = Number((this.payParam.sjPos.quickTradeRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 17,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }
      // 开店宝
      if (this.payParam.kdb && (this.payParam.kdb.kdbWxTradeRate || this.payParam.kdb.merCode)) {
        config = JSON.parse(JSON.stringify(this.payParam.kdb))
        config.kdbWxTradeRate = Number((this.payParam.kdb.kdbWxTradeRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 19,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }
      // 畅捷
      if (this.payParam.cj && (this.payParam.cj.chanpayWxTradeRate || this.payParam.cj.merCode)) {
        config = JSON.parse(JSON.stringify(this.payParam.cj))
        config.chanpayWxTradeRate = Number((this.payParam.cj.chanpayWxTradeRate / 100).toFixed(4))
        let params = {
          merchantId: this.merchantId,
          payWay: 20,
          payConfig: JSON.stringify(config)
        }
        arr.push(params)
      }
      /*
      // 天阙随行付
      if (this.payParam.payWay == 12) {
        config = JSON.parse(JSON.stringify(this.payParam.tqsxf))
        config.wxInterestRate = Number((this.payParam.tqsxf.wxInterestRate / 100).toFixed(4))
        config.aliInterestRate = Number((this.payParam.tqsxf.aliInterestRate / 100).toFixed(4))
      }
      */
      // savePayConfig(JSON.stringify(config), this.merchantId, this.payParam.payWay).then(response => {
      savePayConfig(arr).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.btnLoading = false
        this.clearPayParam()
        this.closePayDialog()
      }).catch(() => {
        this.payDisable = false
        this.btnLoading = false
        this.loading = false
      })
    },
    handleSuccess(response) {
      this.$message({
        message: response.msg,
        type: 'success'
      })
      this.topParam.wxCertPath = response.obj
    },

    /**
     * 佣金生成
     */
    openTopCommissionDialog() {
      // createComission
      this.dialogCommisssion = {
        show: true
      }
    },
    /**
     * 商户绑定APPID
     */
    bindChAppId(merchantId, payWay) {
      let params = {
        payWay: payWay,
        merchantId: merchantId
      }
      updateAppid(params).then(res => {
        this.$message.success('绑定成功')
      })
    },
    /**
     * 获取易生签名密钥
     */
    getYspayPrivateSignKey() {
      let params = {
        ysPayChanelId: this.topParam.ysPayChannelId,
        ysMainKey: this.topParam.ysMainKey
      }
      getYspayPrivateSignKeyVal(params).then(res => {
        this.topParam.ysPaySignKey = res.obj.key
      })
    },
    /**
     * 获取易生协议签名密钥
     */
    getYsAgreementPrivateSignKeyVal() {
      let params = {
        ysPayChanelId: this.topParam.ysPayChannelId,
        ysAgreementKey: this.topParam.ysAgreementKey
      }
      getYsAgreementPrivateSignKeyVal(params).then(res => {
        this.topParam.ysAgreementSignKey = res.obj.key
      })
    },

    /**
     * 随行付商户信息查询
     */
    getSxfSubmchidByTaskCode() {
      if (!this.taskCode) {
        this.$message.warning('请输入随行付任务编码')
        return
      }
      if (!this.payParam.sxf.id) {
        return this.$message.warning('请先提交配置信息再再获取子商户号')
      }
      let params = {
        taskCode: this.taskCode,
        merchantId: this.merchantId
      }
      this.sxFrepoInfoArr = []
      getSxfMerchantQuery(params).then(res => {
        let repoInfoArr = []
        if (res.obj.repoInfo && res.obj.repoInfo.length) {
          res.obj.repoInfo.forEach(item => {
            if (item.childNoType === 'WX') {
              repoInfoArr.push(item)
            }
          })
        }
        this.sxFrepoInfoArr = repoInfoArr
      })
    },
    // 天阙随行付商户信息查询
    getTqSxfSubmchidByTaskCode() {
      if (!this.payParam.tqsxf.id) {
        return this.$message.warning('请先提交配置信息再再获取子商户号')
      }
      this.tqsxFrepoInfoArr = []
      getSxfMerchantQuery({ merchantId: this.merchantId }).then(res => {
        let repoInfoArr = []
        if (res.obj.repoInfo && res.obj.repoInfo.length) {
          res.obj.repoInfo.forEach(item => {
            if (item.childNoType === 'WX') {
              repoInfoArr.push(item)
            }
          })
        }
        this.tqsxFrepoInfoArr = repoInfoArr
      })
    }
  }


}
</script>

<style scoped>
.formItem {
  display: inline-block;
  width: 150px;
  max-width: 100%;
}
</style>
