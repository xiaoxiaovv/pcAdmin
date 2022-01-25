<template>
  <div class="app-container">
    <div class="tab_header_bar">
      <!--订单编号-->
      <el-input v-model="params.orderNumber" @keyup.enter.native="search" placeholder="订单编号" size="small"
                clearable
                class="formItem block"></el-input>
      <!-- 商户 -->
      <el-input v-model="params.merchantName" @keyup.enter.native="search" placeholder="商户名称" size="small"
                clearable
                class="formItem block"></el-input>
       <el-date-picker
        v-model="date"
        size="small"
        type="daterange"
        class="block"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        :default-time="['00:00:00', '23:59:59']">
      </el-date-picker>
      <!--状态-->
      <el-select v-model="params.payWay" @change="search" clearable placeholder="支付方式" size="small"
                 class="formItem block">
        <el-option
          v-for="item in payWays"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <!--按钮-->
      <el-button type="primary" size="small" @click="search">查询</el-button>
    </div>
    <el-table :data="tableData"
              style="width: 100%">
      <el-table-column prop="merchantName"
                       label="商户名称">
      </el-table-column>
      <el-table-column prop="orderNumber"
                       label="订单编号">
      </el-table-column>
      <el-table-column prop="createTime"
                       label="支付时间" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | date('yyyy-MM-dd hh:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="totalPrice"
                        label="订单金额">
      </el-table-column>
      <el-table-column label="支付方式">
        <template slot-scope="scope">
          {{payWay(scope.row.payWay)}}
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="120">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleToDetail(scope.row)">查看订单
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total-elements="totalElements"
                :change-callback="requestTableList"
                ref="page"></pagination>
    <el-drawer
      title="商品购买列表"
      :visible.sync="drawer"
      :destroy-on-close="true"
      size="40%"
      direction="rtl">
      <el-table
          :data="goodsList"
          stripe
          style="width: 100%">
          <el-table-column
            prop="goodsName"
            align="center"
            label="商品名称">
          </el-table-column>
          <el-table-column
            prop="goodsId"
            align="center"
            label="商品id">
          </el-table-column>
          <el-table-column
            prop="price"
            align="center"
            label="商品单价(元)">
          </el-table-column>
          <el-table-column
            prop="quantity"
            align="center"
            label="商品数量(个)">
          </el-table-column>
        </el-table>
    </el-drawer>
  </div>
</template>

<script>
import pagination from '@/components/pagination/index'
import { getDataList } from '../api/orderMerit'
import { getPayWayOption } from '@/modules/datacenter/api/orderFlow'
export default {
  components: {pagination},
  data () {
    return {
      drawer: false,
      date: [],
      payWays: [],
      goodsList: [],
      totalElements: 0, // 数据条数
      params: {
        orderNumber: '',
        merchantName: '',
        actionCreateTime: '',
        endCreateTime: '',
        payWay: '',
        pageNumber: 1,
        pageSize: 10
      }, // 搜素数据
      tableData: [] // 表格数据
    }
  },
  computed: {
    // 动态计算支付类型
    payWay: function (val) {
      return function (val) {
        let str = '未知'
        let pt = this.payWays
        for (let i in pt) {
          if (pt[i].value == val) {
            str = pt[i].name // 赋值匹配名字
            break // 停止循环
          }
        }
        return str
      }
    }
  },
  mounted () {
    this.getPayWay()
  },
  watch: {
    'date' (val, oldVal) {
      val = val || []
      this.params.actionCreateTime = val[0] || ''
      this.params.endCreateTime = val[1] || ''
    }
  },
  methods: {
    getPayWay() {
      getPayWayOption().then(res => {
        let data = res.obj
        // 获取支付渠道
        this.payWays = data
        this.requestTableList(1,10)
      }).catch(e => {

      })
    },
    // 获取表格数据
    requestTableList (pagenum,pagesize) {
      this.params.pageNumber = pagenum
      this.params.pageSize = pagesize
      getDataList(this.params).then(data => {
        this.tableData = data.obj.list
        this.totalElements = data.obj.total
      })
    },
    search() {
      this.requestTableList()
    },
    // 查看订单
    handleToDetail (item) {
        this.goodsList = item.goodsList
        this.drawer = true
    },
  }
}
</script>
<style>
  .ml10 {
    margin-left:10px;
  }
</style>
<style scoped>
  .formItem {
    display: inline-block;
    width: 200px;
    max-width: 100%;
  }
</style>
