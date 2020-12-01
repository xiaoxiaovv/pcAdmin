<template>
  <div class="app-container" v-loading="loading">
    <div class="action-container">
      <!--公司-->
      <el-input style="margin-bottom: 10px;" v-model="searchForm.name" @keyup.enter.native="search" placeholder="公司" size="small"
                class="formItem"></el-input>
      <!--联系人-->
      <el-input style="margin-bottom: 10px;" v-model="searchForm.contact" @keyup.enter.native="search" placeholder="联系人" size="small"
                class="formItem"></el-input>
      <!--手机号-->
      <el-input style="margin-bottom: 10px;" v-model="searchForm.phone" @keyup.enter.native="search" placeholder="手机号" size="small"
                class="formItem"></el-input>
      <!--状态-->
      <el-select style="margin-bottom: 10px;" v-model="searchForm.status" @change="search" placeholder="状态" size="small"
                 clearable class="formItem">
        <el-option
          v-for="item in statusOption"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select style="margin-bottom: 10px;" v-model="searchForm.isFree" @change="search" placeholder="是否免费服务商" size="small"
                 clearable class="formItem">
        <el-option
          v-for="item in isFreeOption"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <!--按钮-->
      <el-button style="margin-bottom: 10px;" type="primary" size="small" @click="search">查询</el-button>
      <el-button style="margin-bottom: 10px;" type="primary" size="small" @click="reset">重置</el-button>
      <el-button style="margin-bottom: 10px;" type="primary" size="small" @click="newMemberOpen">新增</el-button>
      <el-button style="margin-bottom: 10px;" type="primary" size="small" @click="infoInputDialogOpen({id: '1120253834480979968'}, 1)">编辑超级后台信息</el-button>
      <el-button style="margin-bottom: 10px;" type="primary" size="small" @click="checkDomain">域名校验</el-button>
    </div>

    <!--表格-->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        label="公司"
        width="180">
      </el-table-column>
      <el-table-column
        prop="contact"
        label="联系人">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系电话">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <template v-if="scope.row.status===3">已签约</template>
          <template v-else-if="scope.row.status===5">注销</template>
        </template>
      </el-table-column>
      <el-table-column label="允许下级自定义LOGO" min-width="100">
        <template slot-scope="scope">
          <el-switch :value="scope.row.allowSubordinateUseLogo"
                     :active-value="1"
                     :inactive-value="0" @change="toggleAllow($event, scope.row)">
          </el-switch>
          <span class="tipcolor">{{scope.row.allowSubordinateUseLogo?'允许':'不允许'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否免费服务">
        <template slot-scope="scope">
          <span v-if="scope.row.isFree" style="color: #3ebdff;">是</span>
          <span v-if="!scope.row.isFree" style="color: #666;">否</span>
        </template>
      </el-table-column>
      <el-table-column label="免费商户数">
        <template slot-scope="scope">
          {{scope.row.isFree ? (scope.row.freeCount || '') : '--'}}
        </template>
      </el-table-column>
      <!--操作-->
      <el-table-column
        fixed="right"
        label="操作"
        min-width="300">
        <template slot-scope="scope">
          <!--修改基础信息-->
          <el-button type="text" @click="editMemberOpen(scope.row)">修改</el-button>
          <!--注销{{levelAlias.oemName}}-->
          <el-button
            v-if="scope.row.status===3"
            type="text"
            @click="OperatorUpdateAudit(scope.row.id,5)">注销
          </el-button>
          <!--签约{{levelAlias.oemName}}-->
          <el-button
            v-else-if="scope.row.status===5"
            type="text"
            @click="OperatorUpdateAudit(scope.row.id,3)">签约
          </el-button>
          <!--重置密码-->
          <el-button
            type="text"
            @click="resetPassword(scope.row)">重置密码
          </el-button>
          <!--回显资料详情-->
          <!-- <el-button type="text" @click="infoDetailDialogOpen(scope.row)">{{levelAlias.oemName}}信息</el-button> -->
          <!--资料录入-->
          <el-button type="text" @click="infoInputDialogOpen(scope.row)">编辑{{levelAlias.oemName}}信息</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total-elements="totalElements"
      :change-callback="getProviderList"
      ref="page"></pagination>

    <!--新增模态框-->
    <el-dialog
      title="新增"
      width="450px"
      :visible.sync="newMember"
      :before-close="newMemberClose">

      <el-form :model="newMemberForm" :rules="Rules" ref="ruleForm" :label-width="newFormLabelWidth"
               size="mini">

        <el-form-item label="公司/个人：" show-message prop="name">
          <el-input v-model="newMemberForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" show-message prop="contact">
          <el-input v-model="newMemberForm.contact"></el-input>
        </el-form-item>
        <el-form-item label="手机：" show-message prop="phone">
          <el-input v-model="newMemberForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="省市：" prop="provInfo">
          <el-cascader v-model="newMemberForm.provInfo"
                       style="width: 100%"
                       filterable
                       clearable
                       :props="propsInfo"
                       :options="provList"></el-cascader>
        </el-form-item>
        <!--
        <el-form-item label="省份：" prop="province">
          <el-select v-model="newMemberForm.province" placeholder="请选择省份"
                     size="small" class="formItem"
                     @change="getProv($event)">
            <el-option :value="n"
                       :key="index"
                       :label="n"
                       v-for="(n,index) in dataProv[0]['prov']">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市：" prop="city">
          <el-select v-model="newMemberForm.city" placeholder="请选择城市"
                     size="small" class="formItem"
                     @click="getCity($event)">
            <el-option :value="n"
                       :key="index"
                       :label="n"
                       v-for="(n,index) in dataCity">
            </el-option>
          </el-select>
        </el-form-item>
        -->
        <el-form-item label="联系地址：" show-message prop="address">
          <el-input v-model="newMemberForm.address"></el-input>
        </el-form-item>
        <el-form-item label="是否免费服务商：" show-message prop="isFree">
          <el-switch v-model="newMemberForm.isFree" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="允许开通商户数：" show-message prop="freeCount" v-if="newMemberForm.isFree">
          <el-input-number v-model="newMemberForm.freeCount" :min="1" :max="99999999" :precision="0" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="newMemberClose">取消</el-button>
    <el-button type="primary" @click="providerAdd(1)" v-loading="btnLoading" :disabled="btnLoading">确定</el-button>
  </span>
    </el-dialog>
    <!--新增模态框-->

    <!--编辑模态框-->
    <el-dialog
      :title="`编辑${levelAlias.oemName}信息`"
      width="450px"
      :visible.sync="editMember"
      :before-close="editMemberClose">

      <el-form :model="editMemberForm" :rules="Rules" ref="ruleFormEdite" :label-width="newFormLabelWidth"
               size="mini">

        <el-form-item label="公司/个人：" show-message prop="company">
          <el-input v-model="editMemberForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" show-message prop="contact">
          <el-input v-model="editMemberForm.contact"></el-input>
        </el-form-item>
        <el-form-item label="省市：" prop="provInfo">
          <el-cascader v-model="editMemberForm.provInfo"
                       style="width: 100%"
                       filterable
                       clearable
                       :props="propsInfo"
                       :options="provList"></el-cascader>
        </el-form-item>
        <!--
        <el-form-item label="省份：" prop="province">
          <el-select v-model="editMemberForm.province" placeholder="请选择省份"
                     size="small" class="formItem"
                     @change="getProv($event)">
            <el-option :value="n"
                       :key="index"
                       :label="n"
                       v-for="(n,index) in dataProv[0]['prov']">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市：" prop="city">
          <el-select v-model="editMemberForm.city" placeholder="请选择城市"
                     size="small" class="formItem"
                     @click="getCity($event)">
            <el-option :value="n"
                       :key="index"
                       :label="n"
                       v-for="(n,index) in dataCity">
            </el-option>
          </el-select>
        </el-form-item>
        -->
        <el-form-item label="联系地址：" show-message prop="address">
          <el-input v-model="editMemberForm.address"></el-input>
        </el-form-item>
        <el-form-item label="是否免费服务商：" show-message prop="isFree">
          <el-switch v-model="editMemberForm.isFree" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="允许开通商户数：" show-message prop="freeCount" v-if="editMemberForm.isFree">
          <el-input-number v-model="editMemberForm.freeCount" :min="1" :max="99999999" :precision="0" label="开通商户数"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editMemberClose">取 消</el-button>
    <el-button type="primary" @click="editOpera" v-loading="btnLoading" :disabled="btnLoading">确 定</el-button>
  </span>
    </el-dialog>
    <!--编辑模态框-->

    <!--资料详情模态框-->
    <el-dialog
      :title="`${levelAlias.oemName}信息`"
      :visible.sync="infoDetailDialogVisible"
      width="30%"
      :before-close="infoDetailDialogClose">
      <!--内容-->
      <div class="details-info-file">
        <table>
          <tr>
            <td>域名</td>
            <td>{{infoDetailData.domainName||'--'}}</td>
          </tr>
          <tr>
            <td>logo</td>
            <td><img :src="getImg(infoDetailData.logo)||'--'" alt="LOGO" class="logo-img-box"/></td>
          </tr>
          <tr>
            <td>登录页背景图</td>
            <td><img :src="getImg(infoDetailData.bgmPhoto)||'--'" alt="登录页背景图" class="bg-img-box"></td>
          </tr>
          <tr>
            <td>商户登录页背景图</td>
            <td><img :src="getImg(infoDetailData.mctBgmPhoto)||'--'" alt="登录页背景图" class="bg-img-box"></td>
          </tr>
          <tr>
            <td>技术支持</td>
            <td>{{infoDetailData.techSupport||'--'}}</td>
          </tr>
          <!-- <tr>
            <td>客服电话</td>
            <td>{{infoDetailData.servicePhone||'--'}}</td>
          </tr>
          <tr>
            <td>微信二维码</td>
            <td>{{infoDetailData.wechatQrcode||'--'}}</td>
          </tr> -->
          <tr>
            <td>版权说明</td>
            <td>{{infoDetailData.copyrightInfo||'--'}}</td>
          </tr>
          <tr>
            <td>ICP备案号</td>
            <td>{{infoDetailData.icpInfo||'--'}}</td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="infoDetailDialogClose">关 闭</el-button>
  </span>
    </el-dialog>
    <!--资料详情模态框-->

    <el-dialog
      :title="editType === 2 ? `编辑${levelAlias.oemName}信息`:'编辑超级后台信息'"
      :visible.sync="infoInputDialogVisible"
      :close-on-click-modal="false"
      :lock-scroll="false"
      width="500px"
      :before-close="infoInputDialogClose">
      <!--录入-->
      <div style="max-height: 60vh; overflow: auto;">
        <el-form :model="infoInputForm" :rules="infoRule" ref="infoInput" label-width="auto">
          <el-form-item label="域名：" prop="domainName">
            <el-input v-model="infoInputForm.domainName" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="技术支持：" prop="techSupport">
            <el-input v-model="infoInputForm.techSupport" class="input-width"></el-input>
          </el-form-item>
          <!-- <el-form-item label="客服电话：" prop="servicePhone">
            <el-input v-model="infoInputForm.servicePhone" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="微信二维码：" prop="wechatQrcode">
            <el-input v-model="infoInputForm.wechatQrcode" class="input-width"></el-input>
          </el-form-item> -->
          <el-form-item label="版权说明：" prop="copyrightInfo">
            <el-input v-model="infoInputForm.copyrightInfo" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="ICP备案号：" prop="icpInfo">
            <el-input v-model="infoInputForm.icpInfo" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="Logo：" prop="logo">
            <el-upload
              class="logo-uploader"
              :action="url"
              :data="filesData"
              name="files"
              :show-file-list="false"
              :on-success="logoUpload"
              :on-error="handleImageFailed"
              :before-upload="beforeLogoUpload"
              :headers="headers">
              <img v-if="info_logo_url" :src="info_logo_url" class="logo">
              <i v-else class="el-icon-plus logo-uploader-icon"></i>
            </el-upload>
            <el-button v-if="info_logo_url" type="text" @click="removeImg('logo')">重置图片</el-button>
            <div class="tips-rule">建议尺寸：100*40</div>
          </el-form-item>
          <el-form-item label="登录页Logo：" prop="loginLogo">
            <el-upload
              class="logo-uploader"
              :action="url"
              :data="filesData"
              name="files"
              :show-file-list="false"
              :on-success="loginLogoUpload"
              :on-error="handleImageFailed"
              :before-upload="beforeLogoUpload"
              :headers="headers">
              <img v-if="info_login_logo_url" :src="info_login_logo_url" class="logo">
              <i v-else class="el-icon-plus logo-uploader-icon"></i>
            </el-upload>
            <el-button v-if="info_login_logo_url" type="text" @click="removeImg('loginLogo')">重置图片</el-button>
            <div class="tips-rule">建议尺寸：264*26</div>
          </el-form-item>

          <el-form-item label="登录页背景：" prop="bgmPhoto">

            <el-upload
              class="logo-uploader"
              :action="url"
              :data="filesData"
              name="files"
              :show-file-list="false"
              :on-success="bgUpload"
              :on-error="handleImageFailed"
              :before-upload="beforeLogoUpload"
              :headers="headers">
              <img v-if="info_bgmPhoto_url" :src="info_bgmPhoto_url" class="logo bgimg">
              <i v-else class="el-icon-plus logo-uploader-icon"></i>
            </el-upload>
            <el-button v-if="info_bgmPhoto_url" type="text" @click="removeImg('bgmPhoto')">重置图片</el-button>
            <div class="tips-rule" style="line-height: 20px;">建议尺寸：1920*1080</div>
            <div class="tips-rule" style="line-height: 20px;">（图片大小不超过1M，以免影响加载速度）</div>
          </el-form-item>

          <el-form-item label="商户登录页背景：" prop="mctBgmPhoto"  v-if="editType === 2">

            <el-upload
              class="logo-uploader"
              :action="url"
              :data="filesData"
              name="files"
              :show-file-list="false"
              :on-success="mactbgUpload"
              :on-error="handleImageFailed"
              :before-upload="beforeLogoUpload"
              :headers="headers">
              <img v-if="info_mctBgmPhoto_url" :src="info_mctBgmPhoto_url" class="logo bgimg">
              <i v-else class="el-icon-plus logo-uploader-icon"></i>
            </el-upload>
            <el-button v-if="info_mctBgmPhoto_url" type="text" @click="removeImg('mctBgmPhoto')">重置图片</el-button>
            <div class="tips-rule">建议尺寸：1920*1080</div>
          </el-form-item>

        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="infoInputDialogClose">取 消</el-button>
    <el-button type="primary" @click="infoInputSubmit" v-loading="btnLoading" :disabled="btnLoading">确 定</el-button>
  </span>
    </el-dialog>
    <!--域名校验-->
    <el-dialog class="vm-dialog"
               title="域名校验"
               width="400px"
               v-if="dialogCheckDomain.show"
               :visible.sync="dialogCheckDomain.show">
      <DomainCheck :propsInfo="dialogCheckDomain"></DomainCheck>
    </el-dialog>
  </div>
</template>

<script>
import {
  getProviderList,
  providerAdd,
  providerUpdate,
  updateStatus,
  findDetail,
  findEntryDetail,
  submitDetail
} from '../api/service_provider'
import * as commonApi from '@/api/common'
import {adminResetPwd} from '@/modules/system/api/user'
import pagination from '@/components/pagination/index'
import cityJson from '@/assets/city/city.json'
import {returnThumbnailUrl, returnFilesUrl, uploadUrl, hsfuploadUrl} from '@/modules/file/api/upload' // 图片操作API
import * as utilsCollect from '@/utils/utilsCollect'
import { levelAliasMixin } from '@/mixins'
import DomainCheck from './components/domainCheck.vue'
export default {
  name: 'operator',
  mixins: [levelAliasMixin],
  components: {pagination, DomainCheck},
  data () {
    return {
      editType: '',
      tableData: [{
        company: '',
        contact: '',
        phone: '',
        bySalesman: '',
        joinStart: '',
        joinEnd: '',
        finishStart: '',
        finishEnd: '',
        level: '',
        status: '5',
        test: '2'
      }], // 表格数据
      multipleSelection: [], // 选中数据-多选
      totalElements: 0, // 数据条数
      loading: false, // loading效果
      btnLoading: false, // 按钮锁定
      formLabelWidth: '150px', // label宽度
      newFormLabelWidth: '135px', // label宽度
      // 查询------------------------------------------------------------
      advancedSearch: false, // 高级查询模态
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        company: '', // 公司名
        contact: '', // 联系人
        phone: '', // 通讯号码
        bySalesman: '', // 所属业务员
        joinStart: '', // 加盟事件开始
        joinEnd: '', // 加盟事件结束
        finishStart: '', // 到期事件开始
        finishEnd: '', // 到期事件结束
        level: '', // 级别
        status: '', // 状态
        isFree: '', // 是否免费服务商
      }, // 搜索用的表单
      statusOption: [{value: 3, name: '已签约'}, {value: 5, name: '注销'}], // 状态选择器
      isFreeOption: [{value: 1, name: '是'}, {value: 0, name: '否'}], // 是否免费服务商

      // 新增--------------------------------------------------------------
      newMember: false, // 新增模态框
      newMemberForm: {
        name: '', // 公司名/个人名
        contact: '', // 联系人
        phone: '', // 号码
        provInfo: [],
        province: '', // 省
        city: '', // 市
        address: '', // 详细地址
        payProrata: '', // 分佣比例【数值】
        status: '', // 运营商状态
        isFree: 0
        // freeCount: null
      },
      levelOption: [{value: 1, name: '顶级运营商'}, {value: 2, name: '普通运营商'}], // 合作级别
      // 编辑
      editMember: false, // 编辑模态框
      editMemberForm: {
        id: '',
        name: '', // 公司名/个人名
        contact: '', // 联系人
        provInfo: [],
        province: '', // 省
        city: '', // 市
        address: '', // 详细地址
        payProrata: '', // 分佣比例【数值】
        isFree: 0,
        freeCount: undefined
      }, // 编辑表单
      propsInfo: {
        value: 'id',
        label: 'name'
      },
      // 省市联动--------------------------
      cityDetail: '',
      dataProv: cityJson['selectProv'],
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
      // 省市联动--------------------------
      // 新增判断规则
      Rules: {
        name: [
          {required: true, message: '请输入公司名/个人名', trigger: 'blur'},
          {min: 2, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur'}
        ],
        contact: [
          {required: true, message: '请输入联系人名字', trigger: 'blur'},
          {min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入联系人手机号', trigger: 'blur'},
          {min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur'}
        ],
        level: [
          {required: true, message: '请选择合作级别', trigger: 'blur'}
        ],
        provInfo: [
          {required: true, message: '请选择省份城市/县'}
        ],
        province: [
          {required: true, message: '请选择省份'}
        ],
        city: [
          {required: true, message: '请选择城市/县', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请输入具体的地址', trigger: 'blur'},
          {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
        ],
        payProrata: [
          {required: true, message: '请输入分佣比例', trigger: 'blur'}
        ],
        isFree: [
          {required: true, message: ''}
        ],
        freeCount: [
          {required: true, message: '请输入开通商户数'}
        ]
      },

      // 资料详情模态框
      infoDetailDialogVisible: false, // 资料显示模态框变量
      infoDetailData: {},

      // 资料录入
      infoInputDialogVisible: false, // 资料录入模态框变量
      infoInputForm: {
        id: '',
        domainName: '',
        techSupport: '',
        servicePhone: '',
        wechatQrcode: '',
        copyrightInfo: '',
        icpInfo: '',
        logo: '',
        loginLogo: '',
        bgmPhoto: '',
        mctBgmPhoto: ''
      },
      info_logo_url: '',
      info_login_logo_url: '',
      info_bgmPhoto_url: '',
      info_mctBgmPhoto_url: '',
      infoRule: {
        domainName: [
          {required: true, message: '必须输入域名', trigger: 'blur'}
        ]
      },
      provList: [],
      // 图片上传-------------------
      filesData: {
        module: 'image'
      },
      url: uploadUrl + '/user',
      headers: {
        authorized: sessionStorage.token
      },
      dialogCheckDomain: {
        show: false
      }
    }
  },
  mounted () {
    this.getProviderList()
    this.getProviceTreeCall() // 获取省市区
  },
  watch: {
    'editMemberForm.provInfo' (val) {
      val = val || []
      this.editMemberForm.province = val[0] || ''
      this.editMemberForm.city = val[val.length - 1] || ''
    },
    'newMemberForm.provInfo' (val) {
      val = val || []
      this.newMemberForm.province = val[0] || ''
      this.newMemberForm.city = val[val.length - 1] || ''
    }
  },
  methods: {
    /**
     * 校验域名
     * */
    checkDomain () {
      this.dialogCheckDomain = {
        show: true
      }
    },
    getProviceTreeCall () {
      let params = {
        level: 2
      }
      commonApi.getProviceTree(params).then(res => {
        let newArr = utilsCollect.sortArrayByKeyDeep(res.obj, 1)
        this.provList = newArr
        // this.provList = res.obj
        this.provList.forEach(item => {
          return item.children.forEach(itemSec => {
            delete itemSec.children
            return itemSec
          })
        })
      })
    },

    /**
       * 模态框操作  start----------------------------------------
       **/
    // 高级查询
    advancedSearchOpen: function () {
      this.advancedSearch = true
    },
    advancedSearchClose: function () {
      this.advancedSearch = false
    },

    // 重置商户密码
    resetPassword (row) {
      this.$confirm('是否确认操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        adminResetPwd(row.phone, row.id).then(response => {
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

    // 新增
    newMemberOpen: function () {
      this.newMemberForm = {
        name: '', // 公司名/个人名
        contact: '', // 联系人
        phone: '', // 号码
        cooperationLev: '1', // 级别
        province: '', // 省
        city: '', // 市
        address: '', // 详细地址
        status: '', // 运营商状态
        isFree: 0
        // freeCount: null
      }
      this.newMember = true
    },
    newMemberClose: function () {
      this.newMemberForm = {
        name: '', // 公司名/个人名
        contact: '', // 联系人
        phone: '', // 号码
        province: '', // 省
        city: '', // 市
        address: '', // 详细地址
        status: '', // 运营商状态
        isFree: 0
        // freeCount: null
      }
      this.newMember = false
    },
    // 省市
    getProv: function (prov) {
      this.provIndex = this.dataProv[0]['prov'].indexOf(prov)
      this.dataCity = this.dataProv[this.provIndex + 1]['0_' + this.provIndex]
      this.dialogForm.selectCity = this.dataCity[0]
      this.cityDetail = this.dataProv[this.provIndex + 1]['class1']
      this.dataCountry = this.cityDetail[0]['class2']
      this.dialogForm.selectCountry = this.dataCountry[0]
      this.newMemberForm.city = ''
      this.editMemberForm.city = ''
    },
    getCity: function (city) {
      this.cityIndex = this.dataCity.indexOf(city)
      this.dataCountry = this.cityDetail[this.cityIndex]['class2']
      this.dialogForm.selectCountry = this.dataCountry[0]
    },

    /*
     * 获取运营商列表
    * */
    getProviderList (number, pageSize) {
      this.loading = true
      console.log('this.searchForm', this.searchForm)
      getProviderList(number, pageSize, this.searchForm).then(response => {
        this.searchForm.pageNumber = number
        this.searchForm.pageSize = pageSize
        let data = response.obj
        console.log(data)
        this.tableData = data.content
        this.totalElements = data.totalElements
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(() => {
        this.loading = false
      })
    },

    /*
       * 删除运营商
      * */
    delOperator: function (data) {
      let oid = data.id // eg :data.id

      this.$confirm('确定删除运营商吗？本次操作无法撤销')
        .then(_ => {
          delOperator(oid).then(res => {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.btnLoading = false
            this.$refs.page.refresh()
          }).catch(e => {
            this.btnLoading = false
            this.loading = false
          })
        })
        .catch(_ => {
          this.$message({
            message: '取消删除'
          })
        })
    },

    // 添加运营商
    providerAdd: function (status) {
      let that = this
      that.$refs.ruleForm.validate((valid) => {
        if (valid) {
          that.sureproviderAdd(status, that)
        } else {
          return false;
        }
      })
    },
    sureproviderAdd: function (status) {
      this.btnLoading = true
      this.newMemberForm.status = status
      let oldForm = Object.assign({}, this.newMemberForm)
      delete oldForm.provInfo
      let companyId = sessionStorage.getItem('companyId')
      oldForm.parentId = companyId
      let form = this.deepCopy(oldForm)
      providerAdd(form).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.btnLoading = false
        this.newMemberForm = {
          name: '', // 公司名/个人名
          contact: '', // 联系人
          phone: '', // 号码
          province: '', // 省
          city: '', // 市
          address: '', // 详细地址
          isFree: 0
          // freeCount: null
        }
        this.newMember = false // 关闭模态框
        this.$refs.page.refresh()
        this.btnLoading = false
      }).catch(e => {
        this.loading = false
        this.btnLoading = false
      })
    },
    // 编辑
    editMemberOpen: function (row) {
      console.log(row)
      // 打开模态框
      this.editMemberForm.id = row.id
      this.editMemberForm.name = row.name
      this.editMemberForm.contact = row.contact
      this.editMemberForm.phone = row.phone
      this.editMemberForm.cooperationLev = row.cooperationLev
      this.editMemberForm.province = row.province
      this.editMemberForm.province = row.province
      this.editMemberForm.city = row.city
      this.editMemberForm.provInfo = [row.province, row.city]
      this.editMemberForm.address = row.address
      this.editMemberForm.isFree = row.isFree
      this.editMemberForm.freeCount = row.freeCount
      // 获取这个运营商的信息
      this.editMember = true
    },
    // 关闭编辑框
    editMemberClose: function () {
      this.editMember = false
    },
    // 确认修改
    editOpera: function () {
      let that = this
      that.$refs.ruleFormEdite.validate((valid) => {
        if (valid) {
          that.sureEditOpera()
        } else {
          return false
        }
      })
    },
    sureEditOpera() {
      this.loading = true
      this.btnLoading = true
      let oldForm = Object.assign({}, this.editMemberForm)
      delete oldForm.provInfo
      let companyId = sessionStorage.getItem('companyId')
      oldForm.companyId = companyId
      let form = this.deepCopy(oldForm)
      providerUpdate(form).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.btnLoading = false
        this.editMemberClose()
        this.$refs.page.refresh()
      }).catch(() => {
        this.btnLoading = false
        this.loading = false
      })
    },
    // 提交审核或者审核
    OperatorUpdateAudit (id, status) {
      this.$confirm('是否确认操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(id, status).then(response => {
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
    rooterDeatil (data) {
      // console.log(data)
      // query发送ID到详情
      let id = data.id
      this.$router.push({path: '/operator/views/operaDetail', query: {id: id}})
    },

    /**
       * 资料详情模态框
       */

    infoDetailDialogClose: function () {
      this.infoDetailData = {} // 清空数据，下次回显时不会异常
      this.infoDetailDialogVisible = false
    },

    infoDetailDialogOpen: function (data) {
      let id = data.id

      if (id == '' || id == null) {
        this.$message.error('没有获取到id，请刷新重试！')
        return false
      }
      findDetail(id).then(res => {
        let data = res.obj
        if (data == null) {
          this.$message('还未设置服务生信息')
          return
        }
        this.infoDetailData = data
      }).catch(e => {

      })

      this.infoDetailDialogVisible = true
    },

    /**
       * 资料录入
       */
    // 模态框关闭
    infoInputDialogClose: function () {
      this.$refs['infoInput'].resetFields()
      this.info_logo_url = ''
      this.info_bgmPhoto_url = ''
      this.infoInputDialogVisible = false
    },
    // 模态框打开
    infoInputDialogOpen: function (data, type) {
      let id = data.id
      this.editType = type ? 1 : 2
      if (id == '' || id == null) {
        this.$message.error('没有获取到id，请刷新重试！')
        return false
      }
      // 获取详情
      findEntryDetail(id).then(res => {
        let data = res.obj
        this.infoInputForm.id = data.id
        this.infoInputForm.domainName = data.domainName || ''
        this.infoInputForm.techSupport = data.techSupport || ''
        this.infoInputForm.servicePhone = data.servicePhone || ''
        this.infoInputForm.wechatQrcode = data.wechatQrcode || ''
        this.infoInputForm.copyrightInfo = data.copyrightInfo || ''
        this.infoInputForm.icpInfo = data.icpInfo || ''
        this.infoInputForm.logo = data.logo || ''
        this.infoInputForm.loginLogo = data.loginLogo || ''
        this.infoInputForm.bgmPhoto = data.bgmPhoto || ''
        this.infoInputForm.mctBgmPhoto = data.mctBgmPhoto || ''
        this.info_logo_url = data.logo ? this.getImg(data.logo) : ''
        this.info_login_logo_url = data.loginLogo ? this.getImg(data.loginLogo) : ''
        this.info_bgmPhoto_url = data.bgmPhoto ? this.getImg(data.bgmPhoto) : ''
        this.info_mctBgmPhoto_url = data.mctBgmPhoto ? this.getImg(data.mctBgmPhoto) : ''
      }).catch(e => {

      })
      this.infoInputDialogVisible = true
    },
    // 提交详情
    infoInputSubmit: function () {
      let that = this
      this.btnLoading = true
      this.$refs['infoInput'].validate((valid) => {
        if (valid) {
          let data = this.infoInputForm
          submitDetail(data).then(res => {
            setTimeout(function () {
              that.infoInputDialogClose()
              that.btnLoading = false
              that.$message.success('提交成功')
            }, 500)
          }).catch(e => {
            this.btnLoading = false
          })
        } else {
          this.$message.error('您还有未填写的内容')
          this.btnLoading = false
          return false
        }
      })
    },

    logoUpload: function (response, file) {
      console.log(response)
      this.$message({
        message: 'Logo上传成功',
        type: 'success'
      })
      this.infoInputForm.logo = response.obj
      this.info_logo_url = this.getImg(response.obj)
    },
    loginLogoUpload: function (response, file) {
      this.$message({
        message: 'loginLogo上传成功',
        type: 'success'
      })
      this.infoInputForm.loginLogo = response.obj
      this.info_login_logo_url = this.getImg(response.obj)
    },
    bgUpload: function (response, file) {
      console.log(response)
      this.$message({
        message: '登录页背景图上传成功',
        type: 'success'
      })
      this.infoInputForm.bgmPhoto = response.obj
      this.info_bgmPhoto_url = this.getImg(response.obj)
    },
    mactbgUpload: function (response, file) {
      console.log(response)
      this.$message({
        message: '商户登录页背景图上传成功',
        type: 'success'
      })
      this.infoInputForm.mctBgmPhoto = response.obj
      this.info_mctBgmPhoto_url = this.getImg(response.obj)
    },

    /**
       * 重置图片
       */
    removeImg: function (type) {
      if (type === 'logo') {
        this.infoInputForm.logo = ''
        this.info_logo_url = ''
      } else if (type === 'bgmPhoto') {
        this.infoInputForm.bgmPhoto = ''
        this.info_bgmPhoto_url = ''
      } else if (type == 'mctBgmPhoto') {
        this.infoInputForm.mctBgmPhoto = ''
        this.info_mctBgmPhoto_url = ''
      } else if (type === 'loginLogo') {
        this.infoInputForm.loginLogo = ''
        this.info_login_logo_url = ''
      } else {
      }
    },

    /**
       *图片上传失败
       **/
    handleImageFailed () {
      this.$message({
        message: '图片上传失败',
        type: 'error'
      })
    },
    /**
       *对类型、大小做限制
       **/
    beforeLogoUpload (file) {
      let isImage = file.type.substring(0, 5) === 'image'
      if (!isImage) {
        this.$message.error('只允许图片格式（jpg / jpeg / png）')
        return false
      }
      return true
    },
    /**
       * 深拷
       */

    deepCopy: function (obj) {
      var result = Array.isArray(obj) ? [] : {}
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object') {
            result[key] = deepCopy(obj[key]) // 递归
          } else {
            result[key] = obj[key]
          }
        }
      }
      return result
    },

    /**
       * 换取图片
       */
    getImg: function (val) {
      let reg = /^[0-9]*$/
      if (reg.test(val) && val != '') {
        return returnFilesUrl(val)
      } else {
        let base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAIAAAC2BqGFAAAFLklEQVR42u2dfVPyMAzA9/0/GyLKy4kep6Kgk0NRFJ2gPD13t+vTbqVbm6QdyV+Ks01/ZFmbplmyZ0GRhBEwaAbNwqAZNINmYdAMmoVBM+gG8v7+3rGWx8dHBl1POs4yn88ZdKWkadrxLQz6P/n5+emAyenpKYO2dRTj8fj397f03xeLhU0L9/f3xwsa4q6fzWZhepIkNMqDwQDUF11fXx8LaOEEShEMh0O0r7P9oD8+PpBHfn5+rnfX6/XaDPrl5UUf8/f3N5WnaifozWZDO9TpdEqoAB7oEBzlaDSiUiOhokw12dIfxTjzkISKMiHr3W6HrwY46OVyGWA4Al+NhNCcg2ItZoERg1YGc3t7Kz48OzsLk3VVOCV00NvttopmIKz1lXqUoM1jCIR1+0GHM+fzHtJCBd3r9WzwhWDXOL0n5NqTs1Y89Ww2ixX08/Oz+WJy1ghdJ4HoTeuvlVBqm0GT2zX0BiM46FrhZkLW0J36By08sovGVKzjA+2uMQlrcecdHWgq1hGDdllo4bOWO3p9fY0J9MPDg8ebA5o16LYLLOgsyxxbw7Rr0PA0LGixunVvEI213P7JyUlMoH2F0nFYg7YPC/rz8xOIAgQLueV+vx8T6Lu7O48tQ9s1nObgoLvdrt/GQVnLbW42m6NYsJCwPsaVIb6/FiuUyECLByDCnNe7XccXVFKUXi6XUbCOHjTootkja9BABxTowWCAFgnywjrWPUNF9cvLy8BZtwQ0QijZhbVyYvfr6ysm0GJlRbsX1XgDHkg9ypSwQOxavnixWEQPGuiWdGTdhiRHEqOuxVo/p9US0FRJGpbprKAqYR+twDm+aWPXyp9Wq1XcoKkciJl1Cw8LCRkOh0GxHo/HLTz+Ruus9xbHwrzsIIcCmpZ1qV0X1o2jA2p1A32c2+2WkDVmuSXseh1UpTP0fr1nboQFusppwq0bS7vzmAcRLug9VgWei4uL0l7SNMUfMlnxqm63C4dbON/QCoVRlmObTCaGWVeDXKH1eh1sYUf6AoNXV1eWNRmn0+nb29tutxP/JXz609NTlXMIsHZmKLVJ4Upmos0g4wANgRs6ThQx6FzMZS/jKrIbNGhZsixTkhdiKRgdGejWCINm0AyahUEzaAbNCBg0g2Zh0C0BXZTOtbm43+9DHEEFFcPoHKMoh0Hr6SalQRz7EI+vN2CJX70HniIDbQ7xMOjmt5W7Hg1ayEHrn6dpavZXuekEClrupnSEgYDO340xmUyiBJ33IbSf/0mu6FySvY8XX7mD1ov3l6oROujGD0Mc0KvVqkinU0TZVj8IGmJDxwq0UrzCxnU0PuzXDLTyygb5siLHw951kIE2m1J+2psQdH7UbjQa6e3kP6/Xa3cfjbFgybKscM0G1yE/62tVQW9mPvL3rZQjM5tboKCr0n/kWW3VCRE00OYu4gB90HUU34SLxspDta4ayuKlqF0hLF1PO48V9P7vZV+OGruAllGKGV5pOST5Ai8PQ1jQcIksLqDFxE720QcVOF7Q+jzBZQmuzOr0kl9m0Dc3N35nRw1Be5+rFVUc3EGXJtvpcY8q0LUO6ccH2n4CrnyugNaTz6tOXMUB2q/r0K+0jzZUuY7S+ah8nOLoLNpwRNsFdFWYyQzaPtM3JtDFu191B+oXtKXrKKbbEKECGtchryyUEIR9pLB0keKiW63znRGALr2Ra/VS9Z25gC7iq0DBLxrXka/NvCxqPbqO0nuLEjQLaqyDhUEzaAbNCBg0g2Zh0AyaQbMw6DbJP0zQqPbAWqsMAAAAAElFTkSuQmCC'
        return base64
      }
    },

    /*
   * 搜索
   * */
    search (e) {
      // console.log(e, this.searchForm)

      this.$refs.page.search()
    },
    /*
      * 重置
      * */
    reset () {
      this.searchForm = {
        pageNumber: 1,
        pageSize: this.searchForm.pageSize,
        company: '', // 公司名
        contact: '', // 联系人
        status: ''// 状态
      }// 搜索用的表单
      this.$refs.page.search()
    },

    /*
     * 刷新
     * */
    refresh () {
      this.$refs.page.refresh()
    },
    /**
     * 允许自定义logo
     */
    toggleAllow (status, data) {
      let params = {
        id: data.id,
        name: data.name,
        contact: data.contact,
        province: data.province,
        city: data.city,
        address: data.address,
        payProrata: data.payProrata,
        phone: data.phone,
        cooperationLev: data.cooperationLev,
        companyId: sessionStorage.getItem('companyId')
      }
      params.allowSubordinateUseLogo = status ? 1 : 0
      providerUpdate(params).then(res => {
        this.getProviderList(this.searchForm.pageNumber, this.searchForm.pageSize)
      })
    }
  },
  filters: {

    // 过滤日期
    filterTime: function (time) {
      if (time == null) {
        return ''
      }
      return time.split(' ')[0]
    },

    // 列表状态过滤器
    statusfilter: function (s) {
      let text = ''
      if (s == '' || s == null || s == undefined) { // "",null,undefined
        text = 'error'
      } else {
        switch (s) {
          case '1':
            text = '未启用'
            break
          case '2':
            text = '待审核'
            break
          case '3':
            text = '已签约'
            break
          case '4':
            text = '过期'
            break
          case '5':
            text = '注销'
            break
          default :
            text = '未知'
            break
        }
      }
      return text
    }

  }
}
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .formItem {
    display: inline-block;
    width: 150px;
    max-width: 100%;
  }

  .details-info-file {
    width: 100%;
  }

  .details-info-file table tr {
    color: #777777;
    font-size: 14px;
    line-height: 28px;
  }

  .details-info-file table tr td:nth-child(1):after {
    content: '：';
  }

  .details-info-file table tr td:nth-child(1) {
    width: 40%;
    text-align: right;
  }

  .details-info-file table tr td:nth-child(2) {
    width: 60%;
  }

  .logo-img-box {
    height: 150px;
    width: 150px;
    border-radius: 8px;
    background-color: #d0d0d0;
  }

  .bg-img-box {
    height: 150px;
    width: auto;
    border-radius: 8px;
    background-color: #d0d0d0;
  }

  .input-width {
    width: 260px;
  }

  /*图片上传*/
  .logo-uploader {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background-color: #dfdfdf;
  }

  .logo-uploader:hover {
    border-color: #409EFF;
  }

  .logo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 160px !important;
    height: 160px !important;
    line-height: 160px;
    text-align: center;
  }

  .logo {
    width: 160px;
    height: 160px;
    display: block;
  }

  .tips-rule {
    font-size: 12px;
    color: #ff1719;
  }

</style>
