<template>
  <div class="merchant-box">
    <div class="header">
      <div class="header-1">
        <el-input
          size='small'
          placeholder="请输入商户名称"
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
        <el-button type="primary" size="small" icon="el-icon-search" @click="getdayList">搜索</el-button>
        <el-upload
          style="margin-top: 20px;"
          :show-file-list="false"
          accept=".xls,.xlsx"
          :action="url + '/merchant/commission_day/importCommissionDay'"
          :on-success="handleSuccess">
          <el-button size="small" type="primary">导入数据</el-button>
          <span slot="tip" class="el-upload__tip">(只能导入xls/xlsx文件)</span>
        </el-upload>
      </div>
      <div class="header-2">
        <!-- <div>
          <i class="el-icon-s-order text-danger"></i>
          <span>订单笔数：{{ total }}</span>
        </div> -->
        <!-- <div>
          <i class="el-icon-coin text-primary"></i>
          <span>订单金额：10000000000</span>
        </div>
        <div>
          <i class="el-icon-collection-tag text-green"></i>
          <span>用券数量：234322</span>
        </div> -->
      </div>
    </div>
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
            prop="createTime"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="paltform"
            label="支付平台">
          </el-table-column>
          <el-table-column
            prop="merchantName"
            label="商户名">
          </el-table-column>
          <el-table-column
            prop="totalOrder"
            label="日总订单数">
          </el-table-column>
          <el-table-column
            prop="washSale"
            label="虚假交易订单数">
          </el-table-column>
          <el-table-column
            prop="commission"
            label="佣金金额(¥)">
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
  </div>
</template>

<script>
  import { getdayList } from '../api/reward.js'
  import {url} from '@/utils/request'
  import { fmt } from '@/utils/dateFmt.js'
  export default {
      data() {
        return {
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
          orderList: [],
          url: '',
        }
      },
      mounted() {
        this.url = url
        this.getdayList()
      },
      methods: {
        handleCurrentChange(val) {
          this.getdayList()
        },
        getdayList() {
          this.loading = true
          console.log()
          const params = {
            pageNumber: this.currentPage,
            pageSize: 10,
            pageSort: '',
            pageOrder: '',
            paltform: '',
            merchantName: this.input,
            starttime: this.dateValue && this.dateValue.length!=0?fmt.date(this.dateValue[0],'yyyy-MM-dd'):'',
            endtime: this.dateValue && this.dateValue.length!=0?fmt.date(this.dateValue[1],'yyyy-MM-dd'):''
          }
          getdayList(params).then(res => {
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
        handleSuccess(res) {
          if(res.code === 200) {
            this.$message.success('导入成功!');
            this.getdayList()
          } else {
            this.$message.error('导入失败!');
          }
        },
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
