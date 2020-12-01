<template>
  <div>
    <el-table :data="tableData"
              style="width: 100%; overflow-y: auto;"
              row-key="id"
              ref="multipleTable"
              max-height="400"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       fixed
                       width="55">
      </el-table-column>
      <el-table-column label="下级名称">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right; padding-top: 20px;padding-right: 20px;">
      <span slot="footer" class="dialog-footer">
        <el-button @click="propsInfo.show = false">取 消</el-button>
        <el-button type="primary" @click="saveNextLevelCripte">确 定</el-button>
      </span>
    </div>
  </div>
</template>

<script>
import * as roleApi from '../../api/role'
export default {
  mixins: [],
  components: {},
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
      params: {
        id: '',
        type: ''
      },
      tableData: [],
      setStatus: false // 用于规避第一次初始化
    }
  },
  watch: {
  },
  computed: {
  },
  created () {
    this.params.id = this.propsInfo.data.id
    this.params.type = this.propsInfo.data.type
    this.getNextlevelList()
  },
  methods: {
    getNextlevelList () {
      roleApi.getNextLevelLisst(this.params).then(res => {
        this.tableData = res.obj
        this.$nextTick(() => {
          res.obj.forEach(item => {
            if (item.status === 1) {
              this.$refs.multipleTable.toggleRowSelection(item)
            }
          })
          this.setStatus = true
        })
      })
    },
    /**
     * 表格左侧选择
     */
    handleSelectionChange (val) {
      if (!this.setStatus) {
        return
      }
      this.tableData.forEach(item => {
        let status = 0
        if (val.indexOf(item) > -1) {
          status = 1
        }
        this.$set(item, 'status', status)
      })
    },
    /**
     * 保存权限
     */
    saveNextLevelCripte () {
      let params = {
        id: this.params.id,
        list: this.tableData
      }
      roleApi.saveNextLevelList(params).then(res => {
        this.$message.success('保存成功')
        this.propsInfo.show = false
      })
    }
  }
}
</script>
