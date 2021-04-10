<template>
  <div class="app-container vm-app-container" v-loading="loading">
    <div class="vm-app-bodys">
      <div class="vm-page-table-title">数据统计
        <el-tooltip class="item" effect="dark" content="显示自己和下级的交易总额和佣金总额"
                    placement="top-start">
          <i class="el-icon-question"></i>
        </el-tooltip>
        <span class="vm-margin-l-15 vm-size-14 vm-color-9">仅统计近一年的数据</span></div>
    </div>
    <div class="vm-flex cset-data-show cset-data-title vm-align-center vm-align-center vm-size-14 vm-color-3">
      <div class="vm-flex-1 ">
        <p class="title">交易总额/佣金总额</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('官方') > -1">
        <p class="title">微信交易金额/佣金总额</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('官方') > -1">
        <p class="title">支付宝交易金额/佣金总额</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('随行付') > -1">
        <p class="title">随行付交易金额/佣金总额</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('富友') > -1">
        <p class="title">富友交易金额/佣金总额</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('威富通') > -1">
        <p class="title">威富通交易金额/佣金总额</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('传化') > -1">
        <p class="title">传化交易金额/佣金总额</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('乐刷') > -1">
        <p class="title">乐刷交易金额/佣金总额</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('天阙随行付') > -1">
        <p class="title">天阙随行付交易金额/佣金总额</p>
      </div>


      <div class="vm-flex-1" v-if="payConfig.indexOf('易生') > -1">
        <p class="title">易生交易金额/佣金总额</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('开店宝') > -1">
        <p class="title">开店宝交易金额/佣金总额</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('畅捷') > -1">
        <p class="title">畅捷交易金额/佣金总额</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('手机pos') > -1">
        <p class="title">手机pos交易金额/佣金总额</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('网联') > -1">
        <p class="title">快捷支付金额/佣金总额</p>
      </div>



      <div class="vm-flex-1" v-if="userType==='2' || userType==='3' || userType==='4'">
        <p class="title">已结算佣金</p>
      </div>
      <div class="vm-flex-1" v-if="userType==='2' || userType==='3' || userType==='4'">
        <p class="title">未结算佣金</p>
      </div>
    </div>
    <div class="vm-flex cset-data-show vm-align-justify-center vm-align-center vm-size-14 vm-color-6">
      <div class="vm-flex-1">
        <p class="num">{{sumarryObj.orderTotal}}/{{sumarryObj.commissionTotal}}</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('官方') > -1">
        <p class="num">{{sumarryObj.wxOrderTotal}}/{{sumarryObj.wxCommissionTotal}}</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('官方') > -1">
        <p class="num">{{sumarryObj.zfbOrderTotal}}/{{sumarryObj.zfbCommissionTotal}}</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('随行付') > -1">
        <p class="num">{{sumarryObj.sxfOrderTotal || 0}}/{{sumarryObj.sxfCommissionTotal || 0}}</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('富友') > -1">
        <p class="num">{{sumarryObj.fyOrderTotal || 0}}/{{sumarryObj.fyCommissionTotal || 0}}</p>
      </div>
      <!--威富通-->
      <div class="vm-flex-1" v-if="payConfig.indexOf('威富通') > -1">
        <p class="num">{{sumarryObj.ysOrderTotal || 0}}/{{sumarryObj.ysCommissionTotal || 0}}</p>
      </div>
      <!--传化-->
      <div class="vm-flex-1" v-if="payConfig.indexOf('传化') > -1">
        <p class="num">{{sumarryObj.chOrderTotal || 0}}/{{sumarryObj.chCommissionTotal || 0}}</p>
      </div>
      <!--乐刷-->
      <div class="vm-flex-1" v-if="payConfig.indexOf('乐刷') > -1">
        <p class="num">{{sumarryObj.lsOrderTotal || 0}}/{{sumarryObj.lsCommissionTotal || 0}}</p>
      </div>
      <!--天阙随行付-->
      <div class="vm-flex-1" v-if="payConfig.indexOf('天阙随行付') > -1">
        <p class="num">{{sumarryObj.tqOrderTotal || 0}}/{{sumarryObj.tqCommissionTotal || 0}}</p>
      </div>

      <div class="vm-flex-1" v-if="payConfig.indexOf('易生') > -1">
        <p class="num">{{ sumarryObj.yiShengOrderTotal || 0 }}/{{ sumarryObj.yiShengCommissionTotal || 0 }}</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('开店宝') > -1">
        <p class="num">{{ sumarryObj.kdbOrderTotal || 0 }}/{{ sumarryObj.kdbCommissionTotal || 0 }}</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('畅捷') > -1">
        <p class="num">{{ sumarryObj.chanpayOrderTotal || 0 }}/{{ sumarryObj.chanpayCommissionTotal || 0 }}</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('手机pos') > -1">
        <p class="num">{{ sumarryObj.posOrderTotal || 0 }}/{{ sumarryObj.posCommissionTotal || 0 }}</p>
      </div>
      <div class="vm-flex-1" v-if="payConfig.indexOf('网联') > -1">
        <p class="num">{{ sumarryObj.quickOrderTotal || 0 }}/{{ sumarryObj.quickCommissionTotal || 0 }}</p>
      </div>

      <div class="vm-flex-1" v-if="userType==='2' || userType==='3' || userType==='4'">
        <p class="num">{{sumarryObj.settleCommisson}}</p>
      </div>
      <div class="vm-flex-1" v-if="userType==='2' || userType==='3' || userType==='4'">
        <p class="num">{{sumarryObj.unSettleCommisson}}</p>
      </div>
    </div>
    <div class="page-margin-gray"></div>
    <!--表格-->
    <div class="vm-app-bodys" v-if="this.userType !== '4'">
      <div class="vm-page-table-title">结算清单
        <el-tooltip class="item" effect="dark" content="显示给下级结算/未结算的佣金"
                    placement="top-start">
          <i class="el-icon-question"></i>
        </el-tooltip>
        <span class="table-tipss"><span>已结算：{{commissionCount.settleCommisson}}元</span><span>未结算：{{commissionCount.unSettleCommisson}}元</span></span>
      </div>
      <div class="vm-search-btns vm-padding-lr-0">
        <!--开始时间，结束时间-->
        <el-date-picker v-model="timeDate"
                        size="small"
                        style="width: 300px;"
                        type="daterange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="~"
                        :default-time="['00:00:00', '23:59:59']"
                        start-placeholder="佣金开始日期"
                        end-placeholder="佣金结束日期">
        </el-date-picker>
        <!--结算状态-->
        <el-select  placeholder="结算状态"
                    size="small"
                    class="formItem"
                    clearable
                    v-model="params.status"
                    @change="search">
          <el-option v-for="item in statusOption"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value"></el-option>
        </el-select>
        <!--代理名称-->
        <el-input placeholder="代理名称"
                  size="small"
                  class="formItem"
                  clearable
                  @keyup.enter.native="search"
                  v-model="params.companyName"></el-input>
        <!--按钮-->
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <!--导出-->
        <el-button size="small" @click="exportData">导出</el-button>
        <!--导出-->
        <el-button size="small" @click="exportExcel">导出结算报表</el-button>
      </div>
      <div class="page-margin-gray vm-margin-lr-0"></div>
      <el-table :data="tableData"
                style="width: 100%"
                class="commission-t-table"
                row-key="id"
                ref="multipleTable"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         fixed
                         reserve-selection
                         :selectable="selectAble"
                         width="55">
        </el-table-column>
        <el-table-column label="代理名称">
          <template slot-scope="scope">
            {{scope.row.companyName}}
          </template>
        </el-table-column>
        <el-table-column label="佣金生成时间" min-width="100">
          <template slot-scope="scope">
            {{scope.row.createTime}}
          </template>
        </el-table-column>
        <el-table-column label="交易总额/佣金总额" min-width="100">
          <template slot-scope="scope">
            {{scope.row.orderTotal}}/{{scope.row.commissionTotal}}
          </template>
        </el-table-column>
        <el-table-column label="微信交易金额/佣金总额" min-width="100" v-if="payConfig.indexOf('官方') > -1">
          <template slot-scope="scope">
            {{scope.row.wxOrderTotal}}/{{scope.row.wxCommissionTotal}}
          </template>
        </el-table-column>
        <el-table-column label="支付宝交易金额/佣金总额" min-width="100" v-if="payConfig.indexOf('官方') > -1">
          <template slot-scope="scope">
            {{scope.row.zfbOrderTotal}}/{{scope.row.zfbCommissionTotal}}
          </template>
        </el-table-column>
        <el-table-column label="随行付交易金额/佣金总额"  min-width="100" v-if="payConfig.indexOf('随行付') > -1">
          <template slot-scope="scope">
            {{scope.row.sxfOrderTotal}}/{{scope.row.sxfCommissionTotal}}
          </template>
        </el-table-column>
        <el-table-column label="富友交易金额/佣金总额"  min-width="100" v-if="payConfig.indexOf('富友') > -1">
          <template slot-scope="scope">
            {{scope.row.fyOrderTotal}}/{{scope.row.fyCommissionTotal}}
          </template>
        </el-table-column>
        <!--威富通-->
        <el-table-column label="威富通交易金额/佣金总额"  min-width="100" v-if="payConfig.indexOf('威富通') > -1">
          <template slot-scope="scope">
            {{scope.row.ysOrderTotal}}/{{scope.row.ysCommissionTotal}}
          </template>
        </el-table-column>
        <!--传化-->
        <el-table-column label="传化交易金额/佣金总额"  min-width="100" v-if="payConfig.indexOf('传化') > -1">
          <template slot-scope="scope">
            {{scope.row.chOrderTotal}}/{{scope.row.chCommissionTotal}}
          </template>
        </el-table-column>
        <!--乐刷-->
        <el-table-column label="乐刷交易金额/佣金总额"  min-width="100" v-if="payConfig.indexOf('乐刷') > -1">
          <template slot-scope="scope">
            {{scope.row.lsOrderTotal}}/{{scope.row.lsCommissionTotal}}
          </template>
        </el-table-column>
        <!--天阙随行付-->
        <el-table-column label="天阙随行付交易金额/佣金总额"  min-width="100" v-if="payConfig.indexOf('天阙随行付') > -1">
          <template slot-scope="scope">
            {{scope.row.tqOrderTotal}}/{{scope.row.tqCommissionTotal}}
          </template>
        </el-table-column>


        <el-table-column label="易生交易金额/佣金总额"  min-width="100" v-if="payConfig.indexOf('易生') > -1">
          <template slot-scope="scope">
            {{scope.row.yiShengOrderTotal}}/{{scope.row.yiShengCommissionTotal}}
          </template>
        </el-table-column>
        <el-table-column label="开店宝交易金额/佣金总额"  min-width="100" v-if="payConfig.indexOf('开店宝') > -1">
          <template slot-scope="scope">
            {{scope.row.kdbOrderTotal}}/{{scope.row.kdbCommissionTotal}}
          </template>
        </el-table-column>
        <el-table-column label="畅捷交易金额/佣金总额"  min-width="100" v-if="payConfig.indexOf('畅捷') > -1">
          <template slot-scope="scope">
            {{scope.row.chanpayOrderTotal}}/{{scope.row.chanpayCommissionTotal}}
          </template>
        </el-table-column>
        <el-table-column label="手机pos交易金额/佣金总额"  min-width="100" v-if="payConfig.indexOf('手机pos') > -1">
          <template slot-scope="scope">
            {{scope.row.posOrderTotal}}/{{scope.row.posCommissionTotal}}
          </template>
        </el-table-column>
        <el-table-column label="快捷支付交易金额/佣金总额"  min-width="100" v-if="payConfig.indexOf('网联') > -1">
          <template slot-scope="scope">
            {{scope.row.quickOrderTotal}}/{{scope.row.quickCommissionTotal}}
          </template>
        </el-table-column>









        <el-table-column label="结算状态">
          <template slot-scope="scope">
            {{scope.row.status === 1 ? '结算' : '未结算'}}
          </template>
        </el-table-column>
        <el-table-column label="结算时间" min-width="160">
          <template slot-scope="scope">
            {{scope.row.settleTime || '--'}}
          </template>
        </el-table-column>
        <el-table-column label="支付凭证">
          <template slot-scope="scope">
            <ImgShow :url="scope.row.voucherUrl" v-if="scope.row.voucherUrl"></ImgShow>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <!--操作-->
        <el-table-column fixed="right"
                         width="150"
                         label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="settlement([scope.row], 1)" v-if="scope.row.status === 0">结算</el-button>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-foot vm-flex">
        <span class="vm-margin-t-20">
          <el-button size="small" :disabled="!this.tableSelectArr.length" @click="settlement(tableSelectArr, 2)">批量结算</el-button>
        </span>
        <!-- 分页 -->
        <div class="vm-inline-block vm-flex-1 vm-text-right">
          <pagination ref="page"
                      style="margin-top: 20px !important;"
                      :total-elements="totalElements"
                      :change-callback="getTableList" ></pagination>
        </div>
      </div>

    </div>
    <!--结算-->
    <el-dialog class="vm-dialog"
               title="结算"
               width="498px"
               v-if="dialogSettlement.show"
               :visible.sync="dialogSettlement.show">
      <Settlement :propsInfo="dialogSettlement"
                  v-if="dialogSettlement.show"
                  @getCountInfo="getCountInfo"
                  @getTableList="getTableList"></Settlement>
    </el-dialog>
    <!--导出结算报表-->
    <el-dialog class="vm-dialog"
               title="导出结算报表"
               width="498px"
               v-if="dialogExportExcel.open"
               :visible.sync="dialogExportExcel.open">
      <ExportExcel :propsInfo="dialogExportExcel"
                  v-if="dialogExportExcel.open"></ExportExcel>
    </el-dialog>
  </div>
</template>

<script>
import * as commissionApi from '../../api/commission'
import pagination from '@/components/pagination/index'
import Settlement from './components/settlement'
import ExportExcel from './components/exportExcel.vue'
import { tableMixin } from '@/mixins'
import ImgShow from '@/components/imgShow/index'
import {getSystemCOnfig} from '@/modules/pay/api/pay_config'
import downloadFile from '@/utils/downloadFile.js'
export default {
  name: 'operator',
  components: {
    pagination,
    ImgShow,
    Settlement,
    ExportExcel
  },
  mixins: [tableMixin],
  data () {
    return {
      timeDate: [],
      loading: false, // 加载动画
      statusOption: [
        {
          value: 1,
          name: '结算'
        },
        {
          value: 0,
          name: '未结算'
        }
      ],
      params: {
        companyName: '',
        status: '',
        begin: '',
        end: ''
      },
      totalElements: 0,
      tableData: [
      ],
      tableSelectArr: [],
      sumarryObj: {},
      dialogSettlement: {
        show: false
      },
      commissionCount: {
        settleCommisson: 0,
        unSettleCommisson: 0
      },
      userType: null,
      payConfig: [],
      dialogExportExcel: {
        open: false
      }
    }
  },
  mounted () {
  },
  created () {
    this.getSummaryInfo()
    this.userType = sessionStorage.getItem('userType')
    this.getCountInfo()
    this.getSystemCOnfigInfo()
  },
  /*
  computed: {
    userType () {
      let userType = sessionStorage.getItem('userType')
      return userType
    }
  },
  */
  watch: {
    timeDate (val, oldVal) {
      val = val || []
      this.params.begin = val[0] || ''
      this.params.end = val[1] || ''
    }
  },
  methods: {
    /**
     *导出佣金列表
     **/
    exportData () {
      this.$confirm('是否导出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        commissionApi.commissionListExport(this.params).then(res => {
          downloadFile(res, '佣金结算清单.xls')
          this.$message.success('恭喜你，佣金结算清单下载成功')
        })
      })
    },
    /**
     * 导出结算报表
     * */
    exportExcel () {
      this.dialogExportExcel = {
        open: true
      }
    },
    getSystemCOnfigInfo () {
      getSystemCOnfig().then(res => {
        this.payConfig = [...res.obj]
      })
    },
    /**
     * h获取统计信息
     */
    getSummaryInfo () {
      commissionApi.commissionSummary().then(res => {
        this.sumarryObj = res.obj
      })
    },
    /**
     * 请求列表
    */
    requestTableList () {
      let userType = sessionStorage.getItem('userType')
      if (userType === '4') {
        return
      }
      commissionApi.commissionList(this.params).then(res => {
        this.tableData = res.obj.content
        this.totalElements = res.obj.totalElements
      })
    },
    /**
     * 表格左侧选择--清除
     */
    removeChecked () {
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection()
      })
    },
    /**
     * 表格左侧选择--是否可勾选
     */
    selectAble (row, index) {
      if (row.status === 1) {
        return false
      } else {
        return true
      }
    },
    /**
     * 表格左侧选择
     */
    handleSelectionChange (val) {
      this.tableSelectArr = val
    },
    /**
     * 设置结算信息
     **/
    settlement (data, type) {
      let commitArr = []
      // let commissionTotal = 0
      if (type === 1) {
        // 单个
        commitArr = [...data]
        // commissionTotal = data[0].settleTotal
      } else {
        data.forEach(item => {
          // commissionTotal += item.settleTotal
        })
        commitArr = [...this.tableSelectArr]
      }
      // commissionTotal = commissionTotal.toFixed(2)
      this.formatDialogInfo(commitArr, 0, type)
    },
    formatDialogInfo (commitArr, commissionTotal, type) {
      this.dialogSettlement = {
        show: true,
        commitArr: commitArr,
        type: type,
        commissionTotal: commissionTotal
      }
    },
    /**
     * 删除
     */
    removeCall (data, index) {
      this.$confirm('确定删除该广告吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      }).catch(() => {
      })
    },
    /**
     * 获取已结算，未结算
     */
    getCountInfo () {
      if (this.userType !== '3') {
        commissionApi.commissionCounts().then(res => {
          this.commissionCount = res.obj
        })
      }
      this.removeChecked()
    }
  }
}
</script>

<style scoped>
  .title-show-ell{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 30px;
    max-height: 60px;
  }
  .table-tipss{
    font-size: 14px;
    float: right;
  }
  .table-tipss span{
    margin-left: 20px;
  }
</style>
