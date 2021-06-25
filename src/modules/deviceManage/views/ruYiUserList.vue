<template>
  <div class="app-container">
    <!--功能-->
    <div class="action-container">
      <el-input v-model="searchForm.nickName" @keyup.enter.native="search" placeholder="昵称" size="small" class="formItem"></el-input>
      <el-select placeholder="状态" size="small" class="formItem" clearable v-model="searchForm.authStatus" @change="search">
        <el-option key="1" label="已授权" value="1"></el-option>
        <el-option key="0" label="未授权" value="0"></el-option>
      </el-select>
      <el-input v-model="searchForm.userId" @keyup.enter.native="search" placeholder="支付宝user_id" size="small" class="formItem"></el-input>
      <!--按钮-->
      <el-button type="primary" size="small" @click="search">查询</el-button>
      <el-button type="primary" size="small" @click="reset">重置</el-button>
    </div>

    <!--表格-->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="avatar" label="头像" width="80">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" width="40" height="40"/>
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="ali用户id" ></el-table-column>
      <el-table-column prop="nickName" label="昵称" ></el-table-column>
      <el-table-column prop="gender" label="性别" >
        <template slot-scope="scope">
          <span v-if="scope.row.gender=='F' || scope.row.gender=='f'">女</span>
          <span v-if="scope.row.gender=='M' || scope.row.gender=='m'">男</span>
        </template>
      </el-table-column>
      <el-table-column label="授权状态">
        <template slot-scope="scope">
          <span v-if="scope.row.authStatus=='1'">已授权</span>
          <span v-if="scope.row.authStatus=='0'">未授权</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请日期"></el-table-column>
      <!-- <el-table-column prop="updateTime" label="更新日期"></el-table-column> -->
      <!--操作-->
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="rooterDeatil(scope.row)">资料详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--翻页-->
    <pagination :total-elements="totalElements" :change-callback="getList" ref="page"></pagination>


  </div>
</template>

<script>
  import * as commonApi from '@/api/common'
  import {
    Message,
    MessageBox
  } from 'element-ui'
  import {
    getList
  } from '../api/ruYiUser' //引入js中的接口方法
  import pagination from '@/components/pagination/index'
  import * as validatorRules from '@/utils/validator'
  import * as advertiseApi from '../../advertisement/api/advManage'

  export default {
    name: 'merchant',
    mixins: [],
    components: {
      pagination
    },
    data() {
      return {
        searchForm: { //查询条件
          userId: '', //支付宝user_id
          authStatus: '', // 状态1已授权0未授权
          nickName: '', //昵称
        },
        comCurrentPage: 1, //当前页码
        pageSize: 10, //请求条数
        serviceId: '', //服务商id
        loading: true, //列表加载
        tableData: [], // 表格数据
        totalElements: 0,

      }
    },
    created() {
      // this.userType = sessionStorage.getItem('userType')
      // if (this.userType == 1 || this.userType == 2) {
      //   this.locationDisabledFlag = false
      // } else {
      //   this.locationDisabledFlag = true
      // }
      // this.serviceId = sessionStorage.serviceId
    },
    mounted() {
      this.getList() //获取列表
    },
    watch: {

    },
    methods: {
      // 跳转到详情页
      rooterDeatil (data) {
        if(data.userInfoDto && data.userInfo){
          this.$router.push({path: '/deviceManage/views/ruYiUserDetail', query: {data: data.userInfoDto}})
        }else{
          this.$message({
            message: "该用户暂无资料",
            type: 'error'
          })
        }

      },
      /**
       * 获取列表
       * @param number
       * @param pageSize
       */
      getList(number, pageSize) {
        if (number && pageSize) {
          this.comCurrentPage = number;
          this.pageSize = pageSize
        }
        this.loading = true
        getList(this.comCurrentPage, this.pageSize, this.searchForm).then(res => {
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
      reset() { //重置
        // channel 设置为“本商户”
        this.searchForm = {
          username: '', // 真实姓名
          status: '', // 状态
          phone: '', // 手机号
          aliAccount: '' // 支付宝账号
        } // 搜索用的表单
        this.$refs.page.search()
      }

    }
  }
</script>

<style scoped>
  .danger {
    color: #F56C6C;
  }

  .warning {
    color: #E6A23C;
  }

  .success {
    color: #67C23A;
  }

  .formItem {
    display: inline-block;
    width: 240px;
    max-width: 100%;
  }
</style>
