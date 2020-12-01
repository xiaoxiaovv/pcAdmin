<template>
  <div class="app-container" v-loading="loading">
    <!--卡片-->
    <div class="header_bar">
      <!--左边-->
      <div class="header_left">
        <!--左上-->
        <div class="header_left_top">
          <el-card class="box-card ">
            <div class="text item totalData">

              <!--<div class="total_item" >-->
              <!--<p class="total_title">运营商总数</p>-->
              <!--<p class="total_num"></p>-->
              <!--</div>-->

              <!--<div class="column_line"></div>-->
              <template v-if="userType=='1'">
                <div class="total_item">
                  <p class="total_title">运营商总数</p>
                  <p class="total_num">{{cardData[0]}}</p>
                </div>

                <div class="column_line"></div>

                <div class="total_item">
                  <p class="total_title">今日新增运营商</p>
                  <p class="total_num">{{cardData[1]}}</p>
                </div>

                <div class="column_line"></div>

                <div class="total_item">
                  <p class="total_title">商户总数</p>
                  <p class="total_num">{{cardData[2]}}</p>
                </div>

                <div class="column_line"></div>

                <div class="total_item">
                  <p class="total_title">今日新增商户</p>
                  <p class="total_num">{{cardData[3]}}</p>
                </div>
              </template>
              <template v-if="userType=='2'">
                <div class="total_item">
                  <p class="total_title">渠道商总数</p>
                  <p class="total_num">{{cardData[0]}}</p>
                </div>

                <div class="column_line"></div>

                <div class="total_item">
                  <p class="total_title">商户总数</p>
                  <p class="total_num">{{cardData[1]}}</p>
                </div>

                <div class="column_line"></div>

                <div class="total_item">
                  <p class="total_title">今日订单数</p>
                  <p class="total_num">{{cardData[2]}}</p>
                </div>

                <div class="column_line"></div>

                <div class="total_item">
                  <p class="total_title">今日流水</p>
                  <p class="total_num">{{cardData[3]}}</p>
                </div>
              </template>
              <template v-if="userType=='3'">
                <div class="total_item">
                  <p class="total_title">商户总数</p>
                  <p class="total_num">{{cardData[0]}}</p>
                </div>

                <div class="column_line"></div>

                <div class="total_item">
                  <p class="total_title">今日订单统计</p>
                  <p class="total_num">{{cardData[1]}}</p>
                </div>

                <div class="column_line"></div>

                <div class="total_item">
                  <p class="total_title">今日流水统计</p>
                  <p class="total_num">{{cardData[2]}}</p>
                </div>

                <div class="column_line"></div>

                <div class="total_item">
                  <p class="total_title">今日退款数</p>
                  <p class="total_num">{{cardData[3]}}</p>
                </div>
              </template>

            </div>
          </el-card>
        </div>
        <!--左下-->
        <div class="header_left_bottom">
          <div>
            <el-card class="box-card">
              <div class="text item tools_box">
                <div class="tools_img">
                  <img src="../../assets/images/index/发布.png" alt="">
                </div>
                <div class="tools_text">
                  <p>快速预览</p>
                  <p>公告通知</p>
                </div>
              </div>
            </el-card>
          </div>

          <div>
            <el-card class="box-card">
              <div class="text item tools_box">
                <div class="tools_img">
                  <img src="../../assets/images/index/快速新建.png" alt="">
                </div>
                <div class="tools_text">
                  <p>快速新建</p>
                  <p>新建渠道商</p>
                </div>
              </div>
            </el-card>
          </div>

          <div>
            <el-card class="box-card">
              <div class="text item tools_box">
                <div class="tools_img">
                  <img src="../../assets/images/index/物料下载.png" alt="">
                </div>
                <div class="tools_text">
                  <p>物料下载</p>
                  <p>&nbsp;</p>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <!--右边-->
      <div class="header_right">
        <!--公告-->
        <div class="public_news">
          <el-card class="box-card public_news_box">
            <div slot="header" class="clearfix">
              <span>最新公告</span>
              <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
            </div>
            <div class="list_scroll">
              <div v-for="o in 5" :key="o" class="text item ">
                {{'敬请期待 '}}
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!--数据卡片-->
    <div class="middle_chart">

      <el-card class="box-card chart_card">
        <div id="left_chart" class="chart_img"
             v-loading="leftDataNull"
             element-loading-text="没有数据"
             element-loading-spinner="el-icon-view"
             element-loading-background="rgba(255, 255, 255, 1)"></div>
      </el-card>

      <el-card class="box-card chart_card">
        <div id="right_chart" class="chart_img"
             v-loading="rightDataNull"
             element-loading-text="没有数据"
             element-loading-spinner="el-icon-view"
             element-loading-background="rgba(255, 255, 255, 1)"></div>
      </el-card>

    </div>
  </div>
</template>

<script>
// import {uploadFile} from '../file/api/upload'
import {getStatistics, getMerchantChart, getStaffChart} from './api/index.js'
// import richTextEditor from '@/components/richTextEditor'
// import Mixed from '@/components/charts/mixed'

export default {
  components: {},
  name: 'index',
  data () {
    return {
      loading: true, // 加载转圈
      userType: '',
      cardData: [],
      leftDataNull: true,
      rightDataNull: true

    }
  },
  mounted () {
    this.loading = false
    this.userType = sessionStorage.getItem('userType')
    this.getStatistics()
    this.getMerchantChart()
    this.getStaffChart()
    // this.drawData() //渲染图表
  },
  methods: {
    /**
       * 获取卡片数据
       */
    getStatistics: function () {
      let id = sessionStorage.getItem('companyId')
      getStatistics(id).then(res => {
        console.log(res)
        this.cardData = res.obj
      }).catch(e => {

      })
    },
    /**
       * 获取商户数量数据
       */
    getMerchantChart: function () {
      let id = sessionStorage.getItem('companyId')
      getMerchantChart(id).then(res => {
        console.log(res)
        this.drawLeftData(res.obj)
      }).catch(e => {

      })
    },
    /**
       * 获取员工业绩数据
       */
    getStaffChart: function () {
      let id = sessionStorage.getItem('companyId')
      getStaffChart(id).then(res => {
        console.log(res)
        let staff = []
        for (let i in res.obj) {
          staff.push(res.obj[i].name)
        }
        console.log(staff)

        this.drawRightData(res.obj, staff)
      }).catch(e => {

      })
    },

    drawLeftData: function (res) {
      var left_chart = this.$echarts.init(document.getElementById('left_chart'))
      // 定义图表
      this.leftDataNull = false
      left_chart.setOption({
        title: {text: '商户统计', textStyle: {color: '#333', fontWeight: 'lighter', fontSize: '16'}},
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} 家'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: res.xData
        }, // X轴标题
        legend: {
          data: ['全部', '当月新增']
        }, // 不同选项
        yAxis: {
          type: 'value'
        },
        series: [{
          data: res.total,
          name: '全部',
          type: 'line',
          areaStyle: {}
        },
        {
          data: res.month,
          name: '当月新增',
          type: 'line',
          areaStyle: {}
        }] // 数据数组，多个数据，legend需要对于标题name
      })
      this.loading = false
    },

    drawRightData: function (res, staff) {
      var right_chart = this.$echarts.init(document.getElementById('right_chart'))
      // 定义图表
      this.rightDataNull = false
      right_chart.setOption({
        title: {text: '业务员发展商户占比', textStyle: {color: '#333', fontWeight: 'lighter', fontSize: '16'}},
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} 家 (占{d}%)'
        },
        legend: {
          orient: 'vertical',
          top: '30',
          left: '0',
          data: staff
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              title: '保存图表'
            }
          },
          right: '20'
        },
        series: [
          {
            name: '发展商户数量及占比',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: res,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })

      this.loading = false
    }

  }
}
</script>

<style scoped>
  /*.title {*/
  /*text-align: center;*/
  /*}*/

  /*.action-container {*/
  /*margin-top: 10px;*/
  /*}*/

  /*.tinymce-container {*/
  /*position: relative;*/
  /*}*/

  /*!* 保证样式用于子组件 *!*/
  /*.tinymce-container >>> .mce-fullscreen {*/
  /*z-index: 10000;*/
  /*}*/

  /*.upload-image {*/
  /*position: absolute;*/
  /*top: 4px;*/
  /*right: 4px;*/
  /*}*/
  .header_bar {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .header_left {
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .header_left_top {
    width: 100%;
  }

  .header_right {
    width: 38%;
    margin-left: 2%;
  }

  /*数据简报*/
  .totalData {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .total_item {
    text-align: center;
  }

  .total_title {
    font-size: 14px;
    color: #808080;
  }

  .total_num {
    padding: 0;
    margin: 0;
    font-size: 32px;
    line-height: 40px;
  }

  .column_line {
    height: 60px;
    width: 1px;
    background-color: #c1c1c1;
  }

  /*小工具*/
  .header_left_bottom {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .header_left_bottom > div {
    width: 32%;
  }

  .tools_box {
    padding: 10px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .tools_img {
    width: 30%;
    text-align: left;
  }

  .tools_text {
    width: 70%;
    text-align: right;
  }

  .tools_text p {
    margin: 0;
    padding: 0;
    cursor: pointer;
  }

  .tools_text p:nth-child(1) {
    font-size: 16px;
    color: #4fa2ff;
  }

  .tools_text p:nth-child(2) {
    font-size: 14px;
    color: #888;
  }

  /*最新通告*/
  .public_news {
    height: 252px;
  }

  .public_news_box {
    height: 100%;
  }

  /*图表*/
  .middle_chart {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .chart_card {
    width: 49%;
  }

  .chart_img {
    width: 100%;
    height: 500px;
  }

  @media (max-width: 1248px) {
    .header_bar {
      flex-direction: column;
    }

    .header_left {
      width: 100%;
    }

    .header_right {
      width: 100%;
      margin: 20px 0 0 0;
    }
  }

  @media (max-width: 768px) {
    .totalData {
      flex-direction: column;
    }

    .column_line {
      width: 80px;
      height: 1px;
    }

    .header_left_bottom {
      flex-direction: column;
    }

    .header_left_bottom > div {
      width: 100%;
      margin-bottom: 10px;
    }

    .tools_img {
      display: none;
    }

    .tools_text {
      width: 100%;
      text-align: center;
    }

    .middle_chart {
      width: 100%;
      flex-direction: column;
    }

    .chart_card {
      width: 100%;
      margin-bottom: 20px;
    }
  }
</style>
