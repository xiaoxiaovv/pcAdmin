import LazySelect from '@/components/libs/lazySelect'

export default {
  model: {
    prop: 'value',
    event: 'model'
  },
  props: {
    value: '',
    list: {
      type: Array,
      default: null
    }
  },
  components: {
    LazySelect
  },
  data() {
    return {
      defaultOptions: {
        clearable: true
      }
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
    mergedOptions() {
      let mergedOptions = Object.assign({}, this.defaultOptions, this.$props, this.$attrs)
      return Object.assign({
        options: mergedOptions
      }, mergedOptions)
    }
  },
  methods: {
    initial(data) {
      this.$emit('initial', data)
    },
    getDataFnOrDataList() {
      return this.list ? Promise.resolve(this.list) : this.getData()
    },
    getData() {
      Promise.reject(new Error('请重写该方法'))
    },
    getObj(value = this.modelValue) {
      return this.$refs.lazySelect.getObj(value)
    },
    convertData(value, label, data) {
      return {
        value,
        label,
        data
      }
    },
    /**
     * 对禁用进行扩容
     * @param value
     * @param label
     * @param data
     * @param disabledVal
     * @param boolean
     * @returns {{value: *, label: *, disabled: boolean, data: *}}
     */
    convertDataDisabled(value, label, data, disabledOption = false) {
      return {
        value,
        label,
        disabled: disabledOption,
        data
      }
    },
    change(val) {
      this.$emit('change', val)
    }
  }
}
