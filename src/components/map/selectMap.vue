<template>
  <div>
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <baidu-map class="bm-view" :center="center" :zoom="zoom" @ready="handler" :lag="lag" :lat="lat"></baidu-map>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
export default {
  components: {mFixedTop},
  name: "selectMap",
  data() {
    return {
      isGoBack: true,
      center: {lng: 0, lat: 0},
      zoom: 16
    }
  },
  props: {
    titleName: {
      type: String,
      require: true
    },
    lag: {
      type: String,
      require: true
    },
    lat: {
      type: String,
      require: true
    }
  },
  methods: {
    goPath() {
      this.$router.push('/treasure')
    },
    handler() {
      let _this = this
      _this.center.lng = _this.lag
      _this.center.lat = _this.lat
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .container {
    position relative
  }

  .BMap_cpyCtrl {
    display: none;
  }

  .anchorBL {
    display: none;
  }

  .bm-view {
    width 100%
    height: 100vh;
  }
</style>
