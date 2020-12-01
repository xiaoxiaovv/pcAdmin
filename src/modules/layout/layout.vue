<template>
    <div class="app-wrapper" :class="classObj">
        <slidebar class="sidebar-container"></slidebar>
        <navbar></navbar>
        <div class="main-container">
            <tags-view></tags-view>
            <app-main></app-main>
        </div>
    </div>
</template>

<script>
import slidebar from './components/slidebar/index'
import navbar from './components/navbar'
import tagsView from './components/tagsView'
import appMain from './components/appMain'

export default {
  name: 'layout',
  computed: {
    isClosed () {
      return this.$store.getters.isClosed
    },
    classObj () {
      return {
        hideSidebar: this.isClosed,
        openSidebar: !this.isClosed
      }
    }
  },
  components: {
    slidebar,
    navbar,
    tagsView,
    appMain
  }
}
</script>
