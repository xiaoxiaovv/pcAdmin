<template>
  <div class="app-container">
  <!--<div class="app-container" v-loading="loading">-->
    <!--功能-->
    <div class="action-container">
      <!--商户名/代理名称-->
      <el-input v-model="queryList.companyName" @keyup.enter.native="search" placeholder="代理名称" size="small" clearable
                class="formItem"></el-input>
      <el-input v-model="queryList.name" @keyup.enter.native="search" placeholder="商户名" size="small" clearable
                class="formItem"></el-input>
      <!--联系人-->
      <!--
      <el-input v-model="queryList.contact" @keyup.enter.native="search" placeholder="联系人" size="small" clearable
                class="formItem"></el-input>-->
      <!--结算状态-->
      <el-select  placeholder="状态"
                  size="small"
                  class="formItem"
                  clearable
                  v-model="queryList.status"
                  @change="search">
        <el-option v-for="item in statusOption"
                   :key="item.value"
                   :label="item.name"
                   :value="item.value"></el-option>
      </el-select>
      <!--按钮-->
      <el-button type="primary" size="small" @click="search">查询</el-button>
      <el-button type="primary" size="small" @click="reset">重置</el-button>
      <span class="mchinfo-switch" v-if="userType === 1 || userType === '1'">
        <span class="tipcolor">开启自动审核</span>
        <el-switch :value="auditStatusObj.isAutoCheck"
                   :active-value="1"
                   :inactive-value="0" @change="changeAuditStatus">
        </el-switch>
      </span>
    </div>
    <!--
    <div class="action-container">
      <el-button icon="el-icon-refresh" size="small" @click="refresh">刷新</el-button>
    </div>
    -->
    <el-table
      :data="tableData"
      height="72vh"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="merchantName"
        label="商户名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系电话">
      </el-table-column>
      <el-table-column label="签约状态">
        <template slot-scope="scope">
          <template v-if="scope.row.status===1">未开通</template>
          <template v-else-if="scope.row.status===2">待审核</template>
          <template v-else-if="scope.row.status===3">签约成功</template>
          <template v-else-if="scope.row.status===4">签约失败</template>
          <template v-else-if="scope.row.status===5">等待服务商审核</template>
          <template v-else>未知</template>
        </template>
      </el-table-column>
      <!--上级代理-->
      <el-table-column label="上级代理">
        <template slot-scope="scope">
          <span>{{ scope.row.companyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进件通道（进件状态）" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.list &&  scope.row.list.length">
            <div v-for="(item, index) in scope.row.list" :key="index">
              <span type="text">{{item.channelDesc}}<span style="color: darkorange">{{initStatus(scope.row, item.channel).text}}</span></span>
            </div>
          </div>
          <div v-else>暂无</div>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="270">
        <template slot-scope="scope">
          <el-button type="text"
                    @click="incomingParts(scope.row)"
                    v-if="scope.row.isDirect">进件
          </el-button>
          <el-button type="text"
                     @click="rooterDeatil(scope.row)">详情
          </el-button>
          <template v-if="userType==='1' || userType === 1">
            <el-button :disabled="scope.row.status===2?false:true"
                       type="text"
                       @click="sureSigning(scope.row, 3)">签约
            </el-button>
            <el-button type="text"
                       :disabled="scope.row.status === 2 ? false : true"
                       @click="sureSigning(scope.row, 4)">驳回
            </el-button>
          </template>
          <!--
          <el-button type="text"
                     :disabled="(scope.row.status === 1 || scope.row.status === 4) &&  (scope.row.isDirect === 1) ? false : true"
                     @click="editFile(scope.row, 2)">录入资料
          </el-button>
          -->
          <template v-if="userType==='1' || userType === 1">
            <el-button type="text"
                       v-if="(auditStatusObj.isAutoCheck !== 1) && (scope.row.isCheck !== 1) && (scope.row.status === 5) || scope.row.status === 5"
                       :disabled="scope.row.isCheck?true:false"
                       @click="auditPass(scope.row)">审核通过
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total-elements="totalElements"
      :change-callback="getMchInfoListByFuwushang"
      ref="page"></pagination>
    <!--域名校验-->
    <el-dialog class="vm-dialog"
               title="驳回"
               width="498px"
               v-if="dialogSign.show"
               :visible.sync="dialogSign.show">
      <SignRemark :propsInfo="dialogSign" @getTableList="getMchInfoListByFuwushang"></SignRemark>
    </el-dialog>
    <!--随行付进件补充资料-->
    <el-dialog class="vm-dialog"
               title="随行付进件补充资料"
               width="600px"
               v-if="dialogSxf.show"
               :visible.sync="dialogSxf.show">
      <SxfCom :propsInfo="dialogSxf" @getTableList="getMchInfoListByFuwushang"></SxfCom>
    </el-dialog>
    <!--微信进件补充资料-->
    <el-dialog class="vm-dialog"
               title="微信进件补充资料"
               width="660px"
               v-if="dialogWechat.show"
               :visible.sync="dialogWechat.show">
      <WechatCom :propsInfo="dialogWechat" @getTableList="getMchInfoListByFuwushang"></WechatCom>
    </el-dialog>
    <!--内嵌h5进件-->
    <el-dialog class="vm-dialog"
               title="进件"
               width="660px"
               v-if="iframeDialog.show"
               :visible.sync="iframeDialog.show">
      <IframeIncoming :dialog="iframeDialog"
                      @getTableList="getMchInfoListByFuwushang"
                      @toDetail="rooterDeatil"></IframeIncoming>
    </el-dialog>

  </div>
</template>

<script>
import {getMchInfoListByFuwushang, sign} from '@/modules/merchant/agent/api/merchantInfo'
import * as agentMchInfoApi from '../api/agentMchInfo'
import pagination from '@/components/pagination/index'
import SignRemark from './components/signRemark.vue'
import SxfCom from './components/incomingSxf.vue'
import WechatCom from './components/incomingWechat.vue'
import IframeIncoming from './components/iframeIncoming.vue'
export default {
  components: {pagination, SignRemark, SxfCom, WechatCom, IframeIncoming},
  name: 'user',
  data () {
    return {
      loading: false,
      btnLoading: false,
      userType: null,
      auditStatusObj: {
        id: '',
        isAutoCheck: 0 // 开启自动审核
      },
      statusOption: [
        {
          value: 1,
          name: '未开通'
        },
        {
          value: 2,
          name: '待审核'
        },
        {
          value: 3,
          name: '签约成功'
        },
        {
          value: 4,
          name: '签约失败'
        }
      ],
      pageNumber: 1,
      pageSize: 10,
      multipleSelection: [], // 选中数据-多选
      totalElements: 0, // 数据条数
      queryList: {
        companyName: '',
        name: '',
        // contact: '',
        status: ''
      }, // 搜素数据
      tableData: [], // 表格数据
      addDialog: false, // 添加角色模态框
      formLabelWidth: '120px',
      dialogSign: {
        show: false
      },
      dialogSxf: {
        show: false
      },
      dialogWechat: {
        show: false
      },
      iframeDialog: {
        show: false
      }
    }
  },
  created () {
    this.userType = sessionStorage.getItem('userType')
    this.getAuditStatus()
  },
  mounted () {
    this.getMchInfoListByFuwushang(1, 10)
  },
  methods: {
    getTest () {
      console.log('测试')
    },
    // 进件
    incomingParts (data) {
      this.iframeDialog.show = true
      this.iframeDialog.data = data
    },
    /**
     * 进件状态
     * val--row
     * channel---渠道 1随行付 2微信
     ***/
    initStatus (val, channel) {
      let text
      let status
      let statusObj = {
        status: 100,
        text: ''
      }
      if (val.list && val.list.length) {
        val.list.forEach(item => {
          if (item.channel === channel) {
            status = item.status
            switch (item.status) {
              case 0:
                text = '(进件中)'
                break
              case 1:
                text = '(未知)'
                break
              case 2:
                text = '(审核中)'
                break
              case 3:
                text = '(审核通过)'
                break
              case 4:
                text = '(审核驳回)'
                break
              case 5:
                text = '(资料不齐全)'
                break
              case 6:
                text = '(请求失败)'
                break
              case 7:
                text = '(商户验证)'
                break
              case 8:
                text = '(待商户确认)'
                break
            }
          }
        })
        statusObj.status = status
        statusObj.text = text
      }
      return statusObj
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleDelete (row) {
      this.multipleSelection.push(row)
      this.deleteRoles()
    },
    /*
       * 获取列表
       * */
    getMchInfoListByFuwushang (number, pageSize) {
      this.loading = true
      if (number) {
        this.number = number
        this.pageSize = pageSize
      } else {
        number = this.number
        pageSize = this.pageSize
      }
      getMchInfoListByFuwushang(number, pageSize, this.queryList.companyName, this.queryList.name, this.queryList.status).then(response => {
        this.pageNumber = number
        this.pageSize = pageSize
        let data = response.obj
        console.log(data)
        this.totalElements = data.totalElements
        this.tableData = data.content
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(() => {
        this.loading = false
      })
    },
    // 跳转详情页
    rooterDeatil (data) {
      console.log('详情', data)
      // query发送ID到详情
      let id = data.id
      let list = JSON.stringify(data.list)
      this.$router.push({path: '/pay/views/detail', query: {id: id, list: list}})
    },
    /**
       *changeData 修改进件资料
       */
    editFile: function (data) {
      let id = data.id
      let mn = data.merchantName
      this.$router.push({path: '/pay/views/incoming_parts', query: {id: id, n: mn}})
    },
    /*
     * 刷新
     * */
    refresh () {
      this.$refs.page.refresh()
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
      this.queryList = {
        name: '',
        contact: '',
        status: ''
      }
      this.$refs.page.search()
    },
    /**
     * 是否签约
     */
    sureSigning (data, type) {
      if (type === 3) {
        this.$confirm('是否对该商户进行签约操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id: data.id,
            status: type
          }
          sign(params).then(res => {
            this.$message.success(res.msg)
            this.getMchInfoListByFuwushang(this.number, this.pageSize)
          })
        }).catch(() => {
        })
      } else {
        this.dialogSign = {
          show: true,
          data: data,
          status: type
        }
      }
    },
    /**
     * 补充进件资料
     */
    addIncomingInfo (data, key, status) {
      this[key] = {
        show: true,
        data: data,
        status: status
      }
    },
    /**
     *获取自动审核状态
     * **/
    getAuditStatus () {
      agentMchInfoApi.getAuditstatus().then(res => {
        this.auditStatusObj = Object.assign({}, res.obj)
      })
    },
    /**
     * 切换开启自动审核
     */
    changeAuditStatus (val) {
      let params = Object.assign({}, this.auditStatusObj)
      params.isAutoCheck = val
      agentMchInfoApi.setAutoCheck(params).then(res => {
        this.$message.success('设置成功')
        this.getAuditStatus()
        this.getMchInfoListByFuwushang(this.pageNumber, this.pageSize)
      })
    },
    /**
     * 审核通过
     */
    auditPass (data) {
      this.$confirm('确定审核通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          status: 1,
          id: data.id
        }
        agentMchInfoApi.auditPass(params).then(res => {
          this.$message.success('审核通过')
          this.getMchInfoListByFuwushang(this.pageNumber, this.pageSize)
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>
  body .el-table th.gutter {
    display: table-cell !important;
  }
  .formItem {
    display: inline-block;
    width: 150px;
    max-width: 100%;
  }
</style>
