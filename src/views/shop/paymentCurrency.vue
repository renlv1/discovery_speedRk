<template>
  <div class="paymentCurrency-w main-container">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="wrap">
      <ul class="uls">
        <li class="item-currency"
            v-for="(item, index) in currencyData" :key="index"
            @click="switchOne(index, item)"
            :class="{'active': activeIndex === index}">
          <span>{{item === 'PAI' ? 'π' : item}}</span>
          <div class="right"></div>
        </li>
      </ul>
      <p class="tips">{{$t('hiddenSetting.text58')}}</p>
    </div>
    <div class="tip-a" v-show="msg">{{msg}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
import mFixedTop from '@/components/mFixedTop'
export default {
  components: {mFixedTop},
  data() {
    return {
      titleName: this.$t('addAddress.text74'),
      msg: '',
      activeIndex: 0,
      currencyData: ['USD', 'PAI']
    }
  },
  created () {
    this.getDetials()
  },
  methods: {
    switchOne(index, item) {
      this.activeIndex = index
      this.$http.post(`${this.$api}shopMine/modifyMerchantAcceptCurrency?currency=${item}`).then(res => {
        if (res.data.data.acceptCurrency) {
          this.toastD(this.$t('hiddenSetting.text59'))
        } else {
          this.toastD(res.data.msg)
        }
      })
    },
    getDetials () {
      this.$http.post(`${this.$api}shopMine/getMerchantInfo`).then(res => {
        if (res.data.status === 'success') {
          let acceptCurrency = res.data.data.merchantInfo.acceptCurrency
          this.currencyData.forEach((item, index) => {
            if (item === acceptCurrency) {
              this.activeIndex = index
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  .paymentCurrency-w
    background-color: #fff
    font-size .32rem
    .tip-a
      position: fixed
      bottom: 1rem
      left: 50%
      transform translateX(-50%)
      background-color: rgba(0,0,0,0.5)
      font-size: .28rem
      color #fff
      padding: .2rem
      border-radius 8px
      max-width 80%
    .wrap
      .uls
        .item-currency
          padding: 0 .3rem
          height: 1rem
          display: flex
          align-items center
          justify-content space-between
          color #060f26
          border-bottom: 1px solid #edeef0
          &.active
            color rgb(255, 182, 75);
            .right
              border: .02rem solid rgb(255, 182, 75);
              &::before
                content ''
                display: block
                width: .16rem
                height: .16rem
                border-radius 50%
                background-color: rgb(255, 182, 75);
          .right
            display: flex
            align-items center
            justify-content center
            width: .32rem
            height: .32rem
            border-radius 50%
            border: .02rem solid #e5e5e5
      .tips
        padding: .2rem .3rem 0 .3rem
        font-size: .24rem
        line-height: 1.5
        color rgb(255, 182, 75);
</style>

