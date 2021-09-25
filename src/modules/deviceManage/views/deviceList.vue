<template>
  <div class="app-container vm-app-container" v-loading="loading">
    <div class="page-margin-gray"></div>
    <!--表格-->
    <div class="vm-app-bodys">
      <div class="vm-search-btns vm-padding-lr-0">
        <!--代理名称-->
        <el-input placeholder="设备号/序列号/门店/上级"
                  size="small"
                  class="formItem"
                  clearable
                  @keyup.enter.native="search"
                  v-model="params.keyWord"></el-input>
        <!--结算状态-->
        <el-select  placeholder="设备类型"
                    size="small"
                    class="formItem"
                    clearable
                    v-model="params.type"
                    @change="search">
          <el-option v-for="item in statusOption"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value"></el-option>
        </el-select>
        <!--按钮-->
        <el-button type="primary" size="small" @click="search">查询</el-button>
      </div>
      <div class="page-margin-gray vm-margin-lr-0"></div>
      <el-table :data="tableData"
                height="72vh"
                style="width: 100%"
                class="commission-t-table"
                row-key="id"
                ref="multipleTable">
        <el-table-column label="序列号">
          <template slot-scope="scope">
            {{scope.row.deviced}}
          </template>
        </el-table-column>
        <el-table-column label="设备号">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column label="设备类型">
          <template slot-scope="scope">
            {{filterType(scope.row.deviceType)}}
            <!--{{scope.row.deviceType  === 1 ? '支付宝':''}}-->
            <!--{{scope.row.deviceType  === 2 ? '微信':''}}-->
          </template>
        </el-table-column>
        <el-table-column label="交易笔数">
          <template slot-scope="scope">
            {{scope.row.orderCount}}
          </template>
        </el-table-column>
        <el-table-column label="交易金额">
          <template slot-scope="scope">
            {{scope.row.actPayPrice}}
          </template>
        </el-table-column>
        <el-table-column label="所属门店">
          <template slot-scope="scope">
            {{scope.row.storeName}}
          </template>
        </el-table-column>
        <el-table-column label="所属商家">
          <template slot-scope="scope">
            {{scope.row.merchantName}}
          </template>
        </el-table-column>
        <el-table-column label="上级">
          <template slot-scope="scope">
            {{scope.row.companyName}}
          </template>
        </el-table-column>
        <!--操作-->
        <el-table-column fixed="right"
                         width="150"
                         label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="turnToDetail(scope.row)">流水清单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-foot vm-flex">
        <!-- 分页 -->
        <div class="vm-inline-block vm-flex-1 vm-text-right">
          <pagination ref="page"
                      style="margin-top: 20px !important;"
                      :total-elements="totalElements"
                      :change-callback="getTableList" ></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as deviceApi from '../api/device'
import pagination from '@/components/pagination/index'
import { tableMixin } from '@/mixins'
import ImgShow from '@/components/imgShow/index'
export default {
  name: 'deviceManageListA',
  components: {
    pagination,
    ImgShow
  },
  mixins: [tableMixin],
  data () {
    return {
      timeDate: [],
      loading: false, // 加载动画
      statusOption: [
        {
          value: 1,
          name: '支付宝'
        },
        {
          value: 2,
          name: '微信'
        }
        /*
        {
          value: 3,
          name: '商户app'
        },
        {
          value: 4,
          name: '收银插件'
        }
        */
      ],
      params: {
        keyWord: '',
        type: ''
      },
      totalElements: 0,
      tableData: [
      ]
    }
  },
  mounted () {
  },
  created () {
  },
  watch: {
  },
  methods: {
    /**
     * 设置设备类型
     * */
    filterType (val) {
      let deviceTypaName = '未知'
      this.statusOption.forEach(item => {
        if (item.value === val) {
          deviceTypaName = item.name
        }
      })
      return deviceTypaName
    },
    /**
     * 请求列表
    */
    requestTableList () {
      deviceApi.deviceList(this.params).then(res => {
        this.tableData = res.obj.content
        this.totalElements = res.obj.totalElements
      })
    },
    /**
     * 流水清单
     */
    turnToDetail (data) {
      let paths = '/deviceManage/views/deviceDetail?id=' + data.id
      this.$router.push(paths)
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
  .table-tipss{
    font-size: 14px;
    float: right;
  }
  .table-tipss span{
    margin-left: 20px;
  }
</style>
