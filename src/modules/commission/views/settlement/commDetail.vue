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
                               value-format="yyyy-MM-dd HH:mm:ss"
                               range-separator="~"
                               :default-time="['00:00:00', '23:59:59']"
                                start-placeholder="佣金开始日期"
                               end-placeholder="佣金结束日期">
               </el-date-picker>

        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button size="small" @click="exportExcel">导出报表</el-button>




      </div>


      <el-table :data="tableData"
                style="width: 100%;"
                class="commission-t-table"
                row-key="id"
                ref="multipleTable"
                @selection-change="handleSelectionChange">

        <el-table-column label="商户名称" prop="merchantName"></el-table-column>

        <el-table-column label="通道商编/名称" min-width="100" prop="channelMerNo"></el-table-column>

        <el-table-column label="直属代理" min-width="100" prop="directlyAngent"></el-table-column>

        <el-table-column label="交易时间" min-width="100" prop="createTime"></el-table-column>

        <el-table-column label="交易通道" min-width="100" prop="payChannel"></el-table-column>

        <el-table-column label="交易方式" min-width="100" prop="payWay"></el-table-column>

        <el-table-column label="实际支付金额" min-width="100" prop="orderPrice" ></el-table-column>

        <el-table-column label="费率" min-width="100" prop="merchantPayRate" ></el-table-column>

        <el-table-column label="商户总手续费" min-width="100" prop="merchantPayCharge" ></el-table-column>

        <el-table-column label="支付状态" min-width="100" >
          <template slot-scope="scope">
            <span v-if="scope.row.orderStatus==1">未支付</span>
            <span v-if="scope.row.orderStatus==2">已支付</span>

          </template>
        </el-table-column>

        <el-table-column label="总平台" min-width="100" prop="oemName" ></el-table-column>

        <el-table-column label="总平台分润" min-width="100" prop="oemCommissionNew" ></el-table-column>

        <el-table-column label="一级代理" min-width="100" prop="firstName" ></el-table-column>

        <el-table-column label="一级代理商结算" min-width="100" prop="firstPayRate" ></el-table-column>

        <el-table-column label="一级代理分润" min-width="100" prop="firstCommissionNew" ></el-table-column>

        <el-table-column label="二级代理" min-width="100" prop="secondName" ></el-table-column>

        <el-table-column label="二级代理商结算" min-width="100" prop="secondPayRate" ></el-table-column>

        <el-table-column label="二级代理分润" min-width="100" prop="secondCommissionNew" ></el-table-column>

        <el-table-column label="三级代理" min-width="100" prop="thirdName" ></el-table-column>

        <el-table-column label="三级代理商结算" min-width="100" prop="thirdPayRate" ></el-table-column>

        <el-table-column label="三级代理分润" min-width="100" prop="thirdCommissionNew" ></el-table-column>




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
import * as commissionApi from '../../api/commission'
import pagination from '@/components/pagination/index'
import Settlement from './components/settlement'
import ExportExcel from './components/exportcommdetailExcel.vue'
import { tableMixin  } from '@/mixins'
import ImgShow from '@/components/imgShow/index'
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
      timeDate: [],//时间选择框
      loading: false, // 加载动画
      // statusOption: [//结算状态下拉选项数据
      //   {
      //     value: 3,
      //     name: '已结算'
      //   },
      //   {
      //     value: 5,
      //     name: '未结算'
      //   }
      // ],


      params: {//筛选参数
        orderPrice: '',
        payChannel: '',
        begin: '',
        end: '',
        payWay:'',
        serviceRate: '',
        oemCommissionNew: '',
        firstCommissionNew: '',
        secondCommissionNew: '',
        thirdCommissionNew:'',
        oemPayRate: '',
        firstPayRate: '',
        secondPayRate: '',
        thirdPayRate: '',
        merchantPayRate:'',
        orderId: '',
        merchantName: '',
        merchantId: '',
        directlyAngent: '',
        oemName:'',
        firstName: '',
        secondName: '',
        thirdName: '',
        orderStatus: '',
        payWayName:'',
        payChannelName: '',
        channelMerNo: '',


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
      }
    }
  },
  mounted () {
    this.changeDays() // 设置默认日期
  },
  created () {//初始化调用

     // this.commissionDetailrtData(1,10)
  },

   watch: {
    timeDate (val, oldVal) {
       val = val || []
       this.params.begin = val[0] || ''
       this.params.end = val[1] || ''
     }
   },
  methods: {
    //佣金明细方法
    commissionDetailrtData (pageNumber, pageSize) {
      console.log(this.params)
      commissionApi.commDetail(pageNumber, pageSize,this.params).then(res => {
        this.tableData = res.obj.content;
        this.totalElements = res.obj.totalElements;

        // this.$message.success('佣金明细')

      })
    },
    search() {//搜索与重置
      this.$refs.page.search()
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






