<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title"
                       label="商户名称">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination ref="page"
                :total-elements="totalElements"
                :layout="'total, prev, pager, next'"
                :pageSizes="pageSizes"
                :change-callback="getTableList" ></pagination>
  </div>
</template>

<script>
import {} from '../../../api/advManage'
import { tableMixin } from '@/mixins'
import pagination from '@/components/pagination/index'
export default {
  mixins: [tableMixin],
  components: {
    pagination
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
      pageSizes: [50],
      timeZone: null,
      params: {
        beginTime: ''
      },
      totalElements: 0,
      tableData: [
        {}
      ]
    }
  },
  watch: {
    'timeZone' (val) {
      val = val || []
      this.params.beginTime = val[0] || ''
      this.params.endTime = val[val.length - 1] || ''
    }
  },
  computed: {},
  created () {
  },
  methods: {
    requestTableList () {}
  }
}
</script>

<style scoped>
</style>
