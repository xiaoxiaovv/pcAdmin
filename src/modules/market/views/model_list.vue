<template>
  <div class="merchant-box">
    <div class="header">
      <div class="header-1">
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
        <el-button type="primary" size="small" icon="el-icon-search" @click="getModelList">搜索</el-button>
      </div>
      <div class="header-2">
        <div>
          <i class="el-icon-s-order text-danger"></i>
          <span>模板数：{{ total }}</span>
        </div>
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
          height="77vh"
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
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="templateId"
            label="模板ID">
          </el-table-column>
          <el-table-column
            prop="floorAmount"
            label="券使用门槛(元)">
          </el-table-column>
          <el-table-column
            prop="voucherQuantity"
            label="券数量">
          </el-table-column>
          <el-table-column
            prop="brandName"
            label="券类型">
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="备注">
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
  import { getModelList } from '../api/model.js'
  import { fmt } from '@/utils/dateFmt.js'
  export default {
      data() {
        return {
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
          orderList: []
        }
      },
      mounted() {
        this.getModelList()
      },
      methods: {
        handleCurrentChange(val) {
          this.getModelList()
        },
        getModelList() {
          this.loading = true
          const params = {
            pageNumber: this.currentPage,
            pageSize: 10,
            pageSort: '',
            pageOrder: '',
            starttime: this.dateValue && this.dateValue.length!=0?fmt.date(this.dateValue[0],'yyyy-MM-dd'):'',
            endtime: this.dateValue && this.dateValue.length!=0?fmt.date(this.dateValue[1],'yyyy-MM-dd'):''
          }
          getModelList(params).then(res => {
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
