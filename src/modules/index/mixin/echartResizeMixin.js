export default {
  data () {
    return {
      onWindowResize: null
    }
  },
  beforeDestroy () {
    if (this.onWindowResize) {
      window.removeEventListener('resize', this.onWindowResize)
    }
  },
  methods: {
    adaptWindowResize (chart) {
      window.addEventListener('resize', this.onWindowResize = () => {
        console.log('触发')
        chart.resize()
      })
    }
  }
}
