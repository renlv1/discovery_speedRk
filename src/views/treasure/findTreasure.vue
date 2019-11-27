<template>
  <div class="findTreasure">
    <mFixedTop :titleName="titleName" :isGoBack="isGoBack" @goPathA="goPath" :isGoNumber="true"></mFixedTop>
    <div class="content">
      <v-map></v-map>
    </div>
    <bottom-menu :tabState="tabState"></bottom-menu>
  </div>
</template>

<script>
import VMap from '../../components/map/map2.vue'
export default {
  data () {
    return {
      isGoBack: true,
      tabState: 0,
      mineMapData: {},
      titleName: this.$t('findBao.text52')
    }
  },
  mounted() {
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
  },
  methods: {
    goPath () {
      this.$router.push('/menu')
    },
    mWeeK (data) {
      if (data) {
        let f = data.split(',')
        let arr = []
        f.forEach(item => {
          if (item === '1') arr.push(this.$t('findBao.text6'))
          if (item === '2') arr.push(this.$t('findBao.text7'))
          if (item === '3') arr.push(this.$t('findBao.text8'))
          if (item === '4') arr.push(this.$t('findBao.text9'))
          if (item === '5') arr.push(this.$t('findBao.text10'))
          if (item === '6') arr.push(this.$t('findBao.text11'))
          if (item === '7') arr.push(this.$t('findBao.text12'))
        })
        return arr.join('、')
      }
    },
  },
  components: {
    mFixedTop: () => import('@/components/mFixedTop'),
    bottomMenu: () => import('@/components/bottomMenu'),
    VMap
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../assets/css/mixin.styl"
.findTreasure
  .map-w
    position: fixed
    top: 60px
    bottom: 1.1rem
    left: 0
    right: 0
    background-color: #f5f6fa
  .ico-m
    background-position center
    background-size cover
    background-repeat no-repeat
</style>
