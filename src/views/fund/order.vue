<template>
  <div>
    <m-fixed-top :titleName="titleName" :isGoBack="isGoBack"></m-fixed-top>
    <div class="v-content-wrapper">
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
          <li class="item" v-for="item in orderList" :key="item.key" @click="toDetail(item.id)">
            <div class="box-top">
              <div class="li-buy">
                <p class="top-left">
                  <span class="type" :class="[item.eType === 1 ? 'isBuy' : 'isSell']">{{transType(item.eType)}}</span>
                  <span>{{$t('fund.text22')}} </span>
                  <span class="itemId">{{item.id}}</span>
                </p>
                <p class="top-right">
                  {{$changeDate(item.createAt, '.')}}
                </p>
              </div>
              <div class="li-price">
                <p>{{$t('fund.text24')}}</p>
                <p>{{item.price}} π</p>
              </div>
              <div class="li-commission">
                <p>{{$t('fund.text25')}}</p>
                <p>{{item.amount}}</p>
              </div>
              <div class="li-transact">
                <p>{{$t('fund.text23')}}</p>
                <p>{{item.tradeAmount}}</p>
              </div>
            </div>
            <div class="box-bottom">{{finishState(item.finishState)}}</div>
          </li>
        </ul>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {fundEntrustList, entrustList} from '@/api/fund'

export default {
  name: "Order",
  components: {mFixedTop},
  data() {
    return {
      isGoBack: true,
      titleName: '',
      isShow: true,
      orderList: [],
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
    if (this.$route.query.flag) {
      this.titleName = this.$t('fund.text26')
    } else {
      this.titleName = this.$t('fund.text27')
    }
    this.getOrderList()
  },
  computed: {},
  methods: {
    toDetail(id) {
      this.$router.push({
        path: '/fundOrderDetail',
        query: {
          id: id
        }
      })
    },
    transType(type) {
      let typeText = ''
      if (type === 1) {
        typeText = this.$t('fund.text28')
      } else {
        typeText = this.$t('fund.text29')
      }
      return typeText
    },
    finishState(type) {
      let typeText = ''
      if (type === 1) {
        typeText = this.$t('fund.text30')
      } else {
        typeText = this.$t('fund.text31')
      }
      return typeText
    },
    getOrderList() {
      let finishState
      if (this.$route.query.flag === 1) {
        finishState = 2
      } else {
        finishState = ''
      }
      fundEntrustList(this.pageIndex, this.pageSize, '', finishState).then((res) => {
        this.isShow = false
        if (res.data.status === 'success') {
          let _list = res.data.data
          if (_list.length) {
            this.orderList.push(...res.data.data)
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
      this.getOrderList()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .empty-data
    top 40% !important
  .v-loading
    top 40% !important

  .v-content-wrapper
    padding-top .5rem
    padding-bottom 0
    .scroll-content
      height 100vh
      ul
        .item
          padding .3rem
          width 100%
          font-size .28rem
          background-color #f7f7f7
          margin-bottom 10px
          .box-top
            padding-bottom .2rem
            border-bottom 1px dotted #ccc
            .li-buy, .li-price, .li-commission, .li-transact
              display flex
              flex-direction row
              justify-content space-between
              margin-top .3rem
            .li-buy
              .top-left
                .type
                  color #fff
                  margin-right .2rem
                  padding 2px 3px
                  border-radius 3px
                  &.isBuy
                    background #36c46f
                  &.isSell
                    background #ff717d
              .top-right
                color #999
                font-size .24rem

          .box-bottom
            text-align right
            padding-top .2rem
            color #b79961
</style>
