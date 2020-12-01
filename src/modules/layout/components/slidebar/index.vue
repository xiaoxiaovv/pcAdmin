<template>
  <!--<el-menu-->
  <!--class="el-menu-vertical"-->
  <!--:default-active="$route.path"-->
  <!--:collapse="isClosed"-->
  <!--background-color="#304156"-->
  <!--text-color="#bfcbd9"-->
  <!--active-text-color="#409EFF"-->
  <!--style="overflow: auto">-->

  <div class="shadow">
    <div class="logo" v-if="!isClosed">
      <img :src="siteInfo.logo" alt="">
      <!--<img src="@/assets/images/index/凌云logo反白.png" alt="">-->
    </div>

    <el-menu
      class="el-menu-vertical"
      :default-active="$route.path"
      :collapse="isClosed"
      background-color="#334156"
      text-color="#fff"
      style="overflow: auto">
      <slide-bar-item v-for="(item, preIndex) in menuList" :preIndex="preIndex" :key="item.name" :item="item" :base-url="item.path"></slide-bar-item>
    </el-menu>
  </div>
</template>

<script>
import slideBarItem from './slideBarItem'
import {getMenu} from '@/modules/system/api/menu'
import { returnFilesUrl } from '@/modules/file/api/upload' // 图片操作API
import {mapGetters} from 'vuex'
import loginLogo from '@/assets/images/index/loginLogo.png'

export default {
  components: {slideBarItem},
  name: 'index',
  data () {
    return {
      menuList: [],
      siteInfo: {
        logo: ''
      }
    }
  },
  created () {
    this.getMenuList()
  },
  mounted () {
    // 设置LOGO
    if (sessionStorage.getItem('loginLogo')) {
      let loginUrl = returnFilesUrl(sessionStorage.getItem('loginLogo'))
      this.siteInfo.logo = loginUrl
    } else {
      let siteInfoLogo = sessionStorage.getItem('logoImg')
      if (siteInfoLogo !== 'null' || siteInfoLogo !== 'undefined' || siteInfoLogo !== null || siteInfoLogo !== undefined || siteInfoLogo !== '') {
        this.siteInfo.logo = siteInfoLogo
      } else {
        this.siteInfo.logo = loginLogo
      }
    }
  },
  methods: {
    getMenuList () {
      getMenu().then(response => {
        this.menuList = response.obj
        this.$store.dispatch('initMenuPower', response.obj)
      }).catch(() => {
      })
    }
  },
  computed: {
    ...mapGetters([
      'isClosed'
    ])
  }
}
</script>
