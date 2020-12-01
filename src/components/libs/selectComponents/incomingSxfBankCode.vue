<template>
  <lazy-select v-model="modelValue"
               :getDataFnOrDataList="getDataFn"
               :options="mergedOptions"
               ref="lazySelect" />
</template>

<script>
import lazySelectMixin from './mixin'
import * as incomingApi from '@/modules/pay/api/incoming'
export default {
  mixins: [lazySelectMixin],
  methods: {
    getDataFn () {
      return incomingApi.findBankCode().then(data => (data.obj || []).map(v => this.convertData(v.bnkCode, v.bnkName, v)))
    }
  }
}
</script>
