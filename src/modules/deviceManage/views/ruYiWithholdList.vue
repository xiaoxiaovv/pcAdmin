<template>
  <div class="app-container">
    <!--功能-->
    <div class="action-container">
      <el-input v-model="searchForm.username" @keyup.enter.native="search" placeholder="真实姓名" size="small" class="formItem"></el-input>
      <el-select placeholder="状态" size="small" class="formItem" clearable v-model="searchForm.status" @change="search">
        <el-option key="NORMAL" label="正常" value="NORMAL"></el-option>
        <el-option key="APPLY_UNSIGN" label="申请解约" value="APPLY_UNSIGN"></el-option>
      </el-select>
      <el-input v-model="searchForm.phone" @keyup.enter.native="search" placeholder="手机号" size="small" class="formItem"></el-input>
      <el-input v-model="searchForm.aliAccount" @keyup.enter.native="search" placeholder="支付宝账号" size="small" class="formItem"></el-input>
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
      <el-table-column label="收货地址" width="200">
        <!--防止字符串过长，影响表格，加了一个鼠标经过文字提示-->
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.address" placement="top">
            <span>{{ scope.row.address }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="subPeriod" label="已扣周期" width="80"></el-table-column>
      <el-table-column prop="createTime" label="申请日期"></el-table-column>
      <el-table-column prop="updateTime" label="更新日期"></el-table-column>
      <el-table-column prop="logisticsNum" label="物流单号"></el-table-column>
      <el-table-column prop="logisticsName" label="物流名称"></el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <!-- 状态 0未支付 1 已支付 2待发货 3已发货 4待评论 5已评论 -->
          <span v-if="scope.row.logisticsStatus=='2'">待发货</span>
          <span v-if="scope.row.logisticsStatus=='3'">已发货</span>
          <span v-if="scope.row.logisticsStatus=='4'">待评论</span>
          <span v-if="scope.row.logisticsStatus=='5'">已评论</span>
        </template>
      </el-table-column>
      <!--操作-->
      <el-table-column fixed="right" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="updateAliWithholdShow(scope.row)" v-if="scope.row.logisticsStatus == 2">发货</el-button>
          <el-button type="text" @click="verifyCodeShow(scope.row)">解约</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--翻页-->
    <pagination :total-elements="totalElements" :change-callback="getList" ref="page"></pagination>


    <!-- 发货模态框 -->
    <el-dialog title="发货" width="500px" :visible.sync="updateAliWithhold" :before-close="updateAliWithholdClose">
      <el-form :model="updateAliWithholdForm" :rules="updateAliWithholdRules" ref="updateAliWithholdForm" label-width="130px"
        size="mini">

        <el-form-item label="物流单号：" show-message prop="logisticsNum">
          <el-input v-model="updateAliWithholdForm.logisticsNum" class="formItem"></el-input>
        </el-form-item>
        <!-- <el-form-item label="物流公司名称：" show-message prop="logisticsName">
          <el-input v-model="updateAliWithholdForm.logisticsName" class="formItem"></el-input>
        </el-form-item> -->
        <el-form-item label="物流公司编号：" show-message prop="logisticsCode">
          <!-- <el-input v-model="updateAliWithholdForm.logisticsCode" class="formItem"></el-input> -->
          <el-select v-model="updateAliWithholdForm.logisticsCode" filterable placeholder="请选择" class="formItem"
            @change="setlogisticsName">
            <el-option v-for="item in aliLogisticsListData" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateAliWithholdClose">取消</el-button>
        <el-button type="primary" @click="updateAliWithholdCommit" :disabled="updateAliWithholdLoading">确定</el-button>
      </span>
    </el-dialog>

    <!-- 确认解约模态框 -->
    <el-dialog title="发货" width="500px" :visible.sync="verifyCode" :before-close="verifyCodeClose">
      <el-form :model="verifyCodeForm" :rules="verifyCodeRules" ref="verifyCodeForm" label-width="130px" size="mini">
        <el-form-item label="短信验证码：" show-message prop="code">
          <el-input v-model="verifyCodeForm.code" class="formItem"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="verifyCodeClose">取消</el-button>
        <el-button type="primary" @click="verifyCodeCommit" :disabled="verifyCodeLoading">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import * as commonApi from '@/api/common'
  import {
    Message,
    MessageBox
  } from 'element-ui'
  import {
    getList,
    getAliLogisticsList,
    updateAliWithhold,
    sendSms,
    verifyCode
  } from '../api/ruYiWithhold' //引入js中的接口方法
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
          username: '', // 真实姓名
          status: '', // 状态
          phone: '', // 手机号
          aliAccount: '' // 支付宝账号
        },
        comCurrentPage: 1, //当前页码
        pageSize: 10, //请求条数
        serviceId: '', //服务商id
        loading: true, //列表加载
        tableData: [], // 表格数据
        totalElements: 0,
        updateAliWithhold: false, //发货模态框展示
        updateAliWithholdForm: { //发货form表单
          id: '', //签约信息id
          logisticsNum: '', //物流单号
          logisticsName: '', //物流公司名称
          logisticsCode: '', //物流公司编码
        },
        updateAliWithholdLoading: false, //发货确认按钮loding
        updateAliWithholdRules: { //发货表单判断规则
          logisticsNum: [{
            required: true,
            message: '请输入物流单号',
            trigger: 'blur'
          }, ],
          logisticsCode: [{
            required: true,
            message: '请选择物流公司',
            trigger: 'blur'
          }, ],
        },
        aliLogisticsListLoading: true, //获取ali物流公司列表加载
        aliLogisticsListData: [], //ali物流公司列表数据

        verifyCode: false, //解约确认模态框展示
        verifyCodeForm: { //发货form表单
          code: '', //短信验证码
          agreementNo: '', //协议编号
        },
        verifyCodeLoading: false, //解约确认按钮loding
        verifyCodeRules: { //解约表单判断规则
          code: [{
            required: true,
            message: '请输入短信验证码',
            trigger: 'blur'
          }, ],
        },

      }
    },
    created() {
      this.userType = sessionStorage.getItem('userType')
      if (this.userType == 1 || this.userType == 2) {
        this.locationDisabledFlag = false
      } else {
        this.locationDisabledFlag = true
      }
      this.serviceId = sessionStorage.serviceId
    },
    mounted() {
      this.getList() //获取列表
      this.getAliLogisticsList() //获取ali物流公司列表
    },
    watch: {

    },
    methods: {
      //解约确认提交
      verifyCodeCommit() {
        this.$refs.verifyCodeForm.validate((valid) => {
          if (valid) { //验证通过
            this.verifyCodeLoading = true;
            //调用确认解约接口
            verifyCode(this.verifyCodeForm).then(res => {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.verifyCode = false //关闭发货模态框
              this.verifyCodeForm = {} //表单置空
              this.verifyCodeLoading = false
              this.getList();//刷新列表
            }).catch(e => {
              this.verifyCodeLoading = false
            })
          } else {
            return false
          }
        })
      },
      /**
       * 解约确认模态框关闭
       */
      verifyCodeClose(row) {
        this.verifyCode = false //关闭发货模态框
        this.verifyCodeForm = {} //表单置空
      },
      //解约确认模态框展示
      verifyCodeShow(row) {
        this.$confirm('协议一旦解约不可逆，是否确认解约', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sendSms().then(res => {
            // console.log("发送验证码成功")
            this.$message({
              message: res.msg,
              type: 'success'
            })
            // console.log("展示模态框")
            //发送成功展示模态框
            this.verifyCode = true //展示解约确认模态框
            this.verifyCodeForm.agreementNo = row.agreementNo //协议编号赋值
            // console.log("协议编号："+this.verifyCodeForm.agreementNo);
          }).catch(e => {
            this.verifyCodeLoading = false
          })

        }).catch(() => {})
      },

      //发货提交
      updateAliWithholdCommit() {
        this.$refs.updateAliWithholdForm.validate((valid) => {
          if (valid) { //验证通过
            this.updateAliWithholdLoading = true;
            //调用发货接口
            updateAliWithhold(this.updateAliWithholdForm).then(res => {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.updateAliWithhold = false //关闭发货模态框
              this.updateAliWithholdForm = {} //表单置空
              this.updateAliWithholdLoading = false//
              this.getList(); //刷新列表

            }).catch(e => {
              this.updateAliWithholdLoading = false
            })

          } else {
            return false
          }
        })
      },
      /**
       * 发货模态框关闭
       */
      updateAliWithholdClose(row) {
        this.updateAliWithhold = false //关闭发货模态框
        this.updateAliWithholdForm = {} //表单置空
      },
      /**
       * 发货模态框展示
       */
      updateAliWithholdShow(row) {
        this.updateAliWithhold = true //展示发货模态框
        this.updateAliWithholdForm.id = row.id
      },
      //change事件赋值物流公司名称
      setlogisticsName(val) {
        var obj = {};
        obj = this.aliLogisticsListData.find(function(item) {
          return item.code === val;
        });
        this.updateAliWithholdForm.logisticsName = obj.name
        // console.log("物流名称为:", this.updateAliWithholdForm.logisticsName, "物流单号为:", val);
      },
      //获取ali物流公司列表
      getAliLogisticsList() {
        this.aliLogisticsListLoading = true
        getAliLogisticsList().then(res => {
          let data = res.obj
          // console.log(data)
          this.aliLogisticsListData = data;
          setTimeout(() => {
            this.aliLogisticsListLoading = false
          }, 500)
        }).catch(e => {
          this.aliLogisticsListLoading = false
        })
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
