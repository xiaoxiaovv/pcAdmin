<template>
  <div class="app-container">
    <!--功能-->
    <!--<div class="action-container">
      &lt;!&ndash;商户名&ndash;&gt;
      <el-input v-model="searchForm.name"
                @keyup.enter.native="search"
                placeholder="商户名"
                size="small"
                class="formItem"></el-input>
      &lt;!&ndash;联系人&ndash;&gt;
      <el-input v-model="searchForm.contact"
                @keyup.enter.native="search"
                placeholder="联系人"
                size="small"
                class="formItem"></el-input>
      &lt;!&ndash;按钮&ndash;&gt;
      <el-button type="primary"
                 size="small"
                 @click="search">查询</el-button>
      <el-button type="primary"
                 size="small"
                 @click="reset">重置</el-button>
      <el-button type="primary"
                 size="small"
                 @click="newMerchantOpen">新增</el-button>
    </div>-->

    <!--表格-->
<!--    <div><span>设备供应商ID：{{tableData[0].supplierId}}}</span></div>-->
    <el-table :data="tableData"
              style="width: 100%">
      <el-table-column prop="deviceSn"
                       label="设备序列号">
      </el-table-column>
      <el-table-column prop="shopId"
                       label="门店ID">
      </el-table-column>
      <el-table-column prop="source"
                       label="商户pid">
      </el-table-column>
      <el-table-column label="直连/间联">
        <template slot-scope="scope">
          {{scope.row.merchantIdType === 'direct'?'直连':scope.row.merchantIdType === 'indirect'?'间连':''}}
        </template>
      </el-table-column>
<!--  merchantId    商户角色id。对于直连开店场景，填写商户pid；对于间连开店场景，填写商户smid-->
      <el-table-column  prop="merchantId"
                       label="商户smid">
      </el-table-column>

      <el-table-column label="商户名"
                       width="180">
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
      <el-table-column width="300"
                       label="操作">
        <template slot-scope="scope">
          <!--//如果有方法，传入参数“scope.row”-->
          <!--//如果需要索引，传入参数“scope.$index”-->
          <!--//如果需要当前整页表格数据，传入参数“tableData”-->

          <el-button type="text"
                     @click="openbindRuYiDialog(scope.row)">绑定</el-button>

          <template v-if="userType == '1'">
            <el-button type="text"
                       @click="openAppletConfigDialog(scope.row)">解绑</el-button>
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

        <el-form-item label="设备序列号："
                      show-message
                      prop="deviceSn">
          <el-input v-model="ruYiDataForm.deviceSn"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="门店ID："
                      show-message
                      prop="shopId">
          <el-input v-model="ruYiDataForm.shopId"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="商户pid："
                      show-message
                      prop="source">
          <el-input v-model="ruYiDataForm.source"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="商户ID类型" prop="merchantIdType">

            <el-radio-group v-model="ruYiDataForm.merchantIdType" size="small" @change="changeIdType($event)">
              <el-radio-button label="direct">直连</el-radio-button>
              <el-radio-button label="indirect">间联</el-radio-button>
            </el-radio-group>

        </el-form-item>
        <el-form-item label="商户smid："
                      show-message
                      prop="merchantId">
          <el-input v-model="ruYiDataForm.merchantId"
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
import { getMerchantList, ruYiBind } from '../api/ruYiDevice'
import pagination from '@/components/pagination/index'
// import FollowConfig from './components/followConfig.vue'
// import AliLiftConfig from './components/aliLiftConfig.vue'
import * as validatorRules from '@/utils/validator'

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
      searchForm: {
        name: '', // 公司名
        contact: '' // 联系人，
      },
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
        shopId:'',
        pid:'',

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
    ruYiBind(){
      this.ruYiDataForm.externalId = this.ruYiDataForm.id
      this.ruYiDataForm.supplierId = '201901111100635561'
      // if(this.ruYiDataForm.merchantIdType === 'direct'){}else{}
      this.ruYiDataForm.merchantId = '2088300771125282';
      this.ruYiDataForm.pid = '2088002392388920';



      ruYiBind(this.ruYiDataForm).then(res => {
        let data = res.obj
        console.log(data)
        this.tableData = data.content
        this.totalElements = data.totalElements
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(e => {
        this.loading = false
      })
    },
    /**
     * 打开编辑模态框 获取数据、渲染经营类型、回显经营类型
     */
    openbindRuYiDialog: function (row) {
      console.log(row)
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
    changeIdType(event){

    },
    /**
     * 获取商户列表
     * @param number
     * @param pageSize
     */
    getMerchantList(number, pageSize) {
      this.loading = true
      let companyId = sessionStorage.getItem('companyId')
      getMerchantList(number, pageSize, this.searchForm, companyId).then(res => {
        let data = res.obj
        console.log(data)
        this.tableData = data.content
        this.totalElements = data.totalElements
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(e => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.formItem {
  display: inline-block;
  width: 240px;
  max-width: 100%;
}
</style>
