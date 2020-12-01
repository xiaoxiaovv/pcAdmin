<template>
    <section class="app-main">
        <transition name="fade" mode="out-in">
          <!--<keep-alive :includes="['deviceManageListA']">-->
            <router-view></router-view>
          <!--</keep-alive>-->
        </transition>
    </section>
</template>

<script>
export default {
  name: 'appMain'
}
</script>
