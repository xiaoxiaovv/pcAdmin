<template>
  <div class="merchant-box">
    <div class="header">
      <div class="header-1">
        <el-input
          size='small'
          placeholder="请输入代理商名称"
          style="width: 180px"
          v-model="input"
          clearable>
        </el-input>
        <el-date-picker
          v-show="activeName!='tab1'"
          size='small'
          v-model="dateValue"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
        <!-- <el-button size="small" @click="downloads">导出奖励结余</el-button> -->
        <el-button size="small" @click="downloadt">导出开户奖励明细</el-button>
      </div>
      <div v-if="yhaccountInfo" class="vm-flex vm-justify-between vm-padding-b-10 vm-padding-t-5" style="width: 60%;">
        <div class="vm-font-16px"><i class="el-icon-news color-blue"></i><span style="margin-right: 6px;">可用余额:</span><span style="color: #008000;">{{yhaccountInfo.avaliableBal?yhaccountInfo.avaliableBal/100:'0.00'}}</span></div>
        <div class="vm-font-16px"><i class="el-icon-news color-orange"></i><span style="margin-right: 6px;">不可用余额:</span><span style="color: #008000;">{{yhaccountInfo.unavaliableBal?yhaccountInfo.unavaliableBal/100:'0.00'}}</span></div>
        <div class="vm-font-16px"><i class="el-icon-news color-orange"></i><span style="margin-right: 6px;">服务费账户返点余额:</span><span style="color: #008000;">{{yhaccountInfo.avalibaleServiceBal?yhaccountInfo.avalibaleServiceBal/100:'0.00'}}</span></div>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="奖励结算" name="tab2">
        <div class="center">
          <el-table
              v-loading="loading"
              height="66vh"
              :data="order1List"
              stripe
              :header-cell-style="{'backgroundColor': '#f2f4f6'}"
              size="medium"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                prop="agentName"
                label="代理商">
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
              <el-table-column
                prop="createTime"
                label="申请时间">
              </el-table-column>
              <el-table-column label="打款时间">
                <template slot-scope="scope">
                  {{scope.row.payDate || '--'}}
                </template>
              </el-table-column>
              <el-table-column label="代付状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.platformStatus == '已完成'" style="color: green;">{{scope.row.platformStatus}}</span>
                  <span v-if="scope.row.platformStatus != '已完成'" style="color: orangered;">{{scope.row.platformStatus}}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right"
                               width="150"
                               label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="codecardStatus(scope.$index,scope.row, 2)" v-if="scope.row.status === 1">通过</el-button>
                  <span v-else></span>
                  <el-button type="text" @click="codecardStatus(scope.$index,scope.row, -1)" v-if="scope.row.status === 1">拒绝</el-button>
                  <span v-else></span>

                  <el-button type="text" @click="codecardStatus(scope.$index,scope.row, 3)" v-if="scope.row.status === 2">确认打款</el-button>
                  <span v-else></span>
                  <el-button type="text" @click="codecardStatus(scope.$index,scope.row, 1)" v-if="scope.row.status === 2">撤销</el-button>
                  <span v-else></span>
                  <el-button type="text" @click="codecardStatus(scope.$index,scope.row, 0)" v-if="scope.row.status === -1">删除</el-button>
                  <span v-else></span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
                  style="margin-top: 20px"
                  @current-change="handleCurrentChange1"
                  :current-page.sync="currentPage1"
                  :page-size="10"
                  layout="total, prev, pager, next"
                  :total="total1">
                </el-pagination>
        </div>
      </el-tab-pane>
        <el-tab-pane label="奖励结余" name="tab1">
          <div class="center">
            <el-table
                v-loading="loading"
                height="66vh"
                :data="orderList"
                stripe
                :header-cell-style="{'backgroundColor': '#f2f4f6'}"
                size="medium"
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="序号"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="agentName"
                  label="代理商">
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  label="创建时间">
                </el-table-column>
                <el-table-column
                  prop="totalAmount"
                  label="总奖励金额">
                </el-table-column>

                <el-table-column
                  label="已提现金额">
                  <template slot-scope="scope">
                    <span style="color: red;">{{scope.row.allApplyAmount}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="可提现金额">
                  <template slot-scope="scope">
                    <span style="color: red;">{{scope.row.canAmount}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                    style="margin-top: 20px"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="10"
                    layout="total, prev, pager, next"
                    :total="total">
                  </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="开户奖励明细" name="tab3">
          <div class="center">
            <el-table
                v-loading="loading"
                height="66vh"
                :data="order2List"
                stripe
                :header-cell-style="{'backgroundColor': '#f2f4f6'}"
                size="medium"
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="序号"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="agentName"
                  label="代理商">
                </el-table-column>
                <el-table-column
                  prop="agentPhone"
                  label="代理商电话">
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  label="结算时间">
                </el-table-column>
                <el-table-column
                  prop="merchantName"
                  label="商户名称">
                </el-table-column>
                <el-table-column
                  prop="contact"
                  label="联系人">
                </el-table-column>
                <el-table-column
                  label="奖励金额">
                  <template slot-scope="scope">
                    <span style="color: red;">{{scope.row.marketAmount.toFixed(2)}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                    style="margin-top: 20px"
                    @current-change="handleCurrentChange2"
                    :current-page.sync="currentPage2"
                    :page-size="10"
                    layout="total, prev, pager, next"
                    :total="total2">
                  </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>

  </div>
</template>

<script>
  import { getOrderList, cashCollect, collectList, collitemList, exportf, exports, exportt, codecardModifyStatus } from '../api/merchant.js'
  import * as commissionApi from '../../commission/api/commission.js'
  import { fmt } from '@/utils/dateFmt.js'
  import downloadFile from '@/utils/downloadFile.js'
  export default {
      data() {
        return {
          activeName: 'tab2',
          visible: false,
          bookkeeper: '',
          input: '',
          company: '',
          dateValue: [],
          loading: false,
          pickerOptions: {
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
          currentPage: 1,
          total: 0,
          currentPage1: 1,
          total1: 0,
          currentPage2: 1,
          total2: 0,
          orderList: [],
          order1List: [],
          order2List: [],
          yhaccountInfo: '',
        }
      },
      mounted() {
        this.getOrderList()
        this.collectList()
        this.collitemList()
        this.getYhaccount()
      },
      methods: {
        getYhaccount() {
          commissionApi.getYhaccount().then(res => {
            if(res.code === 200){
              const yhaccountInfo = JSON.parse(res.obj)
              this.yhaccountInfo = yhaccountInfo.data
            }
          })
        },
        codecardStatus (index,data, type) {
          let Obj = {}
           Obj = {...data}
          switch (type){
            case 1:
              Obj.status = type
              break;
            case 2:
              Obj.status = type
              break;
            case 3:
              Obj.status = type
              break;
            case -1:
              Obj.status = type
              break;
            case 0:
              Obj.delFlag = '-1'
              break;
            default:
              break;
          }
          codecardModifyStatus(Obj).then(res=>{
            if(type === 0){
                this.collectList()
                if(type === 3) {
                  this.getYhaccount()
                }
            }else{
              this.order1List.splice(index,1,res.obj)
            }
          })
        },
        downloads(){
          if(this.dateValue.length<2){
            this.$message.error('请选择开始日期和结束日期!');
            return
          }
          const params = {
            agentName: this.input,
            starttime: this.dateValue && this.dateValue.length!=0?fmt.date(this.dateValue[0],'yyyy-MM-dd'):'',
            endtime: this.dateValue && this.dateValue.length!=0?fmt.date(this.dateValue[1],'yyyy-MM-dd'):''
          }
          exports(params).then(res => {
            downloadFile(res, '代理商结算明细.xls')
            this.$message.success('导出成功！');
          })
        },
        downloadt(){
          if(this.dateValue.length<2){
            this.$message.error('请选择开始日期和结束日期!');
            return
          }
          const params = {
            agentName: this.input,
            starttime: this.dateValue && this.dateValue.length!=0?fmt.date(this.dateValue[0],'yyyy-MM-dd'):'',
            endtime: this.dateValue && this.dateValue.length!=0?fmt.date(this.dateValue[1],'yyyy-MM-dd'):''
          }
          exportt(params).then(res => {
            downloadFile(res, '开户奖励明细.xls')
            this.$message.success('导出成功！');
          })
        },
        search() {
          console.log(this.activeName)
          if (this.activeName == 'tab1') {
            this.currentPage = 1
            this.getOrderList()
          }
          if (this.activeName == 'tab2') {
            this.currentPage1 = 1
            this.collectList()
          }
          if (this.activeName == 'tab3') {
            this.currentPage2 = 1
            this.collitemList()
          }
        },
        handleClick(tab, event) {
          console.log(tab.index);
        },
        handleCurrentChange(val) {
          this.getOrderList()
        },
        handleCurrentChange1(val) {
          this.collectList()
        },
        handleCurrentChange2(val) {
          this.collitemList()
        },
        getOrderList() {
          this.loading = true
          console.log()
          const params = {
            pageNumber: this.currentPage,
            pageSize: 10,
            pageSort: '',
            pageOrder: '',
            agentName: this.input
          }
          getOrderList(params).then(res => {
            this.loading = false
            if (res.code === 200) {
              this.total = res.obj.totalElements
              this.orderList = res.obj.content
            } else {
              this.$message.error('请求失败!');
            }
          }).catch(err => {
              this.$message.error('请求失败!');
              this.loading = false
          })
        },
        collectList() {
          this.loading = true
          console.log()
          const params = {
            pageNumber: this.currentPage1,
            pageSize: 10,
            pageSort: '',
            pageOrder: '',
            agentName: this.input,
            starttime: this.dateValue && this.dateValue.length!=0?fmt.date(this.dateValue[0],'yyyy-MM-dd'):'',
            endtime: this.dateValue && this.dateValue.length!=0?fmt.date(this.dateValue[1],'yyyy-MM-dd'):''
          }
          collectList(params).then(res => {
            this.loading = false
            if (res.code === 200) {
              this.total1 = res.obj.totalElements
              this.order1List = res.obj.content
            } else {
              this.$message.error('请求失败!');
            }
          }).catch(err => {
              this.$message.error('请求失败!');
              this.loading = false
          })
        },
        collitemList() {
          this.loading = true
          console.log()
          const params = {
            pageNumber: this.currentPage2,
            pageSize: 10,
            pageSort: '',
            pageOrder: '',
            agentName: this.input,
            starttime: this.dateValue && this.dateValue.length!=0?fmt.date(this.dateValue[0],'yyyy-MM-dd'):'',
            endtime: this.dateValue && this.dateValue.length!=0?fmt.date(this.dateValue[1],'yyyy-MM-dd'):''
          }
          collitemList(params).then(res => {
            this.loading = false
            if (res.code === 200) {
              this.total2 = res.obj.totalElements
              this.order2List = res.obj.content
            } else {
              this.$message.error('请求失败!');
            }
          }).catch(err => {
              this.$message.error('请求失败!');
              this.loading = false
          })
        },
        editCollect(item) {
          if (!this.bookkeeper) {
            this.$message.error('请填写记账人!');
            return
          }
          item.bookkeeper = this.bookkeeper
          const params = item
          cashCollect(params).then(res => {
            if (res.code === 200) {
              this.$message.success('结算成功!');
              this.visible = false
              this.getOrderList()
            } else {
              this.$message.error('结算失败!');
            }
          }).catch(err => {
              this.$message.error('请求失败!');
              this.loading = false
          })
        }
      },
    }
</script>

<style lang="scss" scoped>
  .text-green {
        color: #52bf00 !important;
    }
    .text-primary {
        color: #409EFF !important;
    }
    .text-danger {
        color: #F56C6C !important;
    }
  .merchant-box {
    padding: 30px;
    .header {
      .header-1 {
        margin-bottom: 20px
      }
      .header-2 {
          display: flex;
          width: 60%;
          justify-content: space-between;
          color:#606266;
      }
    }
    .center {
      margin-top: 20px
    }
  }
</style>
