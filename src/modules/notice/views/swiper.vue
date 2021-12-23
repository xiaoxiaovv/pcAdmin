<template>
  <div
    class="app-container vm-app-container"
    v-loading="loading"
  >
    <div class="page-margin-gray"></div>
    <!--表格-->
    <div class="vm-app-bodys">
      <div class="page-margin-gray vm-margin-lr-0"></div>
      <el-button
        type="primary"
        size="small"
        @click="noticeShow"
      >新增轮播图</el-button>
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
        <el-table-column label="是否展示">
          <template slot-scope="scope">{{scope.row.isShow?'是':'否'}}</template>
        </el-table-column>
        <el-table-column label="图片id">
          <template slot-scope="scope">
            <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.photoId | previewLoadImage"
                :preview-src-list="scope.row.photoId | largePreviewLoadImage">
              </el-image>
          </template>
        </el-table-column>
        <el-table-column label="跳转链接">
          <template slot-scope="scope">{{scope.row.showUrl}}</template>
        </el-table-column>
        <el-table-column label="富文本内容">
          <template slot-scope="scope">
            <div v-html="scope.row.content"></div>
          </template>
        </el-table-column>
        <el-table-column label="跳转类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">app内部页面</span>
            <span v-if="scope.row.type==2">外部链接</span>
            <span v-if="scope.row.type==3">富文本</span>
          </template>
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
            >编辑</el-button>
            <el-button
              type="text"
              @click="delNotice(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="新增/编辑轮播图"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <add-notice
        v-if="dialogVisible"
        :data="detail"
        @close="close"
        @submit="submit"
      ></add-notice>
    </el-dialog>

    <el-dialog
      title="轮播图详情"
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
import addNotice from './model/addNotice'
import detail from './model/detail'
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
  filters: {
    previewLoadImage(id) {
      return id ? window.serverUrl + `/fms/upload/resource/${id}` : ''
    },
    largePreviewLoadImage(id) {
      let arr = []
       arr.push(window.serverUrl + `/fms/upload/resource/${id}`)
      return id ? arr : ''
    }
  },
  methods: {
    /**
     * 请求列表
     */
    requestTableList () {
      this.loading = true
      noticeApi
        .getSwiperList()
        .then(res => {
          this.loading = false
          if (res.obj) {
            this.tableData = res.obj
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    delNotice (id) {
      this.$confirm('确定删除该轮播吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          noticeApi.delSwiper(id).then(res => {
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
     this.dialogVisible = true
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
