<template>
  <div class="card_box">
    <!--第一行 卡片-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="name_title">{{operaDetail.name}}</span>
        <el-button style="float: right;font-size: 16px" type="text" @click="goBack"><i class="el-icon-back"></i> 返回列表
        </el-button>
      </div>
      <!--卡片内容-->
      <div>
        <table width="100%" class="info_table">
          <tbody>
          <tr>
            <td class="tb_title">上级代理</td>   <!--标题-->
            <td class="tb_text">{{operaDetail.companyName}}</td>  <!--内容-->
            <td class="tb_title">联系人</td>   <!--标题-->
            <td class="tb_text">{{operaDetail.contact}}</td>  <!--内容-->
            <td class="tb_title">到期时间</td>   <!--标题-->
            <td class="tb_text">{{operaDetail.endCooperaTime}}</td>  <!--内容-->
          </tr>
          <tr>
            <td class="tb_title">归属业务员</td>   <!--标题-->
            <td class="tb_text">{{operaDetail.managerName}}</td>  <!--内容-->
            <td class="tb_title">手机号</td>   <!--标题-->
            <td class="tb_text">{{operaDetail.phone}}</td>  <!--内容-->
            <td class="tb_title">创建时间</td>   <!--标题-->
            <td class="tb_text">{{operaDetail.createTime}}</td>  <!--内容-->
          </tr>
          <tr>
            <td class="tb_title">经营类别</td>   <!--标题-->
            <td class="tb_text">{{operaDetail.businessLevOne}}→{{operaDetail.businessLevTwo}}→{{operaDetail.businessLevThree}}</td>  <!--内容-->
            <td class="tb_title">联系地址</td>   <!--标题-->
            <td class="tb_text">{{operaDetail.provinceName}}→{{operaDetail.cityName}}→{{operaDetail.address}}</td>  <!--内容-->
          </tr>
          </tbody>
        </table>
      </div>
    </el-card>

  </div>
</template>

<script>
import {getMerchantDetail} from '../api/merchant'
import pagination from '@/components/pagination/index'
import { levelAliasMixin } from '@/mixins'
export default {
  name: 'operaDetail',
  mixins: [levelAliasMixin],
  components: {pagination},
  data () {
    return {
      operaDetail: {} // {{levelAlias.secondName}}详情
    }
  },
  created () {

  },
  mounted () {
    console.log(this.$route.query.id)
    this.id = this.$route.query.id // 接收ID
    // 获取本{{levelAlias.firstName}}详情
    this.getMerchantDetail(this.id)
  },
  methods: {
    goBack: function () {
      this.$router.go('-1')
    },

    // 获取{{levelAlias.firstName}}信息
    getMerchantDetail: function (id) {
      // 用vue router获取URL数据
      // 然后用getMerchantDetail获取这个{{levelAlias.firstName}}的数据
      getMerchantDetail(id).then(res => {
        this.operaDetail = res.obj
      }).catch(e => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .card_box {
    padding: 0 20px;
  }

  .name_title {
    font-size: 32px;
  }

  .tb_title {
    font-weight: bold;
    width: 10%;
  }

  .tb_text {
    width: 20%;
    font-weight: lighter;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .info_table tbody tr {
    height: 35px;
    font-size: 14px;
  }
</style>
