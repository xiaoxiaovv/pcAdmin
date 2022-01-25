<template>
  <div class="stream-box">
    <div class="header">
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="dialogTableVisible = true">添加代理</el-button>
      <el-input
        placeholder="请输入代理商"
        v-model="merchantName"
        size="small"
        style="width: 200px"
        clearable>
      </el-input>
      <el-date-picker
        size='small'
        v-model="dateValue"
        type="daterange"
        unlink-panels
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" size="mini" @click="getStreamList">搜索</el-button>
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
            prop="agentName"
            label="代理商"
            width="180">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="marketAmount"
            label="开户奖励金额">
          </el-table-column>
          <el-table-column
            prop="minTradeAmount"
            label="单笔交易最小金额">
          </el-table-column>
          <el-table-column
            prop="minTradeTotalMonth"
            label="首月最低交易总额">
          </el-table-column>
          <el-table-column
            prop="minValidOrder"
            label="最低有效订单数">
          </el-table-column>
          <el-table-column
            label="付款方式">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.payWay == 3">全部</el-button>
              <el-button type="text" v-if="scope.row.payWay == 2">客户被扫</el-button>
              <el-button type="text" v-if="scope.row.payWay == 1">客户主扫</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="当前状态">
            <template slot-scope="scope">
              <el-button type="success" size="mini" v-if="scope.row.status == 1">开启</el-button>
              <el-button type="danger" size="mini" v-if="scope.row.status == 0">关闭</el-button>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="140">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="editStream(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 20px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
        <el-dialog title="添加代理" :visible.sync="dialogTableVisible" :before-close="handleClose">
            <div v-show="!showModel">
              <el-input
                size="small"
                style="width: 250px"
                placeholder="请输入代理名称"
                v-model="input"
                clearable>
              </el-input>
              <el-button type="primary" size="small" icon="el-icon-search" @click='getAllList'>检索</el-button>
              <el-table
                  v-loading="loading"
                  :data="allList"
                  stripe
                  :header-cell-style="{'backgroundColor': '#f2f4f6'}"
                  size="medium"
                  style="width: 100%;margin-top:25px">
                  <el-table-column
                    prop="name"
                    label="商户名">
                  </el-table-column>
                  <el-table-column
                    prop="contact"
                    label="代理商">
                  </el-table-column>
                  <el-table-column
                    prop="phone"
                    label="手机号">
                  </el-table-column>
                  <el-table-column
                        label="操作"
                        width="100">
                        <template slot-scope="scope">
                          <el-button type="primary" size="mini" icon="el-icon-plus" @click="addeConnoisseur(scope.row)">添加</el-button>
                        </template>
                      </el-table-column>
                </el-table>
            </div>
            <div v-show="showModel">
              <div class="model-desp">
                <span style="margin-right: 20px">代理商：{{ addItem.name }}</span>
                <span>联系电话：{{ addItem.phone }}</span>
              </div>
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="170px" class="ruleForm">
                <el-form-item label="开户奖励金额(元)" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="单笔交易最小金额(元)" prop="pid">
                  <el-input v-model="ruleForm.pid"></el-input>
                </el-form-item>
                <el-form-item label="首月最低交易总额(元)" prop="token">
                  <el-input v-model="ruleForm.token"></el-input>
                </el-form-item>
                <el-form-item label="最低有效订单数" prop="singleReward">
                  <el-input v-model="ruleForm.singleReward"></el-input>
                </el-form-item>
                <el-form-item label="付款方式" prop="resource">
                  <el-radio-group v-model="ruleForm.resource">
                    <el-radio :label="3">全部</el-radio>
                    <el-radio :label="1">客户主扫</el-radio>
                    <el-radio :label="2">客户被扫</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="订单去重" prop="payRepeat">
                  <el-radio-group v-model="ruleForm.payRepeat">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="-1">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="当前状态" prop="status">
                  <el-radio-group v-model="ruleForm.status">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
                  <el-button @click="showModel = false">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
        </el-dialog>
        <el-dialog title="编辑" :visible.sync="editModel">
            <div>
              <el-form :model="ruleFormEdit" :rules="rules" ref="ruleFormEdit" label-width="180px" class="ruleForm">

                <el-form-item label="开户奖励金额(元)" prop="name">
                  <el-input v-model="ruleFormEdit.name"></el-input>
                </el-form-item>
                <el-form-item label="单笔交易最小金额(元)" prop="pid">
                  <el-input v-model="ruleFormEdit.pid"></el-input>
                </el-form-item>
                <el-form-item label="首月最低交易总额(元)" prop="token">
                  <el-input v-model="ruleFormEdit.token"></el-input>
                </el-form-item>
                <el-form-item label="最低有效订单数" prop="singleReward">
                  <el-input v-model="ruleFormEdit.singleReward"></el-input>
                </el-form-item>
                <el-form-item label="付款方式" prop="resource">
                  <el-radio-group v-model="ruleFormEdit.resource">
                    <el-radio :label="3">全部</el-radio>
                    <el-radio :label="1">客户主扫</el-radio>
                    <el-radio :label="2">客户被扫</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="订单去重" prop="payRepeat">
                  <el-radio-group v-model="ruleFormEdit.payRepeat">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="-1">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="当前状态" prop="status">
                  <el-radio-group v-model="ruleFormEdit.status">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitFormEdit('ruleFormEdit')">确认修改</el-button>
                  <el-button @click="resetFormEdit('ruleFormEdit')">重置</el-button>
                  <el-button @click="editModel = false">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
        </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    getAllList,
    addStream,
    getStreamList,
    delStream,
    addModel
  } from '../api/stream.js'
  import { fmt } from '@/utils/dateFmt.js'
  export default {
      data() {
        return {
          listLoading: false,
          dateValue: [],
          pickerOptions: {
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
          loading: false,
          dialogTableVisible: false,
          editModel: false,
          showModel: false,
          addItem: {},
          input: '',
          company: '',
          merchantName: '',
          currentPage: 1,
          ruleForm: {
            name: '',
            pid: '',
            token: '',
            singleReward: 0,
            resource: '',
            payRepeat: 1,
            status: ''
          },
          ruleFormEdit: {
            name: '',
            pid: '',
            token: '',
            singleReward: 0,
            resource: '',
            payRepeat: 1,
            status: ''
          },
          rules: {
            name: [
              { required: true, message: '请输入开户奖励金额', trigger: 'blur' }
            ],
            pid: [
              { required: true, message: '请输入单笔交易最小金额', trigger: 'blur' }
            ],
            token: [
              { required: true, message: '请输入首月最低交易总额', trigger: 'blur' }
            ],
            singleReward: [
              { required: true, message: '请输入最低有效订单数', trigger: 'blur' }
            ],
            resource: [
              { required: true, message: '请选择付款方式', trigger: 'change' }
            ],
            payRepeat: [
              { required: true, message: '请选择是否去重', trigger: 'change' }
            ],
            status: [
              { required: true, message: '请选择状态', trigger: 'change' }
            ],
          },
          streamList: [],
          allList: [],
          total: 0,
          itemStream: {},
        }
      },
      mounted() {
        this.getStreamList()
      },
      methods: {
        getStreamList() {
          const params = {
            pageNumber: this.currentPage,
            pageSize: 10,
            pageSort: '',
            pageOrder: '',
            agentName: this.merchantName,
            starttime: this.dateValue && this.dateValue.length!=0?fmt.date(this.dateValue[0],'yyyy-MM-dd'):'',
            endtime: this.dateValue && this.dateValue.length!=0?fmt.date(this.dateValue[1],'yyyy-MM-dd'):''
          }
          this.listLoading = true
          getStreamList(params).then(res => {
              this.listLoading = false
              console.log(res)
              if (res.code === 200) {
                this.total = res.obj.totalElements
                  this.streamList = res.obj.content
              }
            }).catch(e => {
              this.listLoading = false
            })
        },
        delStream(item) {
          this.$confirm('此操作将删除激励商户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            item.delFlag = -1
            const params = item
            delStream(params).then(res => {
              if(res.code === 200) {
                this.$message({
                  type: 'success',
                  message: res.msg
                });
                this.getStreamList()
              } else {
                this.$message.error('删除失败!');
              }
              }).catch(e => {

              })

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        editStream(item) {
          this.editModel = true
          this.ruleFormEdit.name = item.marketAmount,
          this.ruleFormEdit.pid = item.minTradeAmount,
          this.ruleFormEdit.token = item.minTradeTotalMonth
          this.ruleFormEdit.singleReward = item.minValidOrder
          this.ruleFormEdit.resource = item.payWay
          this.ruleFormEdit.payRepeat = item.payRepeat
          this.ruleFormEdit.status = item.status
          this.itemStream = item
        },
        addModel(item) {
          const params = {
            merchantId: item.merchantId
          }
          addModel(params).then(res => {
            if(res.code === 200) {
              this.$message({
                type: 'success',
                message: res.msg
              });
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
          }).catch(err => {
            this.$message({
              type: 'error',
              message: '请求失败~'
            });
          })
        },
        submitFormEdit(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.itemStream.marketAmount = this.ruleFormEdit.name
              this.itemStream.minTradeAmount = this.ruleFormEdit.pid
              this.itemStream.minTradeTotalMonth = this.ruleFormEdit.token
              this.itemStream.minValidOrder = Number(this.ruleFormEdit.singleReward)
              this.itemStream.payWay = this.ruleFormEdit.resource
              this.itemStream.payRepeat = this.ruleFormEdit.payRepeat
              this.itemStream.status = this.ruleFormEdit.status
              const params = this.itemStream
              delStream(params).then(res => {
                if(res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: res.msg
                  });
                  this.editModel = false
                  this.getStreamList()
                } else {
                  this.$message.error('编辑失败!');
                }
                }).catch(e => {

                })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetFormEdit(formName) {
          this.$refs[formName].resetFields();
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.getStreamList()
        },
        handleClose (done) {
          this.input = ''
          this.allList = []
          done()
        },
        getAllList() {
          if (!this.input) {
            this.$message({
                message: '输入框不能为空检索',
                type: 'warning'
              })
              return
          }
          this.loading = true
          const params = {
            agentName: this.input
          }
           getAllList(params).then(res => {
              this.loading = false
              console.log(res)
              if (res.code === 200) {
                  this.allList = res.obj
              }
            }).catch(e => {
              this.loading = false
            })
        },
        addeConnoisseur(item) {
          this.addItem = item
          this.showModel = true
        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              console.log(this.ruleForm)
              const params = {
                agentId: this.addItem.id,
                agentName: this.addItem.name,
                contact: this.addItem.contact,
                marketAmount: this.ruleForm.name,
                minTradeAmount: this.ruleForm.pid,
                minTradeTotalMonth: this.ruleForm.token,
                minValidOrder: this.ruleForm.singleReward,
                payWay: this.ruleForm.resource,
                payRepeat: this.ruleForm.payRepeat,
                status: this.ruleForm.status
              }
              addStream(params).then(res => {
                  console.log(res)
                  this.showModel = false
                  if(res.code === 200) {
                    this.$message({
                      type: 'success',
                      message: res.msg
                    });
                    this.getStreamList()
                  } else {
                    this.$message.error('创建失败!');
                  }
                }).catch(e => {

                })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        }
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
