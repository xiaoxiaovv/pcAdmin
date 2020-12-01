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
      <div class="vm-img-uploader-show" @click="viewImg(imgPixelHigth)">
        <video style="width: 100%;height: 100%;" @durationchange="durationchange($event, '0')" :src="imgPixelHigth" v-if="imgPixelHigth" />
        <span class="play-icon"><i class="el-icon-caret-right"></i></span>
      </div>
      <i class="el-icon-error upload-close-icon" @click="delImg" v-if="delPower"></i>
    </div>
    <!--视频预览-->
    <ImgView :propImgView="dialogImgViewData" v-if="dialogImgViewData.show" :mediaType="2"></ImgView>
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
      default: 2 // 2--高像素
    },
    delPower: {
      type: Boolean,
      default: true // 是否可以删除，true-能 ,false--不能
    },
    imgType: {
      type: String,
      default: 'image'
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
        module: 'file'
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
        message: '视频文件上传成功',
        type: 'success'
      })
      let url
      if (this.urlType === 1) {
        url = response.obj
      } else {
        url = imgFuncs.getImg(response.obj, 2) + '.mp4'
      }
      this.imgIdVal = response.obj + '.mp4'
      this.imgUrlVal = imgFuncs.getImg(response.obj) + '.mp4'
      this.$emit('input', url)
    },
    /**
     *图片上传失败
     **/
    handleImageFailed () {
      this.$message({
        message: '视频文件上传失败',
        type: 'error'
      })
    },
    /**
     *对类型、大小做限制
     * 视频大小--
     **/
    beforeLogoUpload (file) {
      console.log(file.type)
      let size = file.size / 1024 / 1024
      if (size > 30) {
        let msg = '视频大小不能超过30M'
        this.$message.error(msg)
        return false
      }
      let isImage = file.type.substring(0, 9) === 'video/mp4'
      if (!isImage) {
        let msg = '只允许MP4视频文件'
        this.$message.error(msg)
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
    },
    /**
     * 视频时长
     * @param event
     */
    durationchange (event) {
      let videoLength = event.target.duration
      if (videoLength > 60) {
        this.delImg()
        this.$message.warning('视频时长不能大于60秒')
      }
    }
  }
}
</script>
