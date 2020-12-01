<template>
  <el-cascader v-model="valueArr"
               :placeholder="placeholder"
               filterable
               clearable
               :props="propsInfo"
               :options="provList"
               :size="size"
               @change="change"
               @visible-change="visibleChange"></el-cascader>
</template>

<script>
import * as commonApi from '@/api/common'
import * as utilsCollect from '@/utils/utilsCollect'
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
      default: '请选择地址'
    },
    size: {
      type: String,
      default: 'small'
    },
    level: {
      type: Number,
      default: 3 // 1省 2省市 3省市区
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
      if (val && this.provList.length === 0) {
        this.getProvieTree()
      }
      this.valueArr = val
    }
  },
  created () {
    this.valueArr = this.value
    if (this.value && this.provList.length === 0) {
      this.getProvieTree()
    }
  },
  data () {
    return {
      valueArr: [],
      provList: []
    }
  },
  methods: {
    visibleChange (val) {
      if (val && this.provList.length === 0) {
        this.getProvieTree()
      }
    },
    /**
     * 获取省市区树
     */
    getProvieTree () {
      let params = {
        level: this.level
      }
      commonApi.getProviceTree(params).then(res => {
        let newArr = utilsCollect.sortArrayByKeyDeep(res.obj, 1)
        this.provList = newArr
        if (this.level === 1) {
          this.provList.forEach(item => {
            delete item.children
            return item
          })
        } else if (this.level === 2) {
          this.provList.forEach(item => {
            return item.children.forEach(itemSec => {
              delete itemSec.children
              return itemSec
            })
          })
        }
      })
    },
    change (val) {
      console.log(val)
      this.$emit('input', val)
      this.getDetailInfo()
    },
    getDetailInfo () {
      let proviceInfo = this.fmtInfo()
      this.$emit('getProviceInfo', proviceInfo)
    },
    fmtInfo () {
      let valueArr = [...this.valueArr]
      let treeArr = [...this.provList]
      let provArr = this.deepLoop(valueArr, treeArr, [])
      return provArr
    },
    deepLoop (valueArr, treeArr, provArr) {
      if (valueArr.length) {
        treeArr.forEach(item => {
          if (item.id === valueArr[0]) {
            let params = Object.assign({}, item)
            delete params.children
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
