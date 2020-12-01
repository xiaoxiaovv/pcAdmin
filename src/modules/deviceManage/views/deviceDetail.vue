<template>
  <div class="app-container vm-app-container" v-loading="loading">
    <div slot="header" class="vm-app-bodys clearfix">
      <el-button style="float: right;font-size: 16px" type="text" @click="goBack"><i class="el-icon-back"></i> 返回列表 </el-button>
    </div>
    <!--表格-->
    <div class="vm-app-bodys">
      <div class="vm-search-btns vm-padding-lr-0">
        <!--订单号-->
        <el-input placeholder="订单号"
                  size="small"
                  class="formItem"
                  clearable
                  @keyup.enter.native="search"
                  v-model="params.orderNum"></el-input>
        <!--收营员-->
        <el-input placeholder="收营员"
                  size="small"
                  class="formItem"
                  clearable
                  @keyup.enter.native="search"
                  v-model="params.staffName"></el-input>
        <!--开始时间，结束时间-->
        <el-date-picker v-model="timeDate"
                        size="small"
                        style="width: 300px;"
                        type="daterange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="~"
                        :default-time="['00:00:00', '23:59:59']"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
        <!--按钮-->
        <el-button type="primary" size="small" @click="searchTotal">查询</el-button>
        <el-button size="small" @click="exportExcel">导出</el-button>
      </div>
      <div class="page-margin-gray vm-margin-lr-0"></div>
      <div class="statis-order">
        <span>订单总数：</span><span>{{sumarryObj.orderNum}}笔</span>
        <span>订单总金额：</span><span>{{sumarryObj.totalMoney}}元</span>
        <span>退款总金额：</span><span>{{sumarryObj.refundMoney}}元</span>
        <span>顾客实付：</span><span>{{sumarryObj.payMoney}}元</span>
        <span>优惠：</span><span>{{sumarryObj.discountMoney}}元</span>
      </div>
      <div class="page-margin-gray vm-margin-lr-0"></div>
      <el-table :data="tableData"
                style="width: 100%"
                class="commission-t-table"
                row-key="id"
                ref="multipleTable">
        <el-table-column label="序号">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="订单号">
          <template slot-scope="scope">
            {{scope.row.orderNum}}
          </template>
        </el-table-column>
        <el-table-column label="门店">
          <template slot-scope="scope">
            {{scope.row.storeName}}
          </template>
        </el-table-column>
        <el-table-column label="收银员">
          <template slot-scope="scope">
            {{scope.row.staffName}}
          </template>
        </el-table-column>
        <el-table-column label="订单金额">
          <template slot-scope="scope">
            {{scope.row.orderMoney}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime | date}}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{scope.row.status}}
          </template>
        </el-table-column>
        <el-table-column label="支付方式">
          <template slot-scope="scope">
            {{scope.row.payWay}}
          </template>
        </el-table-column>
        <el-table-column label="支付通道">
          <template slot-scope="scope">
            {{scope.row.paychannel}}
          </template>
        </el-table-column>
        <el-table-column label="顾客实付">
          <template slot-scope="scope">
            {{scope.row.actualPayMoney}}
          </template>
        </el-table-column>
        <el-table-column label="优惠">
          <template slot-scope="scope">
            {{scope.row.discountMoney}}
          </template>
        </el-table-column>
      </el-table>
      <div class="table-foot vm-flex">
        <!-- 分页 -->
        <div class="vm-inline-block vm-flex-1 vm-text-right">
          <pagination ref="page"
                      style="margin-top: 20px !important;"
                      :total-elements="totalElements"
                      :change-callback="getTableList" ></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as deviceApi from '../api/device'
import pagination from '@/components/pagination/index'
import { tableMixin } from '@/mixins'
import ImgShow from '@/components/imgShow/index'
import downloadFile from '@/utils/downloadFile.js'
// import {url} from '@/utils/request'
export default {
  name: 'operator',
  components: {
    pagination,
    ImgShow
  },
  mixins: [tableMixin],
  data () {
    return {
      timeDate: [],
      loading: false, // 加载动画
      params: {
        orderNum: '',
        staffName: '',
        beginTime: '',
        endTime: ''
      },
      totalElements: 0,
      tableData: [
      ],
      sumarryObj: {}
    }
  },
  mounted () {
  },
  created () {
    this.params.equipmentId = this.$route.query.id
    this.getSummaryInfo()
  },
  watch: {
    timeDate (val, oldVal) {
      val = val || []
      this.params.beginTime = val[0] || ''
      this.params.endTime = val[1] || ''
    }
  },
  methods: {
    goBack () {
      this.$router.go('-1')
    },
    searchTotal () {
      this.getSummaryInfo()
      this.search()
    },
    /**
     * h获取统计信息
     */
    getSummaryInfo () {
      this.params.equipmentId = this.$route.query.id
      deviceApi.deviceDetailSummary(this.params).then(res => {
        this.sumarryObj = res.obj
      })
    },
    /**
     * 请求列表
    */
    requestTableList () {
      deviceApi.deviceDetailList(this.params).then(res => {
        this.tableData = res.obj.content
        this.totalElements = res.obj.totalElements
      })
    },
    /**
     * 导出
     */
    exportExcel () {
      this.$confirm('是否导出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deviceApi.deviceDetailExport(this.params).then(res => {
          downloadFile(res, '流水清单数据表.xls')
          this.$message.success('恭喜你，流水清单数据表下载成功')
        })
      })
    }
  }
}
</script>

<style scoped>
  .statis-order {
    padding: 20px;
    font-size: 14px;
    color: #999;
  }
  .statis-order span:nth-child(2n + 1) {
    color: #333;
    font-weight: bold;
   }
  .statis-order span:nth-child(2n) {
    margin: 0 15px 0 0px;
    color: #333;
  }
</style>
