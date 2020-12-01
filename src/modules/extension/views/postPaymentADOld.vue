<template>
  <div class="app-container" v-loading="loading">

    <!--标签页-->
    <el-tabs v-model="tabsNum" @tab-click="changeTabs" type="card">
      <!--************************************************************************-->

      <!--投放管理-->
      <el-tab-pane label="投放管理" name="0">
        <!--搜索条-->
        <div>
          <!--左侧-->
          <div class="block ">
            <div class="block">
              <el-input v-model="putInSearchForm.name" class="input-width" size="medium" placeholder="投放名称"></el-input>
            </div>
            <div class="block">
              <el-select v-model="putInSearchForm.status" placeholder="请选择" size="medium">
                <el-option
                  v-for="item in putInStatusOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="block">
              <el-button size="medium" type="primary">查询</el-button>
            </div>
          </div>
          <!--右侧-->
          <div class="right-float ">
            <div class="block">
              <el-button size="medium" type="primary" @click="addPutOpen">新建投放</el-button>
            </div>
            <div class="block">
              <el-button size="medium" @click="putInRefresh">刷新</el-button>
            </div>
          </div>
        </div>
        <el-divider content-position="left">投放广告列表</el-divider>
        <!--列表-->
        <div>
          <template>
            <el-table
              :data="putInTable"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                prop="name"
                label="投放名称"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                prop="time"
                label="投放时间"
                width="200px"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                prop="budget"
                label="预算(元)">
              </el-table-column>
              <el-table-column
                prop="spend"
                label="总花费(元)">
              </el-table-column>
              <el-table-column
                prop="exhibition"
                label="展示数">
              </el-table-column>
              <el-table-column
                prop="hitsTotal"
                label="点击量">
              </el-table-column>
              <el-table-column
                prop="hitRate"
                label="点击率">
              </el-table-column>
              <el-table-column
                prop="jumpTotal"
                label="跳转量">
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态">
              </el-table-column>
              <el-table-column
                prop="remarks"
                label="备注">
              </el-table-column>
              <el-table-column
                label="操作"
                width="270px">
                <template slot-scope="scope">
                  <el-button type="text">详情</el-button>
                  <el-button type="text">修改</el-button>
                  <!--<el-button type="text">删除</el-button>-->
                  <el-button type="text">结束</el-button>
                  <el-button type="text">投放</el-button>
                  <el-button type="text">数据</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              :total-elements="putInTotalElements"
              :change-callback="getPutInList"
              ref="page"></pagination>
          </template>
        </div>

        <!--工具模态框-->
        <template>
          <el-dialog
            title="新增投放规则"
            :visible.sync="addPutVisible"
            width="30%"
            :before-close="addPutClose">
            <!--表单-->
            <div>
              <el-form :model="addPutForm" ref="addPutForm" label-width="120px" size="medium">
                <el-form-item label="投放名称：">
                  <el-input v-model="addPutForm.name" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="投放时间：">
                  <div>
                    <el-form-item class="block">
                      <el-date-picker
                        v-model="addPutForm.startTime"
                        type="date"
                        placeholder="开始日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        class="half-input-width">
                      </el-date-picker>
                    </el-form-item>
                    <span v-if="!putTimeMode">至</span>
                    <el-form-item class="block" v-if="!putTimeMode">
                      <el-date-picker
                        v-model="addPutForm.endTime"
                        type="date"
                        placeholder="结束日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        class="half-input-width">
                      </el-date-picker>
                    </el-form-item>

                    <div class="block padding-about-5px">
                      <el-checkbox v-model="putTimeMode">长期</el-checkbox>
                    </div>
                  </div>
                </el-form-item>

                <el-form-item label="选择广告：">
                  <el-select v-model="addPutForm.adId" placeholder="选择广告" class="input-width">
                    <el-option
                      v-for="item in putAdOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="选择策略：">
                  <el-select v-model="addPutForm.adId" placeholder="选择策略" class="input-width">
                    <el-option
                      v-for="item in putRulesOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="投放预算：">
                  <el-input v-model="addPutForm.price" class="input-width">
                    <template slot="prepend">总预算</template>
                  </el-input>
                </el-form-item>

                <el-form-item label="备注：">
                  <el-input v-model="addPutForm.remarks" class="input-width"
                            placeholder="输入其他说明，140字以内"></el-input>
                </el-form-item>

              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addPutClose">取消</el-button>
    <el-button type="primary" @click="addPutSubmit">新增</el-button>
  </span>
          </el-dialog>
        </template>
      </el-tab-pane>
      <!--投放管理结束-->

      <!--广告管理-->
      <el-tab-pane label="广告管理" name="1">

      </el-tab-pane>
      <!--广告管理结束-->

      <!--策略管理-->
      <el-tab-pane label="策略管理" name="2">

      </el-tab-pane>
      <!--策略管理结束-->

      <!--************************************************************************-->
    </el-tabs>

  </div>
</template>

<script>
import pagination from '@/components/pagination/index'

export default {
  name: 'postPaymentAD',
  components: {pagination},
  data () {
    return {
      loading: false, // 页面加载
      tabsNum: 0, // 标页码
      // ------------投放管理---------------------
      putInSearchForm: {
        name: '',
        status: ''
      }, // 投放管理搜索表单
      putInStatusOption: [
        {value: '', label: '全部'},
        {value: 1, label: '未投放'},
        {value: 2, label: '投放中'},
        {value: 3, label: '已结束'}
      ], // 投放状态
      putInTable: [
        {
          name: '广告1',
          time: '2019-01-01~2019-12-12',
          budget: 200,
          exhibition: 1599,
          hitsTotal: 299,
          spend: 100,
          status: 1,
          hitRate: '18%',
          jumpTotal: 200,
          remarks: '测试备注'
        }
      ], // 表格
      putInTotalElements: 0, // 条数
      addPutVisible: false, // 新建投放模态框
      addPutForm: {
        name: '', // 投放规则名
        startTime: '',
        endTime: '',
        adId: '',
        price: '',
        remarks: ''
      }, // 新增投放表单
      putTimeMode: false,
      putAdOption: [
        {value: 1, label: '广告1'},
        {value: 2, label: '广告12'},
        {value: 3, label: '广告123'}
      ], // 投放广告选择
      putRulesOption: [
        {value: 1, label: '策略1'},
        {value: 2, label: '策略12'},
        {value: 3, label: '策略123'}
      ] // 投放广告选择

    }
  },
  methods: {
    /**
       * 通用方法（非工具）
       */

    // 响应切换标签页
    changeTabs (tab, event) {
      // console.log(tab, event);
      console.log('切换了标签页')
    },

    /**
       * 页面 《---------------------投放管理---------------------》
       */
    // 获取列表
    getPutInList: function (pageNumber, pageSize) {
      let searchForm = this.putInSearchForm // 搜索条件
      console.log('搜索表单')//打印
        console.log(searchForm) // 打印
    },

    // 打开新建投放模态框
    addPutOpen: function () {
      this.addPutVisible = true
    },

    // 关闭新建投放模态框
    addPutClose: function () {
      this.addPutVisible = false
    },

    // 提交新增投放
    addPutSubmit: function () {
      this.addPutClose()
    },

    // 投放页面刷新
    putInRefresh: function () {
      this.$refs.page.refresh() // page节点刷新页面
    }

    /**
       * 页面 《---------------------广告管理---------------------》
       */

    /**
       * 页面 《---------------------策略管理---------------------》
       */

    /**
       * 工具
       */

  }
}
</script>

<style scoped>
  /*公用*/
  .block {
    display: inline-block;
    vertical-align: middle;
  }

  .left-float {
    float: left;
  }

  .right-float {
    float: right;
  }

  .padding-about-5px {
    padding: 0 5px;
  }

  .padding-about-10px {
    padding: 0 10px;
  }

  /*私有*/
  .input-width {
    width: 200px;
  }

  .half-input-width {
    width: 120px;
  }

</style>
