<template>
  <div>
    <mFixedTop :titleName="titleName" :isGoBack="true"></mFixedTop>
    <div class="v-content-wrapper">
      <div class="today-accelerate">
        {{$t('yuBao.text26')}} <span>{{sumDay}} {{$t('yuBao.text24')}}</span>
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
              <p class="yu-title">{{$t('yuBao.text28')}}</p>
              <p class="yu-time">{{$t('yuBao.text29')}}：{{(item.mineMapId)}}</p>
            </div>
            <div class="li-right">
              <p class="yu-time">{{$changeDate(item.createAt)}}</p>
              <p class="day">{{item.expediteDay}} {{$t('yuBao.text24')}}</p>
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
import {getExpediteList} from '@/api/fund'

export default {
  components: {mFixedTop},
  data() {
    return {
      titleName: this.$t('yuBao.text27'),
      sumDay: '',
      orderList: [],
      isShow: true,
      pageIndex: 1,
      pageSize: 10,
      options: {
        pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
          threshold: 0,
          txt: this.$t('common.pullLoadMore')
        }
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getExpediteList(this.$route.query.userAddress, this.pageIndex, this.pageSize).then((res) => {
        this.isShow = false
        this.sumDay = res.data.data.sumExpediteDayOfNow
        let _list = res.data.data.expediteList
        if (_list.length) {
          this.orderList.push(...res.data.data.expediteList)
          this.pageIndex++
        } else {
          this.$refs.scroll.forceUpdate()
        }
      })
    },
    onPullingUp() {
      this.getList()
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
    height calc(100vh - 2rem)
    .today-accelerate
      font-size .24rem
      color #999
      span
        color #b79961
    .scroll-content
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
              font-size .28rem
              color #999
          .li-right
            text-align right
            display flex
            flex-direction column
            justify-content flex-end
            font-size .32rem
            color #b79961
            .day
              margin-top .1rem
              font-size .28rem
              color #999
</style>
