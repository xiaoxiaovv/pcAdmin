<template>
  <div>
    <el-form  ref="validateForm" label-width="180px" @submit.native.prevent>
      <div style="max-height: 60vh; overflow-y: auto">
        <template v-for="(item, index) in tableData">
          <el-form-item :label="item.label" :key="index" required>
            <el-input v-model="item.configValue" :type="item.configKey === 'minicode_ext_json' ? 'textarea':''" :rows="6"></el-input>
          </el-form-item>
        </template>
        <el-form-item>
        </el-form-item>
      </div>
      <div class="vm-text-right" style="padding-top: 20px;">
        <el-button size="medium" @click="propsInfo.show = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="submitInfo('validateForm')">确 定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import * as toolApi from '../../api/tool'
import ImgUpload from '@/components/imgUpload/index'
export default {
  mixins: [],
  components: {
    ImgUpload
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
      tableData: [],
      params: {

      },
      rules: {}
    }
  },
  watch: {},
  computed: {},
  created () {
    this.getList()
  },
  methods: {
    getList () {
      toolApi.getWechatConfigList().then(res => {
        res.obj.forEach(item => {
          let label = this.showLabel(item.configKey)
          this.$set(item, 'label', label)
        })
        this.tableData = res.obj
      })
    },
    showLabel (val) {
      switch (val) {
        case 'minicode_template_id':
          return '代码模板id'
        case 'minicode_ext_json':
          return 'ext.json文件内容'
        case 'minicode_user_version':
          return '小程序版本'
        case 'minicode_user_desc':
          return '小程序描述'
        case 'minicode_item_list':
          return '小程序页面配置'
        case 'minicode_requestdomain':
          return '小程序request域名'
        case 'minicode_wsrequestdomain':
          return '小程序socket域名'
        case 'minicode_uploaddomain':
          return '小程序uploadFile域名'
        case 'minicode_downloaddomain':
          return '小程序downloadFile域名'
        case 'minicode_webviewdomain':
          return '小程序web域名'
      }
    },
    submitInfo () {
      let array = [...this.tableData]
      let msg = ''
      for (let i = 0; i < array.length; i++) {
        if (array[i].configValue === '' || array[i].configValue === undefined || array[i].configValue === null) {
          msg = '请输入' + this.showLabel(array[i].configKey)
          break
        }
      }
      if (msg) {
        this.$message.warning(msg)
      } else {
        array.forEach(item => {
          delete item.label
        })
        toolApi.saveWechatConfigList(array).then(res => {
          this.$message.success(res.msg)
          this.propsInfo.show = false
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .ellplist2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
