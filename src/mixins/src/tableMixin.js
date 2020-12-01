export default {
  data () {
    return {
      params: {
        pageNumber: 1,
        pageSize: 10
      },
      paramsSpecial: {},
      date: '',
      tableData: {},
      formLabelWidth: '136px',
      createNotGetTableList: false
    }
  },
  computed: {
    // 是否显示分页，提取公共（逻辑可能发生变化）
    totalComputed () {
      let isShow = this.tableData.total > 0
      return isShow
    }
  },
  created () {
    if (!this.createNotGetTableList) {
      this.getTableList()
    }
  },
  methods: {
    async getTableList (pageNum, pageSize, type) {
      if (typeof pageNum === 'number') {
        this.params.pageNumber = pageNum
      }
      if (typeof pageSize === 'number') {
        this.params.pageSize = pageSize
      }
      await this.requestTableList(type)
      if (this.totalElements > 0 && this.params.pageNumber > 1 && this.tableData.length === 0) {
        this.getTableList(1)
      }
    },
    // 日期格式转换
    dateChange (val, begin, end) {
      // val在调用的时候，使用$event 代表第一个参数
      // https://blog.csdn.net/dangbai01_/article/details/83864498
      let beginTime = begin || 'beginTime'
      let endTime = end || 'endTime'
      if (!val) {
        this.params[beginTime] = ''
        this.params[endTime] = ''
      } else {
        this.params[beginTime] = new Date(val[0]).getTime()
        this.params[endTime] = new Date(val[1]).getTime()
      }
    },
    // 日期格式转换
    dateValChange (val) {
      let dateArr = val || []
      this.params.beginTime = dateArr[0] || ''
      this.params.endTime = dateArr[1] || ''
    },
    // 删除提示
    handleClose (id) {
      this.$confirm('是否确定删除？', '提示')
        .then(_ => {
          this.deleteCallback(id)
        })
        .catch(_ => {})
    },
    /**
     * 表格左侧选择--清除
     */
    clearSelection (refsName) {
      const table = refsName ? this.$refs[refsName] : this.getTableRef()
      table.clearSelection()
    },
    // 重置
    resetCallback () {
      this.beforeResetCallback()
      for (let key in this.params) {
        if (!(key === 'pageNumber' || key === 'pageSize')) {
          this.params[key] = ''
        }
      }
      this.params = Object.assign({}, this.params, this.getParamsSpecial())
      this.getTableList(1, this.params.pageSize)
      this.date = null
    },
    // 初始化前，可更改查看参数
    beforeResetCallback () {},
    // 获取初始值
    getParamsSpecial () {
      return this.paramsSpecial
    },
    /**
     * 获取表格选中列的id数组
     * @returns
     */
    getTableSelection () {
      let table = this.getTableRef()
      if (table) {
        return table.selection
      }
      return []
    },
    /**
     * 获取table组件的引用
     */
    getTableRef () {
      return this.$refs.table || this.$refs.multipleTable
    },
    // 点击搜索
    search (pageNumber = 1, size) {
      pageNumber = 1
      this.params.pageNumber = 1
      if (!size) {
        size = this.params.pageSize
      }
      // this.clearSelection()
      this.$refs.page.search ()
      // this.getTableList(pageNumber, size)
    }
  }
}
