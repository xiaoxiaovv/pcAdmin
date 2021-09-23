<template>
  <div class="app-container" v-loading="false">
    <!--头部搜索选项-->
    <div class="header_bar">
      <el-card class="box-card ">
        <div class="search_bar">
          <div>
            <div>
              <!--选项条-->
              <div class="block">
                <el-radio-group v-model="searchDays" size="small" @change="changeDays($event)">
                  <el-radio-button label="0">今日</el-radio-button>
                  <el-radio-button label="1">昨日</el-radio-button>
                  <el-radio-button label="2">近7日</el-radio-button>
                </el-radio-group>
              </div>
              <!--日期选择-->
              <div class="block">
                <el-date-picker
                  @change="checkDataRange"
                  v-model="searchForm.days"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="timestamp"
                  :clearable="false"
                  size="small">
                </el-date-picker>
              </div>
              <div class="block" >
                <el-input size="small" placeholder="请输入商户名搜索" v-model="searchForm.merchantName" clearable></el-input>
              </div>
            </div>
            <!--下方选项-->
          </div>
          <div>
            <el-button type="primary" size="small" @click="submitSearch" >搜索</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <!--中间卡片-->
    <div class="card_group">
      <!--订单金额-->
      <div class="card_item">
        <el-card class="box-card">
          <div class="text item tools_box">
            <div class="tools_img">
              <img src="../../../assets/images/datacenter/订单金额.png" alt="">
            </div>
            <div class="tools_text">
              <p>订单金额</p>
              <p>￥{{cardData.orderAmount}}</p>
            </div>
          </div>
        </el-card>
      </div>
      <!--订单数-->
      <div class="card_item">
        <el-card class="box-card">
          <div class="text item tools_box">
            <div class="tools_img">
              <img src="../../../assets/images/datacenter/订单数.png" alt="">
            </div>
            <div class="tools_text">
              <p>订单数</p>
              <p>{{cardData.orderNum}}</p>
            </div>
          </div>
        </el-card>
      </div>

      <!--退款金额-->
      <div class="card_item">
        <el-card class="box-card">
          <div class="text item tools_box">
            <div class="tools_img">
              <img src="../../../assets/images/datacenter/退款金额.png" alt="">
            </div>
            <div class="tools_text">
              <p>退款金额</p>
              <p>￥{{cardData.refundAmount}}</p>
            </div>
          </div>
        </el-card>
      </div>

      <!--订单数-->
      <div class="card_item">
        <el-card class="box-card">
          <div class="text item tools_box">
            <div class="tools_img">
              <img src="../../../assets/images/datacenter/订单数.png" alt="">
            </div>
            <div class="tools_text">
              <p>退款数</p>
              <p>{{cardData.refundNum}}</p>
            </div>
          </div>
        </el-card>
      </div>

      <!--有效交易基数-->
      <div class="card_item">
        <el-card class="box-card">
          <div class="text item tools_box">
            <div class="tools_img">
              <img src="../../../assets/images/datacenter/有效交易数.png" alt="">
            </div>
            <div class="tools_text">
              <p>有效交易基数</p>
              <p>{{cardData.validDealAmount}}</p>
            </div>
          </div>
        </el-card>
      </div>

      <!--佣金-->
      <div class="card_item">
        <el-card class="box-card">
          <div class="text item tools_box">
            <div class="tools_img">
              <img src="../../../assets/images/datacenter/佣金.png" alt="">
            </div>
            <div class="tools_text">
              <p>佣金</p>
              <p>￥{{cardData.commissionAmount || 0}}</p>
            </div>
          </div>
        </el-card>
      </div>

      <!--顾客实付-->
      <div class="card_item">
        <el-card class="box-card">
          <div class="text item tools_box">
            <div class="tools_img">
              <img src="../../../assets/images/datacenter/顾客实付.png" alt="">
            </div>
            <div class="tools_text">
              <p>顾客实付</p>
              <p>￥{{cardData.customerPaidAmount}}</p>
            </div>
          </div>
        </el-card>
      </div>

      <!--优惠金额-->
      <div class="card_item">
        <el-card class="box-card">
          <div class="text item tools_box">
            <div class="tools_img">
              <img src="../../../assets/images/datacenter/优惠金额.png" alt="">
            </div>
            <div class="tools_text">
              <p>优惠金额</p>
              <p>￥{{cardData.discountAmount}}</p>
            </div>
          </div>
        </el-card>
      </div>

    </div>

    <!--数据图表-->
    <div class="data_chart">

      <el-card class="box-card chart_card_left">
        <el-tabs class="left_tabs" v-model="leftActiveName" @tab-click="leftChangeTabs">
          <el-tab-pane label="订单" name="1">
            <div id="left_chart1" class="chart_img"
                 v-loading="leftDataNull"
                 element-loading-text="没有数据"
                 element-loading-spinner="el-icon-view"
                 element-loading-background="rgba(255, 255, 255, 1)">
            </div>
          </el-tab-pane>
          <el-tab-pane label="退款" name="2">
            <div id="left_chart2" class="chart_img"
                 v-loading="leftDataNull"
                 element-loading-text="没有数据"
                 element-loading-spinner="el-icon-view"
                 element-loading-background="rgba(255, 255, 255, 1)">
            </div>
          </el-tab-pane>
          <!--
          <el-tab-pane label="佣金" name="3">
            <div id="left_chart3" class="chart_img"
                 v-loading="leftDataNull"
                 element-loading-text="没有数据"
                 element-loading-spinner="el-icon-view"
                 element-loading-background="rgba(255, 255, 255, 1)">
            </div>
          </el-tab-pane>
          -->
        </el-tabs>
      </el-card>

      <el-card class="box-card chart_card_right">
        <el-tabs v-model="rightActiveName" @tab-click="rightChangeTabs">
          <el-tab-pane label="支付方式" name="1">
            <div id="right_chart1" class="chart_img"
                 v-loading="rightDataNull"
                 element-loading-text="没有数据"
                 element-loading-spinner="el-icon-view"
                 element-loading-background="rgba(255, 255, 255, 1)">
            </div>
          </el-tab-pane>
          <el-tab-pane label="终端比例" name="2">
            <div id="right_chart2" class="chart_img"
                 v-loading="rightDataNull"
                 element-loading-text="没有数据"
                 element-loading-spinner="el-icon-view"
                 element-loading-background="rgba(255, 255, 255, 1)">
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>

    </div>

    <!--流水表格-->
    <div class="flow_table">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>流水明细</span>
<!--          <el-button style="float: right; padding: 3px 0" type="text">导出</el-button>-->
        </div>
        <!--表格-->
        <div class="flow_table_list">
          <el-table
            :data="flowData"
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              v-if="userType==1"
              prop="agentName"
              :label="`${levelAlias.firstName}名称`"
              show-overflow-tooltip
              width="200">
            </el-table-column>
            <el-table-column
              v-if="userType==1 || userType==2"
              prop="subAgentName"
              :label="`${levelAlias.secondName}名称`"
              show-overflow-tooltip
              width="200">
            </el-table-column>
            <el-table-column
              v-if="userType==1 || userType==2 || userType==3"
              prop="thirdAgentName"
              :label="`${levelAlias.thirdName}名称`"
              show-overflow-tooltip
              width="200">
            </el-table-column>
            <el-table-column
              prop="merchantName"
              label="商户名称"
              show-overflow-tooltip
              width="200">
            </el-table-column>
            <el-table-column
              prop="orderAmount"
              label="订单金额">
            </el-table-column>
            <el-table-column
              prop="refundAmount"
              label="退款金额">
            </el-table-column>
            <el-table-column
              prop="validDealAmount"
              label="有效交易基数">
            </el-table-column>
            <el-table-column
              prop="customerPaidAmount"
              label="顾客实际支付">
            </el-table-column>
            <el-table-column
              prop="discountAmount"
              label="优惠">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="goDetail(scope.row.merchantId)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--翻页-->
        <pagination
          :total-elements="flowTotalElement"
          :change-callback="getFlowList"
          ref="page"></pagination>
      </el-card>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import echartResizeMixin from './mixin/echartResizeMixin.js'

import {
  flowCard,
  orderChart,
  refundChart,
  commissionChart,
  payType,
  terminal,
  merchantList
} from '@/modules/datacenter/api/datacenter'
import pagination from '@/components/pagination/index'
import { levelAliasMixin } from '@/mixins'
export default {
  name: 'cashFlow',
  mixins: [levelAliasMixin, echartResizeMixin],
  components: {pagination},
  data () {
    return {
      loading: true, // 加载动画
      userType: '', // 登录用户类型
      searchDays: '2', // 搜索天数
      searchForm: {
        days: [], // 日期
        type: '1'// 类型
      },
      leftActiveName: '1', // 左侧图表标签页Index
      rightActiveName: '1', // 右侧图表标签页Index
      cardData: {
        commissionAmount: 0,
        customerPaidAmount: '0',
        discountAmount: '0',
        orderAmount: '0',
        orderNum: '0',
        refundAmount: '0',
        refundNum: '0',
        validDealAmount: '0'
      }, // 卡片数据

      // 图表数据
      leftchartData: {
        num: [],
        ydata: [],
        xdata: []
      },
      rightchartData: {
        obj: []
      },
      leftDataNull: true,
      rightDataNull: true,
      flowData: [], // 流水列表
      flowTotalElement: 0, // 流水条目总数
      leftChartA: null,
      leftChartB: null

    }
  },
  mounted () {
    this.userType = sessionStorage.getItem('userType')
    if (this.userType == 1) {
      this.searchForm.type = 1
    } else if (this.userType == 2) {
      this.searchForm.type = 1
    } else {
      this.searchForm.type = 1
    }
    // 默认查询
    this.defaultSearch()
  },
  methods: {
    /**
       * 第一次默认查询
       */
    defaultSearch () {
      // 设定7天日期//2
      this.changeDays(2)
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
       *检查时间
       * 如果不对，则修改为里结束日期的前31天。
       */
    checkDataRange () {
      let timestamp = (new Date()).getTime()
      let startTime = this.searchForm.days[0]
      let endTime = this.searchForm.days[1]
      if (endTime - startTime > 24 * 60 * 60 * 1000 * 31) {
        this.$message.error('前后时间不能超过31天')

        this.$set(this.searchForm.days, 0, timestamp - (24 * 60 * 60 * 1000 * 31))
        this.$set(this.searchForm.days, 1, timestamp)
        this.submitSearch() // 限定范围后再发起搜索
      } else if (endTime > timestamp) {
        this.$message.error('搜索日期不能大于当天')
        this.$set(this.searchForm.days, 1, timestamp)
        this.submitSearch() // 允许发起搜索
      } else {
        this.submitSearch() // 允许发起搜索
      }
    },
    /**
       * 快捷方式修改日期
       * @param event 日期范围选项
       */
    changeDays: function (event) {
      let timestamp = (new Date()).getTime()
      if (event == 0) {
        // 当日
        this.$set(this.searchForm.days, 0, timestamp)
        this.$set(this.searchForm.days, 1, timestamp)
      } else if (event == 1) {
        let startTime = timestamp - (24 * 60 * 60 * 1000)
        let endTime = timestamp - (24 * 60 * 60 * 1000)
        this.$set(this.searchForm.days, 0, startTime)
        this.$set(this.searchForm.days, 1, endTime)
      } else if (event == 2) {
        let startTime = timestamp - (24 * 60 * 60 * 1000 * 6)
        let endTime = timestamp
        this.$set(this.searchForm.days, 0, startTime)
        this.$set(this.searchForm.days, 1, endTime)
      }
      this.submitSearch()
    },
    /**
       *渲染卡片
       */
    showCardData () {
      let cid = sessionStorage.getItem('companyId')
      let st = this.format(this.searchForm.days[0])
      let et = this.format(this.searchForm.days[1])
      let ty = this.searchForm.type

      flowCard(cid, st, et, ty).then(res => {
        this.cardData = res.obj || {}
        // 卡片数据获取成功后，发起图表查询
        this.loading = false
        this.leftChangeTabs()
        this.rightChangeTabs()
        this.getFlowList(1, 10)
      }).catch(e => {
        // 如果失败，设置空数据
        this.leftDataNull = true
        this.rightDataNull = true
        this.$message('数据获取失败')
      })
    },

    /**
       * 切换左、右的图表标签页
       */
    leftChangeTabs () {
      let cid = sessionStorage.getItem('companyId')
      let st = this.format(this.searchForm.days[0])
      let et = this.format(this.searchForm.days[1])
      let ty = this.searchForm.type
      let tabs = this.leftActiveName
      if (tabs == '1') {
        orderChart(cid, st, et, ty).then(res => {
          this.leftchartData = res.obj
          this.drawLeftData()
        }).catch(e => {
          // this.$message('订单图表异常')
        })
      } else if (tabs == '2') {
        refundChart(cid, st, et, ty).then(res => {
          this.leftchartData = res.obj
          this.drawLeftData()
        }).catch(e => {
          // this.$message('退款图表异常')
        })
      } else if (tabs == '3') {
        commissionChart(cid, st, et, ty).then(res => {
          this.leftchartData = res.obj
          this.drawLeftData()
        }).catch(e => {
          // this.$message('佣金图表异常')
        })
      }
    },
    rightChangeTabs () {
      let cid = sessionStorage.getItem('companyId')
      let ty = this.searchForm.type
      let tabs = this.rightActiveName
      if (tabs == '1') {
        payType(cid, ty).then(res => {
          this.rightchartData.obj = res.obj
          this.drawRightData()
        }).catch(e => {
          // this.$message('支付渠道图表异常')
        })
      } else if (tabs == '2') {
        terminal(cid, ty).then(res => {
          this.rightchartData.obj = res.obj
          this.drawRightData()
        }).catch(e => {
          // this.$message('终端图表异常')
        })
      }
    },

    /**
       * 渲染图表数据 左、右
       */
    drawLeftData: function () {
      console.log('leftchartData', this.leftchartData)
      // 获取图表数据
      if (this.leftchartData == null) {
        this.leftDataNull = true
        return
      }
      // 如果有数据，则分配X\Y轴
      let lxd = this.leftchartData.xdata
      let lyd = this.leftchartData.ydata
      let lnum = this.leftchartData.num
      // 判断数据是否为空

      if (lxd == null || lyd == null || lnum == null) {
        this.leftDataNull = true
      } else {
        this.leftDataNull = false
        var left_chart = this.$echarts.init(document.getElementById('left_chart' + this.leftActiveName))
        left_chart.resize()
        this.adaptWindowResize(left_chart)
        left_chart.setOption({
          // title: {text: '商户统计', textStyle: {color: '#333', fontWeight: 'lighter', fontSize: '16'}},
          color: ['#5FB870', '#56A2FD', '#FFAF2C', '#F04134', '#57636F'],
          legend: {
            data: ['金额', '数量']
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} @ {c} '
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: lxd
          }, // X轴标题
          yAxis: {
            type: 'value'
          },
          series: [{
            data: lyd,
            name: '金额',
            type: 'line',
            areaStyle: {}
          }, {
            data: lnum,
            name: '数量',
            type: 'line',
            areaStyle: {}
          }] // 数据数组，多个数据，legend需要对于标题name
        })
      }
      this.loading = false
    },

    drawRightData: function () {
      console.log('this.rightchartData', this.rightchartData)
      // 获取图表数据
      let robj = this.rightchartData.obj

      if (robj == null) {
        this.rightDataNull = true
      } else {
        this.rightDataNull = false
        var right_chart = this.$echarts.init(document.getElementById('right_chart' + this.rightActiveName))
        right_chart.resize()
        this.adaptWindowResize(right_chart)
        let legentData = robj.map(res => res.name)
        right_chart.setOption({
          // title: {text: '业务员发展商户占比', textStyle: {color: '#333', fontWeight: 'lighter', fontSize: '16'}},
          color: ['#5FB870', '#56A2FD', '#FFAF2C', '#F04134', '#57636F'],
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} @ (占{d}%)'
          },
          // legend: {
          //   orient: 'vertical',
          //   left: 'right',
          //   data: ['PC', '苹果手机', '安卓手机', 'H5', '其他/未知']
          // },
          legend: {
            x: 'left',
            data: legentData,
            bottom: 0,
            itemWidth: 10,
            itemHeight: 10,
            borderRadius: 10,
            icon: 'circle',
            textStyle: {
              fontSize: 14
            }
          },
          series: [
            {
              name: '占比',
              type: 'pie',
              radius: ['20%', '40%'],
              // center: ['50%', '30%'],
              data: robj,
              label: {
                fontSize: 14,
                formatter: '{b}',
                lineHeight: 30
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      }

      this.loading = false
    },

    /**
       * 渲染列表
       */
    getFlowList: function (pageNum, pageSize) {
      let cid = sessionStorage.getItem('companyId')
      let ty = this.searchForm.type
      let merchantName = this.searchForm.merchantName
      this.flowData = []
      merchantList(pageNum, pageSize, cid, ty,merchantName).then(res => {
        this.flowTotalElement = res.obj.totalElement
        this.flowData = res.obj.data
      }).catch(e => {
        // this.$message('oops')
      })
    },
    /**
       * 前往详情
       */
    goDetail (data) {
      // let id = data.id
      let id = data
      this.$router.push({path: '/datacenter/views/flowDetail', query: {id: id}})
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
    }

  }
}
</script>

<style scoped>
  .block {
    display: inline-block;
    vertical-align: middle;
  }

  .search_bar {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  /*卡片*/
  .card_group {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }

  .card_item {
    width: 23%;
    margin: 20px 0 0 0;
  }

  .tools_box {
    padding: 10px 0;
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
    cursor: default;
  }

  .tools_text p:nth-child(1) {
    font-size: 14px;
    color: #888;
  }

  .tools_text p:nth-child(2) {
    padding: 5px 0 0 0;
    font-size: 26px;
    color: #3f3f3f;
  }

  /*图表*/
  .data_chart {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .chart_card_left {
    width: 59%;
  }

  .chart_card_right {
    width: 39%;
  }

  .chart_img {
    width: 100%;
    height: 500px;
  }

  /*流水表格*/
  .flow_table {
    margin-top: 20px;
  }

  @media (max-width: 1280px) {
    .search_bar {
      flex-direction: column;
    }

    .card_item {
      width: 49%;
    }
  }

  @media (max-width: 768px) {
    .tools_text {
      width: 100%;
      text-align: center;
    }

    .card_item {
      width: 100%;
    }

    .data_chart {
      flex-direction: column;
    }

    .chart_card_left {
      width: 100%;
    }

    .chart_card_right {
      margin-top: 20px;
      width: 100%;
    }
  }

  @media (max-width: 500px) {
    .tools_img {
      display: none;
    }

    .tools_text {
      width: 100%;
      text-align: center;
    }

    .card_item {
      width: 100%;
    }
  }
</style>
