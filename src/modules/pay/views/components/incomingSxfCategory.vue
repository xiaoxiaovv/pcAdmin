<template>
  <el-cascader v-model="valueArr"
               :placeholder="placeholder"
               filterable
               clearable
               :props="propsInfo"
               :options="list"
               :size="size"
               @change="change"
               @visible-change="visibleChange"></el-cascader>
</template>

<script>
import * as incomingApi from '../../api/incoming.js'
export default {
  name: 'proviceCascader',
  props: {
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    size: {
      type: String,
      default: 'small'
    },
    propsInfo: {
      type: Object,
      default: function () {
        return {
          value: 'id',
          label: 'name'
        }
      }
    }
  },
  watch: {
    'value' (val, oldVal) {
      if (val && this.list.length === 0) {
        this.getMccCdTree()
      }
      this.valueArr = val
    }
  },
  created () {
    this.valueArr = this.value
    if (this.value && this.list.length === 0) {
      this.getMccCdTree()
    }
  },
  data () {
    return {
      valueArr: [],
      list: []
    }
  },
  methods: {
    visibleChange (val) {
      if (val && this.list.length === 0) {
        this.getMccCdTree()
      }
    },
    /**
     * 获取省市区树
     */
    getMccCdTree () {
      incomingApi.findMccCdTree().then(res => {
        res.obj.forEach(item => {
          this.$set(item, 'id', item.classCode)
          this.$set(item, 'name', item.className)
          item.list.forEach(itemSec => {
            this.$set(itemSec, 'id', itemSec.mccCode)
            this.$set(itemSec, 'name', itemSec.mccName)
          })
          this.$set(item, 'children', item.list)
        })
        this.list = res.obj
      })
    },
    change (val) {
      this.$emit('input', val)
    },
    getDetailInfo () {
      let info = this.fmtInfo()
      this.$emit('getInfo', info)
    },
    fmtInfo () {
      let valueArr = [...this.valueArr]
      let treeArr = [...this.list]
      let provArr = this.deepLoop(valueArr, treeArr, [])
      return provArr
    },
    deepLoop (valueArr, treeArr, provArr) {
      if (valueArr.length) {
        treeArr.forEach(item => {
          if (item.id === valueArr[0]) {
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
    }
  }
}
</script>
