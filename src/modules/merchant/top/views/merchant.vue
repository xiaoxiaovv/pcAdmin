<template>
  <div class="app-container">
    <!--功能-->
    <div class="action-container">
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
      <el-button type="primary"
                 size="small"
                 @click="newMerchantOpen">新增</el-button>
    </div>

    <!--表格-->
    <el-table :data="tableData"
              style="width: 100%">
      <el-table-column type="index"
                       label="序号"
                       width="50">
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
      <el-table-column prop="phone"
                       label="商户账号">
      </el-table-column>
      <el-table-column prop="contact"
                       label="联系人">
      </el-table-column>
      <el-table-column prop="phone"
                       width="140"
                       label="联系电话">
      </el-table-column>
      <el-table-column label="经营类别">
        <template slot-scope="scope">
          <span>{{ scope.row.businessLevOne }}-{{ scope.row.businessLevTwo }}-{{ scope.row.businessLevThree }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="companyName"
                       label="归属上级">
      </el-table-column>
      <el-table-column prop="managerName"
                       label="归属业务员">
      </el-table-column>
      <el-table-column prop="status"
                       width="60"
                       label="签约状态">
        <template slot-scope="scope">
          {{showSignStatus(scope.row.signStatus)}}
          <!--
          <template v-if="scope.row.status===1">签约</template>
          <template v-else-if="scope.row.status===2">未签约</template>
          -->
        </template>
      </el-table-column>
      <el-table-column width="300"
                       label="操作">
        <template slot-scope="scope">
          <!--//如果有方法，传入参数“scope.row”-->
          <!--//如果需要索引，传入参数“scope.$index”-->
          <!--//如果需要当前整页表格数据，传入参数“tableData”-->
          <el-button type="text"
                     @click="rooterDeatil(scope.row)">详情</el-button>
          <el-button type="text"
                     @click="openEditMerchant(scope.row)">修改</el-button>
          <el-button type="text"
                     @click="resetPassword(scope.row)">重置密码</el-button>
          <template v-if="userType == '1'">
            <el-button type="text"
                       @click="openAppletConfigDialog(scope.row)">小程序配置</el-button>
            <el-button type="text"
                       @click="openWechatConfig(scope.row)">小程序授权</el-button>
            <el-button type="text"
                       @click="deployWechat(scope.row)">小程序提交审核</el-button>
            <el-button type="text"
                       @click="experienceWechat(scope.row)">体验小程序</el-button>
            <el-button type="text"
                       @click="lookWechatStatus(scope.row)">小程序审核状态</el-button>
            <el-button type="text"
                       @click="releaseWechat(scope.row)">小程序正式发布</el-button>
            <el-button type="text"
                       @click="editStatus(scope.row)"
                       v-if="scope.row.signStatus===3">{{scope.row.status===1?'禁用':'启用'}}</el-button>
            <!--<el-button type="text" @click="openAppletConfigDialog(scope.row, true)">微信推荐关注配置</el-button>-->
            <el-button type="text"
                       @click="aliLiftNumConfig(scope.row)">支付宝生活号配置</el-button>
            <!--<el-button type="text"
                       @click="aliLiftNumConfig(scope.row)">电子围栏配置</el-button>-->
            <!-- <el-button type="text" @click="cancle(scope.row)">注销</el-button> -->
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!--翻页-->
    <pagination :total-elements="totalElements"
                :change-callback="getMerchantList"
                ref="page"></pagination>

    <el-dialog title="小程序参数配置"
               :visible.sync="appletConfigVisible">
      <el-form :model="appletConfig"
               v-if="appletConfigVisible">
        <el-form-item v-show="false">
          <el-input v-model="appletConfig.merchantId"></el-input>
        </el-form-item>
        <el-form-item label="AppId"
                      :label-width="formLabelWidth">
          <el-input v-model="appletConfig.appId"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="AppSecret"
                      :label-width="formLabelWidth">
          <el-input v-model="appletConfig.appKey"
                    auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="appletConfigVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="appletConfigSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="小程序参数配置"
               :visible.sync="wechatConfig.show"
               width="90%">
      <iframe :src="wechatConfig.url"
              style="width: 100%; height:60vh;"
              v-if="wechatConfig.url"></iframe>
    </el-dialog>
    <el-dialog title="体验小程序"
               :visible.sync="experienceInfo.show"
               v-if="experienceInfo.show">
      <div class="vm-align-center">
        <div class="vm-inline-block vm-height-200px vm-width-200px">
          <img :src="experienceInfo.url"
               alt="体验小程序"
               width="100%"
               height="100%" />
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="experienceInfo.show = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!--新增模态框-->
    <el-dialog title="新增商户"
               :close-on-click-modal="false"
               width="450px"
               :visible.sync="newMerchant"
               :before-close="newMerchantClose">

      <el-form :model="newMerchantForm"
               :rules="Rules"
               ref="newMerchantForm"
               :label-width="formLabelWidth"
               size="mini"
               v-if="newMerchant">

        <el-form-item label="商户名："
                      show-message
                      prop="name">
          <el-input v-model="newMerchantForm.name"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="联系人："
                      show-message
                      prop="contact">
          <el-input v-model="newMerchantForm.contact"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="手机："
                      show-message
                      prop="phone">
          <el-input v-model="newMerchantForm.phone"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="密码："
                      show-message>
          <el-input v-model="newMerchantForm.password"
                    type="password"
                    class="formItem"
                    placeholder="可设置初始密码或使用默认密码"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱："
                      show-message
                      prop="email">
          <el-input v-model="newMerchantForm.email"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="省市："
                      prop="provInfo">
          <el-cascader v-model="newMerchantForm.provInfo"
                       style="width: 240px"
                       filterable
                       clearable
                       :props="propsInfo"
                       :options="provList"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址："
                      show-message
                      prop="address">
          <el-input v-model="newMerchantForm.address"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="经营类别："
                      prop="businessLevOne">
          <el-cascader v-model="categoryNewArr"
                       class="formItem"
                       clearable
                       :props="propsCategory"
                       :options="typeJson"></el-cascader>
          <el-input v-model="newMerchantForm.businessLevOne"
                    style="display: none;"></el-input>
        </el-form-item>
        <el-form-item label="定位开关">
          <el-switch v-model="newMerchantForm.isOpen"
                     :active-value="1"
                     :inactive-value="-1">
          </el-switch>
        </el-form-item>
        <el-form-item label="定位地址："
                      v-show="newMerchantForm.isOpen===1"
                      >
          <el-input v-model="locationAddress"
                    placement="请输入商铺地址"
                    class="formItem"></el-input>
<!--          <el-button type="primary" size="small" @click="geoCode">定位</el-button>-->
          <!--          <el-button type="primary" size="small" @click="geolocationFn">自动定位</el-button>-->
        </el-form-item>
        <!--
        <el-form-item label="经营类别：" prop="businessLevOne">
          <el-select v-model="newMerchantForm.businessLevOne" placeholder="请选择一级类别"
                     size="small" class="formItem" @change="getType1($event)">
            <el-option :value="n.name"
                       :key="index"
                       :label="n.name"
                       v-for="(n,index) in dataTypes">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="businessLevTwo">
          <el-select v-model="newMerchantForm.businessLevTwo" placeholder="请选择二级类别"
                     size="small" class="formItem" @change="getType2($event)"
                     no-data-text="请先选择一级类别">
            <el-option :value="n.name"
                       :key="index"
                       :label="n.name"
                       v-for="(n,index) in dataTypes2">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="businessLevThree">
          <el-select v-model="newMerchantForm.businessLevThree" placeholder="请选择三级类别"
                     size="small" class="formItem" @change="getType3($event)"
                     no-data-text="请先选择二级类别">
            <el-option :value="n.name"
                       :key="index"
                       :label="n.name"
                       :title="n.desc"
                       v-for="(n,index) in dataTypes3">
            </el-option>
          </el-select>
        </el-form-item>
        -->
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="newMerchantClose">取消</el-button>
        <el-button type="primary"
                   @click="submitMerchant()"
                   v-loading="btnLoading"
                   :disabled="btnLoading">确定</el-button>
      </span>
    </el-dialog>
    <!--新增模态框-->

    <!--修改模态框-->
    <el-dialog title="修改商户"
               width="500px"
               :visible.sync="editMerchant"
               :before-close="editMerchantClose">

      <el-form :model="editMerchantForm"
               :rules="Rules"
               ref="editMerchantForm"
               :label-width="formLabelWidth"
               size="mini">

        <el-form-item label="商户名："
                      show-message
                      prop="name">
          <el-input v-model="editMerchantForm.name"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="联系人："
                      show-message
                      prop="contact">
          <el-input v-model="editMerchantForm.contact"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱："
                      show-message
                      prop="email">
          <el-input v-model="editMerchantForm.email"
                    class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="省市："
                      prop="provInfo">
          <el-cascader v-model="editMerchantForm.provInfo"
                       style="width: 240px"
                       filterable
                       clearable
                       :props="propsInfo"
                       @change="provInfoChange"
                       :options="provList"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址："
                      show-message
                      prop="address">
          <el-input v-model="editMerchantForm.address"
                    class="formItem"></el-input>
<!--          <el-button type="primary" size="small" @click="geoCode">定位</el-button>-->
        </el-form-item>
        <el-form-item label="经营类别："
                      prop="businessLevOne">
          <el-cascader v-model="categoryArr"
                       class="formItem"
                       clearable
                       :props="propsCategory"
                       :options="typeJson"></el-cascader>
          <el-input v-model="editMerchantForm.businessLevOne"
                    style="display: none;"></el-input>
        </el-form-item>
        <el-form-item label="定位开关">
          <el-switch v-model="editMerchantForm.isOpen"
                     :active-value="1"
                     :inactive-value="-1">
          </el-switch>
        </el-form-item>
        <el-form-item label="定位地址："
                      v-show="editMerchantForm.isOpen===1">
          <el-input v-model="locationAddress"
                    class="formItem"></el-input>
<!--          <el-button type="primary" size="small" @click="geoCode">定位</el-button>-->
<!--          <el-button type="primary" size="small" @click="geolocationFn">自动定位</el-button>-->
        </el-form-item>

        <!--
        <el-form-item label="经营类别：" prop="businessLevOne">
          <el-cascader v-model="categoryArr"
                       :props="propsCategory"
                       :options="typeJson"></el-cascader>
          <el-select v-model="editMerchantForm.businessLevOne" placeholder="请选择一级类别"
                     size="small" class="formItem" @change="getEditType1($event)">
            <el-option :value="n.name"
                       :key="index"
                       :label="n.name"
                       v-for="(n,index) in dataTypes">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="businessLevTwo">
          <el-select v-model="editMerchantForm.businessLevTwo" placeholder="请选择二级类别"
                     size="small" class="formItem" @change="getEditType2($event)">
            <el-option :value="n.name"
                       :key="index"
                       :label="n.name"
                       v-for="(n,index) in dataTypes2">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="businessLevThree">
          <el-select v-model="editMerchantForm.businessLevThree" placeholder="请选择三级类别"
                     size="small" class="formItem" @change="getEditType3($event)">
            <el-option :value="n.name"
                       :key="index"
                       :label="n.name"
                       :title="n.desc"
                       v-for="(n,index) in dataTypes3">
            </el-option>
          </el-select>
        </el-form-item>
        -->
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button  @click="editMerchantClose">取消</el-button>
        <el-button type="primary"
                   @click="changeMerchant()"

                   :disabled="btnLoading">确定</el-button>
      </span>
    </el-dialog>
    <!--关注配置-->
    <el-dialog class="vm-dialog vm-dialog-body-top-10px"
               title="微信推荐关注配置"
               width="495px"
               v-if="fallowObj.open"
               :visible.sync="fallowObj.open">
      <FollowConfig :propsInfo="fallowObj"></FollowConfig>
    </el-dialog>
    <!--支付宝-->
    <el-dialog class="vm-dialog vm-dialog-body-top-10px"
               title="支付宝生活号配置"
               width="1000px"
               v-if="dialogAliListNumConfig.open"
               :visible.sync="dialogAliListNumConfig.open">
      <AliLiftConfig :propsInfo="dialogAliListNumConfig"
                     v-if="dialogAliListNumConfig.open"></AliLiftConfig>
    </el-dialog>
  </div>
</template>

<script>
import { getAppletConfig, getMerchantList, cancle, saveAppletConfig, resetPwd, updateStatus, deployWechatApi, addMerchant, editMerchant, getGaoDeKey } from '../api/merchant'
import pagination from '@/components/pagination/index'
import { turnToWechatConfig, auditstatuseWechatApi, experienceWechatApi, releaseWechatApi } from '../api/merchantWechat'
import * as commonApi from '@/api/common'
import * as utilsCollect from '@/utils/utilsCollect'
import typeJson from '@/assets/merchantType/merchantType.json'
import { levelAliasMixin } from '@/mixins'
import FollowConfig from './components/followConfig.vue'
import AliLiftConfig from './components/aliLiftConfig.vue'
import * as validatorRules from '@/utils/validator'
import AMapLoader from '@amap/amap-jsapi-loader';
export default {
  name: 'merchant',
  mixins: [levelAliasMixin],
  components: { pagination, FollowConfig, AliLiftConfig },
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
      serviceId:'', //服务商id
      locationAddress:'', //定位地址
      geocoder: null,
      geolocation:null,
      categoryArr: [],
      categoryNewArr: [],
      propsCategory: {
        value: 'id',
        label: 'name'
      },
      userType: '',
      formLabelWidth: '130px',
      loading: true,
      btnLoading: false,
      tableData: [], // 表格数据
      totalElements: 0,
      searchForm: {
        name: '', // 公司名
        contact: '' // 联系人，
      },
      appletConfigVisible: false,
      appletConfig: {
        appId: '',
        appKey: '',
        merchantId: ''
      },
      wechatConfig: {
        show: false
      },
      experienceInfo: {
        show: false
      },
      // 新增
      newMerchant: false, // 新增模态框
      newMerchantForm: {
        name: '', // 公司名/个人名
        contact: '', // 联系人
        email: '', // 邮箱
        password: '', // 设置密码
        businessLevOne: '', // 类别
        businessLevTwo: '', // 类别
        businessLevThree: '', // 类别
        provInfo: [],
        province: '', // 省
        city: '', // 市
        address: '', // 详细地址
        // payProrata: 0, // 分佣比例【数值】
        companyId: '', // {{levelAlias.firstName}}或者{{levelAlias.secondName}}id
        managerId: '', // 业务员id
        status: '1', // 正常状态

        longitude:'',
        latitude:'',
        isOpen:'' //开启定位 1 -1
      },
      // 编辑
      editMerchant: false, // 编辑修改模态框
      editMerchantForm: {
        id: '',
        name: '', // 公司名/个人名
        contact: '', // 联系人
        email: '', // 邮箱
        businessLevOne: '', // 类别
        businessLevTwo: '', // 类别
        businessLevThree: '', // 类别
        provInfo: [],
        province: '', // 省
        city: '', // 市
        address: '', // 详细地址

        longitude:'',
        latitude:'',
        isOpen:'' //开启定位 1 -1
        // payProrata: '' // 分佣比例【数值】
      },
      typeJson: [],
      typeJsonNew: typeJson,
      type1: '',
      type2: '',
      type3: '',
      type1Option: [], // 一级经营类别选项
      type2Option: [], // 二级经营类别选项
      type3Option: [], // 三级经营类别选项
      propsInfo: {
        value: 'id',
        label: 'name'
      },
      provList: [],
      // 省市联动--------------------------
      cityDetail: '',
      dataCity: '',
      dataCountry: '',
      provIndex: '',
      cityIndex: '',
      dialogForm: {
        name: '',
        selectProv: '',
        selectCity: '',
        selectCountry: '',
        mark: ''
      },
      selectItems: [],
      // 经营类型
      dataTypes: [], // 经营类型数据
      dataTypes2: [], // 经营类型数据2 选中1后出现
      dataTypes3: [], // 经营类型数据3 选中2后出现
      selectedType1: '',
      selectedType2: '',
      selectedType3: '',

      /**
       * 判断规则
       */
      Rules: {
        name: [
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
        ]
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
    this.serviceId = sessionStorage.serviceId
    this.getGaoDeKey();
    // console.log('serviceId22222222',this.serviceId)



    this.userType = sessionStorage.getItem('userType')
    this.getProviceTreeCall() // 获取省市区
    this.initCategoryTree() // 初始化经营行业数--由于行业数id重复
  },
  mounted() {
    this.getMerchantList()
  },
  watch: {
    'editMerchantForm.provInfo'(val,lable) {
      // console.log('省市11111111111=================',val,'bbb',lable)
      val = val || []
      this.editMerchantForm.province = val[0] || ''
      this.editMerchantForm.city = val[val.length - 1] || ''
    },
    'newMerchantForm.provInfo'(val) {
      val = val || []
      this.newMerchantForm.province = val[0] || ''
      this.newMerchantForm.city = val[val.length - 1] || ''
    },
    'categoryArr'(val) {
      this.initFormInfo('editMerchantForm', val)
    },
    'categoryNewArr'(val) {
      this.initFormInfo('newMerchantForm', val)
    }
  },
  methods: {
    getGaoDeKey(){
      getGaoDeKey(this.serviceId).then(res => {
        this.gdWebKey = res.obj.gdWebSideKey;
        this.AMapLoader();
      })
    },
    AMapLoader(){
      AMapLoader.load({
        // "key": "ec2655d926a9b2662c416608d087fff6",              // 申请好的Web端开发者Key，首次调用 load 时必填
        "key": this.gdWebKey,
        "version": "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        "plugins": ['AMap.Geocoder', 'AMap.Geolocation'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        "AMapUI": {             // 是否加载 AMapUI，缺省不加载
          "version": '1.1',   // AMapUI 缺省 1.1
          "plugins":[],       // 需要加载的 AMapUI ui插件
        },
        "Loca":{                // 是否加载 Loca， 缺省不加载
          "version": '1.3.2'  // Loca 版本，缺省 1.3.2
        },
      }).then((AMap)=>{
        // map = new AMap.Map('container');
        this.geocoder = new AMap.Geocoder({
          city: "", //城市设为北京，默认：“全国”
        });
        this.geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：5s
          // position: 'RB', //定位按钮的停靠位置
          // buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          // zoomToAccuracy: true //定位成功后是否自动调整地图视野到定位点
        })
      }).catch(e => {
        console.log(e);
      })
    },



    provInfoChange(e){
      // // console.log('省市change====',e)
      // console.log('aaaaaaaaaaaaa=========', this.$refs['editMerchantForm'].getCheckedNodes())
    },
    /*//获取坐标转为中文地址
    geolocationFn(){
      // var  that = this;
      this.geolocation.getCurrentPosition((status, result) => {
        if (status == 'complete') {
          // this.longitude = result.position.lng
          // this.latitude = result.position.lat
          console.log('获取坐标================',result.position.lng+','+result.position.lat)
          this.geocoder.getAddress([result.position.lng, result.position.lat], (status, result)=> {
            if (status === 'complete'&&result.regeocode) {
              let address = result.regeocode.formattedAddress;
              this.shopAddress = address
              console.log('经纬度转地址==================',address)
              // alert('经纬度转地址'+address)
            }else{
              log.error('根据经纬度查询地址失败')
            }
          });
          // 应该监听这四个数据 当全部存在时 执行
          // if(this.oilData.longitude && this.oilData.latitude && this.oilData.phone && this.startGet) {
          // this.init()
          // }

        } else {
          this.$toast.error('定位失败', result.message)
        }
      })
    },*/
    //根据中文地址转为坐标
    geoCode(mechantAddOrChange) {
      // console.log('省=========',this.editMerchantForm.province)
      // console.log('市=========',this.editMerchantForm.city)
      // console.log('aaaaaaaaaaaaa=========', this.$refs['editMerchantForm'])
    /*  this.$nextTick(()=>{
        // console.log(this.$refs['editMerchantForm'].presentText)
      })*/


      // let address  = document.getElementById('address').value;
      this.geocoder.getLocation(this.locationAddress, (status, result)=> {
        this.btnLoading = true;
        if (status === 'complete'&&result.geocodes.length) {
          let lngLat = result.geocodes[0].location
          this.editMerchantForm.longitude = lngLat.lng
          this.editMerchantForm.latitude = lngLat.lat
          this.newMerchantForm.longitude = lngLat.lng
          this.newMerchantForm.latitude = lngLat.lat
          if(mechantAddOrChange === 1){
            this.sureAdd()
          }else if(mechantAddOrChange === 2){
            this.sureModify()
          }


          // this.$message.success('点击确定提交')
          // document.getElementById('lnglat').value = lnglat;
        }else{
          //没有填写定位地址会走这里
          let longitude = ''
          let latitude = ''
          let submit = ()=>{};
          if(mechantAddOrChange === 1){
            longitude = this.newMerchantForm.longitude;
            latitude = this.newMerchantForm.latitude
            submit = this.sureAdd
          }else if(mechantAddOrChange === 2){
            longitude = this.editMerchantForm.longitude;
            latitude = this.editMerchantForm.latitude
            submit = this.sureModify
          }

          this.btnLoading = false;
          if(this.locationAddress){
            this.$message.error('根据地址查询位置失败,'+result)
          }else if(!longitude && !latitude && !this.locationAddress){
            //  没有填地址，也没有历史定位记录则需要抛错
            this.$message.error('根据地址查询位置失败,'+result)
          }else if(longitude && latitude && !this.locationAddress){
            //  有历史地址，但是没写中文地址，不抛错，直接提交
            submit();
          }else{
            this.$message.error('定位功能异常，请联系管理员,'+result)
          }

        }
      });
    },
    /**
     * 初始化企业数
     * */
    initCategoryTree() {
      let arr = this.loopCategoryTree(this.typeJsonNew)
      this.typeJson = arr
    },
    loopCategoryTree(arr) {
      arr.forEach(item => {
        let id = item.value + item.name
        this.$set(item, 'id', id)
        if (item.children && item.children.length) {
          let children = this.loopCategoryTree(item.children)
          this.$set(item, 'children', children)
        }
      })
      return arr
    },
    /**
     * 设置经营类别名称
     * */
    initFormInfo(key, cateIds) {
      let val = cateIds || []
      if (val.length) {
        val = this.loopGetCateName(this.typeJsonNew, val)
        this.$set(this[key], 'businessLevOne', val[0])
        this.$set(this[key], 'businessLevTwo', val[1])
        this.$set(this[key], 'businessLevThree', val[2])
      } else {
        this.$set(this[key], 'businessLevOne', '')
        this.$set(this[key], 'businessLevTwo', '')
        this.$set(this[key], 'businessLevThree', '')
      }
    },
    /**
     *获取经营类别--id---1
     * */
    getCategoryIds(arrName) {
      let typeJson = this.typeJsonNew
      let ids = this.loopGetCateId(typeJson, arrName, [])
      return ids
    },
    /**
     *获取经营类别--id---2
     * */
    loopGetCateId(arr, oldNameArr, idsArr) {
      idsArr = idsArr || []
      let nameArr = [...oldNameArr]
      arr.forEach(item => {
        if (item.name === nameArr[0]) {
          idsArr.push(item.id)
          nameArr.splice(0, 1)
          if (nameArr && nameArr.length) {
            idsArr = this.loopGetCateId(item.children, nameArr, idsArr)
          }
        }
      })
      return idsArr
    },
    /**
     *获取经营类别--名称
     * */
    loopGetCateName(arr, oldIdArr, namesArr) {
      namesArr = namesArr || []
      let idArr = [...oldIdArr]
      arr.forEach(item => {
        if (item.id === idArr[0]) {
          namesArr.push(item.name)
          idArr.splice(0, 1)
          if (idArr && idArr.length) {
            namesArr = this.loopGetCateName(item.children, idArr, namesArr)
          }
        }
      })
      return namesArr
    },
    showSignStatus(val) {
      let stauts = ''
      switch (val) {
        case 1:
          stauts = '未开通'
          break
        case 2:
          stauts = '待审核'
          break
        case 3:
          stauts = '签约成功'
          break
        case 4:
          stauts = '签约失败'
          break
        case 5:
          stauts = '材料已审核'
          break
      }
      return stauts
    },
    getProviceTreeCall() {
      let params = {
        level: 2
      }
      commonApi.getProviceTree(params).then(res => {
        let newArr = utilsCollect.sortArrayByKeyDeep(res.obj, 1)
        this.provList = newArr
        this.provList.forEach(item => {
          return item.children.forEach(itemSec => {
            delete itemSec.children
            return itemSec
          })
        })
      })
    },
    /**
     * 深拷贝 防止对象污染用的
     */

    deepCopy: function (obj) {
      var result = Array.isArray(obj) ? [] : {}
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object') {
            result[key] = this.deepCopy(obj[key]) // 递归
          } else {
            result[key] = obj[key]
          }
        }
      }
      return result
    },
    // 修改状态
    editStatus(data) {
      let params = {
        id: data.id,
        status: data.status === 1 ? 2 : 1
      }
      updateStatus(params).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.btnLoading = false
        this.$refs.page.refresh()
      }).catch(() => {
        this.loading = false
      })
    },

    // 重置商户密码
    resetPassword(row) {
      this.$confirm('是否确认操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPwd(row.phone).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          })
          this.btnLoading = false
          this.$refs.page.refresh()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    /**
       * 获取商户列表
       * @param number
       * @param pageSize
       */
    getMerchantList: function (number, pageSize) {
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
    },

    // 注销商户
    cancle(row) {
      this.$confirm('是否确认操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancle(row.id).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          })
          this.btnLoading = false
          this.$refs.page.refresh()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    // 跳转详情页
    rooterDeatil(data) {
      // console.log(data)
      // query发送ID到详情
      let id = data.id
      this.$router.push({ path: '/merchant/top/views/merchantDetail', query: { id: id } })
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
        contact: '' // 联系人，
      }// 搜索用的表单
      this.$refs.page.search()
    },
    openAppletConfigDialog(merchantInfo, type) {
      this.appletConfig.appKey = ''
      this.appletConfig.appId = ''
      getAppletConfig(merchantInfo.id).then(response => {
        if (type) {
          this.fallowObj = {
            open: true,
            data: merchantInfo,
            configData: response.obj
          }
        } else {
          this.appletConfig.appKey = response.obj.appKey
          this.appletConfig.appId = response.obj.appId
        }
      })
      if (type) {
        return
      }
      this.appletConfig.merchantId = merchantInfo.id
      this.appletConfigVisible = true
    },

    appletConfigSubmit() {
      saveAppletConfig(this.appletConfig).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.appletConfigVisible = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 小程序配置
    openWechatConfig(data) {
      let params = {
        auth_type: 2,
        callparams: data.id
      }
      turnToWechatConfig(params).then(res => {
        this.wechatConfig = {
          show: true,
          url: res
        }
        // window.open(res)
      })
    },
    /**
     * 小程序发布
     * @param data
     */
    deployWechat(data) {
      if (data.merchantAppletConfigVO && data.merchantAppletConfigVO.appId) {
        this.$confirm('确定提交审核小程序?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deployWechatApi(data.id).then(res => {
            this.$message.success(res.msg)
          })
        }).catch(() => {
        })
      } else {
        this.$message.warning('请先去小程序授权')
      }
    },
    /**
     * 体验小程序
     */
    experienceWechat(data) {
      if (data.merchantAppletConfigVO && data.merchantAppletConfigVO.appId) {
        let params = {
          appid: data.merchantAppletConfigVO.appId,
          path: ''
        }
        experienceWechatApi(params).then(res => {
          let url = 'data:image/png;base64,' + res
          this.experienceInfo = {
            show: true,
            url: url
          }
        })
      } else {
        this.$message.warning('请先去小程序授权')
      }
    },
    /**
     * 查看小程序审核状态
     */
    lookWechatStatus(data) {
      if (data.merchantAppletConfigVO && data.merchantAppletConfigVO.appId) {
        let params = {
          appid: data.merchantAppletConfigVO.appId
        }
        auditstatuseWechatApi(params).then(res => {
          let msg = ''
          switch (res.status) {
            case 0:
              msg = '审核成功'
              break
            case 1:
              msg = '审核被拒绝,拒绝原因：' + res.reason
              break
            case 2:
              msg = '审核中'
              break
            case 3:
              msg = '已撤回'
              break
          }
          this.$alert(msg, '小程序审核状态', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        })
      } else {
        this.$message.warning('请先去小程序授权')
      }
    },
    /**
     * 小程序正式发布--确认弹窗
     */
    releaseWechat(data) {
      if (data.merchantAppletConfigVO && data.merchantAppletConfigVO.appId) {
        this.$confirm('确定正式发布小程序?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmRelease(data)
        }).catch(() => {
        })
      } else {
        this.$message.warning('请先去小程序授权')
      }
    },
    /**
     * 小程序正式发布--确认发布
     */
    confirmRelease(data) {
      let params = {
        appid: data.merchantAppletConfigVO.appId
      }
      releaseWechatApi(params.appid).then(res => {
        this.$alert('小程序发布成功', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      })
    },
    /**
     * 关闭新增模态框
     */
    newMerchantClose: function () {
      this.locationAddress = '';
      this.newMerchantForm = {
        name: '', // 公司名/个人名
        contact: '', // 联系人
        phone: '', // 号码
        password: '', // 密码
        email: '', // 邮箱
        businessLevOne: '', // 类别
        businessLevTwo: '', // 类别
        businessLevThree: '', // 类别
        provInfo: [],
        province: '', // 省
        city: '', // 市
        address: '', // 详细地址
        // payProrata: 0, // 分佣比例【数值】
        companyId: '', // {{levelAlias.firstName}}或者{{levelAlias.secondName}}id
        managerId: '', // 业务员id
        status: '1' // 正常状态
      }
      this.categoryNewArr = []
      this.newMerchant = false
    },
    /**
     * 打开新增模态框后
     */
    newMerchantOpen: function () {
      this.dataTypes = typeJson
      this.newMerchant = true
    },

    /**
     * 提交
     */
    submitMerchant: function () {
      // this.loading = true
      this.$refs.newMerchantForm.validate((valid) => {
        if (valid) {
          if(this.newMerchantForm.isOpen === 1){
            this.geoCode(1)
          }else if(this.newMerchantForm.isOpen === -1){
            this.sureAdd()
          }
          // this.sureAdd()
        } else {
          return false
        }
      })
    },
    sureAdd() {
      if (this.newMerchantForm.password) {
        let isValid = validatorRules.password.valid(this.newMerchantForm.password)
        if (!isValid) {
          this.$message.warning(validatorRules.password.msg)
          return
        }
      }
      this.btnLoading = true // 锁定按钮
      this.newMerchantForm.companyId = sessionStorage.getItem('companyId')
      this.newMerchantForm.managerId = sessionStorage.getItem('userId')
      let oldForm = Object.assign({}, this.newMerchantForm)
      delete oldForm.provInfo
      let companyId = sessionStorage.getItem('companyId')
      oldForm.parentId = companyId
      let form = this.deepCopy(oldForm)
      // let form = this.deepCopy(this.newMerchantForm)
      // form.payProrata = form.payProrata / 100
      // this.newMerchantForm.payProrata = this.newMerchantForm.payProrata/100,
      // 1提交
      addMerchant(form).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.btnLoading = false
        this.newMerchantForm = {
          name: '', // 公司名/个人名
          contact: '', // 联系人
          phone: '', // 号码
          password: '', // 密码
          email: '', // 邮箱
          businessLevOne: '', // 类别
          businessLevTwo: '', // 类别
          businessLevThree: '', // 类别
          provInfo: [],
          province: '', // 省
          city: '', // 市
          address: '', // 详细地址
          // payProrata: 0, // 分佣比例【数值】
          companyId: '', // {{levelAlias.firstName}}或者{{levelAlias.secondName}}id
          managerId: '', // 业务员id
          status: '1' // 正常状态
        }
        this.categoryNewArr = []
        this.newMerchant = false // 关闭模态框
        this.$refs.page.refresh()
        this.btnLoading = false
      }).catch(e => {
        this.loading = false
        this.btnLoading = false
      })
    },
    /**
     * 打开编辑模态框 获取数据、渲染经营类型、回显经营类型
     */
    openEditMerchant: function (row) {
      console.log(row)
      // 打开模态框
      this.editMerchantForm.id = row.id
      this.editMerchantForm.name = row.name
      this.editMerchantForm.contact = row.contact
      this.editMerchantForm.email = row.email
      this.editMerchantForm.province = row.province
      this.editMerchantForm.city = row.city
      this.editMerchantForm.provInfo = [row.province, row.city]
      this.editMerchantForm.address = row.address

      this.editMerchantForm.businessLevOne = row.businessLevOne
      this.editMerchantForm.businessLevTwo = row.businessLevTwo
      this.editMerchantForm.businessLevThree = row.businessLevThree
      this.editMerchantForm.longitude = row.longitude
      this.editMerchantForm.latitude = row.latitude
      this.editMerchantForm.isOpen = row.isOpen

      // this.editMerchantForm.payProrata = row.payProrata * 100
      this.dataTypes = typeJson
      let cateNameArr = [row.businessLevOne, row.businessLevTwo, row.businessLevThree]
      this.categoryArr = this.getCategoryIds(cateNameArr)
      /*
      this.getEditType1(row.businessLevOne) // 一级选项
      this.getEditType2(row.businessLevTwo) // 二级选项
      this.getEditType3(row.businessLevThree) // 三级选项
      */
      // 获取这个{{levelAlias.firstName}}的信息
      this.editMerchant = true
    },

    /**
     * 关闭编辑模态框
     */
    editMerchantClose: function () {
      this.locationAddress = '';
      this.editMerchant = false
      this.categoryArr = []
    },

    // 提交修改 editMerchantForm
    changeMerchant() {
      this.$refs.editMerchantForm.validate((valid) => {
        if (valid) {
          if(this.editMerchantForm.isOpen === 1){
            this.geoCode(2)
          }else if(this.editMerchantForm.isOpen === -1){
            this.sureModify()
          }

        } else {
          return false
        }
      })
    },
    sureModify() {
      this.loading = true
      this.btnLoading = true
      // this.editMerchantForm.payProrata = this.editMerchantForm.payProrata / 100
      let oldForm = Object.assign({}, this.editMerchantForm)
      delete oldForm.provInfo
      let form = this.deepCopy(oldForm)
      // let form = this.deepCopy(this.editMerchantForm)
      // form.payProrata = form.payProrata / 100
      editMerchant(form).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.categoryArr = []
        this.btnLoading = false
        this.editMerchantClose()
        this.$refs.page.refresh()
      }).catch(() => {
        this.btnLoading = false
        this.loading = false
      })
    },
    /**
     * 新建用--营业类别
     */
    getType1: function (event) {
      // console.log(event)
      for (let i in this.dataTypes) {
        if (this.dataTypes[i].name === event) {
          this.selectedType1 = i
          this.dataTypes2 = this.dataTypes[i].children
          // 可以另外再保存名称，方便在商户直接列表显示中文
          this.newMerchantForm.businessLevOne = this.dataTypes[i].name
          // this.newMerchantForm.type1 = event
        }
      }
    },
    getType2: function (event) {
      // console.log(event)
      let inx = parseInt(this.selectedType1)
      let arr = this.dataTypes[inx].children
      for (let i in arr) {
        if (arr[i].name === event) {
          this.selectedType2 = i
          // 可以另外再保存名称，方便在商户直接列表显示中文
          this.newMerchantForm.businessLevTwo = arr[i].name
          // this.newMerchantForm.type2 = event
          this.dataTypes3 = arr[i].children
        }
      }
    },
    getType3: function (event) {
      console.log(event)
      let inx1 = parseInt(this.selectedType1)
      let inx2 = parseInt(this.selectedType2)
      // console.log(this.dataTypes[inx1].children[inx2])
      let arr = this.dataTypes[inx1].children[inx2].children
      for (let i in arr) {
        if (arr[i].name === event) {
          // 可以另外再保存名称，方便在商户直接列表显示中文
          this.newMerchantForm.businessLevThree = arr[i].name
          // this.newMerchantForm.type3 = event
        }
      }
      // console.log(this.newMerchantForm.type1)
      // console.log(this.newMerchantForm.type2)
      // console.log(this.newMerchantForm.type3)
    },
    /**
     * 编辑用--营业类别
     */
    getEditType1: function (event) {
      console.log(event)
      for (let i in this.dataTypes) {
        if (this.dataTypes[i].name === event) {
          console.log(i)
          this.selectedType1 = i
          this.dataTypes2 = this.dataTypes[i].children
          this.editMerchantForm.businessLevOne = this.dataTypes[i].name
          // this.editMerchantForm.type1 = event
        }
      }
    },
    getEditType2: function (event) {
      console.log(event)
      if (event === '' || event == null) {
        return
      }
      let inx = parseInt(this.selectedType1)
      let arr = this.dataTypes[inx].children
      for (let i in arr) {
        if (arr[i].name === event) {
          this.selectedType2 = i
          this.editMerchantForm.businessLevTwo = arr[i].name
          // this.editMerchantForm.type2 = event
          this.dataTypes3 = arr[i].children
        }
      }
    },
    getEditType3: function (event) {
      if (event === '' || event == null) {
        return
      }
      console.log(event)
      let inx1 = parseInt(this.selectedType1)
      let inx2 = parseInt(this.selectedType2)
      // console.log(this.dataTypes[inx1].children[inx2])
      let arr = this.dataTypes[inx1].children[inx2].children
      for (let i in arr) {
        if (arr[i].name === event) {
          this.editMerchantForm.businessLevThree = arr[i].name
          // this.editMerchantForm.type3 = event
        }
      }
      // console.log(this.editMerchantForm.type1)
      // console.log(this.editMerchantForm.type2)
      // console.log(this.editMerchantForm.type3)
    },
    /**
     * 微信公众号关注配置
     */
    async fallowAndConfig(data) {
      let configData = await this.openAppletConfigDialog(data, true)
      this.fallowObj = {
        open: true,
        data: data,
        configData: configData
      }
    },
    /**
     * 支付宝生活号配置
     */
    aliLiftNumConfig(data) {
      this.dialogAliListNumConfig = {
        open: true,
        data: data
      }
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
