<template>
  <div class="stream-box">
    <div class="header">
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="dialogTableVisible = true">添加商户</el-button>
      <el-input
        placeholder="请输入商户名称"
        v-model="merchantName"
        size="mini"
        style="width: 200px"
        clearable>
      </el-input>
      <el-input
        placeholder="请输入代理商名称"
        v-model="company"
        style="width: 200px"
        size="mini"
        clearable>
      </el-input>
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
            prop="merchantName"
            label="商户名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="contact"
            label="联系人">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="联系电话">
          </el-table-column>
          <el-table-column
            prop="company"
            label="代理商">
          </el-table-column>
          <el-table-column
                label="操作"
                width="300">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="delStream(scope.row)">删除</el-button>
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="editStream(scope.row)">编辑</el-button>
                  <el-button type="success" size="mini" icon="el-icon-plus" @click="addModel(scope.row)">手动制券</el-button>
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
        <el-dialog title="添加商户" :visible.sync="dialogTableVisible" :before-close="handleClose">
            <div v-show="!showModel">
              <el-input
                size="small"
                style="width: 250px"
                placeholder="请输入商户名称"
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
              <div>
                <span>商户名：{{ addItem.name }}</span>
                <span>代理商：{{ addItem.contact }}</span>
                <span>联系电话：{{ addItem.phone }}</span>
              </div>
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
                <el-form-item label="门店编号" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="PID" prop="pid">
                  <el-input v-model="ruleForm.pid"></el-input>
                </el-form-item>
                <el-form-item label="授权token" prop="token">
                  <el-input v-model="ruleForm.token"></el-input>
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
              <el-form :model="ruleFormEdit" :rules="rules" ref="ruleFormEdit" label-width="100px" class="ruleForm">
                <el-form-item label="门店编号" prop="name">
                  <el-input v-model="ruleFormEdit.name"></el-input>
                </el-form-item>
                <el-form-item label="PID" prop="pid">
                  <el-input v-model="ruleFormEdit.pid"></el-input>
                </el-form-item>
                <el-form-item label="授权token" prop="token">
                  <el-input v-model="ruleFormEdit.token"></el-input>
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
  export default {
      data() {
        return {
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
            token: ''
          },
          ruleFormEdit: {
            name: '',
            pid: '',
            token: ''
          },
          rules: {
            name: [
              { required: true, message: '请输入门店编号', trigger: 'blur' }
            ],
            pid: [
              { required: true, message: '请输入pid', trigger: 'blur' }
            ],
            token: [
              { required: true, message: '请输入token', trigger: 'blur' }
            ]
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
            company: this.company,
            merchantName: this.merchantName,
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
          this.ruleFormEdit.name = item.store,
          this.ruleFormEdit.pid = item.pid,
          this.ruleFormEdit.token = item.token
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
              this.itemStream.store = this.ruleFormEdit.name
              this.itemStream.pid = this.ruleFormEdit.pid
              this.itemStream.token = this.ruleFormEdit.token
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
            name: this.input
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
                merchantId: this.addItem.id,
                store: this.ruleForm.name,
                pid: this.ruleForm.pid,
                token: this.ruleForm.token
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
</style>
