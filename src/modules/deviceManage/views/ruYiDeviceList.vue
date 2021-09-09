<template>
  <div class="app-container">
    <!--功能-->
    <div class="action-container">
      <!--设备SN-->
      <el-input v-model="searchForm.deviceSn"
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
      <el-input v-model="searchForm.name"
                @keyup.enter.native="search"
                placeholder="商户名"
                size="small"
                class="formItem"></el-input>
      <!--联系人-->
      <el-input v-model="searchForm.contact"
                @keyup.enter.native="search"
                placeholder="联系人"
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
              border
              style="width: 100%">
      <el-table-column prop="deviceSn"
                       label="设备SN">
      </el-table-column>
      <el-table-column prop="alipayAccount"
                       label="支付宝账号">
      </el-table-column>
      <!--<el-table-column prop="supplierId"
                       label="设备供应商ID">
      </el-table-column>-->
      <el-table-column  prop="merchantId"
                        label="商家ID（直连）">
      </el-table-column>
      <el-table-column prop="shopId"
                       label="门店ID">
      </el-table-column>
     <!-- <el-table-column prop="source"
                       label="受理商户的ISV在支付宝的pid">
      </el-table-column>-->
      <!--<el-table-column label="直连/间联">
        <template slot-scope="scope">
          {{scope.row.merchantIdType === 'direct'?'直连':scope.row.merchantIdType === 'indirect'?'间连':''}}
        </template>
      </el-table-column>-->
<!--  merchantId    商户角色id。对于直连开店场景，填写商户pid；对于间连开店场景，填写商户smid-->
  <!--    <el-table-column  prop="merchantIdIndirect"
                       label="商户smid">
      </el-table-column>

      <el-table-column  prop="pid"
                        label="smid关联的pid">
      </el-table-column>-->
      <el-table-column label="绑定状态">
        <template slot-scope="scope">

            <span :class="{warning: scope.row.aliStatus==='1', success: scope.row.aliStatus==='2',  danger: scope.row.aliStatus==='3', }">{{ scope.row.aliStatus==='1'?'未绑定':scope.row.aliStatus==='2'?'已绑定': scope.row.aliStatus==='3'?'已解绑':''}}</span>

        </template>
      </el-table-column>
      <el-table-column label="商户名"
                       >
        <!--防止字符串过长，影响表格，加了一个鼠标经过文字提示-->
        <template slot-scope="scope">
          <el-tooltip effect="dark"
                      :content="scope.row.name"
                      placement="top">
            <span>{{ scope.row.name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="contact"
                       label="联系人">
      </el-table-column>
      <el-table-column prop="phone"
                       width="140"
                       label="联系电话">
      </el-table-column>
      <el-table-column prop="companyName"
                       label="归属上级">
      </el-table-column>
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
                :change-callback="getMerchantList"
                ref="page"></pagination>


    <!--修改模态框-->
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
          <el-input v-model="ruYiDataForm.deviceSn"
                    class="formItem"></el-input>
        </el-form-item>
        <!--<el-form-item label="设备供应商ID："
                      show-message
                      prop="supplierId">
          <el-input v-model="ruYiDataForm.supplierId"
                    class="formItem"></el-input>
        </el-form-item>-->
        <el-form-item label="商家ID（直连）："
                      show-message
                      prop="merchantId">
          <el-input v-model="ruYiDataForm.merchantId"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="门店ID："
                      show-message
                      prop="shopId">
          <el-input v-model="ruYiDataForm.shopId"
                    class="formItem"></el-input>
        </el-form-item>
        <!--<el-form-item label="受理商户的ISV在支付宝的pid："
                      show-message
                      prop="source">
          <el-input v-model="ruYiDataForm.source"
                    class="formItem"></el-input>
        </el-form-item>-->
        <!--<el-form-item label="商户ID："
                      show-message
                      prop="source">
          <el-input v-model="ruYiDataForm.externalId"
                    class="formItem"></el-input>
        </el-form-item>-->
        <!--<el-form-item label="商户ID类型" prop="merchantIdType">

            <el-radio-group v-model="ruYiDataForm.merchantIdType" size="small" @change="changeIdType($event)">
              <el-radio-button label="direct">直连</el-radio-button>
              <el-radio-button label="indirect">间联</el-radio-button>
            </el-radio-group>

        </el-form-item>-->
        <!--<el-form-item label="商户smid（间连）："
                      show-message
                      prop="merchantIdIndirect">
          <el-input v-model="ruYiDataForm.merchantIdIndirect"
                    class="formItem"></el-input>
        </el-form-item>-->

        <!--<el-form-item label="smid关联的pid（间连）："
                      show-message
                      prop="merchantIdDirect">
          <el-input v-model="ruYiDataForm.pid"
                    class="formItem"></el-input>
        </el-form-item>-->
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
import { getMerchantList, ruYiBind, ruYiUnbind } from '../api/ruYiDevice'
import pagination from '@/components/pagination/index'
// import FollowConfig from './components/followConfig.vue'
// import AliLiftConfig from './components/aliLiftConfig.vue'
import * as validatorRules from '@/utils/validator'
import * as advertiseApi from '../../advertisement/api/advManage'

export default {
  name: 'merchant',
  mixins: [],
  components: { pagination },
  data() {
    const validPhone = (rule, value, callback, source, options) => {
      let errors = []
      let regRule = /^1\d{10}$/
      let valid = regRule.test(value)
      if (!valid) {
        errors.push('请输入11位有效手机号')
      }
      callback(errors)
    }
    return {
      searchForm : {
        name: '', // 公司名
        contact: '', // 联系人，
        deviceSn: '', // 设备SN，
        aliStatus: '' // 绑定状态，
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
        supplierId:'',
        deviceSn:'',
        source:'',
        externalId:'',
        merchantIdType:'',
        merchantId:'',
       /* merchantIdDirect:'',
        merchantIdIndirect:'',*/
        shopId:'',
        pid:''
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
        ],
        contact: [
          { required: true, message: '请输入联系人名字', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系人手机号', trigger: 'blur' },
          { required: true, validator: validPhone }
          // {min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur'}
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' }
        ],
        provInfo: [
          { required: true, message: '请选择省份城市/县' }
        ],
        province: [
          { required: true, message: '请选择省份', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请选择城市/县', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入具体的地址', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        type1: [
          { required: true, message: '请选择经营类别', trigger: 'blur' }
        ],
        businessLevOne: [
          { required: true, message: '请选择一级经营类别' }
        ],
        businessLevTwo: [
          { required: true, message: '请选择二级经营类别' }
        ],
        businessLevThree: [
          { required: true, message: '请选择三级经营类别' }
        ]*/
      },
      /**
       * 公众号关注配置
       * */
      fallowObj: {
        open: false
      },
      // 支付宝生活号配置
      dialogAliListNumConfig: {
        open: false
      }
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
    this.getMerchantList()
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
      this.ruYiDataForm.supplierId = '201901111100635561'  //设备供应商id 死值不会变
      this.ruYiDataForm.externalId = this.ruYiDataForm.id
      this.ruYiDataForm.source = this.ruYiDataForm.merchantId
      this.ruYiDataForm.merchantIdType = 'direct'

      // this.ruYiDataForm.supplierId = '201901111100635561'
      // if(this.ruYiDataForm.merchantIdType === 'direct'){}else{}
      // this.ruYiDataForm.merchantId = '2088300771125282';
      // this.ruYiDataForm.pid = '2088002392388920';
      ruYiBind(this.ruYiDataForm).then(res => {
        if(this.comCurrentPage && this.pageSize){
          this.getMerchantList(this.comCurrentPage, this.pageSize)
        }else{
          this.getMerchantList()
        }
        this.getMerchantList()
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

    //解绑如意
    ruYiUnbind(data){
      /*if(this.ruYiDataForm.merchantIdType === 'direct'){
        this.ruYiDataForm.merchantId = this.ruYiDataForm.merchantIdDirect
      }else if(this.ruYiDataForm.merchantIdType === 'indirect'){
        this.ruYiDataForm.merchantId = this.ruYiDataForm.merchantIdIndirect
      }*/
      this.loading = true
      data.externalId = data.id
      ruYiUnbind(data).then(res => {
        if(this.comCurrentPage && this.pageSize){
          this.getMerchantList(this.comCurrentPage, this.pageSize)
        }else{
          this.getMerchantList()
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
    ruYiUnbindModal(data){
      this.$confirm(`确定要解绑 ${data.deviceSn} 设备吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ruYiUnbind(data)
      }).catch(() => {
      })
    },
    /**
     * 打开编辑模态框 获取数据、渲染经营类型、回显经营类型
     */
    openbindRuYiDialog: function (row) {

      console.log(row)
      // 打开模态框
     this.ruYiDataForm = {...row}
      /*if(this.ruYiDataForm.merchantIdType === 'direct'){
        this.ruYiDataForm.merchantIdDirect = this.ruYiDataForm.merchantId
      }else if(this.ruYiDataForm.merchantIdType === 'indirect'){
        this.ruYiDataForm.merchantIdIndirect = this.ruYiDataForm.merchantId
      }*/
      this.bindRuYiDialogFlag = true
    },
    /**
     * 关闭模态框
     */
    bindRuYiDialogClose() {
      this.bindRuYiDialogFlag = false
    },
    changeIdType(event){
      /*if(event === 'direct'){
        this.ruYiDataForm.merchantId = this.ruYiDataForm.merchantIdDirect
      }else if(event === 'indirect'){
        this.ruYiDataForm.merchantId = this.ruYiDataForm.merchantIdIndirect
      }*/

    },
    /**
     * 获取商户列表
     * @param number
     * @param pageSize
     */
    getMerchantList(number, pageSize) {
      if(number && pageSize){
        this.comCurrentPage = number;
        this.pageSize = pageSize
      }else {
        this.comCurrentPage = null;
        this.pageSize = null
      }

      this.loading = true
      let companyId = sessionStorage.getItem('companyId')
      getMerchantList(number, pageSize, this.searchForm, companyId).then(res => {
        let data = res.obj
        console.log(data)
        this.tableData = data.content
        /*this.tableData.forEach(item=>{
          if(item.merchantIdType === 'direct'){
            item.merchantIdDirect = item.merchantId
          }else if(item.merchantIdType === 'indirect'){
            item.merchantIdIndirect = item.merchantId
          }
        })*/
        this.totalElements = data.totalElements
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
    reset() {
      // channel 设置为“本商户”
      this.searchForm = {
        name: '', // 公司名
        contact: '', // 联系人，
        deviceSn: '', // 设备SN，
        aliStatus: '' // 绑定状态，
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
