<template>
  <el-cascader v-model="modelValue"
               v-bind="options"
               filterable
               :change-on-select="changeOnSelect"
               :options="optionList"
               @visible-change="onVisibleChange"
               @active-item-change="onActiveItemChange"
               @change="onChange" />
</template>

<script>
export default {
  name: 'lazyCascader',
  model: {
    prop: 'value',
    event: 'model'
  },
  props: {
    value: {
      type: [Array],
      default() {
        return []
      }
    },
    changeOnSelect: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 支持el-cascader的所有props
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
    // 是否缓存数据
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
      const loop = list => {
        list.forEach(v => {
          optionMap[v.value] = v
          if (v.children && v.children.length) {
            loop(v.children)
          }
        })
      }
      loop(this.optionList)
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
    autoGetData() {
      let val = this.value
      let isArr = Array.isArray(val)
      if ((isArr && val[0]) || (!isArr && val)) {
        this.onVisibleChange(true)
      }
    },
    onVisibleChange(visible) {
      if (visible || this.cache === false) {
        if (this.initial === false) {
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
        } else if (this.value && this.value.length) {
          this.syncValue()
        }
      }
    },
    onActiveItemChange(data) {
      data = data[0] ? data : []
      return new Promise(resolve => {
        let isAllInitial = true
        data = data.map(v => {
          let item = this.getObj(v)
          if (this.cache === false || (isAllInitial && Array.isArray(item.children) && !item.children.length)) {
            isAllInitial = false
          }
          return item
        })
        if (isAllInitial !== true) {
          this.$emit('active-item-change', data[data.length - 1], data, resolve)
        } else {
          resolve()
        }
      })
    },
    setDataList(dataList) {
      this.optionList = dataList
      this.initial = true
      this.syncValue()
      this.$emit('initial', this.optionList)
    },
    async syncValue() {
      if (this.value.length > 0) {
        for (let i = 0, l = this.value.length; i < l; i++) {
          await this.onActiveItemChange(this.value.slice(0, i + 1))
        }
      }
    },
    clear() {
      this.optionList = []
      this.initial = false
    },
    getObj(value) {
      return Array.isArray(value) ? value.map(v => this.optionMap[v]) : this.optionMap[value]
    },
    onChange(val) {
      this.$emit('change', val)
    }
  }
}
</script>
