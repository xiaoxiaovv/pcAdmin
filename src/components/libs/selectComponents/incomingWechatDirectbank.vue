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
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  methods: {
    getDataFn () {
      return incomingApi.getdirectbank().then(data => (data.obj || []).map(v => this.convertData(v, v, v)))
    }
  }
}
</script>
