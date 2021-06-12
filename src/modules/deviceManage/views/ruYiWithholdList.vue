<template>
  <div class="app-container">
    <!--功能-->
    <div class="action-container">
      <el-input v-model="searchForm.username"
                @keyup.enter.native="search"
                placeholder="真实姓名"
                size="small"
                class="formItem"></el-input>
      <el-select  placeholder="状态"
                  size="small"
                  class="formItem"
                  clearable
                  v-model="searchForm.status"
                  @change="search">
        <el-option key="NORMAL" label="正常" value="NORMAL"></el-option>
        <el-option key="APPLY_UNSIGN" label="申请解约" value="APPLY_UNSIGN"></el-option>
      </el-select>
      <el-input v-model="searchForm.phone"
                @keyup.enter.native="search"
                placeholder="手机号"
                size="small"
                class="formItem"></el-input>
      <el-input v-model="searchForm.aliAccount"
                @keyup.enter.native="search"
                placeholder="支付宝账号"
                size="small"
                class="formItem"></el-input>
      <!--按钮-->
      <el-button type="primary" size="small" @click="search">查询</el-button>
      <el-button type="primary" size="small" @click="reset">重置</el-button>
    </div>

    <!--表格-->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="agreementNo" label="协议编号" width="180"></el-table-column>
      <el-table-column prop="username" label="真实姓名" width="120"></el-table-column>
      <el-table-column prop="alipayLogonId" label="脱敏账号"></el-table-column>
      <el-table-column prop="aliAccount" label="支付宝账号"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column label="绑定状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status=='NORMAL'">正常</span>
          <span v-if="scope.row.status=='APPLY_UNSIGN'">申请解约</span>
        </template>
      </el-table-column>
      <el-table-column label="收货地址">
        <!--防止字符串过长，影响表格，加了一个鼠标经过文字提示-->
        <template slot-scope="scope">
          <el-tooltip effect="dark"
                      :content="scope.row.address"
                      placement="top">
            <span>{{ scope.row.address }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="subPeriod" label="已扣款周期数" width="120"></el-table-column>
      <el-table-column prop="createTime" label="申请日期"></el-table-column>
      <el-table-column prop="updateTime" label="更新日期"></el-table-column>
      <!-- <el-table-column prop="logisticsNum" label="物流单号"></el-table-column>
      <el-table-column prop="logisticsName" label="物流名称"></el-table-column> -->
    </el-table>

    <!--翻页-->
    <pagination :total-elements="totalElements"
                :change-callback="getList"
                ref="page"></pagination>


  </div>
</template>

<script>
import {
  Message,
  MessageBox
} from 'element-ui'
import { getList } from '../api/ruYiWithhold'
import pagination from '@/components/pagination/index'
import * as validatorRules from '@/utils/validator'
import * as advertiseApi from '../../advertisement/api/advManage'

export default {
  name: 'merchant',
  mixins: [],
  components: { pagination },
  data() {
    return {
      searchForm : {//查询条件
        username: '', // 真实姓名
        status: '', // 状态
        phone: '', // 手机号
        aliAccount: '' // 支付宝账号
      },
      comCurrentPage:null, //当前页码
      pageSize:null, //请求条数
      serviceId:'', //服务商id
      loading: true,//加载
      tableData: [], // 表格数据
      totalElements: 0,
    }
  },
  created() {
    this.userType = sessionStorage.getItem('userType')
    if (this.userType == 1  || this.userType == 2 ) {
      this.locationDisabledFlag = false
    }  else {
      this.locationDisabledFlag = true
    }
    this.serviceId = sessionStorage.serviceId
  },
  mounted() {
    this.getList()//获取列表
  },
  watch: {

  },
  methods: {
    /**
     * 获取列表
     * @param number
     * @param pageSize
     */
    getList(number, pageSize) {
      if(number && pageSize){
        this.comCurrentPage = number;
        this.pageSize = pageSize
      }else {
        this.comCurrentPage = null;
        this.pageSize = null
      }
      this.loading = true
      getList(number, pageSize, this.searchForm).then(res => {
        let data = res.obj
        // console.log(data)
        this.tableData = data.list
        this.totalElements = data.total
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(e => {
        this.loading = false
      })
    },

    /**
     * 搜索与重置
     */
    search() {
      this.$refs.page.search()
    },
    reset() {//重置
      // channel 设置为“本商户”
      this.searchForm = {
        username: '', // 真实姓名
        status: '', // 状态
        phone: '', // 手机号
        aliAccount: '' // 支付宝账号
      }// 搜索用的表单
      this.$refs.page.search()
    }

  }
}
</script>

<style scoped>
.danger{
  color:#F56C6C ;
}
.warning{
  color: #E6A23C;
}
.success{
  color:#67C23A ;
}
.formItem {
  display: inline-block;
  width: 240px;
  max-width: 100%;
}
</style>
