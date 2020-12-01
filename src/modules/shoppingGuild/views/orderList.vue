<template>
  <div class="app-container" v-loading="loading">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column label="订单来源">
        <template slot-scope="scope">
          <template>{{scope.row.fromType === 1?'京东':'拼多多'}}</template>
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <template>{{orderStatusObj[scope.row.orderStatus]}}</template>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNo"
        label="订单号">
      </el-table-column>
      <el-table-column
        prop="skuName"
        label="商品名称">
      </el-table-column>
      <el-table-column label="订单时间">
        <template slot-scope="scope">
          <template>{{scope.row.orderTime | date}}</template>
        </template>
      </el-table-column>
      <el-table-column label="完成时间">
        <template slot-scope="scope">
          <template>{{scope.row.finishTime | date}}</template>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="merchantFee"
        label="商户佣金">
      </el-table-column> -->
      <el-table-column
        prop="companyFee"
        label="佣金">
      </el-table-column>
      <el-table-column
        prop="totalPrice"
        label="商品总价">
      </el-table-column>
      <el-table-column
        prop="skuNum"
        label="数量">
      </el-table-column>
    </el-table>
    <pagination
      :total-elements="totalElements"
      :change-callback="getCompanyOrderList"
      ref="page"></pagination>
  </div>
</template>

<script>
import { getCompanyOrderList } from '../api/commissionApi'
import pagination from '@/components/pagination/index'
import { levelAliasMixin } from '@/mixins'

export default {
  name: 'role',
  mixins: [levelAliasMixin],
  components: {pagination},
  data () {
    return {
      tableData: [], // 表格数据
      totalElements: 0, // 数据条数
      loading: true, // loading效果
      btnLoading: false,
      orderStatusObj: {
        100: '已支付',
        101: '已成团',
        102: '确认收货',
        105: '已经结算',
        16: '已付款',
        17: '已完成',
        18: '已结算'
      }
    }
  },
  mounted () {
    this.getCompanyOrderList(1, 10)
  },
  methods: {
    /*
       * 获取订单列表
       * */
    getCompanyOrderList (pageNumber, pageSize) {
      this.loading = true
      let params = {
        pageNumber,
        pageSize
      }
      getCompanyOrderList(params).then(response => {
        let data = response.obj
        this.tableData = data.content
        this.totalElements = data.totalElements
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  /*20190705*/
  /*xwy*/
  /*change pre tree*/
  .checkbox-table {
    width: 100%;
    margin-top: 20px;
  }

  .check-level-1 {
    font-weight: 600;
  }

  .check-level-1-label {
    font-size: 16px;
    font-weight: bold;
    line-height: 21px;
    color: rgba(62, 189, 255, 1);
  }

  .check-level-2-box {
    margin-bottom: 20px;
  }

  .check-level-2-item {
    display: block;
    margin: 10px 0 5px 40px
  }

  .check-level-2-checkbox {
  }

  .check-level-2-label {
    width: 150px;
    font-size: 14px;
    font-weight: bold;
    line-height: 19px;
    color: rgba(112, 112, 112, 1);
  }

  .check-level-3-box {
    margin-bottom: 10px;
  }

  .check-level-3-item {
    display: inline-block;
    margin: 10px 0 5px 40px
  }

  .check-level-3-label {
    width: 150px;
    font-size: 14px;
    font-weight: 400;
    line-height: 19px;
    color: rgba(112, 112, 112, 1);
  }
  .cirpt-block-height {
    max-height: 60vh;
    overflow-y: auto;
  }
</style>
