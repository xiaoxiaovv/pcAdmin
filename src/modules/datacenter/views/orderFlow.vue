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
              <!--<el-input v-model="searchForm.merchantName" @keyup.enter.native="submitSearch" placeholder="代理名称" size="small" clearable
                        class="formItem"></el-input>-->
              <el-input v-model="searchForm.merchantName" @keyup.enter.native="submitSearch" placeholder="商户名" size="small" clearable
                        class="formItem"></el-input>
              <el-input v-model="searchForm.contact" @keyup.enter.native="submitSearch" placeholder="联系人" size="small" clearable
                        class="formItem"></el-input>
              <!--结算状态-->
              <el-select  placeholder="状态"
                          size="small"
                          class="formItem"
                          clearable
                          v-model="searchForm.status"
                          @change="submitSearch">
                <el-option v-for="item in payStatus"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value"></el-option>
              </el-select>
            </div>
            <!--下方选项-->
          </div>
          <div>
            <el-button type="primary" size="small" @click="submitSearch">搜索</el-button>
          </div>
        </div>
      </el-card>
    </div>




    <!--流水表格-->
    <div class="flow_table">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>订单明细</span>
<!--          <el-button style="float: right; padding: 3px 0" type="text">导出</el-button>-->
        </div>
        <!--表格-->
        <div class="flow_table_list">
          <el-table
            :data="orderFlowList"
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="merchantName"
              label="商户名称">
            </el-table-column>
            <el-table-column
              prop="orderNumber"
              label="订单号">
            </el-table-column>
            <el-table-column
              prop="totalPrice"
              label="订单金额">
            </el-table-column>
            <el-table-column
              prop="actPayPrice"
              label="实付金额">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="下单时间">
            </el-table-column>

            <el-table-column
              prop="type"
              label="支付方式">
              <template slot-scope="scope">
                {{payWay(scope.row.payWay)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              label="支付通道">
              <template slot-scope="scope">
                {{scope.row.payChannelName}}
                <!--{{payChannelCount(scope.row.payChannel)}}-->
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              label="支付状态">
              <template slot-scope="scope">
                {{scope.row.status | payStatusFilter}}
              </template>
            </el-table-column>
            <el-table-column
              prop="contact"
              label="联系人">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="电话">
            </el-table-column>


            <!--<el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="goDetail(scope.row.merchantId)">详情</el-button>
              </template>
            </el-table-column>-->
          </el-table>
        </div>
        <!--翻页-->
        <pagination
          :total-elements="flowTotalElement"
          :change-callback="getOrderFlowList"
          ref="page"></pagination>
      </el-card>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import echartResizeMixin from './mixin/echartResizeMixin.js'

import {
  getOrderFlowList,
  getPayWayOption
} from '@/modules/datacenter/api/orderFlow'
import pagination from '@/components/pagination/index'
import { levelAliasMixin } from '@/mixins'
export default {
  name: 'cashFlow',
  mixins: [levelAliasMixin, echartResizeMixin],
  components: {pagination},
  data () {
    return {
      pageNumber:1,
      pageSize:10,
      payStatus : [
        {name:'未支付',value:'1'},
        {name:'支付成功',value:'2'},
        {name:'支付失败',value:'3'},
        {name:'已撤销',value:'4'},
        {name:'全额退款成功',value:'5'},
        {name:'部分退款成功',value:'6'},
        {name:'退款失败',value:'7'},
        {name:'退款中',value:'8'},
        {name:'撤销失败',value:'9'},
      ],
        /*{

        '1': '未支付',
        '2': '支付成功',
        '3': '支付失败',
        '4': '已撤销',
        '5': '全额退款成功',
        '6': '部分退款成功',
        '7': '退款失败',
        '8': '退款中',
        '9': '撤销失败',
      },*/
      payWays:[],
      loading: true, // 加载动画
      userType: '', // 登录用户类型
      searchDays: '2', // 搜索天数
      searchForm: {
        days: [], // 日期
        actionCreateTime: '', // 日期
        endCreateTime: '', //
        merchantName: '', //
        contact: '', //
        status: '', //
      },
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
      orderFlowList: [], // 流水列表
      flowTotalElement: 0, // 流水条目总数


    }
  },
  mounted () {
    this.userType = sessionStorage.getItem('userType')
    /*if (this.userType == 1) {
      this.searchForm.type = 1
    } else if (this.userType == 2) {
      this.searchForm.type = 1
    } else {
      this.searchForm.type = 1
    }*/
    // 默认查询
    this.defaultSearch()
    // this.getPayWay();
  },
  methods: {

    /**
     * 获取支付渠道
     */
    getPayWay: function () {
      getPayWayOption().then(res => {
        let data = res.obj
        // 获取支付渠道
        this.payWays = data
        this.getOrderFlowList(1,10)
      }).catch(e => {

      })
    },
    // 获取订单列表
    getOrderFlowList(pageNumber, pageSize){
      let companyId = sessionStorage.getItem('companyId')
      let userId = sessionStorage.getItem('userId')
      let params = {};

      params.companyId = companyId;
      params.userId = userId;
      params.pageNumber = pageNumber;
      params.pageSize = pageSize
      this.searchForm.actionCreateTime = this.format(this.searchForm.days[0]);
      this.searchForm.endCreateTime = this.format(this.searchForm.days[1]);
      let sendData = JSON.parse(JSON.stringify(Object.assign(params, this.searchForm)));
      sendData.days = null;
      getOrderFlowList(sendData).then(res=>{
        this.orderFlowList = res.obj.list;
        this.flowTotalElement = res.obj.total;
      })
    },
    /**
       * 加载默认查询
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
      this.getOrderFlowList(this.pageNumber, this.pageSize)
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

  },
  computed: {
    // 动态计算支付类型
    payWay: function (val) {
      return function (val) {
        let str = '未知'
        let pt = this.payWays
        for (let i in pt) {
          if (pt[i].value == val) {
            str = pt[i].name // 赋值匹配名字
            break // 停止循环
          }
        }
        return str
      }
    }
  },
  filters:{
    payStatusFilter(val){
      /*let payStatus = {
          '1': '未支付',
          '2': '支付成功',
          '3': '支付失败',
          '4': '已撤销',
          '5': '全额退款成功',
          '6': '部分退款成功',
          '7': '退款失败',
          '8': '退款中',
          '9': '撤销失败',
        };*/
      switch (val){
        case 1:
          return '未支付'
        break
        case 2:
          return '支付成功'
          break
        case 3:
          return '支付失败'
          break
        case 4:
          return '已撤销'
          break
        case 5:
          return '全额退款成功'
          break
        case 6:
          return '部分退款成功'
          break
        case 7:
          return '退款失败'
          break
        case 8:
          return '退款中'
          break
        case 9:
          return '撤销失败'
          break

        default:
          return '未知'
          break
      }

      // return payStatus[val];

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
