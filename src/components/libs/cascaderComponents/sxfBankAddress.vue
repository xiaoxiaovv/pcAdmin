<template>
  <lazy-cascader v-model="modelValue"
                 filterable
                 :getDataFnOrDataList="getDataFn"
                 :options="mergedOptions"
                 @active-item-change="onActiveItemChange"
                 @initial="initial"
                 @change="change"
                 ref="lazyCascader" />
</template>

<script>
import lazyCascaderMixin from './mixin'
import * as incomingApi from '@/modules/pay/api/incoming'
export default {
  mixins: [lazyCascaderMixin],
  methods: {
    getDataFn () {
      return new Promise(resolve => {
        resolve(this.getDepartmentList())
      })
    },
    async getDepartmentList () {
      let arr = []
      await incomingApi.findBankAreaTree().then(data => {
        console.log(data)
        data = this.initLabel(data)
        arr = (data || []).map(v => this.convertData(v.id, v.name, v))
      })
      return arr
    },
    initLabel (data) {
      data.obj.forEach(item => {
        this.$set(item, 'id', item.provinceCode)
        this.$set(item, 'name', item.provinceName)
        item.list.forEach(itemSec => {
          this.$set(itemSec, 'id', itemSec.cityCode)
          this.$set(itemSec, 'name', itemSec.cityName)
        })
        this.$set(item, 'children', item.list)
      })
      return data.obj
    },
    onActiveItemChange (data, list, resolve) {
    },
    change () {
      this.$emit('change')
    },
    getDetailInfo () {
      let info = this.fmtInfo()
      this.$emit('getInfo', info)
    },
    fmtInfo () {
      let valueArr = [...this.value]
      let treeArr = [...this.$children[0].optionList]
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
    }
  }
}
</script>
