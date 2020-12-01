import LazyCascader from '@/components/libs/lazyCascader'

export default {
  model: {
    prop: 'value',
    event: 'model'
  },
  props: {
    value: '',
    blackData: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  components: {
    LazyCascader
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
    getObj(value = this.modelValue) {
      return this.$refs.lazyCascader.getObj(value)
    },
    convertData(value, label, data) {
      let dataObj = {
        value,
        label,
        data
      }
      if (data.children && data.children.length) {
        dataObj.children = data.children.map(v => this.convertData(v.id, v.name, v))
      }
      return dataObj
    }
  }
}
