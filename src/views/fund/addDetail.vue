<template>
  <div>
    <m-fixed-top :titleName="titleName" :isGoBack="isGoBack"></m-fixed-top>
    <div class="v-content-wrapper">
      <div class="wrapper-top">
        <p><span>{{presentTotal}}</span> {{this.$t('fund.text5')}}</p>
        <p>{{this.$t('fund.text47')}}</p>
      </div>
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
            <span>{{$changeDate(item.createAt, '-')}}</span>
            <span>{{item.presentAmount}} π</span>
          </li>
        </ul>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {getPresentList} from '@/api/fund'

export default {
  components: {mFixedTop},
  name: "addDetail",
  data() {
    return {
      titleName: this.$t('fund.text48'),
      isGoBack: true,
      presentTotal: '',
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
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getPresentList(this.pageIndex, this.pageSize).then((res) => {
        this.isShow = false
        if (res.data.status === 'success') {
          this.presentTotal = res.data.data.presentTotal
          let _list = res.data.data.fundPresentList
          if (_list.length) {
            this.orderList.push(...res.data.data.fundPresentList)
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
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .empty-data
    top 30% !important
  .v-loading
    top 30% !important

  .v-content-wrapper
    padding-top 0
    padding-bottom 0
    .wrapper-top
      height 2rem
      display flex
      flex-direction column
      text-align center
      background-color #fbf5e7
      border-radius 8px
      margin-bottom .4rem
      p
        font-size .24rem
        span
          font-size .34rem
        &:first-child
          margin .6rem 0 .2rem
          color #b79961
    .scroll-content
      height calc(100vh - 2.4rem)
      ul
        margin-top .4rem
        li
          display flex
          flex-direction row
          justify-content space-between
          align-items center
          height 1rem
          border-bottom 1px solid #ccc
          font-size .28rem
          &:last-child
            color #4cd282
</style>
