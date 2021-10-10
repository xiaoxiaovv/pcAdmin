<template>
  <div class="merchant-box">
    <div class="header">
      <div class="header-1">
        <el-input
          size='small'
          placeholder="请输入内容"
          style="width: 200px"
          v-model="input"
          clearable>
        </el-input>
        <el-date-picker
          size='small'
          v-model="dateValue"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" size="small" icon="el-icon-search">搜索</el-button>
      </div>
      <div class="header-2">
        <div>
          <i class="el-icon-s-order text-danger"></i>
          <span>订单笔数：1000</span>
        </div>
        <div>
          <i class="el-icon-coin text-primary"></i>
          <span>订单金额：10000000000</span>
        </div>
        <div>
          <i class="el-icon-collection-tag text-green"></i>
          <span>用券数量：234322</span>
        </div>
      </div>
    </div>
    <div class="center">
      <el-table
          :data="tableData"
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
            prop="date"
            label="支付时间">
          </el-table-column>
          <el-table-column
            prop="date"
            label="商户名">
          </el-table-column>
          <el-table-column
            prop="name"
            label="商户账号">
          </el-table-column>
          <el-table-column
            prop="address"
            label="联系人">
          </el-table-column>
          <el-table-column
            prop="address"
            label="联系电话">
          </el-table-column>
          <el-table-column
            prop="address"
            label="经营类别">
          </el-table-column>
          <el-table-column
            prop="address"
            label="归属上级">
          </el-table-column>
          <el-table-column
            prop="address"
            label="归属业务员">
          </el-table-column>
          <el-table-column
            prop="address"
            label="单号">
          </el-table-column>
          <el-table-column
            prop="address"
            label="下单人ID">
          </el-table-column>
          <el-table-column
            prop="address"
            label="实付金额">
          </el-table-column>
          <el-table-column
            prop="address"
            label="是否用券">
          </el-table-column>
         <el-table-column
           prop="address"
           label="状态">
         </el-table-column>
        </el-table>
        <el-pagination
              style="margin-top: 20px"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="100"
              layout="total, prev, pager, next"
              :total="1000">
            </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
      data() {
        return {
          input: '',
          dateValue: '',
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
          tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区'
          }]
        }
      },
      methods: {
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
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
