<template>
  <div class="app-container vm-app-container" v-loading="loading">
    <div class="vm-search-btns">
      <!--客户端类型-->
      <el-select  placeholder="客户端类型"
                  size="small"
                  class="formItem"
                  clearable
                  v-model="params.clientType"
                  @change="search">
        <el-option v-for="item in statusOption"
                   :key="item.value"
                   :label="item.name"
                   :value="item.value"></el-option>
      </el-select>
      <!--升级状态-->
      <el-select  placeholder="升级状态"
                  size="small"
                  class="formItem"
                  clearable
                  v-model="params.status"
                  @change="search">
        <el-option v-for="item in statusOptionLevel"
                   :key="item.value"
                   :label="item.name"
                   :value="item.value"></el-option>
      </el-select>
      <!--适用版本号 -->
      <el-input placeholder="适用版本号"
                size="small"
                class="formItem"
                clearable
                @keyup.enter.native="search"
                v-model="params.version"></el-input>
      <!--版本黑名单 -->
      <el-input placeholder="版本黑名单"
                size="small"
                class="formItem"
                clearable
                @keyup.enter.native="search"
                v-model="params.blackList"></el-input>
      <!--按钮-->
      <el-button type="primary" size="small" @click="search">查询</el-button>
    </div>
    <div class="page-margin-gray"></div>
    <!--表格-->
    <div class="vm-app-bodys">
      <div class="vm-page-table-title">版本管理
        <span class="vm-float-right">
          <el-button type="primary"
                     icon="el-icon-plus"
                     size="small"
                     @click="addVersion(1)">新增</el-button>
        </span>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name"
                         label="客户端名称">
        </el-table-column>
        <el-table-column label="适用版本号" prop="version">
        </el-table-column>
        <el-table-column prop="status"
                         label="升级状态">
          <template slot-scope="scope">
            {{scope.row.status?'正在升级中':'完成升级'}}
          </template>
        </el-table-column>
        <el-table-column label="版本黑名单" prop="blackList">
          <template slot-scope="scope">
            {{scope.row.blackList?scope.row.blackList:'无'}}
          </template>
        </el-table-column>
        <!--操作-->
        <el-table-column fixed="right"
                         width="150"
                         label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="addVersion(2, scope.row)">修改</el-button>
            <el-button type="text" @click="delVersion(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination ref="page"
                  :total-elements="totalElements"
                  :change-callback="getTableList" ></pagination>
    </div>
    <!--编辑或新增客户端类型-->
    <el-dialog class="vm-dialog"
               :title="(dialogAddOrModify.data && dialogAddOrModify.data.id) ? '修改客户端类型':'新增客户端类型'"
               width="500px"
               v-if="dialogAddOrModify.show"
               :visible.sync="dialogAddOrModify.show">
      <AddOrModify :propsInfo="dialogAddOrModify" @getTableList="getTableList" :statusOption="statusOption" :statusOptionLevel="statusOptionLevel"></AddOrModify>
    </el-dialog>
  </div>
</template>
<script>
import * as versionApi from '../api/versionManagement'
import pagination from '@/components/pagination/index'
import AddOrModify from './components/versionAddOrModify.vue'
import { tableMixin } from '@/mixins'
export default {
  name: 'operator',
  components: {
    pagination,
    AddOrModify
  },
  mixins: [tableMixin],
  data () {
    // const levelAlias = JSON.parse(sessionStorage.levelAlias)
    return {
      loading: false, // 加载动画
      statusOption: [
        {
          value: 'WXAPP',
          name: '青蛙APP'
        },
        {
          value: 'ALIAPP',
          name: '蜻蜓APP'
        },
        {
          value: 'MERCHANTAPP',
          name: '商户APP'
        },
        {
          value: 'MINIAPPLET',
          name: '微信小程序'
        }
      ],
      statusOptionLevel: [
        {
          value: 1,
          name: '升级中'
        },
        {
          value: 0,
          name: '不是'
        }
      ],
      params: {
        clientType: '',
        status: '',
        position: '',
        version: '',
        blackList: ''
      },
      totalElements: 0,
      tableData: [
      ],
      dialogAddOrModify: {
        show: false
      }
    }
  },
  mounted () {
  },
  methods: {
    /**
     * 请求列表
    */
    requestTableList () {
      versionApi.versionList(this.params).then(res => {
        this.tableData = res.obj.content
        this.totalElements = res.obj.totalElements
      })
    },
    /**
     * 删除
     */
    delVersion (data, index) {
      this.$confirm('确定删除该客户端类型？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: data.id
        }
        versionApi.versionDelete(params).then(res => {
          this.$message.warning('操作成功！')
          this.getTableList()
        })
      }).catch(() => {
      })
    },
    /**
     * 添加广告
     */
    addVersion (type, data) {
      this.dialogAddOrModify = {
        show: true,
        type: type,
        data: data
      }
    }
  }
}
</script>

<style scoped>
  .title-show-ell{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 30px;
    max-height: 60px;
  }
</style>
