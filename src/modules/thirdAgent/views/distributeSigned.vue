<template>
  <div class="app-container" v-loading="loading">
    <div class="action-container">
      <!--公司-->
      <el-input v-model="searchForm.name" @keyup.enter.native="search" placeholder="公司" size="small"
                class="formItem"></el-input>
      <!--联系人-->
      <el-input v-model="searchForm.contact" @keyup.enter.native="search" placeholder="联系人" size="small"
                class="formItem"></el-input>
      <!--按钮-->
      <el-button type="primary" size="small" @click="search">查询</el-button>
      <!-- <el-button type="primary" size="small" @click="advancedSearchOpen">高级查询</el-button> -->
    </div>

    <!--表格-->
    <el-table
      :data="tableData"
      style="width: 100%"
      row-key="id"
      ref="multipleTable">
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
      <!--
      <el-table-column
        label="微信奖励">
        <template slot-scope="scope">
          {{scope.row.wechatReward==null?'未设置':scope.row.wechatReward+'%'}}
        </template>
      </el-table-column>
      <el-table-column
        label="支付宝奖励">
        <template slot-scope="scope">
          {{scope.row.alipayReward==null?'未设置':scope.row.alipayReward+'%'}}
        </template>
      </el-table-column>
      -->
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
      <el-table-column label="设置LOGO">
        <template slot-scope="scope">
          <div style="width: 60px;height: 60px;display: inline-block;" v-if="scope.row.logo">
            <img :src="scope.row.logoUrl" style="width: 60px;height: 60px;" @click="viewImg(scope.row.logViewUrl)" />
          </div>
          <div v-else>未设置</div>
        </template>
      </el-table-column>
      <!--操作-->
      <el-table-column
        fixed="right"
        label="操作"
        min-width="200">
        <template slot-scope="scope">
          <!--//如果有方法，传入参数“scope.row”-->
          <!--//如果需要索引，传入参数“scope.$index”-->
          <!--//如果需要当前整页表格数据，传入参数“tableData”-->
          <el-button type="text" @click="rooterDeatil(scope.row)">详情</el-button>
          <el-button type="text" :disabled="(scope.row.isDirect === 1 && scope.row.allowSubordinateUseLogo === 1) ? false : true" size="medium" @click="setLogo(scope.row)">{{scope.row.logo?'修改LOGO':'设置LOGO'}}</el-button>
          <!--<el-button type="text" @click="openSetRewardDialog(scope.row)">设置奖励</el-button>-->
          <template v-if="userType==='1' || userType === 1">
            <el-button type="text" @click="upgrade(1, scope.row)">升级</el-button>
            <el-button type="text" @click="upgrade(2, scope.row)">修改上级</el-button>
          </template>
          <template v-if="scope.row.isDirect === 1">
            <el-button type="text" @click="resetPassword(scope.row)">重置密码</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-foot vm-flex">
      <!-- 分页 -->
      <div class="vm-inline-block vm-flex-1 vm-text-right">
        <pagination
          :total-elements="totalElements"
          :change-callback="getOperatorList"
          ref="page"></pagination>
      </div>
    </div>

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
    <!--设置logo-->
    <el-dialog class="vm-dialog"
               title="网站登录后左上角LOGO设置"
               width="398px"
               v-if="dialogSetLogo.show"
               :visible.sync="dialogSetLogo.show">
      <SetLogo :propsInfo="dialogSetLogo"
               @modifyLogo="modifyLogo"></SetLogo>
    </el-dialog>
    <!--升级-->
    <el-dialog class="vm-dialog"
               title="升级"
               width="398px"
               v-if="dialogUpgrade.show"
               :visible.sync="dialogUpgrade.show">
      <Upgrade :propsInfo="dialogUpgrade"
               @refresh="refreshList"></Upgrade>
    </el-dialog>
    <!--修改上级-->
    <el-dialog class="vm-dialog"
               title="修改上级"
               width="398px"
               v-if="dialogUpgradeModify.show"
               :visible.sync="dialogUpgradeModify.show">
      <UpgradeModify :propsInfo="dialogUpgradeModify"
                     @refresh="refreshList"></UpgradeModify>
    </el-dialog>
    <!--图片预览-->
    <ImgView :propImgView="dialogImgViewData" v-if="dialogImgViewData.show"></ImgView>
  </div>
</template>

<script>
import {
  getDistributeList,
  setReward,
  upgradeApi,
  distributeUpdate
} from '../api/distribute'
import {resetPwd} from '@/modules/system/api/user'
import pagination from '@/components/pagination/index'
import SetLogo from '@/components/setLogo/index.vue'
import Upgrade from '@/components/upgrade/index.vue'
import UpgradeModify from '@/components/upgradeModify/index.vue'
import ImgView from '@/components/imgView/index'
import * as imgFuncs from '@/utils/getImgUrl.js'

export default {
  name: 'operator',
  components: {pagination, SetLogo, ImgView, Upgrade, UpgradeModify},
  data () {
    return {
      userType: sessionStorage.getItem('userType'),
      tableData: [{
        name: '',
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
      totalElements: 0, // 数据条数
      loading: false, // loading效果
      btnLoading: false,
      formLabelWidth: '150px', // label宽度
      newFormLabelWidth: '100px', // label宽度
      // 查询------------------------------------------------------------
      advancedSearch: false, // 高级查询模态
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
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
      statusOption: [], // 状态选择器
      setRewardDialog: false,
      rewardForm: {
        id: '',
        wechatReward: '',
        alipayReward: ''
      },
      tableSelectArr: [], // 批量升级
      dialogSetLogo: {
        show: false
      },
      dialogImgViewData: {
        show: false
      },
      dialogUpgrade: {
        show: false
      },
      // 修改上级
      dialogUpgradeModify: {
        show: false
      }
    }
  },
  mounted () {
    this.getOperatorList(1, 10)
  },
  methods: {

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

    /**
       * 模态框操作 end----------------------------------------
       **/

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
        pageNumber: 1,
        pageSize: 10,
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
      }// 搜索用的表单
      this.$refs.page.search()
    },

    /*
       * 获取{{levelAlias.firstName}}列表
      * */
    getOperatorList (number, pageSize) {
      this.loading = true
      this.searchForm.status = 3
      getDistributeList(number, pageSize, this.searchForm).then(response => {
        this.searchForm.pageNumber = number
        this.searchForm.pageSize = pageSize
        let data = response.obj
        data.content.forEach(item => {
          let logoUrl = imgFuncs.getImg(item.logo, 1)
          let logViewUrl = imgFuncs.getImg(item.logo, 2)
          this.$set(item, 'logoUrl', logoUrl)
          this.$set(item, 'logViewUrl', logViewUrl)
        })
        this.tableData = data.content
        this.totalElements = data.totalElements
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(() => {
        this.loading = false
      })
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

    // resetChecked () {
    //   this.$refs.tree.setCheckedKeys([])
    // },

    // 跳转
    rooterDeatil (data) {
      // console.log(data)
      // query发送ID到详情
      let id = data.id
      this.$router.push({path: '/thirdAgent/views/distributeDetail', query: {id: id}})
    },
    // 刷新
    refresh () {
      this.$refs.page.refresh()
    },
    /**
     * 升级
     * @param type 1--升级，2--修改
     */
    upgrade (type, data) {
      if (type === 1) {
        this.dialogUpgrade = {
          show: true,
          data: data,
          type: type,
          level: 2
        }
      } else {
        this.dialogUpgradeModify = {
          show: true,
          data: data,
          type: type,
          level: 2
        }
      }
    },
    /**
     * logo预览
     * */
    viewImg (url) {
      this.dialogImgViewData = {
        show: true,
        url: url
      }
    },
    /**
     * 设置logo
     */
    setLogo (data) {
      this.dialogSetLogo = {
        show: true,
        data: data
      }
    },
    /**
     * 设置logo--成功
     */
    modifyLogo (logo) {
      let data = this.dialogSetLogo.data
      let params = {
        id: data.id,
        name: data.name,
        contact: data.name,
        province: data.province,
        city: data.city,
        address: data.address,
        phone: data.phone,
        companyId: sessionStorage.getItem('companyId'),
        logo: logo
      }
      distributeUpdate(params).then(res => {
        this.$message.success('设置成功')
        this.dialogSetLogo.show = false
        let pageNumber = this.searchForm.pageNumber
        let pageSize = this.searchForm.pageSize
        this.getOperatorList(pageNumber, pageSize)
      })
      console.log(params)
    },
    refreshList () {
      let pageNumber = this.searchForm.pageNumber
      let pageSize = this.searchForm.pageSize
      this.getOperatorList(pageNumber, pageSize)
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
          case 1:
            text = '未启用'
            break
          case 2:
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
