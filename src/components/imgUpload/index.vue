<template>
  <div style="position: relative;">
    <!--图片选择-->
    <el-upload class="vm-img-uploader"
               :action="url"
               :data="filesData"
               name="files"
               :show-file-list="false"
               :on-success="mactbgUpload"
               :on-error="handleImageFailed"
               :before-upload="beforeLogoUpload"
               :headers="headers">
      <i class="el-icon-plus vm-img-uploader-icon"></i>
    </el-upload>
    <div class="vm-img-uploader vm-img-uploader-img"  v-show="value">
      <div class="vm-img-uploader-show" :style="{backgroundImage: 'url(\''+ imgBg +'\')'}" @click="viewImg(imgPixelHigth)">
        <!--
        <div class="vm-img-uploader-view">
          <div class="vm-flex vm-align-justify-center ">
            <i class="el-icon-view" @click="viewImg(imgPixelHigth)"></i>
            <i class="el-icon-close" @click="delImg"></i>
          </div>
        </div>
        -->
      </div>
      <i class="el-icon-error upload-close-icon" @click="delImg" v-if="delPower"></i>
    </div>
    <!--图片预览-->
    <ImgView :propImgView="dialogImgViewData" v-if="dialogImgViewData.show"></ImgView>
  </div>
</template>

<script>
import {uploadUrl} from '@/modules/file/api/upload' // 图片操作API
import * as imgFuncs from '@/utils/getImgUrl.js'
import ImgView from '@/components/imgView/index'
export default {
  name: 'imgView',
  components: {
    ImgView
  },
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    urlType: {
      type: Number,
      default: 1 // 1--id类型，2--完整链接
    },
    imgPixel: {
      type: Number,
      default: 1 // 1--普通，2--高像素
    },
    delPower: {
      type: Boolean,
      default: true // 是否可以删除，true-能 ,false--不能
    }
  },
  created () {},
  computed: {
    /**
     *背景图
     * */
    imgBg () {
      let url = ''
      if (this.urlType === 2) {
        url = this.value
      } else {
        url = imgFuncs.getImg(this.value, this.imgPixel)
      }
      return url
    },
    /**
     * 预览图
     * */
    imgPixelHigth () {
      let url = ''
      if (this.urlType === 2) {
        url = this.value
      } else {
        url = imgFuncs.getImg(this.value, 2)
      }
      return url
    }
  },
  data () {
    return {
      // imgUrl: 'http://pay-adm.h5h5h5.cn/fms/upload/resource/1156029732371070976',
      // 图片上传-------------------
      filesData: {
        module: 'image'
      },
      url: uploadUrl + '/user',
      headers: {
        authorized: sessionStorage.token
      },
      imgIdVal: '', // 图片id
      imgUrlVal: '', // 图片url
      // 图片预览
      dialogImgViewData: {

      }
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
     * 图片上传
     * @param response
     * @param file
     */
    mactbgUpload: function (response, file) {
      console.log(response)
      this.$message({
        message: '图片上传成功',
        type: 'success'
      })
      let url
      if (this.urlType === 1) {
        url = response.obj
      } else {
        url = imgFuncs.getImg(response.obj, 2)
      }
      this.imgIdVal = response.obj
      this.imgUrlVal = imgFuncs.getImg(response.obj)
      this.$emit('input', url)
    },
    /**
     *图片上传失败
     **/
    handleImageFailed () {
      this.$message({
        message: '图片上传失败',
        type: 'error'
      })
    },
    /**
     *对类型、大小做限制
     **/
    beforeLogoUpload (file) {
      let isImage = file.type.substring(0, 5) === 'image'
      let isGif = file.type.substring(0, 9) === 'image/gif'
      if (!isImage) {
        this.$message.error('只允许图片格式（jpg / jpeg / png）')
        return false
      } else if (isGif) {
        this.$message.error('只允许图片格式（jpg / jpeg / png）')
        return false
      }
      return true
    },
    /**
     * 删除
     */
    delImg () {
      this.imgIdVal = ''
      this.imgUrlVal = ''
      this.$emit('input', null)
    }
  }
}
</script>
