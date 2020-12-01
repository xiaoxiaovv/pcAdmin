<template>
  <div class="app-container" v-loading="loading">
    <div class="action-container">
      <img src="../../../assets/images/help/flow.png" alt="" width="1280px">
    </div>
  </div>

</template>

<script>
export default {
  name: "help",
  data () {
    return {
      loading: false, // 加载动画
    }
  }
}
</script>

<style scoped>

</style>
