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
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="结算汇总" name="tab1">
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
                  prop="applyAmount"
                  label="已结算金额">
                </el-table-column>
                <el-table-column
                  prop="bankAccount"
                  label="户名">
                </el-table-column>
                <el-table-column
                  prop="bankName"
                  label="银行名称">
                </el-table-column>
                <el-table-column
                  prop="cardNo"
                  label="银行卡号">
                </el-table-column>
                <el-table-column
                  label="待结算金额">
                  <template slot-scope="scope">
                    <span style="color: red;">{{scope.row.canCashAmount.toFixed(2)}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="140">
                  <template slot-scope="scope">
                    <el-popover
                      placement="top"
                      width="160"
                      v-model="visible">
                      <el-input
                        size='small'
                        placeholder="请输入记账人"
                        v-model="bookkeeper"
                        clearable>
                      </el-input>
                      <div style="text-align: right; margin-top: 10px">
                        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="editCollect(scope.row)">确定</el-button>
                      </div>
                      <el-button slot="reference" type="text" size="mini" icon="el-icon-mouse" v-show="scope.row.canCashAmount>0">结算</el-button>
                    </el-popover>
                    <el-button type="text" disabled size="mini" @click="editCollect(scope.row)" v-if="scope.row.canCashAmount<=0">已结算</el-button>
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
        <el-tab-pane label="代理商结算明细" name="tab2">
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
                <el-table-column
                  prop="createTime"
                  label="创建时间">
                </el-table-column>
                </el-table-column>
                <el-table-column
                  label="结算金额">
                  <template slot-scope="scope">
                    <span style="color: red;">{{scope.row.cashOutAmount.toFixed(2)}}</span>
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
                  prop="createTime"
                  label="创建时间">
                </el-table-column>
                <el-table-column
                  prop="merchantName"
                  label="商户名称">
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
  import { getOrderList, cashCollect, collectList, collitemList } from '../api/merchant.js'
  import { fmt } from '@/utils/dateFmt.js'
  export default {
      data() {
        return {
          activeName: 'tab1',
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
          order2List: []
        }
      },
      mounted() {
        this.getOrderList()
        this.collectList()
        this.collitemList()
      },
      methods: {
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
            agentName: this.input,
            starttime: this.dateValue && this.dateValue.length!=0?fmt.date(this.dateValue[0],'yyyy-MM-dd'):'',
            endtime: this.dateValue && this.dateValue.length!=0?fmt.date(this.dateValue[1],'yyyy-MM-dd'):''
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
