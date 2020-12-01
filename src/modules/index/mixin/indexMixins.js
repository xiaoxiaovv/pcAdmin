export default {
  data () {
    return {
      lists: {'code': 200, 'msg': 'success', 'obj': [{'payName': '微信', 'payMoney': 10}, {'payName': '支付宝', 'payMoney': 100}, {'payName': '银行卡', 'payMoney': 5}, {'payName': '会员卡', 'payMoney': 30}, {'payName': '未知', 'payMoney': 100}]}
    }
  },
  methods: {
    // 数据统计-绘制图表
    drawDataTotal (data) {
      let cxData = [] // x轴坐标
      let legendData = [] // 图例列表

      let series = []
      data[0].list.forEach(res => {
        let date = res.dateTime.split('-')
        cxData.push(date[1] + '-' + date[2])
      })
      data.forEach(res => {
        let countData = res.list.map(node => node.count)
        legendData.push(res.payName)
        series.push({
          data: countData,
          name: res.payName,
          smooth: true,
          type: 'line'
        })
      })
      let chart = this.$echarts.init(document.getElementById('dataStatistical'))
      this.adaptWindowResize(chart)
      let options = {
        color: ['#5FB870', '#56A2FD', '#FFAF2C', '#F04134', '#57636F'],
        // title: {text: '商户统计', textStyle: {color: '#333', fontWeight: 'lighter', fontSize: '16'}},
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          bottom: 0,
          data: legendData
        },
        grid: {
          left: '5%',
          containLabel: true
        },
        toolbox: {
          feature: {
            magicType: {
              type: ['line', 'bar'],
              title: {
                line: '切换为曲线图'
              }
            },
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#1493E9'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#2C393F',
            fontSize: 16
          },
          data: cxData
        }, // X轴标题
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#1493E9'
            }
          },
          axisLabel: {
            color: '#2C393F',
            fontSize: 14
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        series: series // 数据数组，多个数据，legend需要对于标题name
      }
      chart.setOption(options)
    },
    // 支付通道占比-绘制图表
    drawPayPercent: function (datas, type) {
      let title = []
      let dataList = []
      datas.forEach(res => {
        let obj = {
          name: res.payName,
          value: res.payMoney
        }
        title.push(obj)
        dataList.push(obj)
      })
      var chart = this.$echarts.init(document.getElementById('payPercent'))
      this.adaptWindowResize(chart)
      let options = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        color: ['#5FB870', '#56A2FD', '#FFAF2C', '#F04134', '#57636F'],
        // color: ['#56A2FD', '#5FB870', '#FFAF2C', '#F04134', '#57636F'],
        // 蓝色 绿色 橙色 红色 灰色
        legend: {
          bottom: 0,
          itemWidth: 10,
          itemHeight: 10,
          borderRadius: 10,
          icon: 'circle',
          formatter: function (name) {
            let data = title
            let total = 0
            let target

            for (let i = 0; i < data.length; i++) {
              total += data[i].value
              if (data[i].name === name) {
                target = data[i].value
              }
            }
            let percent = '0.00%'
            if (total !== 0 && target !== 0) {
              percent = ((target / total) * 100).toFixed(2) + '%'
            }
            let str = '{a|' + name + '：' + '}' + '{b|' + percent + ' | ' + target + '}'
            return str
          },
          textStyle: {
            fontSize: 14,
            color: '#57636F',
            rich: {
              a: {
                color: '#2C393F'
              },
              b: {
                color: '#57636F'
              }
            }
          },

          data: title
        },
        series: [
          {
            name: '支付方式',
            type: 'pie',
            radius: ['20%', '40%'],
            label: {
              fontSize: 14,
              formatter: '{b}: ￥{c}'
            },
            data: dataList
          }
        ]
      }
      if (type === 1) {
        options.series[0].label.formatter = '{b}: ￥{c}'
      } else {
        options.series[0].label.formatter = '{b}: {c}'
      }
      if (this.userType == 2 || this.userType == 3) {
        options.tooltip.formatter = '{b}: {c} ({d}%)'
        options.series[0].label.formatter = '{b}: {c}'
      }
      chart.setOption(options)
    }
  }
}
