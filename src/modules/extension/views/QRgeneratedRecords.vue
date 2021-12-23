<template>
  <div class="app-container" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>生成记录</span>

        <el-button style="float: right; padding: 3px 0" type="text" @click="goBack">返回上一页</el-button>
        <el-button style="float: right; padding: 3px 0;margin: 0 10px" type="text" @click="batchProductionOpen">批量生成
        </el-button>
      </div>
      <!--内容-->
      <div>

        <el-table
          :data="recordTable"
          height="66vh"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="id"
            label="批次">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="生成时间">
          </el-table-column>
          <el-table-column
            prop="generateNumber"
            label="生成数量">
          </el-table-column>
          <el-table-column
            prop="creatorName"
            label="操作人">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button class="btn_margin" type="text" @click="downloadFile(scope.row)">批量下载</el-button>
              <el-button class="btn_margin" type="text" @click="deleteFile(scope.row)">删除文件</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          :total-elements="recordTableTotalElement"
          :change-callback="getList"
          ref="page"></pagination>

      </div>
    </el-card>

    <!--批量生成模态框-->
    <el-dialog
      title="提示"
      :visible.sync="batchProductionVisible"
      width="30%"
      :before-close="batchProductionClose">

      <div>
        <el-form ref="batchForm" :rules="rules" :model="batchForm" label-width="100px">
          <el-form-item label="生成数量：" prop="num">
            <div class="block">
              <el-radio-group v-model="batchForm.num" size="medium">
                <el-radio-button label="100"></el-radio-button>
                <el-radio-button label="500"></el-radio-button>
                <el-radio-button label="1000"></el-radio-button>
              </el-radio-group>
            </div>
            <div class="block">
              <el-input size="medium" placeholder="自定义数量" v-model="batchForm.num"></el-input>
            </div>
          </el-form-item>
        </el-form>


      </div>

      <span slot="footer" class="dialog-footer">
    <el-button @click="batchProductionClose">取 消</el-button>
    <el-button type="primary" @click="submitBatch">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import pagination from '@/components/pagination/index'
  import {getQrCodeRecord, addQrCodeRecord, deleteFile, download} from '@/modules/extension/api/qrCodeRecord'
  import {url} from '@/utils/request'

  export default {
    name: '收款码页面',
    components: {pagination},
    data () {
      var validateNum = (rule, value, callback) => {
        var r = /^\+?[1-9][0-9]*$/

        if (!r.test(value)) {
          this.batchForm.num = 0
        } else {
          if (value < 1) {
            callback(new Error('不能小于1个'))
          } else if (value > 1000) {
            callback(new Error('不能大于1000个'))
          } else {
            callback()
          }
        }
      }
      return {
        loading: '',//加载
        recordTable: [],//表格
        recordTableTotalElement: 0,//条数
        batchProductionVisible: false,//批量生成模态框

        batchForm: {
          num: 0 //数量
        },
        rules: {
          num: [
            {required: true, message: '数量必须输入', trigger: 'blur'},
            {validator: validateNum, trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      this.getList(1, 10)
    },
    methods: {

      /**
       * 获取列表
       */
      getList (number, pageSize) {
        this.loading = true
        getQrCodeRecord(number, pageSize).then(response => {
          let data = response.obj
          console.log(data)
          this.recordTable = data.content
          this.recordTableTotalElement = data.totalElements
          setTimeout(() => {
            this.loading = false
          }, 500)
        }).catch(() => {
          this.loading = false
        })
      },

      /**
       * 打开批量生成模态框
       */
      batchProductionOpen: function () {
        this.batchProductionVisible = true
      },

      /**
       * 关闭批量生成模态框
       */
      batchProductionClose: function () {
        this.$refs['batchForm'].resetFields()
        this.batchProductionVisible = false
      },

      /**
       * 提交批量
       */

      submitBatch: function () {
        this.$refs['batchForm'].validate((valid) => {
          if (valid) {
            //正确
            addQrCodeRecord(this.batchForm.num).then(response => {
              this.$message({
                message: response.msg,
                type: 'success'
              })
              this.batchProductionClose()
              this.$refs.page.refresh()
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$message.error('还有未填写的内容')
            return false
          }
        })
      },

      /**
       * 删除文件
       */

      deleteFile: function (data) {
        //data row数据
        this.$confirm('此操作将永久删除该文件, 是否继续?', '删除文件', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //确认删除----
          deleteFile(data.id).then(response => {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            this.$refs.page.refresh()
          }).catch(() => {
            this.loading = false
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      /**
       * 批量下载
       */

      downloadFile: function (data) {

        let str = data.downloadUrl
        let num = str.indexOf('blankcode')
        let fileurl = str.slice(num)
        console.log(num, url)

        let urltxt = url + '/resource/' + fileurl
        window.open(urltxt)

      },

      /**
       * 返回上一页
       */
      goBack: function () {
        this.$router.go('-1')
      },
    }
  }
</script>

<style scoped>
  .block {
    display: inline-block;
    vertical-align: middle;
  }

  .btn_margin {
    margin: 0 10px;
  }
</style>
