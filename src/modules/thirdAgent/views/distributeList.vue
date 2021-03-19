<template>
  <div class="app-container" v-loading="loading">
    <div class="action-container">
      <!--公司-->
      <el-input v-model="searchForm.name" @keyup.enter.native="search" placeholder="名称" size="small"
                class="formItem"></el-input>
      <!--联系人-->
      <el-input v-model="searchForm.contact" @keyup.enter.native="search" placeholder="联系人" size="small"
                class="formItem"></el-input>
      <!--状态-->
      <el-select v-model="searchForm.status" @change="search" placeholder="状态" size="small"
                 clearable class="formItem">
        <el-option
          v-for="item in statusOption"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <!--按钮-->
      <el-button type="primary" size="small" @click="search">查询</el-button>
      <el-button type="primary" size="small" @click="reset">重置</el-button>
<!--      <el-button type="primary" size="small" @click="advancedSearchOpen">高级查询</el-button>-->
      <el-button type="primary" size="small" @click="newMemberOpen">新增</el-button>
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
      <el-table-column
        label="合作期限">
        <template slot-scope="scope">
          {{scope.row.createTime | filterTime}}/{{scope.row.endCooperaTime | filterTime}}
        </template>
      </el-table-column>
      <el-table-column
        prop="saleName"
        label="归属业务员">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <template v-if="scope.row.status===1">未签约</template>
          <template v-else-if="scope.row.status===2">待审核</template>
          <template v-else-if="scope.row.status===3">已签约</template>
          <template v-else-if="scope.row.status===4">过期</template>
          <template v-else-if="scope.row.status===5">禁用</template>
          <template v-else-if="scope.row.status===6">驳回</template>
        </template>
      </el-table-column>
      <!--操作-->
      <el-table-column
        fixed="right"
        label="操作"
        width="400">
        <template slot-scope="scope">
          <!--//如果有方法，传入参数“scope.row”-->
          <!--//如果需要索引，传入参数“scope.$index”-->
          <!--//如果需要当前整页表格数据，传入参数“tableData”-->
          <el-button type="text" @click="rooterDeatil(scope.row)">详情</el-button>
          <template v-if="scope.row.isDirect === 1">
            <el-button type="text" @click="editMemberOpen(scope.row)" :disabled="(scope.row.status===6 || scope.row.status===3 || scope.row.status===1)?false:true">修改</el-button>
            <el-button type="text"
                       @click="delDistribute(scope.row, 5)"
                       v-if="scope.row.status===3"
                       :disabled="scope.row.status===3?false:true">禁用</el-button>
            <el-button type="text"
                       @click="delDistribute(scope.row, 3)"
                       :disabled="scope.row.status===5?false:true"
                       v-else>启用</el-button>
            <el-button type="text" @click="OperatorUpdateAudit(scope.row.id,2)" :disabled="(scope.row.status===1 || scope.row.status===6)?false:true">提交审核</el-button>
            <el-button
              type="text"
              :disabled="(scope.row.status===3 || scope.row.status===5)?false:true"
              @click="resetPassword(scope.row)">重置密码
            </el-button>
            <el-button
              type="text"
              @click="setProfit(scope.row)">分润设置
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total-elements="totalElements"
      :change-callback="getDistributeList"
      ref="page"></pagination>

    <!--高级查询模态框-->
    <el-dialog
      title="高级查询"
      :visible.sync="advancedSearch"
      width="30%"
      :before-close="advancedSearchClose">
      <span>这是高级查询</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="advancedSearch = false">取 消</el-button>
    <el-button type="primary" @click="advancedSearch = false">确 定</el-button>
  </span>
    </el-dialog>
    <!--高级查询模态框-->

    <!--新增模态框-->
    <el-dialog
      title="新增"
      width="400px"
      :visible.sync="newMember"
      :before-close="newMemberClose">

      <el-form :model="newMemberForm" :rules="Rules" ref="ruleForm" :label-width="newFormLabelWidth"
               size="mini" v-if="newMember">

        <el-form-item label="公司/个人：" show-message prop="name">
          <el-input v-model="newMemberForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" show-message prop="contact">
          <el-input v-model="newMemberForm.contact"></el-input>
        </el-form-item>
        <el-form-item label="手机：" show-message prop="phone">
          <el-input v-model="newMemberForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="newMemberForm.password" type="password" placeholder="可设置初始密码或使用默认密码"></el-input>
        </el-form-item>
        <el-form-item label="省市：" prop="provInfo">
          <el-cascader v-model="newMemberForm.provInfo"
                       style="width: 100%"
                       filterable
                       clearable
                       :props="propsInfo"
                       :options="provList"></el-cascader>
        </el-form-item>
        <el-form-item label="联系地址：" show-message prop="address">
          <el-input v-model="newMemberForm.address"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="newMemberClose">取消</el-button>
    <el-button type="primary" @click="distributeAdd(1)">确定</el-button>
    <el-button type="primary" @click="distributeAdd(2)">确定并提交审核</el-button>
  </span>
    </el-dialog>
    <!--新增模态框-->

    <!--编辑模态框-->
    <el-dialog
      :title="`编辑${levelAlias.secondName}信息`"
      width="400px"
      :visible.sync="editMember"
      :before-close="editMemberClose">

      <el-form :model="editMemberForm" :rules="Rules" ref="ruleFormEdite" :label-width="newFormLabelWidth"
               size="mini"  v-if="editMember">

        <el-form-item label="公司/个人：" show-message prop="name">
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
        <el-form-item label="联系地址：" show-message prop="address">
          <el-input v-model="editMemberForm.address"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="editMemberClose">取 消</el-button>
    <el-button type="primary" @click="editOpera">确 定</el-button>
  </span>
    </el-dialog>
    <!--编辑模态框-->

    <!--设置奖励模态框-->
    <el-dialog
      title="设置奖励"
      :visible.sync="setRewardDialog"
      :before-close="closeSetRewardDialog">
      <el-form :model="rewardForm">
        <el-form-item label="微信奖励(单位:%)" :label-width="formLabelWidth">
          <el-input v-model="rewardForm.wechatReward"></el-input>
        </el-form-item>
        <el-form-item label="支付宝奖励(单位:%)" :label-width="formLabelWidth">
          <el-input v-model="rewardForm.alipayReward"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSetRewardDialog">取 消</el-button>
        <el-button type="primary" @click="setReward" :loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!--分润设置-->
    <el-dialog class="vm-dialog"
               title="分润设置"
               width="498px"
               v-if="dialogProfit.show"
               :visible.sync="dialogProfit.show">
      <SetProfitCompent :propsInfo="dialogProfit"
                        :typeVal="3"
                        @getTableList="search"></SetProfitCompent>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDistributeList,
  delDistribute,
  distributeAdd,
  distributeUpdate,
  audit,
  setReward
} from '../api/distribute'
import * as commonApi from '@/api/common'
import {resetPwd} from '@/modules/system/api/user'
import pagination from '@/components/pagination/index'
import cityJson from '@/assets/city/city.json'
import * as utilsCollect from '@/utils/utilsCollect'
// import SetProfitCompent from './components/setProfit'
import SetProfitCompent from '../../operator/views/components/setProfit'
import { levelAliasMixin } from '@/mixins'
import * as validatorRules from '@/utils/validator'

export default {
  name: 'operator',
  mixins: [levelAliasMixin],
  components: {pagination, SetProfitCompent},
  data () {
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
      tableData: [], // 表格数据
      multipleSelection: [], // 选中数据-多选
      totalElements: 0, // 数据条数
      loading: false, // loading效果
      btnLoading: false,
      formLabelWidth: '150px', // label宽度
      newFormLabelWidth: '100px', // label宽度
      // 查询------------------------------------------------------------
      advancedSearch: false, // 高级查询模态
      searchForm: {
        name: '', // 公司名
        contact: '', // 联系人
        phone: '', // 通讯号码
        bySalesman: '', // 所属业务员
        joinStart: '', // 加盟事件开始
        joinEnd: '', // 加盟事件结束
        finishStart: '', // 到期事件开始
        finishEnd: '', // 到期事件结束
        level: '', // 级别
        status: ''// 状态
      }, // 搜索用的表单
      statusOption: [{value: 1, name: '未签约'}, {value: 2, name: '待审核'},
        {value: 3, name: '已签约'}, {value: 4, name: '过期'}, {value: 5, name: '禁用'}, {value: 6, name: '驳回'}], // 状态选择器

      // 新增--------------------------------------------------------------
      newMember: false, // 新增模态框
      newMemberForm: {
        name: '', // 公司名/个人名
        contact: '', // 联系人
        phone: '', // 号码
        password: '',
        provInfo: [],
        province: '', // 省
        city: '', // 市
        address: '', // 详细地址
        // payProrata: '', // 分佣比例【数值】
        // cooperationLev: '',
        status: '' // {{levelAlias.secondName}}状态
      },
      // 编辑
      editMember: false, // 编辑模态框
      editMemberForm: {
        id: '',
        name: '', // 公司名/个人名
        contact: '', // 联系人
        provInfo: [],
        province: '', // 省
        city: '', // 市
        address: '' // 详细地址
        // cooperationLev: '',
        // payProrata: ''// 分佣比例【数值】
      }, // 编辑表单
      propsInfo: {
        value: 'id',
        label: 'name'
      },
      provList: [],
      dialogProfit: {
        show: false
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
          { required: true, validator: validPhone }
          // {min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur'}
        ],
        level: [
          {required: true, message: '请选择合作级别', trigger: 'blur'}
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
        ]
        /*
        cooperationLev: [
          {required: true, message: '请选择合作级别'}
        ],
        payProrata: [
          {required: true, message: '请输入分佣比例', trigger: 'blur'}
        ]
         */
      },
      setRewardDialog: false,
      rewardForm: {
        id: '',
        wechatReward: '',
        alipayReward: ''
      }
    }
  },
  mounted () {
    this.getDistributeList(1, 10)
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
    getProviceTreeCall () {
      let params = {
        level: 2
      }
      commonApi.getProviceTree(params).then(res => {
        // this.provList = res.obj
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

    // 新增
    newMemberOpen: function () {
      this.newMemberForm = {
        name: '', // 公司名/个人名
        contact: '', // 联系人
        phone: '', // 号码
        password: '',
        provInfo: [],
        province: '', // 省
        city: '', // 市
        address: '', // 详细地址
        // payProrata: '', // 分佣比例【数值】
        status: '' // {{levelAlias.secondName}}状态
      }
      this.newMember = true
    },
    newMemberClose: function () {
      this.newMemberForm = {
        name: '', // 公司名/个人名
        contact: '', // 联系人
        phone: '', // 号码
        password: '',
        provInfo: [],
        province: '', // 省
        city: '', // 市
        address: '', // 详细地址
        // payProrata: '', // 分佣比例【数值】
        status: '' // {{levelAlias.secondName}}状态
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
     * 获取{{levelAlias.secondName}}列表
    * */
    getDistributeList (number, pageSize) {
      this.loading = true
      getDistributeList(number, pageSize, this.searchForm).then(response => {
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
       * 删除{{levelAlias.secondName}}
      * */
    delDistribute: function (data, type) {
      let oid = data.id // eg :data.id
      let statusaMsg = type === 3 ? '启用' : '禁用'
      let msg = `确定${statusaMsg}吗？`
      this.$confirm(msg)
        .then(_ => {
          delDistribute(oid, type).then(res => {
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
        }) .catch(_ => {
        })
    },

    // 添加{{levelAlias.secondName}}
    distributeAdd: function (status) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.sureAdd(status)
        } else {
          return false
        }
      })
    },
    sureAdd (status) {
      if (this.newMemberForm.password) {
        let isValid = validatorRules.password.valid(this.newMemberForm.password)
        if (!isValid) {
          this.$message.warning(validatorRules.password.msg)
          return
        }
      }
      this.newMemberForm.status = status
      let oldForm = Object.assign({}, this.newMemberForm)
      delete oldForm.provInfo
      let companyId = sessionStorage.getItem('companyId')
      oldForm.companyId = companyId
      let form = this.deepCopy(oldForm)
      // let form = this.deepCopy(this.newMemberForm)
      // form.payProrata = form.payProrata / 100
      // this.newMemberForm.payProrata=this.newMemberForm.payProrata/100
      distributeAdd(form).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.btnLoading = false
        this.newMemberForm = {
          name: '', // 公司名/个人名
          contact: '', // 联系人
          phone: '', // 号码
          password: '',
          // cooperationLev: '1', // 级别
          provInfo: [],
          province: '', // 省
          city: '', // 市
          address: '', // 详细地址
          // payProrata: '', // 分佣比例【数值】
          status: '' // {{levelAlias.secondName}}状态
        }
        this.newMember = false // 关闭模态框
        this.$refs.page.refresh()
      }).catch(e => {
        this.loading = false
      })
    },

    // 编辑
    editMemberOpen: function (row) {
      console.log(row)
      // 打开模态框
      this.editMemberForm.id = row.id
      this.editMemberForm.name = row.name
      this.editMemberForm.contact = row.contact
      // this.editMemberForm.cooperationLev = row.cooperationLev
      this.editMemberForm.province = row.province
      // this.editMemberForm.cooperationLev = row.cooperationLev
      this.editMemberForm.province = row.province
      this.editMemberForm.city = row.city
      this.editMemberForm.provInfo = [row.province, row.city]
      this.editMemberForm.address = row.address
      // this.editMemberForm.payProrata = row.payProrata * 100
      // 获取这个{{levelAlias.secondName}}的信息
      this.editMember = true
    },
    // 关闭编辑框
    editMemberClose: function () {
      this.editMember = false
    },
    // 确认修改
    editOpera () {
      this.$refs.ruleFormEdite.validate((valid) => {
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
      let oldForm = Object.assign({}, this.editMemberForm)
      delete oldForm.provInfo
      let companyId = sessionStorage.getItem('companyId')
      oldForm.companyId = companyId
      let form = this.deepCopy(oldForm)
      // let form = this.deepCopy(this.editMemberForm)
      // form.payProrata = form.payProrata / 100
      // this.editMemberForm.payProrata = this.editMemberForm.payProrata / 100
      distributeUpdate(form).then(response => {
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
        audit(id, status).then(response => {
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
      this.$router.push({path: '/thirdAgent/views/distributeDetail', query: {id: id}})
    },

    // 打开奖励模态框
    openSetRewardDialog (row) {
      console.log('奖励对象id为 ' + row.id)
      this.rewardForm.id = row.id
      this.rewardForm.wechatReward = row.wechatReward
      this.rewardForm.alipayReward = row.alipayReward
      this.setRewardDialog = true
    },

    // 关闭奖励模态框
    closeSetRewardDialog () {
      this.rewardForm.wechatReward = ''
      this.rewardForm.alipayReward = ''
      this.setRewardDialog = false
    },

    setReward: function (row, isDefault) {
      this.loading = true
      setReward(this.rewardForm).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.setRewardDialog = false
        this.$refs.page.refresh()
      }).catch(() => {
        this.loading = false
      })
    },

    /**
       * 模态框操作 end----------------------------------------
       **/

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

    /*
   * 搜索
   * */
    search () {
      this.$refs.page.search()
    },
    /*
      * 重置
      * */
    reset () {
      this.searchForm = {
        name: '', // 公司名
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
     * 分润设置
     * @param data
     */
    setProfit (data) {
      this.dialogProfit = {
        show: true,
        data: data
      }
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
</style>
