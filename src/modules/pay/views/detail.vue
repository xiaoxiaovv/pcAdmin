<template>
  <div class="app-container">
    <div slot="header"
         class="clearfix">
      <span>进件详情</span>
      <el-button style="float: right; padding: 3px 0"
                 type="text"
                 @click="goback()">返回</el-button>
    </div>
    <el-tabs v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane label="基本材料"
                   name="1"></el-tab-pane>
      <el-tab-pane label="随行付"
                   name="2"
                   v-if="payConfig.indexOf('随行付') > -1"></el-tab-pane>
      <el-tab-pane label="微信"
                   name="3"
                   v-if="payConfig.indexOf('官方') > -1"></el-tab-pane>
      <el-tab-pane label="支付宝"
                   name="4"
                   v-if="payConfig.indexOf('官方') > -1"></el-tab-pane>
      <el-tab-pane label="乐刷"
                   name="5"
                   v-if="payConfig.indexOf('乐刷') > -1"></el-tab-pane>
      <el-tab-pane label="威富通"
                   name="6"
                   v-if="payConfig.indexOf('威富通') > -1"></el-tab-pane>
      <el-tab-pane label="传化"
                   name="7"
                   v-if="payConfig.indexOf('传化') > -1"></el-tab-pane>
      <el-tab-pane label="富友"
                   name="8"
                   v-if="payConfig.indexOf('富友') > -1"></el-tab-pane>

      <!--<el-tab-pane label="中国银联"
	               name="9"
	               v-if="payConfig.indexOf('银联') > -1"></el-tab-pane>-->
      <!--<el-tab-pane label="拉卡拉"
                   name="10"
                   v-if="payConfig.indexOf('拉卡拉') > -1"></el-tab-pane>-->
      <el-tab-pane label="手机pos"
                   name="11"
                   v-if="payConfig.indexOf('手机pos') > -1"></el-tab-pane>
      <el-tab-pane label="开店宝"
                   name="12"
                   v-if="payConfig.indexOf('开店宝') > -1"></el-tab-pane>
      <el-tab-pane label="畅捷"
                   name="13"
                   v-if="payConfig.indexOf('畅捷支付') > -1"></el-tab-pane>
    </el-tabs>
    <div v-show="activeName === '1'">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>营业信息</span>
        </div>
        <div>
          <table>
            <tr>
              <td>法人/经营者身份证正面</td>
              <td>
                <ImgShow :url="detail.epresentativePhotoId"
                         v-if="detail.epresentativePhotoId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>法人/经营者身份证反面</td>
              <td>
                <ImgShow :url="detail.epresentativePhotoId2"
                         v-if="detail.epresentativePhotoId2"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>姓名</td>
              <td>
                {{detail.representativeName || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>身份证号码</td>
              <td>
                {{detail.certificateNum || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>有效期</td>
              <td>
                {{detail.startCertificateTime}}~{{detail.endCertificateTime==='2099-12-31'?'长期':detail.endCertificateTime}}
              </td>
            </tr>
            <tr>
              <td>法人手机号</td>
              <td>
                {{detail.legalPersonPhone || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>营业执照（小微商户请忽略）</td>
              <td>
                <ImgShow :url="detail.businessLicensePhotoId"
                         v-if="detail.businessLicensePhotoId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>注册号</td>
              <td>
                {{detail.license || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>名称</td>
              <td>
                {{detail.businessLicenseName || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>类型</td>
              <td>
                {{['企业','个体工商户'][detail.businessType-1] || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>地址</td>
              <td>
                {{detail.registerAddress || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>法定代表人/经营者</td>
              <td>
                {{detail.person || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>营业期限</td>
              <td>
                {{detail.startBusinessTime}}~{{detail.endBusinessTime === '2099-12-31' ? '长期':detail.endBusinessTime}}
              </td>
            </tr>
          </table>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>结算信息</span>
        </div>
        <div>
          <table>
            <tr v-if="detail.businessType === 1 || detail.businessType === '1'">
              <td>对公账户开户许可证</td>
              <td>
                <ImgShow :url="detail.openingAccountLicensePicId"
                         v-if="detail.openingAccountLicensePicId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr v-if="detail.businessType === 2 || detail.businessType === '2'">
              <td>经营者银行卡</td>
              <td>
                <ImgShow :url="detail.bankCardPositivePicId"
                         v-if="detail.bankCardPositivePicId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>开户总行银行</td>
              <td>
                {{detail.bnkCdName || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>开户支行所在省行政</td>
              <td>
                {{detail.lbnkProvName || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>开户支行所在市行政</td>
              <td>
                {{detail.lbnkCityName || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>开户支行所在支行</td>
              <td>
                {{detail.lbnkNoName || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>开户名称</td>
              <td>
                {{detail.accountHolder || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>开户账号</td>
              <td>
                {{detail.accountNumber || '暂无'}}
              </td>
            </tr>
          </table>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>基本信息</span>
        </div>
        <div>
          <table>
            <tr>
              <td>店内门头照</td>
              <td>
                <ImgShow :url="detail.storeEntrancePicId"
                         v-if="detail.storeEntrancePicId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>店内环境照片</td>
              <td>
                <ImgShow :url="detail.indoorPicId"
                         v-if="detail.indoorPicId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>经营省市区</td>
              <td>
                <template v-if="detail.regProvCdName || detail.regCityCdName || detail.regDistCdName">
                  {{detail.regProvCdName}}{{detail.regCityCdName}}{{detail.regDistCdName}}
                </template>
                <template v-else>暂无</template>
              </td>
            </tr>
            <tr>
              <td>经营地址</td>
              <td>
                {{detail.address || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>联系人</td>
              <td>
                {{detail.contact || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>手机号码</td>
              <td>
                {{detail.phone || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>常用邮箱</td>
              <td>
                {{detail.email || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>客服电话</td>
              <td>
                {{detail.cusServiceTel || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>用户简称</td>
              <td>
                {{detail.shortName || '暂无'}}
              </td>
            </tr>
          </table>
        </div>
      </el-card>
    </div>
    <div v-show="activeName === '2'">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>随行付通道</span>
        </div>
        <div>
          <table>
            <tr>
              <td>经营类目</td>
              <td>
                {{detail.mccCdName || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>结算费率</td>
              <td>
                {{(detail.sxfRate===null || detail.sxfRate===undefined)?'暂无':detail.sxfRate + '%'}}<el-button class="ml10"
                           v-if="!(detail.sxfRate===null || detail.sxfRate===undefined)"
                           type="text"
                           size="small"
                           @click="changeRate('sxf', detail.sxfRate, 1)">修改</el-button>
              </td>
            </tr>
          </table>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>进件状态</span>
        </div>
        <div>
          <table>
            <tr>
              <td>进件时间</td>
              <td>
                {{sxfData.commitTime || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>微信费率</td>
              <td>
                {{(sxfData.wxRate === null || sxfData.wxRate === undefined)? '暂无': sxfData.wxRate+'%' }}
              </td>
            </tr>
            <tr>
              <td>支付宝费率</td>
              <td>
                {{(sxfData.alipayRate === null || sxfData.alipayRate === undefined)? '暂无': sxfData.alipayRate+'%' }}
              </td>
            </tr>
            <tr>
              <td>商户编码</td>
              <td>
                {{sxfData.mno || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>注册名称</td>
              <td>
                {{sxfData.name || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>进件状态</td>
              <td>
                {{['未知','审核中','审核通过','审核驳回','资料不齐全', '进件失败','商户验证'][Number(sxfData.status)-1] || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>进件结果</td>
              <td>
                {{sxfData.result || '暂无'}}
              </td>
            </tr>
          </table>
        </div>
      </el-card>
    </div>
    <div v-show="activeName === '3'">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>微信官方通道</span>
        </div>
        <div>
          <table>
            <tr>
              <td>经营描述</td>
              <td>
                {{detail.productDesc || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>经营行业</td>
              <td>
                {{detail.merchantBusiness || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>法人银行卡</td>
              <td>
                <ImgShow :url="detail.personAccountPicId"
                         v-if="detail.personAccountPicId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>开户名称</td>
              <td>
                {{detail.personAccountName || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>开户总行名称</td>
              <td>
                {{detail.personAccountBank || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>开户银行账号</td>
              <td>
                {{detail.personAccountNumber || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>开户支行所在地</td>
              <td>
                <template v-if="detail.accounRegProvName || detail.accounRegCityName">{{detail.accounRegProvName}}{{detail.accounRegCityName}}</template>
                <template v-else>暂无</template>
              </td>
            </tr>
            <tr>
              <td>开户行银行全称（包括支行）</td>
              <td>
                {{detail.personBankName || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>特殊资质</td>
              <td>
                <ImgShow :url="detail.specialQualificationPhotoId"
                         v-if="detail.specialQualificationPhotoId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
          </table>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>微信进件状态</span>
        </div>
        <div>
          <table>
            <tr>
              <td>进件时间</td>
              <td>
                {{wxData.commitTime || '暂无'}}
              </td>
            </tr>
            <tr>
              <td v-if="wxData.subMchId">子商户号</td>
              <td v-else>小微商户号</td>
              <td>
                {{wxData.subMchId || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>进件状态</td>
              <td>
                {{wxData.wxFeedStatus || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>申请错误原因描述</td>
              <td>
                {{wxData.errCodeDes || '暂无'}}
              </td>
            </tr>
            <tr v-if="wxData.status==4">
              <td>驳回审核细节</td>
              <td>
                {{wxData.auditetail || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>入驻签约链接</td>
              <td>
                <span style="color: #3ebdff;cursor: pointer;"
                      @click="openLink(wxData.signUrl)"
                      v-if="wxData.signUrl">打开</span>
                <span v-else>暂无</span>
                <!--<a lass :href="wxData.signUrl">打开</a>-->
              </td>
            </tr>
            <tr>
              <td>商户升级签约链接</td>
              <td>
                <span style="color: #3ebdff;cursor: pointer;"
                      @click="openLink(wxData.upgradeSingUrl)"
                      v-if="wxData.upgradeSingUrl">打开</span>
                <span v-else>暂无</span>
                <!--<a lass :href="wxData.upgradeSingUrl">打开</a>-->
              </td>
            </tr>
          </table>
        </div>
      </el-card>
    </div>
    <div v-show="activeName === '4'">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>支付宝</span>
        </div>
        <div>
          <table>
            <tr>
              <td>商家支付宝账号</td>
              <td>
                {{detail.aliAccount || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>商家签约费率</td>
              <td>{{(detail.aliRate === null || detail.aliRate === undefined) ? '暂无' : detail.aliRate+'%'}}</td>
            </tr>
            <tr>
              <td>经营行业</td>
              <td v-if="detail.aliFirstLevel">
                {{detail.aliFirstLevel}}/{{detail.aliSecondLevel}}/{{detail.aliThirdLevel}}
              </td>
              <td v-else>
                暂无
              </td>
            </tr>
            <tr>
              <td>特殊资质图片</td>
              <td>
                <ImgShow :url="detail.aliSpecialLicensePic"
                         v-if="detail.aliSpecialLicensePic"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
          </table>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>进件状态</span>
        </div>
        <div>
          <table>
            <tr>
              <td>商户PID</td>
              <td>
                {{zfbData.merchantPid || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>应用ID</td>
              <td>
                {{zfbData.agentAppId || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>支付宝进件状态</td>
              <td>
                {{['未知','审核中','审核通过','审核驳回','资料不齐全', '进件失败','商户验证'][Number(zfbData.status)-1] || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>签约链接</td>
              <td>
                {{zfbData.confirmUrl || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>失败原因</td>
              <td>
                {{(zfbData.rejectReason || zfbData.errorDesc) ? `${zfbData.rejectReason|| ''} ${zfbData.errorDesc}` : '暂无'}}
              </td>
            </tr>
            <!--
            <tr>
              <td>审核失败原因</td>
              <td>
                {{zfbData.rejectReason || '暂无'}}
              </td>
            </tr>
            -->
            <tr>
              <td>提交时间</td>
              <td>
                {{zfbData.commitTime || '暂无'}}
              </td>
            </tr>
          </table>
        </div>
      </el-card>
    </div>
    <div v-show="activeName === '5'">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>乐刷通道</span>
        </div>
        <div>
          <table>
            <tr>
              <td>是否为餐饮</td>
              <td>
                {{detail.isIndustryDining?'是':'否'}}
              </td>
            </tr>
            <tr>
              <td>食品卫生许可证</td>
              <td>
                <ImgShow :url="detail.foodHealthPermissionPic"
                         v-if="detail.foodHealthPermissionPic"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>收银台照片</td>
              <td>
                <ImgShow :url="detail.cashierDeskPicId"
                         v-if="detail.cashierDeskPicId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>经营类目</td>
              <td>
                {{detail.leMccName || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>微信费率</td>
              <td>
                {{(detail.leWxRate===null || detail.leWxRate===undefined)?'暂无':detail.leWxRate + '%'}}
              </td>
            </tr>
            <tr>
              <td>阿里费率</td>
              <td>
                {{(detail.leAliRate===null || detail.leAliRate===undefined)?'暂无':detail.leAliRate + '%'}}
              </td>
            </tr>
          </table>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>进件状态</span>
        </div>
        <div>
          <table>
            <tr>
              <td>进件时间</td>
              <td>
                {{lsData.commitTime || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>商户编码</td>
              <td>
                {{lsData.mno || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>注册名称</td>
              <td>
                {{lsData.name || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>支付宝费率</td>
              <td>
                {{(lsData.alipayRate === null || lsData.alipayRate === undefined)?'暂无':lsData.alipayRate+'%'}}
              </td>
            </tr>
            <tr>
              <td>微信费率</td>
              <td>
                {{(lsData.wxRate === null || lsData.wxRate === undefined)?'暂无':lsData.wxRate+'%'}}
              </td>
            </tr>
            <tr>
              <td>进件状态</td>
              <td>
                {{['未知','审核中','审核通过','审核驳回','资料不齐全', '进件失败','商户验证'][Number(lsData.status)-1] || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>进件结果</td>
              <td>
                {{lsData.result || '暂无'}}
              </td>
            </tr>
          </table>
        </div>
      </el-card>
    </div>
    <div v-show="activeName === '6'">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>威富通通道</span>
        </div>
        <div>
          <table>
            <tr>
              <td>经营类目</td>
              <td>
                <template v-if="detail.ysFirstName">{{detail.industrName || '暂无'}}</template>
                <template v-else>暂无</template>
              </td>
            </tr>
            <tr>
              <td>结算费率</td>
              <td>
                {{(detail.ysRate === null || detail.ysRate === undefined)?'暂无':detail.ysRate + '%'}}<el-button class="ml10"
                           type="text"
                           size="small"
                           v-if="!(detail.ysRate === null || detail.ysRate === undefined)"
                           @click="changeRate('ys', detail.ysRate, 4)">修改</el-button>
              </td>
            </tr>
            <tr>
              <td>商家协议</td>
              <td>
                <template v-for="(item, index) in detail.proArr">
                  <ImgShow :key="index"
                           :url="item"
                           v-if="item"></ImgShow>
                </template>
                <template v-if="!detail.pro">暂无</template>
              </td>
            </tr>
          </table>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>进件状态</span>
        </div>
        <div>
          <table>
            <tr>
              <td>进件时间</td>
              <td>
                {{ysData.commitTime || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>微信费率</td>
              <td>
                {{(ysData.wxRate === null || ysData.wxRate === undefined) ? '暂无' : ysData.wxRate+'%'}}
              </td>
            </tr>
            <tr>
              <td>支付宝费率</td>
              <td>
                {{(ysData.alipayRate === null || ysData.alipayRate === undefined) ? '暂无' : ysData.wxRate+'%'}}
              </td>
            </tr>
            <tr>
              <td>商户编码</td>
              <td>
                {{ysData.mno || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>注册名称</td>
              <td>
                {{ysData.name || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>进件状态</td>
              <td>
                {{['未知','审核中','审核通过','审核驳回','资料不齐全', '进件失败','商户验证'][Number(ysData.status)-1] || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>进件结果</td>
              <td>
                {{ysData.result || '暂无'}}
              </td>
            </tr>
          </table>
        </div>
      </el-card>
    </div>
    <div v-show="activeName === '7'">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>传化通道</span>
        </div>
        <div>
          <table>
            <tr>
              <td>经营类目</td>
              <td>
                <template>{{detail.chMccCodeName || '暂无'}}</template>
              </td>
            </tr>

            <tr>
              <td>费率</td>
              <td>
                <template>{{(detail.chRate === null || detail.chRate === undefined) ? '暂无' : detail.chRate+'%'}}</template>
              </td>
            </tr>
          </table>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>进件状态</span>
        </div>
        <div>
          <table>
            <tr>
              <td>商户编号</td>
              <td>
                {{chData.mno || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>注册名称</td>
              <td>
                {{chData.name || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>支付宝费率</td>
              <td>
                {{(chData.alipayRate === null || chData.alipayRate === undefined) ? '暂无' : chData.alipayRate+'%'}}
              </td>
            </tr>
            <tr>
              <td>微信费率</td>
              <td>
                {{(chData.wxRate === null || chData.wxRate === undefined) ? '暂无' : chData.wxRate+'%'}}
              </td>
            </tr>
            <tr>
              <td>进件状态</td>
              <td>
                <span v-if="chData && chData.status > -5">{{['未知','审核中','审核通过','审核驳回','资料不齐全', '进件失败','商户验证'][Number(chData.status)-1]}}</span>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>进件结果</td>
              <td>
                {{chData.result || '暂无'}}
              </td>
            </tr>
            <tr>
              <td>提交时间</td>
              <td>
                {{chData.commitTime || '暂无'}}
              </td>
            </tr>
          </table>
        </div>
      </el-card>
    </div>
    <div v-show="activeName === '8'">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>富友通道</span>
        </div>
        <div>
          <table>
            <tr>
              <td>经营类目</td>
              <td v-if="detail.fuiouFirstMccCode">
                <div class="match-left-space text-right">{{detail.fuiouFirstMccCode}}/{{detail.fuiouSecondMccCode}}/{{detail.fuiouBusiness}}</div>
              </td>
              <td v-else>暂无</td>
            </tr>
            <tr>
              <td>商户营业地区补充</td>
              <td>{{detail.fuiouAreaName || '暂无'}}</td>
            </tr>

            <tr>
              <td>支付宝费率</td>
              <td>{{(detail.fuiouAliRate === null || detail.fuiouAliRate === undefined) ? '暂无' : detail.fuiouAliRate+'%'}}</td>
            </tr>
            <tr>
              <td>微信费率</td>
              <td>{{(detail.fuiouWxRate === null || detail.fuiouWxRate === undefined) ? '暂无' : detail.fuiouWxRate+'%'}}</td>
            </tr>
            <tr>
              <td>小微商户手持证件照</td>
              <td>
                <ImgShow :url="detail.inHandPicId"
                         v-if="detail.inHandPicId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>经营许可证</td>
              <td>
                <ImgShow :url="detail.businessCertPicId"
                         v-if="detail.businessCertPicId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
          </table>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>进件状态</span>
        </div>
        <div>
          <table>
            <tr>
              <td>商户编号</td>
              <td>{{fyData.fuiouMchntId || '暂无'}}</td>
            </tr>
            <tr>
              <td>注册名称</td>
              <td>{{fyData.fuiouRegisterName || '暂无'}}</td>
            </tr>
            <tr>
              <td>支付宝费率</td>
              <td>{{(fyData.fuiouAliRate === null || fyData.fuiouAliRate === undefined) ? '暂无' : fyData.fuiouAliRate+'%'}}</td>
            </tr>
            <tr>
              <td>微信费率</td>
              <td>{{(fyData.fuiouWxRate === null || fyData.fuiouWxRate === undefined) ? '暂无' : fyData.fuiouWxRate+'%'}}</td>
            </tr>
            <tr>
              <td>进件状态</td>
              <td>{{fyEntryStatus[fyData.entryStatus] || '暂无'}}</td>
            </tr>
            <tr>
              <td>进件结果</td>
              <td>{{fyData.fuiouCodeMesg || '暂无'}}</td>
            </tr>
            <tr>
              <td>提交时间</td>
              <td>{{fyData.commitTime || '暂无'}}</td>
            </tr>
          </table>
        </div>
      </el-card>
    </div>

	<div v-show="activeName === '9'">
	  <el-card class="box-card">
	    <div slot="header"
	         class="clearfix">
	      <span>中国银联通道</span>
	    </div>
	    <div>
	      <table>
	        <tr>
	          <td>经营类目</td>
	          <td v-if="detail.fuiouFirstMccCode">
	            <div class="match-left-space text-right">{{detail.fuiouFirstMccCode}}/{{detail.fuiouSecondMccCode}}/{{detail.fuiouBusiness}}</div>
	          </td>
	          <td v-else>暂无</td>
	        </tr>
	        <tr>
	          <td>商户营业地区补充</td>
	          <td>{{detail.fuiouAreaName || '暂无'}}</td>
	        </tr>

	        <tr>
	          <td>支付宝费率</td>
	          <td>{{(detail.fuiouAliRate === null || detail.fuiouAliRate === undefined) ? '暂无' : detail.fuiouAliRate+'%'}}</td>
	        </tr>
	        <tr>
	          <td>微信费率</td>
	          <td>{{(detail.fuiouWxRate === null || detail.fuiouWxRate === undefined) ? '暂无' : detail.fuiouWxRate+'%'}}</td>
	        </tr>
	        <tr>
	          <td>小微商户手持证件照</td>
	          <td>
	            <ImgShow :url="detail.inHandPicId"
	                     v-if="detail.inHandPicId"></ImgShow>
	            <span v-else>暂无</span>
	          </td>
	        </tr>
	        <tr>
	          <td>经营许可证</td>
	          <td>
	            <ImgShow :url="detail.businessCertPicId"
	                     v-if="detail.businessCertPicId"></ImgShow>
	            <span v-else>暂无</span>
	          </td>
	        </tr>
	      </table>
	    </div>
	  </el-card>
	  <el-card class="box-card">
	    <div slot="header"
	         class="clearfix">
	      <span>进件状态</span>
	    </div>
	    <div>
	      <table>
	        <tr>
	          <td>商户编号</td>
	          <td>{{fyData.fuiouMchntId || '暂无'}}</td>
	        </tr>
	        <tr>
	          <td>注册名称</td>
	          <td>{{fyData.fuiouRegisterName || '暂无'}}</td>
	        </tr>
	        <tr>
	          <td>支付宝费率</td>
	          <td>{{(fyData.fuiouAliRate === null || fyData.fuiouAliRate === undefined) ? '暂无' : fyData.fuiouAliRate+'%'}}</td>
	        </tr>
	        <tr>
	          <td>微信费率</td>
	          <td>{{(fyData.fuiouWxRate === null || fyData.fuiouWxRate === undefined) ? '暂无' : fyData.fuiouWxRate+'%'}}</td>
	        </tr>
	        <tr>
	          <td>进件状态</td>
	          <td>{{fyEntryStatus[fyData.entryStatus] || '暂无'}}</td>
	        </tr>
	        <tr>
	          <td>进件结果</td>
	          <td>{{fyData.fuiouCodeMesg || '暂无'}}</td>
	        </tr>
	        <tr>
	          <td>提交时间</td>
	          <td>{{fyData.commitTime || '暂无'}}</td>
	        </tr>
	      </table>
	    </div>
	  </el-card>
	</div>
<!--拉卡拉    todo 用的富友的参数-->
    <div v-show="activeName === '10'">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>拉卡拉通道</span>
        </div>
        <div>
          <table>
            <tr>
              <td>经营类目</td>
              <td v-if="detail.fuiouFirstMccCode">
                <div class="match-left-space text-right">{{detail.fuiouFirstMccCode}}/{{detail.fuiouSecondMccCode}}/{{detail.fuiouBusiness}}</div>
              </td>
              <td v-else>暂无</td>
            </tr>
            <tr>
              <td>商户营业地区补充</td>
              <td>{{detail.fuiouAreaName || '暂无'}}</td>
            </tr>

            <tr>
              <td>支付宝费率</td>
              <td>{{(detail.fuiouAliRate === null || detail.fuiouAliRate === undefined) ? '暂无' : detail.fuiouAliRate+'%'}}</td>
            </tr>
            <tr>
              <td>微信费率</td>
              <td>{{(detail.fuiouWxRate === null || detail.fuiouWxRate === undefined) ? '暂无' : detail.fuiouWxRate+'%'}}</td>
            </tr>
            <tr>
              <td>小微商户手持证件照</td>
              <td>
                <ImgShow :url="detail.inHandPicId"
                         v-if="detail.inHandPicId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>经营许可证</td>
              <td>
                <ImgShow :url="detail.businessCertPicId"
                         v-if="detail.businessCertPicId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
          </table>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>进件状态</span>
        </div>
        <div>
          <table>
            <tr>
              <td>商户编号</td>
              <td>{{fyData.fuiouMchntId || '暂无'}}</td>
            </tr>
            <tr>
              <td>注册名称</td>
              <td>{{fyData.fuiouRegisterName || '暂无'}}</td>
            </tr>
            <tr>
              <td>支付宝费率</td>
              <td>{{(fyData.fuiouAliRate === null || fyData.fuiouAliRate === undefined) ? '暂无' : fyData.fuiouAliRate+'%'}}</td>
            </tr>
            <tr>
              <td>微信费率</td>
              <td>{{(fyData.fuiouWxRate === null || fyData.fuiouWxRate === undefined) ? '暂无' : fyData.fuiouWxRate+'%'}}</td>
            </tr>
            <tr>
              <td>进件状态</td>
              <td>{{fyEntryStatus[fyData.entryStatus] || '暂无'}}</td>
            </tr>
            <tr>
              <td>进件结果</td>
              <td>{{fyData.fuiouCodeMesg || '暂无'}}</td>
            </tr>
            <tr>
              <td>提交时间</td>
              <td>{{fyData.commitTime || '暂无'}}</td>
            </tr>
          </table>
        </div>
      </el-card>
    </div>

    <!--手机pos-->
    <div v-show="activeName === '11'">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>手机pos通道</span>
        </div>
        <div>
          <table>
            <tr>
              <td>手机pos交易费率</td>
              <td>{{(detail.posTradeRate === null || detail.posTradeRate === undefined) ? '暂无' : detail.posTradeRate+'%'}}</td>
            </tr>
            <tr>
              <td>手机pos提现费</td>
              <td>{{(detail.posDrawFee === null || detail.posDrawFee === undefined) ? '暂无' : detail.posDrawFee}}</td>
            </tr>
            <tr>
              <td>网联交易费率</td>
              <td>{{(detail.quickTradeRate === null || detail.quickTradeRate === undefined) ? '暂无' : detail.quickTradeRate+'%'}}</td>
            </tr>
            <tr>
            <td>网联提现费</td>
            <td>{{(detail.quickDrawFee === null || detail.quickDrawFee === undefined) ? '暂无' : detail.quickDrawFee}}</td>
          </tr>
            <tr>
              <td>商户手持证件照</td>
              <td>
                <ImgShow :url="detail.holdingCardId"
                         v-if="detail.holdingCardId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>结算卡背面</td>
              <td>
                <ImgShow :url="detail.bankPhotoId"
                         v-if="detail.bankPhotoId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
          </table>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>进件状态</span>
        </div>
        <div>
          <table>
            <tr>
              <td>商户编号</td>
              <td>{{sjPosData.posMchId || '暂无'}}</td>
            </tr>
            <tr>
              <td>注册名称</td>
              <td>{{sjPosData.posRegisName || '暂无'}}</td>
            </tr>
            <tr>
              <td>手机pos交易费率</td>
              <td>{{(sjPosData.posTradeRate === null || sjPosData.posTradeRate === undefined) ? '暂无' : sjPosData.posTradeRate+'%'}}</td>
            </tr>
            <tr>
              <td>手机pos提现费</td>
              <td>{{(sjPosData.posDrawFee === null || sjPosData.posDrawFee === undefined) ? '暂无' : sjPosData.posDrawFee}}</td>
            </tr>
            <tr>
              <td>网联交易费率</td>
              <td>{{(sjPosData.quickTradeRate === null || sjPosData.quickTradeRate === undefined) ? '暂无' : sjPosData.quickTradeRate+'%'}}</td>
            </tr>
            <tr>
              <td>网联提现费</td>
              <td>{{(sjPosData.quickDrawFee === null || sjPosData.quickDrawFee === undefined) ? '暂无' : sjPosData.quickDrawFee}}</td>
            </tr>
            <tr>
              <td>进件状态</td>
              <td>{{entryStatus[sjPosData.entryStatus] || '暂无'}}</td>
            </tr>
            <tr>
              <td>进件结果</td>
              <td>{{sjPosData.posMsg || '暂无'}}</td>
            </tr>
            <tr>
              <td>提交时间</td>
              <td>{{sjPosData.commitTime || '暂无'}}</td>
            </tr>
          </table>
        </div>
      </el-card>
    </div>


    <!--开店宝通道-->
    <div v-show="activeName === '12'">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>开店宝通道</span>
        </div>
        <div>
          <table>
            <tr>
              <td>交易费率</td>
              <td>{{detail.kdbWxTradeRate ||  '--'}} %</td>
            </tr>
            <tr>
              <td>商户手持证件照</td>
              <td>
                <ImgShow :url="detail.holdingCardId"
                         v-if="detail.holdingCardId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>结算卡背面</td>
              <td>
                <ImgShow :url="detail.bankPhotoId"
                         v-if="detail.bankPhotoId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
          </table>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>进件状态</span>
        </div>
        <div>
          <table>
            <tr>
              <td>商户编号</td>
              <td>{{ kdbData.kdbMchId || '暂无' }}</td>
            </tr>


                <tr>
                  <td>卡支付渠道</td>
                  <td>{{ kdbKaStateText }}</td>
                </tr>
                <tr v-if="kdbKaMsgShow">
                  <td >失败原因</td>
                  <td>{{ kdbKaMsg }}</td>
                </tr>


              <tr>
                <td>支付宝支付渠道</td>
                <td>{{ kdbZfbStateText }}</td>
              </tr>
              <tr v-if="kdbZfbMsgShow">
                <td >失败原因</td>
                <td>{{ kdbZfbMsg }}</td>
              </tr>


                <tr>
                  <td>微信支付渠道</td>
                  <td>{{ kdbWxStateText }}</td>
                </tr>
                <tr v-if="kdbWxMsgShow">
                  <td >失败原因</td>
                  <td>{{ kdbWxMsg }}</td>
                </tr>


            <tr v-if="!kdbDetailShow">
              <td>进件结果</td>
              <td>{{ kdbData.kdbMsg }}</td>
            </tr>
            <tr>
              <td>提交时间</td>
              <td>{{ kdbData.commitTime || '暂无' }}</td>
            </tr>
          </table>
        </div>
      </el-card>
    </div>

    <!--畅捷通道-->
    <div v-show="activeName === '13'">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>畅捷通道</span>
        </div>
        <div>
          <table>
            <tr>
              <td>费率</td>
              <td>{{(detail.chanpayTradeRate === null || detail.chanpayTradeRate === undefined) ? '暂无' : detail.chanpayTradeRate+'%'}}</td>
            </tr>
            <tr>
              <td>商户手持证件照</td>
              <td>
                <ImgShow :url="detail.holdingCardId"
                         v-if="detail.holdingCardId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>结算卡背面</td>
              <td>
                <ImgShow :url="detail.bankPhotoId"
                         v-if="detail.bankPhotoId"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
          </table>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>进件状态</span>
        </div>
        <div>
          <table>
            <tr>
              <td>商户编号</td>
              <td>{{cjData.chanpayMchId || '暂无'}}</td>
            </tr>
            <tr>
              <td>进件状态</td>
              <td>{{entryStatus[cjData.entryStatus] || '暂无'}}</td>
            </tr>
            <tr>
              <td>进件结果</td>
              <td>{{cjData.chanpayMsg || '暂无'}}</td>
            </tr>
            <tr>
              <td>提交时间</td>
              <td>{{cjData.commitTime || '暂无'}}</td>
            </tr>
          </table>
        </div>
      </el-card>
    </div>

    <!--修改结算费率-->
    <el-dialog class="vm-dialog vm-dialog-body-top-10px"
               title="费率修改"
               width="400px"
               v-if="dialogRate.show"
               :visible.sync="dialogRate.show">
      <changeRate :propsInfo="dialogRate"
                  @refresh="initMounted"></changeRate>
    </el-dialog>
  </div>
</template>

<script>
// import {detail} from '@/modules/merchant/agent/api/merchantInfo'
// import {returnThumbnailUrl, returnFilesUrl, uploadUrl} from '@/modules/file/api/upload'
import * as detailApi from '../api/detail.js'
import ImgShow from '@/components/imgShow/index'
import ChangeRate from './components/detailChangeRate.vue'
import { getSystemCOnfig } from '@/modules/pay/api/pay_config'
export default {
  name: 'detail',
  components: {
    ImgShow,
    ChangeRate
  },
  data() {
    return {
      activeName: '1',
      loading: true,
      detail: {},
      sxfData: '',
      wxData: '',
      lsData: '',
      ysData: '',
      chData: '',
      fyData: '',
      zfbData: '',
      sjPosData: '',
      kdbData: '',
      cjData:'',
      data: '',
      sellCheck: [],
      sellScene_offline: false,
      sellScene_wxapp: false,
      sellScene_wxapp_mini: false,
      sellScene_website: false,
      sellScene_app: false,
      showImgDialog: {
        show: false,
        url: ''
      },
      dialogRate: {
        show: false
      },
      payConfig: [],
      fyEntryStatus: {
        '-1': '进件失败',
        1: '待进件',
        2: '进件审核中',
        3: '进件成功'
      },
      entryStatus: {
        '-1': '进件失败',
        1: '待进件',
        2: '进件审核中',
        3: '进件成功'
      },
      //开店宝枚举
      kdbEnum: {
        kdbMsg:{
          wayType:{
            1:'卡支付渠道',
            7:'支付宝支付渠道',
            8:'微信支付渠道'
          },
          state:{
            1: '审核通过',
            2: '审核失败',
            3: '审核中'
          }
        }
      },
      kdbKaStateText:'',
      kdbKaMsg:'',
      kdbKaShow: false,
      kdbKaMsgShow: false,
      kdbZfbStateText:'',
      kdbZfbMsg:'',
      kdbZfbShow: false,
      kdbZfbMsgShow: false,
      kdbWxStateText:'',
      kdbWxMsg:'',
      kdbWxShow: false,
      kdbWxMsgShow: false,
      kdbDetailShow: false
    }
  },
  mounted() {
    this.id = this.$route.query.id // 接收ID
    if (!this.id) {
      this.$message.warning('详情id错误，请重试')
      return
    }
    this.initMounted()
    this.getSystemCOnfigInfo()
  },
  methods: {
  isJson(str) {
    if (typeof str == 'string') {
      try {
        var obj = JSON.parse(str);
        if (typeof obj == 'object' && obj) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.log('error：' + str + '!!!' + e);
        return false;
      }
    }
    console.log('It is not a string!')
  },
    /**
     * 获取通道配置列表
     * */
    getSystemCOnfigInfo() {
      getSystemCOnfig().then(res => {
        this.payConfig = [...res.obj]
      })
    },
    initMounted() {
      // 获取本{{levelAlias.firstName}}详情
      this.getDetail(this.id)
      this.wxList = this.$route.query.list ? JSON.parse(this.$route.query.list) : []
      this.wxList.forEach(item => {
        this.getWxOrsxfcode(item)
      })
    },
    handleClick(tab, event) {
      this.activeName = tab.name
    },
    /**
     * 获取进件详情
     * */
    getDetail(id) {
      let params = {
        id
      }
      detailApi.getFeedDetail(params).then(res => {
        res.obj.accountHolder = res.obj.accountHolder || res.obj.contact
        let proArr = res.obj.pro ? res.obj.pro.split(';') : []
        this.$set(res.obj, 'proArr', proArr)
        // res.obj.pro = res.obj.pro ? res.obj.pro.split(';') : []
        this.detail = Object.assign({}, this.detail, res.obj)
      })
    },
    /**
     * 获取进件状态
     * */
    getWxOrsxfcode(item) {
      if (item.channel === 2) { // 微信
        detailApi.getWxcode({ merDetailId: item.id }).then(res => {
          this.wxData = res.obj
          console.log(res)
        })
      } else if (item.channel === 1) { // 随行付
        detailApi.getSxfcode({ id: item.id }).then(res => {
          this.sxfData = res.obj
          console.log(res)
        })
      } else if (item.channel === 3) { // 乐刷
        detailApi.getLsCode({ id: item.id }).then(res => {
          this.lsData = res.obj
          console.log(res)
        })
      } else if (item.channel === 4) { // 威富通
        detailApi.getYsCode({ id: item.id }).then(res => {
          this.ysData = res.obj
          console.log(res)
        })
      } else if (item.channel === 5) { // 传化
        detailApi.getChCode({ id: item.id }).then(res => {
          this.chData = res.obj
          console.log(res)
        })
      } else if (item.channel === 6) { // 富友
        detailApi.getFyCode({ id: item.id }).then(res => {
          this.fyData = res.obj
          console.log(res)
        })
      } else if (item.channel === 7) { // 支付宝
        detailApi.getZfbCode({ id: item.id }).then(res => {
          this.zfbData = res.obj
          console.log(res)
        })
      }else if (item.channel === 10) { // 手机pos          8：银联   9：拉卡拉
        detailApi.getSjPosCode({ id: item.id }).then(res => {
          this.sjPosData = res.obj
          // this.sjPosData.posTradeRate = this.sjPosData.posTradeRate*100
          // this.sjPosData.quickTradeRate = this.sjPosData.quickTradeRate*100
          console.log(res)
        })
      }else if (item.channel === 11) { // 开店宝
        detailApi.getKdbCode({ id: item.id }).then(res => {
          this.kdbData = res.obj
          let jsonFlag= false
          jsonFlag = this.isJson(this.kdbData.kdbMsg)
          // console.log('this.kdbData0000000000',this.kdbData)
          if(jsonFlag){
            this.kdbData.kdbMsg = JSON.parse(this.kdbData.kdbMsg)
          }
          this.kdbData.jsonFlag = jsonFlag
          // this.kdbData.kdbMsg = JSON.parse(this.kdbData.kdbMsg)
          // console.log('this.kdbData11111111111',this.kdbData)
          this.kdbMsgHandle(this.kdbData)
          // console.log('开店宝进件info==================',res)
        })
      }else if (item.channel === 12) { // 畅捷
        detailApi.getCjCode({ id: item.id }).then(res => {
          this.cjData = res.obj
          // console.log('this.cjData0000000000',this.cjData)
          // this.cjData.cjMsg = this.cjData.cjMsg
          // console.log('this.cjData11111111111',this.cjData)
          // this.cjMsgHandle(this.cjData)
          // console.log('开店宝进件info==================',res)
        })
      }
    },
    openLink(url) {
      window.open(url)
    },
    goback: function () {
      this.$router.go('-1')
    },
    /**
     * 修改费率
     * */
    changeRate(type, rate, channel) {
      this.dialogRate = {
        show: true,
        type: type,
        rate: rate,
        channel: channel,
        detail: this.detail
      }
    },
    /*
     showImg (url) {
     url = url || ''
     let urls = returnFilesUrl(url)
     this.showImgDialog = {
     show: true,
     url: urls
     }
     },
    getDetail: function (id) {
      detail(id).then(res => {
        console.log(res)
        let newData = Object.assign({}, res.obj)
        newData.wxRate = Number(newData.wxRate) >= 0 ? (Number(newData.wxRate) * 100).toFixed(2) + '%' : '*'
        newData.zfbRate = Number(newData.zfbRate) >= 0 ? (Number(newData.zfbRate) * 100).toFixed(2) + '%' : '*'
        newData.sxfWxRate = Number(newData.sxfWxRate) >= 0 ? (Number(newData.sxfWxRate) * 100).toFixed(2) + '%' : '*'
        newData.sxfZfbRate = Number(newData.sxfZfbRate) >= 0 ? (Number(newData.sxfZfbRate) * 100).toFixed(2) + '%' : '*'
        newData.fyWxRate = Number(newData.fyWxRate) >= 0 ? (Number(newData.fyWxRate) * 100).toFixed(2) + '%' : '*'
        newData.fyZfbRate = Number(newData.fyZfbRate) >= 0 ? (Number(newData.fyZfbRate) * 100).toFixed(2) + '%' : '*'
        this.data = newData
        this.sellCheck = JSON.parse(res.obj.sellCheck)
        this.showSell()
        this.loading = false
      }).catch(e => {

      })
    },
    */
    /**
     *显示不同售卖场景下的表单
     */
    showSell: function () {
      let select = this.sellCheck
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
    /**
     * 工具
     * @param ts 时间戳
     * @returns {string} 格式化事时间
     */
    // 时间格式化
    format(ts) {
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
    add0(m) {
      return m < 10 ? '0' + m : m
    },
    kdbMsgHandle(kdbData){
      if(kdbData.jsonFlag ){
        this.kdbDetailShow = true;
      }else {
        this.kdbDetailShow = false;
        return //这代表kdbData.kdbMsg不是json，不需要下方的json处理
      }

      let msgArr = kdbData.kdbMsg
      for(let i=0;i<msgArr.length;i++){
        if(msgArr[i].wayType === 1){

          this.kdbKaStateText = this.kdbEnum.kdbMsg.state[msgArr[i].state]
          this.kdbKaMsg = msgArr[i].message
          this.kdbKaShow = true;
          if(msgArr[i].state === 2){
            this.kdbKaMsgShow = true
          }
        }else if(msgArr[i].wayType === 7){
          this.kdbZfbStateText = this.kdbEnum.kdbMsg.state[msgArr[i].state]
          this.kdbZfbMsg = msgArr[i].message
          this.kdbZfbShow = true;
          if(msgArr[i].state === 2){
            this.kdbZfbMsgShow = true
          }
        }else if(msgArr[i].wayType === 8){
          this.kdbWxStateText = this.kdbEnum.kdbMsg.state[msgArr[i].state]
          this.kdbWxMsg = msgArr[i].message
          this.kdbWxShow = true;
          if(msgArr[i].state === 2){
            this.kdbWxMsgShow = true
          }
        }
      }
    }
  },
  filters: {
    representativeTypeFil: function (val) {
      let v = parseInt(val)
      let txt = ''
      switch (v) {
        case 1:
          txt = '法人'
          break
        case 2:
          txt = '经办人'
          break
        default:
          break
      }
      return txt
    },
    certificateFil: function (val) {
      let v = parseInt(val)
      let txt = ''
      switch (v) {
        case 1:
          txt = '身份证'
          break
        case 2:
          txt = '护照'
          break
        default:
          break
      }
      return txt
    }
  }
}
</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
}

table > tr {
  height: 60px;
  font-size: 14px;
}

table > tr > td:nth-child(1) {
  color: #808080;
  width: 200px;
  text-align: right;
  padding: 0 20px 0 0;
}

table > tr > td:nth-child(1):after {
  content: '：';
}

table > tr > td:nth-child(2) {
  color: #5b5b5b;
  letter-spacing: 1px;
}
</style>
