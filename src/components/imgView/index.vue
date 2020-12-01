<template>
  <el-dialog :title="mediaType===1?'图片预览':'视频预览'"
             :visible.sync="propImgView.show"
             v-if="propImgView.show"
             append-to-body>
    <div style="text-align: center;">
      <div v-if="mediaType === 1" >
        <img :src="propImgView.url" alt="" style="max-width:100%;max-height: 70vh;">
      </div>
      <div v-if="mediaType === 2">
        <video :src="propImgView.url" style="max-width:100%;max-height: 60vh;" controls />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="propImgView.show = false">关 闭</el-button>
      </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'imgView',
  props: {
    propImgView: {
      type: Object,
      default: function () {
        return {}
      }
    },
    mediaType: {
      type: Number,
      default: 1 // 1 -- 图片，2--视频
    }
  },
  created () {},
  data () {
    return {}
  },
  methods: {}
}
</script>
