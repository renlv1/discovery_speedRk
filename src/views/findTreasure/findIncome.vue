<template>
  <div class="bill">
    <mFixedTop :titleName="titleName" ></mFixedTop>
    <div class="v-content-wrapper" ref="wrapper">
      <cube-scroll
        ref="scroll"
        :data="billList"
        :options="options"
        @pulling-up="onPullingUp">
        <ul>
          <li v-for="item in billList" :key="item.index" class="item">
            <div class="inner-box">
              <div class="text">
                <p class="message">{{payment(item.paymentType)}}</p>
                <p class="timer">{{$changeDate(item.createAt, '.')}}</p>
              </div>
            </div>
            <p class="money changeColor">+ {{item.amount}} {{item.currency === 'PAI' ? 'π' : item.currency}}</p>
          </li>
        </ul>
      </cube-scroll>
    </div>
    <div v-if="billList.length === 0" class="empty-data" v-show="emptyDatas">
      <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
      <p class="text">{{$t('common.noData')}}</p>
    </div>
    <div class="v-loading" v-show="isShow">
      <cube-loading></cube-loading>
    </div>
  </div>
</template>

<script>
  import mFixedTop from '@/components/mFixedTop'
  import {billRecord} from '../../api/bill'
  import {mapGetters} from 'vuex'

  export default {
    components: {mFixedTop},
    data() {
      return {
        isShow: true,
        titleName: this.$t('findBao.text13'),
        isChange: false,
        emptyDatas: false,
        pageIndex: 1,
        pageSize: 10,
        billList: [],
        options: {
          pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
            threshold: 0,
            txt: this.$t('common.pullLoadMore')
          }
        }
      }
    },
    created () {
      this.getBill()
    },
    mounted() {
      // this._getBillRecord()
      if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
        this.isGoBack = false
        this.$store.commit('IS_IOS', true)
      } else {
        this.isGoBack = true
      }
    },
    computed: {
      ...mapGetters([
        'address'
      ])
    },
    methods: {
      payment (type) { //  11:藏宝支付，12:合并藏宝图 13:更换藏宝图  14:获得藏宝宝藏
        if (type === 11) return this.$t('findBao.text14')
        if (type === 12) return this.$t('findBao.text15')
        if (type === 13) return this.$t('findBao.text16')
        if (type === 14) return  this.$t('findBao.text17')
      },
      getBill () {
        this.$fetch.post('/tx/transactionlist', {
          page: this.pageIndex,
          pageSize: 20,
          orderType: 5
        }).then(res => {
          this.isShow = false
          if (res.success) {
            let _list = res.data
            if (_list.length) {
              this.billList.push(...res.data)
              this.pageIndex++
            } else {
              this.$refs.scroll.forceUpdate()
            }
          } else {
            this.toastD(res.data.msg)
          }
        })
      },
      onPullingUp() { // 触发上拉加载
        this.getBill()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .bill
    .v-content-wrapper
      position fixed
      margin-top: 0
      padding-top: 0
      top: 1.5rem
      bottom: 0
      width: 100%
      padding-bottom 10px
      ul
        .item
          display flex
          flex-direction row
          justify-content space-between
          margin-top .3rem
          padding-bottom .3rem
          border-1px-bottom(#F2F2F2)
          .inner-box
            display flex
            flex-direction row
            align-items center
            img
              width .8rem
              height .8rem
            .text
              line-height .4rem
              margin-left .2rem
              display flex
              flex-direction column
              .message
                font-size .32rem
              .timer
                font-size .24rem
                color #bfbfbf
          .money
            font-size .32rem
            &.changeColor
              color #b79961
</style>
