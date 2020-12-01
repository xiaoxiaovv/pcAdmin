<template>
  <el-select v-model="modelValue"
             size="small"
             class="ly-margin-right-bottom-sm"
             @visible-change="onVisibleChange"
             clearable
             filterable
             @change="onChange">
    <el-option v-for="v in optionList"
               :key="v.value"
               :label="v.label"
               :title="v.label"
               :value="v.value"
               :disabled="v.disabled"
               :clearable="v.clearable" />
  </el-select>
</template>

<script>
import * as incomingApi from '@/modules/pay/api/incoming'
export default {
  props: {
    value: '',
    branchParams: {
      type: Object,
      default: function () {
        return {}
      }
    },
    id: {
      type: [Number, String]
    }
  },
  data () {
    return {
      modelValue: '',
      optionList: [],
      init: false
    }
  },
  computed: {
  },
  watch: {
    'value' (val, oldVal) {
      this.modelValue = val
    },
    'branchParams' (val, oldVal) {
      if (this.init) {
        this.modelValue = ''
        this.onChange('')
      }
      this.getDataFn()
    }
  },
  created () {
    if (this.value) {
      this.modelValue = this.value
    }
    if (this.value !== '' || this.value !== undefined || this.value !== null) {
      this.modelValue = this.value
      this.getDataFn()
    }
  },
  mounted() {
  },
  methods: {
    onVisibleChange (val) {
      if (val && !this.optionList.length) {
        this.getDataFn()
      }
    },
    getDetailInfo () {
      let info = this.fmtInfo()
      this.$emit('getInfo', info)
    },
    fmtInfo () {
      let valueArr = [...[this.value]]
      let treeArr = [...this.optionList]
      let provArr = this.deepLoop(valueArr, treeArr, [])
      return provArr
    },
    deepLoop (valueArr, treeArr, provArr) {
      if (valueArr.length) {
        treeArr.forEach(item => {
          if (item.value === valueArr[0]) {
            let params = Object.assign({}, item)
            delete params.children
            delete params.list
            provArr.push(params)
            valueArr.splice(0, 1)
            if (valueArr.length) {
              provArr = this.deepLoop(valueArr, item.children, provArr)
            }
          }
        })
      }
      return provArr
    },
    getDataFn () {
      if (this.branchParams.lbnkProv && this.branchParams.lbnkCity && this.branchParams.bnkCd) {
        this.$nextTick(() => {
          this.init = true
        })
        incomingApi.findBankBranchCode(this.branchParams).then(res => {
          res.obj.forEach(item => {
            this.$set(item, 'value', item.lbnkNo)
            this.$set(item, 'label', item.lbnkNm)
          })
          this.optionList = res.obj
        })
      } else {
        this.optionList = []
      }
    },
    onChange(val) {
      this.$emit('input', val)
    }
  }
}
</script>
