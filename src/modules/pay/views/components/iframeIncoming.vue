<template>
  <div>
    <iframe class="iframe-h5"
            :src="url"
            id="iframeH5"
            frameborder="no"
            border="0"
            marginwidth="0"
            marginheight="0"
            scrolling="no"
            allowtransparency="yes">
    </iframe>
  </div>
</template>
<script>
export default {
  props: {
    dialog: {
      type: Object
    }
  },
  data () {
    return {
      url: ''
    }
  },

  created () {
    // let id = '1191270044721963009'
    let token = sessionStorage.token
    // let companyId= sessionStorage.getItem("companyId")
    if (this.dialog.data) {
      const url = window.serverUrl || window.location.protocol + '//' + window.location.host
      this.url = url + `/web/h5/index.html#/client_info_record??from=iframe&id=${this.dialog.data.id}&token=${token}`
    }
    var that = this
    window.addEventListener('message', e => {
      that.handleTest()
    })
    console.log('sessionStorage.token', sessionStorage.token)
  },
  methods: {
    handleTest () {
      console.log('触发')
      this.dialog.show = false
      this.$emit('toDetail', this.dialog.data)
    }
  }
}
</script>
<style scoped>
  .iframe-h5 {
    display: block;
    margin: -40px auto 0;
    width: 100%;
    height:667px;
    /* width: 500px;
    height:600px; */
  }
</style>
