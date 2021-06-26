<template>
  <div class="app-container">
    <div slot="header" class="clearfix">
      <span>资料详情</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="goback()">返回</el-button>
    </div>
    <div>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>身份信息</span>
        </div>
        <div>
          <table>
            <tr>
              <td>支付宝id</td>
              <td>{{userInfo.userId || '暂无'}}</td>
            </tr>
            <tr>
              <td>法人/经营者身份证正面</td>
              <td>
                <ImgShow :url="userInfo.certificates[0].substring(userInfo.certificates[0].length-19,userInfo.certificates[0].length)" v-if="userInfo.certificates[0]"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>法人/经营者身份证反面</td>
              <td>
                <ImgShow :url="userInfo.certificates[1].substring(userInfo.certificates[1].length-19,userInfo.certificates[1].length)" v-if="userInfo.certificates[1]"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
            <tr>
              <td>商户手持证件照</td>
              <td>
                <ImgShow :url="userInfo.certificates[2].substring(userInfo.certificates[2].length-19,userInfo.certificates[2].length)" v-if="userInfo.certificates[2]"></ImgShow>
                <span v-else>暂无</span>
              </td>
            </tr>
          </table>
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>银行卡信息</span>
        </div>
        <div>
          <table>
            <tr>
              <td>银行卡照片</td>
              <td v-for="(item, index) in userInfo.bank">
                <ImgShow :url="item.substring(item.length-19,item.length)" v-if="item"></ImgShow>
              </td>
            </tr>
          </table>
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>门店信息</span>
        </div>
        <div>
          <table>
            <tr>
              <td>门店名称</td>
              <td>{{userInfo.shopInfo.shopName || '暂无'}}</td>
            </tr>
            <tr>
              <td>门店地址</td>
              <td>{{userInfo.shopInfo.shopAddres || '暂无'}}</td>
            </tr>
            <tr>
              <td>门店类型</td>
              <td>{{userInfo.shopInfo.shopType || '暂无'}}</td>
            </tr>
            <tr>
              <td>商户品类</td>
              <td>{{userInfo.shopInfo.shopCategory || '暂无'}}</td>
            </tr>
            <tr>
              <td>店铺照片</td>
              <td v-for="(item, index) in userInfo.shopInfo.shopImg">
                <ImgShow :url="item.substring(item.length-19,item.length)" v-if="item"></ImgShow>
              </td>
            </tr>
          </table>
        </div>
      </el-card>



    </div>
  </div>
</template>

<script>
  import ImgShow from '@/components/imgShow/index'
  export default {
    name: 'ruyiUserDetail',
    components: {
      ImgShow
    },
    data() {
      return {
        userInfo: { //商户资料数据

        },
      }
    },
    created() {
      let data = this.$route.query.data; // 接收信息
      let shopData = ["门店-个人","门店-个体", "门店-企业"];
      let shopTypeData = ["超市便利店", "美容行业", "购物商城", "汽车行业", "生活服务", "教育培训", "医疗健康", "航旅", "专业销售/批发", "政府/社会组织", "餐饮美食",
        "宗教组织", "网吧/KTV/酒吧/休闲娱乐"
      ];
      data['shopInfo']['shopType'] = shopData[data['shopInfo']['shopType']]
      data['shopInfo']['shopCategory'] = shopTypeData[data['shopInfo']['shopCategory']]
      this.userInfo = data
      if (!this.userInfo) {
        this.$message.warning('详情信息错误，请重试')
        return
      }
    },
    mounted() {

    },
    methods: {
      //返回上一页
      goback: function() {
        this.$router.go('-1')
      },
    },
    filters: {

    }
  }
</script>

<style scoped>
  .box-card {
    margin-bottom: 20px;
  }

  table>tr {
    height: 60px;
    font-size: 14px;
  }

  table>tr>td:nth-child(1) {
    color: #808080;
    width: 200px;
    text-align: right;
    padding: 0 20px 0 0;
  }

  table>tr>td:nth-child(1):after {
    content: '：';
  }

  table>tr>td:nth-child(2) {
    color: #5b5b5b;
    letter-spacing: 1px;
  }
</style>
