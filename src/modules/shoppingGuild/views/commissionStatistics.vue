<template>
  <div class="app-container" v-loading="loading">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column label="审核时间">
        <template slot-scope="scope">
          <template v-if="scope.row.auditTime">{{scope.row.auditTime | date}}</template>
          <template v-else>-</template>
        </template>
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="服务商名称" v-if="!userType">
      </el-table-column>
      <el-table-column
        prop="companyFee"
        label="服务商佣金">
      </el-table-column>
      <el-table-column
        prop="merchantName"
        label="商户名称"  v-if="!userType">
      </el-table-column>
      <el-table-column
        prop="merchantFee"
        label="商户佣金" v-if="!userType">
      </el-table-column>
      <el-table-column
        prop="orderNum"
        label="订单数量">
      </el-table-column>
      <el-table-column
        prop="price"
        label="订单总价">
      </el-table-column>
      <el-table-column label="提现状态">
         <template slot-scope="scope">
          <template>{{auditStatusObj[scope.row.auditStatus]}}</template>
        </template>
      </el-table-column>
      <el-table-column
        prop="statisTime"
        label="统计日期">
        <template slot-scope="scope">
          <template v-if="scope.row.statisTime">{{scope.row.statisTime | filterDate}}</template>
          <template v-else>-</template>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150" v-if="!userType">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            v-if="scope.row.auditStatus===0"
            @click="handleAudit(scope.row.id, 2)">结算
          </el-button>
          <el-button
            size="mini"
            type="primary"
            v-if="scope.row.auditStatus===0"
            @click="handleAudit(scope.row.id, 3)">拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total-elements="totalElements"
      :change-callback="getStatisList"
      ref="page"></pagination>
  </div>
</template>

<script>
import { getStatisList, setAudit, getCompanyStatisList } from '../api/commissionApi'
import pagination from '@/components/pagination/index'
import { levelAliasMixin } from '@/mixins'

export default {
  mixins: [levelAliasMixin],
  components: {pagination},
  data () {
    return {
      auditStatusObj: {
        0: '未结算',
        1: '已申请',
        2: '已结算',
        3: '已拒绝'
      },
      tableData: [], // 表格数据
      totalElements: 0, // 数据条数
      loading: true, // loading效果
      btnLoading: false,
      userType: null,
      formLabelWidth: '150px' // label宽度
    }
  },
  filters: {
    filterDate (val) {
      let time = val ? val.split(' ')[0] : '-'
      return time
    }
  },
  created () {
    let sessionStorageVal = sessionStorage
    let userType = parseInt(sessionStorageVal.userType)
    this.userType = userType
  },
  mounted () {
    this.getStatisList(1, 10)
  },
  methods: {
    // 结算|拒绝
    handleAudit (id, auditStatus) {
      setAudit({id, auditStatus}).then(res => {
        this.$refs.page.refresh()
      })
    },
    /*
       * 获取角色列表
       * */
    getStatisList (pageNumber, pageSize) {
      this.loading = true
      let params = {
        pageNumber,
        pageSize
      }
      var getApi = ''
      if (this.userType === 1) { // 贴牌商
        getApi = getCompanyStatisList(params)
      } else {
        getApi = getStatisList(params)
      }
      if (!getApi) return
      getApi.then(response => {
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
