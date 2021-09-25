<template>
  <div class="app-container">
    <!--功能-->
    <div class="action-container">
      <!--设备SN-->
      <el-input v-model="searchForm.aliDeviceSn"
                @keyup.enter.native="search"
                placeholder="设备SN"
                size="small"
                class="formItem"></el-input>
      <!--绑定状态-->
      <el-select  placeholder="绑定状态"
                  size="small"
                  class="formItem"
                  clearable
                  v-model="searchForm.aliStatus"
                  @change="search">
        <el-option v-for="item in aliStatusOption"
                   :key="item.value"
                   :label="item.name"
                   :value="item.value"></el-option>
      </el-select>
      <!--商户名-->
      <el-input v-model="searchForm.merchantName"
                @keyup.enter.native="search"
                placeholder="商户名"
                size="small"
                class="formItem"></el-input>
      <!--二维码名称-->
      <el-input v-model="searchForm.name"
                @keyup.enter.native="search"
                placeholder="二维码名称"
                size="small"
                class="formItem"></el-input>
      <!--按钮-->
      <el-button type="primary"
                 size="small"
                 @click="search">查询</el-button>
      <el-button type="primary"
                 size="small"
                 @click="reset">重置</el-button>

    </div>

    <!--表格-->
<!--    <div class="mb10 mt-20 vm-color-6 vm-font-16px"><span>设备供应商ID：{{tableData[0].supplierId}}</span></div>-->
    <el-table :data="tableData"
              height="72vh"
              border
              style="width: 100%">
      <el-table-column prop="aliDeviceSn" label="设备SN"> </el-table-column>
      <el-table-column  prop="aliMerchantId" label="商家ID（直连）"> </el-table-column>
      <el-table-column prop="aliShopId" label="门店ID"> </el-table-column>

      <el-table-column label="绑定状态">
        <template slot-scope="scope">
            <span :class="{warning: scope.row.aliStatus==='1', success: scope.row.aliStatus==='2',  danger: scope.row.aliStatus==='3', }">{{ scope.row.aliStatus==='1'?'未绑定':scope.row.aliStatus==='2'?'已绑定': scope.row.aliStatus==='3'?'已解绑':''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户名">
        <!--防止字符串过长，影响表格，加了一个鼠标经过文字提示-->
        <template slot-scope="scope">
          <el-tooltip effect="dark"
                      :content="scope.row.merchantName"
                      placement="top">
            <span>{{ scope.row.merchantName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="二维码名称"></el-table-column>

      <el-table-column
                       label="操作">
        <template slot-scope="scope">
          <!--//如果有方法，传入参数“scope.row”-->
          <!--//如果需要索引，传入参数“scope.$index”-->
          <!--//如果需要当前整页表格数据，传入参数“tableData”-->
          <el-button type="text"
                     @click="openbindRuYiDialog(scope.row)">绑定</el-button>
          <template  >
<!--            v-if="scope.row.aliStatus==='2'"-->
            <el-button type="text"
                       @click="ruYiUnbindModal(scope.row)">解绑</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!--翻页-->
    <pagination :total-elements="totalElements"
                :change-callback="getMerQrCodeList"
                ref="page"></pagination>


    <!--绑定设备模态框-->
    <el-dialog title="绑定如意设备"
               width="500px"
               :visible.sync="bindRuYiDialogFlag"
               :before-close="bindRuYiDialogClose">

      <el-form :model="ruYiDataForm"
               :rules="Rules"
               ref="ruYiDataForm"
               :label-width="formLabelWidth"
               size="mini">

        <el-form-item label="设备SN："
                      show-message
                      prop="deviceSn">
          <el-input v-model="ruYiDataForm.aliDeviceSn"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="商家ID（直连）："
                      show-message
                      prop="merchantId">
          <el-input v-model="ruYiDataForm.aliMerchantId"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="门店ID："
                      show-message
                      prop="shopId">
          <el-input v-model="ruYiDataForm.aliShopId"
                    class="formItem"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button  @click="bindRuYiDialogClose">取消</el-button>
        <el-button type="primary"
                   @click="ruYiBind()"

                   :disabled="btnLoading">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  Message,
  MessageBox
} from 'element-ui'
import { getMerQrCodeList, ruYiBind, ruYiUnbind } from '../api/ruYiDevice2'
import pagination from '@/components/pagination/index'
// import FollowConfig from './components/followConfig.vue'
// import AliLiftConfig from './components/aliLiftConfig.vue'
import * as validatorRules from '@/utils/validator'
import * as advertiseApi from '../../advertisement/api/advManage'

export default {
  name: 'merchant',
  mixins: [],
  components: { pagination },//分页
  data() {
    return {
      searchForm : {
        merchantName: '', //商户名称
        name: '', //二维码名称
        aliDeviceSn: '', // 如意设备SN
        aliStatus: '', // 绑定状态 1未绑定 2已绑定 3已解绑
      },
      aliStatusOption:[
        {value:1, name: '未绑定'},
        {value:2, name: '已绑定'},
        {value:3, name: '已解绑'},
      ],
      comCurrentPage:null, //当前页码
      pageSize:null, //请求条数
      bindRuYiDialogFlag:false,
      formLabelWidth: '130px',
      serviceId:'', //服务商id
      ruYiDataForm:{
        aliSupplierId:'',
        aliDeviceSn:'',
        aliSource:'',
        aliExternalId:'',
        aliMerchantIdType:'',
        aliMerchantId:'',
        aliShopId:'',
        aliPid:''
      },
      loading: true,
      btnLoading: false,
      tableData: [], // 表格数据
      totalElements: 0,

      /**
       * 判断规则
       */
      Rules: {
        /*name: [
          { required: true, message: '请输入商户名', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],*/
      },


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
    this.getMerQrCodeList(1,10)//获取服务商下所有商户的二维码
  },
  watch: {

  },
  methods: {
    //绑定如意
    ruYiBind(){
      this.loading = true
      /*if(this.ruYiDataForm.merchantIdType === 'direct'){
        this.ruYiDataForm.merchantId = this.ruYiDataForm.merchantIdDirect
      }else if(this.ruYiDataForm.merchantIdType === 'indirect'){
        this.ruYiDataForm.merchantId = this.ruYiDataForm.merchantIdIndirect
      }*/
      this.ruYiDataForm.aliSupplierId = '201901111100635561'  //设备供应商id 死值不会变
      // this.ruYiDataForm.externalId = this.ruYiDataForm.id
      this.ruYiDataForm.aliSource = this.ruYiDataForm.aliMerchantId
      this.ruYiDataForm.aliMerchantIdType = 'direct'

      // this.ruYiDataForm.supplierId = '201901111100635561'
      // if(this.ruYiDataForm.merchantIdType === 'direct'){}else{}
      // this.ruYiDataForm.merchantId = '2088300771125282';
      // this.ruYiDataForm.pid = '2088002392388920';
      ruYiBind(this.ruYiDataForm).then(res => {
        if(this.comCurrentPage && this.pageSize){
          this.getMerQrCodeList(this.comCurrentPage, this.pageSize)
        }else{
          this.getMerQrCodeList()
        }
        this.getMerQrCodeList()
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 3000
        })
        this.bindRuYiDialogFlag = false
        this.loading = false

      }).catch(e => {
        this.loading = false
      })
    },

    //确认解绑如意
    ruYiUnbind(data){
      /*if(this.ruYiDataForm.merchantIdType === 'direct'){
        this.ruYiDataForm.merchantId = this.ruYiDataForm.merchantIdDirect
      }else if(this.ruYiDataForm.merchantIdType === 'indirect'){
        this.ruYiDataForm.merchantId = this.ruYiDataForm.merchantIdIndirect
      }*/
      this.loading = true
      // data.externalId = data.id
      ruYiUnbind(data).then(res => {
        if(this.comCurrentPage && this.pageSize){
          this.getMerQrCodeList(this.comCurrentPage, this.pageSize)
        }else{
          this.getMerQrCodeList()
        }

        this.$message({
          message: res.msg,
          type: 'success',
          duration: 3000
        })
        this.loading = false
        // this.bindRuYiDialogFlag = false

      }).catch(e => {
        this.loading = false
      })
    },

    //解绑按钮
    ruYiUnbindModal(data){
      this.$confirm(`确定要解绑 ${data.aliDeviceSn} 设备吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ruYiUnbind(data)
      }).catch(() => {
      })
    },
    /**
     * 打开编辑模态框
     */
    openbindRuYiDialog: function (row) {
      // 打开模态框
      this.ruYiDataForm = {...row}
      this.bindRuYiDialogFlag = true
    },
    /**
     * 关闭模态框
     */
    bindRuYiDialogClose() {
      this.bindRuYiDialogFlag = false
    },
    /**
     * 获取商户列表
     * @param number
     * @param pageSize
     */
    getMerQrCodeList(number, pageSize) {
      if(number && pageSize){
        this.comCurrentPage = number;
        this.pageSize = pageSize
      }else {
        this.comCurrentPage = null;
        this.pageSize = null
      }

      this.loading = true
      let companyId = sessionStorage.getItem('companyId')
      getMerQrCodeList(number, pageSize, this.searchForm).then(res => {
        let data = res.obj
        console.log(data)
        this.tableData = data.list//数据集合
        this.totalElements = data.total//总数据条数
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
    //重置
    reset() {
      // channel 设置为“本商户”
      this.searchForm = {
        merchantName: '', //商户名称
        name: '', //二维码名称
        aliDeviceSn: '', // 如意设备SN
        aliStatus: '', // 绑定状态 1未绑定 2已绑定 3已解绑
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
