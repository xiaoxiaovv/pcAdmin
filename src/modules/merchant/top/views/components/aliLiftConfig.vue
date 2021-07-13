<template>
  <div>
    <el-tabs v-model="activeName" style="margin: 0 30px;">
      <el-tab-pane label="生活号申请" name="first"></el-tab-pane>
      <el-tab-pane label="生活号配置" name="second"></el-tab-pane>
    </el-tabs>
    <!--生活号申请-->
    <AliLifeApply v-show="activeName === 'first'" :propsInfo="propsInfo"></AliLifeApply>
    <!--生活号配置-->
    <AliLifeConfig v-show="activeName === 'second'" :propsInfo="propsInfo" v-if="loadingFirst"></AliLifeConfig>
  </div>
</template>

<script>
import AliLifeApply from './aliLiftNumApply.vue'
import AliLifeConfig from './aliLiftNumConfig.vue'

export default {
  detailExportExcels: {
    AliLifeApply,
    AliLifeConfig
  },
  props: {
    propsInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      loadingFirst: false,
      activeName: 'first'
    }
  },
  watch: {
    'activeName' (val, oldVal) {
      if (val === 'second') {
        if (!this.loadingFirst) {
          this.loadingFirst = true
        }
      }
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
  }
}
</script>
<style scoped>
</style>
