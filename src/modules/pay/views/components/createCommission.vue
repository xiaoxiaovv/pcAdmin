<template>
  <div>
    <el-form  ref="validateForm" label-width="150px" :model="params" :rules="rules" @submit.native.prevent>
      <el-form-item label="佣金生效时间:" prop="beginTime">
        <el-date-picker v-model="timeZone"
                        type="daterange"
                        value-format="timestamp"
                        :default-time="['00:00:00', '23:59:59']"
                        :picker-options="pickerOptions"
                        size="medium"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
        <el-input v-model="params.beginTime" style="display: none"></el-input>
      </el-form-item>
      <el-form-item label="" v-if="btnDiabled">
        <div>佣金生成中，请耐心等待...</div>
      </el-form-item>

      <el-form-item>
        <div class="vm-text-right">
          <el-button size="medium" @click="propsInfo.show = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="submitInfo('validateForm')" :disabled="btnDiabled">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import * as signApi from '@/modules/merchant/agent/api/merchantInfo'
import * as signApi from '@/modules/merchant/top/api/merchant'
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
        beginTime: '',
        endTime: '',
        id: '',
        type: 4
      },
      rules: {
        beginTime: [
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

          /*
          if (status) {
            const day30 = (30 - 1) * 24 * 3600 * 1000
            let maxTime = self.pickerMinDate + day30
            if (maxTime > new Date()) {
              maxTime = new Date()
            }
            return time.getTime() < maxTime
          } else {
            return !status
          }
          */
        }
      },
      setTimeVal: ''
    }
  },
  watch: {
    'timeZone' (val) {
      val = val || []
      this.params.beginTime = val[0] || ''
      this.params.endTime = val[1] || ''
    }
  },
  computed: {},
  created () {
    this.params.id = sessionStorage.getItem('companyId')
    this.checkStatus()
  },
  methods: {
    checkStatus () {
      let params = {
        id: sessionStorage.getItem('companyId')
      }
      signApi.getComissionStatus(params).then(res => {
        if (res.obj === 1) {
          this.btnDiabled = false
        } else if (res.obj === 2) {
          if (this.setTimeVal) {
            clearTimeout(this.setTimeVal)
          }
          this.setTimeVal = setTimeout(() => {
            this.checkStatus()
          }, 3000)
        }
      })
    },
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
      signApi.createComission(this.params).then(res => {
        this.$message.info(res.msg)
        this.propsInfo.show = false
      })
    }
  },
  destroyed () {
    if (this.setTimeVal) {
      clearTimeout(this.setTimeVal)
    }
  }
}
</script>
