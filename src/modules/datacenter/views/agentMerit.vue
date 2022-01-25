<template>
  <div class="app-container vm-app-container" v-loading="loading">

    <div class="page-margin-gray"></div>
    <!--表格-->
    <div class="vm-app-bodys" >

      <div class="vm-search-btns vm-padding-lr-0">

      <!--开始时间，结束时间-->
          <el-date-picker v-model="timeDate"
                          size="small"
                          style="width: 300px;"
                          type="daterange"
                          format="yyyy-MM-dd"
                          :picker-options="pickerOptions"
                          :unlink-panels="true"
                         value-format="yyyy-MM-dd"
                         range-separator="~"
                          start-placeholder="佣金开始日期"
                         end-placeholder="佣金结束日期">
         </el-date-picker>
        <!--代理名称-->
        <el-input placeholder="代理商名称"
                  size="small"
                  class="formItem"
                  clearable
                  @keyup.enter.native="search"
                  v-model="params.agentName"></el-input>
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button size="small" @click="exportExcel">导出报表</el-button>
      </div>
      <el-table :data="tableData"
                style="width: 100%;"
                class="commission-t-table"
                row-key="id"
                ref="multipleTable"
                border
                @selection-change="handleSelectionChange">

        <el-table-column label="代理名称" prop="companyName" class="formItem"></el-table-column>

        <el-table-column label="等级" min-width="100" prop="typeName"></el-table-column>

        <el-table-column label="总交易额" min-width="100" prop="orderTotal"></el-table-column>

        <el-table-column label="佣金总额" min-width="100" prop="commissionTotal"></el-table-column>

        <el-table-column label="总代理数" min-width="100" prop="agentTotal"></el-table-column>

        <el-table-column label="新增代理数" min-width="100" prop="agentAdd"></el-table-column>

        <el-table-column label="总商户数" min-width="100" prop="merchantTotal" ></el-table-column>

        <el-table-column label="新增商户数" min-width="100" prop="merchantAdd" ></el-table-column>

      </el-table>


    </div>

    <div class="table-foot vm-flex">

      <!-- 分页 -->
      <div class="vm-inline-block vm-flex-1 vm-text-right">
        <pagination ref="page"
                    style="margin-top: 20px !important;"
                    :total-elements="totalElements"
                    :change-callback="commissionDetailrtData" ></pagination>
      </div>
    </div>


    <el-dialog class="vm-dialog"
               title="导出报表"
               width="498px"
               v-if="detailExportExcel.open"
               :visible.sync="detailExportExcel.open">
      <ExportExcel :propsInfo="detailExportExcel"
                   v-if="detailExportExcel.open"></ExportExcel>
    </el-dialog>


  </div>
</template>

<script>
import * as commissionApi from '../api/orderMerit'
import pagination from '@/components/pagination/index'
import ExportExcel from './components/exportcommdetailExcel.vue'
export default {
  name: 'operator',
  components: {
    pagination,
    ExportExcel
  },
  // mixins: [tableMixin],
  data () {
    return {
      timeDate: [],//时间选择框
      loading: false, // 加载动画
      params: {//参数
        starttime: '',
        endtime: '',
        agentName: ''
      },
      tableData: [//列表数据
      ],
      totalElements: 0,//总数据条数
      tableSelectArr:[],
      sumarryObj: {},

      commissionCount: {
        settleCommisson: 0,
        unSettleCommisson: 0
      },

      detailExportExcel: {
        open: false
      },
      pickerOptions: {
        disabledDate (time) {
          let date = new Date()
          date.setHours(23)
          date.setMinutes(59)
          date.setSeconds(59)
          let status = time.getTime() > date.getTime() - 24 * 60 * 60 * 1000 * 1
          return status
        }
      },
    }
  },
  mounted () {
    this.changeDays(0) // 设置默认日期
  },
  created () {//初始化调用
     this.commissionDetailrtData(1,10)
  },

   watch: {
    timeDate (val, oldVal) {
       val = val || []
       this.params.starttime = val[0] || ''
       this.params.endtime = val[1] || ''
     }
   },
  methods: {
    //佣金明细方法
    commissionDetailrtData (pageNumber, pageSize) {
      this.params.pageNumber = pageNumber
      this.params.pageSize = pageSize
      commissionApi.commDetail(this.params).then(res => {
        this.tableData = res.obj.content;
        this.totalElements = res.obj.totalElements;
      })
    },
    search() {//搜索与重置
      this.$refs.page.search()
    },
    /**
     * 快捷方式修改日期
     * @param event 日期范围选项
     */
    changeDays(event) {
      let timestamp = new Date().getTime()
      // 30天
      let startTime = timestamp - 24 * 60 * 60 * 1000 * 30
      let endTime = timestamp - 24 * 60 * 60 * 1000 * 1
      this.$set(this.timeDate, 0, new Date(startTime))
      this.$set(this.timeDate, 1, new Date(endTime))
    },

    /**
     * 导出结算报表
     * */
    exportExcel () {
      this.detailExportExcel = {
        open: true
      }
    },

    /**
     * 表格左侧选择
     */
    handleSelectionChange (val) {
      this.tableSelectArr = val
    },

  },


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
