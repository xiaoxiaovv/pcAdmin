<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
// import webIcon from '@/assets/images/login/brownicon.png'
export default {
  name: 'App',
  mounted () {
    // this.setHtmlTxt()
  },
  methods: {
    /*
    setHtmlTxt () {
      let link = document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.type = 'image/x-icon'
      link.rel = 'shortcut icon'
      link.href = webIcon
      document.getElementsByTagName('head')[0].appendChild(link)
    }
    */
  }
}
</script>
<style>
  .fade-enter-active, .fade-leave-active {
    transition: all .3s ease;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    transform: translateX(-20px);
  }
</style>
