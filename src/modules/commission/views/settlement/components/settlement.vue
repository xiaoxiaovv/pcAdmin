<template>
  <div>
    <div style="margin-bottom: 10px;">已选中<span style="color: red;">{{tableData.length}}</span>个代理（系统自动去重）</div>
    <div style="max-height: 50vh;overflow-y: auto;">
      <el-table :data="tableData"
                border
                style="width: 100%">
        <el-table-column prop="companyName"
                         label="代理商名称">
        </el-table-column>
        <el-table-column prop="count"
                         label="结算天数">
        </el-table-column>
        <el-table-column prop="settleTotal"
                         label="结算佣金">
        </el-table-column>
        <el-table-column fixed="right"
                         label="支付凭证"
                         width="80">
          <template slot-scope="scope">
            <ImgUpload class="commitupload"
                       v-model="scope.row.voucherUrlSec"
                       :urlType="1"></ImgUpload>
            <!--<el-button type="text" size="small">上传</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="vm-text-right"
         style="padding-top: 20px;">
      <el-button size="medium"
                 @click="propsInfo.show = false">取 消</el-button>
      <el-button size="medium"
                 type="primary"
                 @click="submitInfo('validateForm')">确 定</el-button>
    </div>
    <!--
    <el-form  ref="validateForm" label-width="150px" :model="params" :rules="rules" @submit.native.prevent>
      <el-form-item label="已选:" prop="title" v-if="propsInfo.type === 2">
        {{propsInfo.ids.length}}条
      </el-form-item>
      <el-form-item label="结算佣金:" prop="title">
        {{propsInfo.commissionTotal}}
      </el-form-item>
      <el-form-item label="支付凭证:" prop="voucherurl">
        <ImgUpload v-model="params.voucherurl" :urlType="1"></ImgUpload>
        <el-input v-model="params.voucherurl" style="display: none;"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="vm-text-right">
          <el-button size="medium" @click="propsInfo.show = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="submitInfo('validateForm')">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
    -->
  </div>
</template>

<script>
import * as commissionApi from '../../../api/commission'
import ImgUpload from '@/components/imgUpload/index'
export default {
  mixins: [],
  components: {
    ImgUpload
  },
  props: {
    propsInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      params: {
        id: null,
        voucherurl: null
      },
      tableData: [],
      rules: {
        voucherurl: [
          // { required: true, message: '请上传支付凭证' }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  created() {
    // let arr = [...this.propsInfo.commitArr]
    let arr = JSON.parse(JSON.stringify([...this.propsInfo.commitArr]))

    let arrMap = {}
    arr.forEach(item => {
      let companyId = item.companyId
      arrMap[companyId] = arrMap[companyId] || []
      arrMap[companyId].push(item)
    })
    let commitArr = []
    for (let i in arrMap) {
      let onekeyArr = arrMap[i]
      let params = onekeyArr[0]
      let commissionTotal = 0
      let ids = []
      onekeyArr.forEach(item => {
        commissionTotal += item.settleTotal
        ids.push(item.id)
      })
      console.log('parseFloat(commissionTotal)', (parseInt(Number(commissionTotal) * 100) / 100))
      commissionTotal = parseInt(Number(commissionTotal) * 100) / 100

      this.$set(params, 'settleTotal', commissionTotal) // 结算佣金
      this.$set(params, 'count', onekeyArr.length) // 结算天数
      this.$set(params, 'voucherUrlSec', '') // 支付凭证
      this.$set(params, 'ids', ids) // 结算id集合
      commitArr.push(params)
    }
    this.tableData = commitArr
  },
  methods: {
    submitInfo() {
      this.$confirm('确定结算当前已选代理商?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmSubmit()
      }).catch(() => {
      })
    },
    /***
     * 确认提交
     * */
    confirmSubmit() {
      let params = this.initParams()
      commissionApi.commissionSettle(params).then(res => {
        this.$message.success('结算成功')
        this.$emit('getTableList')
        this.$emit('getCountInfo')
        this.propsInfo.show = false
      })
    },
    /**
     * 获取要提交的参数
     * @returns {Array}
     */
    initParams() {
      let paramsArr = []
      this.tableData.forEach(item => {
        let params = {
          id: item.ids,
          voucherurl: item.voucherUrlSec
        }
        paramsArr.push(params)
      })
      return paramsArr
    }
  }
}
</script>
<style scoped>
</style>
