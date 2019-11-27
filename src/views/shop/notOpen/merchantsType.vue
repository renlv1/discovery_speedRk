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
          <li v-for="(item, index) in merchantsType" class="item" :key="index" @click="selectOne(item, index)" :class="{activeLi: activeFlag === index}">
            <div class="li-t">{{item}}</div>
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
        merchantsType: [this.$t('shops.text36'), this.$t('shops.text37'), this.$t('shops.text38'), this.$t('shops.text39'), this.$t('shops.text40'), this.$t('shops.text41'), this.$t('shops.text42'), this.$t('shops.text43'), this.$t('shops.text44'), this.$t('shops.text47'), this.$t('shops.text45'), this.$t('shops.text46')],
        isGoBack: true,
        titleName: this.$t('notMerchant.text4'),
        activeFlag: 0
      }
    },
    methods: {
      hide() {
        this.$emit('hideMerType')
      },
      selectOne(item, index) {
        this.activeFlag = index
        this.$emit('select', item, index)
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
    background-color: #F7F7F7
  .merchant-w
    overflow: auto
    z-index: 800
  .merchantsType
    width: 100%
    background-color: #F7F7F7
    /*overflow: auto*/
    margin-top: 100px
    padding-bottom: 2rem
    display flex
    justify-content space-around
    flex-wrap wrap
    padding-top .3rem
    .item
      margin-bottom .3rem
      display flex
      align-items center
      justify-content center
      text-align center
      border-radius 4px
      width 3rem
      height 1rem
      background #fff
      line-height: 1rem
      color #060f26
      font-size: .28rem
      &.activeLi
        color rgb(255,182,75)
        border 1px solid  rgb(255,182,75)
</style>
