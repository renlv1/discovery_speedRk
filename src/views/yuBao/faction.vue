<template>
  <div>
    <mFixedTop :titleName="titleName" :isGoBack="isGoBack"></mFixedTop>
    <div class="v-content-wrapper">
      <div class="today-accelerate">{{$t('yuBao.text22')}} <span>{{sumExpediteDayOfNow}} {{$t('yuBao.text24')}}</span></div>
      <ul>
        <li v-for="item in orderList" :key="item.index" @click="toDetail(item.childUserAddress)">
          <div class="li-left">
            <img :src="avatar + item.childUserAddress" :onerror="defaultImg">
          </div>
          <div class="li-right">
            <span class="username">{{item.childUserName}}</span>
            <div class="right-box">
              <span class="accelerate">{{$t('yuBao.text23')}}</span>
              <span class="accelerate-value">{{item.expediteDay}} {{$t('yuBao.text24')}}</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="v-loading" v-show="isShow">
        <cube-loading></cube-loading>
      </div>
      <div class="empty-data" v-show="orderList.length === 0">
        <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
        <p class="text">{{$t('common.noData')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {getParentList} from '@/api/fund'

export default {
  components: {mFixedTop},
  name: "faction",
  data() {
    return {
      isGoBack: true,
      avatar: `${this.$api}` + `file/img?type=user&size=2&id=`, // 头像地址前缀
      defaultImg: 'this.src="' + require('../../images/user_avatar.png') + '"',
      titleName: this.$t('yuBao.text25'),
      sumExpediteDayOfNow: '',
      orderList: [],
      isShow: true,
    }
  },
  created() {
    this.getList()
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
    toDetail(address) {
      this.$router.push({
        query: {
          userAddress: address,
        },
        path: '/factionRecord'
      })
    },
    getList() {
      getParentList().then((res) => {
        this.orderList = res.data.data.expediteList
        this.isShow = false
        this.sumExpediteDayOfNow = res.data.data.sumExpediteDayOfNow
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .empty-data {
    top 55%
  }
  .v-content-wrapper
    padding-top 0
    .today-accelerate
      font-size .24rem
      color #999
      span
        color #b79961
    ul
      margin-top 20px
      li
        display flex
        flex-direction row
        justify-content space-between
        align-items center
        height 1.4rem
        border-1px-bottom(#ccc)
        .li-left
          img
            width 1rem
            height 1rem
            border-radius 4px
            margin-right .3rem
        .li-right
          display flex
          flex-direction row
          flex 1
          justify-content space-between
          align-items center
          padding-bottom .1rem
          .username
            width 75%
            font-size .3rem
            word-wrap:break-word;
            line-height 1.2
          .right-box
            display flex
            flex-direction column
            font-size .24rem
            align-items flex-end
            .accelerate
              text-align right
              color #999
              margin-bottom 10px
            .accelerate-value
              color #b79961
</style>
