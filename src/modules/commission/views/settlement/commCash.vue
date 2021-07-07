<template>
  <div class="app-container vm-app-container" v-loading="loading">

    <div class="page-margin-gray"></div>
    <!--表格-->
    <div class="vm-app-bodys" >

      <div class="vm-search-btns vm-padding-lr-0">
        <!--开始时间，结束时间-->
<!--        <el-date-picker v-model="timeDate"-->
<!--                        size="small"-->
<!--                        style="width: 300px;"-->
<!--                        type="daterange"-->
<!--                        value-format="yyyy-MM-dd HH:mm:ss"-->
<!--                        range-separator="~"-->
<!--                        :default-time="['00:00:00', '23:59:59']"-->
<!--                        start-placeholder="佣金开始日期"-->
<!--                        end-placeholder="佣金结束日期">-->
<!--        </el-date-picker>-->
        <!--结算状态-->
<!--        <el-select  placeholder="结算状态"-->
<!--                    size="small"-->
<!--                    class="formItem"-->
<!--                    clearable-->
<!--                    v-model="params.status"-->
<!--                    @change="search">-->
<!--          <el-option v-for="item in statusOption"-->
<!--                     :key="item.value"-->
<!--                     :label="item.name"-->
<!--                     :value="item.value"></el-option>-->
<!--        </el-select>-->
        <!--代理名称-->
        <el-input placeholder="代理商名称"
                  size="small"
                  class="formItem"
                  clearable
                  @keyup.enter.native="search"
                  v-model="params.companyName"></el-input>
        <!--按钮-->
        <el-button type="primary" size="small" @click="search">查询</el-button>


      </div>


      <el-table :data="tableData"
                style="width: 100%"
                class="commission-t-table"
                row-key="id"
                ref="multipleTable"
                @selection-change="handleSelectionChange">

        <el-table-column label="代理商名称" prop="name"></el-table-column>

        <el-table-column label="代理商电话" min-width="100" prop="phone"></el-table-column>

        <el-table-column label="代理商注册时间" min-width="100" prop="createTime"></el-table-column>

        <el-table-column label="代理商所在城市" min-width="100" prop="cityName"></el-table-column>

        <el-table-column label="代理商等级" min-width="100" >
                 <template slot-scope="scope">
                   <span v-if="scope.row.type==-1">管理员</span>
                   <span v-if="scope.row.type==1">服务商</span>
                   <span v-if="scope.row.type==2">一级代理商</span>
                   <span v-if="scope.row.type==3">二级代理商</span>
                   <span v-if="scope.row.type==4">三级代理商</span>

                 </template>
        </el-table-column>


        <el-table-column label="佣金总额" min-width="100" prop="allCommissionTotal"></el-table-column>

        <el-table-column label="可提现金额" min-width="100" prop="canCommission" ></el-table-column>

<!--        <el-table-column label="状态" min-width="100" >-->
<!--          <template slot-scope="scope">-->
<!--            <span v-if="scope.row.status==3">已结算</span>-->
<!--            <span v-if="scope.row.status==5">未结算</span>-->

<!--          </template>-->
<!--        </el-table-column>-->

      </el-table>


    </div>

    <div class="table-foot vm-flex">

      <!-- 分页 -->
      <div class="vm-inline-block vm-flex-1 vm-text-right">
        <pagination ref="page"
                    style="margin-top: 20px !important;"
                    :total-elements="totalElements"
                    :change-callback="expocommissioncommCashrtData" ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import * as commissionApi from '../../api/commission'
import pagination from '@/components/pagination/index'
import Settlement from './components/settlement'
import ExportExcel from './components/exportExcel.vue'
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
        companyName: '',
        status: '',//结算状态
        begin: '',
        end: '',
        type:'',
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



    }
  },
  mounted () {
  },
  created () {//初始化调用

    this.expocommissioncommCashrtData(1,10)
    //this.userType = sessionStorage.getItem('userType')
  },

  // watch: {
  //   timeDate (val, oldVal) {
  //     val = val || []
  //     this.params.begin = val[0] || ''
  //     this.params.end = val[1] || ''
  //   }
  // },
  methods: {
    //佣金结余方法
    expocommissioncommCashrtData (pagenumber, pageSize) {
      console.log(this.params)
      commissionApi.commissioncommCash(pagenumber, pageSize,this.params).then(res => {
        this.tableData = res.obj.content;
        this.totalElements = res.obj.totalElements;

       // this.$message.success('佣金结余')

      })
    },
    search() {//搜索与重置
      this.$refs.page.search()
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






