<template>
  <div class="stream-box">
    <div class="header">
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="addTongs">添加智能通道</el-button>
    </div>
    <div class="center">
      <el-table
          v-loading="listLoading"
          :data="streamList"
          stripe
          :header-cell-style="{'backgroundColor': '#f2f4f6'}"
          size="medium"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="channelName"
            label="通道名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="channelLevel"
            label="通道优先级">
          </el-table-column>
          <el-table-column
            prop="marketName"
            label="营销活动名称">
          </el-table-column>
          <el-table-column
            prop="startDate"
            label="活动开始日期">
          </el-table-column>
          <el-table-column
            prop="endDate"
            label="活动结束日期">
          </el-table-column>
          <el-table-column
            prop="minCash"
            label="活动最小付款金额(元)">
          </el-table-column>
          <el-table-column
            label="支付方式">
            <template slot-scope="scope">
              <span v-if="scope.row.payWay == 1">微信</span>
              <span v-if="scope.row.payWay == 2">支付宝</span>
              <span v-if="scope.row.payWay == 9">银联</span>
            </template>
          </el-table-column>
          <el-table-column
            label="活动针对的支付类型">
            <template slot-scope="scope">
              <span v-if="scope.row.payType == 1">全部</span>
              <span v-if="scope.row.payType == 2">客户主扫</span>
              <span v-if="scope.row.payType == 3">客户被扫</span>
            </template>
          </el-table-column>
          <el-table-column
            label="通道状态">
            <template slot-scope="scope">
              <span v-if="scope.row.channelStatus == 1" style="color: #008000;">已开通</span>
              <span v-if="scope.row.channelStatus == -1" style="color: red;">已关闭</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="180">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="editStream(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="添加/编辑智能通道" :visible.sync="dialogTableVisible" :before-close="handleClose">
            <div style="margin-bottom: 20px;" v-show="!edit">
              <span>选择通道</span>
              <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in optionsData"
                    :key="item.value"
                    :label="item.label + item.value"
                    :value="item">
                  </el-option>
                </el-select>
                <span style="color: red;">(智能通道不支持开店宝，手机pos)</span>
            </div>
            <div>
              <div style="margin-bottom: 20px;">
                <span>通道优先级</span>
                <el-input-number v-model="channelLevel" controls-position="right" :min="1" :max="10000"></el-input-number>
              </div>
              <div style="margin-bottom: 20px;">
                <span>支付方式</span>
                <el-select v-model="payWay" placeholder="请选择">
                    <el-option
                      v-for="item in wayData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </div>
              <div style="margin-bottom: 20px;">
                <span>是否有营销活动</span>
                <el-radio-group v-model="radio">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </div>
              <div v-show="radio == 1">
                <div style="margin-bottom: 20px;">
                  <span>营销活动名称</span>
                  <el-input v-model="marketName" style="width: 50%;"></el-input>
                </div>
                <div style="margin-bottom: 20px;">
                  <span>活动最小付款金额</span>
                  <el-input-number v-model="minCash" controls-position="right" :min="0"></el-input-number>
                </div>
                <div style="margin-bottom: 20px;">
                  <span>选择活动针对的支付类型</span>
                  <el-select v-model="payType" placeholder="请选择">
                      <el-option
                        v-for="item in typeData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </div>
                <div style="margin-bottom: 20px;">
                  <span>选择活动开始日期</span>
                  <el-date-picker
                    v-model="startTime"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </div>
                <div style="margin-bottom: 20px;">
                  <span>选择活动结束日期</span>
                  <el-date-picker
                    v-model="endTime"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </div>
              </div>
              <el-button type="primary" @click="addStream">提交</el-button>
            </div>
        </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    addStream,
    getStreamList,
    getChanelCofig
  } from '../api/mind.js'
  export default {
      data() {
        return {
          pickerOptions: {
            shortcuts: [{
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date());
              }
            }, {
              text: '明天',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24);
                picker.$emit('pick', date);
              }
            }, {
              text: '一周后',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
              }
            }]
          },
          options: [{ // 智能通道不支持开店宝，手机pos
            value: '1',
            label: '官方'
          }, {
            value: '6',
            label: '富友'
          }, {
            value: '7',
            label: '随行付'
          }, {
            value: '9',
            label: '威富通'
          }, {
            value: '10',
            label: '乐刷'
          }, {
            value: '11',
            label: '传化'
          }, {
            value: '12',
            label: '天阙随行付'
          }, {
            value: '13',
            label: '易生'
          }, {
            value: '14',
            label: '拉卡拉'
          }, {
            value: '20',
            label: '畅捷支付'
          }, {
            value: '21',
            label: '敏付'
          }],
          typeData: [{
            value: '1',
            label: '全部'
          }, {
            value: '2',
            label: '客户主扫'
          }, {
            value: '3',
            label: '客户被扫'
          }],
          wayData: [{
            value: 1,
            label: '微信'
          }, {
            value: 2,
            label: '支付宝'
          }, {
            value: 9,
            label: '银联'
          }],
          payType: '1',
          payWay: '',
          optionsData: [],
          value: {},
          loading: false,
          dialogTableVisible: false,
          channelLevel: 1,
          radio: 1,
          marketName: '',
          minCash: 0,
          startTime: '',
          endTime: '',
          streamList: [],
          allList: [],
          itemStream: {},
          listLoading: false,
          edit: false,
          editItem: ''
        }
      },
      mounted() {
        this.getChanelCofig()
        this.getStreamList()
      },
      methods: {
        getChanelCofig() {
          getChanelCofig().then(res => {
              if(res.code === 200) {
                let checkboxGroup = JSON.parse(res.msg)
                checkboxGroup.map(item => {
                  this.options.map(val => {
                    if (val.value == item) {
                      this.optionsData.push(val)
                    }
                  })
                })
              }
          })
        },
        getStreamList() {
          this.listLoading = true
          getStreamList().then(res => {
              this.listLoading = false
              console.log(res)
              if (res.code === 200) {
                  this.streamList = res.obj
              }
            }).catch(e => {
              this.listLoading = false
            })
        },

        editStream(item) {
          this.edit = true
          this.dialogTableVisible = true
          this.editItem = item
          this.channelLevel = item.channelLevel
          this.value.label = item.channelName
          this.value.value = item.channelNo
          this.endTime = item.endDate
          this.radio = item.isMarket
          this.marketName = item.marketName
          this.minCash = item.minCash
          this.payType = item.payType
          this.payWay = item.payWay
          this.startTime = item.startDate
        },
        resetData() {
          this.channelLevel = 1
          this.value.label = ''
          this.value.value = ''
          this.endTime = ''
          this.radio = 1
          this.marketName = ''
          this.minCash = 0
          this.payType = '1'
          this.payWay = ''
          this.startTime = ''
        },
        addTongs() {
          this.edit = false
          this.resetData()
          this.dialogTableVisible = true
        },
        handleClose (done) {
          done()
        },
        addStream() {
          let params = {
            "channelLevel": this.channelLevel,
            "channelName": this.value.label,
            "channelNo": this.value.value,
            "channelStatus": 1,
            "endDate": this.endTime,
            "isMarket": this.radio,
            "marketName": this.marketName,
            "minCash": this.minCash,
            "payType": this.payType,
            "payWay": this.payWay,
            "startDate": this.startTime,
            "marketStatus": 1
          }
          if (this.edit) {
            params = {
              ...this.editItem,
              ...params
            }
          }
          if(!this.value.value || !this.payWay) {
            this.$message.error('请完善数据后提交')
            return
          }
          if (this.radio) {
            if(!this.marketName || !this.startTime){
              this.$message.error('请完善数据后提交')
              return
            }
          }
          addStream(params).then(res => {
              this.dialogTableVisible = false
              this.getStreamList()
          })
        },
      },
    }
</script>

<style lang="scss" scoped>
  .stream-box {
    padding: 30px;
    .ruleForm {
      width: 93%
    }
    .center {
      margin-top: 20px
    }
  }
  .model-desp {
    margin: 0 0 30px 20px;
    font-size: 16px
  }
</style>
