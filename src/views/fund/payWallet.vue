<template>
  <div>
    <m-fixed-top :titleName="titleName" :isGoBack="isGoBack"></m-fixed-top>
    <div class="v-content-wrapper">
      <div class="top-wrapper">
        <div class="value">
          <span class="pi">{{paiPurseBalance}}</span>
          <img src="./images/paiLogo.png" />
        </div>
        <div class="text">{{$t('fund.text62')}}</div>
      </div>
      <div class="account-change">
        <div class="change-title">{{$t('fund.text63')}}</div>
        <cube-scroll
          class="scroll-content"
          ref="scroll"
          :data="orderList"
          :options="options"
          @pulling-up="onPullingUp">
          <div class="v-loading" v-show="isShow">
            <cube-loading></cube-loading>
          </div>
          <div v-show="orderList.length === 0" class="empty-data">
            <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
            <p class="text">{{$t('common.noData')}}</p>
          </div>
          <ul>
            <li class="item" v-for="item in orderList" :key="item.key">
              <div class="li-top">
                <p class="type-text">{{transText(item.changeType)}}</p>
                <p class="amount" :class="[Number(item.changeAmount) > 0 ? 'in' : 'out']">{{Number(item.changeAmount) > 0 ? ('+' + Number(item.changeAmount)) : Number(item.changeAmount)}} π</p>
              </div>
              <div class="li-bottom">
                <p class="num">{{$t('fund.text64')}}：{{item.id}}</p>
                <p class="change-time">{{$changeDate(item.createAt, '.')}}</p>
              </div>
            </li>
          </ul>
        </cube-scroll>
      </div>
      <div class="btn-wrapper">
        <div class="btn in-btn" @click="trans(0)">
          {{$t('fund.text65')}}
        </div>
        <div class="btn out-btn" @click="trans(1)">
          {{$t('fund.text66')}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {getPurseList} from '@/api/fund'

export default {
  components: {mFixedTop},
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('fund.text67'),
      pageIndex: 1,
      pageSize: 10,
      changeType: '',
      isShow: true,
      orderList: [],
      paiPurseBalance: '',
      options: {
        pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
          threshold: 0,
          txt: this.$t('common.pullLoadMore')
        }
      },
    }
  },
  name: "paiFund",
  mounted() {
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
    this.getList()
  },
  methods: {
    trans(num) {
      this.$router.push({
        path: '/trans',
        query: {
          type: num
        }
      })
    },
    transText(type) {
      let text = ''
      if (type === 1) {
        text = this.$t('fund.text68')
      } else if (type === 2) {
        text = this.$t('fund.text69')
      } else if (type === 3) {
        text = this.$t('fund.text70')
      } else if (type === 4) {
        text = this.$t('fund.text71')
      } else if (type === 5) {
        text = this.$t('fund.text72')
      } else if (type === 6) {
        text = this.$t('fund.text73')
      } else if (type === 7) {
        text = this.$t('fund.text74')
      }
      return text
    },
    getList() {
      getPurseList(this.pageIndex, this.pageSize, this.changeType).then((res) => {
        // this.orderList
        this.isShow = false
        if (res.data.status === 'success') {
          this.paiPurseBalance = res.data.data.paiPurseBalance
          let _list = res.data.data.userPaiPurseList
          if (_list.length) {
            this.orderList.push(...res.data.data.userPaiPurseList)
            this.pageIndex++
          } else {
            this.$refs.scroll.forceUpdate()
          }
        } else {
          this.toastD(res.data.msg)
        }
      })
    },
    onPullingUp() {
      this.getList()
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .empty-data
    top 40% !important
  .v-content-wrapper
    padding-top 0
    padding-bottom 0
    .top-wrapper
      text-align center
      padding .6rem 0 .54rem
      background-color #fbf5e7
      border-radius 8px
      .value
        display flex
        flex-direction row
        justify-content center
        height .5rem
        align-items center
        margin-bottom .2rem
        .pi
          line-height .5rem
          display block
          font-size .34rem
          margin-right .2rem
        img
          width .4rem
          height .4rem
      .text
        font-size .24rem
    .account-change
      .change-title
        margin .6rem 0 .25rem
        font-size .24rem
        color #999
      .scroll-content
        height 60vh
        overflow scroll
        ul
          li
            border-bottom 1px solid #ccc
            padding .35rem 0 .32rem
            .li-top
              display flex
              flex-direction row
              justify-content space-between
              .type-text
                font-size .3rem
                color #000
              .amount
                font-size .32rem
                &.in
                  color #4cd282
                &.out
                  color #ff717d
            .li-bottom
              margin-top .16rem
              display flex
              flex-direction row
              justify-content space-between
              font-size .24rem
              color #999
    .btn-wrapper
      z-index 999
      background #fff
      left .4rem
      right .4rem
      position fixed
      bottom 0
      padding-bottom .2rem
      display flex
      flex-direction row
      justify-content space-between
      width auto
      .btn
        height 1rem
        width 48%
        line-height 1rem
        text-align center
        font-size .28rem
        border-radius 4px
      .in-btn
        background #a2f2ed
      .out-btn
        background #ffe941
</style>
