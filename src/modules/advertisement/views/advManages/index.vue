<template>
  <div class="app-container vm-app-container" v-loading="loading">
    <div class="vm-search-btns vm-search-btns-cus">
      <!--广告标题-->
      <el-input placeholder="广告标题"
                size="small"
                class="formItem"
                clearable
                @keyup.enter.native="search"
                v-model="params.title"></el-input>
      <!--状态-->
      <el-select  placeholder="状态"
                  size="small"
                  class="formItem"
                  clearable
                  v-model="params.status"
                  @change="search">
        <el-option v-for="item in statusOption"
                   :key="item.value"
                   :label="item.name"
                   :value="item.value"></el-option>
      </el-select>
      <!--按钮-->
      <el-button type="primary" size="small" @click="search">查询</el-button>
    </div>
    <div class="page-margin-gray"></div>
    <!--表格-->
    <div class="vm-app-bodys">
      <div class="vm-page-table-title">广告管理
        <span class="vm-float-right">
          <el-button type="primary"
                     icon="el-icon-plus"
                     size="small"
                     @click="addAdvertise(1)">添加</el-button>
        </span>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="title"
                         label="标题">
          <template slot-scope="scope">
            <div class="title-show-ell" :title="scope.row.title">{{scope.row.title}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="title"
                         label="图片/视频">
          <template slot-scope="scope">
            <div class="advertise-video" style="width: 60px;height: 60px;" v-if="scope.row.adType === 1">
              <video :src="scope.row.imageUrl" @click="viewImg(scope.row.imageUrl, scope.row.adType)" />
              <span @click="viewImg(scope.row.imageUrl, scope.row.adType)"><i class="el-icon-caret-right"></i></span>
            </div>
            <div class="advertise-img" v-else>
              <img :src="scope.row.imageUrl" style="width: 100%;height: 100%" @click="viewImg(scope.row.imageUrl)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="投放对象">
          <template slot-scope="scope">
            {{showName(scope.row.targetType, 'targetTypeObj')}}
          </template>
        </el-table-column>
        <el-table-column label="投放范围">
          <template slot-scope="scope">
            <!--4指定商户 5指定城市-->
            <el-button type="text" v-if="scope.row.targetRange === 5" @click="rangeCall(scope.row, scope.$index)">{{showName(scope.row.targetRange, 'targetRangeObj')}}</el-button>
            <span v-else>{{showName(scope.row.targetRange, 'targetRangeObj')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title"
                         label="行业分类">
          <template slot-scope="scope">
            <span v-if="scope.row.targetType===1 || scope.row.targetType===3">{{showCategoryName(scope.row.industryCategory)}}</span>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <el-table-column prop="title"
                         label="曝光">
          <template slot-scope="scope">
            <el-button type="text" @click="exposureOrClickCall(scope.row, scope.$index, 1)">{{scope.row.exposureNum || 0}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="title"
                         label="点击">
          <template slot-scope="scope">
            <el-button type="text" @click="exposureOrClickCall(scope.row, scope.$index, 2)">{{scope.row.clickNum || 0}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="title"
                         label="状态">
          <template slot-scope="scope">
            {{showName(scope.row.status, 'statusOption')}}
          </template>
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            <span v-if="(scope.row.beginTime || scope.row.endTime) && scope.row.type === 0">{{scope.row.beginTime}}~{{scope.row.endTime}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <!--操作-->
        <el-table-column fixed="right"
                         width="150"
                         label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="addAdvertise(2, scope.row)">编辑</el-button>
            <el-button type="text" @click="isAbleCall(scope.row, scope.$index)">{{scope.row.status===1?'禁用':'恢复'}}</el-button>
            <el-button type="text" @click="removeCall(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination ref="page"
                  :total-elements="totalElements"
                  :change-callback="getTableList" ></pagination>
    </div>
    <!--添加广告-->
    <el-dialog class="vm-dialog"
               :title="dialogAdd.type===1?'添加广告':'编辑广告'"
               width="662px"
               v-if="dialogAdd.show"
               :visible.sync="dialogAdd.show">
      <addAdvertise :propsInfo="dialogAdd" @getTableList="getTableList" :industryCategoryArr="industryCategoryArr"></addAdvertise>
    </el-dialog>
    <!--曝光/点击-->
    <el-dialog class="vm-dialog vm-dialog-body-top-10px"
               :title="dialogExposureOrClick.status===1?'曝光':'点击'"
               width="662px"
               v-if="dialogExposureOrClick.show"
               :visible.sync="dialogExposureOrClick.show">
      <exposureOrClickAdvertise :propsInfo="dialogExposureOrClick"></exposureOrClickAdvertise>
    </el-dialog>
    <!--商户详情-->
    <el-dialog class="vm-dialog vm-dialog-body-top-10px"
               title="商户详情"
               width="495px"
               v-if="dialogBusiness.show"
               :visible.sync="dialogBusiness.show">
      <businessDetail :propsInfo="dialogBusiness"></businessDetail>
    </el-dialog>
    <!--城市详情-->
    <el-dialog class="vm-dialog vm-dialog-body-top-10px"
               title="城市详情"
               width="495px"
               v-if="dialogLocation.show"
               :visible.sync="dialogLocation.show">
      <locationDetail :propsInfo="dialogLocation"></locationDetail>
    </el-dialog>
    <!--图片放大-->
    <el-dialog :title="dialogImgView.type===1?'视频预览':'图片预览'"
               :visible.sync="dialogImgView.show">
      <div v-if="dialogImgView.type===1" style="text-align: center;">
        <video style="max-width: 100%;max-height: 60vh;" ref="videoRefs" autoplay :src="dialogImgView.imgUrl" controls/>
      </div>
      <span v-else>
        <img style="width: 100%;" :src="dialogImgView.imgUrl"/>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogImgView.show = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as advertiseApi from '../../api/advManage'
import pagination from '@/components/pagination/index'
import addAdvertise from './components/addAdvertise'
import exposureOrClickAdvertise from './components/exposureOrClickAdvertise'
import businessDetail from './components/businessDetail'
import locationDetail from './components/locationDetail'
import { tableMixin } from '@/mixins'
export default {
  name: 'operator',
  components: {
    pagination,
    addAdvertise,
    exposureOrClickAdvertise,
    businessDetail,
    locationDetail
  },
  mixins: [tableMixin],
  data () {
    const levelAlias = JSON.parse(sessionStorage.levelAlias)
    return {
      loading: false, // 加载动画
      params: {
        title: '',
        position: '',
        status: ''
      },
      targetRangeObj: [
        {
          value: 1,
          name: '平台所有商户'
        },
        {
          value: 2,
          name: levelAlias.firstName + '所有商户'
        },
        {
          value: 3,
          name: levelAlias.secondName + '所有商户'
        },
        {
          value: 4,
          name: '指定商户'
        },
        {
          value: 5,
          name: '指定城市'
        },
        {
          value: 6,
          name: '客户小程序 '
        },
        {
          value: 7,
          name: '客户付完款页面'
        },
        {
          value: 8,
          name: '启动页'
        },
        {
          value: 9,
          name: '收银页'
        },
        {
          value: 10,
          name: '会员支付成功页'
        },
        {
          value: 11,
          name: '商户收款后页面'
        },
        {
          value: 12,
          name: '支付页成功页'
        },
        {
          value: 13,
          name: '收押金成功页'
        },
        {
          value: 14,
          name: '退押金成功页'
        },
        {
          value: 15,
          name: levelAlias.thirdName + '所有商户'
        },
        {
          value: 16,
          name: levelAlias.oemName + '所有商户'
        }
      ],
      targetTypeObj: [
        {
          value: 1,
          name: '商户'
        },
        {
          value: 2,
          name: '客户'
        },
        {
          value: 3,
          name: '付款设备'
        }
      ],
      statusOption: [
        {
          name: '正常',
          value: 1
        },
        {
          name: '禁用',
          value: 0
        }
      ],
      industryCategoryArr: [
        {
          label: '超市',
          value: 0
        }, {
          label: '自助点餐',
          value: 1
        }, {
          label: '医药',
          value: 2
        }, {
          label: '加油站',
          value: 3
        }, {
          label: '景区',
          value: 4
        }
      ],
      totalElements: 0,
      tableData: [
        {},
        {}
      ],
      dialogAdd: {
        show: false
      },
      dialogExposureOrClick: {
        show: false
      },
      dialogBusiness: {
        show: false
      },
      dialogLocation: {
        show: false
      },
      dialogImgView: {
        show: false
      },
      showMemberPayStatus: false
    }
  },
  mounted () {
    this.showMemberPay()
  },
  methods: {
    showMemberPay () {
      advertiseApi.showMemberPay().then(res => {
        this.showMemberPayStatus = res.obj
      })
    },
    /**
     * 显示--投放范围/广告类型--对应的名称
     */
    showName (val, key) {
      let name = ''
      if (!val && val !==0) {
        name = '--'
      } else {
        this[key].forEach(item => {
          if (item.value === val) {
            name = item.name
          }
        })
      }
      return name
    },
    /**
     * 请求列表
    */
    requestTableList () {
      advertiseApi.advertiseList(this.params).then(res => {
        this.tableData = res.obj.content
        this.totalElements = res.obj.totalElements
      })
    },
    /**
     * 禁用/禁用
     */
    isAbleCall (data, index) {
      let msg = data.status === 1 ? '确定禁用该广告吗？' : '确定恢复该广告吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let status = data.status ? 0 : 1
        let ids = [data.id]
        let params = {
          ids: ids,
          status: status
        }
        advertiseApi.advertiseIsable(params).then(res => {
          this.$message.warning('操作成功！')
          this.getTableList()
        })
      }).catch(() => {
      })
    },
    /**
     * 删除
     */
    removeCall (data, index) {
      this.$confirm('确定删除该广告吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: [data.id]
        }
        advertiseApi.advertiseDelete(params).then(res => {
          this.$message.warning('操作成功！')
          this.getTableList()
        })
      }).catch(() => {
      })
    },
    /**
     * 添加广告
     * type 1--新增，2--编辑
     */
    addAdvertise (type, data) {
      this.dialogAdd = {
        show: true,
        type: type,
        data: data,
        showMemberPayStatus: this.showMemberPayStatus
      }
    },
    /**
     * 曝光/点击
     */
    exposureOrClickCall (data, index, status) {
      this.dialogExposureOrClick = {
        show: true,
        data: data,
        status: status
      }
    },
    /**
     * 投放范围
     */
    rangeCall (data, index, type) {
      if (type === 1) {
        this.dialogBusiness = {
          show: true,
          data: data
        }
      } else {
        this.dialogLocation = {
          show: true,
          data: data
        }
      }
    },
    /**
     * 图片预览
     * 1--视频
     * 0--图片
     */
    viewImg (val, type) {
      this.dialogImgView = {
        show: true,
        imgUrl: val,
        type: type
      }
      if (type === 1) {
        this.$nextTick(() => {
          this.$refs.videoRefs.currentTime  = 0
        })
      }
    },
    /**
     * 显示行业分类
     * @param val--行业分类代码
     */
    showCategoryName (val) {
      let name = '暂无'
      if (val >= 0) {
        this.industryCategoryArr.forEach(item => {
          if (item.value === val) {
            name = item.label
          }
        })
      }
      return name
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
  .vm-search-btns-cus {
    padding: 15px 0 10px 15px;
  }
</style>
