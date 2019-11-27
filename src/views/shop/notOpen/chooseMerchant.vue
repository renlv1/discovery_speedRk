<template>
  <transition name="slide">
    <div class="merchant-w slide-w">
      <div class="conten-t">
        <mFixedTop :titleName="titleName" :isGoNumber="true" :isGoBack="isGoBack" @goPath="hide"></mFixedTop>
        <!--<app-header>商户类型</app-header>-->
        <!--<div class="app-title">-->
        <!--<i @click="hide" class="back"></i>-->
        <!--<span>商户类型</span>-->
        <!--</div>-->
        <ul class="merchantsType">
          <li v-for="(item, index) in merchantsType" class="item" :key="index" @click="selectOne(item.text, index)" :class="{activeLi: activeFlag === index}">
            <div class="shop-icon"><img :src="item.imgUrl"></div>
            <div class="li-r">
              <div class="li-t">{{item.text}}</div>
              <div class="li-c">{{item.content}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import mFixedTop from '@/components/mFixedTop'
  export default {
    components: {
      mFixedTop},
    data() {
      return { // 1 饮食 2 零售 3 服务 4 服装  5 酒店 6 房产 7 数码 8 茶叶 9 健身  10 珠宝 11 美容 12 汽车
        merchantsType: [
          {imgUrl: require('../notOpen/img/entity.png'), text: this.$t('myPiOrder.text40'),content: this.$t('myPiOrder.text42')},
          {imgUrl: require('../notOpen/img/online.png'), text: this.$t('myPiOrder.text41'),content: this.$t('myPiOrder.text43')},
        ],
        isGoBack: true,
        titleName: this.$t('myPiOrder.text44'),
        activeFlag: 0
      }
    },
    methods: {
      hide() {
        this.$emit('hideDialog')
      },
      selectOne(t,index) {
        this.activeFlag = index
        this.$emit('selectOne', t,index)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .ios
    .merchantsType
      margin-top: 65px
  .iosx
    .merchantsType
      margin-top: 90px
  .conten-t
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    overflow: auto
    background-color: #fff
  .merchant-w
    overflow: auto
    z-index: 800
  .merchantsType
    width: 100%
    /*background-color: #fff*/
    /*overflow: auto*/
    margin-top: 100px
    padding .3rem 0.2rem 0
    padding-bottom: 2rem
    .item
      padding .4rem .3rem
      margin-bottom .3rem
      display flex
      align-items center
      border-radius 4px
      width 100%
      /*height 1rem*/
      background #F7F7F7
      /*line-height: 1rem*/
      .shop-icon
        width .37rem
        margin-right .2rem
        img
          width 100%
      .li-r
        .li-t
          font-size .28rem
          color #000
        .li-c
          margin-top .2rem
          font-size .18rem
          color #B7B7B7
</style>
