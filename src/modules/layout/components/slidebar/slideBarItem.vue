<template>
  <div class="menu-wrapper">
    <el-submenu :index="item.path + preIndex">
      <template slot="title">
        <svg-icon v-if="item.icon" :icon-class="item.icon" :class="item.icon" class="ico"></svg-icon>
        <span>{{item.name}}</span>
      </template>
      <template  v-for="i in item.children" v-if="!(i.path.indexOf('http') > -1)">
        <router-link :to="resolvePath(i.path)" :key="i.name" v-if="i.visible === 1">
          <el-menu-item :index="resolvePath(i.path)" :class="{styleObject: item.icon}">
            <svg-icon v-if="i.icon" :icon-class="i.icon"></svg-icon>
            <span slot="title">{{i.name}}</span>
          </el-menu-item>
        </router-link>
      </template>
      <template v-else>
        <a :href="i.path" target="_blank">
          <!--<el-menu-item :class="{styleObject: item.icon}" >-->
          <el-menu-item  :index="i.path" :class="$route.path === '/help' ? 'is-active' : 'not-active'">
            <svg-icon v-if="i.icon" :icon-class="i.icon"></svg-icon>
            <span slot="title">{{i.name}}</span>
          </el-menu-item>
        </a>
      </template>
      <!--
      <router-link :to="resolvePath(i.path)" v-for="i in item.children" :key="i.name" v-if="i.visible === 1">
        <el-menu-item :index="resolvePath(i.path)" :class="{styleObject: item.icon}">
          <svg-icon v-if="i.icon" :icon-class="i.icon"></svg-icon>
          <span slot="title">{{i.name}}</span>
        </el-menu-item>
      </router-link>
      -->
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'

export default {
  name: 'slideBarItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    preIndex: {
      type: [Number, String],
      default: ''
    },
    baseUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },

  methods: {
    resolvePath (pa) {
      return path.resolve(this.baseUrl, pa)
    }
  }
}
</script>
<style>
.styleObject {
  padding-left: 56px!important;
}
.el-menu-item.is-active.not-active {
    background-color: transparent !important;
  }
</style>
