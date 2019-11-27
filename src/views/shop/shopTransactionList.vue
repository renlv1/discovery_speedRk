<template>
  <div class="wrapper">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="m-c">
      <cube-scroll
        v-show="list.length"
        ref="scroll"
        :options="options"
        :data="list"
        @pulling-up="onPullingDown">
        <ul class="ul-list ">
          <li class="li-items" @click="toOrderDetail(item.id)" v-for="(item,index) in list" :key="index">
            <div class="box hasBottomBorder">
              <div class="left" style="color: rgb(153,153,153)">
                <span>{{$t('sellShip.text15')}}: </span>
                <span>{{item.id}}</span>
              </div>
              <div class="right" style="color: rgb(255,182,75)">{{orderStatus(item.orderType)}}</div>
            </div>
            <div class="box">
              <span>{{$t('sellShip.text16')}} </span>
              <span style="color: rgb(153,153,153)">{{$changeDate(item.createAt)}}</span>
            </div>
            <div class="box">
              <span>{{$t('sellShip.text17')}}</span>
              <span style="color: rgb(153,153,153)">{{item.userPayTotal}}{{item.acceptCurrency === 'PAI' ? 'π' : item.acceptCurrency}} <span
                v-if="item.userPayTotalTwo !== 0">+ {{item.userPayTotalTwo}}π</span></span>
            </div>
            <div class="box">
              <span></span>
              <div>
                <span style="color: rgb(153,153,153)">{{$t('sellShip.text18')}} </span>
                <span style="color: rgb(255,182,75)">{{item.realReceiveAmount}}{{item.acceptCurrency === 'PAI' ? 'π' : item.acceptCurrency}} <span
                  v-if="item.userPayTotalTwo !== 0">+ {{item.userPayTotalTwo}}π</span></span>
              </div>
            </div>
          </li>
        </ul>
      </cube-scroll>
    </div>
    <div class="v-loading" v-show="!list.length">
      <cube-loading></cube-loading>
    </div>
    <div v-if="!list.length" class="empty">
      <img src="@/assets/img/common/empty.png" alt="">
      <p>{{$t('common.empty')}}</p>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'

export default {
  components: {mFixedTop},
  name: "shopTransactionList",
  data() {
    return {
      titleName: this.$t('sellShip.text19'),
      pageIndex: 1,
      loadShow: true,
      list: []
    }
  },
  mounted() {
    this.getList()
  },
  computed: {
    options() {
      return {
        pullUpLoad: {
          txt: {
            noMore: this.$t('common.noMore')
          }
        }
      }
    }
  },
  methods: {
    orderStatus(i) { //订单状态 1 待付款 2已付款 3已撤单 4 已发货 5完成 6退货中 7退货完成 8 待商家接单 9 商家已接单待发货 11 商家拒绝接单
      if (i === 1) return this.$t('payReturn.text51')
      if (i === 2) return this.$t('payReturn.text52')
      if (i === 3) return this.$t('addAddress.text67')
      if (i === 4) return this.$t('addAddress.text68')
      if (i === 5) return this.$t('payReturn.text73')
      if (i === 6) return this.$t('payReturn.text74')
      if (i === 7) return this.$t('payReturn.text75')
      if (i === 8) return this.$t('addAddress.text69')
      if (i === 9) return this.$t('addAddress.text70')
      if (i === 11) return this.$t('addAddress.text71')
    },
    toOrderDetail(id) {
      this.$router.push({
        path: '/shopTransactionListDetail',
        query: {
          orderId: id
        }
      })
    },
    getList() {
      // 8 待商家接单, 9 商家已接单待发货, 4 已发货, 5 完成
      this.$http.post(`${this.$api}shopMine/querySellOrder?orderType=2&pageIndex=${this.pageIndex}&pageSize=20`).then((res) => {
        this.loadShow = false
        const _list = res.data.data.list
        if (_list.length) {
          this.list.push(..._list)
          this.pageIndex++
        } else {
          this.$refs.scroll.forceUpdate()
        }
      })
    },
    onPullingDown() {
      this.getList(this.tabActive)
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .empty {
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    background none
  }
  .m-c
    height calc(100vh - 70px)
    background-color: #fff;
    .ul-list
      .li-items
        margin 15px .3rem
        padding .3rem .3rem 0
        background-color rgb(247, 247, 247)
        font-size .32rem
        display flex
        flex-direction column
        border-radius 5px
        .box
          display flex
          flex-direction row
          justify-content space-between
          margin-bottom 20px
        .hasBottomBorder
          padding-bottom 15px
          border-bottom 1px dotted #ccc
</style>
