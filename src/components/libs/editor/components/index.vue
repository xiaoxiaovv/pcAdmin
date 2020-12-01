<template>
  <div>
    <editor v-model="myValue"
            id="tinymce"
            :init="init"></editor>
  </div>
</template>
<script>
import {
  returnFilesUrl,
  returnThumbnailUrl,
  uploadFile,
  uploadUrl
} from '@/modules/file/api/upload'
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/modern/theme'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/paste'

// window.tinymce.baseURL = '/static/tinymce'
// window.tinymce.suffix = '.min'
export default {
  components: {
    Editor
  },
  props: {
    // 传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'lists image media paste table textcolor wordcount contextmenu'
    },
    toolbar: {
      type: [String, Array],
      default:
        'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat'
    }
  },
  data() {
    return {
      // 初始化配置
      init: {
        language_url: './static/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: './static/tinymce/skins/lightgray', // 要用相对路径，不然在打包中时线上路径会出现问题
        // language_url: '../src/tinymce/langs/zh_CN.js',
        // language: 'zh_CN',
        // skin_url: '../src/tinymce/skins/lightgray',
        height: 300,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        paste_data_images: true,
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          // const img = 'data:image/jpeg;base64,' + blobInfo.base64()
          // success(img)
          let formData = new FormData()
          formData.append('files', blobInfo.blob(), blobInfo.filename())
          formData.append('module', 'token')
          uploadFile(formData, 'article')
            .then(response => {
              // success('http://beta.bhpcash.io:8758/resource/images/'+imgArr.join(''));
              // success('http://pic2.ooopic.com/12/40/58/18bOOOPIC9c.jpg');
              success(returnFilesUrl(response.obj))
            })
            .catch(err => {
              failure('Invalid JSON: ' + err)
            })
        }
      },
      myValue: this.value
    }
  },
  mounted() {
    // tinymce.init({})
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit('onClick', e, tinymce)
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = ''
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue
    },
    myValue(newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>
<style >
#tinymc img {
  max-width: 100%;
  height: auto;
}
</style>
