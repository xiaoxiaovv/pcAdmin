export default {
  data () {
    return {
      levelAlias: {}
    }
  },
  created () {
    this.getLevelAliasInfo()
  },
  methods: {
    getLevelAliasInfo () {
      this.levelAlias = JSON.parse(sessionStorage.levelAlias)
    }
  }
}
