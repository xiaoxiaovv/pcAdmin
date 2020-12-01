<template>
  <div>
    <div>
      <el-date-picker v-model="timeZone"
                      style="width: 230px"
                      size="medium"
                      type="daterange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :default-time="['00:00:00', '23:59:59']">
      </el-date-picker>
      <el-button type="primary" size="medium" @click="search">查询</el-button>
    </div>
    <div class="vm-page-table-title vm-page-table-title-mini text-over-one">广告标题：<span :title="propsInfo.data.title">{{propsInfo.data.title || '暂无'}}</span></div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="商户">
        <template slot-scope="scope">
          {{scope.row.title || ''}}
        </template>
      </el-table-column>
      <el-table-column :label="propsInfo.status === 1 ? '曝光时间' : '点击时间'">
        <template slot-scope="scope">
          {{scope.row.createTime || ''}}
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination ref="page"
                :total-elements="totalElements"
                :layout="'total, sizes, prev, next, jumper'"
                :change-callback="getTableList" ></pagination>
  </div>
</template>

<script>
import * as advertiseApi from '../../../api/advManage'
import { tableMixin } from '@/mixins'
import pagination from '@/components/pagination/index'
export default {
  mixins: [tableMixin],
  components: {
    pagination
  },
  props: {
    propsInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      timeZone: null,
      params: {
        beginTime: '',
        endTime: ''
      },
      totalElements: 0,
      tableData: [],
      createNotGetTableList: true
    }
  },
  watch: {
    'timeZone' (val) {
      val = val || []
      this.params.beginTime = val[0] || ''
      this.params.endTime = val[val.length - 1] || ''
    }
  },
  computed: {},
  created () {
    let dayBegin = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
    let dayEnd = new Date(new Date().setHours(23, 59, 59, 0)).getTime()
    let weekTimeAgo = dayBegin - 7 * 24 * 60 * 60 * 1000
    let curerntDate = this.initDate(dayEnd)
    let weekDate = this.initDate(weekTimeAgo)
    this.timeZone = [weekDate, curerntDate]
    this.$nextTick(() => {
      this.getTableList()
    })
  },
  methods: {
    initDate (time) {
      let now = new Date(time)
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      let date = now.getDate()
      let hour = now.getHours()
      let minute = now.getMinutes()
      let second = now.getSeconds()
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
    },
    requestTableList () {
      let params = Object.assign({}, this.params)
      if (!params.beginTime) {
        delete params.beginTime
        delete params.endTime
      }
      params.id = this.propsInfo.data.id || ''
      params.status = this.propsInfo.status
      advertiseApi.advertiseExposureOrClick(params).then(res => {
        this.tableData = res.obj.content
        this.totalElements = res.obj.totalElements
      })
    }
  }
}
</script>

<style scoped>
  .vm-dialog .el-dialog__body {
    padding-top: 10px;
  }
  .text-over-one{
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
