<template>
  <el-cascader v-model="valueArr"
               :placeholder="placeholder"
               :style="{width: width}"
               filterable
               clearable
               ref="cascaderTree"
               :props="propsInfo"
               :options="list"
               :size="size"
               :disabled="disabled"
               @change="change"
               @visible-change="visibleChange"></el-cascader>
</template>

<script>
import * as merchantApi from '../../api/merchant.js'
export default {
  name: 'aliLifeCascader',
  props: {
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    size: {
      type: String,
      default: 'small'
    },
    width: {
      type: String,
      default: '100%'
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
        this.getAliLifeCateTree(val)
      }
      this.valueArr = val
      this.getNewVal(this.list, val)
    }
  },
  created () {
    this.getAliLifeCateTree()
    /*
    this.valueArr = this.value
    if (this.valueArr && this.valueArr.length) {
      this.getAliLifeCateTree(this.valueArr)
    }
    */
  },
  data () {
    return {
      valueArr: [],
      list: []
    }
  },
  methods: {
    visibleChange (val) {
      if (this.list && this.list.length === 0) {
        this.getAliLifeCateTree()
      }
    },
    /**
     * 获取支付宝生活号类目树
     */
    getAliLifeCateTree (oldVal) {
      merchantApi.getAliLifeCateTree().then(res => {
        let arr = this.loopSet(res.obj, 0)
        this.list = arr
        if (oldVal && oldVal.length) {
          let val = this.getNewVal(arr, oldVal)
          this.$emit('input', val)
        }
      })
    },
    /**
     * 规避类目名称一致的情况
     * @param arr
     * @param idArr
     * @param id
     * @returns {*|Array}
     */
    getNewVal (arr, idArr, id) {
      id = id || []
      arr.forEach(item => {
        if (item.name === idArr[0]) {
          id.push(item.id)
          if (item.children && item.children.length) {
            idArr.splice(0, 1)
            id = this.getNewVal(item.children, idArr, id)
          }
        }
      })
      return id
    },
    loopSet (arr, index) {
      arr = arr || []
      let key = index
      arr.forEach(item => {
        key += 1
        let id = key + item.nodeName
        this.$set(item, 'id', id)
        this.$set(item, 'name', item.nodeName)
        if (item.childNode && item.childNode.length) {
          let childNode = this.loopSet(item.childNode, key)
          this.$set(item, 'children', childNode)
        } else {
          delete item.childNode
        }
      })
      return arr
    },
    change (val) {
      this.$emit('input', val)
    },
    getCheckedNodes () {
      let checkedNodes = this.$refs.cascaderTree.getCheckedNodes()
      return checkedNodes
    }
  }
}
</script>
