<template>
  <div class="app-container">
      <div style="margin-top: 20px">
          <el-checkbox-group class="check-content" v-model="checkboxGroup" size="medium" @change="checkboxChange">
            <el-checkbox class="check-item check-item-1" :label="1" border>官方</el-checkbox>
            <el-checkbox class="check-item check-item-2" :label="6" border>富友</el-checkbox>
            <el-checkbox class="check-item check-item-3" :label="7" border>随行付</el-checkbox>
            <el-checkbox class="check-item check-item-4" :label="9" border>银盛</el-checkbox>
            <el-checkbox class="check-item check-item-5" :label="10" border>乐刷</el-checkbox>
            <el-checkbox class="check-item check-item-6" :label="11" border>传化</el-checkbox>
            <el-checkbox class="check-item check-item-7" :label="12" border>天阙随行付</el-checkbox>
            <el-checkbox class="check-item check-item-8" :label="13" border>易生</el-checkbox>
            <el-checkbox class="check-item check-item-9" :label="16" border>拉卡拉</el-checkbox>
            <el-checkbox class="check-item check-item-10" :label="17" border>手机pos</el-checkbox>
            <el-checkbox class="check-item check-item-11" :label="19" border>开店宝</el-checkbox>
            <el-checkbox class="check-item check-item-12" :label="20" border>畅捷支付</el-checkbox>
            <el-checkbox class="check-item check-item-13" :label="21" border>敏付</el-checkbox>
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
  height: 150px!important;
  line-height: 200px!important;
  text-align: center;
  margin-bottom: 20px;
  margin-left: 0!important;
  background-repeat: no-repeat;
  background-position: center 20px;
  background-size: 85% 40%;
}
.el-checkbox.is-bordered.is-checked {
  border-width: 2px;
  box-shadow: 0px 0px 6px 6px rgba(62,189,255,0.3);
  background-color: #f2f6fc;
}
.check-item-1 {
  background-image: url(../../../assets/images/manager/transfer.png);
}
.check-item-2 {
  background-image: url(../../../assets/images/nav/fuyou.png);
}
.check-item-3 {
  background-image: url(../../../assets/images/nav/suixingfu.png);
}
.check-item-4 {
  background-image: url(../../../assets/images/nav/ysjt.png);
}
.check-item-5 {
  background-image: url(../../../assets/images/nav/lechua.png);
}
.check-item-6 {
  background-image: url(../../../assets/images/nav/chuanhua.jpg);
}
.check-item-7 {
  background-image: url(../../../assets/images/nav/tianque.png);
}
.check-item-8 {
  background-image: url(../../../assets/images/nav/yisheng.jpg);
}
.check-item-9 {
  background-image: url(../../../assets/images/nav/lakala.png);
}
.check-item-10 {
  background-image: url(../../../assets/images/manager/transfer.png);
}
.check-item-11 {
  background-image: url(../../../assets/images/nav/kaidianbao.png);
}
.check-item-12 {
  background-image: url(../../../assets/images/nav/changjie.png);
}
.check-item-13 {
  background-image: url(../../../assets/images/nav/minfu.png);
}
.btn-box {
  width: fit-content;
  margin: 30px auto;
}
</style>
