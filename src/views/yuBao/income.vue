<template>
  <div>
    <div class="v-content-wrapper">
      <m-fixed-top :titleName="titleName" :isGoBack="isGoBack"></m-fixed-top>
      <div class="top-wrapper">
        <div class="value">
          <span class="pi">{{profitTotal}}</span>
          <img src="./images/paiLogo.png" />
        </div>
        <div class="text">{{$t('yuBao.text3')}}</div>
      </div>
      <cube-scroll
        class="scroll-content"
        ref="scroll"
        :data="orderList"
        :options="options"
        @pulling-up="onPullingUp">
        <ul>
          <li class="item" v-for="item in orderList" :key="item.key">
            <div class="li-left">
              <span class="yu-title">{{$t('yuBao.text9')}}</span>
              <span class="yu-time">{{$changeDate(item.createAt)}}</span>
            </div>
            <div class="li-right">
              <span class="profitTotal">{{item.profitTotal}} π</span>
              <span class="baseProfitTotal">{{item.baseProfitTotal}} π</span>
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
      </cube-scroll>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {ProfitReocrdList} from '@/api/fund'

export default {
  components: {mFixedTop},
  name: "income",
  data() {
    return {
      isShow: true,
      isGoBack: true,
      titleName: this.$t('yuBao.text8'),
      orderList: [],
      pageIndex: 1,
      pageSize: 10,
      profitTotal: '',
      options: {
        pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
          threshold: 0,
          txt: this.$t('common.pullLoadMore')
        }
      },
    }
  },
  mounted() {
    this.getProfitReocrdList()
  },
  methods: {
    getProfitReocrdList() {
      ProfitReocrdList(this.pageIndex, this.pageSize).then((res) => {
        this.profitTotal = res.data.data.profitTotal
        this.isShow = false
        if (res.data.status === 'success') {
          let _list = res.data.data.profitList
          if (_list.length) {
            this.orderList.push(...res.data.data.profitList)
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
      this.getProfitReocrdList()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .empty-data {
    top 30%
  }
  .v-loading {
    top 30%
  }
  .v-content-wrapper
    padding-top 0
    padding-bottom 0
    height calc(100vh - 2.4rem)
    overflow hidden
    .top-wrapper
      margin-bottom .4rem
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
    .scroll-content
      height calc(100vh - 3rem)
      ul
        margin-top .4rem
        .item
          margin-bottom 8px
          padding 8px 0
          display flex
          flex-direction row
          align-items center
          height 1.2rem
          justify-content space-between
          border-1px-bottom(#bfbfbf)
          .li-left
            display flex
            flex-direction column
            height 100%
            justify-content space-around
            .yu-title
              font-size .3rem
            .yu-time
              margin-top .1rem
              font-size .24rem
              color #999
          .li-right
            display flex
            flex-direction column
            align-items flex-end
            .profitTotal
              color #b79961
              font-size .3rem
            .baseProfitTotal
              margin-top .1rem
              font-size .24rem
              color #999
</style>
