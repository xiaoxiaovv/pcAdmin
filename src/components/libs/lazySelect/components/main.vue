<template>
  <el-select v-model="modelValue"
             v-bind="options"
             filterable
             class="ly-margin-right-bottom-sm"
             @visible-change="onVisibleChange"
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
export default {
  model: {
    prop: 'value',
    event: 'model'
  },
  props: {
    value: {
      type: [String, Number, Array],
      default: ''
    },
    // 所有的el-select选项
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    // 返回Promise/数据数组
    // 数据必须是包含{value: '', label: ''}结构的对象数组
    getDataFnOrDataList: {
      type: [Function, Array]
    },
    cache: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      initial: false,
      optionList: []
    }
  },
  computed: {
    modelValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('model', val)
      }
    },
    optionMap() {
      let optionMap = {}
      this.optionList.forEach(v => {
        optionMap[v.value] = v
      })
      return optionMap
    }
  },
  watch: {
    value() {
      this.autoGetData()
    },
    getDataFnOrDataList(val) {
      if (Array.isArray(val)) {
        this.autoGetData()
      }
    }
  },
  created() {
    this.autoGetData()
  },
  methods: {
    handleEvents() {
    },
    autoGetData() {
      let val = this.value
      let isArr = Array.isArray(val)
      if ((isArr && val[0]) || (!isArr && val)) {
        this.onVisibleChange(true)
      }
    },
    onVisibleChange(visible) {
      if (visible && (this.initial === false || this.cache === false)) {
        let isArr = Array.isArray(this.getDataFnOrDataList)
        let isFn = !isArr && typeof this.getDataFnOrDataList === 'function'
        if (!isArr && !isFn) {
          throw new Error('必须提供 getDataFnOrDataList([Array | Function:Promise]) ')
        }
        if (isArr) {
          this.setDataList(this.getDataFnOrDataList)
        } else if (isFn) {
          this.getDataFnOrDataList().then(data => {
            this.setDataList(data)
          }, () => {
            // 异常情况下，下次重新请求
            this.initial = false
          })
        }
      }
    },
    setDataList(dataList) {
      this.optionList = dataList
      this.initial = true
      this.$emit('initial', this.optionList)
    },
    clear() {
      this.optionList = []
      this.initial = false
    },
    getObj(value) {
      return Array.isArray(value) ? value.map(v => this.optionMap[value][v]) : this.optionMap[value]
    },
    onChange(val) {
      this.$emit('change', val)
    }
  }
}
</script>
