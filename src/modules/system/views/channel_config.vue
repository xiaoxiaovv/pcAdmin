<template>
  <div class="app-container">
      <div style="margin-top: 20px">
          <el-checkbox-group class="check-content" v-model="checkboxGroup" size="medium" @change="checkboxChange">
            <el-checkbox class="check-item" :label="1" border>官方</el-checkbox>
            <el-checkbox class="check-item" :label="6" border>富友</el-checkbox>
            <el-checkbox class="check-item" :label="7" border>随行付</el-checkbox>
            <el-checkbox class="check-item" :label="9" border>威富通</el-checkbox>
            <el-checkbox class="check-item" :label="10" border>乐刷</el-checkbox>
            <el-checkbox class="check-item" :label="11" border>传化</el-checkbox>
            <el-checkbox class="check-item" :label="12" border>天阙随行付</el-checkbox>
            <el-checkbox class="check-item" :label="13" border>易生</el-checkbox>
            <el-checkbox class="check-item" :label="14" border>拉卡拉</el-checkbox>
            <el-checkbox class="check-item" :label="17" border>手机pos</el-checkbox>
            <el-checkbox class="check-item" :label="19" border>开店宝</el-checkbox>
            <el-checkbox class="check-item" :label="20" border>畅捷支付</el-checkbox>
            <el-checkbox class="check-item" :label="21" border>敏付</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="btn-box">
          <el-button type="primary" @click="setChanelCofig">提交</el-button>
        </div>
  </div>
</template>

<script>
import { getChanelCofig, setChanelCofig } from '@/modules/system/api/role'
export default {
  name: 'role',
  components: {},
  data () {
    return {
        checkboxGroup: [],
    }
  },
  mounted () {
      this.getChanelCofig()
  },
  created () {

  },
  methods: {
      checkboxChange(e){
        console.log(e)
        this.checkboxGroup = e
      },
      getChanelCofig() {
        getChanelCofig().then(res => {
            if(res.code === 200) {
              this.checkboxGroup = JSON.parse(res.msg)
            }
        })
      },
      setChanelCofig() {
        const params = {
          configVal: this.checkboxGroup.join(',')
        }
        setChanelCofig(params).then(res => {
            if(res.code === 200) {
              this.$message.success('设置成功！')
              this.getChanelCofig()
            }
        })
      },
  }
}
</script>
<style scoped>
.check-content {
  padding: 10px;

}
.check-item {
  width: 150px;
  height: 100px!important;
  line-height: 90px!important;
  text-align: center;
  margin-bottom: 20px;
  margin-left: 0!important;
}
.btn-box {
  width: fit-content;
  margin: 30px auto;
}
</style>
