<template>
  <div>
    <m-fixed-top :titleName="titleName" :isGoBack="isGoBack"></m-fixed-top>
    <div class="v-content-wrapper">
      <div class="top">
        <p class="tip">{{this.$t('fund.text95')}}</p>
        <p class="money">{{$route.query.money}}</p>
      </div>
      <div class="value-wrapper">
        <div class="value-left">
          <p class="value">{{value}}</p>
          <p class="value-text">{{this.$t('fund.text96')}}</p>
        </div>
        <div class="value-right">
          <p class="value">{{addValue}}</p>
          <p class="value-text">{{this.$t('fund.text97')}}</p>
        </div>
      </div>
      <ul>
        <li @click="toDetail(0)">
          <p>{{this.$t('fund.text98')}}</p>
          <img src="./images/row.png" />
        </li>
        <li @click="toDetail(1)">
          <p>{{$t('fund.text99')}}</p>
          <img src="./images/row.png" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {getFundBalance} from '@/api/fund'

export default {
  components: {mFixedTop},
  name: "fundDetail",
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('fund.text100'),
      value: '',
      addValue: ''
    }
  },
  mounted() {
    this.getBalance()
  },
  methods: {
    toDetail(type) {
      if (type === 0) {
        this.$router.push('/addDetail')
      } else {
        this.$router.push({
          path: '/order',
          query: {
            flag: 1
          }
        })
      }
    },
    getBalance() {
      getFundBalance().then((res) => {
        this.value = res.data.data.fundBuyBalance
        this.addValue = res.data.data.fundPresentBalance
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../assets/css/mixin.styl"
  .v-content-wrapper
    padding-top 0
    padding-bottom 0
    .top
      padding-bottom .4rem
      .money
        font-size .5rem
      .tip
        margin-bottom .24rem
        font-size .28rem
        color #999
    .value-wrapper
      display flex
      flex-direction row
      justify-content space-between
      .value-left, .value-right
        font-size .28rem
        width 48%
        display flex
        justify-content center
        flex-direction column
        height 1.4rem
        align-items center
        border-radius 4px
        .value
          margin-bottom .14rem
          color #b79961
        .value-text
          text-align center
      .value-left
        background-color #e6faf8
      .value-right
        background-color #fbf5e7
    ul
      margin-top .6rem
      li
        margin-top: .4rem;
        height 1rem
        display flex
        flex-direction row
        align-items center
        justify-content space-between
        border-bottom 1px solid #ccc
        p
          font-size .28rem
        img
          width .28rem
          height .28rem
</style>
