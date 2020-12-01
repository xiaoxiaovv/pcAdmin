<template>
  <div
    class="app-container vm-app-container"
    v-loading="loading"
  >
    <div class="page-margin-gray"></div>
    <!--表格-->
    <div class="vm-app-bodys">
      <div class="vm-search-btns vm-padding-lr-0">
        <!--代理名称-->
        <el-input
          placeholder="输入公告标题"
          size="small"
          class="formItem"
          clearable
          @keyup.enter.native="search"
          v-model="params.title"
        ></el-input>
        <!--结算状态-->
        <el-select
          placeholder="请选择通知对象"
          size="small"
          class="formItem"
          clearable
          multiple
          v-model="noticeObj"
        >
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="date"
          size="small"
          type="daterange"
          align="right"
          unlink-panels
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>

        <!--按钮-->
        <el-button
          type="primary"
          size="small"
          @click="search"
        >查询</el-button>
      </div>
      <div class="page-margin-gray vm-margin-lr-0"></div>
      <el-button
        type="primary"
        size="small"
        @click="noticeShow"
      >新增公告</el-button>
      <el-table
        :data="tableData"
        style="width: 100%"
        class="commission-t-table"
        row-key="id"
        ref="multipleTable"
      >
        <el-table-column
          label="序号"
          type="index"
          width="50"
        ></el-table-column>
        <!-- <el-table-column label="设备类型">
          <template slot-scope="scope">
            {{scope.row.deviceType  === 1 ? '支付宝':''}}
            {{scope.row.deviceType  === 2 ? '微信':''}}
          </template>
        </el-table-column>-->
        <el-table-column label="公告标题">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="通知对象">
          <template slot-scope="scope">{{getNoticeObj(scope.row.type)}}</template>
        </el-table-column>
        <el-table-column label="发布时间">
          <template slot-scope="scope">{{scope.row.updateTime}}</template>
        </el-table-column>

        <!--操作-->
        <el-table-column
          fixed="right"
          width="150"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="toDetail(scope.row)"
            >查看</el-button>
            <el-button
              type="text"
              @click="delNotice(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-foot vm-flex">
        <!-- 分页 -->
        <div class="vm-inline-block vm-flex-1 vm-text-right">
          <pagination
            ref="page"
            style="margin-top: 20px !important;"
            :total-elements="totalElements"
            :change-callback="getTableList"
          ></pagination>
        </div>
      </div>
    </div>

    <el-dialog
      title="新增公告"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <add-notice
        v-if="dialogVisible"
        @close="close"
        @submit="submit"
      ></add-notice>
    </el-dialog>

    <el-dialog
      title="公告详情"
      :visible.sync="detailVisible"
      width="60%"
    >
      <detail
        v-if="detailVisible"
        :data="detail"
      ></detail>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="detailVisible=false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as noticeApi from '../api/notice'
import addNotice from './components/addNotice'
import detail from './components/detail'
import pagination from '@/components/pagination/index'
import { tableMixin } from '@/mixins'
export default {
  name: 'notice',
  mixins: [tableMixin],
  components: {
    addNotice,
    detail,
    pagination
  },
  data () {
    return {
      timeDate: [],
      dialogVisible: false,
      detailVisible: false,
      loading: false, // 加载动画
      statusOption: [
        {
          value: 1,
          name: '贴牌商'
        },
        {
          value: 2,
          name: '一级代理商'
        },
        {
          value: 3,
          name: '二级代理商'
        },
        {
          value: 4,
          name: '三级代理商'
        },
        {
          value: 5,
          name: '商户'
        }
      ],
      date: [],
      detail: {},
      noticeObj: [],
      params: {
        title: null,
        startTime: null,
        endTime: null,
        type: null,
        createType: null
      },
      userType: '',
      totalElements: 0,
      tableData: []
    }
  },
  watch: {
    noticeObj (val) {
      if (val.length) {
        this.params.type = val.join(',')
      } else {
        this.params.type = null
      }
    },
    date (val) {
      val = val || []
      this.params.startTime = val[0] || null
      this.params.endTime = val[val.length - 1] || null
    }
  },
  mounted () {
    this.userType = sessionStorage.getItem('userType')
    // if (this.userType !== 'undefined') {
    //   this.params.type = this.userType
    // }
    // 超级后台
    if (this.userType === 'undefined') {
      this.params.createType = '1'
    } else if (this.userType === '1') {
      // 贴牌商
      this.params.createType = '2'
    } else {
      this.params.type = this.userType
    }
  },
  created () {},
  methods: {
    /**
     * 请求列表
     */
    requestTableList () {
      this.loading = true
      noticeApi
        .getNoticeList(this.params)
        .then(res => {
          this.loading = false
          if (res.obj) {
            this.tableData = res.obj.content
            this.totalElements = res.obj.totalElements
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    getNoticeObj (type) {
      if (type) {
        let name = []
        this.statusOption.forEach(element => {
          if (type.indexOf(element.value) !== -1) {
            name.push(element.name)
          }
        })
        name = name.join(',')
        return name
      }
    },
    delNotice (id) {
      this.$confirm('确定删除该该公告吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          noticeApi.delNotice(id).then(res => {
            this.$message.success('删除成功')
            this.loading = false
            this.requestTableList()
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    changeTime (val) {
      let arr = val || ['', '']
      this.params.startTime = arr[0]
      this.params.endTime = arr[1]
    },
    noticeShow () {
      this.dialogVisible = true
    },
    submit () {
      this.dialogVisible = false
      this.requestTableList()
    },
    close () {
      this.dialogVisible = false
    },
    /**
     * 详情
     */
    toDetail (data) {
      this.detail = data
      this.detailVisible = true
    }
  }
}
</script>

<style scoped>
.title-show-ell {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 30px;
  max-height: 60px;
}
.table-tipss {
  font-size: 14px;
  float: right;
}
.table-tipss span {
  margin-left: 20px;
}
</style>
