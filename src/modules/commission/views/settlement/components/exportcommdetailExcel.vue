<template>
  <div>
    <el-form  ref="validateForm" label-width="100px" :model="params" :rules="rules" @submit.native.prevent>
      <el-form-item label="结算时间:" prop="begin">
        <el-date-picker v-model="timeZone"
                        style="width: 300px;"
                        type="daterange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00', '23:59:59']"
                        :picker-options="pickerOptions"
                        size="small"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
        <el-input v-model="params.begin" style="display: none"></el-input>
      </el-form-item>
      <div style="margin-left: 10px;color: darkorange;text-align: center;">请选择导出时间</div>
      <el-form-item>
        <div class="vm-text-right mt-20">
          <el-button size="medium" @click="propsInfo.open = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="submitInfo('validateForm')">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as commissionApi from '../../../api/commission'
import downloadFile from '@/utils/downloadFile.js'
export default {
  mixins: [],
  components: {
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
    var self = this
    return {
      btnDiabled: true,
      timeZone: [],
      pickerMinDate: '',
      params: {
        begin: '',
        end: ''
      },
      rules: {
        begin: [
          { required: true, message: '请选择时间' }
        ]
      },
      pickerOptions: {
        onPick: ({maxDate, minDate}) => {
          self.pickerMinDate = minDate.getTime()
          if (maxDate) {
            self.pickerMinDate = ''
          }
          console.log(self.pickerMinDate)
        },
        disabledDate (time) {
          let date = new Date()
          date.setHours(23)
          date.setMinutes(59)
          date.setSeconds(59)
          // let status = (time.getTime() < date.getTime() + 1) && (time.getTime() > date.getTime() + 1 - 30 * 24 * 60 * 60 * 1000)
          let status = time.getTime() < date.getTime() + 1
          if (self.pickerMinDate) {
            const day30 = 30 * 24 * 3600 * 1000
            let maxTime = self.pickerMinDate + day30
            let minTime = self.pickerMinDate - day30
            if (maxTime > date.getTime()) {
              maxTime = date.getTime()
            }
            if ((time.getTime() < maxTime) && (time.getTime() > minTime) && status) {
              return false
            } else {
              return true
            }
          } else {
            return !status
          }
        }
      }
    }
  },
  watch: {
    'timeZone' (val) {
      val = val || []
      this.params.begin = val[0] || ''
      this.params.end = val[1] || ''
    }
  },
  computed: {},
  created () {
  },
  methods: {
    submitInfo (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmSubmit()
        } else {
          return false
        }
      })
    },
    confirmSubmit () {
      commissionApi.commissionDetailExportExcel(this.params).then(res => {
        downloadFile(res, '佣金明细报表.xls')
        this.$message.success('恭喜你，佣金明细报表下载成功')
      })
    }
  }
}
</script>
<style scoped>
</style>
