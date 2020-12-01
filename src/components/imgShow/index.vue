<template>
  <div class="vm-imgview">
    <!--图片预览-->
    <div class="vm-img-view">
      <div class="vm-img-view-show" :style="{backgroundImage: 'url(\''+ imgBg +'\')'}">
        <div class="vm-img-view-show-view" v-if="this.needView !== 3 && url">
          <div class="vm-flex vm-align-justify-center">
            <i class="el-icon-view" @click="viewImg(imgPixelHigth)" v-if="this.needView === 1 || this.needView === 2"></i>
            <i class="el-icon-close" @click="deleteImg(url)" v-if="this.needView === 2"></i>
          </div>
        </div>
      </div>
    </div>
    <!--图片预览-->
    <ImgView :propImgView="dialogImgViewData" v-if="dialogImgViewData.show"></ImgView>
  </div>
</template>

<script>
import * as imgFuncs from '@/utils/getImgUrl.js'
import ImgView from '@/components/imgView/index'
export default {
  name: 'imgView',
  components: {
    ImgView
  },
  props: {
    url: {
      type: [String, Number],
      default: '' // 图片id 或图片url
    },
    urlType: {
      type: Number,
      default: 1 // 1--id类型，2--完整链接
    },
    imgPixel: {
      type: Number,
      default: 1 // 1--普通，2--高像素
    },
    needView: {
      type: Number,
      default: 1 // 1--可以预览，2--可以预览，删除，3--不能预览与删除，4--不能预览，可以删除
    }
  },
  created () {},
  data () {
    return {
      // 图片预览
      dialogImgViewData: {}
    }
  },
  computed: {
    /**
     *背景图
     * */
    imgBg () {
      let url = ''
      if (this.urlType === 2) {
        url = this.url
      } else {
        url = imgFuncs.getImg(this.url, this.imgPixel)
      }
      return url
    },
    /**
     * 预览图
     * */
    imgPixelHigth () {
      let url = ''
      if (this.urlType === 2) {
        url = this.url
      } else {
        url = imgFuncs.getImg(this.url, 2)
      }
      return url
    }
  },
  methods: {
    /**
     * 图片预览
     * @param item
     */
    viewImg (item) {
      this.dialogImgViewData = {
        show: true,
        url: item
      }
    },
    /**
     * 删除预览
     */
    deleteImg (url) {
      this.$emit('delImg', url)
    }
  }
}
</script>
