<template>
  <div>
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="main-c">
      <div class="top">
        <p class="top-title">{{$t('sellShip.text20')}}</p>
        <p class="value">
          <span>{{obj.realReceiveAmount}}{{obj.acceptCurrency === 'PAI' ? 'π' : obj.acceptCurrency}} <span
            v-if="obj.userPayTotalTwo !== 0">+ {{obj.userPayTotalTwo}}π</span></span></p>
      </div>
      <div class="hasBg"></div>
      <ul>
        <li>
          <span>{{$t('sellShip.text21')}}</span>
          <span>{{orderStatus(obj.orderType)}}</span>
        </li>
        <li>
          <span>{{$t('sellShip.text22')}}</span>
          <span>{{obj.id}}</span>
        </li>
        <li>
          <span>{{$t('sellShip.text23')}}</span>
          <span>{{$changeDate(obj.createAt)}}</span>
        </li>
        <li v-if="obj.realname">
          <span>{{$t('sellShip.text24')}}</span>
          <span>{{obj.realname}}</span>
        </li>
        <li>
          <span>{{$t('sellShip.text25')}}</span>
          <span>{{obj.userPayTotal}}{{obj.acceptCurrency === 'PAI' ? 'π' : obj.acceptCurrency}} <span style="color: #000"
            v-if="obj.userPayTotalTwo !== 0">+ {{obj.userPayTotalTwo}}π</span></span>
        </li>
        <li>
          <span>{{$t('sellShip.text26')}}</span>
          <span>{{obj.productProfitRate}}%</span>
        </li>
        <li>
          <span>{{$t('sellShip.text27')}}</span>
          <span>{{obj.ecologyFee}}π</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'

export default {
  name: "shopTransactionListDetail",
  components: {
    mFixedTop
  },
  data() {
    return {
      titleName: this.$t('sellShip.text28'),
      obj: {}
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    orderStatus(i) { //1待付款 2撤单 3已完成 4待商家接单 5商家已接单待发货 6商家拒绝接单 7运输中
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
    getDetail() {
      let orderId = this.$route.query.orderId
      this.$http.post(`${this.$api}shopMine/querySellOrder?orderId=${orderId}`).then((res) => {
        this.obj = res.data.data.list[0]
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .main-c
    font-size .32rem
    display flex
    flex-direction column
    align-items center
    .top
      height 100px
      display flex
      flex-direction column
      justify-content center
      width 100%
      text-align center
      .top-title
        color rgb(153, 153, 153)
      .value
        font-size 16px
        font-weight bold
        color rgb(255, 182, 75)
        margin-top 15px
    .hasBg
      height 15px
      width 100%
      background-color rgb(247, 247, 247)
    ul
      width 100%
      margin-top 30px
      padding 0 .3rem
      li
        height 1rem
        line-height 1rem
        margin-bottom 15px
        width 100%
        display flex
        justify-content space-between
        border-bottom 1px solid #eee
        span
          &:first-child {
            color rgb(153, 153, 153)
          }
</style>
