<template>
  <div class="app-container vm-app-container" v-loading="loading">
    <!--<div class="vm-app-bodys">
      <div class="vm-page-table-title">数据统计  费率
        <el-tooltip class="item" effect="dark" content="显示自己和下级的交易总额和佣金总额"
                    placement="top-start">
          <i class="el-icon-question"></i>
        </el-tooltip>
        <span class="vm-margin-l-15 vm-size-14 vm-color-9">仅统计近一年的数据</span></div>
    </div>-->
    <!--<div class="vm-flex cset-data-show cset-data-title vm-align-center vm-align-center vm-size-14 vm-color-3">
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
      <div class="vm-flex-1" v-if="userType==='2' || userType==='3' || userType==='4'">
        <p class="title">已结算佣金</p>
      </div>
      <div class="vm-flex-1" v-if="userType==='2' || userType==='3' || userType==='4'">
        <p class="title">未结算佣金</p>
      </div>
    </div>-->
    <!--<div class="vm-flex cset-data-show vm-align-justify-center vm-align-center vm-size-14 vm-color-6">
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
      &lt;!&ndash;威富通&ndash;&gt;
      <div class="vm-flex-1" v-if="payConfig.indexOf('威富通') > -1">
        <p class="num">{{sumarryObj.ysOrderTotal || 0}}/{{sumarryObj.ysCommissionTotal || 0}}</p>
      </div>
      &lt;!&ndash;传化&ndash;&gt;
      <div class="vm-flex-1" v-if="payConfig.indexOf('传化') > -1">
        <p class="num">{{sumarryObj.chOrderTotal || 0}}/{{sumarryObj.chCommissionTotal || 0}}</p>
      </div>
      &lt;!&ndash;乐刷&ndash;&gt;
      <div class="vm-flex-1" v-if="payConfig.indexOf('乐刷') > -1">
        <p class="num">{{sumarryObj.lsOrderTotal || 0}}/{{sumarryObj.lsCommissionTotal || 0}}</p>
      </div>
      &lt;!&ndash;天阙随行付&ndash;&gt;
      <div class="vm-flex-1" v-if="payConfig.indexOf('天阙随行付') > -1">
        <p class="num">{{sumarryObj.tqOrderTotal || 0}}/{{sumarryObj.tqCommissionTotal || 0}}</p>
      </div>
      <div class="vm-flex-1" v-if="userType==='2' || userType==='3' || userType==='4'">
        <p class="num">{{sumarryObj.settleCommisson}}</p>
      </div>
      <div class="vm-flex-1" v-if="userType==='2' || userType==='3' || userType==='4'">
        <p class="num">{{sumarryObj.unSettleCommisson}}</p>
      </div>
    </div>-->
    <div class="page-margin-gray"></div>
    <!--表格-->
    <div class="vm-app-bodys" v-if="this.userType !== '4'">
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
        <!--代理名称-->
        <el-input placeholder="代理名称"
                  size="small"
                  class="formItem"
                  clearable
                  @keyup.enter.native="search"
                  v-model="params.companyName"></el-input>
        <el-button type="primary" size="small" @click="search">查询</el-button>
      </div>
      <div class="page-margin-gray vm-margin-lr-0"></div>
      <el-table :data="tableData"
                height="77vh"
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
        <el-table-column label="代理商名称">
          <template slot-scope="scope">
            {{scope.row.company}}
          </template>
        </el-table-column>
        <el-table-column label="提现人姓名" min-width="100">
          <template slot-scope="scope">
            {{scope.row.bankAccount}}
          </template>
        </el-table-column>
        <el-table-column label="申请金额" min-width="100">
          <template slot-scope="scope">
            {{scope.row.applyAmount}}
          </template>
        </el-table-column>
        <el-table-column label="到账金额" min-width="100" >
          <template slot-scope="scope">
            {{scope.row.actPayAmount}}
          </template>
        </el-table-column>
        <el-table-column label="提现费率（%）" min-width="100" >
          <template slot-scope="scope">
            {{scope.row.rateCash*100}}
          </template>
        </el-table-column>
        <el-table-column label="提现账号"  min-width="100" >
          <template slot-scope="scope">
            {{scope.row.cardNo}}
          </template>
        </el-table-column>
        <el-table-column label="提现订单号"  min-width="100" >
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <!--威富通-->
        <el-table-column label="开户银行名称"  min-width="100" >
          <template slot-scope="scope">
            {{scope.row.bankName}}
          </template>
        </el-table-column>
        <!--传化-->
        <el-table-column label="申请状态"  min-width="100" >
          <template slot-scope="scope">
            {{scope.row.status===1?'待审核':scope.row.status===2?'审核通过':scope.row.status===3?'提现成功':scope.row.status===-1?'审核未通过':'未知状态'}}
          </template>
        </el-table-column>
        <!--乐刷-->
        <el-table-column label="提现方式"  min-width="100" >
          <template slot-scope="scope">
            {{scope.row.accountType===1?'微信':scope.row.accountType===2?'支付宝':scope.row.accountType===3?'银行卡':'未知方式'}}
          </template>
        </el-table-column>
        <!--天阙随行付-->
        <el-table-column label="申请时间"  min-width="100" >
          <template slot-scope="scope">
            {{scope.row.createTime || '--'}}
          </template>
        </el-table-column>
        <el-table-column label="打款时间">
          <template slot-scope="scope">
            {{scope.row.payDate || '--'}}
          </template>
        </el-table-column>
        <!--操作-->
        <el-table-column fixed="right"
                         width="150"
                         label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="setcommitssionStatus(scope.$index,scope.row, 2)" v-if="scope.row.status === 1">通过</el-button>
            <span v-else></span>
            <el-button type="text" @click="setcommitssionStatus(scope.$index,scope.row, -1)" v-if="scope.row.status === 1">拒绝</el-button>
            <span v-else></span>

            <el-button type="text" @click="setcommitssionStatus(scope.$index,scope.row, 3)" v-if="scope.row.status === 2">确认打款</el-button>
            <span v-else></span>
            <el-button type="text" @click="setcommitssionStatus(scope.$index,scope.row, 1)" v-if="scope.row.status === 2">撤销</el-button>
            <span v-else></span>
            <el-button type="text" @click="setcommitssionStatus(scope.$index,scope.row, 0)" v-if="scope.row.status === -1">删除</el-button>
            <span v-else></span>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-foot vm-flex">
        <!--<span class="vm-margin-t-20">
          <el-button size="small" :disabled="!this.tableSelectArr.length" @click="settlement(tableSelectArr, 2)">批量结算</el-button>
        </span>-->
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
    <!--<el-dialog class="vm-dialog"
               title="结算"
               width="498px"
               v-if="dialogSettlement.show"
               :visible.sync="dialogSettlement.show">
      <Settlement :propsInfo="dialogSettlement"
                  v-if="dialogSettlement.show"
                  @getCountInfo="getCountInfo"
                  @getTableList="getTableList"></Settlement>
    </el-dialog>-->
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
import {filterpercentMultiplication} from '@/utils/common.js'
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
      commissionApi.commissionRateList(this.params).then(res => {
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
    setcommitssionStatus (index,data, type) {
      let commitObj = {}
       commitObj = {...data}
      // commitObj.status = type

      switch (type){
        case 1:
          commitObj.status = type
          break;
        case 2:
          commitObj.status = type
          break;
        case 3:
          commitObj.status = type
          break;
        case -1:
          commitObj.status = type
          break;
        case 0:
          commitObj.delFlag = '-1'
          break;
        default:
          break;
      }
      commissionApi.commissionModifyStatus(commitObj).then(res=>{
        if(type === 0){
          this.requestTableList()
        }else{
          this.tableData.splice(index,1,res.obj)
          // console.log('this.tableData===================',this.tableData)
        }


      })
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
  },
  filters:  {
    filterpercentMultiplication
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
