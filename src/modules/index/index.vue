<template>
  <div
    class="app-container index-page"
    v-loading="loading"
  >
    <div class="header_bar mb20">
      <div
        class="box-card"
        style="width:55%"
      >
        <div class="public_news">
          <!-- 表头 -->
          <div class="title_bar">
            <span class="title_bar_text">数据概览</span>
          </div>
          <div class="box-content">
            <div
              class="flex-center"
              style="padding-top:16px;"
            >
              <div
                class="border-right"
                v-if="userType=='undefined'"
              >
                <div class="total_title">{{levelAlias.oemName}}</div>
                <div class="total_num">{{dataViews.oemNum || 0}}</div>
              </div>
              <div
                class="border-right"
                v-if="userType=='1' || userType=='2' || userType=='3' || userType=='4'"
              >
                <div class="total_title">本月交易额</div>
                <div class="total_num">￥{{dataViews.transactionMoney || 0}}</div>
              </div>
              <div
                class="border-right"
                v-if="userType=='4'"
              >
                <div class="total_title">总交易数</div>
                <div class="total_num">{{dataViews.transactiontNum || 0}}</div>
              </div>
              <div
                class="border-right"
                v-if="userType=='2' || userType=='3' || userType=='4'"
              >
                <div class="total_title">佣金总额</div>
                <div class="total_num">￥{{dataViews.commissionMoney || 0}}</div>
              </div>
              <div
                class="border-right"
                v-if="userType=='undefined'||userType=='1'"
              >
                <div class="total_title">{{levelAlias.firstName}}</div>
                <div class="total_num">{{dataViews.firstAgentNum || 0}}</div>
              </div>
              <div
                class="border-right"
                v-if="userType=='undefined'||userType=='1'||userType=='2'"
              >
                <div class="total_title">{{levelAlias.secondName}}</div>
                <div class="total_num">{{dataViews.secondAgentNum || 0}}</div>
              </div>
              <div
                class="border-right"
                v-if="userType!='4'"
              >
                <div class="total_title">{{levelAlias.thirdName}}</div>
                <div class="total_num">{{dataViews.thirdAgentNum || 0}}</div>
              </div>
              <div class="border-right">
                <div class="total_title">总商户数</div>
                <div class="total_num">{{dataViews.merchantNum || 0}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--平台总交易额-->
      <div
        class="box-card ml20"
        style="width:43.8%"
        v-if="userType=='undefined'"
      >
        <div class="public_news">
          <!-- 表头 -->
          <div class="title_bar">
            <span class="title_bar_text">平台总交易额</span>
          </div>
          <div class="box-content">
            <span class="color-blue total-price-unit">￥</span>
            <span class="color-blue total-price">{{dataViews.transactionMoney || 0}}</span>
          </div>
        </div>
      </div>

      <!--公告-->
      <div
        class="box-card ml20"
        style="width:43.8%"
        v-if="userType==1 || userType==2 || userType==3 || userType==4"
      >
        <div class="public_news">
          <!-- 表头 -->
          <div class="title_bar">
            <span class="title_bar_text">最新公告</span>
            <span
              class="notice-more"
              @click="toMoreList"
            >更多></span>
          </div>
          <div class="box-content">
            <div v-if='noticeList.length'>
              <div
                class="flex-center notice-li"
                v-for="item in noticeList"
                :key="item.id"
              >
                <div class="flex-1 notice-text">[{{item.title}}]</div>
                <div class="notice-time">{{item.updateTime}}</div>
              </div>
            </div>
            <div
              v-else
              class="flex-center notice-li"
            >
              <div class="flex-1 notice-text">暂无最新公告</div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="header_bar mb20">
      <!--交易数据-->
      <div class="box-card flex-1">
        <div class="public_news">
          <!-- 表头 -->
          <div class="title_bar">
            <span class="title_bar_text">交易数据</span>
            <div class="flex">
              <!--日期选择-->
              <div class="mr20">
                <el-date-picker
                  @change="checkDataRange"
                  v-model="searchForm.days"
                  :default-time="['00:00:00', '23:59:59']"
                  :picker-options="pickerOptions"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="yyyy - MM - dd "
                  value-format="timestamp"
                  style="width: 250px!important;"
                  :clearable="false"
                  size="small">
                </el-date-picker>
              </div>
              <!--选项条-->
              <div class="block">
                <el-radio-group
                  v-model="searchDays"
                  size="small"
                  @change="changeDays($event)"
                >
                  <el-radio-button :label="0">昨天</el-radio-button>
                  <el-radio-button :label="1">3天</el-radio-button>
                  <el-radio-button :label="2">7天</el-radio-button>
                  <el-radio-button :label="3">15天</el-radio-button>
                  <el-radio-button :label="4">30天</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </div>
          <div class="box-content">
            <div class="flex-center"
              style="padding-top:16px;">
              <div class="border-right">
                <div class="total_title">交易金额</div>
                <div class="total_num">￥{{cardData.transactionMoney || 0}}</div>
              </div>
              <div class="border-right">
                <div class="total_title">交易笔数</div>
                <div class="total_num">{{cardData.transactionCount || 0}}</div>
              </div>
              <div class="border-right">
                <div class="total_title">退款金额</div>
                <div class="total_num">￥{{cardData.refundMoney || 0}}</div>
              </div>
              <div class="border-right">
                <div class="total_title">退款笔数</div>
                <div class="total_num">{{cardData.refundCount || 0}}</div>
              </div>
              <div class="border-right">
                <div class="total_title">实际营收</div>
                <div class="total_num">￥{{cardData.actualMoney || 0}}</div>
              </div>
              <div class="border-right"
                v-if="userType!='undefined' && (level === '1' || level === 1)">
                <div class="total_title">我的佣金</div>
                <div class="total_num">￥{{cardData.commissionMoney || 0}}</div>
              </div>
              <div class="border-right"
                v-if="userType=='undefined'">
                <div class="total_title">支付宝交易笔数</div>
                <div class="total_num">{{cardData.zfbPayTimes || 0}}</div>
              </div>
              <div class="border-right"
                v-if="userType=='undefined'">
                <div class="total_title">微信支付交易笔数</div>
                <div class="total_num">{{cardData.wxPayTimes || 0}}</div>
              </div>
              <div class="border-right"
                v-if="userType=='undefined'">
                <div class="total_title">其他支付交易笔数</div>
                <div class="total_num">{{cardData.ohterPayTimes || 0}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--快捷入口-->
      <div class="box-card ml20" v-if="(userType==1 || userType==2 || userType==3 || userType==4) && (powerObj.first || powerObj.secend || powerObj.third || powerObj.merchant || powerObj.staff)" style="flex:none">
        <div class="public_news">
          <!-- 表头 -->
          <div class="title_bar">
            <span class="title_bar_text">快捷入口</span>
          </div>
          <div class="box-content">
            <el-button type="warning" size="mini" v-if="userType==1 && powerObj.first" @click="toFirstPage">新增{{levelAlias.firstName}}</el-button>
            <el-button type="warning" size="mini" v-if="userType==2 && powerObj.secend" @click="toSecondPage">新增{{levelAlias.secondName}}</el-button>
            <el-button type="warning" size="mini" v-if="userType==3 && powerObj.third" @click="toThirdPage">新增{{levelAlias.thirdName}}</el-button>
            <el-button type="primary" size="mini" v-if="(userType==2 || userType==3 || userType==4)&& powerObj.merchant" @click="toNewMerchantPage">新增商户</el-button>
            <el-button type="primary" size="mini" @click="toNewStaff" v-if="powerObj.staff">新增员工</el-button>
          </div>
        </div>
      </div>
    </div>

    <!--图标绘制-->
    <div class="middle_chart">
      <div
        class="box-card chart_card mr20"
        style="width:55%"
      >
        <!-- 表头 -->
        <div class="title_bar">
          <span class="title_bar_text">数据统计</span>
          <!--日期选择-->
          <el-date-picker
            @change="changeTotalRange"
            v-model="searchTotal.days"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy - MM - dd "
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptions"
            value-format="timestamp"
            :clearable="false"
            style="width: 250px!important;"
            size="small"
            prefix-icon=""
          >
          </el-date-picker>
        </div>
        <div class="box-content">
          <!--选项条-->
          <el-radio-group
            class="list-absolute"
            v-model="statisticalWay"
            size="small"
            @change="changeWayCharts"
          >
            <el-radio-button
              :label="5"
              v-if="userType!='undefined' && (level === '1' || level === 1)"
            >我的佣金</el-radio-button>
            <el-radio-button :label="1">交易金额</el-radio-button>
            <el-radio-button :label="2">交易笔数</el-radio-button>
            <el-radio-button :label="3">退款金额</el-radio-button>
            <el-radio-button :label="4">退款笔数</el-radio-button>
          </el-radio-group>
          <div
            class="content"
            id="dataStatistical"
            v-loading="chartLoading"
            element-loading-text="没有数据"
            element-loading-spinner="el-icon-s-release"
            element-loading-background="rgba(255, 255, 255, 0.8)"
            style="height: 340px;"
          ></div>
        </div>
      </div>

      <div
        class="box-card chart_card"
        style="width:43.8%"
      >
        <!-- 表头 -->
        <div class="title_bar">
          <span class="title_bar_text"
            v-if="userType=='undefined'||userType==1">支付通道占比</span>
          <span class="title_bar_text"
            v-else>业务员发展商户占比</span>
          <!--日期选择-->
          <el-date-picker
            @change="checkPercentRange"
            v-model="searchPercent.days"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy - MM - dd "
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptions"
            :clearable="false"
            style="width: 250px!important;"
            size="small"
            prefix-icon=""
            v-if="userType=='undefined'||userType==1">
          </el-date-picker>
        </div>
        <div class="box-content">
          <!--选项条-->
          <el-radio-group
            class="list-absolute"
            v-model="payWayPercent"
            size="small"
            @change="changeWayChartsPercent"
            v-if="userType=='undefined'||userType==1">
            <el-radio-button :label="1">交易金额</el-radio-button>
            <el-radio-button :label="2">交易笔数</el-radio-button>
          </el-radio-group>
        </div>
        <div
          id="payPercent"
          ref="salemanRef"
          class="content mt40"
          v-loading="rightDataNull"
          element-loading-text="没有数据"
          element-loading-spinner="el-icon-view"
          element-loading-background="rgba(255, 255, 255, 1)"
          style="height: 354px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { findCountData, getChartData, getChartPercentData, getDataView } from './api/index.js'
import * as noticeApi from '@/modules/notice/api/notice'
import echartResizeMixin from './mixin/echartResizeMixin.js'
import indexMixins from './mixin/indexMixins.js'
import { levelAliasMixin } from '@/mixins'
import {mapGetters} from 'vuex'

export default {
  mixins: [echartResizeMixin, indexMixins, levelAliasMixin],
  components: {},
  name: 'index2',
  data() {
    return {
      loading: true, // 加载转圈
      noticeList: [],
      userType: '',
      level: '',
      companyId: '',
      // cardData: [],
      chartLoading: true,
      statisticalWay: 1, // 统计数据方式
      payWayPercent: 1,
      cardData: {
        commissionAmount: '1',
        customerPaidAmount: '0',
        discountAmount: '0',
        orderAmount: '0',
        orderNum: '0',
        refundAmount: '0',
        refundNum: '0',
        validDealAmount: '0'
      }, // 交易数据
      leftDataNull: true,
      rightDataNull: true,
      searchDays: '1', // 搜索天数
      searchForm: {
        days: [] // 日期
      },
      searchTotal: {
        days: [] // 日期 数据统计
      },
      searchPercent: {
        days: [] // 日期 支付通道占比
      },
      dataViews: {}, // 数据概览
      filterTimeArr: [
        { startTime: '', endTime: '', day: -1 },
        { startTime: '', endTime: '', day: 3 },
        { startTime: '', endTime: '', day: 7 },
        { startTime: '', endTime: '', day: 15 },
        { startTime: '', endTime: '', day: 30 }
      ], // 昨天 3天 7天 15天 30天 时间戳集合(有序)
      pickerOptions: {
        onPick: ({maxDate, minDate}) => {
          self.pickerMinDate = minDate.getTime()
          if (maxDate) {
            self.pickerMinDate = ''
          }
          console.log(self.pickerMinDate)
        },
        disabledDate (time) {
          let date = new Date()
          date.setHours(23)
          date.setMinutes(59)
          date.setSeconds(59)
          let status = time.getTime() < date.getTime() + 1
          if (self.pickerMinDate) {
            const day31 = 31 * 24 * 3600 * 1000
            let maxTime = self.pickerMinDate + day31
            let minTime = self.pickerMinDate - day31
            if (maxTime > date.getTime()) {
              maxTime = date.getTime()
            }
            if ((time.getTime() < maxTime) && (time.getTime() > minTime) && status) {
              return false
            } else {
              return true
            }
          } else {
            return !status
          }
        }
      }
    }
  },
  mounted () {
    this.loading = false
    this.userType = sessionStorage.getItem('userType')
    this.level = sessionStorage.getItem('level')
    this.companyId = sessionStorage.getItem('companyId')
    console.log('用户类型：userType', this.userType)
    if (
      this.userType === '1' ||
      this.userType === '2' ||
      this.userType === '3' ||
      this.userType === '4'
    ) {
      if (this.level === 1 || this.level === '1') {
        this.statisticalWay = 5
      }
      this.getNoticeList()
    }
    this.setFilterTimeArr()
    this.getDataViewList() // 数据概览

    // 默认查询
    this.defaultSearch() // 交易数据
    this.defaultSearchTotal(this.statisticalWay) // 默认查询数据统计
    this.defaultSearchPercent(1)
  },
  methods: {
    toMoreList () {
      this.$router.push({ path: '/notice/views/index' })
    },
    // 跳转新增{{levelAlias.firstName}}页面
    toFirstPage () {
      this.$router.push({ path: '/operator/views/operaList' })
    },

    // 跳转新增{{levelAlias.secondName}}页面
    toSecondPage () {
      this.$router.push({ path: '/distribute/agent/views/distributeList' })
    },
    // 跳转新增{{levelAlias.thirdName}}页面
    toThirdPage () {
      this.$router.push({ path: '/thirdAgent/views/distributeList' })
    },

    // 新增商户界面
    toNewMerchantPage () {
      this.$router.push({ path: '/merchant/top/views/merchant' })
    },

    // 跳转新增员工界面
    toNewStaff () {
      this.$router.push({ path: '/manager/views/manager' })
    },
    // 获取数据概览
    getDataViewList () {
      getDataView(this.companyId).then(res => {
        this.dataViews = res.obj
      })
    },
    /**
     * 切换数据统计方式
     */
    changeWayCharts (val) {
      this.defaultSearchTotal(val)
    },

    changeWayChartsPercent (val) {
      this.defaultSearchPercent(val)
    },

    /**
     * 第一次默认查询
     */
    defaultSearch () {
      // 设定7天日期//2
      this.changeDays(1)
    },
    defaultSearchTotal (type) {
      // 设定7天日期//2
      this.changeTotalDays(type)
    },
    defaultSearchPercent (type) {
      // 设定7天日期//2
      this.changePercentDays(type)
    },
    changeTotalDays (type) {
      let timestamp = new Date().getTime()
      let startTime = timestamp - 24 * 60 * 60 * 1000 * 6
      let endTime = timestamp
      this.$set(this.searchTotal.days, 0, startTime)
      this.$set(this.searchTotal.days, 1, endTime)
      let st = this.format(this.searchTotal.days[0]) || ''
      let et = this.format(this.searchTotal.days[1]) || ''
      // 获取卡片数据
      this.getChartData(st, et, type)
    },
    changePercentDays (type) {
      let timestamp = new Date().getTime()
      let startTime = timestamp - 24 * 60 * 60 * 1000 * 6
      let endTime = timestamp
      this.$set(this.searchPercent.days, 0, startTime)
      this.$set(this.searchPercent.days, 1, endTime)
      let st = this.format(this.searchPercent.days[0]) || ''
      let et = this.format(this.searchPercent.days[1]) || ''
      // 获取卡片数据
      this.getChartPercentData(st, et, type)
    },

    //
    setFilterTimeArr () {
      let date = new Date()
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)
      let timestamp = date.getTime()
      this.filterTimeArr.forEach((item, index) => {
        if (item.day === -1) {
          this.filterTimeArr[0].startTime = timestamp - 24 * 60 * 60 * 1000 * 1
          this.filterTimeArr[0].endTime = timestamp - 24 * 60 * 60 * 1000 * 1
        } else {
          this.filterTimeArr[index].startTime = timestamp - 24 * 60 * 60 * 1000 * (item.day - 1)
          this.filterTimeArr[index].endTime = timestamp
        }
      })
    },

    /**
     * 快捷方式修改日期
     * @param event 日期范围选项
     */
    changeDays: function (event) {
      let timestamp = new Date().getTime()
      if (event === 0) {
        // 昨天
        let startTime = timestamp - 24 * 60 * 60 * 1000 * 1
        let endTime = timestamp - 24 * 60 * 60 * 1000 * 1
        this.$set(this.searchForm.days, 0, startTime)
        this.$set(this.searchForm.days, 1, endTime)
      } else if (event === 1) {
        // 3天
        let startTime = timestamp - 24 * 60 * 60 * 1000 * 2
        let endTime = timestamp
        this.$set(this.searchForm.days, 0, startTime)
        this.$set(this.searchForm.days, 1, endTime)
      } else if (event === 2) {
        // 7天
        let startTime = timestamp - 24 * 60 * 60 * 1000 * 6
        let endTime = timestamp
        this.$set(this.searchForm.days, 0, startTime)
        this.$set(this.searchForm.days, 1, endTime)
      } else if (event === 3) {
        // 15天
        let startTime = timestamp - 24 * 60 * 60 * 1000 * 14
        let endTime = timestamp
        this.$set(this.searchForm.days, 0, startTime)
        this.$set(this.searchForm.days, 1, endTime)
      } else if (event === 4) {
        // 30天
        let startTime = timestamp - 24 * 60 * 60 * 1000 * 30
        let endTime = timestamp
        this.$set(this.searchForm.days, 0, startTime)
        this.$set(this.searchForm.days, 1, endTime)
      }
      // 获取卡片数据
      this.findCountData()
    },
    /**
     *检查时间
     * 如果不对，则修改为里结束日期的前31天。
     * 数据统计
     */
    changeTotalRange () {
      let timestamp = new Date().getTime()
      let startTime = this.searchTotal.days[0]
      let endTime = this.searchTotal.days[1]
      let date = new Date()
      date.setHours(23)
      date.setMinutes(59)
      date.setSeconds(59)
      let todayTimes = date.getTime()
      if (endTime - startTime > 24 * 60 * 60 * 1000 * 31) {
        this.$message.error('前后时间不能超过31天')
        this.$set(this.searchTotal.days, 0, timestamp - 24 * 60 * 60 * 1000 * 31)
        this.$set(this.searchTotal.days, 1, timestamp)
      } else if (endTime > todayTimes) {
        this.$message.error('日期不能大于当天')
        this.$set(this.searchTotal.days, 1, timestamp)
      }
      let st = this.format(this.searchTotal.days[0]) || ''
      let et = this.format(this.searchTotal.days[1]) || ''
      this.getChartData(st, et, this.statisticalWay)
    },
    getNoticeList () {
      let type = null
      let createType = null
      type = this.userType ? this.userType : null
      if (this.userType === '1') {
        createType = 1
      } else if (this.userType === 'undefined') {
        // this.params.createType = '1'
      } else {
        createType = '3'
      }
      let params = {
        type,
        pageNumber: 1,
        pageSize: 3,
        createType
      }
      noticeApi.getNoticeList(params).then(res => {
        if (res.obj) {
          this.noticeList = res.obj.content
        }
      })
    },
    checkPercentRange () {
      let timestamp = new Date().getTime()
      let startTime = this.searchPercent.days[0]
      let endTime = this.searchPercent.days[1]
      let date = new Date()
      date.setHours(23)
      date.setMinutes(59)
      date.setSeconds(59)
      let todayTimes = date.getTime()
      if (endTime - startTime > 24 * 60 * 60 * 1000 * 31) {
        this.$message.error('前后时间不能超过31天')
        this.$set(this.searchPercent.days, 0, timestamp - 24 * 60 * 60 * 1000 * 31)
        this.$set(this.searchPercent.days, 1, timestamp)
      } else if (endTime > todayTimes) {
        this.$message.error('日期不能大于当天')
        this.$set(this.searchPercent.days, 1, timestamp)
      }
      let st = this.format(this.searchPercent.days[0]) || ''
      let et = this.format(this.searchPercent.days[1]) || ''
      this.getChartPercentData(st, et, this.payWayPercent)
    },

    /**
     *检查时间
     * 如果不对，则修改为里结束日期的前31天。
     */
    checkDataRange () {
      // let timestamp = (new Date()).getTime()
      let date = new Date()
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)
      let timestamp = date.getTime()
      let startTime = this.searchForm.days[0]
      let endTime = this.searchForm.days[1]

      if (endTime - startTime > 24 * 60 * 60 * 1000 * 31) {
        this.$message.error('前后时间不能超过31天')
        this.$set(this.searchForm.days, 0, timestamp - 24 * 60 * 60 * 1000 * 31)
        this.$set(this.searchForm.days, 1, timestamp)
      } else if (endTime > (timestamp + 24 * 60 * 60 * 1000 - 1000)) {
        this.$message.error('日期不能大于当天')
        this.$set(this.searchForm.days, 1, timestamp)
      }
      startTime = this.searchForm.days[0]
      endTime = this.searchForm.days[1]
      // 时间改变时，动态设置tab选中和取消
      let searchDays = ''
      this.filterTimeArr.forEach((res, index) => {
        let flag = startTime === res.startTime && endTime === res.endTime
        if (flag) {
          searchDays = index
        }
      })
      this.searchDays = searchDays

      this.findCountData()
    },
    /**
     * 获取卡片数据 后 获取图表数据
     */
    findCountData: function () {
      let st = this.format(this.searchForm.days[0]) || ''
      let et = this.format(this.searchForm.days[1]) || ''

      findCountData(st, et, this.companyId)
        .then(res => {
          this.cardData = res.obj
          this.loading = false
        })
        .catch(e => {})
    },
    /**
     * 手动发起查询
     */
    submitSearch: function () {
      this.loading = true
      // 必须先查询卡片
      this.showCardData()
    },
    /**
     *
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
    },

    /**
     * 获取图表数据(数据统计)
     */
    getChartData: function (st, et, type) {
      // this.chartLoading = true
      getChartData(st, et, type, this.companyId)
        .then(res => {
          this.loading = false // 全页遮罩关闭
          let data = res.obj
          this.chartData = data // 赋值
          if (data && data.length) {
            this.chartLoading = false // 图表遮罩关闭
            this.drawDataTotal(this.chartData) // 调用绘制方法
          } else {
            this.chartLoading = true
          }
        })
        .catch(e => {
          this.$message.error('图表数据获取失败，请刷新重试')
        })
    },
    /***
     * 业务员发展商户占比
     * @param startTime
     * @param endTime
     * @param type
     */
    getChartPercentData (startTime, endTime, type) {
      let params = {
        companyId: this.companyId
      }
      if (this.userType === 'undefined' || this.userType === '1') {
        params = {
          startTime,
          endTime,
          type,
          companyId: this.companyId
        }
      }
      this.rightDataNull = true
      getChartPercentData(params)
        .then(res => {
          let data = res.obj
          this.loading = false // 全页遮罩关闭
          if (data && data.length) {
            this.rightDataNull = false // 图表遮罩关闭
            this.drawPayPercent(data, type)
          } else {
            this.rightDataNull = true
          }
        })
        .catch(e => {
          this.$message.error('图表数据获取失败，请刷新重试')
        })
    }
  },
  computed: {
    ...mapGetters([
      'powerObj'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../../assets/css/global.scss';
.app-container {
  background: #f2f2f2;
}
.mb20 {
  margin-bottom: rem(20px);
}
.mr20 {
  margin-right: rem(20px);
}
.ml20 {
  margin-left: rem(20px);
}
.app-container {
  padding: rem(20px);
}
.list-absolute {
  position: absolute;
  z-index: 2001;
  top: rem(24px);
}
.hide {
  display: none !important;
}
.flex {
  display: flex;
}
.flex-1 {
  flex: 1;
}
.flex-center {
  display: flex;
  text-align: center;
}
.total-price-unit {
  font-size: rem(30px);
}
.total-price {
  font-size: rem(50px);
}
.box-card {
  padding: rem(20px);
  background: #fff;
  flex: 1;
}
.box-content {
  position: relative;
  padding-top: rem(10px);
}
.box-content .content {
  margin-top: rem(14px);
}
.title_bar {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ddd;
  padding-bottom: rem(22px);
  font-size: rem(16px);
  color: #2c393f;
  align-items: center;
}
.title_bar_text {
  font-size: rem(16px);
  padding-left: rem(14px);
  border-left: rem(4px) solid #108ee9;
  flex: 1;
}
.header_bar {
  width: 100%;
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
  /* align-items: center; */
}

.header_left {
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header_left_top {
  width: 100%;
}

.header_right {
  width: 38%;
  margin-left: 2%;
}

/* 基本信息 */
.info-li {
  width: 50%;
  text-align: left;
  line-height: rem(35px);
}
.info-label {
  color: #57636f;
  font-size: rem(16px);
}
.info-value {
  color: #2c393f;
  font-size: rem(16px);
}

/* 公告 */
.notice-more {
  font-size: rem(14px);
  color: #bfbfbf;
  cursor: pointer;
}
.list_scroll {
  padding-top: rem(10px);
}
.notice-li {
  text-align: left;
  line-height: rem(35px);
}
.notice-text {
  padding-right: rem(40px);
  font-size: rem(14px);
  font-weight: bold;
  color: #2c393f;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*不换行*/
  text-overflow: ellipsis; /*超出部分文字以...显示*/
}
.notice-time {
  font-size: rem(16px);
  color: #8995a0;
}
/*数据简报*/
.totalData {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.total_item {
  text-align: center;
}

.total_title {
  font-size: rem(14px);
  color: #8995a0;
}

.total_num {
  padding: 0;
  margin-top: rem(15px);
  font-size: rem(18px);
  line-height: rem(20px);
  color: #2c393f;
}
.border-right {
  flex: 1;
  border-right: 1px solid #f2f2f2;
}
.box-content .border-right:last-child {
  border-right: none;
}

.column_line {
  height: rem(60px);
  width: 1px;
  background-color: #c1c1c1;
}

/*小工具*/
.header_left_bottom {
  margin-top: rem(20px);
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.header_left_bottom > div {
  width: 32%;
}

.tools_box {
  padding: rem(10px) 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.tools_img {
  width: 30%;
  text-align: left;
}

.tools_text {
  width: 70%;
  text-align: right;
}

.tools_text p {
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.tools_text p:nth-child(1) {
  font-size: rem(16px);
  color: #4fa2ff;
}

.tools_text p:nth-child(2) {
  font-size: rem(14px);
  color: #888;
}

/*最新通告*/
.public_news {
  /* height: 252px; */
}

.public_news_box {
  height: 100%;
}

/*图表*/
.middle_chart {
  margin-top: rem(20px);
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.chart_card {
  width: 49%;
}

.chart_img {
  width: 100%;
  /* height: 500px; */
  height: rem(300px);
}

/* @media (max-width: 1248px) {
    .header_bar {
      flex-direction: column;
    }

    .header_left {
      width: 100%;
    }

    .header_right {
      width: 100%;
      margin: 20px 0 0 0;
    }
  } */

@media (max-width: 768px) {
  .totalData {
    flex-direction: column;
  }

  .column_line {
    width: 80px;
    height: 1px;
  }

  .header_left_bottom {
    flex-direction: column;
  }

  .header_left_bottom > div {
    width: 100%;
    margin-bottom: 10px;
  }

  .tools_img {
    display: none;
  }

  .tools_text {
    width: 100%;
    text-align: center;
  }

  .middle_chart {
    width: 100%;
    flex-direction: column;
  }

  .chart_card {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
