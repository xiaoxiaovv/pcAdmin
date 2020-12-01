<template>
  <div style="max-height: 60vh;overflow: auto;" ref="provAndCityRef">
    <div ref="provAndCityEles">
      <div class="prov-city" v-for="item in cityList" :key="item.name">
        <!--<div class="provlist-name">{{item.name}}</div>-->
        <!--<div class="citylist-name" v-for="itemSec in item.children" :key="itemSec.name">{{itemSec.name}}</div>-->
        <div class="citylist-name">{{item.cityName}}</div>
      </div>
      <div class="prov-city" v-if="!cityList.length" style="text-align: center;height: 60px;margin-top: 30px;">
        暂无数据
      </div>
    </div>
  </div>
</template>

<script>
import * as advertiseApi from '../../../api/advManage'
// import { tableMixin } from '@/mixins'
import pagination from '@/components/pagination/index'
export default {
  // mixins: [tableMixin],
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
      cityList: [
        /*
        {
          name: '福建省',
          children: [
            {
              name: '福州市1'
            },
            {
              name: '福州市2'
            },
            {
              name: '福州市3'
            },
            {
              name: '福州市4'
            },
            {
              name: '福州市5'
            },
            {
              name: '福州市6'
            },
            {
              name: '福州市7'
            },
            {
              name: '福州市8'
            },
            {
              name: '福州市9'
            },
            {
              name: '福州市10'
            },
            {
              name: '福州市11'
            },
            {
              name: '福州市12'
            }
          ]
        },
        {
          name: '福建省1',
          children: [
            {
              name: '福州市1'
            },
            {
              name: '福州市2'
            },
            {
              name: '福州市3'
            },
            {
              name: '福州市4'
            },
            {
              name: '福州市5'
            },
            {
              name: '福州市6'
            },
            {
              name: '福州市7'
            },
            {
              name: '福州市8'
            },
            {
              name: '福州市9'
            },
            {
              name: '福州市0'
            },
            {
              name: '福州市11'
            },
            {
              name: '福州市12'
            }
          ]
        }
        */
      ]
    }
  },
  watch: {
  },
  computed: {},
  created () {
    this.getCityList()
  },
  mounted () {
    // this.listenerScroll()
  },
  methods: {
    getCityList () {
      let params = {
        id: this.propsInfo.data.id
      }
      advertiseApi.advertiseCityList(params).then(res => {
        this.cityList = res.obj
      })
    },
    requestTableList () {
      // advertiseApi.advertiseCityList()
    },
    listenerScroll () {
      let refEle = this.$refs.provAndCityRef
      let bodyEle = this.$refs.provAndCityEles
      refEle.addEventListener('scroll', this.addEventListenerCall(refEle, bodyEle))
    },
    addEventListenerCall (refEle, bodyEle) {
      let bodyHeight = bodyEle.offsetHeight
      let height = refEle.offsetHeight
      let scrollPostion = refEle.scrollTop
      let scrollInfo = height + scrollPostion
      if (scrollInfo === bodyHeight) {
        // 请求分页
        console.log(123)
      }
    }
  },
  beforeDestroy () {
    let refEle = this.$refs.provAndCityRef
    let bodyEle = this.$refs.provAndCityEles
    refEle.removeEventListener('scroll', this.addEventListenerCall(refEle, bodyEle))
  }
}
</script>

<style scoped>
  .provlist-name{
    margin-top: 10px;
    line-height: 30px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }
  .citylist-name {
    margin-left: 50px;
    line-height: 26px;
    font-size: 14px;
    color: #666;
  }
</style>
