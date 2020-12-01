<template>
  <div style="position: relative;">
    <!--图片选择-->
    <el-upload :action="url"
               :data="filesData"
               name="files"
               :file-list='fileList'
               :on-change="handleChange"
               :on-success="mactbgUpload"
               :on-error="handleImageFailed"
               :on-remove='onRemove'
               :before-upload="beforeLogoUpload"
               :headers="headers">
      <el-button size="small"
                 type="primary">点击上传</el-button>
      <div slot="tip"
           class="el-upload__tip">支持多文件上传</div>

    </el-upload>
    <!-- <div class="vm-img-uploader vm-img-uploader-img"
         v-show="value">
      <div class="vm-img-uploader-show"
           @click="viewImg(imgPixelHigth)">
        <video style="width: 100%;height: 100%;"
               @durationchange="durationchange($event, '0')"
               :src="imgPixelHigth"
               v-if="imgPixelHigth" />
        <span class="play-icon"><i class="el-icon-caret-right"></i></span>
      </div>
      <i class="el-icon-error upload-close-icon"
         @click="delImg"
         v-if="delPower"></i>
    </div> -->
    <!--视频预览-->
  </div>
</template>

<script>
import { uploadUrl, returnFilesUrl } from '@/modules/file/api/upload' // 图片操作API
import * as imgFuncs from '@/utils/getImgUrl.js'
import ImgView from '@/components/imgView/index'
export default {
  name: 'fileUpload',
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
  computed: {
    /**
     *背景图
     * */
    imgBg() {
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
    imgPixelHigth() {
      let url = ''
      if (this.urlType === 2) {
        url = this.value
      } else {
        url = imgFuncs.getImg(this.value, 2)
      }
      return url
    }
  },
  data() {
    return {
      // imgUrl: 'http://pay-adm.h5h5h5.cn/fms/upload/resource/1156029732371070976',
      filesData: {
        module: 'file'
      },
      url: uploadUrl + '/article',
      fileList: [],
      fileUrl: '',
      headers: {
        authorized: sessionStorage.token
      },
    }
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
      if (fileList[0] && fileList[0].response) {
        // debugger
        let urlList = []
        urlList = fileList.filter(item => {
          return item.response && item.response.obj
        })
        urlList = urlList.map(item => {
          return item.response.obj
        })
        urlList = urlList.join(',')
        this.$emit('input', urlList)
      }
    },
    onRemove(file, fileList) {
      let urlList = []
      urlList = fileList.map(item => {
        return item.response.obj
      })
      urlList = urlList.join(',')
      this.$emit('input', urlList)
    },

    /**
     * 文件上传
     * @param response
     * @param file
     */
    mactbgUpload: function (response, file) {
      console.log(response)
      this.$message({
        message: '文件上传成功',
        type: 'success'
      })
      // let url
      // if (this.urlType === 1) {
      //   url = response.obj
      // } else {
      //   url = imgFuncs.getImg(response.obj, 2) + '.mp4'
      // }
      // this.imgIdVal = response.obj + '.mp4'
      // let pathUrl = returnFilesUrl(response.obj)
      // this.fileUrl += response.obj
      // this.$emit('input', this.fileUrl)
    },
    /**
     *上传失败
     **/
    handleImageFailed() {
      this.$message({
        message: '文件上传失败',
        type: 'error'
      })
    },
    /**
     *对类型、大小做限制
     * --
     **/
    beforeLogoUpload(file) {
      console.log(file.size)
      let isMaxsize = file.size / 1024 / 1024 < 100

      // let isWord = file.type.substring(0, 9) === 'video/mp4'
      if (!isMaxsize) {
        let msg = '上传文件大小不能超过 100MB'
        this.$message.error(msg)
        return false
      }
      return true
    }
  }
}
</script>
