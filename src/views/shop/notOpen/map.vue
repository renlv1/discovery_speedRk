<template>
  <transition name="slide">
    <div class="map-m slide-w">
      <mFixedTop :titleName="titleName" :isGoNumber="true" :isGoBack="isGoBack" @goPath="hide"></mFixedTop>
      <div class="map-w">
        <div class="map-cont">
          <v-map @getPosition="getPosition"></v-map>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import mFixedTop from '@/components/mFixedTop'
  import vMap from '@/components/map'
  export default {
    data() {
      return {
        titleName: this.$t('myPiOrder.text45'),
        isGoBack: true,
        zoom: 16
      }
    },
    methods: {
      hide () {
        this.$emit('hideMap')
      },
      getPosition (pos, address) {
        this.$emit('positon2', pos, address)
      }
    },
    components: {
      vMap,
      mFixedTop
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.map-m
  display: flex
  flex-direction column
  right: 0
  overflow: hidden
.ios
  .map-w
    padding-top: 65px
.iosx
  .map-w
    padding-top: 90px
.map-w
  display flex
  flex-direction column
  flex 1
  padding-top: 65px
  .search-w
    height: .88rem
    padding: .1rem .3rem
    position: relative
    .icon
      width: .24rem
      position: absolute
      left: .6rem
      top: 50%
      transform translateY(-50%)
      img
        width: 100%
        display: block
    .input
      width: 100%
      height: 100%
      background-color: #F7F7F7
      border-radius 4px
      padding-left: .7rem
      color #060f26
      font-size: 12px
  .map-cont
    flex 1
    background-color: #F5F5F5
    .map-a
      width: 100%
      height: 100%
.bottom-c
  position: fixed
  bottom: 0
  left: 0
  width: 100%
  padding: 0 .3rem .2rem .3rem
  .position-w
    display flex
    justify-content space-between
    margin-bottom: .3rem
    .left
      display: flex
      align-items flex-end
      .long
        .num
          font-size: 12px
          color #060f26
          margin-bottom: 5px
          position: relative
          margin-left: -10px
        .first-num
          margin-left: 0
        .line-border
          width: 1.25rem
          height: 4px
        .line-one
          background-color: #060f26
        .line-two
          border: 1px solid #060f26
    .right
      img
        width: 1.1rem
        display: block
  .address-w
    width: 100%
    background-color: #fff
    border-radius .16rem
    padding: .26rem .26rem .4rem .3rem
    position: relative
    box-shadow 0 0 10px rgba(6,15,38,.2)
    .close
      position: absolute
      right: 0
      top: 0
      padding: .26rem
      img
        width: 15px
    .title
      font-size: .28rem
      margin-top: .12rem
      color #060f26
    .address
      font-size: 12px
      color #999
      line-height: 1.5
      margin: .24rem 0 .64rem
    .btn
      width: 100%
      height: .88rem
      display: flex
      align-items center
      justify-content:center
      color #fff
      background-color: #3495f1
      font-size: .28rem
      border-radius 6px
</style>
