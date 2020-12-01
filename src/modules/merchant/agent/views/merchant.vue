<template>
  <div class="app-container" v-loading="loading">
    <!--功能-->
    <div class="action-container">
      <!--商户-->
      <el-select v-if="userType==='2'" v-model="searchForm.channel" @change="search" placeholder="" size="small"
                 class="formItem">
        <el-option :label="`本${levelAlias.firstName}商户`"
                   value="1"></el-option>
        <el-option :label="`本${levelAlias.secondName}商户`" value="2"></el-option>
      </el-select>
      <!--商户-->
      <el-input v-model="searchForm.name" @keyup.enter.native="search" placeholder="商户名" size="small"
                class="formItem"></el-input>
      <!--联系人-->
      <el-input v-model="searchForm.contact" @keyup.enter.native="search" placeholder="联系人" size="small"
                class="formItem"></el-input>
      <!--按钮-->
      <el-button type="primary" size="small" @click="search">查询</el-button>
      <el-button type="primary" size="small" @click="reset">重置</el-button>
      <el-button type="primary" size="small" @click="newMerchantOpen">新增</el-button>
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
        label="商户名"
        width="180">
        <!--防止字符串过长，影响表格，加了一个鼠标经过文字提示-->
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.name" placement="top">
            <span>{{ scope.row.name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="商户账号">
      </el-table-column>
      <el-table-column
        prop="contact"
        label="联系人">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系电话">
      </el-table-column>
      <el-table-column
        label="经营类别">
        <template slot-scope="scope">
          <span>{{ scope.row.businessLevOne }}-{{ scope.row.businessLevTwo }}-{{ scope.row.businessLevThree }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="归属上级">
      </el-table-column>
      <el-table-column
        prop="managerName"
        label="归属业务员">
      </el-table-column>
      <el-table-column
        prop="status"
        label="签约状态">
        <template slot-scope="scope">
          <template v-if="scope.row.status===1">签约</template>
          <template v-else-if="scope.row.status===2">未签约</template>
          <template v-else>未知</template>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">

        <template slot-scope="scope">
          <!--//如果有方法，传入参数“scope.row”-->
          <!--//如果需要索引，传入参数“scope.$index”-->
          <!--//如果需要当前整页表格数据，传入参数“tableData”-->
          <el-button type="text" @click="rooterDeatil(scope.row)">详情</el-button>
          <el-button type="text" @click="openEditMerchant(scope.row)">修改</el-button>
          <el-button
            type="text"
            @click="resetPassword(scope.row)">重置密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--翻页-->
    <pagination
      :total-elements="totalElements"
      :change-callback="getMerchantList"
      ref="page"></pagination>

    <!--新增模态框-->
    <el-dialog
      title="新增商户"
      width="450px"
      :visible.sync="newMerchant"
      :before-close="newMerchantClose">

      <el-form :model="newMerchantForm" :rules="Rules" ref="newMerchantForm" :label-width="formLabelWidth"
               size="mini" v-if="newMerchant">

        <el-form-item label="商户名：" show-message prop="name">
          <el-input v-model="newMerchantForm.name" class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" show-message prop="contact">
          <el-input v-model="newMerchantForm.contact" class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="手机：" show-message prop="phone">
          <el-input v-model="newMerchantForm.phone" class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱：" show-message prop="email">
          <el-input v-model="newMerchantForm.email" class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="省市：" prop="provInfo">
          <el-cascader v-model="newMerchantForm.provInfo"
                       style="width: 240px"
                       filterable
                       clearable
                       :props="propsInfo"
                       :options="provList"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" show-message prop="address">
          <el-input v-model="newMerchantForm.address" class="formItem"></el-input>
        </el-form-item>
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newMerchantClose">取消</el-button>
        <el-button type="primary" @click="submitMerchant()" v-loading="btnLoading" :disabled="btnLoading">确定</el-button>
      </span>
    </el-dialog>
    <!--新增模态框-->

    <!--修改模态框-->
    <el-dialog
      title="修改商户"
      width="450px"
      :visible.sync="editMerchant"
      :before-close="editMerchantClose">

      <el-form :model="editMerchantForm" :rules="Rules" ref="editMerchantForm" :label-width="formLabelWidth"
               size="mini">

        <el-form-item label="商户名：" show-message prop="name">
          <el-input v-model="editMerchantForm.name" class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" show-message prop="contact">
          <el-input v-model="editMerchantForm.contact" class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱：" show-message prop="email">
          <el-input v-model="editMerchantForm.email" class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="省市：" prop="provInfo">
          <el-cascader v-model="editMerchantForm.provInfo"
                       style="width: 240px"
                       filterable
                       clearable
                       :props="propsInfo"
                       :options="provList"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" show-message prop="address">
          <el-input v-model="editMerchantForm.address" class="formItem"></el-input>
        </el-form-item>
        <el-form-item label="经营类别：" prop="businessLevOne">
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editMerchantClose">取消</el-button>
        <el-button type="primary" @click="changeMerchant()" v-loading="btnLoading" :disabled="btnLoading">确定</el-button>
      </span>
    </el-dialog>
    <!--修改模态框-->

  </div>
</template>

<script>
import {getMerchantList, addMerchant, editMerchant, resetPwd} from '../api/merchant'
import * as commonApi from '@/api/common'
import pagination from '@/components/pagination/index'
import cityJson from '@/assets/city/city.json'
import typeJson from '@/assets/merchantType/merchantType.json'
import * as utilsCollect from '@/utils/utilsCollect'
import { levelAliasMixin } from '@/mixins'
export default {
  name: 'merchant',
  mixins: [levelAliasMixin],
  components: {pagination},
  data () {
    return {
      formLabelWidth: '130px',
      loading: true,
      btnLoading: false,
      userType: '',
      tableData: [{
        name: '123',
        account: '584708193',
        contact: '',
        phone: '',
        bySalesman: '',
        type: '企业-123-321', // 经营类别
        level: '',
        status: '5',
        test: '2'
      }], // 表格数据
      totalElements: 0,
      searchForm: {
        name: '', // 公司名
        contact: '', // 联系人，
        channel: '1' // {{levelAlias.secondName}}商户筛选 1:直联,2:间接关联
      }, // 搜索用的表单
      // 新增
      newMerchant: false, // 新增模态框
      newMerchantForm: {
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
        // payProrata: 0, // 分佣比例【数值】
        companyId: '', // {{levelAlias.firstName}}或者{{levelAlias.secondName}}id
        managerId: '', // 业务员id
        status: '1' // 正常状态
      },
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
      // 经营类型
      dataTypes: [], // 经营类型数据
      dataTypes2: [], // 经营类型数据2 选中1后出现
      dataTypes3: [], // 经营类型数据3 选中2后出现
      selectedType1: '',
      selectedType2: '',
      selectedType3: '',
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
        address: '' // 详细地址
        // payProrata: '' // 分佣比例【数值】
      },
      /**
         * 判断规则
         */
      Rules: {
        name: [
          {required: true, message: '请输入商户名', trigger: 'blur'},
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
        email: [
          {required: true, message: '请输入电子邮箱', trigger: 'blur'}
        ],
        provInfo: [
          {required: true, message: '请选择省份城市/县'}
        ],
        province: [
          {required: true, message: '请选择省份', trigger: 'blur'}
        ],
        city: [
          {required: true, message: '请选择城市/县', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请输入具体的地址', trigger: 'blur'},
          {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
        ],
        type1: [
          {required: true, message: '请选择经营类别', trigger: 'blur'}
        ],
        businessLevOne: [
          {required: true, message: '请选择一级经营类别'}
        ],
        businessLevTwo: [
          {required: true, message: '请选择二级经营类别'}
        ],
        businessLevThree: [
          {required: true, message: '请选择三级经营类别'}
        ]
        /*
        payProrata: [
          {required: true, message: '请输入分佣比例', trigger: 'blur'}
        ]
        */
      }
    }
  },
  mounted () {
    this.getMerchantList(1, 10)
    this.userType = sessionStorage.getItem('userType')
    this.getProviceTreeCall() // 获取省市区
  },
  watch: {
    'editMerchantForm.provInfo' (val) {
      val = val || []
      this.editMerchantForm.province = val[0] || ''
      this.editMerchantForm.city = val[val.length - 1] || ''
    },
    'newMerchantForm.provInfo' (val) {
      val = val || []
      this.newMerchantForm.province = val[0] || ''
      this.newMerchantForm.city = val[val.length - 1] || ''
    }
  },
  methods: {
    getProviceTreeCall () {
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
       * 获取商户列表
       * @param number
       * @param pageSize
       */
    getMerchantList: function (number, pageSize) {
      this.loading = true
      getMerchantList(number, pageSize, this.searchForm).then(res => {
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
       * 关闭新增模态框
       */
    newMerchantClose: function () {
      this.newMerchantForm = {
        name: '', // 公司名/个人名
        contact: '', // 联系人
        phone: '', // 号码
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
    submitMerchant: function (sType) {
      this.$refs.newMerchantForm.validate((valid) => {
        if (valid) {
          this.sureAdd(sType)
        } else {
          return false
        }
      })
    },
    sureAdd (sType) {
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
          message: res.msg,
          type: 'success'
        })
        this.btnLoading = false
        this.newMerchantForm = {
          name: '', // 公司名/个人名
          contact: '', // 联系人
          phone: '', // 号码
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
      // this.editMerchantForm.payProrata = row.payProrata * 100
      this.dataTypes = typeJson
      this.getEditType1(row.businessLevOne) // 一级选项
      this.getEditType2(row.businessLevTwo) // 二级选项
      this.getEditType3(row.businessLevThree) // 三级选项
      // 获取这个{{levelAlias.firstName}}的信息
      this.editMerchant = true
    },

    /**
       * 关闭编辑模态框
       */
    editMerchantClose: function () {
      this.editMerchant = false
    },

    // 提交修改 editMerchantForm
    changeMerchant () {
      this.$refs.editMerchantForm.validate((valid) => {
        if (valid) {
          this.sureModify()
        } else {
          return false
        }
      })
    },
    sureModify () {
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
        this.btnLoading = false
        this.editMerchantClose()
        this.$refs.page.refresh()
      }).catch(() => {
        this.btnLoading = false
        this.loading = false
      })
    },
    /**
       *省市
       */
    getProv: function (prov) {
      this.provIndex = this.dataProv[0]['prov'].indexOf(prov)
      this.dataCity = this.dataProv[this.provIndex + 1]['0_' + this.provIndex]
      // this.dialogForm.selectCity = this.dataCity[0]
      this.cityDetail = this.dataProv[this.provIndex + 1]['class1']
      this.dataCountry = this.cityDetail[0]['class2']
      // this.dialogForm.selectCountry = this.dataCountry[0]
      this.newMerchantForm.city = ''
      this.editMerchantForm.city = ''
    },
    getCity: function (city) {
      this.cityIndex = this.dataCity.indexOf(city)
      this.dataCountry = this.cityDetail[this.cityIndex]['class2']
      // this.dialogForm.selectCountry = this.dataCountry[0]
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

    rooterDeatil (data) {
      // console.log(data)
      // query发送ID到详情
      let id = data.id
      this.$router.push({path: '/merchant/agent/views/merchantDetail', query: {id: id}})
    },

    // 重置商户密码
    resetPassword (row) {
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
       * 搜索与重置
       */
    search () {
      this.$refs.page.search()
    },
    reset () {
      // channel 设置为“本商户”
      this.searchForm = {
        name: '', // 公司名
        contact: '', // 联系人，
        channel: '100', // {{levelAlias.secondName}}id
        phone: '', // 通讯号码
        bySalesman: '', // 所属业务员
        joinStart: '', // 加盟事件开始
        joinEnd: '', // 加盟事件结束
        finishStart: '', // 到期事件开始
        finishEnd: '', // 到期事件结束
        level: '', // 级别
        status: ''// 状态
      } // 搜索用的表单
      this.$refs.page.search()
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
