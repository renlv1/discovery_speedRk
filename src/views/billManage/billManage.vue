<template>
  <div class="v-content-wrapper">
    <mFixedTop :titleName="titleName" :isGoBack="false"></mFixedTop>
    <ul>
      <li class="item" v-for="item in list" :key="item.index" @click="toPath(item)">
        <div class="li-left">
          <img class="img" :src="item.picUrl" />
          <p>{{item.title}}</p>
        </div>
        <div class="li-right">
          <img src="../../assets/img/menu/row.svg">
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'

export default {
  components: {mFixedTop},
  data() {
    return {
      titleName: this.$t('menu.order.title'),
      list: [
        {picUrl: require('./images/1.svg'), title: this.$t('menu.order.menu.text1'), url: '/tradeOrder'},
        {picUrl: require('./images/2.svg'), title: this.$t('menu.order.menu.text2'), url: '/topUp/topUpOrder'},
        {picUrl: require('./images/3.svg'), title: this.$t('menu.order.menu.text3'), url: '/withdrawalOrder'},
        {picUrl: require('./images/4.svg'), title: this.$t('menu.order.menu.text4'), url: '/complaintOrder'}
      ]
    }
  },
  methods: {
    toPath(item) {
      if (item.url.includes('topUpOrder') || item.url.includes('complaintOrder')) {
        this.$store.commit('SET_TAB_RECORD', {
          head: 0,
          foot: 0
        })
      }
      this.$router.push(item.url)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .item
    display flex
    flex-direction row
    justify-content space-between
    height 1.2rem
    align-items center
    border-1px-bottom(#e6e6e6)
    .li-left
      display flex
      flex-direction row
      align-items center
      .img
        width .44rem
        height .4rem
        margin-right .3rem
      p
        font-size .28rem
    .li-right
      img
        width .38rem
        height .32rem
</style>
